<?php

namespace App\Filament\Resources\UserResource\Pages;

use App\Filament\Resources\UserResource;
use Filament\Resources\Pages\CreateRecord;

class CreateUser extends CreateRecord
{
    protected static string $resource = UserResource::class;

    protected function afterCreate(): void
    {
        // Vom Team angelegte Konten gelten als bestätigt
        $this->record->forceFill(['email_verified_at' => now()])->save();
    }
}
