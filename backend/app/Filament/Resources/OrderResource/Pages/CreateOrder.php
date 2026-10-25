<?php

namespace App\Filament\Resources\OrderResource\Pages;

use App\Filament\Resources\OrderResource;
use App\Filament\Support\Money;
use App\Models\Order;
use App\Models\ProductVariant;
use App\Models\User;
use App\Services\OrderService;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Forms\Get;
use Filament\Forms\Set;
use Filament\Resources\Pages\CreateRecord;
use Illuminate\Database\Eloquent\Model;

/** Bestellung erfassen, z. B. telefonisch oder vor Ort im Verkauf. Bestand und Rabatte wie im Shop. */
class CreateOrder extends CreateRecord
{
    protected static string $resource = OrderResource::class;

    protected static ?string $title = 'Bestellung erfassen';

    protected static bool $canCreateAnother = false;

    public function form(Form $form): Form
    {
        return $form->schema([
            Forms\Components\Section::make('Kundschaft')->columns(3)->schema([
                Forms\Components\Select::make('user_id')->label('Bestehendes Kundenkonto (optional)')->columnSpanFull()
                    ->searchable()->live()
                    ->getSearchResultsUsing(fn (string $search) => User::query()->where('role', 'customer')
                        ->where(fn ($q) => $q->where('name', 'like', "%{$search}%")->orWhere('email', 'like', "%{$search}%"))
                        ->limit(20)->get()->mapWithKeys(fn (User $u) => [$u->id => "{$u->name} ({$u->email})"]))
                    ->getOptionLabelUsing(fn ($value) => ($u = User::query()->find($value)) ? "{$u->name} ({$u->email})" : null)
                    ->afterStateUpdated(function ($state, Set $set) {
                        if ($u = User::query()->find($state)) {
                            foreach (['name', 'email', 'phone', 'street', 'postal_code', 'city'] as $f) {
                                $set($f, $u->{$f});
                            }
                        }
                    }),
                Forms\Components\TextInput::make('name')->label('Name')->required()->maxLength(120),
                Forms\Components\TextInput::make('phone')->label('Telefon')->tel()->maxLength(40),
                Forms\Components\TextInput::make('email')->label('E-Mail')->email()->maxLength(160)->live(onBlur: true)
                    ->helperText('Optional. Ohne E-Mail gibt es keine Bestätigung per Mail.'),
            ]),
            Forms\Components\Section::make('Artikel')->schema([
                Forms\Components\Repeater::make('items')->label('')->columns(6)->minItems(1)->defaultItems(1)->live()
                    ->addActionLabel('Artikel hinzufügen')
                    ->schema([
                        Forms\Components\Select::make('variant_id')->label('Pflanze / Grösse')->columnSpan(4)->required()->searchable()->live()
                            ->options(fn () => self::variantOptions()),
                        Forms\Components\TextInput::make('quantity')->label('Menge')->numeric()->integer()->minValue(1)->default(1)->required()
                            ->columnSpan(2)->live(debounce: 400),
                    ]),
            ]),
            Forms\Components\Section::make('Lieferung und Zahlung')->columns(3)->schema([
                Forms\Components\Radio::make('delivery_method')->label('Lieferart')->options(Order::DELIVERY_METHODS)->default('abholung')->required()->live(),
                Forms\Components\Radio::make('payment_method')->label('Zahlungsart')->required()->default('invoice')->live()
                    ->options(['invoice' => 'Rechnung', 'cash' => 'Bar / vor Ort']),
                Forms\Components\Toggle::make('paid')->label('Bereits bezahlt')->inline(false)
                    ->helperText('z. B. bar oder mit TWINT vor Ort kassiert'),
                Forms\Components\TextInput::make('street')->label('Strasse')->required(fn (Get $get) => $get('delivery_method') === 'lieferung')
                    ->visible(fn (Get $get) => $get('delivery_method') === 'lieferung'),
                Forms\Components\TextInput::make('postal_code')->label('PLZ')->required(fn (Get $get) => $get('delivery_method') === 'lieferung')
                    ->visible(fn (Get $get) => $get('delivery_method') === 'lieferung'),
                Forms\Components\TextInput::make('city')->label('Ort')->required(fn (Get $get) => $get('delivery_method') === 'lieferung')
                    ->visible(fn (Get $get) => $get('delivery_method') === 'lieferung'),
                Money::input('shipping_override', 'Lieferkosten')->placeholder('automatisch')->live(onBlur: true)
                    ->dehydrateStateUsing(fn ($state) => $state === null || $state === '' ? null : (int) round(((float) $state) * 100))
                    ->helperText('Leer = gemäss Versandklassen')
                    ->visible(fn (Get $get) => $get('delivery_method') === 'lieferung'),
                Forms\Components\Textarea::make('note')->label('Bemerkung')->columnSpanFull(),
            ]),
            Forms\Components\Section::make('Termin und Status')->columns(3)->schema([
                ...OrderResource::scheduleFields(),
                Forms\Components\Select::make('status')->label('Status')->options(['neu' => 'Neu', 'bestaetigt' => 'Bestätigt'])->default('bestaetigt')->required(),
                Forms\Components\Toggle::make('send_confirmation')->label('Bestellbestätigung per E-Mail senden')->default(true)
                    ->visible(fn (Get $get) => filled($get('email'))),
            ]),
            Forms\Components\Section::make('Zusammenfassung')->schema([
                Forms\Components\Placeholder::make('summary')->label('')->content(fn (Get $get) => self::summary($get)),
            ]),
        ]);
    }

