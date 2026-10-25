<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Cache;

class Setting extends Model
{
    protected $primaryKey = 'key';

    public $incrementing = false;

    protected $keyType = 'string';

    protected $guarded = [];

    protected function casts(): array
    {
        return ['value' => 'array'];
    }

    /** Standardwerte, solange im Admin nichts gespeichert wurde. */
    public const DEFAULTS = [
        'opening_hours' => [
            ['label' => 'Baumschule, Beratung & Abholung', 'value' => 'nach telefonischer Vereinbarung'],
        ],
        'opening_note' => 'Als Familienbetrieb sind wir oft in Gärten unterwegs. Melden Sie sich kurz vor Ihrem Besuch – dann nehmen wir uns Zeit für Sie.',
        'delivery_fee' => 4900,
        'free_delivery_from' => 50000,
        'invoice_enabled' => true,
        'invoice_due_days' => 30,
        'cash_enabled' => true,
        'iban' => '',
        'vat_number' => '',
        'notify_email' => 'info@pflanzfarm.ch',
    ];

    public static function get(string $key): mixed
    {
        $all = Cache::rememberForever('settings', fn () => static::query()->pluck('value', 'key')->all());

        return array_key_exists($key, $all) ? $all[$key] : (self::DEFAULTS[$key] ?? null);
    }

    public static function put(string $key, mixed $value): void
    {
        static::query()->updateOrCreate(['key' => $key], ['value' => $value]);
        Cache::forget('settings');
    }
}
