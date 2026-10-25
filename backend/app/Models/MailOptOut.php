<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/** Kundschaft, die keine Pflege-Mails und Bewertungsanfragen mehr möchte. */
class MailOptOut extends Model
{
    protected $guarded = ['id'];

    public static function has(?string $email): bool
    {
        return ! $email || static::query()->where('email', strtolower($email))->exists();
    }

    public static function token(string $email): string
    {
        return hash_hmac('sha256', strtolower($email), (string) config('app.key'));
    }

    public static function url(string $email): string
    {
        return url('/pflegetipps/abmelden?e='.urlencode(strtolower($email)).'&s='.self::token($email));
    }
}
