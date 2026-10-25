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
use Illuminate\Support\HtmlString;

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
        return $form->statePath('data')->columns(5)->schema([
            Forms\Components\Group::make()->columnSpan(['default' => 5, 'xl' => 3])->schema($this->fields()),
            Forms\Components\Section::make('Live-Vorschau')->columnSpan(['default' => 5, 'xl' => 2])
                ->extraAttributes(['style' => 'position: sticky; top: 5rem;'])
                ->schema([
                    Forms\Components\Placeholder::make('preview')->hiddenLabel()
                        ->content(fn (Forms\Get $get) => new HtmlString(view('filament.forms.settings-preview', self::previewData($get))->render())),
                ]),
        ]);
    }

    private function fields(): array
    {
        return [
            Forms\Components\Section::make('Öffnungszeiten')->description('Erscheinen auf der Kontaktseite.')->schema([
                Forms\Components\Repeater::make('opening_hours')->label('')->live()->columns(2)->addActionLabel('Zeile hinzufügen')->schema([
                    Forms\Components\TextInput::make('label')->label('Bezeichnung')->required()->live(debounce: 500)->placeholder('z. B. Montag bis Freitag'),
                    Forms\Components\TextInput::make('value')->label('Zeiten')->required()->live(debounce: 500)->placeholder('z. B. 8.00–12.00 und 13.30–17.30 Uhr'),
                ]),
                Forms\Components\Textarea::make('opening_note')->label('Hinweis unter den Öffnungszeiten')->rows(2)->live(debounce: 500),
            ]),
            Forms\Components\Section::make('Lieferung und Zahlung')->columns(2)->schema([
                Forms\Components\Placeholder::make('shipping_hint')->label('Versandkosten')
                    ->content(new HtmlString('Werden pro Grösse über <a href="'.\App\Filament\Resources\ShippingClassResource::getUrl().'" style="text-decoration:underline">Versandklassen</a> festgelegt.')),
                Money::input('free_delivery_from', 'Gratis-Lieferung ab Bestellwert')->live(debounce: 500)->helperText('0 = nie gratis'),
                Forms\Components\Toggle::make('invoice_enabled')->label('Zahlung auf Rechnung anbieten')->live(),
                Forms\Components\TextInput::make('invoice_due_days')->label('Zahlungsfrist Rechnung (Tage)')->numeric()->live(debounce: 500)->minValue(1)->maxValue(90),
                Forms\Components\Toggle::make('cash_enabled')->label('Barzahlung bei Abholung anbieten')->live(),
            ]),
            Forms\Components\Section::make('Rechnungsangaben')->columns(2)->schema([
                Forms\Components\TextInput::make('iban')->label('IBAN für Rechnungen (QR-Rechnung)')->live(debounce: 500)
                    ->rule(fn () => function (string $attribute, $value, \Closure $fail) {
                        if (filled($value) && count(\Sprain\SwissQrBill\DataGroup\Element\CreditorInformation::create(preg_replace('/\\s+/', '', $value))->getViolations())) {
                            $fail('Diese IBAN ist ungültig.');
                        }
                    })->placeholder('CH.. .... .... .... .... .')
                    ->helperText('Mit IBAN enthält die Rechnung einen Swiss-QR-Zahlteil.'),
                Forms\Components\TextInput::make('vat_number')->label('MWST-Nummer (falls vorhanden)')->live(debounce: 500)->placeholder('CHE-...MWST'),
            ]),
            Forms\Components\Section::make('Pflanzservice in der Kasse')->columns(3)->description('Kundschaft kann bei Lieferung «Pflanzen einpflanzen lassen» dazubuchen. Pro Grösse lässt sich im Produkt ein eigener Preis setzen.')->schema([
                Forms\Components\Toggle::make('planting_enabled')->label('Anbieten')->inline(false),
                Money::input('planting_price_default', 'Standardpreis pro Pflanze')->required(),
                Money::input('planting_min_fee', 'Mindestbetrag pro Auftrag')->required(),
            ]),
            Forms\Components\Section::make('Pflege-Mails nach dem Kauf')->columns(2)->description('Kundschaft kann sich mit einem Klick abmelden. Gilt nur für Bestellungen mit E-Mail-Adresse.')->schema([
                Forms\Components\Toggle::make('care_mails_enabled')->label('Pflegetipps nach der Lieferung senden')->inline(false),
                Forms\Components\TextInput::make('care_mail_days')->label('Tage nach «geliefert»')->numeric()->integer()->minValue(1)->maxValue(90)->required(),
                Forms\Components\TextInput::make('google_review_url')->label('Link für Google-Bewertung (optional)')->url()->columnSpanFull()
                    ->placeholder('https://g.page/r/…/review')
                    ->helperText('Im Google-Unternehmensprofil unter «Mehr Rezensionen erhalten» kopieren. Leer = keine Bitte um Bewertung.'),
                Forms\Components\Toggle::make('seasonal_reminders_enabled')->label('Saisonale Erinnerungen aus dem Ratgeber senden')->inline(false)->columnSpanFull()
                    ->helperText('Monate pro Artikel unter «Ratgeber» festlegen.'),
            ]),
            Forms\Components\Section::make('Zahlungserinnerungen')->columns(3)->description('Für überfällige Rechnungen, werktags um 8.30 Uhr. Die Rechnung mit QR-Zahlteil wird jeweils angehängt.')->schema([
                Forms\Components\Toggle::make('reminders_enabled')->label('Automatisch erinnern')->inline(false)->live(),
                Forms\Components\TextInput::make('reminder_interval_days')->label('Abstand (Tage)')->numeric()->integer()->minValue(1)->maxValue(60)->required()
                    ->helperText('nach Fälligkeit bzw. letzter Erinnerung'),
                Forms\Components\TextInput::make('reminder_max')->label('Höchstens')->numeric()->integer()->minValue(0)->maxValue(5)->suffix('Erinnerungen')->required(),
            ]),
            Forms\Components\Section::make('Benachrichtigungen')->columns(2)->schema([
                Forms\Components\TextInput::make('notify_email')->label('E-Mail für Bestellungen, Anfragen und Fehlermeldungen')->email()->required()->live(debounce: 500),
                Forms\Components\TextInput::make('low_stock_threshold')->label('Lager-Warnung unter')->numeric()->integer()->minValue(0)->suffix('Stück')->required()
                    ->helperText('Sinkt eine Grösse darunter, kommt eine E-Mail an diese Adresse.'),
            ]),
        ];
    }

    /** Werte für die Vorschau; Beträge kommen aus dem Formular in Franken. */
    private static function previewData(Forms\Get $get): array
    {
        $classes = \App\Models\ShippingClass::query()->orderBy('sort')->get();
        $fee = ($classes->firstWhere('is_default', true) ?? $classes->first())?->price / 100;
        $free = (float) $get('free_delivery_from');
        $example = 180.0;
        $dueDays = max(1, (int) $get('invoice_due_days'));

        $iban = trim((string) $get('iban'));
        $ibanStatus = 'empty';
        if ($iban !== '') {
            try {
                $info = \Sprain\SwissQrBill\DataGroup\Element\CreditorInformation::create(preg_replace('/\s+/', '', $iban));
                $ibanStatus = count($info->getViolations()) ? 'invalid' : ($info->containsQrIban() ? 'qr' : 'ok');
            } catch (\Throwable) {
                $ibanStatus = 'invalid';
            }
        }

        $methods = [['Karte oder TWINT', 'Sicher bezahlen über Stripe.']];
        if ($get('invoice_enabled')) {
            $methods[] = ['Rechnung', "Zahlbar innert {$dueDays} Tagen, Rechnung per E-Mail."];
        }
        if ($get('cash_enabled')) {
            $methods[] = ['Barzahlung bei Abholung', 'Nur bei Abholung in Ebersecken.'];
        }

        return [
            'hours' => array_values(array_filter((array) $get('opening_hours'), 'is_array')),
            'note' => $get('opening_note'),
            'example' => $example,
            'classes' => $classes->map(fn ($c) => [$c->name, $c->price / 100, $c->is_default])->all(),
            'free' => $free,
            'shippingExample' => $free > 0 && $example >= $free ? 0 : $fee,
            'methods' => $methods,
            'dueDays' => $dueDays,
            'dueDate' => now()->addDays($dueDays)->format('d.m.Y'),
            'iban' => $iban,
            'ibanStatus' => $ibanStatus,
            'vat' => $get('vat_number'),
            'notify' => $get('notify_email'),
        ];
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
