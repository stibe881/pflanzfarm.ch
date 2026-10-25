<?php

namespace App\Services;

use App\Mail\PaymentReminder;
use App\Models\Order;
use App\Models\Setting;
use Illuminate\Support\Collection;

class PaymentReminders
{
    /** Überfällige, offene Rechnungen. */
    public function overdue(): Collection
    {
        return Order::query()->where('payment_method', 'invoice')->where('payment_status', 'offen')
            ->where('status', '!=', 'storniert')->whereNotNull('email')->get()->filter->isOverdue()->values();
    }

    /** Erinnerungen, die heute fällig sind (Abstand und Höchstzahl aus den Einstellungen). */
    public function due(): Collection
    {
        $interval = max(1, (int) Setting::get('reminder_interval_days'));
        $max = (int) Setting::get('reminder_max');

        return $this->overdue()->filter(fn (Order $o) => $o->reminder_count < $max
            && (! $o->last_reminded_at || $o->last_reminded_at->lte(now()->subDays($interval))))->values();
    }

    public function send(Order $order): void
    {
        $order->update(['reminder_count' => $order->reminder_count + 1, 'last_reminded_at' => now()]);
        $order->fresh()->mailCustomer(new PaymentReminder($order->fresh()));
    }

    public function sendDue(): int
    {
        if (! Setting::get('reminders_enabled')) {
            return 0;
        }
        $due = $this->due();
        $due->each(fn (Order $o) => $this->send($o));

        return $due->count();
    }
}
