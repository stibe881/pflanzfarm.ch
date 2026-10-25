<?php

use Illuminate\Support\Facades\Schedule;

// Cron: * * * * * php artisan schedule:run
// Mails aus der Warteschlange (Newsletter) verschicken
Schedule::command('queue:work --stop-when-empty --max-time=50')->everyMinute()->withoutOverlapping();
// Geplante Newsletter zum gewünschten Zeitpunkt starten
Schedule::command('pflanzfarm:newsletter-planen')->everyMinute()->withoutOverlapping();
// Zahlungserinnerungen für überfällige Rechnungen, werktags morgens
Schedule::command('pflanzfarm:zahlungserinnerungen')->weekdays()->at('08:30');
// Pflegetipps nach der Lieferung und saisonale Erinnerungen
Schedule::command('pflanzfarm:pflegemails')->dailyAt('09:15');
