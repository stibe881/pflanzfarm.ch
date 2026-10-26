<?php

namespace App\Console\Commands;

use App\Services\Integrations;
use App\Services\StripeCheckout;
use App\Support\EnvFile;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Artisan;
use Throwable;

use function Laravel\Prompts\confirm;
use function Laravel\Prompts\note;
use function Laravel\Prompts\password;
use function Laravel\Prompts\text;

/**
 * Geführte Einrichtung von Resend (E-Mail) und Stripe (Karte/TWINT) auf dem Server:
 * fragt die Schlüssel ab, schreibt sie in .env, legt Absender-Domain und Webhooks an und prüft alles.
 */
class SetupIntegrations extends Command
{
    protected $signature = 'pflanzfarm:einrichten {--nur-webhooks : Nur die Webhooks für die aktuelle Domain neu anlegen}';

    protected $description = 'Resend und Stripe einrichten (Schlüssel, Absender-Domain, Webhooks) und prüfen';

    public function handle(Integrations $integrations): int
    {
        $env = app(EnvFile::class);
        $site = Integrations::site();
        $test = (bool) config('pflanzfarm.test_mode');
        $this->info('Pflanzfarm – Einrichtung für '.$site.($test ? ' (Testseite)' : ' (echter Betrieb)'));

        if (! $this->option('nur-webhooks')) {
            $this->setupResend($env, $integrations);
            $this->setupStripe($env, $test);
        }
        $this->setupWebhooks($env, $integrations);

        // .env-Änderungen wirksam machen (install.sh legt einen Konfigurations-Cache an)
        if (! app()->runningUnitTests()) {
            Artisan::call('optimize:clear');
            Artisan::call('optimize');
        }
        $this->newLine();
        $this->info('Gespeichert. Prüfung:');
        Artisan::call('pflanzfarm:status', [], $this->output);

        return self::SUCCESS;
    }

    private function setupResend(EnvFile $env, Integrations $integrations): void
    {
        $this->newLine();
        $this->line('<options=bold>1. E-Mail über Resend</>');
        note('Schlüssel unter resend.com → API Keys anlegen («Full access», damit Domain und Webhook automatisch eingerichtet werden können).');
        $key = password('Resend API-Schlüssel (re_…)', placeholder: config('resend.api_key') ? 'leer lassen = bisherigen behalten' : 're_…',
            validate: fn ($v) => $v === '' && config('resend.api_key') ? null : (str_starts_with($v, 're_') ? null : 'Der Schlüssel beginnt mit re_'));
        if ($key !== '') {
            $env->set(['RESEND_API_KEY' => $key, 'MAIL_MAILER' => 'resend']);
            config(['resend.api_key' => $key, 'services.resend.key' => $key, 'mail.default' => 'resend']);
        } else {
            $env->set(['MAIL_MAILER' => 'resend']);
        }

        $from = text('Absender-Adresse', default: (string) config('mail.from.address'),
            hint: 'Die Domain dahinter muss bei Resend bestätigt sein, z. B. shop@pflanzfarm.ch',
            validate: fn ($v) => filter_var($v, FILTER_VALIDATE_EMAIL) ? null : 'Bitte eine gültige E-Mail-Adresse');
        $name = text('Absender-Name', default: (string) config('mail.from.name'));
        $env->set(['MAIL_FROM_ADDRESS' => $from, 'MAIL_FROM_NAME' => $name]);
        config(['mail.from.address' => $from, 'mail.from.name' => $name]);

        $domainName = Integrations::domainOf($from);
        $domain = $integrations->resendDomain($domainName);
        if ($domain === false) {
            $this->warn($integrations->resendRestricted
                ? 'Der Schlüssel darf nur senden («Sending access») – Domain bitte im Resend-Dashboard prüfen.'
                : 'Resend lehnt den Schlüssel ab: '.$integrations->resendError);
        } elseif ($domain === null && confirm("Die Domain {$domainName} ist bei Resend noch nicht eingerichtet. Jetzt anlegen?")) {
            try {
                $domain = $integrations->createResendDomain($domainName);
                $this->printDnsRecords($domain);
            } catch (Throwable $e) {
                $this->error('Konnte die Domain nicht anlegen: '.$e->getMessage());
            }
        } elseif ($domain && $domain->status !== 'verified') {
            $this->warn("{$domainName} ist bei Resend angelegt, aber noch nicht bestätigt.");
            try {
                $this->printDnsRecords(Integrations::resend()->domains->get($domain->id));
            } catch (Throwable) {
            }
        } elseif ($domain) {
            $this->info("✓ {$domainName} ist bei Resend bestätigt.");
        }
        if ($domain) {
            try {
                $integrations->enableResendTracking($domain);
            } catch (Throwable) {
                // nicht kritisch
            }
        }

        if (config('pflanzfarm.test_mode')) {
            $redirect = text('Nur Testseite: alle E-Mails an eine feste Adresse umleiten? (leer = an die echten Empfänger)', default: (string) config('pflanzfarm.mail_redirect_to'));
            $env->set(['MAIL_REDIRECT_TO' => $redirect]);
            config(['pflanzfarm.mail_redirect_to' => $redirect]);
        }
    }

