<?php

namespace App\Filament\Pages;

use App\Services\Integrations;
use Filament\Actions\Action;
use Filament\Forms;
use Filament\Notifications\Notification;
use Filament\Pages\Page;
use Throwable;

/** Zeigt, ob E-Mail (Resend) und Zahlung (Stripe) richtig eingerichtet sind. */
class SystemStatus extends Page
{
    protected static ?string $navigationIcon = 'heroicon-o-signal';

    protected static ?string $navigationGroup = 'Verwaltung';

    protected static ?string $title = 'Systemstatus';

    protected static ?int $navigationSort = 95;

    protected static string $view = 'filament.pages.system-status';

    public ?array $rows = null;

    public static function canAccess(): bool
    {
        return (bool) auth()->user()?->isAdmin();
    }

    public function mount(): void
    {
        $this->recheck();
    }

    public function recheck(): void
    {
        $this->rows = app(Integrations::class)->checks();
    }

    protected function getHeaderActions(): array
    {
        return [
            Action::make('testmail')->label('Test-E-Mail senden')->icon('heroicon-o-envelope')
                ->form([Forms\Components\TextInput::make('to')->label('An')->email()->required()->default(fn () => auth()->user()?->email)])
                ->action(function (array $data) {
                    try {
                        app(Integrations::class)->sendTestMail($data['to']);
                        Notification::make()->title('Test-E-Mail verschickt')->body('Bitte im Posteingang (und im Spam-Ordner) nachsehen.')->success()->send();
                    } catch (Throwable $e) {
                        Notification::make()->title('Versand fehlgeschlagen')->body($e->getMessage())->danger()->persistent()->send();
                    }
                }),
            Action::make('reload')->label('Neu prüfen')->icon('heroicon-o-arrow-path')->color('gray')->action(fn () => $this->recheck()),
        ];
    }
}
