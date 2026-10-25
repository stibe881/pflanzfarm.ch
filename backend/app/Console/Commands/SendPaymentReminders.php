<?php

namespace App\Console\Commands;

use App\Services\PaymentReminders;
use Illuminate\Console\Command;

class SendPaymentReminders extends Command
{
    protected $signature = 'pflanzfarm:zahlungserinnerungen';

    protected $description = 'Verschickt fällige Zahlungserinnerungen für überfällige Rechnungen';

    public function handle(PaymentReminders $reminders): int
    {
        $this->info($reminders->sendDue().' Zahlungserinnerung(en) verschickt.');

        return self::SUCCESS;
    }
}
