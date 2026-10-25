<?php

namespace App\Filament\Widgets;

use App\Models\OrderItem;
use Filament\Widgets\ChartWidget;

class TopProductsChart extends ChartWidget
{
    protected static ?string $heading = 'Top-Pflanzen (Stück, letzte 12 Monate)';

    protected static ?int $sort = 3;

    protected static ?string $maxHeight = '260px';

    protected function getData(): array
    {
        $top = OrderItem::query()
            ->whereHas('order', fn ($q) => $q->where('status', '!=', 'storniert')->where('payment_status', '!=', 'ausstehend')->where('created_at', '>=', now()->subYear()))
            ->selectRaw('product_name, SUM(quantity) as qty')->groupBy('product_name')->orderByDesc('qty')->limit(6)->get();

        return [
            'datasets' => [[
                'label' => 'Stück',
                'data' => $top->pluck('qty')->map(fn ($v) => (int) $v)->all(),
                'backgroundColor' => '#d79a7e',
                'borderRadius' => 4,
            ]],
            'labels' => $top->pluck('product_name')->all(),
        ];
    }

    protected function getType(): string
    {
        return 'bar';
    }

    protected function getOptions(): array
    {
        return ['indexAxis' => 'y', 'plugins' => ['legend' => ['display' => false]]];
    }
}
