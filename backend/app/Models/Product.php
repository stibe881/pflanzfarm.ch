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
            'active' => 'boolean',
            'price_on_request' => 'boolean',
            'plants_per_meter' => 'float',
        ];
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
