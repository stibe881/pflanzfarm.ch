<?php

namespace App\Filament\Resources;

use App\Filament\Resources\ProductResource\Pages;
use App\Filament\Support\Money;
use App\Models\Product;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Support\Str;

class ProductResource extends Resource
{
    protected static ?string $model = Product::class;

    protected static ?string $navigationIcon = 'heroicon-o-sparkles';

    protected static ?string $navigationGroup = 'Shop';

    protected static ?string $modelLabel = 'Produkt';

    protected static ?string $pluralModelLabel = 'Produkte';

    protected static ?int $navigationSort = 2;

    public static function form(Form $form): Form
    {
        return $form->schema([
            Forms\Components\Section::make('Produkt')->columns(2)->schema([
                Forms\Components\TextInput::make('name')->label('Name')->required()->maxLength(120)
                    ->live(onBlur: true)
                    ->afterStateUpdated(fn ($state, Forms\Set $set, ?Product $record) => $record ? null : $set('slug', Str::slug($state))),
                Forms\Components\TextInput::make('slug')->label('Adresse (URL)')->prefix('/produkt/')->required()->alphaDash()->unique(ignoreRecord: true),
                Forms\Components\TextInput::make('latin')->label('Botanischer Name'),
                Forms\Components\Select::make('category')->label('Kategorie')->options(Product::CATEGORIES)->required(),
                Forms\Components\Textarea::make('description')->label('Beschreibung')->rows(3)->columnSpanFull(),
                Forms\Components\TagsInput::make('traits')->label('Merkmale')->suggestions(['Immergrün', 'Pflegeleicht', 'Sonnig', 'Blütenreich', 'Naschgarten', 'Winterhart']),
                Forms\Components\TextInput::make('badge')->label('Etikett')->placeholder('z. B. Bestseller'),
                Forms\Components\TextInput::make('height_label')->label('Grössenangabe auf der Karte')->placeholder('leer = erste Grösse'),
                Forms\Components\TextInput::make('plants_per_meter')->label('Pflanzen pro Laufmeter')->numeric()->step(0.5)
                    ->helperText('Für den Hecken-Rechner. Leer lassen, wenn die Pflanze nicht im Rechner erscheinen soll.'),
                Forms\Components\FileUpload::make('image')->label('Bild')->image()->imageEditor()->disk('public')->directory('produkte')
                    ->maxSize(5120)->columnSpanFull(),
                Forms\Components\Toggle::make('price_on_request')->label('Preis auf Anfrage (nicht online bestellbar)'),
                Forms\Components\Toggle::make('active')->label('Im Shop sichtbar')->default(true),
                Forms\Components\TextInput::make('sort')->label('Reihenfolge')->numeric()->default(0),
            ]),
            Forms\Components\Section::make('Grössen, Preise und Lager')->schema([
                Forms\Components\Repeater::make('variants')->relationship()->label('')
                    ->orderColumn('sort')->reorderableWithButtons()
                    ->columns(6)
                    ->defaultItems(1)
                    ->addActionLabel('Grösse hinzufügen')
                    ->itemLabel(fn (array $state) => $state['label'] ?? null)
                    ->schema([
                        Forms\Components\TextInput::make('label')->label('Grösse / Sorte')->required()->placeholder('z. B. 80–100 cm'),
                        Money::input('price', 'Preis inkl. MWST')->required()->helperText('Grössen mit CHF 0.00 sind nicht bestellbar.'),
                        Forms\Components\TextInput::make('stock')->label('Lagerbestand')->numeric()->integer()->required()->default(0),
                        Forms\Components\Select::make('shipping_class_id')->label('Versandklasse')
                            ->relationship('shippingClass', 'name')
                            ->getOptionLabelFromRecordUsing(fn (\App\Models\ShippingClass $c) => $c->name.' ('.Money::format($c->price).')')
                            ->placeholder('Standard')
                            ->disabled(fn (Forms\Get $get) => (bool) $get('pickup_only')),
                        Forms\Components\TextInput::make('sku')->label('Artikelnummer'),
                        Forms\Components\Toggle::make('active')->label('Bestellbar')->default(true)->inline(false),
                        Forms\Components\Toggle::make('pickup_only')->label('Nur Abholung')->live()->inline(false)
                            ->helperText('Nicht lieferbar, z. B. sehr grosse Pflanzen.'),
                    ]),
            ]),
        ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->defaultSort('sort')
            ->reorderable('sort')
            ->columns([
                Tables\Columns\ImageColumn::make('image')->label('')->disk('public')->square(),
                Tables\Columns\TextColumn::make('name')->label('Name')->searchable()->description(fn (Product $record) => $record->latin),
                Tables\Columns\TextColumn::make('category')->label('Kategorie')->badge(),
                Tables\Columns\TextColumn::make('price_range')->label('Preis')->state(function (Product $record) {
                    if ($record->price_on_request) {
                        return 'auf Anfrage';
                    }
                    $p = $record->variants->where('active', true)->pluck('price');

                    return $p->isEmpty() ? '–' : ($p->min() === $p->max() ? Money::format($p->min()) : 'ab '.Money::format($p->min()));
                }),
                Tables\Columns\TextColumn::make('stock_total')->label('Lager')->state(fn (Product $record) => $record->variants->where('active', true)->sum('stock'))
                    ->badge()->color(fn ($state) => $state <= 0 ? 'danger' : ($state < 10 ? 'warning' : 'success')),
                Tables\Columns\IconColumn::make('active')->label('Sichtbar')->boolean(),
            ])
            ->modifyQueryUsing(fn ($query) => $query->with('variants'))
            ->filters([
                Tables\Filters\SelectFilter::make('category')->label('Kategorie')->options(Product::CATEGORIES),
                Tables\Filters\TernaryFilter::make('active')->label('Sichtbar'),
            ])
            ->actions([Tables\Actions\EditAction::make()])
            ->bulkActions([Tables\Actions\DeleteBulkAction::make()]);
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListProducts::route('/'),
            'create' => Pages\CreateProduct::route('/create'),
            'edit' => Pages\EditProduct::route('/{record}/edit'),
        ];
    }
}
