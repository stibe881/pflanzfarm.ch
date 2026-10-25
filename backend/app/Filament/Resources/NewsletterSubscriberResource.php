<?php

namespace App\Filament\Resources;

use App\Filament\Resources\NewsletterSubscriberResource\Pages;
use App\Models\NewsletterSubscriber;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;

class NewsletterSubscriberResource extends Resource
{
    protected static ?string $model = NewsletterSubscriber::class;

    protected static ?string $navigationIcon = 'heroicon-o-user-group';

    protected static ?string $navigationGroup = 'Newsletter';

    protected static ?string $modelLabel = 'Abonnent';

    protected static ?string $pluralModelLabel = 'Abonnenten';

    public static function table(Table $table): Table
    {
        return $table
            ->defaultSort('created_at', 'desc')
            ->columns([
                Tables\Columns\TextColumn::make('email')->label('E-Mail')->searchable()->copyable(),
                Tables\Columns\TextColumn::make('status')->label('Status')->badge()
                    ->formatStateUsing(fn ($state) => NewsletterSubscriber::STATUSES[$state] ?? $state)
                    ->color(fn ($state) => match ($state) { 'bestaetigt' => 'success', 'ausstehend' => 'warning', default => 'gray' }),
                Tables\Columns\TextColumn::make('source')->label('Quelle'),
                Tables\Columns\TextColumn::make('confirmed_at')->label('Bestätigt am')->dateTime('d.m.Y H:i')->placeholder('–'),
                Tables\Columns\TextColumn::make('created_at')->label('Angemeldet')->date('d.m.Y')->sortable(),
            ])
            ->filters([Tables\Filters\SelectFilter::make('status')->label('Status')->options(NewsletterSubscriber::STATUSES)])
            ->actions([
                Tables\Actions\Action::make('unsubscribe')->label('Abmelden')->icon('heroicon-o-no-symbol')->color('gray')
                    ->visible(fn (NewsletterSubscriber $record) => $record->status !== 'abgemeldet')
                    ->requiresConfirmation()
                    ->action(fn (NewsletterSubscriber $record) => $record->update(['status' => 'abgemeldet', 'unsubscribed_at' => now()])),
                Tables\Actions\DeleteAction::make()->label('Löschen'),
            ])
            ->bulkActions([Tables\Actions\DeleteBulkAction::make()]);
    }

    public static function canCreate(): bool
    {
        // Abonnenten tragen sich selbst mit Bestätigungsmail ein (Einwilligung)
        return false;
    }

    public static function getPages(): array
    {
        return ['index' => Pages\ListNewsletterSubscribers::route('/')];
    }
}
