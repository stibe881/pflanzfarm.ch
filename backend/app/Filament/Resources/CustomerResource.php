<?php

namespace App\Filament\Resources;

use App\Filament\Resources\CustomerResource\Pages;
use App\Filament\Resources\CustomerResource\RelationManagers\OrdersRelationManager;
use App\Filament\Support\Money;
use App\Models\Customer;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Infolists;
use Filament\Infolists\Infolist;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;

/** Kundenkartei mit allen Bestellungen, Umsatz, offenen Rechnungen und Notizen – auch ohne Kundenkonto. */
class CustomerResource extends Resource
{
    protected static ?string $model = Customer::class;

    protected static ?string $navigationIcon = 'heroicon-o-identification';

    protected static ?string $navigationGroup = 'Shop';

    protected static ?string $modelLabel = 'Kunde/Kundin';

    protected static ?string $pluralModelLabel = 'Kundenkartei';

    protected static ?string $recordTitleAttribute = 'name';

    protected static ?int $navigationSort = 2;

    public static function getGloballySearchableAttributes(): array
    {
        return ['name', 'email', 'phone', 'city'];
    }

    public static function getEloquentQuery(): Builder
    {
        return parent::getEloquentQuery()
            ->withCount(['orders as orders_count' => fn ($q) => $q->where('status', '!=', 'storniert')])
            ->withSum(['orders as revenue' => fn ($q) => $q->where('status', '!=', 'storniert')->where('payment_status', '!=', 'ausstehend')], 'total')
            ->withCount(['orders as open_invoices' => fn ($q) => $q->where('payment_method', 'invoice')->where('payment_status', 'offen')->where('status', '!=', 'storniert')])
            ->withMax('orders as last_order_at', 'created_at');
    }

    public static function form(Form $form): Form
    {
        return $form->schema([
            Forms\Components\Section::make()->columns(2)->schema([
                Forms\Components\TextInput::make('name')->label('Name')->required()->maxLength(120),
                Forms\Components\TextInput::make('email')->label('E-Mail')->email()->unique(ignoreRecord: true),
                Forms\Components\TextInput::make('phone')->label('Telefon')->tel(),
                Forms\Components\TextInput::make('street')->label('Strasse'),
                Forms\Components\TextInput::make('postal_code')->label('PLZ'),
                Forms\Components\TextInput::make('city')->label('Ort'),
                Forms\Components\Textarea::make('notes')->label('Interne Notizen')->rows(4)->columnSpanFull()
                    ->placeholder('z. B. Zufahrt nur über Feldweg, Hund im Garten, bevorzugt vormittags')
                    ->helperText('Nur für das Team sichtbar. Erscheint auch bei jeder Bestellung dieser Person.'),
            ]),
        ]);
    }

    public static function infolist(Infolist $infolist): Infolist
    {
        return $infolist->schema([
            Infolists\Components\Section::make()->columns(4)->schema([
                Infolists\Components\TextEntry::make('orders_count')->label('Bestellungen'),
                Infolists\Components\TextEntry::make('revenue')->label('Umsatz total')->formatStateUsing(fn ($state) => Money::format((int) $state))->weight('bold'),
                Infolists\Components\TextEntry::make('open_invoices')->label('Offene Rechnungen')->badge()->color(fn ($state) => $state ? 'warning' : 'gray'),
                Infolists\Components\TextEntry::make('last_order_at')->label('Letzte Bestellung')->dateTime('d.m.Y')->placeholder('–'),
            ]),
            Infolists\Components\Section::make('Kontakt')->columns(3)->schema([
                Infolists\Components\TextEntry::make('email')->label('E-Mail')->copyable()->placeholder('–'),
                Infolists\Components\TextEntry::make('phone')->label('Telefon')->placeholder('–')
                    ->url(fn (Customer $record) => $record->phone ? 'tel:'.preg_replace('/[^\d+]/', '', $record->phone) : null),
                Infolists\Components\TextEntry::make('address')->label('Adresse')
                    ->state(fn (Customer $record) => $record->street ? "{$record->street}, {$record->postal_code} {$record->city}" : '–'),
                Infolists\Components\TextEntry::make('user.email')->label('Kundenkonto')->placeholder('kein Konto'),
                Infolists\Components\TextEntry::make('notes')->label('Interne Notizen')->placeholder('–')->columnSpanFull(),
            ]),
        ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->defaultSort('last_order_at', 'desc')
            ->columns([
                Tables\Columns\TextColumn::make('name')->label('Name')->searchable()->weight('bold')
                    ->description(fn (Customer $record) => $record->email ?: $record->phone),
                Tables\Columns\TextColumn::make('city')->label('Ort')->searchable()->description(fn (Customer $record) => $record->postal_code),
                Tables\Columns\TextColumn::make('orders_count')->label('Bestellungen')->sortable(),
                Tables\Columns\TextColumn::make('revenue')->label('Umsatz')->formatStateUsing(fn ($state) => Money::format((int) $state))->sortable(),
                Tables\Columns\TextColumn::make('open_invoices')->label('Offen')->badge()->color(fn ($state) => $state ? 'warning' : 'gray'),
                Tables\Columns\TextColumn::make('last_order_at')->label('Letzte Bestellung')->dateTime('d.m.Y')->sortable(),
                Tables\Columns\IconColumn::make('notes')->label('Notiz')->boolean()->state(fn (Customer $record) => filled($record->notes))
                    ->trueIcon('heroicon-o-chat-bubble-left-ellipsis')->falseIcon('')->toggleable(),
            ])
            ->filters([
                Tables\Filters\Filter::make('open')->label('Mit offenen Rechnungen')->query(fn ($q) => $q->whereHas('orders', fn ($o) => $o->where('payment_method', 'invoice')->where('payment_status', 'offen')->where('status', '!=', 'storniert'))),
                Tables\Filters\TernaryFilter::make('user_id')->label('Kundenkonto')->nullable(),
            ])
            ->actions([Tables\Actions\ViewAction::make(), Tables\Actions\EditAction::make()]);
    }

    public static function getRelations(): array
    {
        return [OrdersRelationManager::class];
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListCustomers::route('/'),
            'view' => Pages\ViewCustomer::route('/{record}'),
            'edit' => Pages\EditCustomer::route('/{record}/edit'),
        ];
    }
}
