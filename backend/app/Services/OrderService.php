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
    public function create(array $data, array $items, ?User $user): Order
    {
        return DB::transaction(function () use ($data, $items, $user) {
            $lines = [];
            $subtotal = 0;

            foreach ($items as $item) {
                /** @var ProductVariant|null $variant */
                $variant = ProductVariant::query()->with('product')->lockForUpdate()->find($item['variant_id']);
                if (! $variant || ! $variant->active || $variant->price <= 0 || ! $variant->product->active || $variant->product->price_on_request) {
                    throw ValidationException::withMessages(['items' => 'Ein Artikel im Warenkorb ist nicht mehr bestellbar. Bitte prüfen Sie Ihren Warenkorb.']);
                }
                if ($variant->stock < $item['quantity']) {
                    throw ValidationException::withMessages(['items' => "Von «{$variant->product->name} ({$variant->label})» sind nur noch {$variant->stock} Stück verfügbar."]);
                }
                $variant->decrement('stock', $item['quantity']);
                $lineTotal = $variant->price * $item['quantity'];
                $subtotal += $lineTotal;
                $lines[] = [
                    'product_variant_id' => $variant->id,
                    'product_name' => $variant->product->name,
                    'variant_label' => $variant->label,
                    'unit_price' => $variant->price,
                    'quantity' => $item['quantity'],
                    'line_total' => $lineTotal,
                ];
            }

            $shipping = $data['delivery_method'] === 'lieferung' ? self::shippingFor($subtotal) : 0;

            $order = Order::query()->create([
                'number' => self::nextNumber(),
                'access_token' => Str::random(48),
                'user_id' => $user?->id,
                'status' => 'neu',
                'payment_method' => $data['payment_method'],
                'payment_status' => $data['payment_method'] === 'stripe' ? 'ausstehend' : 'offen',
                'delivery_method' => $data['delivery_method'],
                'name' => $data['name'],
                'email' => $data['email'],
                'phone' => $data['phone'] ?? null,
                'street' => $data['street'] ?? null,
                'postal_code' => $data['postal_code'] ?? null,
                'city' => $data['city'] ?? null,
                'note' => $data['note'] ?? null,
                'subtotal' => $subtotal,
                'shipping' => $shipping,
                'total' => $subtotal + $shipping,
            ]);
            $order->items()->createMany($lines);

            return $order->load('items');
        });
    }

    public static function shippingFor(int $subtotal): int
    {
        $free = (int) Setting::get('free_delivery_from');

        return $free > 0 && $subtotal >= $free ? 0 : (int) Setting::get('delivery_fee');
    }

    public static function nextNumber(): string
    {
        $prefix = 'PF-'.now()->year.'-';
        $last = Order::query()->where('number', 'like', $prefix.'%')->orderByDesc('id')->value('number');
        $next = $last ? ((int) substr($last, strlen($prefix))) + 1 : 1;

        return $prefix.str_pad((string) $next, 4, '0', STR_PAD_LEFT);
    }

    /** Bestätigungsmail an Kundschaft und Hinweis ans Team. */
    public function sendPlacedMails(Order $order): void
    {
        Mail::to($order->email)->send(new OrderConfirmation($order));
        if ($notify = Setting::get('notify_email')) {
            Mail::to($notify)->send(new NewOrderNotification($order));
        }
    }

    public function markPaid(Order $order): void
    {
        if ($order->payment_status === 'bezahlt') {
            return;
        }
        $order->update(['payment_status' => 'bezahlt', 'paid_at' => now()]);
        $this->sendPlacedMails($order);
    }

    /** Storniert und gibt den reservierten Bestand frei (nur einmal). */
    public function cancel(Order $order, string $paymentStatus = null): void
    {
        DB::transaction(function () use ($order, $paymentStatus) {
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
                'stock_released' => true,
                'payment_status' => $paymentStatus,
            ], fn ($v) => $v !== null));
        });
    }
}
