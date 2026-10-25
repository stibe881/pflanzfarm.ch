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

    protected function getHeaderActions(): array
    {
        return [
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
