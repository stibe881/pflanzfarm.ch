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
        'free_delivery_from' => 50000,
        'invoice_enabled' => true,
        'invoice_due_days' => 30,
        'cash_enabled' => true,
        'iban' => '',
        'vat_number' => 'CHE-214.008.517',
        'notify_email' => 'info@pflanzfarm.ch',
        'low_stock_threshold' => 10,
        'reminders_enabled' => true,
        'reminder_interval_days' => 10,
        'reminder_max' => 2,
        // Pflanzservice (Rappen): Preis pro Pflanze, falls die Grösse keinen eigenen hat, und Mindestbetrag
        'planting_enabled' => true,
        'planting_price_default' => 800,
        'planting_min_fee' => 15000,
        // Pflege-Mails nach dem Kauf
        'care_mails_enabled' => true,
        'care_mail_days' => 14,
        'seasonal_reminders_enabled' => true,
        'google_review_url' => '',
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
