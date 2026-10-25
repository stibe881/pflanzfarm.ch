<?php

namespace App\Filament\Widgets;

use App\Models\Order;
use Filament\Widgets\ChartWidget;

class RevenueChart extends ChartWidget
{
    protected static ?string $heading = 'Umsatz pro Monat (CHF)';

    protected static ?int $sort = 2;

    protected int|string|array $columnSpan = ['md' => 2, 'xl' => 2];

    protected static ?string $maxHeight = '260px';

    protected function getData(): array
    {
        $start = now()->startOfMonth()->subMonths(11);
        $orders = Order::query()->where('status', '!=', 'storniert')->where('payment_status', '!=', 'ausstehend')
            ->where('created_at', '>=', $start)->get(['total', 'created_at']);
        $months = collect(range(0, 11))->map(fn ($i) => $start->copy()->addMonths($i));
        $byMonth = $orders->groupBy(fn ($o) => $o->created_at->format('Y-m'));

        return [
            'datasets' => [[
                'label' => 'Umsatz',
                'data' => $months->map(fn ($m) => round(($byMonth[$m->format('Y-m')] ?? collect())->sum('total') / 100))->all(),
                'backgroundColor' => '#24493a',
                'borderRadius' => 4,
            ]],
            'labels' => $months->map(fn ($m) => $m->locale('de_CH')->isoFormat('MMM YY'))->all(),
        ];
    }

    protected function getType(): string
    {
        return 'bar';
    }

    protected function getOptions(): array
    {
        return ['plugins' => ['legend' => ['display' => false]]];
    }
}
