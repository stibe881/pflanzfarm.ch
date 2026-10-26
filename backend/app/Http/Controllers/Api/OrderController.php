<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Mail\NewsletterConfirmation;
use App\Models\NewsletterSubscriber;
use App\Models\Order;
use App\Models\Setting;
use App\Services\InvoicePdf;
use App\Services\OrderService;
use App\Services\StripeCheckout;
use App\Support\SafeMail;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Carbon;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;
use Throwable;

class OrderController extends Controller
{
    public function __construct(private OrderService $orders, private StripeCheckout $stripe) {}

    public function store(Request $request): JsonResponse
    {
        $methods = ['stripe'];
        if (Setting::get('invoice_enabled')) {
            $methods[] = 'invoice';
        }
        if (Setting::get('cash_enabled')) {
            $methods[] = 'cash';
        }

        $data = $request->validate([
            'items' => ['required', 'array', 'min:1', 'max:50'],
            'items.*.variant_id' => ['required', 'integer'],
            'items.*.quantity' => ['required', 'integer', 'min:1', 'max:999'],
            'name' => ['required', 'string', 'max:120'],
            'email' => ['required', 'email:rfc', 'max:160'],
            'phone' => ['required', 'string', 'max:40'],
            'delivery_method' => ['required', Rule::in(['lieferung', 'abholung'])],
            'street' => ['required_if:delivery_method,lieferung', 'nullable', 'string', 'max:160'],
            'postal_code' => ['required_if:delivery_method,lieferung', 'nullable', 'string', 'max:12'],
            'city' => ['required_if:delivery_method,lieferung', 'nullable', 'string', 'max:120'],
            'payment_method' => ['required', Rule::in($methods)],
            'note' => ['nullable', 'string', 'max:2000'],
            'preferred_date' => ['nullable', 'date', 'after_or_equal:'.today()->addDays(2)->toDateString(), 'before:'.today()->addMonths(6)->toDateString()],
            'preferred_slot' => ['nullable', Rule::in(array_keys(Order::SLOTS))],
            'planting' => ['boolean'],
            'coupon_code' => ['nullable', 'string', 'max:40'],
            'accept_terms' => ['accepted'],
            'newsletter' => ['boolean'],
        ], [
            'accept_terms.accepted' => 'Bitte akzeptieren Sie die AGB.',
            'street.required_if' => 'Bitte geben Sie die Lieferadresse an.',
            'postal_code.required_if' => 'Bitte geben Sie die PLZ an.',
            'city.required_if' => 'Bitte geben Sie den Ort an.',
            'preferred_date.after_or_equal' => 'Der Wunschtermin muss mindestens zwei Tage in der Zukunft liegen.',
            'preferred_date.before' => 'Der Wunschtermin darf höchstens sechs Monate in der Zukunft liegen.',
        ]);
        // Wochenenden: kein Liefer-/Abholtermin
        if (! empty($data['preferred_date']) && Carbon::parse($data['preferred_date'])->isSunday()) {
            throw ValidationException::withMessages(['preferred_date' => 'Am Sonntag liefern wir nicht und haben geschlossen. Bitte wählen Sie einen anderen Tag.']);
        }

        if ($data['payment_method'] === 'cash' && $data['delivery_method'] !== 'abholung') {
            throw ValidationException::withMessages(['payment_method' => 'Barzahlung ist nur bei Abholung möglich.']);
        }

        // Gleiche Variante mehrfach im Warenkorb zusammenfassen
        $items = collect($data['items'])->groupBy('variant_id')
            ->map(fn ($g, $id) => ['variant_id' => (int) $id, 'quantity' => (int) $g->sum('quantity')])->values()->all();

        $order = $this->orders->create($data, $items, $request->user());

        if ($request->boolean('newsletter')) {
            $sub = NewsletterSubscriber::query()->firstOrNew(['email' => strtolower($data['email'])]);
            if ($sub->status !== 'bestaetigt') {
                $sub->fill(['status' => 'ausstehend', 'source' => 'bestellung'])->save();
                SafeMail::send($sub->email, new NewsletterConfirmation($sub));
            }
        }

        // Vollständig mit Gutschein bezahlt: keine Zahlung nötig
        if ($order->payment_method === 'stripe' && $order->total === 0) {
            $this->orders->markPaid($order);

            return response()->json(['order' => self::summary($order), 'token' => $order->access_token], 201);
        } elseif ($order->payment_method === 'stripe') {
            try {
                $url = $this->stripe->createSession($order);
            } catch (Throwable $e) {
                report($e);
                $this->orders->cancel($order, 'abgebrochen');
                throw ValidationException::withMessages(['payment_method' => 'Die Online-Zahlung ist im Moment nicht verfügbar. Bitte wählen Sie eine andere Zahlungsart oder versuchen Sie es später erneut.']);
            }

            return response()->json(['redirect' => $url, 'order' => self::summary($order)], 201);
        }

        $this->orders->sendPlacedMails($order);

        return response()->json(['order' => self::summary($order), 'token' => $order->access_token], 201);
    }

