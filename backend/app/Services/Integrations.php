<?php

namespace App\Services;

use App\Models\Setting;
use Illuminate\Support\Facades\Mail;
use Resend;
use Throwable;

/**
 * Prüft und richtet die externen Dienste ein: Resend (E-Mail) und Stripe (Karte/TWINT).
 * Wird vom Befehl «pflanzfarm:einrichten», «pflanzfarm:status» und der Admin-Seite «Systemstatus» genutzt.
 */
class Integrations
{
    public const STRIPE_EVENTS = ['checkout.session.completed', 'checkout.session.async_payment_succeeded', 'checkout.session.async_payment_failed', 'checkout.session.expired'];

    public const RESEND_EVENTS = ['email.opened', 'email.clicked', 'email.bounced', 'email.complained'];

    public static function site(): string
    {
        return rtrim((string) config('app.url'), '/');
    }

    public static function stripeWebhookUrl(): string
    {
        return self::site().'/stripe/webhook';
    }

    public static function resendWebhookUrl(): string
    {
        return self::site().'/'.trim((string) config('resend.path', 'resend'), '/').'/webhook';
    }

    /**
     * Alle Prüfungen als Liste: status ok | warn | fail, Bereich, Titel, Detail.
     *
     * @return array<int, array{status: string, area: string, title: string, detail: string}>
     */
    public function checks(): array
    {
        $rows = [];
        $add = function (string $status, string $area, string $title, string $detail = '') use (&$rows) {
            $rows[] = compact('status', 'area', 'title', 'detail');
        };
        $test = (bool) config('pflanzfarm.test_mode');

        // Allgemein
        $site = self::site();
        $add(str_starts_with($site, 'https://') ? 'ok' : 'fail', 'Allgemein', 'Adresse der Website', $site.(str_starts_with($site, 'https://') ? '' : ' – muss mit https:// beginnen (APP_URL)'));
        $add('ok', 'Allgemein', 'Betriebsart', $test ? 'Testseite (gelber Balken, nur Stripe-Testzahlungen, für Google gesperrt)' : 'Echter Betrieb');

        // E-Mail
        $mailer = (string) config('mail.default');
        $from = (string) config('mail.from.address');
        if ($mailer !== 'resend') {
            $add($test ? 'warn' : 'fail', 'E-Mail', 'Versand über Resend', "MAIL_MAILER={$mailer} – E-Mails werden nicht verschickt".($mailer === 'log' ? ' (nur ins Protokoll geschrieben)' : '').'.');
        } elseif (! config('resend.api_key') && ! config('services.resend.key')) {
            $add('fail', 'E-Mail', 'Resend-Schlüssel', 'RESEND_API_KEY fehlt.');
        } else {
            $add('ok', 'E-Mail', 'Versand über Resend', 'Absender: '.config('mail.from.name')." <{$from}>");
            $domain = $this->resendDomain(self::domainOf($from));
            if ($domain === false && ! $this->resendRestricted) {
                $add('fail', 'E-Mail', 'Resend-Schlüssel', 'Resend lehnt den Schlüssel ab: '.$this->resendError);
            } elseif ($domain === false) {
                $add('warn', 'E-Mail', 'Absender-Domain', 'Nicht prüfbar, weil der Schlüssel nur senden darf («Sending access»). Bitte im Resend-Dashboard unter «Domains» kontrollieren.');
            } elseif ($domain === null) {
                $add('fail', 'E-Mail', 'Absender-Domain', self::domainOf($from).' ist bei Resend nicht eingerichtet – E-Mails werden abgelehnt.');
            } else {
                $add($domain->status === 'verified' ? 'ok' : 'fail', 'E-Mail', 'Absender-Domain', $domain->name.': '.($domain->status === 'verified' ? 'bestätigt' : 'noch nicht bestätigt ('.$domain->status.') – DNS-Einträge prüfen'));
            }
        }
        if ($redirect = config('pflanzfarm.mail_redirect_to')) {
            $add($test ? 'warn' : 'ok', 'E-Mail', 'Umleitung', $test ? "Alle Mails gehen an {$redirect} (MAIL_REDIRECT_TO)." : 'MAIL_REDIRECT_TO ist gesetzt, wirkt aber nur auf der Testseite.');
        }
        $add(config('resend.webhook.secret') ? 'ok' : 'warn', 'E-Mail', 'Newsletter-Statistik (Resend-Webhook)', config('resend.webhook.secret')
            ? 'Eingerichtet für '.self::resendWebhookUrl()
            : 'RESEND_WEBHOOK_SECRET fehlt – Öffnungen und Klicks werden nicht gezählt.');
        $add(Setting::get('notify_email') ? 'ok' : 'warn', 'E-Mail', 'Benachrichtigungen ans Team', (string) (Setting::get('notify_email') ?: 'Keine Adresse unter Einstellungen hinterlegt.'));

        // Stripe
        if (config('pflanzfarm.fake_payments')) {
            $add($test ? 'warn' : 'fail', 'Stripe', 'Zahlung', 'Simulierte Zahlung aktiv (STRIPE_FAKE=true) – Stripe wird nicht verwendet.');

            return $rows;
        }
        if ($problem = StripeCheckout::keyProblem()) {
            $add('fail', 'Stripe', 'Geheimschlüssel', $problem);

            return $rows;
        }
        $mode = StripeCheckout::keyMode();
        $add(! $test && $mode === 'test' ? 'warn' : 'ok', 'Stripe', 'Geheimschlüssel', $mode === 'test' ? 'Testmodus (keine echten Zahlungen)' : 'Live – echte Zahlungen');
        try {
            $stripe = app(StripeCheckout::class)->client();
            $account = $stripe->accounts->retrieve();
            $add($account->charges_enabled || $mode === 'test' ? 'ok' : 'fail', 'Stripe', 'Konto', trim(($account->settings->dashboard->display_name ?? $account->business_profile->name ?? $account->id).' · '.strtoupper((string) $account->country).' · '.($account->charges_enabled ? 'Zahlungen freigeschaltet' : 'Zahlungen noch nicht freigeschaltet (Konto im Dashboard vervollständigen)')));
            if (in_array('twint', (array) config('services.stripe.methods'), true)) {
                $twint = $account->capabilities->twint_payments ?? null;
                $add($twint === 'active' ? 'ok' : 'warn', 'Stripe', 'TWINT', $twint === 'active' ? 'aktiv' : 'nicht aktiv ('.($twint ?: 'nicht beantragt').') – im Stripe-Dashboard unter Einstellungen → Zahlungsmethoden aktivieren. Bis dahin wird nur Karte angeboten.');
            }
            $endpoint = collect($stripe->webhookEndpoints->all(['limit' => 100])->data)->first(fn ($e) => $e->url === self::stripeWebhookUrl());
            if (! $endpoint) {
                $add('fail', 'Stripe', 'Webhook', 'Kein Webhook für '.self::stripeWebhookUrl().' – Zahlungen werden nur verzögert (alle 15 Minuten) erkannt. «php artisan pflanzfarm:einrichten» legt ihn an.');
            } else {
                $missing = array_diff(self::STRIPE_EVENTS, (array) $endpoint->enabled_events);
                $ok = $endpoint->status === 'enabled' && ! $missing && config('services.stripe.webhook_secret');
                $add($ok ? 'ok' : 'fail', 'Stripe', 'Webhook', self::stripeWebhookUrl().' – '.($endpoint->status !== 'enabled' ? 'deaktiviert' : ($missing ? 'fehlende Ereignisse: '.implode(', ', $missing) : (config('services.stripe.webhook_secret') ? 'aktiv' : 'STRIPE_WEBHOOK_SECRET fehlt'))));
            }
        } catch (Throwable $e) {
            $add('fail', 'Stripe', 'Verbindung', 'Stripe meldet einen Fehler: '.$e->getMessage());
        }

        return $rows;
    }

