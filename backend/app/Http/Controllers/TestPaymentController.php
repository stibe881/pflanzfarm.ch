<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Services\OrderService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

/** Simulierte Zahlungsseite für die Testumgebung (STRIPE_FAKE=true). */
class TestPaymentController extends Controller
{
    public function show(Request $request, string $number): Response
    {
        $order = $this->order($request, $number);
        $amount = number_format($order->total / 100, 2, '.', "'");
        $token = e($request->query('t'));
        $csrf = csrf_token();

        return response(<<<HTML
            <!doctype html><html lang="de-CH"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
            <title>Testzahlung</title><style>body{font-family:system-ui,sans-serif;background:#f3f0e8;color:#153c31;display:grid;place-items:center;min-height:100vh;margin:0}
            main{background:#fff;padding:32px;border-radius:10px;max-width:420px;box-shadow:0 18px 45px #12372d1f}button{width:100%;padding:14px;margin-top:10px;border:0;border-radius:6px;font-weight:700;font-size:1rem;cursor:pointer}
            .ok{background:#153c31;color:#fff}.no{background:#edf2eb;color:#153c31}small{color:#4b6a5d}</style></head><body><main>
            <small>TESTUMGEBUNG – keine echte Zahlung</small><h1>Zahlung simulieren</h1>
            <p>Bestellung <b>{$order->number}</b><br>Betrag: <b>CHF {$amount}</b></p>
            <form method="post" action="/test-zahlung/{$order->number}?t={$token}"><input type="hidden" name="_token" value="{$csrf}">
            <button class="ok" name="result" value="paid">Zahlung erfolgreich (wie Karte/TWINT)</button>
            <button class="no" name="result" value="cancel">Zahlung abbrechen</button></form></main></body></html>
            HTML);
    }

    public function complete(Request $request, string $number, OrderService $orders): RedirectResponse
    {
        $order = $this->order($request, $number);
        if ($request->input('result') === 'paid') {
            $orders->markPaid($order);

            return redirect('/bestellung/danke/?nr='.urlencode($order->number).'&t='.$order->access_token);
        }
        $orders->cancel($order, 'abgebrochen');

        return redirect('/warenkorb/?zahlung=abgebrochen');
    }

    private function order(Request $request, string $number): Order
    {
        abort_unless(config('pflanzfarm.fake_payments'), 404);
        $order = Order::query()->where('number', $number)->where('payment_method', 'stripe')->firstOrFail();
        abort_unless(hash_equals($order->access_token, (string) $request->query('t')), 404);
        abort_if($order->payment_status !== 'ausstehend', 410, 'Diese Zahlung ist bereits abgeschlossen.');

        return $order;
    }
}
