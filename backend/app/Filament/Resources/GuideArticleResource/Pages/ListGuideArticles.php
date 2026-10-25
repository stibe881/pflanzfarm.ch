<?php

namespace App\Filament\Resources\GuideArticleResource\Pages;

use App\Filament\Resources\GuideArticleResource;
use Filament\Actions;
use Filament\Resources\Pages\ListRecords;

class ListGuideArticles extends ListRecords
{
    protected static string $resource = GuideArticleResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\CreateAction::make(),
        ];
    }
}
