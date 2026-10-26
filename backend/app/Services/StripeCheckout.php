<?php

namespace App\Services;

use App\Models\Order;
use Stripe\StripeClient;

class StripeCheckout
{
    public function client(): StripeClient
    {
        return new StripeClient((string) config('services.stripe.secret'));
    }

    /** test | live | null (kein Schlüssel) – erkennbar am Präfix sk_test_ / sk_live_ bzw. rk_… */
    public static function keyMode(?string $key = null): ?string
    {
        $key = (string) ($key ?? config('services.stripe.secret'));

        return match (true) {
            $key === '' => null,
            (bool) preg_match('/^(sk|rk)_test_/', $key) => 'test',
            (bool) preg_match('/^(sk|rk)_live_/', $key) => 'live',
            default => 'unbekannt',
        };
    }

    /** Auf der Testseite nur Testschlüssel, auf der echten Website nur Live-Schlüssel. */
    public static function keyProblem(?string $key = null): ?string
    {
        $mode = self::keyMode($key);
        $test = (bool) config('pflanzfarm.test_mode');

        return match (true) {
            $mode === null => 'Kein Stripe-Schlüssel hinterlegt (STRIPE_SECRET).',
            $mode === 'unbekannt' => 'Der Stripe-Schlüssel hat ein unbekanntes Format (erwartet sk_test_… oder sk_live_…).',
            $test && $mode === 'live' => 'Auf der Testseite (PFLANZFARM_TEST_MODE=true) sind nur Stripe-Testschlüssel (sk_test_…) erlaubt.',
            default => null,
        };
    }

    protected function sendSession(array $params): \Stripe\Checkout\Session
    {
        return $this->client()->checkout->sessions->create($params);
    }

    /** Session mit den gewünschten Zahlungsarten; ist TWINT im Stripe-Konto (noch) nicht aktiv, nur mit Karte. */
    private function createWithFallback(array $params): \Stripe\Checkout\Session
    {
        try {
            return $this->sendSession($params);
        } catch (\Stripe\Exception\InvalidRequestException $e) {
            // Von Stripe abgelehnte E-Mail (z. B. Testadresse @…test): ohne vorausgefüllte E-Mail erneut versuchen
            if ($e->getStripeParam() === 'customer_email' && isset($params['customer_email'])) {
                report($e);
                unset($params['customer_email']);

                return $this->createWithFallback($params);
            }
            $methods = $params['payment_method_types'] ?? [];
            if (count($methods) > 1 && in_array('card', $methods, true) && str_contains(strtolower($e->getMessage()), 'payment method')) {
                report($e);

                return $this->sendSession(['payment_method_types' => ['card']] + $params);
            }
            throw $e;
        }
    }

    /**
     * Abgleich direkt bei Stripe, falls ein Webhook nicht ankommt (z. B. Webhook noch nicht eingerichtet):
     * bezahlt → als bezahlt markieren, abgelaufen → stornieren und Bestand freigeben.
     */
    public function sync(Order $order): void
    {
        $sessionId = (string) $order->stripe_session_id;
        if ($order->payment_status !== 'ausstehend' || $sessionId === '' || str_starts_with($sessionId, 'test_') || config('pflanzfarm.fake_payments')) {
            return;
        }
        $session = $this->retrieveSession($sessionId);
        $orders = app(OrderService::class);
        if (($session->payment_status ?? null) === 'paid') {
            $orders->markPaid($order, $session->payment_intent ?? null);
        } elseif (($session->status ?? null) === 'expired') {
            $orders->cancel($order, 'abgebrochen');
        }
    }

    /** Erstellt eine Stripe-Checkout-Session (Karte und TWINT) und gibt die Zahlungs-URL zurück. */
    public function createSession(Order $order): string
    {
        if (config('pflanzfarm.fake_payments')) {
            // Testumgebung ohne Stripe-Konto: eigene Testseite simuliert die Zahlung
            $order->update(['stripe_session_id' => 'test_'.$order->number]);

            return '/test-zahlung/'.$order->number.'?t='.$order->access_token;
        }
        if ($problem = self::keyProblem()) {
            throw new \RuntimeException($problem);
        }

        $lines = $order->items->map(fn ($item) => [
            'quantity' => $item->quantity,
            'price_data' => [
                'currency' => 'chf',
                'unit_amount' => $item->unit_price,
                'product_data' => ['name' => $item->product_name.' ('.$item->variant_label.')'],
            ],
        ])->all();
        if ($order->shipping > 0) {
            $lines[] = ['quantity' => 1, 'price_data' => ['currency' => 'chf', 'unit_amount' => $order->shipping, 'product_data' => ['name' => 'Lieferung']]];
        }
        if ($order->planting_fee > 0) {
            $lines[] = ['quantity' => 1, 'price_data' => ['currency' => 'chf', 'unit_amount' => $order->planting_fee, 'product_data' => ['name' => 'Pflanzservice']]];
        }
        // Stripe kennt keine negativen Positionen: mit Gutschein eine Sammelzeile über den Restbetrag
        if ($order->coupon_discount > 0) {
            $lines = [['quantity' => 1, 'price_data' => ['currency' => 'chf', 'unit_amount' => $order->total,
                'product_data' => ['name' => 'Bestellung '.$order->number.' (abzüglich '.$order->coupon_code.')']]]];
        }

        $base = rtrim(config('app.url'), '/');
        $session = $this->createWithFallback([
            'mode' => 'payment',
            'payment_method_types' => config('services.stripe.methods'),
            'line_items' => $lines,
            'customer_email' => $order->email,
            'client_reference_id' => $order->number,
            'metadata' => ['order_number' => $order->number],
            'locale' => 'de',
            'expires_at' => now()->addMinutes(60)->timestamp,
            'success_url' => $base.'/bestellung/danke/?nr='.urlencode($order->number).'&t='.$order->access_token,
            'cancel_url' => $base.'/warenkorb/?zahlung=abgebrochen',
        ]);

        $order->update(['stripe_session_id' => $session->id]);

        return $session->url;
    }

    public function retrieveSession(string $id): object
    {
        return $this->client()->checkout->sessions->retrieve($id);
    }

    /** Erstattet eine Stripe-Zahlung vollständig (Karte oder TWINT). */
    public function refund(Order $order): void
    {
        if (config('pflanzfarm.fake_payments') || str_starts_with((string) $order->stripe_session_id, 'test_')) {
            return; // simulierte Zahlung in der Testumgebung
        }
        $intent = $order->stripe_payment_intent;
        if (! $intent && $order->stripe_session_id) {
            $intent = $this->retrieveSession($order->stripe_session_id)->payment_intent;
        }
        if (! $intent) {
            throw new \RuntimeException('Zu dieser Bestellung ist keine Stripe-Zahlung hinterlegt.');
        }
        $this->client()->refunds->create(['payment_intent' => $intent]);
    }
}
