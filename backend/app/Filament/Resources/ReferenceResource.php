<?php

namespace App\Filament\Resources;

use App\Filament\Resources\ReferenceResource\Pages;
use App\Models\Reference;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;

class ReferenceResource extends Resource
{
    protected static ?string $model = Reference::class;

    protected static ?string $navigationIcon = 'heroicon-o-photo';

    protected static ?string $navigationGroup = 'Inhalte';

    protected static ?string $modelLabel = 'Referenz';

    protected static ?string $pluralModelLabel = 'Referenzen';

    public static function form(Form $form): Form
    {
        return $form->schema([
            Forms\Components\Section::make()->columns(2)->schema([
                Forms\Components\TextInput::make('title')->label('Titel')->required(),
                Forms\Components\TextInput::make('category')->label('Kategorie')->required()->datalist(['Baumschule', 'Garten & Umbauten', 'Baumpflege']),
                Forms\Components\Textarea::make('description')->label('Beschreibung')->required()->rows(3)->columnSpanFull(),
                Forms\Components\TextInput::make('location')->label('Ort')->placeholder('z. B. Sursee LU'),
                Forms\Components\TextInput::make('year')->label('Jahr')->numeric()->minValue(2000)->maxValue(2100),
                Forms\Components\CheckboxList::make('tags')->label('Projektart (Filter)')->options(Reference::TAGS)->columns(4)->columnSpanFull(),
                Forms\Components\FileUpload::make('image')->label('Bild (nachher)')->image()->imageEditor()->disk('public')->directory('referenzen')->maxSize(5120),
                Forms\Components\FileUpload::make('before_image')->label('Vorher-Bild (optional)')->image()->imageEditor()->disk('public')->directory('referenzen')->maxSize(5120)
                    ->helperText('Mit Vorher-Bild erscheint auf der Website ein Schieberegler «vorher / nachher». Beide Fotos am besten aus dem gleichen Blickwinkel.'),
                Forms\Components\Toggle::make('on_homepage')->label('Auf der Startseite zeigen')->default(true),
                Forms\Components\Toggle::make('active')->label('Veröffentlicht')->default(true),
            ]),
        ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->defaultSort('sort')
            ->reorderable('sort')
            ->columns([
                Tables\Columns\ImageColumn::make('image')->label('')->disk('public'),
                Tables\Columns\TextColumn::make('title')->label('Titel')->searchable()->description(fn (Reference $record) => $record->category),
                Tables\Columns\TextColumn::make('location')->label('Ort'),
                Tables\Columns\TextColumn::make('year')->label('Jahr'),
                Tables\Columns\ToggleColumn::make('on_homepage')->label('Startseite'),
                Tables\Columns\ToggleColumn::make('active')->label('Veröffentlicht'),
            ])
            ->actions([Tables\Actions\EditAction::make(), Tables\Actions\DeleteAction::make()]);
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListReferences::route('/'),
            'create' => Pages\CreateReference::route('/create'),
            'edit' => Pages\EditReference::route('/{record}/edit'),
        ];
    }
}
