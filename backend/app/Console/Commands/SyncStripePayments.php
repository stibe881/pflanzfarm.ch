<?php

namespace App\Console\Commands;

use App\Models\Order;
use App\Services\StripeCheckout;
use Illuminate\Console\Command;
use Throwable;

class SyncStripePayments extends Command
{
    protected $signature = 'pflanzfarm:stripe-abgleich';

    protected $description = 'Offene Karten-/TWINT-Zahlungen mit Stripe abgleichen (Sicherheitsnetz, falls ein Webhook ausbleibt)';

    public function handle(StripeCheckout $stripe): int
    {
        $orders = Order::query()->where('payment_method', 'stripe')->where('payment_status', 'ausstehend')
            ->whereNotNull('stripe_session_id')->where('created_at', '<=', now()->subMinutes(15))->get();
        foreach ($orders as $order) {
            try {
                $stripe->sync($order);
            } catch (Throwable $e) {
                report($e);
            }
        }

        return self::SUCCESS;
    }
}
