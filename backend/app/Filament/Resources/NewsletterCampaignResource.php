<?php

namespace App\Filament\Resources;

use App\Filament\Resources\NewsletterCampaignResource\Pages;
use App\Mail\NewsletterCampaignMail;
use App\Models\NewsletterCampaign;
use App\Models\NewsletterSubscriber;
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
            Forms\Components\Section::make('Inhalt')->columnSpan(['default' => 5, 'xl' => 2])->schema([
                Forms\Components\TextInput::make('subject')->label('Betreff')->required()->maxLength(120)->live(debounce: 500),
                Forms\Components\TextInput::make('preheader')->label('Vorschautext')->maxLength(140)->live(debounce: 500)
                    ->helperText('Erscheint im Posteingang neben dem Betreff.'),
                Forms\Components\MarkdownEditor::make('body')->label('Inhalt')->required()->live(debounce: 700)
                    ->toolbarButtons(['heading', 'bold', 'italic', 'link', 'bulletList', 'orderedList', 'undo', 'redo']),
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
                Tables\Columns\TextColumn::make('sent_at')->label('Versendet')->dateTime('d.m.Y H:i')->placeholder('Entwurf'),
                Tables\Columns\TextColumn::make('recipients')->label('Empfänger'),
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
                    $count = 0;
                    NewsletterSubscriber::query()->where('status', 'bestaetigt')->chunkById(200, function ($subs) use ($record, &$count) {
                        foreach ($subs as $sub) {
                            Mail::to($sub->email)->queue(new NewsletterCampaignMail($record, $sub));
                            $count++;
                        }
                    });
                    $record->update(['sent_at' => now(), 'recipients' => $count]);
                    Notification::make()->title("Versand an {$count} Empfänger gestartet")->success()->send();
                }),
        ];
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
