<?php

namespace App\Filament\Resources\CustomerResource\Pages;

use App\Filament\Resources\CustomerResource;
use App\Filament\Resources\OrderResource;
use Filament\Actions;
use Filament\Resources\Pages\ViewRecord;

class ViewCustomer extends ViewRecord
{
    protected static string $resource = CustomerResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\EditAction::make()->label('Bearbeiten / Notiz'),
            Actions\Action::make('newOrder')->label('Neue Bestellung')->icon('heroicon-o-plus')
                ->url(fn () => OrderResource::getUrl('create', ['customer' => $this->record->id])),
        ];
    }
}
