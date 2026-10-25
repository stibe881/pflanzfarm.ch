<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class NewsletterSubscriber extends Model
{
    public const STATUSES = ['ausstehend' => 'Bestätigung ausstehend', 'bestaetigt' => 'Bestätigt', 'abgemeldet' => 'Abgemeldet'];

    protected $guarded = ['id'];

    protected function casts(): array
    {
        return ['confirmed_at' => 'datetime', 'unsubscribed_at' => 'datetime'];
    }

    protected static function booted(): void
    {
        static::creating(fn (self $s) => $s->token ??= Str::random(48));
    }
}
