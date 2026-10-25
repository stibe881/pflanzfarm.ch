<?php

use App\Http\Controllers\Api\NewsletterController;
use App\Http\Controllers\SitemapController;
use App\Http\Controllers\SpaController;
use App\Http\Controllers\StripeWebhookController;
use App\Http\Controllers\TestPaymentController;
use App\Http\Controllers\VerifyEmailController;
use Illuminate\Support\Facades\Route;

Route::get('/newsletter/bestaetigen/{token}', [NewsletterController::class, 'confirm'])->name('newsletter.confirm');
Route::match(['get', 'post'], '/newsletter/abmelden/{token}', [NewsletterController::class, 'unsubscribe'])->name('newsletter.unsubscribe');
Route::get('/email/bestaetigen/{id}/{hash}', VerifyEmailController::class)->middleware(['signed', 'throttle:6,1'])->name('verification.verify');
Route::post('/stripe/webhook', StripeWebhookController::class)->name('stripe.webhook');
Route::get('/test-zahlung/{number}', [TestPaymentController::class, 'show']);
Route::post('/test-zahlung/{number}', [TestPaymentController::class, 'complete']);

Route::get('/sitemap.xml', SitemapController::class);

// Alle übrigen Pfade liefert die Website (Single-Page-App) aus.
Route::get('/{path?}', SpaController::class)->where('path', '^(?!admin|api|livewire|filament|storage|sanctum|up|test-zahlung).*$');
