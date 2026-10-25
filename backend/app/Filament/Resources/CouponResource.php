<?php

namespace App\Filament\Resources;

use App\Filament\Resources\CouponResource\Pages;
use App\Filament\Support\Money;
use App\Models\Coupon;
use App\Services\InvoicePdf;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Forms\Get;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;

class CouponResource extends Resource
{
    protected static ?string $model = Coupon::class;

    protected static ?string $navigationIcon = 'heroicon-o-gift';

    protected static ?string $navigationGroup = 'Shop';

    protected static ?string $modelLabel = 'Gutschein / Rabattcode';

    protected static ?string $pluralModelLabel = 'Gutscheine & Rabattcodes';

    protected static ?int $navigationSort = 5;

    public static function form(Form $form): Form
    {
        $chf = fn (Get $get) => $get('type') !== 'prozent';

        return $form->columns(2)->schema([
            Forms\Components\Select::make('type')->label('Art')->options(Coupon::TYPES)->default('gutschein')->required()->live()
                ->helperText(fn (Get $get) => match ($get('type')) {
                    'gutschein' => 'Wertgutschein mit Guthaben, z. B. als Geschenk. Er kann über mehrere Bestellungen aufgebraucht werden.',
                    'prozent' => 'Prozent auf die Pflanzen (nicht auf Lieferung), z. B. HERBST10 für Newsletter-Abonnenten.',
                    default => 'Fester Abzug in CHF pro Bestellung.',
                }),
            Forms\Components\TextInput::make('code')->label('Code')->required()->maxLength(40)->unique(ignoreRecord: true)
                ->default(fn () => Coupon::generateCode())
                ->helperText('Gross-/Kleinschreibung egal. Für Rabattaktionen gern sprechend, z. B. HERBST10.'),
            Money::input('amount', 'Betrag')->visible($chf)->required($chf)->dehydrated($chf)->minValue(0.05),
            Forms\Components\TextInput::make('percent')->label('Rabatt')->numeric()->integer()->minValue(1)->maxValue(100)->suffix('%')
                ->visible(fn (Get $get) => $get('type') === 'prozent')->required(fn (Get $get) => $get('type') === 'prozent')
                ->dehydrated(fn (Get $get) => $get('type') === 'prozent'),
            Forms\Components\Placeholder::make('balance_info')->label('Restguthaben')
                ->visible(fn (?Coupon $record) => $record?->type === 'gutschein')
                ->content(fn (?Coupon $record) => Money::format($record?->balance)),
            Money::input('min_order', 'Mindestbestellwert (Pflanzen)')->default(0),
            Forms\Components\TextInput::make('max_uses')->label('Höchstens einlösbar')->numeric()->integer()->minValue(1)->suffix('×')
                ->placeholder('unbegrenzt'),
            Forms\Components\DatePicker::make('valid_from')->label('Gültig ab')->native(false)->displayFormat('d.m.Y'),
            Forms\Components\DatePicker::make('valid_until')->label('Gültig bis')->native(false)->displayFormat('d.m.Y')
                ->default(fn () => now()->addYears(2)->endOfYear())
                ->helperText('Für Geschenkgutscheine empfehlen wir mindestens 2 Jahre.'),
            Forms\Components\TextInput::make('recipient')->label('Für (erscheint auf dem Gutschein)')->maxLength(80)->placeholder('z. B. Familie Muster')
                ->visible(fn (Get $get) => $get('type') === 'gutschein'),
            Forms\Components\TextInput::make('note')->label('Interne Notiz')->maxLength(160)->placeholder('z. B. verkauft am Markt, bar bezahlt'),
            Forms\Components\Toggle::make('active')->label('Aktiv')->default(true),
        ]);
    }

    /** Betrag/Prozent liegen im Feld «value» (Rappen bzw. Prozent). */
    public static function fill(array $data): array
    {
        if (($data['type'] ?? null) === 'prozent') {
            $data['percent'] = $data['value'] ?? null;
        } else {
            $data['amount'] = $data['value'] ?? null;
        }

        return $data;
    }

    public static function store(array $data, ?Coupon $record = null): array
    {
        $data['value'] = ($data['type'] === 'prozent') ? (int) $data['percent'] : (int) $data['amount'];
        unset($data['percent'], $data['amount']);
        if ($data['type'] === 'gutschein' && (! $record || $record->value !== $data['value'])) {
            // neuer Gutschein oder Betrag geändert: Restguthaben anpassen
            $data['balance'] = max(0, $data['value'] - ($record ? $record->value - (int) $record->balance : 0));
        }
        if ($data['type'] !== 'gutschein') {
            $data['balance'] = null;
        }

        return $data;
    }

    public static function table(Table $table): Table
    {
        return $table
            ->defaultSort('created_at', 'desc')
            ->columns([
                Tables\Columns\TextColumn::make('code')->label('Code')->searchable()->copyable()->weight('bold')->fontFamily('mono'),
                Tables\Columns\TextColumn::make('type')->label('Art')->badge()->formatStateUsing(fn ($state) => Coupon::TYPES[$state] ?? $state),
                Tables\Columns\TextColumn::make('value')->label('Wert')->state(fn (Coupon $record) => $record->type === 'prozent' ? $record->value.' %' : Money::format($record->value)),
                Tables\Columns\TextColumn::make('balance')->label('Rest')->formatStateUsing(fn ($state) => Money::format($state))->placeholder('–'),
                Tables\Columns\TextColumn::make('used_count')->label('Eingelöst')->state(fn (Coupon $record) => $record->used_count.($record->max_uses ? ' / '.$record->max_uses : '×')),
                Tables\Columns\TextColumn::make('valid_until')->label('Gültig bis')->date('d.m.Y')->placeholder('unbegrenzt'),
                Tables\Columns\TextColumn::make('recipient')->label('Für')->toggleable()->placeholder('–'),
                Tables\Columns\ToggleColumn::make('active')->label('Aktiv'),
            ])
            ->filters([Tables\Filters\SelectFilter::make('type')->label('Art')->options(Coupon::TYPES)])
            ->actions([
                Tables\Actions\Action::make('pdf')->label('Gutschein-PDF')->icon('heroicon-o-printer')->color('gray')
                    ->visible(fn (Coupon $record) => $record->type === 'gutschein')
                    ->action(fn (Coupon $record) => response()->streamDownload(fn () => print(app(InvoicePdf::class)->voucher($record)), 'Gutschein-'.$record->code.'.pdf')),
                Tables\Actions\EditAction::make()
                    ->mutateRecordDataUsing(fn (array $data) => self::fill($data))
                    ->using(function (Coupon $record, array $data) {
                        $record->update(self::store($data, $record));

                        return $record;
                    }),
                Tables\Actions\DeleteAction::make()->visible(fn (Coupon $record) => $record->used_count === 0),
            ])
            ->emptyStateHeading('Noch keine Gutscheine oder Rabattcodes');
    }

    public static function getPages(): array
    {
        return ['index' => Pages\ManageCoupons::route('/')];
    }
}
