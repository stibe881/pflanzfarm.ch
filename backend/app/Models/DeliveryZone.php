<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DeliveryZone extends Model
{
    protected $guarded = ['id'];

    protected function casts(): array
    {
        return ['postal_ranges' => 'array', 'deliverable' => 'boolean', 'surcharge' => 'integer'];
    }

    public function covers(int $postalCode): bool
    {
        foreach ((array) $this->postal_ranges as $r) {
            $from = (int) ($r['from'] ?? 0);
            $to = (int) (($r['to'] ?? null) ?: $from);
            if ($postalCode >= $from && $postalCode <= $to) {
                return true;
            }
        }

        return false;
    }

    /** Zone für eine Schweizer PLZ; die erste passende Zone (nach Reihenfolge) gewinnt. */
    public static function forPostalCode(?string $postalCode): ?self
    {
        $plz = (int) preg_replace('/\D/', '', (string) $postalCode);
        if ($plz < 1000 || $plz > 9999) {
            return null;
        }

        return static::query()->orderBy('sort')->orderBy('id')->get()->first(fn (self $z) => $z->covers($plz));
    }

    public function rangesLabel(): string
    {
        return collect((array) $this->postal_ranges)->map(fn ($r) => ($r['to'] ?? null) && $r['to'] != $r['from'] ? "{$r['from']}–{$r['to']}" : (string) $r['from'])->join(', ');
    }
}
