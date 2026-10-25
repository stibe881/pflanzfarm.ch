<?php

namespace App\Filament\Resources;

use App\Filament\Resources\UserResource\Pages;
use App\Http\Controllers\Api\AccountController;
use App\Models\User;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Infolists;
use Filament\Infolists\Infolist;
use Filament\Notifications\Notification;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Validation\Rules\Password;

class UserResource extends Resource
{
    protected static ?string $model = User::class;

    protected static ?string $navigationIcon = 'heroicon-o-users';

    protected static ?string $navigationGroup = 'Verwaltung';

    protected static ?string $modelLabel = 'Konto';

    protected static ?string $pluralModelLabel = 'Kunden & Team';

    protected static ?string $recordTitleAttribute = 'name';

    public static function form(Form $form): Form
    {
        $isAdmin = fn () => auth()->user()?->isAdmin();

        return $form->schema([
            Forms\Components\Section::make()->columns(2)->schema([
                Forms\Components\TextInput::make('name')->label('Name')->required(),
                Forms\Components\TextInput::make('email')->label('E-Mail')->email()->required()->unique(ignoreRecord: true),
                Forms\Components\TextInput::make('phone')->label('Telefon'),
                Forms\Components\Select::make('role')->label('Rolle')->options(User::ROLES)->required()->default('customer')
                    ->disabled(fn () => ! $isAdmin())->helperText('Nur Administratoren können Rollen ändern. «Team» hat Zugang zum Adminbereich.'),
                Forms\Components\TextInput::make('street')->label('Strasse'),
                Forms\Components\TextInput::make('postal_code')->label('PLZ'),
                Forms\Components\TextInput::make('city')->label('Ort'),
                Forms\Components\TextInput::make('password')->label('Neues Passwort')->password()->revealable()
                    ->rule(Password::min(12)->mixedCase()->numbers())
                    ->required(fn (string $operation) => $operation === 'create')
                    ->dehydrated(fn ($state) => filled($state))
                    ->visible($isAdmin)
                    ->helperText('Leer lassen, um das Passwort nicht zu ändern.'),
            ]),
        ]);
    }

    public static function infolist(Infolist $infolist): Infolist
    {
        return $infolist->schema([
            Infolists\Components\Section::make()->columns(3)->schema([
                Infolists\Components\TextEntry::make('name')->label('Name'),
                Infolists\Components\TextEntry::make('email')->label('E-Mail')->copyable(),
                Infolists\Components\TextEntry::make('role')->label('Rolle')->formatStateUsing(fn ($state) => User::ROLES[$state] ?? $state)->badge(),
                Infolists\Components\TextEntry::make('phone')->label('Telefon')->placeholder('–'),
                Infolists\Components\TextEntry::make('address')->label('Adresse')->state(fn (User $record) => $record->street ? "{$record->street}, {$record->postal_code} {$record->city}" : '–'),
                Infolists\Components\TextEntry::make('email_verified_at')->label('E-Mail bestätigt')->dateTime('d.m.Y')->placeholder('nein'),
                Infolists\Components\TextEntry::make('created_at')->label('Registriert')->dateTime('d.m.Y'),
                Infolists\Components\TextEntry::make('orders_count')->label('Bestellungen')->state(fn (User $record) => $record->orders()->count()),
            ]),
        ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->defaultSort('created_at', 'desc')
            ->columns([
                Tables\Columns\TextColumn::make('name')->label('Name')->searchable(),
                Tables\Columns\TextColumn::make('email')->label('E-Mail')->searchable(),
                Tables\Columns\TextColumn::make('role')->label('Rolle')->badge()->formatStateUsing(fn ($state) => User::ROLES[$state] ?? $state)
                    ->color(fn ($state) => $state === 'customer' ? 'gray' : 'primary'),
                Tables\Columns\TextColumn::make('orders_count')->label('Bestellungen')->counts('orders'),
                Tables\Columns\IconColumn::make('email_verified_at')->label('Bestätigt')->boolean(),
                Tables\Columns\TextColumn::make('created_at')->label('Registriert')->date('d.m.Y')->sortable(),
            ])
            ->filters([Tables\Filters\SelectFilter::make('role')->label('Rolle')->options(User::ROLES)])
            ->actions([
                Tables\Actions\ViewAction::make(),
                Tables\Actions\EditAction::make(),
                ...self::privacyActions(Tables\Actions\Action::class),
            ]);
    }

    /** Datenschutz (DSG): Auskunft als Datei und Löschung auf Anfrage. */
    public static function privacyActions(string $class): array
    {
        return [
            $class::make('export')->label('Daten exportieren')->icon('heroicon-o-arrow-down-tray')->color('gray')
                ->action(fn (User $record) => response()->streamDownload(
                    fn () => print(json_encode(AccountController::exportData($record), JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE)),
                    'daten-'.str($record->email)->slug().'.json',
                    ['Content-Type' => 'application/json'],
                )),
            $class::make('erase')->label('Konto löschen')->icon('heroicon-o-trash')->color('danger')
                ->visible(fn (User $record) => $record->id !== auth()->id() && (! $record->isTeam() || auth()->user()?->isAdmin()))
                ->requiresConfirmation()
                ->modalHeading('Konto und Personendaten löschen?')
                ->modalDescription('Konto und Newsletter-Eintrag werden gelöscht. Bestellungen bleiben wegen der gesetzlichen Aufbewahrungspflicht (10 Jahre) erhalten, werden aber vom Konto getrennt.')
                ->action(function (User $record) {
                    AccountController::deleteUser($record);
                    Notification::make()->title('Konto gelöscht')->success()->send();

                    return redirect(self::getUrl());
                }),
        ];
    }

    public static function canEdit(\Illuminate\Database\Eloquent\Model $record): bool
    {
        // Team-Konten bearbeiten nur Administratoren
        return auth()->user()?->isAdmin() || ! $record->isTeam();
    }

    public static function canDelete(\Illuminate\Database\Eloquent\Model $record): bool
    {
        return false;
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListUsers::route('/'),
            'create' => Pages\CreateUser::route('/create'),
            'view' => Pages\ViewUser::route('/{record}'),
            'edit' => Pages\EditUser::route('/{record}/edit'),
        ];
    }
}
