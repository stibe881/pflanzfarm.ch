<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ProductVariant extends Model
{
    protected $guarded = ['id'];

    protected function casts(): array
    {
        return ['active' => 'boolean', 'price' => 'integer', 'stock' => 'integer', 'pickup_only' => 'boolean', 'low_stock_notified_at' => 'datetime'];
    }

    protected static function booted(): void
    {
        // Lager-Warnung wieder scharf stellen, sobald der Bestand aufgefüllt ist
        static::saving(function (self $v) {
            if ($v->isDirty('stock') && $v->low_stock_notified_at && $v->stock >= (int) Setting::get('low_stock_threshold')) {
                $v->low_stock_notified_at = null;
            }
        });
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
