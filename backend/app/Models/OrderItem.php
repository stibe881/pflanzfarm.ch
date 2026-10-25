<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class OrderItem extends Model
{
    protected $guarded = ['id'];

    public function order(): BelongsTo
    {
        return $this->belongsTo(Order::class);
    }

    public function variant(): BelongsTo
    {
        return $this->belongsTo(ProductVariant::class, 'product_variant_id');
    }

    /** Absolute Bild-URL des Produkts für E-Mails. */
    public function imageUrl(): ?string
    {
        $image = $this->variant?->product?->image;

        return $image ? url(\App\Http\Controllers\Api\CatalogController::image($image)) : null;
    }
}
