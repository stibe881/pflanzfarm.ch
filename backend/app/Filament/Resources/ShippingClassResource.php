<?php

namespace App\Filament\Resources;

use App\Filament\Resources\ShippingClassResource\Pages;
use App\Filament\Support\Money;
use App\Models\ShippingClass;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;

class ShippingClassResource extends Resource
{
    protected static ?string $model = ShippingClass::class;

    protected static ?string $navigationIcon = 'heroicon-o-truck';

    protected static ?string $navigationGroup = 'Shop';

    protected static ?string $modelLabel = 'Versandklasse';

    protected static ?string $pluralModelLabel = 'Versandklassen';

    protected static ?int $navigationSort = 3;

    public static function form(Form $form): Form
    {
        return $form->schema([
            Forms\Components\Section::make()
                ->description('Jede Grösse eines Produkts hat eine Versandklasse. Im Warenkorb zählt die teuerste Klasse – egal wie viele Artikel. Ab dem Gratis-Bestellwert (Einstellungen) ist die Lieferung gratis.')
                ->columns(2)->schema([
                    Forms\Components\TextInput::make('name')->label('Name')->required()->maxLength(60)->placeholder('z. B. Paket, Kleinlieferung, Grosslieferung'),
                    Money::input('price', 'Versandkosten')->required(),
                    Forms\Components\TextInput::make('description')->label('Beschreibung (für Kundschaft)')->maxLength(160)->placeholder('z. B. Versand per Post, 2–3 Arbeitstage')->columnSpanFull(),
                    Forms\Components\Toggle::make('is_default')->label('Standardklasse für Grössen ohne eigene Klasse'),
                ]),
        ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->defaultSort('sort')
            ->reorderable('sort')
            ->columns([
                Tables\Columns\TextColumn::make('name')->label('Name')->description(fn (ShippingClass $record) => $record->description),
                Tables\Columns\TextColumn::make('price')->label('Versandkosten')->formatStateUsing(fn ($state) => Money::format($state)),
                Tables\Columns\TextColumn::make('variants_count')->label('Grössen')->counts('variants'),
                Tables\Columns\IconColumn::make('is_default')->label('Standard')->boolean(),
            ])
            ->actions([
                Tables\Actions\EditAction::make(),
                Tables\Actions\DeleteAction::make()->visible(fn (ShippingClass $record) => ! $record->is_default)
                    ->modalDescription('Grössen mit dieser Klasse erhalten danach die Standardklasse.'),
            ]);
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListShippingClasses::route('/'),
            'create' => Pages\CreateShippingClass::route('/create'),
            'edit' => Pages\EditShippingClass::route('/{record}/edit'),
        ];
    }
}
