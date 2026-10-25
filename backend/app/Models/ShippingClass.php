<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ShippingClass extends Model
{
    protected $guarded = ['id'];

    protected function casts(): array
    {
        return ['price' => 'integer', 'is_default' => 'boolean'];
    }

    public function variants(): HasMany
    {
        return $this->hasMany(ProductVariant::class);
    }

    public static function default(): ?self
    {
        return static::query()->where('is_default', true)->first() ?? static::query()->orderBy('sort')->first();
    }

    protected static function booted(): void
    {
        // Es gibt immer genau eine Standardklasse
        static::saved(function (self $class) {
            if ($class->is_default) {
                static::query()->whereKeyNot($class->id)->where('is_default', true)->update(['is_default' => false]);
            }
        });
    }
}
