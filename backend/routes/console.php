<?php

use Illuminate\Support\Facades\Schedule;

// Versand von Newsletter-Mails aus der Warteschlange (Cron: * * * * * php artisan schedule:run)
Schedule::command('queue:work --stop-when-empty --max-time=50')->everyMinute()->withoutOverlapping();
