<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Order extends Model
{
    use \Illuminate\Database\Eloquent\Factories\HasFactory;

    public const STATUSES = ['neu' => 'Neu', 'bestaetigt' => 'Bestätigt', 'geliefert' => 'Geliefert / abgeholt', 'storniert' => 'Storniert'];

    public const PAYMENT_METHODS = ['stripe' => 'Karte / TWINT', 'invoice' => 'Rechnung', 'cash' => 'Barzahlung bei Abholung'];

    public const PAYMENT_STATUSES = ['offen' => 'Offen', 'ausstehend' => 'Zahlung ausstehend', 'bezahlt' => 'Bezahlt', 'erstattet' => 'Erstattet', 'abgebrochen' => 'Abgebrochen'];

    public const DELIVERY_METHODS = ['lieferung' => 'Lieferung', 'abholung' => 'Abholung in Ebersecken'];

    protected $guarded = ['id'];

    protected $hidden = ['access_token'];

    protected function casts(): array
    {
        return [
            'paid_at' => 'datetime',
            'confirmed_at' => 'datetime',
            'delivered_at' => 'datetime',
            'cancelled_at' => 'datetime',
            'stock_released' => 'boolean',
        ];
    }

    public function items(): HasMany
    {
        return $this->hasMany(OrderItem::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function statusLabel(): string
    {
        return self::STATUSES[$this->status] ?? $this->status;
    }

    public function paymentMethodLabel(): string
    {
        return self::PAYMENT_METHODS[$this->payment_method] ?? $this->payment_method;
    }

    public function deliveryMethodLabel(): string
    {
        return self::DELIVERY_METHODS[$this->delivery_method] ?? $this->delivery_method;
    }

    public function paymentStatusLabel(): string
    {
        return self::PAYMENT_STATUSES[$this->payment_status] ?? $this->payment_status;
    }
}
