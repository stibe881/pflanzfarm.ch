<?php

namespace App\Filament\Resources;

use App\Filament\Resources\GuideArticleResource\Pages;
use App\Models\GuideArticle;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Support\Str;

class GuideArticleResource extends Resource
{
    protected static ?string $model = GuideArticle::class;

    protected static ?string $navigationIcon = 'heroicon-o-book-open';

    protected static ?string $navigationGroup = 'Inhalte';

    protected static ?string $modelLabel = 'Ratgeber-Artikel';

    protected static ?string $pluralModelLabel = 'Ratgeber';

    public static function form(Form $form): Form
    {
        return $form->schema([
            Forms\Components\Section::make()->columns(2)->schema([
                Forms\Components\TextInput::make('title')->label('Titel')->required()->columnSpanFull()
                    ->live(onBlur: true)
                    ->afterStateUpdated(fn ($state, Forms\Set $set, ?GuideArticle $record) => $record ? null : $set('slug', Str::slug($state))),
                Forms\Components\TextInput::make('slug')->label('Anker (URL)')->prefix('/ratgeber/#')->required()->alphaDash()->unique(ignoreRecord: true),
                Forms\Components\Select::make('product_id')->label('Passendes Produkt')->relationship('product', 'name')->placeholder('keines'),
                Forms\Components\Textarea::make('body')->label('Text')->required()->rows(12)->columnSpanFull()
                    ->helperText('Absätze mit einer Leerzeile trennen.'),
                Forms\Components\Toggle::make('published')->label('Veröffentlicht')->default(true),
            ]),
        ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->defaultSort('sort')
            ->reorderable('sort')
            ->columns([
                Tables\Columns\TextColumn::make('title')->label('Titel')->searchable()->wrap(),
                Tables\Columns\TextColumn::make('product.name')->label('Produkt')->placeholder('–'),
                Tables\Columns\ToggleColumn::make('published')->label('Veröffentlicht'),
                Tables\Columns\TextColumn::make('updated_at')->label('Geändert')->date('d.m.Y'),
            ])
            ->actions([Tables\Actions\EditAction::make(), Tables\Actions\DeleteAction::make()]);
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListGuideArticles::route('/'),
            'create' => Pages\CreateGuideArticle::route('/create'),
            'edit' => Pages\EditGuideArticle::route('/{record}/edit'),
        ];
    }
}
