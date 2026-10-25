<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Services\OrderService;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Stripe\Exception\SignatureVerificationException;
use Stripe\Webhook;
use UnexpectedValueException;

class StripeWebhookController extends Controller
{
    public function __invoke(Request $request, OrderService $orders): Response
    {
        try {
            $event = Webhook::constructEvent($request->getContent(), (string) $request->header('Stripe-Signature'), (string) config('services.stripe.webhook_secret'));
        } catch (UnexpectedValueException|SignatureVerificationException) {
            return response('Ungültige Signatur', 400);
        }

        $session = $event->data->object;
        $order = Order::query()->where('stripe_session_id', $session->id ?? null)->first();
        if (! $order) {
            return response('ok');
        }

        match ($event->type) {
            'checkout.session.completed', 'checkout.session.async_payment_succeeded' => ($session->payment_status ?? null) === 'paid' ? $orders->markPaid($order, $session->payment_intent ?? null) : null,
            'checkout.session.expired', 'checkout.session.async_payment_failed' => $order->payment_status !== 'bezahlt' ? $orders->cancel($order, 'abgebrochen') : null,
            default => null,
        };

        return response('ok');
    }
}
