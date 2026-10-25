<?php

namespace App\Services;

use App\Mail\NewOrderNotification;
use App\Mail\OrderConfirmation;
use App\Models\Order;
use App\Models\ProductVariant;
use App\Models\Setting;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class OrderService
{
    /**
     * Legt eine Bestellung an und reserviert den Lagerbestand.
     *
     * @param  array<int, array{variant_id:int, quantity:int}>  $items
     */
    public function create(array $data, array $items, ?User $user, string $source = 'online'): Order
    {
        $lowStock = [];
        $order = DB::transaction(function () use ($data, $items, $user, $source, &$lowStock) {
            $lines = [];
            $subtotal = 0;
            $discountTotal = 0;
            $variants = [];

            foreach ($items as $item) {
                /** @var ProductVariant|null $variant */
                $variant = ProductVariant::query()->with('product')->lockForUpdate()->find($item['variant_id']);
                if (! $variant || ! $variant->active || $variant->price <= 0 || ! $variant->product->active || $variant->product->price_on_request) {
                    throw ValidationException::withMessages(['items' => 'Ein Artikel im Warenkorb ist nicht mehr bestellbar. Bitte prüfen Sie Ihren Warenkorb.']);
                }
                if ($variant->stock < $item['quantity']) {
                    throw ValidationException::withMessages(['items' => "Von «{$variant->product->name} ({$variant->label})» sind nur noch {$variant->stock} Stück verfügbar."]);
                }
                if ($variant->pickup_only && $data['delivery_method'] === 'lieferung') {
                    throw ValidationException::withMessages(['delivery_method' => "«{$variant->product->name} ({$variant->label})» kann nur in Ebersecken abgeholt werden. Bitte wählen Sie Abholung."]);
                }
                $variant->decrement('stock', $item['quantity']);
                $variants[] = $variant;
                if ($variant->stock < (int) Setting::get('low_stock_threshold') && ! $variant->low_stock_notified_at) {
                    $lowStock[] = $variant;
                }

                // Mengenrabatt je Position, z. B. ab 50 Stück 10 %
                $percent = $variant->product->discountFor((int) $item['quantity']);
                $unit = (int) round($variant->price * (100 - $percent) / 100 / 5) * 5;
                $lineTotal = $unit * $item['quantity'];
                $subtotal += $lineTotal;
                $discountTotal += ($variant->price - $unit) * $item['quantity'];
                $lines[] = [
                    'product_variant_id' => $variant->id,
                    'product_name' => $variant->product->name,
                    'variant_label' => $variant->label,
                    'unit_price' => $unit,
                    'list_price' => $variant->price,
                    'discount_percent' => $percent,
                    'quantity' => $item['quantity'],
                    'line_total' => $lineTotal,
                ];
            }

            $shipping = array_key_exists('shipping_override', $data) && $data['shipping_override'] !== null
                ? (int) $data['shipping_override']
                : ($data['delivery_method'] === 'lieferung' ? self::shippingFor($subtotal, $variants) : 0);

            $order = Order::query()->create([
                'number' => self::nextNumber(),
                'access_token' => Str::random(48),
                'source' => $source,
                'user_id' => $user?->id,
                'status' => $data['status'] ?? 'neu',
                'payment_method' => $data['payment_method'],
                'payment_status' => $data['payment_method'] === 'stripe' ? 'ausstehend' : 'offen',
                'delivery_method' => $data['delivery_method'],
                'name' => $data['name'],
                'email' => $data['email'] ?? null,
                'phone' => $data['phone'] ?? null,
                'street' => $data['street'] ?? null,
                'postal_code' => $data['postal_code'] ?? null,
                'city' => $data['city'] ?? null,
                'note' => $data['note'] ?? null,
                'preferred_date' => $data['preferred_date'] ?? null,
                'preferred_slot' => $data['preferred_slot'] ?? null,
                'scheduled_date' => $data['scheduled_date'] ?? null,
                'scheduled_slot' => $data['scheduled_slot'] ?? null,
                'confirmed_at' => ($data['status'] ?? 'neu') === 'bestaetigt' ? now() : null,
                'subtotal' => $subtotal,
                'discount_total' => $discountTotal,
                'shipping' => $shipping,
                'total' => $subtotal + $shipping,
            ]);
            $order->items()->createMany($lines);

            return $order->load('items');
        });

        $this->notifyLowStock($lowStock);

        return $order;
    }

    /**
     * Versandkosten: Es zählt die teuerste Versandklasse im Warenkorb,
     * ab dem Gratis-Bestellwert (falls gesetzt) ist die Lieferung gratis.
     *
     * @param  iterable<ProductVariant>  $variants
     */
    public static function shippingFor(int $subtotal, iterable $variants): int
    {
        $free = (int) Setting::get('free_delivery_from');
        if ($free > 0 && $subtotal >= $free) {
            return 0;
        }

        $max = 0;
        foreach ($variants as $variant) {
            $max = max($max, (int) $variant->effectiveShippingClass()?->price);
        }

        return $max;
    }

    public static function nextNumber(): string
    {
        $prefix = 'PF-'.now()->year.'-';
        $last = Order::query()->where('number', 'like', $prefix.'%')->orderByDesc('id')->value('number');
        $next = $last ? ((int) substr($last, strlen($prefix))) + 1 : 1;

        return $prefix.str_pad((string) $next, 4, '0', STR_PAD_LEFT);
    }

    /** Hinweis ans Team, wenn eine Grösse unter die Lager-Warngrenze fällt (einmal pro Unterschreitung). */
    private function notifyLowStock(array $variants): void
    {
        $variants = collect($variants)->unique('id')->filter(fn ($v) => ! $v->fresh()->low_stock_notified_at);
        if ($variants->isEmpty() || ! ($to = Setting::get('notify_email'))) {
            return;
        }
        ProductVariant::query()->whereKey($variants->pluck('id'))->update(['low_stock_notified_at' => now()]);
        Mail::to($to)->send(new \App\Mail\LowStockAlert($variants->map->fresh()->all()));
    }

    /** Bestätigungsmail an Kundschaft und Hinweis ans Team. */
    public function sendPlacedMails(Order $order): void
    {
        $order->mailCustomer(new OrderConfirmation($order));
        if ($notify = Setting::get('notify_email')) {
            Mail::to($notify)->send(new NewOrderNotification($order));
        }
    }

    public function markPaid(Order $order, ?string $paymentIntent = null): void
    {
        if ($order->payment_status === 'bezahlt') {
            return;
        }
        $order->update(array_filter(['payment_status' => 'bezahlt', 'paid_at' => now(), 'stripe_payment_intent' => $paymentIntent]));
        $this->sendPlacedMails($order);
    }

    /**
     * Storniert, gibt den reservierten Bestand frei (nur einmal) und erstattet auf Wunsch bereits bezahlte Beträge:
     * Stripe-Zahlungen automatisch, Rechnung/Bar mit Gutschrift zur manuellen Rückzahlung.
     */
    public function cancel(Order $order, ?string $paymentStatus = null, bool $refund = false, string $by = 'admin'): void
    {
        DB::transaction(function () use ($order, $paymentStatus, $by) {
            $order->refresh();
            if (! $order->stock_released) {
                foreach ($order->items as $item) {
                    if ($item->product_variant_id) {
                        ProductVariant::query()->whereKey($item->product_variant_id)->increment('stock', $item->quantity);
                    }
                }
            }
            $order->update(array_filter([
                'status' => 'storniert',
                'cancelled_at' => $order->cancelled_at ?? now(),
                'cancelled_by' => $order->cancelled_by ?? $by,
                'stock_released' => true,
                'payment_status' => $paymentStatus,
            ], fn ($v) => $v !== null));
        });

        if ($refund && $order->fresh()->payment_status === 'bezahlt') {
            $this->refund($order->fresh());
        }
    }

    /** Erstattet den vollen Betrag und verschickt eine Gutschrift. */
    public function refund(Order $order): void
    {
        if ($order->refunded_at) {
            return;
        }
        if ($order->payment_method === 'stripe') {
            app(StripeCheckout::class)->refund($order);
        }
        $order->update(['payment_status' => 'erstattet', 'refund_amount' => $order->total, 'refunded_at' => now()]);
        $order->mailCustomer(new \App\Mail\CreditNoteMail($order->fresh('items')));
    }
}