    private function printDnsRecords($domain): void
    {
        $this->newLine();
        $this->line('Bitte diese DNS-Einträge beim Domain-Anbieter von '.$domain->name.' eintragen (danach in Resend auf «Verify» klicken):');
        $rows = collect((array) ($domain->records ?? []))->map(fn ($r) => [
            $r['type'] ?? $r->type ?? '', $r['name'] ?? $r->name ?? '', $r['value'] ?? $r->value ?? '', $r['priority'] ?? $r->priority ?? '',
        ])->all();
        $this->table(['Typ', 'Name', 'Wert', 'Priorität'], $rows);
        $this->line('Die bestehende Website und E-Mail-Adressen der Domain sind davon nicht betroffen (Einträge nur für «send» und «resend._domainkey»).');
    }

    private function setupStripe(EnvFile $env, bool $test): void
    {
        $this->newLine();
        $this->line('<options=bold>2. Zahlung über Stripe (Karte und TWINT)</>');
        note($test
            ? 'Testseite: im Stripe-Dashboard oben auf «Testmodus» schalten und unter Entwickler → API-Schlüssel den Geheimschlüssel sk_test_… kopieren.'
            : 'Echter Betrieb: Live-Schlüssel sk_live_… aus dem Stripe-Dashboard (Entwickler → API-Schlüssel).');
        if (! confirm('Stripe jetzt einrichten?', default: true)) {
            return;
        }
        $secret = password($test ? 'Stripe-Geheimschlüssel (sk_test_…)' : 'Stripe-Geheimschlüssel (sk_live_…)',
            placeholder: config('services.stripe.secret') ? 'leer lassen = bisherigen behalten' : '',
            validate: function ($v) {
                if ($v === '' && config('services.stripe.secret')) {
                    return null;
                }

                return StripeCheckout::keyProblem($v);
            });
        $publishable = text('Veröffentlichbarer Schlüssel (pk_…, optional)', default: (string) config('services.stripe.key'));
        $values = ['STRIPE_FAKE' => 'false', 'STRIPE_KEY' => $publishable];
        if ($secret !== '') {
            $values['STRIPE_SECRET'] = $secret;
            config(['services.stripe.secret' => $secret]);
        }
        $env->set($values);
        config(['pflanzfarm.fake_payments' => false, 'services.stripe.key' => $publishable]);
        if (! $test && StripeCheckout::keyMode() === 'test') {
            $this->warn('Achtung: Auf der echten Website ist ein Testschlüssel hinterlegt – Kundschaft kann so nicht wirklich bezahlen.');
        }
    }

    private function setupWebhooks(EnvFile $env, Integrations $integrations): void
    {
        $this->newLine();
        $this->line('<options=bold>3. Webhooks für '.Integrations::site().'</>');
        if (! config('pflanzfarm.fake_payments') && config('services.stripe.secret')) {
            try {
                $secret = $integrations->setupStripeWebhook();
                $env->set(['STRIPE_WEBHOOK_SECRET' => $secret]);
                $this->info('✓ Stripe-Webhook angelegt: '.Integrations::stripeWebhookUrl());
            } catch (Throwable $e) {
                $this->error('Stripe-Webhook konnte nicht angelegt werden: '.$e->getMessage());
            }
        }
        if (config('mail.default') === 'resend' && (config('resend.api_key') || config('services.resend.key'))) {
            try {
                $secret = $integrations->setupResendWebhook();
                $env->set(['RESEND_WEBHOOK_SECRET' => $secret]);
                $this->info('✓ Resend-Webhook (Newsletter-Statistik) angelegt: '.Integrations::resendWebhookUrl());
            } catch (Throwable $e) {
                $this->warn('Resend-Webhook konnte nicht angelegt werden ('.$e->getMessage().'). Newsletter-Statistik bitte im Resend-Dashboard unter «Webhooks» einrichten.');
            }
        }
    }
}
