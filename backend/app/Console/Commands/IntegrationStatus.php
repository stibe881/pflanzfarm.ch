<?php

namespace App\Console\Commands;

use App\Services\Integrations;
use Illuminate\Console\Command;
use Throwable;

class IntegrationStatus extends Command
{
    protected $signature = 'pflanzfarm:status {--testmail= : Test-E-Mail an diese Adresse senden}';

    protected $description = 'Prüft Website-Adresse, E-Mail (Resend) und Zahlung (Stripe)';

    public function handle(Integrations $integrations): int
    {
        $icons = ['ok' => '<fg=green>✓</>', 'warn' => '<fg=yellow>!</>', 'fail' => '<fg=red>✗</>'];
        $rows = $integrations->checks();
        foreach ($rows as $r) {
            $this->line(sprintf(' %s  %-9s %s%s', $icons[$r['status']], $r['area'], $r['title'], $r['detail'] ? ' – '.$r['detail'] : ''));
        }
        if ($to = $this->option('testmail')) {
            try {
                $integrations->sendTestMail($to);
                $this->info("Test-E-Mail an {$to} verschickt.");
            } catch (Throwable $e) {
                $this->error('Test-E-Mail fehlgeschlagen: '.$e->getMessage());

                return self::FAILURE;
            }
        }

        return collect($rows)->contains('status', 'fail') ? self::FAILURE : self::SUCCESS;
    }
}