    public function sendTestMail(string $to): void
    {
        Mail::raw("Diese Test-E-Mail wurde von ".self::site()." verschickt.\n\nWenn sie angekommen ist, funktioniert der Versand über Resend.\n\nPflanzfarm Steinmann", function ($m) use ($to) {
            $m->to($to)->subject('Test-E-Mail der Pflanzfarm-Website');
        });
    }

    public ?string $resendError = null;

    public bool $resendRestricted = false;

    /** @return \Resend\Domain|null|false  null = nicht vorhanden, false = nicht prüfbar (Grund in $resendError) */
    public function resendDomain(string $name): mixed
    {
        $this->resendError = null;
        $this->resendRestricted = false;
        try {
            foreach (self::resend()->domains->list() as $d) {
                if (strcasecmp($d->name, $name) === 0) {
                    return $d;
                }
            }

            return null;
        } catch (Throwable $e) {
            $this->resendError = $e->getMessage();
            $this->resendRestricted = str_contains(strtolower($e->getMessage()), 'restricted');

            return false;
        }
    }

    /** Legt die Absender-Domain bei Resend an und liefert die nötigen DNS-Einträge. */
    public function createResendDomain(string $name): \Resend\Domain
    {
        return self::resend()->domains->create(['name' => $name, 'region' => 'eu-west-1']);
    }

    /** Öffnungs- und Klickzählung für die Newsletter-Statistik einschalten. */
    public function enableResendTracking(\Resend\Domain $domain): void
    {
        self::resend()->domains->update($domain->id, ['open_tracking' => true, 'click_tracking' => true]);
    }

    /** Stripe-Webhook für die aktuelle Domain (neu) anlegen; liefert das Signatur-Geheimnis. */
    public function setupStripeWebhook(): string
    {
        $stripe = app(StripeCheckout::class)->client();
        foreach ($stripe->webhookEndpoints->all(['limit' => 100])->data as $e) {
            if ($e->url === self::stripeWebhookUrl()) {
                $stripe->webhookEndpoints->delete($e->id);
            }
        }
        $endpoint = $stripe->webhookEndpoints->create([
            'url' => self::stripeWebhookUrl(),
            'enabled_events' => self::STRIPE_EVENTS,
            'description' => 'Pflanzfarm-Website '.parse_url(self::site(), PHP_URL_HOST),
        ]);

        return (string) $endpoint->secret;
    }

    /** Resend-Webhook (Newsletter-Statistik) für die aktuelle Domain anlegen; liefert das Signatur-Geheimnis. */
    public function setupResendWebhook(): string
    {
        $resend = self::resend();
        foreach ($resend->webhooks->list() as $w) {
            if (($w->endpoint ?? null) === self::resendWebhookUrl()) {
                $resend->webhooks->remove($w->id);
            }
        }

        return (string) $resend->webhooks->create(['endpoint' => self::resendWebhookUrl(), 'events' => self::RESEND_EVENTS])->signing_secret;
    }

    public static function resend(): Resend\Client
    {
        return Resend::client((string) (config('resend.api_key') ?: config('services.resend.key')));
    }

    public static function domainOf(string $email): string
    {
        return strtolower((string) substr(strrchr($email, '@') ?: '', 1));
    }
}
