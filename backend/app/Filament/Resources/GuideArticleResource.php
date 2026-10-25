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
                Forms\Components\TextInput::make('slug')->label('Adresse (URL)')->prefix('/ratgeber/')->suffix('/')->required()->alphaDash()->unique(ignoreRecord: true),
                Forms\Components\Select::make('product_id')->label('Passendes Produkt')->relationship('product', 'name')->placeholder('keines')->live(),
                Forms\Components\Textarea::make('excerpt')->label('Kurztext für Übersicht und Google')->rows(2)->maxLength(300)->columnSpanFull()
                    ->helperText('1–2 Sätze. Leer = Anfang des Textes.'),
                Forms\Components\Textarea::make('body')->label('Text')->required()->rows(12)->columnSpanFull()
                    ->helperText('Absätze mit einer Leerzeile trennen.'),
                Forms\Components\CheckboxList::make('remind_months')->label('Saisonale Erinnerung an Käuferinnen und Käufer des passenden Produkts')
                    ->options(collect(range(1, 12))->mapWithKeys(fn ($m) => [$m => \Illuminate\Support\Carbon::create(2026, $m, 1)->locale('de_CH')->isoFormat('MMMM')])->all())
                    ->columns(6)->columnSpanFull()->bulkToggleable(false)
                    ->helperText('Am 1. des gewählten Monats geht eine kurze Mail mit Link zum Artikel an alle, die das Produkt in den letzten 3 Jahren gekauft haben (einmal pro Jahr, abbestellbar). Z. B. Photinia schneiden: Juni.')
                    ->visible(fn (Forms\Get $get) => filled($get('product_id'))),
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
