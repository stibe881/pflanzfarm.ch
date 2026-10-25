<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;

class Popup extends Model
{
    public const TARGETS = ['shop' => 'Shop', 'service' => 'Gartenservice', 'contact' => 'Kontakt', 'guide' => 'Ratgeber', 'references' => 'Referenzen'];

    public const PAGES = ['startseite' => 'Nur Startseite', 'shop' => 'Nur Shop', 'alle' => 'Alle Seiten'];

    protected $guarded = ['id'];

    protected function casts(): array
    {
        return ['starts_at' => 'date', 'ends_at' => 'date', 'active' => 'boolean'];
    }

    public function scopeCurrent(Builder $query): Builder
    {
        $today = now()->toDateString();

        return $query->where('active', true)
            ->where(fn ($q) => $q->whereNull('starts_at')->orWhereDate('starts_at', '<=', $today))
            ->where(fn ($q) => $q->whereNull('ends_at')->orWhereDate('ends_at', '>=', $today));
    }
}
