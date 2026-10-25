<?php

namespace App\Services;

use App\Mail\BackInStock;
use App\Models\ProductVariant;
use App\Models\StockAlert;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;

/** Warteliste «Benachrichtigen, wenn wieder da». */
class StockAlerts
{
    public function subscribe(ProductVariant $variant, string $email): StockAlert
    {
        $alert = StockAlert::query()->firstOrNew(['product_variant_id' => $variant->id, 'email' => strtolower($email)]);
        $alert->token ??= Str::random(40);
        $alert->notified_at = null;
        $alert->save();

        return $alert;
    }

    /** Alle Wartenden einer Grösse informieren, sobald sie wieder an Lager ist. */
    public function notify(ProductVariant $variant): int
    {
        if (! $variant->active || ! $variant->product?->active) {
            return 0;
        }
        $alerts = StockAlert::query()->where('product_variant_id', $variant->id)->whereNull('notified_at')->get();
        foreach ($alerts as $alert) {
            Mail::to($alert->email)->queue(new BackInStock($variant->loadMissing('product'), $alert));
            $alert->update(['notified_at' => now()]);
        }

        return $alerts->count();
    }
}
