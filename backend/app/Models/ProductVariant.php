<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ProductVariant extends Model
{
    protected $guarded = ['id'];

    protected function casts(): array
    {
        return ['active' => 'boolean', 'price' => 'integer', 'stock' => 'integer', 'pickup_only' => 'boolean', 'low_stock_notified_at' => 'datetime', 'planting_price' => 'integer', 'counted_at' => 'datetime'];
    }

    protected static function booted(): void
    {
        // Lager-Warnung wieder scharf stellen, sobald der Bestand aufgefüllt ist
        static::saving(function (self $v) {
            if ($v->isDirty('stock') && $v->low_stock_notified_at && $v->stock >= (int) Setting::get('low_stock_threshold')) {
                $v->low_stock_notified_at = null;
            }
        });
        // Wieder an Lager (auch durch Storno): Warteliste benachrichtigen
        static::updated(function (self $v) {
            if ($v->wasChanged('stock') && (int) $v->getOriginal('stock') <= 0 && $v->stock > 0) {
                app(\App\Services\StockAlerts::class)->notify($v);
            }
        });
    }

    public function stockAlerts(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(StockAlert::class);
    }

    /** Pflanzservice-Preis pro Stück: eigener Preis der Grösse, sonst Standard aus den Einstellungen. */
    public function effectivePlantingPrice(): int
    {
        return $this->planting_price ?? (int) Setting::get('planting_price_default');
    }

    public function shippingClass(): BelongsTo
    {
        return $this->belongsTo(ShippingClass::class);
    }

    /** Versandklasse der Grösse, sonst die Standardklasse. */
    public function effectiveShippingClass(): ?ShippingClass
    {
        return $this->shippingClass ?? ShippingClass::default();
    }

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }
}