    protected function handleRecordCreation(array $data): Model
    {
        $items = collect($data['items'] ?? [])->filter(fn ($i) => ! empty($i['variant_id']))->groupBy('variant_id')
            ->map(fn ($g, $id) => ['variant_id' => (int) $id, 'quantity' => (int) $g->sum('quantity')])->values()->all();

        $service = app(OrderService::class);
        $order = $service->create($data, $items, User::query()->find($data['user_id'] ?? null), 'admin');
        if ($data['paid'] ?? false) {
            $order->update(['payment_status' => 'bezahlt', 'paid_at' => now()]);
        }
        if (($data['send_confirmation'] ?? false) && $order->email) {
            $order->mailCustomer(new \App\Mail\OrderConfirmation($order->fresh('items')));
        }

        return $order;
    }

    protected function getRedirectUrl(): string
    {
        return OrderResource::getUrl('view', ['record' => $this->record]);
    }

    /** @return array<string, array<int, string>> nach Produkt gruppiert */
    private static function variantOptions(): array
    {
        return ProductVariant::query()->with('product')->where('active', true)->where('price', '>', 0)
            ->whereHas('product', fn ($q) => $q->where('active', true)->where('price_on_request', false))
            ->get()->sortBy(fn ($v) => [$v->product->sort, $v->product->name, $v->sort])
            ->groupBy(fn ($v) => $v->product->name)
            ->map(fn ($g) => $g->mapWithKeys(fn (ProductVariant $v) => [$v->id => $v->label.' · '.Money::format($v->price).' · Lager '.$v->stock.($v->pickup_only ? ' · nur Abholung' : '')])->all())
            ->all();
    }

    private static function summary(Get $get): string
    {
        $variants = ProductVariant::query()->with('product')->whereKey(collect($get('items') ?? [])->pluck('variant_id')->filter())->get()->keyBy('id');
        $subtotal = 0;
        $discount = 0;
        foreach ($get('items') ?? [] as $item) {
            $v = $variants[$item['variant_id'] ?? 0] ?? null;
            $qty = max(0, (int) ($item['quantity'] ?? 0));
            if (! $v) {
                continue;
            }
            $unit = (int) round($v->price * (100 - $v->product->discountFor($qty)) / 100 / 5) * 5;
            $subtotal += $unit * $qty;
            $discount += ($v->price - $unit) * $qty;
        }
        $override = $get('shipping_override');
        $shipping = $get('delivery_method') !== 'lieferung' ? 0
            : (filled($override) ? (int) round(((float) $override) * 100) : OrderService::shippingFor($subtotal, $variants->values()));

        return 'Artikel '.Money::format($subtotal).($discount ? ' (inkl. Mengenrabatt −'.Money::format($discount).')' : '')
            .' · Lieferung '.Money::format($shipping).' · Total '.Money::format($subtotal + $shipping);
    }
}
