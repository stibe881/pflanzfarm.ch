<?php

namespace App\Filament\Resources\OrderResource\Pages;

use App\Filament\Resources\OrderResource;
use App\Services\InvoicePdf;
use Filament\Actions;
use Filament\Forms;
use Filament\Resources\Pages\ListRecords;
use Illuminate\Support\Carbon;

class ListOrders extends ListRecords
{
    protected static string $resource = OrderResource::class;

    /** Gewählte Ansicht (Liste oder Board) pro Person merken. */
    public static function rememberView(string $view): void
    {
        $user = auth()->user();
        if ($user && ($user->admin_preferences['orders_view'] ?? null) !== $view) {
            $user->forceFill(['admin_preferences' => array_merge($user->admin_preferences ?? [], ['orders_view' => $view])])->saveQuietly();
        }
    }

    public function mount(): void
    {
        if ((auth()->user()?->admin_preferences['orders_view'] ?? null) === 'board' && ! request()->has('tableFilters')) {
            $this->redirect(OrderResource::getUrl('board'));

            return;
        }
        parent::mount();
    }

    protected function getHeaderActions(): array
    {
        return [
            Actions\Action::make('board')->label('Board-Ansicht')->icon('heroicon-o-view-columns')->color('gray')
                ->action(function () {
                    self::rememberView('board');

                    return redirect(OrderResource::getUrl('board'));
                }),
            Actions\Action::make('pickingList')->label('Rüstliste')->icon('heroicon-o-clipboard-document-check')->color('gray')
                ->modalDescription('Alle bestätigten und neuen Bestellungen mit Termin an diesem Tag, mit Gesamtmengen zum Bereitstellen.')
                ->form([Forms\Components\DatePicker::make('date')->label('Tag')->native(false)->displayFormat('d.m.Y')->default(today())->required()])
                ->modalSubmitActionLabel('PDF herunterladen')
                ->action(function (array $data) {
                    $date = Carbon::parse($data['date']);

                    return response()->streamDownload(fn () => print(app(InvoicePdf::class)->pickingList($date)), 'Ruestliste-'.$date->format('Y-m-d').'.pdf');
                }),
            Actions\CreateAction::make()->label('Bestellung erfassen'),
        ];
    }
}
