<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Product extends Model
{
    public const CATEGORIES = ['Heckenpflanzen' => 'Heckenpflanzen', 'Beerensträucher' => 'Beerensträucher', 'Baumschule' => 'Baumschule'];

    protected $guarded = ['id'];

    protected function casts(): array
    {
        return [
            'traits' => 'array',
            'gallery' => 'array',
            'volume_discounts' => 'array',
            'active' => 'boolean',
            'price_on_request' => 'boolean',
            'plants_per_meter' => 'float',
        ];
    }

    /** Mengenrabatt in Prozent für eine Stückzahl (höchste erreichte Stufe). */
    public function discountFor(int $quantity): int
    {
        $best = 0;
        foreach ((array) $this->volume_discounts as $tier) {
            if ($quantity >= (int) ($tier['min_qty'] ?? PHP_INT_MAX)) {
                $best = max($best, min(90, (int) ($tier['percent'] ?? 0)));
            }
        }

        return $best;
    }

    public function variants(): HasMany
    {
        return $this->hasMany(ProductVariant::class)->orderBy('sort')->orderBy('id');
    }

    public function activeVariants(): HasMany
    {
        return $this->variants()->where('active', true);
    }
}
