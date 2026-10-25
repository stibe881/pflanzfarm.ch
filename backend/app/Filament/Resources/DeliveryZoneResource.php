<?php

namespace App\Filament\Resources;

use App\Filament\Resources\DeliveryZoneResource\Pages;
use App\Filament\Support\Money;
use App\Models\DeliveryZone;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;

class DeliveryZoneResource extends Resource
{
    protected static ?string $model = DeliveryZone::class;

    protected static ?string $navigationIcon = 'heroicon-o-map';

    protected static ?string $navigationGroup = 'Shop';

    protected static ?string $modelLabel = 'Lieferzone';

    protected static ?string $pluralModelLabel = 'Lieferzonen';

    protected static ?int $navigationSort = 4;

    public static function form(Form $form): Form
    {
        return $form->columns(2)->schema([
            Forms\Components\Placeholder::make('hint')->hiddenLabel()->columnSpanFull()
                ->content('Der Zuschlag kommt zu den Versandkosten der Versandklasse dazu. Es gilt die erste passende Zone (nach Reihenfolge). PLZ ohne Zone: kein Zuschlag. Ab dem Gratis-Bestellwert ist die Lieferung ganz gratis.'),
            Forms\Components\TextInput::make('name')->label('Name')->required()->maxLength(60)->placeholder('z. B. Region Luzern, Mittelland, Tessin'),
            Money::input('surcharge', 'Zuschlag')->default(0)->required(),
            Forms\Components\Repeater::make('postal_ranges')->label('PLZ-Bereiche')->columns(2)->columnSpanFull()->defaultItems(1)->minItems(1)
                ->addActionLabel('Bereich hinzufügen')
                ->schema([
                    Forms\Components\TextInput::make('from')->label('Von PLZ')->numeric()->integer()->minValue(1000)->maxValue(9999)->required(),
                    Forms\Components\TextInput::make('to')->label('Bis PLZ')->numeric()->integer()->minValue(1000)->maxValue(9999)->placeholder('leer = nur diese PLZ')
                        ->gte('from'),
                ]),
            Forms\Components\Toggle::make('deliverable')->label('Wir liefern in diese Zone')->default(true)
                ->helperText('Aus: Kundschaft mit dieser PLZ kann nur Abholung wählen.'),
            Forms\Components\TextInput::make('sort')->label('Reihenfolge')->numeric()->default(0),
        ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->defaultSort('sort')
            ->reorderable('sort')
            ->columns([
                Tables\Columns\TextColumn::make('name')->label('Zone')->weight('bold'),
                Tables\Columns\TextColumn::make('postal_ranges')->label('PLZ')->state(fn (DeliveryZone $record) => $record->rangesLabel())->wrap(),
                Tables\Columns\TextColumn::make('surcharge')->label('Zuschlag')->formatStateUsing(fn ($state) => Money::format($state)),
                Tables\Columns\IconColumn::make('deliverable')->label('Lieferung')->boolean(),
            ])
            ->actions([Tables\Actions\EditAction::make(), Tables\Actions\DeleteAction::make()])
            ->emptyStateHeading('Noch keine Lieferzonen')
            ->emptyStateDescription('Ohne Zonen gelten überall die Versandkosten der Versandklassen.');
    }

    public static function getPages(): array
    {
        return ['index' => Pages\ManageDeliveryZones::route('/')];
    }
}
