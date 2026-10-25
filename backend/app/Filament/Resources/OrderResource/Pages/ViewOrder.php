<?php

namespace App\Filament\Resources\OrderResource\Pages;

use App\Filament\Resources\OrderResource;
use Filament\Actions;
use Filament\Resources\Pages\ViewRecord;

class ViewOrder extends ViewRecord
{
    protected static string $resource = OrderResource::class;

    public function getTitle(): string
    {
        return 'Bestellung '.$this->record->number;
    }

    protected function getHeaderActions(): array
    {
        return [...OrderResource::statusActions(Actions\Action::class), Actions\EditAction::make()->color('gray')];
    }
}
