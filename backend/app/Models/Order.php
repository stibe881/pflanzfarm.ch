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

    public const SLOTS = ['vormittag' => 'Vormittag', 'nachmittag' => 'Nachmittag', 'egal' => 'Egal'];

    public const SOURCES = ['online' => 'Online-Shop', 'admin' => 'Telefon / vor Ort'];

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
            'preferred_date' => 'date',
            'scheduled_date' => 'date',
            'last_reminded_at' => 'datetime',
            'refunded_at' => 'datetime',
            'planting' => 'boolean',
            'care_mail_sent_at' => 'datetime',
            'review_requested_at' => 'datetime',
        ];
    }

    public function items(): HasMany
    {
        return $this->hasMany(OrderItem::class);
    }

    public function customer(): BelongsTo
    {
        return $this->belongsTo(Customer::class);
    }

    public function notes(): HasMany
    {
        return $this->hasMany(OrderNote::class)->latest();
    }

    public function coupon(): BelongsTo
    {
        return $this->belongsTo(Coupon::class);
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

    /** Fälligkeitsdatum einer Rechnung */
    public function dueDate(): \Illuminate\Support\Carbon
    {
        return $this->created_at->copy()->addDays((int) Setting::get('invoice_due_days'));
    }

    public function isOverdue(): bool
    {
        return $this->payment_method === 'invoice' && $this->payment_status === 'offen'
            && $this->status !== 'storniert' && $this->dueDate()->endOfDay()->isPast();
    }

    /**
     * Zeilen zwischen Artikeln und Total (Lieferung, Pflanzservice, Gutschein) für Rechnung, Mails und Gutschrift.
     *
     * @return array<int, array{0: string, 1: int}>
     */
    public function summaryLines(): array
    {
        $lines = [];
        if ($this->delivery_method === 'lieferung') {
            $lines[] = ['Lieferung'.($this->delivery_zone && $this->zone_surcharge ? ' (inkl. Zone '.$this->delivery_zone.')' : ''), (int) $this->shipping];
        } else {
            $lines[] = ['Abholung', 0];
        }
        if ($this->planting_fee) {
            $lines[] = ['Pflanzservice', (int) $this->planting_fee];
        }
        if ($this->coupon_discount) {
            $lines[] = [($this->coupon?->type === 'gutschein' ? 'Gutschein ' : 'Rabattcode ').$this->coupon_code, -(int) $this->coupon_discount];
        }

        return $lines;
    }

    /**
     * Verlauf: Systemereignisse, Änderungen im Admin und interne Notizen, neueste zuerst.
     *
     * @return \Illuminate\Support\Collection<int, array{at: \Illuminate\Support\Carbon, title: string, by: ?string, text: ?string, type: string}>
     */
    public function timeline(): \Illuminate\Support\Collection
    {
        $events = collect([
            [$this->created_at, 'Bestellung eingegangen ('.(self::SOURCES[$this->source] ?? $this->source).')', 'system'],
            [$this->paid_at, 'Zahlung erhalten'.($this->paid_reference ? ' (Bankimport)' : ''), 'pay'],
            [$this->confirmed_at, 'Bestätigt', 'status'],
            [$this->delivered_at, $this->delivery_method === 'lieferung' ? 'Geliefert' : 'Abgeholt', 'status'],
            [$this->last_reminded_at, $this->reminder_count.'. Zahlungserinnerung gesendet', 'mail'],
            [$this->cancelled_at, 'Storniert'.($this->cancelled_by === 'kunde' ? ' durch die Kundschaft' : ''), 'cancel'],
            [$this->refunded_at, 'Erstattet: CHF '.number_format($this->refund_amount / 100, 2, '.', "'"), 'pay'],
            [$this->care_mail_sent_at, 'Pflegetipps gesendet', 'mail'],
        ])->filter(fn ($e) => $e[0])->map(fn ($e) => ['at' => $e[0], 'title' => $e[1], 'by' => null, 'text' => null, 'type' => $e[2]]);

        $labels = ['status' => 'Status', 'payment_status' => 'Zahlung', 'scheduled_date' => 'Termin', 'scheduled_slot' => 'Zeitfenster', 'name' => 'Name', 'email' => 'E-Mail', 'phone' => 'Telefon', 'street' => 'Strasse', 'postal_code' => 'PLZ', 'city' => 'Ort', 'note' => 'Bemerkung', 'delivery_method' => 'Lieferart'];
        $changes = ActivityLog::query()->with('user')->where('subject_type', 'Order')->where('subject_id', $this->id)->where('event', 'geändert')->get()
            ->map(function (ActivityLog $l) use ($labels) {
                $keys = collect(array_keys((array) $l->getAttribute('changes')))->map(fn ($k) => $labels[$k] ?? null)->filter()->unique();

                return $keys->isEmpty() ? null : ['at' => $l->created_at, 'title' => 'Geändert: '.$keys->join(', '), 'by' => $l->user?->name, 'text' => null, 'type' => 'edit'];
            })->filter();

        $notes = $this->notes()->with('user')->get()
            ->map(fn (OrderNote $n) => ['at' => $n->created_at, 'title' => 'Notiz', 'by' => $n->user?->name, 'text' => $n->body, 'type' => 'note']);

        return $events->concat($changes)->concat($notes)->sortByDesc(fn ($e) => $e['at']->timestamp)->values();
    }

    /** Kundschaft darf selbst stornieren, solange wir die Bestellung noch nicht bestätigt haben. */
    public function isCancellableByCustomer(): bool
    {
        return $this->status === 'neu' && in_array($this->payment_status, ['offen', 'bezahlt'], true);
    }

    /** E-Mail an die Kundschaft, sofern eine Adresse erfasst ist (Telefonbestellungen evtl. ohne). */
    public function mailCustomer(\Illuminate\Contracts\Mail\Mailable $mail): bool
    {
        if (! $this->email) {
            return false;
        }
        \Illuminate\Support\Facades\Mail::to($this->email)->send($mail);

        return true;
    }

    public function paymentStatusLabel(): string
    {
        return self::PAYMENT_STATUSES[$this->payment_status] ?? $this->payment_status;
    }
}
