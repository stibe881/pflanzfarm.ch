<?php

namespace App\Filament\Resources\CustomerResource\RelationManagers;

use App\Filament\Resources\OrderResource;
use App\Filament\Support\Money;
use App\Models\Order;
use Filament\Resources\RelationManagers\RelationManager;
use Filament\Tables;
use Filament\Tables\Table;

class OrdersRelationManager extends RelationManager
{
    protected static string $relationship = 'orders';

    protected static ?string $title = 'Bestellungen';

    public function table(Table $table): Table
    {
        return $table
            ->defaultSort('created_at', 'desc')
            ->columns([
                Tables\Columns\TextColumn::make('number')->label('Nr.')->weight('bold'),
                Tables\Columns\TextColumn::make('created_at')->label('Datum')->date('d.m.Y'),
                Tables\Columns\TextColumn::make('items_summary')->label('Artikel')->wrap()
                    ->state(fn (Order $record) => $record->items->map(fn ($i) => $i->quantity.' × '.$i->product_name)->join(', ')),
                Tables\Columns\TextColumn::make('total')->label('Total')->formatStateUsing(fn ($state) => Money::format($state)),
                Tables\Columns\TextColumn::make('status')->label('Status')->badge()->formatStateUsing(fn ($state) => Order::STATUSES[$state] ?? $state)
                    ->color(fn ($state) => OrderResource::statusColor($state)),
                Tables\Columns\TextColumn::make('payment_status')->label('Zahlung')->badge()->formatStateUsing(fn ($state) => Order::PAYMENT_STATUSES[$state] ?? $state)
                    ->color(fn ($state) => $state === 'bezahlt' ? 'success' : 'warning'),
            ])
            ->modifyQueryUsing(fn ($query) => $query->with('items'))
            ->recordUrl(fn (Order $record) => OrderResource::getUrl('view', ['record' => $record]))
            ->actions([]);
    }
}
