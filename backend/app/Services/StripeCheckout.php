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

    /** Erstellt eine Stripe-Checkout-Session (Karte und TWINT) und gibt die Zahlungs-URL zurück. */
    public function createSession(Order $order): string
    {
        if (config('pflanzfarm.fake_payments')) {
            // Testumgebung ohne Stripe-Konto: eigene Testseite simuliert die Zahlung
            $order->update(['stripe_session_id' => 'test_'.$order->number]);

            return '/test-zahlung/'.$order->number.'?t='.$order->access_token;
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

        $base = rtrim(config('app.url'), '/');
        $session = $this->client()->checkout->sessions->create([
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
}
