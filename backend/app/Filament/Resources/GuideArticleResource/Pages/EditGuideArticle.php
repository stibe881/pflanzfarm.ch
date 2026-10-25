<?php

namespace App\Filament\Resources\GuideArticleResource\Pages;

use App\Filament\Resources\GuideArticleResource;
use Filament\Actions;
use Filament\Resources\Pages\EditRecord;

class EditGuideArticle extends EditRecord
{
    protected static string $resource = GuideArticleResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\DeleteAction::make(),
        ];
    }
}
