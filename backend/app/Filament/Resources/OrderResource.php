<?php

namespace App\Filament\Resources;

use App\Filament\Resources\OrderResource\Pages;
use App\Filament\Support\Money;
use App\Mail\OrderConfirmation;
use App\Mail\OrderStatusUpdate;
use App\Models\Order;
use App\Services\InvoicePdf;
use App\Services\OrderService;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Infolists;
use Filament\Infolists\Infolist;
use Filament\Notifications\Notification;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Actions\Action;
use Filament\Tables\Table;
use Illuminate\Support\Facades\Mail;

class OrderResource extends Resource
{
    protected static ?string $model = Order::class;

    protected static ?string $navigationIcon = 'heroicon-o-shopping-bag';

    protected static ?string $navigationGroup = 'Shop';

    protected static ?string $modelLabel = 'Bestellung';

    protected static ?string $pluralModelLabel = 'Bestellungen';

    protected static ?string $recordTitleAttribute = 'number';

    protected static ?int $navigationSort = 1;

    public static function getNavigationBadge(): ?string
    {
        $n = Order::query()->where('status', 'neu')->where('payment_status', '!=', 'ausstehend')->count();

        return $n ? (string) $n : null;
    }

    public static function form(Form $form): Form
    {
        return $form->schema([
            Forms\Components\Section::make('Status')->columns(2)->schema([
                Forms\Components\Select::make('status')->label('Bestellstatus')->options(Order::STATUSES)->required()
                    ->helperText('Hier ohne E-Mail. Für Bestätigung, Lieferung oder Storno mit E-Mail die Knöpfe in der Ansicht verwenden.'),
                Forms\Components\Select::make('payment_status')->label('Zahlungsstatus')->options(Order::PAYMENT_STATUSES)->required(),
            ]),
            Forms\Components\Section::make('Kundschaft und Lieferung')->columns(2)->schema([
                Forms\Components\TextInput::make('name')->label('Name')->required(),
                Forms\Components\TextInput::make('email')->label('E-Mail')->email()->required(),
                Forms\Components\TextInput::make('phone')->label('Telefon'),
                Forms\Components\Select::make('delivery_method')->label('Lieferart')->options(Order::DELIVERY_METHODS)->required(),
                Forms\Components\TextInput::make('street')->label('Strasse'),
                Forms\Components\TextInput::make('postal_code')->label('PLZ'),
                Forms\Components\TextInput::make('city')->label('Ort'),
                Forms\Components\Textarea::make('note')->label('Bemerkung')->columnSpanFull(),
            ]),
        ]);
    }

