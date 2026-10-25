<?php

namespace App\Filament\Widgets;

use App\Models\Order;
use Filament\Widgets\ChartWidget;

class DeliveryMixChart extends ChartWidget
{
    protected static ?string $heading = 'Lieferung vs. Abholung (12 Monate)';

    protected static ?int $sort = 4;

    protected static ?string $maxHeight = '260px';

    protected function getData(): array
    {
        $counts = Order::query()->where('status', '!=', 'storniert')->where('payment_status', '!=', 'ausstehend')
            ->where('created_at', '>=', now()->subYear())->get(['delivery_method'])->countBy('delivery_method');

        return [
            'datasets' => [[
                'data' => [(int) ($counts['lieferung'] ?? 0), (int) ($counts['abholung'] ?? 0)],
                'backgroundColor' => ['#24493a', '#b9cdb3'],
            ]],
            'labels' => ['Lieferung', 'Abholung'],
        ];
    }

    protected function getType(): string
    {
        return 'doughnut';
    }

    protected function getOptions(): array
    {
        return ['scales' => ['x' => ['display' => false], 'y' => ['display' => false]]];
    }
}
