<?php

namespace App\Services;

use App\Mail\OrderStatusUpdate;
use App\Models\Order;

/** Statuswechsel mit optionaler Mail an die Kundschaft (Einzelaktion, Sammelaktion, Board). */
class OrderWorkflow
{
    public function canConfirm(Order $order): bool
    {
        return $order->status === 'neu' && $order->payment_status !== 'ausstehend';
    }

    public function canDeliver(Order $order): bool
    {
        return in_array($order->status, ['neu', 'bestaetigt'], true) && $order->payment_status !== 'ausstehend';
    }

    public function confirm(Order $order, array $schedule = [], ?string $message = null, bool $notify = true): bool
    {
        if (! $this->canConfirm($order)) {
            return false;
        }
        $order->update(['status' => 'bestaetigt', 'confirmed_at' => now()] + array_intersect_key($schedule, array_flip(['scheduled_date', 'scheduled_slot'])));
        if ($notify) {
            $order->mailCustomer(new OrderStatusUpdate($order, $message));
        }

        return true;
    }

    public function deliver(Order $order, ?string $message = null, bool $notify = true): bool
    {
        if (! $this->canDeliver($order)) {
            return false;
        }
        $update = ['status' => 'geliefert', 'delivered_at' => now()];
        if ($order->payment_method === 'cash' && $order->payment_status !== 'bezahlt') {
            $update += ['payment_status' => 'bezahlt', 'paid_at' => now()];
        }
        $order->update($update + ['confirmed_at' => $order->confirmed_at ?? now()]);
        if ($notify) {
            $order->mailCustomer(new OrderStatusUpdate($order, $message));
        }

        return true;
    }

    /** Zurück auf «Bestätigt» bzw. «Neu» (nur über das Board, ohne Mail). */
    public function reopen(Order $order, string $status): bool
    {
        if (! in_array($order->status, ['neu', 'bestaetigt', 'geliefert'], true) || ! in_array($status, ['neu', 'bestaetigt'], true)) {
            return false;
        }
        $order->update(['status' => $status, 'delivered_at' => null] + ($status === 'neu' ? ['confirmed_at' => null] : []));

        return true;
    }
}
