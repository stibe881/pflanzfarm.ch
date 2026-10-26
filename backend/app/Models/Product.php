<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Product extends Model
{
    public const CATEGORIES = ['Heckenpflanzen' => 'Heckenpflanzen', 'Beerensträucher' => 'Beerensträucher', 'Baumschule' => 'Baumschule'];

    public const LOCATIONS = ['sonne' => 'Sonne', 'halbschatten' => 'Halbschatten', 'schatten' => 'Schatten'];

    public const USES = ['hecke' => 'Hecke', 'sichtschutz' => 'Sichtschutz', 'naschgarten' => 'Naschgarten', 'kuebel' => 'Kübel / Terrasse', 'solitaer' => 'Einzelpflanze', 'bienen' => 'Bienenfreundlich'];

    protected $guarded = ['id'];

    protected function casts(): array
    {
        return [
            'traits' => 'array',
            'evergreen' => 'boolean',
            'locations' => 'array',
            'uses' => 'array',
            'planting_months' => 'array',
            'gallery' => 'array',
            'volume_discounts' => 'array',
            'active' => 'boolean',
            'price_on_request' => 'boolean',
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

    public const CARE_FIELDS = ['care_location' => 'Standort', 'care_planting' => 'Pflanzung', 'care_first' => 'Erste Pflege', 'care_ongoing' => 'Pflege'];

    /** @return array<int, array{title: string, text: string}> nur ausgefüllte Punkte der Pflanzberatung */
    public function careAdvice(): array
    {
        return collect(self::CARE_FIELDS)
            ->map(fn ($title, $field) => ['title' => $title, 'text' => trim((string) $this->{$field})])
            ->filter(fn ($row) => $row['text'] !== '')->values()->all();
    }

    public function hasCareAdvice(): bool
    {
        return $this->careAdvice() !== [];
    }
}