    public static function infolist(Infolist $infolist): Infolist
    {
        return $infolist->schema([
            Infolists\Components\Section::make()->columns(4)->schema([
                Infolists\Components\TextEntry::make('status')->label('Status')->badge()->formatStateUsing(fn ($state) => Order::STATUSES[$state] ?? $state)->color(fn ($state) => self::statusColor($state)),
                Infolists\Components\TextEntry::make('payment_status')->label('Zahlung')->badge()->formatStateUsing(fn ($state) => Order::PAYMENT_STATUSES[$state] ?? $state)->color(fn ($state) => $state === 'bezahlt' ? 'success' : 'warning'),
                Infolists\Components\TextEntry::make('payment_method')->label('Zahlungsart')->formatStateUsing(fn ($state) => Order::PAYMENT_METHODS[$state] ?? $state),
                Infolists\Components\TextEntry::make('created_at')->label('Bestellt am')->dateTime('d.m.Y H:i'),
            ]),
            Infolists\Components\Section::make('Kundschaft')->columns(3)->schema([
                Infolists\Components\TextEntry::make('name')->label('Name'),
                Infolists\Components\TextEntry::make('email')->label('E-Mail')->copyable(),
                Infolists\Components\TextEntry::make('phone')->label('Telefon')->placeholder('–'),
                Infolists\Components\TextEntry::make('delivery_method')->label('Lieferart')->formatStateUsing(fn ($state) => Order::DELIVERY_METHODS[$state] ?? $state),
                Infolists\Components\TextEntry::make('address')->label('Adresse')->state(fn (Order $record) => $record->street ? "{$record->street}, {$record->postal_code} {$record->city}" : '–'),
                Infolists\Components\TextEntry::make('user.email')->label('Kundenkonto')->placeholder('Gastbestellung'),
                Infolists\Components\TextEntry::make('note')->label('Bemerkung')->placeholder('–')->columnSpanFull(),
            ]),
            Infolists\Components\Section::make('Artikel')->schema([
                Infolists\Components\RepeatableEntry::make('items')->label('')->columns(4)->schema([
                    Infolists\Components\TextEntry::make('product_name')->label('Artikel'),
                    Infolists\Components\TextEntry::make('variant_label')->label('Grösse'),
                    Infolists\Components\TextEntry::make('quantity')->label('Menge'),
                    Infolists\Components\TextEntry::make('line_total')->label('Betrag')->formatStateUsing(fn ($state) => Money::format($state)),
                ]),
                Infolists\Components\TextEntry::make('shipping')->label('Lieferung')->formatStateUsing(fn ($state) => Money::format($state)),
                Infolists\Components\TextEntry::make('total')->label('Total')->weight('bold')->formatStateUsing(fn ($state) => Money::format($state)),
            ]),
        ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->defaultSort('created_at', 'desc')
            ->columns([
                Tables\Columns\TextColumn::make('number')->label('Nr.')->searchable()->weight('bold'),
                Tables\Columns\TextColumn::make('created_at')->label('Datum')->dateTime('d.m.Y H:i')->sortable(),
                Tables\Columns\TextColumn::make('name')->label('Kundschaft')->searchable()->description(fn (Order $record) => $record->email),
                Tables\Columns\TextColumn::make('total')->label('Total')->formatStateUsing(fn ($state) => Money::format($state))->sortable(),
                Tables\Columns\TextColumn::make('status')->label('Status')->badge()->formatStateUsing(fn ($state) => Order::STATUSES[$state] ?? $state)->color(fn ($state) => self::statusColor($state)),
                Tables\Columns\TextColumn::make('payment_status')->label('Zahlung')->badge()->formatStateUsing(fn ($state) => Order::PAYMENT_STATUSES[$state] ?? $state)->color(fn ($state) => $state === 'bezahlt' ? 'success' : ($state === 'abgebrochen' ? 'gray' : 'warning'))
                    ->description(fn (Order $record) => $record->paymentMethodLabel()),
                Tables\Columns\TextColumn::make('delivery_method')->label('Lieferart')->formatStateUsing(fn ($state) => Order::DELIVERY_METHODS[$state] ?? $state)->toggleable(),
            ])
            ->filters([
                Tables\Filters\SelectFilter::make('status')->label('Status')->options(Order::STATUSES),
                Tables\Filters\SelectFilter::make('payment_status')->label('Zahlung')->options(Order::PAYMENT_STATUSES),
                Tables\Filters\SelectFilter::make('payment_method')->label('Zahlungsart')->options(Order::PAYMENT_METHODS),
            ])
            ->actions([Tables\Actions\ViewAction::make(), ...self::statusActions()]);
    }

    /** Aktionen mit automatischer E-Mail an die Kundschaft. Werden auch in der Detailansicht verwendet. */
    public static function statusActions(string $class = Action::class): array
    {
        $note = Forms\Components\Textarea::make('message')->label('Zusätzliche Nachricht an die Kundschaft (optional)')
            ->placeholder('z. B. Liefertermin: Dienstag, 4. November, zwischen 8 und 12 Uhr');

        return [
            $class::make('confirm')->label('Bestätigen')->icon('heroicon-o-check-circle')->color('success')
                ->visible(fn (Order $record) => $record->status === 'neu' && $record->payment_status !== 'ausstehend')
                ->form([$note])
                ->action(function (Order $record, array $data) {
                    $record->update(['status' => 'bestaetigt', 'confirmed_at' => now()]);
                    Mail::to($record->email)->send(new OrderStatusUpdate($record, $data['message'] ?? null));
                    Notification::make()->title('Bestellung bestätigt, E-Mail gesendet')->success()->send();
                }),
            $class::make('deliver')->label('Geliefert / abgeholt')->icon('heroicon-o-truck')->color('primary')
                ->visible(fn (Order $record) => in_array($record->status, ['neu', 'bestaetigt'], true) && $record->payment_status !== 'ausstehend')
                ->form([$note])
                ->action(function (Order $record, array $data) {
                    $update = ['status' => 'geliefert', 'delivered_at' => now()];
                    if ($record->payment_method === 'cash') {
                        $update += ['payment_status' => 'bezahlt', 'paid_at' => now()];
                    }
                    $record->update($update);
                    Mail::to($record->email)->send(new OrderStatusUpdate($record, $data['message'] ?? null));
                    Notification::make()->title('Als geliefert markiert, E-Mail gesendet')->success()->send();
                }),
            $class::make('paid')->label('Zahlung erhalten')->icon('heroicon-o-banknotes')->color('success')
                ->visible(fn (Order $record) => in_array($record->payment_status, ['offen'], true) && $record->status !== 'storniert')
                ->requiresConfirmation()
                ->action(fn (Order $record) => $record->update(['payment_status' => 'bezahlt', 'paid_at' => now()])),
            $class::make('invoice')->label('Rechnung')->icon('heroicon-o-document-arrow-down')->color('gray')
                ->action(fn (Order $record) => response()->streamDownload(fn () => print(app(InvoicePdf::class)->render($record)), app(InvoicePdf::class)->filename($record))),
            $class::make('resend')->label('Bestätigung erneut senden')->icon('heroicon-o-envelope')->color('gray')
                ->visible(fn (Order $record) => $record->payment_status !== 'ausstehend')
                ->requiresConfirmation()
                ->action(function (Order $record) {
                    Mail::to($record->email)->send(new OrderConfirmation($record));
                    Notification::make()->title('Bestellbestätigung gesendet')->success()->send();
                }),
            $class::make('cancel')->label('Stornieren')->icon('heroicon-o-x-circle')->color('danger')
                ->visible(fn (Order $record) => in_array($record->status, ['neu', 'bestaetigt'], true))
                ->form([
                    $note,
                    Forms\Components\Toggle::make('notify')->label('Kundschaft per E-Mail informieren')->default(true),
                ])
                ->modalDescription('Der reservierte Lagerbestand wird wieder freigegeben. Bereits bezahlte Beträge bitte im Stripe-Dashboard erstatten.')
                ->action(function (Order $record, array $data) {
                    app(OrderService::class)->cancel($record);
                    if ($data['notify'] ?? false) {
                        Mail::to($record->email)->send(new OrderStatusUpdate($record->fresh(), $data['message'] ?? null));
                    }
                    Notification::make()->title('Bestellung storniert')->success()->send();
                }),
        ];
    }

    public static function statusColor(?string $state): string
    {
        return match ($state) {
            'neu' => 'warning',
            'bestaetigt' => 'info',
            'geliefert' => 'success',
            default => 'gray',
        };
    }

    public static function canCreate(): bool
    {
        return false;
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListOrders::route('/'),
            'view' => Pages\ViewOrder::route('/{record}'),
            'edit' => Pages\EditOrder::route('/{record}/edit'),
        ];
    }
}