    /** Bestellübersicht für die Danke-Seite (per Token) oder das Kundenkonto. */
    public function show(Request $request, string $number): JsonResponse
    {
        $order = $this->authorized($request, $number);
        // Danke-Seite: Zahlungsstand notfalls direkt bei Stripe abfragen (falls der Webhook verspätet ist)
        if ($order->payment_status === 'ausstehend') {
            try {
                $this->stripe->sync($order);
                $order->refresh();
            } catch (Throwable $e) {
                report($e);
            }
        }

        return response()->json(['order' => self::summary($order->load('items'))]);
    }

    public function invoice(Request $request, string $number, InvoicePdf $pdf): Response
    {
        $order = $this->authorized($request, $number);

        return response($pdf->render($order), 200, [
            'Content-Type' => 'application/pdf',
            'Content-Disposition' => 'inline; filename="'.$pdf->filename($order).'"',
        ]);
    }

    private function authorized(Request $request, string $number): Order
    {
        $order = Order::query()->where('number', $number)->firstOrFail();
        $owner = $request->user() && $order->user_id === $request->user()->id;
        $token = $request->query('t') && hash_equals($order->access_token, (string) $request->query('t'));
        abort_unless($owner || $token, 404);

        return $order;
    }

    public static function summary(Order $order): array
    {
        return [
            'number' => $order->number,
            'createdAt' => $order->created_at?->toIso8601String(),
            'status' => $order->status,
            'statusLabel' => $order->statusLabel(),
            'paymentMethod' => $order->payment_method,
            'paymentMethodLabel' => $order->paymentMethodLabel(),
            'paymentStatus' => $order->payment_status,
            'paymentStatusLabel' => $order->paymentStatusLabel(),
            'deliveryMethod' => $order->delivery_method,
            'deliveryMethodLabel' => $order->deliveryMethodLabel(),
            'subtotal' => $order->subtotal / 100,
            'shipping' => $order->shipping / 100,
            'total' => $order->total / 100,
            'discount' => $order->discount_total / 100,
            'couponCode' => $order->coupon_code,
            'couponDiscount' => $order->coupon_discount / 100,
            'planting' => $order->planting,
            'plantingFee' => $order->planting_fee / 100,
            'preferredDate' => $order->preferred_date?->toDateString(),
            'preferredSlot' => $order->preferred_slot,
            'scheduledDate' => $order->scheduled_date?->toDateString(),
            'scheduledSlot' => $order->scheduled_slot,
            'cancellable' => $order->isCancellableByCustomer(),
            'items' => $order->items->map(fn ($i) => [
                'name' => $i->product_name,
                'variant' => $i->variant_label,
                'quantity' => $i->quantity,
                'discountPercent' => $i->discount_percent,
                'total' => $i->line_total / 100,
            ]),
        ];
    }
}
