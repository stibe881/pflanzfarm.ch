<?php

namespace App\Providers;

use App\Listeners\TrackNewsletter;
use App\Models\User;
use Illuminate\Mail\Events\MessageSent;
use Illuminate\Support\Facades\Event;
use Illuminate\Auth\Notifications\ResetPassword;
use Illuminate\Auth\Notifications\VerifyEmail;
use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Http\Request;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Facades\URL;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        //
    }

    public function boot(): void
    {
        if ($this->app->environment('production')) {
            URL::forceScheme('https');
        }

        foreach ([\App\Models\Product::class, \App\Models\ProductVariant::class, \App\Models\Order::class, \App\Models\ShippingClass::class,
            \App\Models\Popup::class, \App\Models\Reference::class, \App\Models\GuideArticle::class, \App\Models\User::class,
            \App\Models\Setting::class, \App\Models\NewsletterCampaign::class] as $model) {
            $model::observe(\App\Observers\ActivityObserver::class);
        }

        foreach ([\App\Models\Product::class, \App\Models\Reference::class, \App\Models\Popup::class] as $model) {
            $model::observe(\App\Observers\ImageObserver::class);
        }

        // Testseite: alle Mails an eine feste Adresse (Original-Empfänger steht im Betreff)
        if (($redirect = config('pflanzfarm.mail_redirect_to')) && config('pflanzfarm.test_mode')) {
            Event::listen(\Illuminate\Mail\Events\MessageSending::class, function (\Illuminate\Mail\Events\MessageSending $e) use ($redirect) {
                $to = collect($e->message->getTo())->map->getAddress()->join(', ');
                $e->message->to($redirect)->cc()->bcc()->subject('[Test an '.$to.'] '.$e->message->getSubject());
            });
        }

        // Katalog-Zwischenspeicher leeren, sobald sich Shop-Inhalte ändern (auch Lager durch Bestellungen)
        foreach ([\App\Models\Product::class, \App\Models\ProductVariant::class, \App\Models\ShippingClass::class, \App\Models\Reference::class,
            \App\Models\GuideArticle::class, \App\Models\Popup::class, \App\Models\Setting::class, \App\Models\DeliveryZone::class] as $model) {
            foreach (['saved', 'updated', 'deleted'] as $event) {
                $model::$event(fn () => \Illuminate\Support\Facades\Cache::forget(\App\Http\Controllers\Api\CatalogController::CACHE_KEY));
            }
        }

        Event::listen(MessageSent::class, [TrackNewsletter::class, 'sent']);
        Event::listen(\Resend\Laravel\Events\EmailOpened::class, [TrackNewsletter::class, 'opened']);
        Event::listen(\Resend\Laravel\Events\EmailClicked::class, [TrackNewsletter::class, 'clicked']);
        Event::listen(\Resend\Laravel\Events\EmailBounced::class, [TrackNewsletter::class, 'bounced']);
        Event::listen(\Resend\Laravel\Events\EmailComplained::class, [TrackNewsletter::class, 'bounced']);

        RateLimiter::for('forms', fn (Request $r) => Limit::perMinute(6)->by($r->ip()));
        RateLimiter::for('login', fn (Request $r) => [
            Limit::perMinute(5)->by(strtolower((string) $r->input('email')).'|'.$r->ip()),
            Limit::perMinute(20)->by($r->ip()),
        ]);
        RateLimiter::for('checkout', fn (Request $r) => Limit::perMinute(10)->by($r->ip()));

        VerifyEmail::toMailUsing(fn (User $user, string $url) => (new MailMessage)
            ->subject('Bitte bestätigen Sie Ihre E-Mail-Adresse')
            ->greeting('Willkommen bei der Pflanzfarm!')
            ->line('Bitte bestätigen Sie Ihre E-Mail-Adresse, damit Ihr Kundenkonto vollständig aktiviert wird.')
            ->action('E-Mail-Adresse bestätigen', $url)
            ->line('Falls Sie kein Konto erstellt haben, können Sie diese E-Mail ignorieren.')
            ->salutation("Freundliche Grüsse\nIhre Pflanzfarm Steinmann"));

        ResetPassword::createUrlUsing(fn (User $user, string $token) => $user->isTeam()
            ? url(route('filament.admin.auth.password-reset.reset', ['token' => $token, 'email' => $user->email], false))
            : url('/konto/?reset='.$token.'&email='.urlencode($user->email)));

        ResetPassword::toMailUsing(fn (User $user, string $token) => (new MailMessage)
            ->subject('Passwort zurücksetzen')
            ->line('Sie erhalten diese E-Mail, weil für Ihr Konto ein neues Passwort angefordert wurde.')
            ->action('Neues Passwort festlegen', ResetPassword::$createUrlCallback
                ? call_user_func(ResetPassword::$createUrlCallback, $user, $token)
                : url('/konto/?reset='.$token))
            ->line('Der Link ist 60 Minuten gültig. Falls Sie kein neues Passwort angefordert haben, müssen Sie nichts tun.')
            ->salutation("Freundliche Grüsse\nIhre Pflanzfarm Steinmann"));
    }
}
