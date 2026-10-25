<?php

namespace App\Filament\Resources;

use App\Filament\Resources\OrderResource\Pages;
use App\Filament\Support\Money;
use App\Mail\OrderConfirmation;
use App\Mail\OrderStatusUpdate;
use App\Models\Order;
use App\Services\InvoicePdf;
use App\Services\OrderService;
use App\Services\PaymentReminders;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Infolists;
use Filament\Infolists\Infolist;
use Filament\Notifications\Notification;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Actions\Action;
use Filament\Tables\Table;

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
            self::scheduleSection(),
            Forms\Components\Section::make('Kundschaft und Lieferung')->columns(2)->schema([
                Forms\Components\TextInput::make('name')->label('Name')->required(),
                Forms\Components\TextInput::make('email')->label('E-Mail')->email()->helperText('Ohne E-Mail werden keine Bestätigungen verschickt.'),
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
                Infolists\Components\TextEntry::make('created_at')->label('Bestellt am')->dateTime('d.m.Y H:i')
                    ->helperText(fn (Order $record) => Order::SOURCES[$record->source] ?? null),
                Infolists\Components\TextEntry::make('preferred_date')->label('Wunschtermin')->placeholder('–')
                    ->state(fn (Order $record) => self::termin($record->preferred_date, $record->preferred_slot)),
                Infolists\Components\TextEntry::make('scheduled_date')->label('Fixer Termin')->placeholder('noch offen')->weight('bold')
                    ->state(fn (Order $record) => self::termin($record->scheduled_date, $record->scheduled_slot)),
                Infolists\Components\TextEntry::make('reminder_count')->label('Zahlungserinnerungen')
                    ->visible(fn (Order $record) => $record->payment_method === 'invoice')
                    ->state(fn (Order $record) => $record->reminder_count ? $record->reminder_count.'× (zuletzt '.$record->last_reminded_at?->format('d.m.Y').')' : ($record->isOverdue() ? 'überfällig, noch keine' : 'keine')),
                Infolists\Components\TextEntry::make('refund_amount')->label('Erstattet')
                    ->visible(fn (Order $record) => (bool) $record->refunded_at)
                    ->state(fn (Order $record) => Money::format($record->refund_amount).' am '.$record->refunded_at?->format('d.m.Y')),
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
                    Infolists\Components\TextEntry::make('product_name')->label('Artikel')
                        ->helperText(fn ($record) => $record->discount_percent ? "Mengenrabatt {$record->discount_percent} %" : null),
                    Infolists\Components\TextEntry::make('variant_label')->label('Grösse'),
                    Infolists\Components\TextEntry::make('quantity')->label('Menge'),
                    Infolists\Components\TextEntry::make('line_total')->label('Betrag')->formatStateUsing(fn ($state) => Money::format($state)),
                ]),
                Infolists\Components\TextEntry::make('discount_total')->label('Mengenrabatt (im Total enthalten)')->visible(fn (Order $record) => $record->discount_total > 0)
                    ->formatStateUsing(fn ($state) => '−'.Money::format($state)),
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
                Tables\Columns\TextColumn::make('scheduled_date')->label('Termin')->formatStateUsing(fn ($state) => $state?->locale('de_CH')->isoFormat('dd D.M.'))->sortable()->placeholder('offen')
                    ->description(fn (Order $record) => $record->scheduled_date ? (Order::SLOTS[$record->scheduled_slot] ?? $record->scheduled_slot) : ($record->preferred_date ? 'Wunsch: '.$record->preferred_date->format('d.m.') : null)),
                Tables\Columns\TextColumn::make('delivery_method')->label('Lieferart')->formatStateUsing(fn ($state) => Order::DELIVERY_METHODS[$state] ?? $state)->toggleable(isToggledHiddenByDefault: true)
                    ->description(fn (Order $record) => $record->source === 'admin' ? 'Telefon / vor Ort' : null),
            ])
            ->filters([
                Tables\Filters\SelectFilter::make('status')->label('Status')->options(Order::STATUSES),
                Tables\Filters\SelectFilter::make('payment_status')->label('Zahlung')->options(Order::PAYMENT_STATUSES),
                Tables\Filters\SelectFilter::make('payment_method')->label('Zahlungsart')->options(Order::PAYMENT_METHODS),
                Tables\Filters\SelectFilter::make('termin')->label('Termin')
                    ->options(['heute' => 'Heute', 'morgen' => 'Morgen', 'woche' => 'Diese Woche', 'offen' => 'Noch ohne Termin'])
                    ->query(fn ($query, array $data) => match ($data['value'] ?? null) {
                        'heute' => $query->whereDate('scheduled_date', today()),
                        'morgen' => $query->whereDate('scheduled_date', today()->addDay()),
                        'woche' => $query->whereBetween('scheduled_date', [today()->startOfWeek(), today()->endOfWeek()]),
                        'offen' => $query->whereNull('scheduled_date')->whereIn('status', ['neu', 'bestaetigt'])->where('payment_status', '!=', 'ausstehend'),
                        default => $query,
                    }),
                Tables\Filters\Filter::make('ueberfaellig')->label('Überfällige Rechnungen')
                    ->query(fn ($query) => $query->whereKey(app(PaymentReminders::class)->overdue()->pluck('id'))),
                Tables\Filters\SelectFilter::make('source')->label('Herkunft')->options(Order::SOURCES),
            ])
            ->actions([Tables\Actions\ViewAction::make(), Tables\Actions\ActionGroup::make(self::statusActions())]);
    }

    /** Aktionen mit automatischer E-Mail an die Kundschaft. Werden auch in der Detailansicht verwendet. */
    public static function statusActions(string $class = Action::class): array
    {
        $note = Forms\Components\Textarea::make('message')->label('Zusätzliche Nachricht an die Kundschaft (optional)')
            ->placeholder('z. B. Liefertermin: Dienstag, 4. November, zwischen 8 und 12 Uhr');

        return [
            $class::make('confirm')->label('Bestätigen')->icon('heroicon-o-check-circle')->color('success')
                ->visible(fn (Order $record) => $record->status === 'neu' && $record->payment_status !== 'ausstehend')
                ->fillForm(fn (Order $record) => [
                    'scheduled_date' => $record->scheduled_date ?? $record->preferred_date,
                    'scheduled_slot' => $record->scheduled_slot ?? $record->preferred_slot,
                ])
                ->form([
                    Forms\Components\Grid::make(2)->schema(self::scheduleFields()),
                    Forms\Components\Placeholder::make('wish')->label('Wunsch der Kundschaft')
                        ->content(fn (Order $record) => self::termin($record->preferred_date, $record->preferred_slot) ?? 'kein Wunschtermin'),
                    $note,
                ])
                ->action(function (Order $record, array $data) {
                    $record->update(['status' => 'bestaetigt', 'confirmed_at' => now(),
                        'scheduled_date' => $data['scheduled_date'] ?? null, 'scheduled_slot' => $data['scheduled_slot'] ?? null]);
                    $sent = $record->mailCustomer(new OrderStatusUpdate($record, $data['message'] ?? null));
                    Notification::make()->title($sent ? 'Bestellung bestätigt, E-Mail gesendet' : 'Bestellung bestätigt (keine E-Mail-Adresse)')->success()->send();
                }),
            $class::make('schedule')->label('Termin ändern')->icon('heroicon-o-calendar-days')->color('gray')
                ->visible(fn (Order $record) => $record->status === 'bestaetigt')
                ->fillForm(fn (Order $record) => ['scheduled_date' => $record->scheduled_date, 'scheduled_slot' => $record->scheduled_slot, 'notify' => true])
                ->form([
                    Forms\Components\Grid::make(2)->schema(self::scheduleFields()),
                    Forms\Components\Toggle::make('notify')->label('Kundschaft über den neuen Termin informieren'),
                    $note,
                ])
                ->action(function (Order $record, array $data) {
                    $record->update(['scheduled_date' => $data['scheduled_date'] ?? null, 'scheduled_slot' => $data['scheduled_slot'] ?? null]);
                    if ($data['notify'] ?? false) {
                        $record->mailCustomer(new OrderStatusUpdate($record, $data['message'] ?? null));
                    }
                    Notification::make()->title('Termin gespeichert')->success()->send();
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
                    $record->mailCustomer(new OrderStatusUpdate($record, $data['message'] ?? null));
                    Notification::make()->title('Als geliefert markiert, E-Mail gesendet')->success()->send();
                }),
            $class::make('paid')->label('Zahlung erhalten')->icon('heroicon-o-banknotes')->color('success')
                ->visible(fn (Order $record) => in_array($record->payment_status, ['offen'], true) && $record->status !== 'storniert')
                ->requiresConfirmation()
                ->action(fn (Order $record) => $record->update(['payment_status' => 'bezahlt', 'paid_at' => now()])),
            $class::make('invoice')->label('Rechnung')->icon('heroicon-o-document-arrow-down')->color('gray')
                ->action(fn (Order $record) => response()->streamDownload(fn () => print(app(InvoicePdf::class)->render($record)), app(InvoicePdf::class)->filename($record))),
            $class::make('deliveryNote')->label('Lieferschein')->icon('heroicon-o-clipboard-document-list')->color('gray')
                ->visible(fn (Order $record) => $record->status !== 'storniert')
                ->action(fn (Order $record) => response()->streamDownload(fn () => print(app(InvoicePdf::class)->deliveryNote($record)), 'Lieferschein-'.$record->number.'.pdf')),
            $class::make('creditNote')->label('Gutschrift')->icon('heroicon-o-receipt-refund')->color('gray')
                ->visible(fn (Order $record) => (bool) $record->refunded_at)
                ->action(fn (Order $record) => response()->streamDownload(fn () => print(app(InvoicePdf::class)->creditNote($record)), 'Gutschrift-'.$record->number.'.pdf')),
            $class::make('remind')->label('Zahlungserinnerung')->icon('heroicon-o-bell-alert')->color('warning')
                ->visible(fn (Order $record) => $record->email && $record->payment_method === 'invoice' && $record->payment_status === 'offen' && $record->status !== 'storniert')
                ->requiresConfirmation()
                ->modalDescription(fn (Order $record) => ($record->isOverdue() ? 'Die Rechnung war am '.$record->dueDate()->format('d.m.Y').' fällig. ' : 'Die Rechnung ist noch nicht überfällig. ')
                    .'Die Kundschaft erhält eine freundliche Erinnerung mit der Rechnung im Anhang.'.($record->reminder_count ? " Bisher {$record->reminder_count} Erinnerung(en)." : ''))
                ->action(function (Order $record) {
                    app(PaymentReminders::class)->send($record);
                    Notification::make()->title('Zahlungserinnerung gesendet')->success()->send();
                }),
            $class::make('resend')->label('Bestätigung erneut senden')->icon('heroicon-o-envelope')->color('gray')
                ->visible(fn (Order $record) => $record->email && $record->payment_status !== 'ausstehend')
                ->requiresConfirmation()
                ->action(function (Order $record) {
                    $record->mailCustomer(new OrderConfirmation($record));
                    Notification::make()->title('Bestellbestätigung gesendet')->success()->send();
                }),
            $class::make('cancel')->label('Stornieren')->icon('heroicon-o-x-circle')->color('danger')
                ->visible(fn (Order $record) => in_array($record->status, ['neu', 'bestaetigt'], true))
                ->form(fn (Order $record) => [
                    $note,
                    Forms\Components\Toggle::make('refund')->label('Bezahlten Betrag erstatten ('.Money::format($record->total).')')->default(true)
                        ->visible($record->payment_status === 'bezahlt')
                        ->helperText($record->payment_method === 'stripe'
                            ? 'Karte/TWINT wird automatisch über Stripe zurückgebucht. Die Kundschaft erhält eine Gutschrift.'
                            : 'Die Kundschaft erhält eine Gutschrift; den Betrag bitte selbst zurücküberweisen.'),
                    Forms\Components\Toggle::make('notify')->label('Kundschaft per E-Mail informieren')->default(true)->visible((bool) $record->email),
                ])
                ->modalDescription('Der reservierte Lagerbestand wird wieder freigegeben.')
                ->action(function (Order $record, array $data) {
                    try {
                        app(OrderService::class)->cancel($record, refund: (bool) ($data['refund'] ?? false));
                    } catch (\Throwable $e) {
                        report($e);
                        Notification::make()->title('Storniert, aber die Rückerstattung ist fehlgeschlagen')->body($e->getMessage())->danger()->persistent()->send();

                        return;
                    }
                    if ($data['notify'] ?? false) {
                        $record->mailCustomer(new OrderStatusUpdate($record->fresh(), $data['message'] ?? null));
                    }
                    Notification::make()->title('Bestellung storniert'.(($data['refund'] ?? false) ? ' und erstattet' : ''))->success()->send();
                }),
            $class::make('refund')->label('Erstatten')->icon('heroicon-o-receipt-refund')->color('danger')
                ->visible(fn (Order $record) => $record->status === 'storniert' && $record->payment_status === 'bezahlt' && ! $record->refunded_at)
                ->requiresConfirmation()
                ->modalDescription(fn (Order $record) => 'Erstattet '.Money::format($record->total).($record->payment_method === 'stripe' ? ' über Stripe' : ' (Überweisung durch Sie)').' und sendet eine Gutschrift.')
                ->action(function (Order $record) {
                    try {
                        app(OrderService::class)->refund($record);
                        Notification::make()->title('Erstattet, Gutschrift gesendet')->success()->send();
                    } catch (\Throwable $e) {
                        report($e);
                        Notification::make()->title('Rückerstattung fehlgeschlagen')->body($e->getMessage())->danger()->persistent()->send();
                    }
                }),
        ];
    }

    /** Wichtige Schritte als Knöpfe, Dokumente und Seltenes im «Mehr»-Menü. */
    public static function headerActions(): array
    {
        $all = collect(self::statusActions(\Filament\Actions\Action::class))->keyBy(fn ($a) => $a->getName());
        $primary = ['confirm', 'deliver', 'paid', 'refund'];

        return [
            ...$all->only($primary)->values()->all(),
            \Filament\Actions\ActionGroup::make($all->except($primary)->values()->all())
                ->label('Mehr')->icon('heroicon-m-ellipsis-vertical')->button()->color('gray'),
        ];
    }

    public static function scheduleFields(): array
    {
        return [
            Forms\Components\DatePicker::make('scheduled_date')->label('Liefer-/Abholtermin')->native(false)->displayFormat('d.m.Y')->firstDayOfWeek(1),
            Forms\Components\Select::make('scheduled_slot')->label('Zeitfenster')->options(Order::SLOTS)->placeholder('–'),
        ];
    }

    public static function scheduleSection(): Forms\Components\Section
    {
        return Forms\Components\Section::make('Termin')->columns(2)->schema(self::scheduleFields());
    }

    public static function termin($date, ?string $slot): ?string
    {
        if (! $date) {
            return null;
        }

        return $date->locale('de_CH')->isoFormat('dd, D.M.YYYY').($slot && $slot !== 'egal' ? ', '.(Order::SLOTS[$slot] ?? $slot) : '');
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

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListOrders::route('/'),
            'create' => Pages\CreateOrder::route('/create'),
            'view' => Pages\ViewOrder::route('/{record}'),
            'edit' => Pages\EditOrder::route('/{record}/edit'),
        ];
    }
}
