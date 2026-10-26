<?php

namespace App\Filament\Resources\GuideCategoryResource\Pages;

use App\Filament\Resources\GuideCategoryResource;
use Filament\Actions;
use Filament\Resources\Pages\ManageRecords;

class ManageGuideCategories extends ManageRecords
{
    protected static string $resource = GuideCategoryResource::class;

    protected function getHeaderActions(): array
    {
        return [Actions\CreateAction::make()];
    }
}
