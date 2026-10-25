<?php

namespace App\Filament\Widgets;

use App\Filament\Resources\OrderResource;
use App\Filament\Support\Money;
use App\Models\Order;
use Filament\Tables;
use Filament\Tables\Table;
use Filament\Widgets\TableWidget as BaseWidget;

class LatestOrders extends BaseWidget
{
    protected static ?int $sort = 5;

    protected int|string|array $columnSpan = 'full';

    protected static ?string $heading = 'Letzte Bestellungen';

    public function table(Table $table): Table
    {
        return $table
            ->query(Order::query()->latest()->limit(8))
            ->columns([
                Tables\Columns\TextColumn::make('number')->label('Nr.'),
                Tables\Columns\TextColumn::make('created_at')->label('Datum')->dateTime('d.m.Y H:i'),
                Tables\Columns\TextColumn::make('name')->label('Kundschaft'),
                Tables\Columns\TextColumn::make('total')->label('Total')->formatStateUsing(fn ($state) => Money::format($state)),
                Tables\Columns\TextColumn::make('status')->label('Status')->badge()->formatStateUsing(fn ($state) => Order::STATUSES[$state] ?? $state)->color(fn ($state) => OrderResource::statusColor($state)),
            ])
            ->recordUrl(fn (Order $record) => OrderResource::getUrl('view', ['record' => $record]))
            ->paginated(false);
    }
}
