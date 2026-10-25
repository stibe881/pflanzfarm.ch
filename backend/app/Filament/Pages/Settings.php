<?php

namespace App\Filament\Pages;

use App\Filament\Support\Money;
use App\Models\Setting;
use Filament\Forms;
use Filament\Forms\Concerns\InteractsWithForms;
use Filament\Forms\Contracts\HasForms;
use Filament\Forms\Form;
use Filament\Notifications\Notification;
use Filament\Pages\Page;

class Settings extends Page implements HasForms
{
    use InteractsWithForms;

    protected static ?string $navigationIcon = 'heroicon-o-cog-6-tooth';

    protected static ?string $navigationGroup = 'Verwaltung';

    protected static ?string $title = 'Einstellungen';

    protected static string $view = 'filament.pages.settings';

    public ?array $data = [];

    public static function canAccess(): bool
    {
        return (bool) auth()->user()?->isTeam();
    }

    public function mount(): void
    {
        $this->form->fill(collect(array_keys(Setting::DEFAULTS))->mapWithKeys(fn ($k) => [$k => Setting::get($k)])->all());
    }

    public function form(Form $form): Form
    {
        return $form->statePath('data')->schema([
            Forms\Components\Section::make('Öffnungszeiten')->description('Erscheinen auf der Kontaktseite.')->schema([
                Forms\Components\Repeater::make('opening_hours')->label('')->columns(2)->addActionLabel('Zeile hinzufügen')->schema([
                    Forms\Components\TextInput::make('label')->label('Bezeichnung')->required()->placeholder('z. B. Montag bis Freitag'),
                    Forms\Components\TextInput::make('value')->label('Zeiten')->required()->placeholder('z. B. 8.00–12.00 und 13.30–17.30 Uhr'),
                ]),
                Forms\Components\Textarea::make('opening_note')->label('Hinweis unter den Öffnungszeiten')->rows(2),
            ]),
            Forms\Components\Section::make('Lieferung und Zahlung')->columns(2)->schema([
                Money::input('delivery_fee', 'Lieferpauschale')->required(),
                Money::input('free_delivery_from', 'Gratis-Lieferung ab Bestellwert')->helperText('0 = nie gratis'),
                Forms\Components\Toggle::make('invoice_enabled')->label('Zahlung auf Rechnung anbieten'),
                Forms\Components\TextInput::make('invoice_due_days')->label('Zahlungsfrist Rechnung (Tage)')->numeric()->minValue(1)->maxValue(90),
                Forms\Components\Toggle::make('cash_enabled')->label('Barzahlung bei Abholung anbieten'),
            ]),
            Forms\Components\Section::make('Rechnungsangaben')->columns(2)->schema([
                Forms\Components\TextInput::make('iban')->label('IBAN für Rechnungen (QR-Rechnung)')->placeholder('CH.. .... .... .... .... .')
                    ->helperText('Mit IBAN enthält die Rechnung einen Swiss-QR-Zahlteil.'),
                Forms\Components\TextInput::make('vat_number')->label('MWST-Nummer (falls vorhanden)')->placeholder('CHE-...MWST'),
            ]),
            Forms\Components\Section::make('Benachrichtigungen')->schema([
                Forms\Components\TextInput::make('notify_email')->label('E-Mail für neue Bestellungen und Anfragen')->email()->required(),
            ]),
        ]);
    }

    public function save(): void
    {
        foreach ($this->form->getState() as $key => $value) {
            if (array_key_exists($key, Setting::DEFAULTS)) {
                Setting::put($key, $value);
            }
        }
        Notification::make()->title('Einstellungen gespeichert')->success()->send();
    }
}
