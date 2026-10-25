<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

/** Kundenkartei: eine Person pro E-Mail-Adresse (bzw. Telefon, wenn keine E-Mail), unabhängig vom Kundenkonto. */
class Customer extends Model
{
    protected $guarded = ['id'];

    public function orders(): HasMany
    {
        return $this->hasMany(Order::class)->latest();
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /** Findet oder erstellt die Karteikarte zu einer Bestellung und hält Adresse/Telefon aktuell. */
    public static function forOrder(Order $order): self
    {
        $email = $order->email ? strtolower($order->email) : null;
        $customer = $email ? static::query()->where('email', $email)->first()
            : ($order->phone ? static::query()->whereNull('email')->where('phone', $order->phone)->first() : null);
        $customer ??= new static(['email' => $email]);
        $customer->fill(array_filter([
            'name' => $order->name, 'phone' => $order->phone, 'street' => $order->street,
            'postal_code' => $order->postal_code, 'city' => $order->city, 'user_id' => $order->user_id,
        ]))->save();

        return $customer;
    }
}
