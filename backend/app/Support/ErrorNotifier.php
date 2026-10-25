<?php

namespace App\Support;

use App\Mail\ErrorReport;
use App\Models\Setting;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;
use Symfony\Component\HttpKernel\Exception\HttpExceptionInterface;
use Throwable;

/**
 * Meldet unerwartete Fehler per E-Mail an die Benachrichtigungsadresse.
 * Gleiche Fehler höchstens einmal pro Stunde, damit das Postfach nicht überläuft.
 */
class ErrorNotifier
{
    private const IGNORE = [
        \Illuminate\Validation\ValidationException::class,
        \Illuminate\Auth\AuthenticationException::class,
        \Illuminate\Auth\Access\AuthorizationException::class,
        \Illuminate\Session\TokenMismatchException::class,
        \Illuminate\Database\Eloquent\ModelNotFoundException::class,
    ];

    public static function report(Throwable $e): void
    {
        if (! config('pflanzfarm.error_mails') || app()->environment('local', 'testing')) {
            return;
        }
        if ($e instanceof HttpExceptionInterface && $e->getStatusCode() < 500) {
            return;
        }
        foreach (self::IGNORE as $class) {
            if ($e instanceof $class) {
                return;
            }
        }

        $signature = sha1(get_class($e).'|'.$e->getFile().'|'.$e->getLine());
        if (! Cache::add('error-mail:'.$signature, true, now()->addHour())) {
            return;
        }

        try {
            $to = Setting::get('notify_email');
            if (! $to) {
                return;
            }
            $request = app()->runningInConsole() ? null : request();
            $body = implode("\n", array_filter([
                'Auf '.config('app.url').' ist ein Fehler aufgetreten.',
                '',
                'Fehler: '.get_class($e),
                'Meldung: '.Str::limit($e->getMessage(), 500),
                'Ort: '.str_replace(base_path().'/', '', $e->getFile()).':'.$e->getLine(),
                'Zeit: '.now()->format('d.m.Y H:i:s'),
                $request ? 'Adresse: '.$request->method().' '.$request->fullUrl() : 'Konsole / Hintergrundaufgabe',
                $request?->user() ? 'Angemeldet: '.$request->user()->email : null,
                '',
                'Gleiche Fehler werden höchstens einmal pro Stunde gemeldet. Details stehen im Log (storage/logs).',
                '',
                Str::limit($e->getTraceAsString(), 3000),
            ], fn ($l) => $l !== null));

            Mail::to($to)->send(new ErrorReport(Str::limit(class_basename($e).' – '.$e->getMessage(), 90), $body));
        } catch (Throwable) {
            // Mailversand darf nie selbst einen Fehler auslösen
        }
    }
}
