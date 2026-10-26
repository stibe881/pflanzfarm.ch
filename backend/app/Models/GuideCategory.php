<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Str;

class GuideCategory extends Model
{
    protected $guarded = ['id'];

    protected static function booted(): void
    {
        static::saving(function (GuideCategory $c) {
            $c->slug = $c->slug ?: Str::slug($c->name, '-', 'de');
        });
    }

    public function articles(): HasMany
    {
        return $this->hasMany(GuideArticle::class);
    }
}
