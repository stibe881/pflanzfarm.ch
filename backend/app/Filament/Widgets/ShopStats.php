<?php

namespace App\Filament\Widgets;

use App\Filament\Support\Money;
use App\Models\NewsletterSubscriber;
use App\Models\Order;
use Filament\Widgets\StatsOverviewWidget as BaseWidget;
use Filament\Widgets\StatsOverviewWidget\Stat;

class ShopStats extends BaseWidget
{
    protected static ?int $sort = 1;

    protected function getStats(): array
    {
        $valid = Order::query()->where('status', '!=', 'storniert')->where('payment_status', '!=', 'ausstehend');

        return [
            Stat::make('Neue Bestellungen', (clone $valid)->where('status', 'neu')->count())->description('warten auf Bestätigung')->color('warning'),
            Stat::make('Umsatz diesen Monat', Money::format((int) (clone $valid)->where('created_at', '>=', now()->startOfMonth())->sum('total'))),
            Stat::make('Offene Rechnungen', (clone $valid)->where('payment_method', 'invoice')->where('payment_status', 'offen')->count()),
            Stat::make('Newsletter-Abonnenten', NewsletterSubscriber::query()->where('status', 'bestaetigt')->count()),
        ];
    }
}
