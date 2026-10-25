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
        return $form->schema([
            Forms\Components\Section::make()->columns(2)->schema([
                Forms\Components\TextInput::make('subject')->label('Betreff')->required()->maxLength(120)->columnSpanFull(),
                Forms\Components\TextInput::make('preheader')->label('Vorschautext')->maxLength(140)->columnSpanFull()
                    ->helperText('Erscheint im Posteingang neben dem Betreff.'),
                Forms\Components\MarkdownEditor::make('body')->label('Inhalt')->required()->columnSpanFull()
                    ->toolbarButtons(['heading', 'bold', 'italic', 'link', 'bulletList', 'orderedList', 'undo', 'redo']),
                Forms\Components\TextInput::make('cta_label')->label('Knopf-Beschriftung')->placeholder('z. B. Hecken entdecken'),
                Forms\Components\TextInput::make('cta_url')->label('Knopf-Link')->url()->placeholder('https://pflanzfarm.ch/shop/'),
            ])->disabled(fn (?NewsletterCampaign $record) => (bool) $record?->sent_at),
        ]);
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
