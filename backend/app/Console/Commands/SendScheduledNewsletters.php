<?php

namespace App\Console\Commands;

use App\Services\NewsletterService;
use Illuminate\Console\Command;

class SendScheduledNewsletters extends Command
{
    protected $signature = 'pflanzfarm:newsletter-planen';

    protected $description = 'Startet geplante Newsletter, deren Versandzeitpunkt erreicht ist';

    public function handle(NewsletterService $newsletters): int
    {
        $count = $newsletters->sendScheduled();
        if ($count) {
            $this->info("{$count} Newsletter-Mails in die Warteschlange gestellt.");
        }

        return self::SUCCESS;
    }
}
