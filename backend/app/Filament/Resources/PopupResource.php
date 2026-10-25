<?php

namespace App\Filament\Resources;

use App\Filament\Resources\PopupResource\Pages;
use App\Models\Popup;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;

class PopupResource extends Resource
{
    protected static ?string $model = Popup::class;

    protected static ?string $navigationIcon = 'heroicon-o-megaphone';

    protected static ?string $navigationGroup = 'Inhalte';

    protected static ?string $modelLabel = 'Popup';

    protected static ?string $pluralModelLabel = 'Saisonale Popups';

    public static function form(Form $form): Form
    {
        return $form->schema([
            Forms\Components\Section::make()->columns(2)->schema([
                Forms\Components\TextInput::make('title')->label('Titel')->required()->maxLength(80),
                Forms\Components\TextInput::make('cta_label')->label('Knopf-Beschriftung')->required()->maxLength(40),
                Forms\Components\Textarea::make('text')->label('Text')->required()->rows(3)->maxLength(300)->columnSpanFull(),
                Forms\Components\Select::make('cta_target')->label('Knopf führt zu')->options(Popup::TARGETS)->required(),
                Forms\Components\Select::make('pages')->label('Anzeigen auf')->options(Popup::PAGES)->required(),
                Forms\Components\DatePicker::make('starts_at')->label('Sichtbar ab')->native(false)->displayFormat('d.m.Y'),
                Forms\Components\DatePicker::make('ends_at')->label('Sichtbar bis')->native(false)->displayFormat('d.m.Y')->afterOrEqual('starts_at'),
                Forms\Components\TextInput::make('delay')->label('Verzögerung (Sekunden)')->numeric()->minValue(0)->maxValue(30)->default(1),
                Forms\Components\Toggle::make('active')->label('Aktiv')->default(true)->inline(false),
                Forms\Components\FileUpload::make('image')->label('Bild')->image()->imageEditor()->disk('public')->directory('popups')->maxSize(5120)->columnSpanFull(),
            ]),
            Forms\Components\Placeholder::make('hint')->label('')->content('Es wird jeweils das aktive Popup gezeigt, dessen Zeitraum das heutige Datum enthält – pro Besuch einmal.'),
        ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->defaultSort('starts_at', 'desc')
            ->columns([
                Tables\Columns\ImageColumn::make('image')->label('')->disk('public'),
                Tables\Columns\TextColumn::make('title')->label('Titel')->searchable(),
                Tables\Columns\TextColumn::make('starts_at')->label('Ab')->date('d.m.Y'),
                Tables\Columns\TextColumn::make('ends_at')->label('Bis')->date('d.m.Y'),
                Tables\Columns\TextColumn::make('live')->label('Jetzt sichtbar')->state(fn (Popup $record) => Popup::query()->current()->whereKey($record->id)->exists() ? 'Ja' : 'Nein')
                    ->badge()->color(fn ($state) => $state === 'Ja' ? 'success' : 'gray'),
                Tables\Columns\ToggleColumn::make('active')->label('Aktiv'),
            ])
            ->actions([Tables\Actions\EditAction::make(), Tables\Actions\ReplicateAction::make()->label('Duplizieren'), Tables\Actions\DeleteAction::make()]);
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListPopups::route('/'),
            'create' => Pages\CreatePopup::route('/create'),
            'edit' => Pages\EditPopup::route('/{record}/edit'),
        ];
    }
}
