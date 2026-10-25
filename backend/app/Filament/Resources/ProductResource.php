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
                Forms\Components\FileUpload::make('image')->label('Hauptbild')->image()->imageEditor()->disk('public')->directory('produkte')
                    ->maxSize(5120),
                Forms\Components\FileUpload::make('gallery')->label('Weitere Bilder (Galerie)')->image()->multiple()->reorderable()->appendFiles()
                    ->maxFiles(8)->disk('public')->directory('produkte')->maxSize(5120)->panelLayout('grid')
                    ->helperText('Bis 8 Bilder, z. B. Wuchs, Blüte, Hecke nach einem Jahr. Reihenfolge per Ziehen.'),
                Forms\Components\Toggle::make('price_on_request')->label('Preis auf Anfrage (nicht online bestellbar)'),
                Forms\Components\Toggle::make('active')->label('Im Shop sichtbar')->default(true),
                Forms\Components\TextInput::make('sort')->label('Reihenfolge')->numeric()->default(0),
            ]),
            Forms\Components\Section::make('Steckbrief und Shop-Filter')->collapsible()->columns(3)
                ->description('Erscheint auf der Produktseite als Steckbrief, wird für die Filter im Shop und für die Hecken-Vorschau im Rechner verwendet.')
                ->schema([
                    Forms\Components\CheckboxList::make('locations')->label('Standort')->options(Product::LOCATIONS)->columns(3)->columnSpan(2),
                    Forms\Components\Toggle::make('evergreen')->label('Immergrün')->inline(false),
                    Forms\Components\CheckboxList::make('uses')->label('Verwendung')->options(Product::USES)->columns(3)->columnSpanFull(),
                    Forms\Components\TextInput::make('height_min_cm')->label('Endhöhe von')->numeric()->integer()->suffix('cm')->minValue(10)->maxValue(5000),
                    Forms\Components\TextInput::make('height_max_cm')->label('Endhöhe bis')->numeric()->integer()->suffix('cm')->minValue(10)->maxValue(5000)->gte('height_min_cm'),
                    Forms\Components\TextInput::make('growth_cm')->label('Zuwachs pro Jahr')->numeric()->integer()->suffix('cm')->minValue(1)->maxValue(300)
                        ->helperText('Durchschnitt, für die Hecken-Vorschau'),
                    Forms\Components\TextInput::make('hardiness')->label('Winterhärte')->placeholder('z. B. bis −25 °C')->maxLength(40),
                    Forms\Components\CheckboxList::make('planting_months')->label('Pflanzzeit')->columnSpan(2)->columns(6)
                        ->options(collect(range(1, 12))->mapWithKeys(fn ($m) => [$m => \Illuminate\Support\Carbon::create(2026, $m, 1)->locale('de_CH')->isoFormat('MMM')])->all()),
                ]),
            Forms\Components\Section::make('Mengenrabatt')->collapsible()->collapsed(fn (?Product $record) => empty($record?->volume_discounts))
                ->description('Gilt je Grösse ab der angegebenen Stückzahl, z. B. ab 50 Stück 10 %. Es zählt die höchste erreichte Stufe.')
                ->schema([
                    Forms\Components\Repeater::make('volume_discounts')->label('')->columns(2)->defaultItems(0)->addActionLabel('Rabattstufe hinzufügen')
                        ->schema([
                            Forms\Components\TextInput::make('min_qty')->label('Ab Stück')->numeric()->integer()->minValue(2)->required(),
                            Forms\Components\TextInput::make('percent')->label('Rabatt')->numeric()->integer()->minValue(1)->maxValue(90)->suffix('%')->required(),
                        ]),
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
                        Money::input('planting_price', 'Pflanzservice/Stk.')->placeholder('Standard')
                            ->dehydrateStateUsing(fn ($state) => $state === null || $state === '' ? null : (int) round(((float) $state) * 100))
                            ->helperText('Leer = Standard aus Einstellungen'),
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
            ->actions([
                Tables\Actions\EditAction::make(),
                Tables\Actions\Action::make('duplicate')->label('Duplizieren')->icon('heroicon-o-document-duplicate')->color('gray')
                    ->requiresConfirmation()->modalDescription('Legt eine Kopie mit allen Grössen und Preisen an (Lager 0, nicht sichtbar), z. B. für eine neue Sorte.')
                    ->action(function (Product $record) {
                        $copy = self::duplicate($record);
                        \Filament\Notifications\Notification::make()->title('Kopie angelegt')->success()->send();

                        return redirect(self::getUrl('edit', ['record' => $copy]));
                    }),
            ])
            ->bulkActions([Tables\Actions\DeleteBulkAction::make()]);
    }

    public static function duplicate(Product $product): Product
    {
        $slug = $product->slug.'-kopie';
        for ($i = 2; Product::query()->where('slug', $slug)->exists(); $i++) {
            $slug = $product->slug.'-kopie-'.$i;
        }
        $copy = $product->replicate(['slug', 'name', 'active']);
        $copy->fill(['slug' => $slug, 'name' => $product->name.' (Kopie)', 'active' => false])->save();
        foreach ($product->variants as $v) {
            $copy->variants()->create($v->replicate(['product_id', 'stock', 'low_stock_notified_at', 'counted_at'])->fill(['stock' => 0])->toArray());
        }

        return $copy;
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
