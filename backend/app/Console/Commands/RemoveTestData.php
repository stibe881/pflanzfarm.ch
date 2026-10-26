<?php

namespace App\Console\Commands;

use App\Models\ActivityLog;
use App\Models\CareReminder;
use App\Models\Customer;
use App\Models\NewsletterSend;
use App\Models\Order;
use App\Models\PaymentImport;
use App\Models\StockAlert;
use App\Models\User;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

use function Laravel\Prompts\confirm;

/** Vor dem Livegang: Testbestellungen, Testkunden und Test-Konten entfernen. Produkte, Inhalte und Einstellungen bleiben. */
class RemoveTestData extends Command
{
    protected $signature = 'pflanzfarm:testdaten-entfernen';

    protected $description = 'Testbestellungen, Kundenkartei, Protokoll und @pflanzfarm.test-Konten löschen (vor dem Livegang)';

    public function handle(): int
    {
        $this->table(['Was', 'Anzahl'], [
            ['Bestellungen', Order::query()->count()],
            ['Kundenkartei', Customer::query()->count()],
            ['Konten mit @pflanzfarm.test', User::query()->where('email', 'like', '%@pflanzfarm.test')->count()],
            ['Änderungsprotokoll', ActivityLog::query()->count()],
        ]);
        if (! confirm('Diese Testdaten endgültig löschen? Produkte, Bilder, Inhalte und Einstellungen bleiben erhalten.', default: false)) {
            return self::FAILURE;
        }
        DB::transaction(function () {
            Order::query()->each(fn (Order $o) => $o->delete());
            Customer::query()->delete();
            User::query()->where('email', 'like', '%@pflanzfarm.test')->delete();
            foreach ([ActivityLog::class, CareReminder::class, StockAlert::class, PaymentImport::class, NewsletterSend::class] as $model) {
                $model::query()->delete();
            }
        });
        $this->info('Testdaten entfernt. Lagerbestände bitte unter «Inventur» prüfen.');

        return self::SUCCESS;
    }
}
