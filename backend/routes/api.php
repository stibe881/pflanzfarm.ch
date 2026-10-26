<?php

use App\Http\Controllers\Api\AccountController;
use App\Http\Controllers\Api\CatalogController;
use App\Http\Controllers\Api\ContactController;
use App\Http\Controllers\Api\ExtrasController;
use App\Http\Controllers\Api\NewsletterController;
use App\Http\Controllers\Api\OrderController;
use Illuminate\Support\Facades\Route;

Route::get('/catalog', CatalogController::class);

Route::middleware('throttle:forms')->group(function () {
    Route::post('/contact', ContactController::class);
    Route::post('/newsletter', [NewsletterController::class, 'subscribe']);
    Route::post('/register', [AccountController::class, 'register']);
    Route::post('/coupons/check', [ExtrasController::class, 'coupon']);
    Route::post('/stock-alerts', [ExtrasController::class, 'stockAlert']);
    Route::post('/forgot-password', [AccountController::class, 'forgotPassword']);
    Route::post('/reset-password', [AccountController::class, 'resetPassword']);
});
Route::post('/login', [AccountController::class, 'login'])->middleware('throttle:login');
Route::get('/me', [AccountController::class, 'me']);

Route::post('/orders', [OrderController::class, 'store'])->middleware('throttle:checkout');
Route::get('/orders/{number}', [OrderController::class, 'show']);
Route::get('/orders/{number}/rechnung', [OrderController::class, 'invoice']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AccountController::class, 'logout']);
    Route::put('/me', [AccountController::class, 'update']);
    Route::delete('/me', [AccountController::class, 'destroy']);
    Route::get('/me/orders', [AccountController::class, 'orders']);
    Route::post('/me/orders/{number}/cancel', [AccountController::class, 'cancelOrder'])->middleware('throttle:forms');
    Route::get('/me/export', [AccountController::class, 'export']);
    Route::put('/me/wishlist', [AccountController::class, 'wishlist'])->middleware('throttle:60,1');
    Route::post('/email/verification-notification', [AccountController::class, 'resendVerification'])->middleware('throttle:forms');
});
