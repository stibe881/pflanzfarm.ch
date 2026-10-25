<?php

namespace App\Console\Commands;

use App\Services\CareMails;
use Illuminate\Console\Command;

class SendCareMails extends Command
{
    protected $signature = 'pflanzfarm:pflegemails';

    protected $description = 'Pflegetipps nach der Lieferung (mit Bitte um Bewertung) und saisonale Erinnerungen verschicken';

    public function handle(CareMails $mails): int
    {
        $this->info($mails->sendAfterDelivery().' Pflegetipp(s) nach Lieferung, '.$mails->sendSeasonal().' saisonale Erinnerung(en).');

        return self::SUCCESS;
    }
}
