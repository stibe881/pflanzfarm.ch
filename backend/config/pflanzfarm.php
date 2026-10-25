<?php

return [
    // Testumgebung: zeigt auf der Website einen Hinweis «Testumgebung»
    'test_mode' => (bool) env('PFLANZFARM_TEST_MODE', false),

    // Optionaler Passwortschutz für die ganze Seite (Benutzername beliebig)
    'site_password' => env('SITE_PASSWORD', ''),

    // Simulierte Zahlung statt Stripe (nur ausserhalb von APP_ENV=production möglich)
    'fake_payments' => (bool) env('STRIPE_FAKE', false) && env('APP_ENV') !== 'production',
];
