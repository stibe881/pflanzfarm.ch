<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ProductVariant extends Model
{
    protected $guarded = ['id'];

    protected function casts(): array
    {
        return ['active' => 'boolean', 'price' => 'integer', 'stock' => 'integer', 'pickup_only' => 'boolean'];
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
