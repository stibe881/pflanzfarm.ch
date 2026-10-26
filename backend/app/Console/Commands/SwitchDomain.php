<?php

namespace App\Console\Commands;

use App\Support\EnvFile;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Artisan;

use function Laravel\Prompts\confirm;

/** Website auf eine neue Domain umstellen (z. B. von pflanzfarm.gross-ict.ch auf pflanzfarm.ch). */
class SwitchDomain extends Command
{
    protected $signature = 'pflanzfarm:domain {domain : z. B. pflanzfarm.ch} {--live : Testbetrieb beenden (gelber Balken weg, echte Zahlungen)}';

    protected $description = 'Domain wechseln: APP_URL, Login-Domains und Webhooks anpassen';

    public function handle(): int
    {
        $host = strtolower(preg_replace('#^https?://|/.*$#', '', (string) $this->argument('domain')));
        if (! preg_match('/^[a-z0-9.-]+\.[a-z]{2,}$/', $host)) {
            $this->error('Ungültige Domain: '.$host);

            return self::FAILURE;
        }
        $hosts = str_starts_with($host, 'www.') ? [$host, substr($host, 4)] : [$host, 'www.'.$host];
        $values = ['APP_URL' => 'https://'.$host, 'SANCTUM_STATEFUL_DOMAINS' => implode(',', $hosts)];
        if ($this->option('live')) {
            $values += ['APP_ENV' => 'production', 'PFLANZFARM_TEST_MODE' => 'false', 'STRIPE_FAKE' => 'false', 'SITE_PASSWORD' => '', 'MAIL_REDIRECT_TO' => ''];
        }
        $this->table(['Einstellung', 'Neu'], collect($values)->map(fn ($v, $k) => [$k, $v === '' ? '(leer)' : $v])->values()->all());
        if (! confirm('So übernehmen?', default: true)) {
            return self::FAILURE;
        }
        app(EnvFile::class)->set($values);
        app()->runningUnitTests() || Artisan::call('optimize:clear');
        $this->info('Gespeichert.');

        if ($this->option('live')) {
            $this->warn('Echter Betrieb: Jetzt die Live-Schlüssel von Stripe hinterlegen – «php artisan pflanzfarm:einrichten».');
        } else {
            $this->line('Webhooks für die neue Domain anlegen: «php artisan pflanzfarm:einrichten --nur-webhooks».');
        }

        return self::SUCCESS;
    }
}
