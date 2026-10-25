<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Coupon extends Model
{
    public const TYPES = ['gutschein' => 'Wertgutschein (Guthaben)', 'prozent' => 'Rabattcode in %', 'betrag' => 'Rabattcode in CHF'];

    protected $guarded = ['id'];

    protected function casts(): array
    {
        return ['valid_from' => 'date', 'valid_until' => 'date', 'active' => 'boolean', 'value' => 'integer', 'balance' => 'integer'];
    }

    protected static function booted(): void
    {
        static::saving(function (self $c) {
            $c->code = strtoupper(trim($c->code));
            if ($c->type === 'gutschein' && $c->balance === null) {
                $c->balance = $c->value;
            }
        });
    }

    public static function generateCode(string $prefix = 'PF'): string
    {
        do {
            $code = $prefix.'-'.strtoupper(Str::random(4)).'-'.strtoupper(Str::random(4));
            $code = strtr($code, ['0' => 'X', 'O' => 'Y', '1' => 'Z', 'I' => 'W', 'L' => 'K']);
        } while (static::query()->where('code', $code)->exists());

        return $code;
    }

    public static function findByCode(?string $code): ?self
    {
        return $code ? static::query()->where('code', strtoupper(trim($code)))->first() : null;
    }

    /** Fehlermeldung, falls nicht einlösbar, sonst null. */
    public function problem(int $subtotal): ?string
    {
        return match (true) {
            ! $this->active => 'Dieser Code ist nicht mehr gültig.',
            $this->valid_from && $this->valid_from->isFuture() => 'Dieser Code ist erst ab '.$this->valid_from->format('d.m.Y').' gültig.',
            $this->valid_until && $this->valid_until->endOfDay()->isPast() => 'Dieser Code ist abgelaufen.',
            $this->max_uses !== null && $this->used_count >= $this->max_uses => 'Dieser Code wurde bereits eingelöst.',
            $this->type === 'gutschein' && (int) $this->balance <= 0 => 'Dieser Gutschein ist bereits aufgebraucht.',
            $subtotal < $this->min_order => 'Dieser Code gilt ab einem Bestellwert von CHF '.number_format($this->min_order / 100, 2, '.', "'").'.',
            default => null,
        };
    }

    /** Abzug in Rappen; Prozent auf die Artikel, Beträge und Guthaben höchstens bis zum Gesamtbetrag. */
    public function discountFor(int $subtotal, int $total): int
    {
        $d = match ($this->type) {
            'prozent' => (int) round($subtotal * min(100, $this->value) / 100 / 5) * 5,
            'betrag' => $this->value,
            'gutschein' => (int) $this->balance,
            default => 0,
        };

        return max(0, min($d, $total));
    }

    public function label(): string
    {
        return match ($this->type) {
            'prozent' => $this->value.' % Rabatt',
            'betrag' => 'CHF '.number_format($this->value / 100, 2, '.', "'").' Rabatt',
            default => 'Gutschein',
        };
    }
}
