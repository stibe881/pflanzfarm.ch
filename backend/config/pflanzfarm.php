<?php

return [
    // Testumgebung: zeigt auf der Website einen Hinweis «Testumgebung»
    'test_mode' => (bool) env('PFLANZFARM_TEST_MODE', false),

    // Optionaler Passwortschutz für die ganze Seite (Benutzername beliebig)
    'site_password' => env('SITE_PASSWORD', ''),

    // Simulierte Zahlung statt Stripe (nur ausserhalb von APP_ENV=production möglich)
    'fake_payments' => (bool) env('STRIPE_FAKE', false) && env('APP_ENV') !== 'production',

    // Nur Testseite: alle E-Mails an diese Adresse umleiten statt an die eingegebenen Empfänger (leer = normal versenden)
    'mail_redirect_to' => env('MAIL_REDIRECT_TO', ''),

    // Unerwartete Fehler per E-Mail an die Benachrichtigungsadresse melden (max. 1× pro Stunde je Fehler)
    'error_mails' => (bool) env('ERROR_MAILS', true),
];
