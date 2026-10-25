<?php

namespace App\Filament\Resources;

use App\Filament\Resources\NewsletterCampaignResource\Pages;
use App\Mail\NewsletterCampaignMail;
use App\Models\NewsletterCampaign;
use App\Models\NewsletterSubscriber;
use App\Services\NewsletterService;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Notifications\Notification;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\HtmlString;

class NewsletterCampaignResource extends Resource
{
    protected static ?string $model = NewsletterCampaign::class;

    protected static ?string $navigationIcon = 'heroicon-o-envelope';

    protected static ?string $navigationGroup = 'Newsletter';

    protected static ?string $modelLabel = 'Newsletter';

    protected static ?string $pluralModelLabel = 'Newsletter';

    protected static ?string $navigationLabel = 'Newsletter versenden';

    public static function form(Form $form): Form
    {
        $locked = fn (?NewsletterCampaign $record) => (bool) $record?->sent_at;

        return $form->columns(5)->schema([
            Forms\Components\Section::make('Statistik')->columnSpanFull()
                ->visible(fn (?NewsletterCampaign $record) => (bool) $record?->sent_at)
                ->schema([
                    Forms\Components\Placeholder::make('stats')->hiddenLabel()->content(fn (?NewsletterCampaign $record) => $record ? self::statsHtml($record) : null),
                ]),
            Forms\Components\Section::make('Inhalt')->columnSpan(['default' => 5, 'xl' => 2])->schema([
                Forms\Components\TextInput::make('subject')->label('Betreff')->required()->maxLength(120)->live(debounce: 500),
                Forms\Components\TextInput::make('preheader')->label('Vorschautext')->maxLength(140)->live(debounce: 500)
                    ->helperText('Erscheint im Posteingang neben dem Betreff.'),
                Forms\Components\MarkdownEditor::make('body')->label('Inhalt')->required()->live(debounce: 700)
                    ->toolbarButtons(['heading', 'bold', 'italic', 'link', 'bulletList', 'orderedList', 'attachFiles', 'undo', 'redo'])
                    ->fileAttachmentsDisk('public')->fileAttachmentsDirectory('newsletter')->fileAttachmentsVisibility('public')
                    ->helperText('Bilder über das Büroklammer-Symbol einfügen (max. ca. 600 px breit wirkt am besten).'),
                Forms\Components\TextInput::make('cta_label')->label('Knopf-Beschriftung')->placeholder('z. B. Hecken entdecken')->live(debounce: 500),
                Forms\Components\TextInput::make('cta_url')->label('Knopf-Link')->url()->placeholder('https://pflanzfarm.ch/shop/')->live(debounce: 500),
            ])->disabled($locked),
            Forms\Components\Section::make('Live-Vorschau')->columnSpan(['default' => 5, 'xl' => 3])
                ->extraAttributes(['style' => 'position: sticky; top: 5rem;'])
                ->headerActions([
                    Forms\Components\Actions\Action::make('toggleMobile')
                        ->label(fn (Forms\Get $get) => $get('preview_mobile') ? 'Desktop-Ansicht' : 'Handy-Ansicht')
                        ->icon(fn (Forms\Get $get) => $get('preview_mobile') ? 'heroicon-m-computer-desktop' : 'heroicon-m-device-phone-mobile')
                        ->link()
                        ->action(fn (Forms\Get $get, Forms\Set $set) => $set('preview_mobile', ! $get('preview_mobile'))),
                ])
                ->schema([
                    Forms\Components\Hidden::make('preview_mobile')->default(false)->dehydrated(false),
                    Forms\Components\Placeholder::make('preview')->hiddenLabel()->content(fn (Forms\Get $get) => new HtmlString(view('filament.forms.newsletter-preview', self::previewData($get))->render())),
                ]),
        ]);
    }

    /** Rendert die echte Newsletter-Mail mit den aktuellen Formularwerten. */
    private static function previewData(Forms\Get $get): array
    {
        $campaign = new NewsletterCampaign([
            'subject' => (string) $get('subject'),
            'preheader' => $get('preheader'),
            'body' => (string) ($get('body') ?: '*Hier erscheint Ihr Text.*'),
            'cta_label' => $get('cta_label'),
            'cta_url' => filter_var($get('cta_url'), FILTER_VALIDATE_URL) ? $get('cta_url') : ($get('cta_label') ? url('/') : null),
        ]);
        $subscriber = new NewsletterSubscriber(['email' => 'vorschau@example.ch', 'token' => 'vorschau']);

        try {
            $html = (new NewsletterCampaignMail($campaign, $subscriber))->render();
        } catch (\Throwable $e) {
            $html = '<p style="font-family:sans-serif;padding:20px">Vorschau nicht möglich: '.e($e->getMessage()).'</p>';
        }

        return [
            'html' => $html,
            'subject' => $get('subject'),
            'preheader' => $get('preheader'),
            'from' => config('mail.from.name'),
            'mobile' => (bool) $get('preview_mobile'),
        ];
    }

