<?php

namespace App\Support;

use Illuminate\Contracts\Mail\Mailable;
use Illuminate\Support\Facades\Mail;
use Throwable;

/**
 * E-Mail senden, ohne dass ein Versandfehler (z. B. Resend-Domain nicht bestätigt) die Bestellung
 * oder die Anfrage der Kundschaft abbricht. Fehler werden protokolliert und gemeldet.
 */
class SafeMail
{
    public static function send(mixed $to, Mailable $mail): bool
    {
        try {
            Mail::to($to)->send($mail);

            return true;
        } catch (Throwable $e) {
            report($e);

            return false;
        }
    }
}
