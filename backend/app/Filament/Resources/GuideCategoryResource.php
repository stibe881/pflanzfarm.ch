<?php

namespace App\Filament\Resources;

use App\Filament\Resources\GuideCategoryResource\Pages;
use App\Models\GuideCategory;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;

class GuideCategoryResource extends Resource
{
    protected static ?string $model = GuideCategory::class;

    protected static ?string $navigationIcon = 'heroicon-o-tag';

    protected static ?string $navigationGroup = 'Inhalte';

    protected static ?string $navigationLabel = 'Ratgeber-Kategorien';

    protected static ?string $modelLabel = 'Ratgeber-Kategorie';

    protected static ?string $pluralModelLabel = 'Ratgeber-Kategorien';

    public static function form(Form $form): Form
    {
        return $form->schema([
            Forms\Components\TextInput::make('name')->label('Name')->required()->maxLength(60)->unique(ignoreRecord: true)
                ->helperText('Erscheint als Filter auf der Ratgeber-Seite (nur wenn mindestens ein Artikel darin veröffentlicht ist).'),
        ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->defaultSort('sort')
            ->reorderable('sort')
            ->columns([
                Tables\Columns\TextColumn::make('name')->label('Name')->searchable(),
                Tables\Columns\TextColumn::make('articles_count')->label('Artikel')->counts('articles'),
            ])
            ->actions([
                Tables\Actions\EditAction::make(),
                Tables\Actions\DeleteAction::make()
                    ->modalDescription('Die Artikel bleiben erhalten, haben danach aber keine Kategorie mehr.'),
            ]);
    }

    public static function getPages(): array
    {
        return ['index' => Pages\ManageGuideCategories::route('/')];
    }
}