    public static function table(Table $table): Table
    {
        return $table
            ->defaultSort('created_at', 'desc')
            ->columns([
                Tables\Columns\TextColumn::make('subject')->label('Betreff')->searchable()->wrap(),
                Tables\Columns\TextColumn::make('sent_at')->label('Versand')->dateTime('d.m.Y H:i')
                    ->placeholder(fn (NewsletterCampaign $record) => $record->scheduled_at ? 'geplant: '.$record->scheduled_at->format('d.m.Y H:i') : 'Entwurf'),
                Tables\Columns\TextColumn::make('recipients')->label('Empfänger'),
                Tables\Columns\TextColumn::make('opened')->label('Geöffnet')->state(fn (NewsletterCampaign $record) => $record->sent_at ? NewsletterService::stats($record)['open_rate'].' %' : null)->placeholder('–'),
                Tables\Columns\TextColumn::make('clicked')->label('Geklickt')->state(fn (NewsletterCampaign $record) => $record->sent_at ? NewsletterService::stats($record)['click_rate'].' %' : null)->placeholder('–'),
                Tables\Columns\TextColumn::make('unsubscribed')->label('Abmeldungen')->state(fn (NewsletterCampaign $record) => $record->sent_at ? NewsletterService::stats($record)['unsubscribed'] : null)->placeholder('–'),
            ])
            ->actions([
                Tables\Actions\EditAction::make(),
                ...self::sendActions(Tables\Actions\Action::class),
            ]);
    }

    public static function sendActions(string $class): array
    {
        return [
            $class::make('test')->label('Testmail')->icon('heroicon-o-beaker')->color('gray')
                ->form([Forms\Components\TextInput::make('email')->label('An')->email()->required()->default(fn () => auth()->user()?->email)])
                ->action(function (NewsletterCampaign $record, array $data) {
                    $test = new NewsletterSubscriber(['email' => $data['email'], 'token' => 'test']);
                    Mail::to($data['email'])->sendNow(new NewsletterCampaignMail($record, $test));
                    Notification::make()->title('Testmail gesendet')->success()->send();
                }),
            $class::make('send')->label('An alle senden')->icon('heroicon-o-paper-airplane')->color('primary')
                ->visible(fn (NewsletterCampaign $record) => ! $record->sent_at)
                ->requiresConfirmation()
                ->modalDescription(fn () => 'Der Newsletter geht an '.NewsletterSubscriber::query()->where('status', 'bestaetigt')->count().' bestätigte Abonnenten. Das lässt sich nicht rückgängig machen.')
                ->action(function (NewsletterCampaign $record) {
                    $count = app(NewsletterService::class)->send($record);
                    Notification::make()->title("Versand an {$count} Empfänger gestartet")->success()->send();
                }),
            $class::make('schedule')->label(fn (NewsletterCampaign $record) => $record->scheduled_at ? 'Planung ändern' : 'Versand planen')
                ->icon('heroicon-o-calendar')->color('gray')
                ->visible(fn (NewsletterCampaign $record) => ! $record->sent_at)
                ->fillForm(fn (NewsletterCampaign $record) => ['scheduled_at' => $record->scheduled_at ?? now()->addDay()->setTime(8, 0)])
                ->form([
                    Forms\Components\DateTimePicker::make('scheduled_at')->label('Versenden am')->native(false)->seconds(false)->displayFormat('d.m.Y H:i')
                        ->minDate(now()->startOfDay())->helperText('Leer lassen, um die Planung aufzuheben.'),
                ])
                ->action(function (NewsletterCampaign $record, array $data) {
                    $record->update(['scheduled_at' => $data['scheduled_at'] ?? null]);
                    Notification::make()->title($record->scheduled_at ? 'Geplant für '.$record->scheduled_at->format('d.m.Y H:i') : 'Planung aufgehoben')->success()->send();
                }),
        ];
    }

    private static function statsHtml(NewsletterCampaign $record): HtmlString
    {
        $s = NewsletterService::stats($record);
        $tile = fn ($label, $value, $sub = null) => '<div style="padding:10px 12px;border:1px solid rgb(229 231 235);border-radius:8px">'
            .'<div style="font-size:.75rem;opacity:.7">'.e($label).'</div><div style="font-size:1.35rem;font-weight:700">'.e($value).'</div>'
            .($sub ? '<div style="font-size:.72rem;opacity:.7">'.e($sub).'</div>' : '').'</div>';

        return new HtmlString('<div style="display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px">'
            .$tile('Zugestellt', $s['sent'], 'von '.$s['total'])
            .$tile('Geöffnet', $s['open_rate'].' %', $s['opened'].' Personen')
            .$tile('Geklickt', $s['click_rate'].' %', $s['clicked'].' Personen')
            .$tile('Abmeldungen', $s['unsubscribed'])
            .$tile('Unzustellbar', $s['bounced'])
            .'</div><p style="font-size:.72rem;opacity:.7;margin-top:8px">Öffnungen und Klicks kommen über den Resend-Webhook. Manche Mailprogramme blockieren das Zählen von Öffnungen, die echte Zahl ist meist höher.</p>');
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListNewsletterCampaigns::route('/'),
            'create' => Pages\CreateNewsletterCampaign::route('/create'),
            'edit' => Pages\EditNewsletterCampaign::route('/{record}/edit'),
        ];
    }
}
