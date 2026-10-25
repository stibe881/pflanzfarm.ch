<?php

namespace App\Filament\Widgets;

use App\Filament\Resources\ProductResource;
use App\Models\ProductVariant;
use Filament\Tables;
use Filament\Tables\Table;
use Filament\Widgets\TableWidget as BaseWidget;

class LowStock extends BaseWidget
{
    protected static ?int $sort = 6;

    public function table(Table $table): Table
    {
        return $table
            ->heading('Knapper Lagerbestand (unter '.(int) \App\Models\Setting::get('low_stock_threshold').' Stück)')
            ->query(ProductVariant::query()->with('product')->where('active', true)->where('stock', '<', (int) \App\Models\Setting::get('low_stock_threshold'))->whereHas('product', fn ($q) => $q->where('active', true)))
            ->columns([
                Tables\Columns\TextColumn::make('product.name')->label('Produkt'),
                Tables\Columns\TextColumn::make('label')->label('Grösse'),
                Tables\Columns\TextColumn::make('stock')->label('Bestand')->badge()->color(fn ($state) => $state <= 0 ? 'danger' : 'warning'),
            ])
            ->recordUrl(fn (ProductVariant $record) => ProductResource::getUrl('edit', ['record' => $record->product_id]))
            ->paginated(false);
    }
}
