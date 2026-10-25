<?php

namespace App\Filament\Resources\UserResource\Pages;

use App\Filament\Resources\UserResource;
use Filament\Resources\Pages\EditRecord;

class EditUser extends EditRecord
{
    protected static string $resource = UserResource::class;

    protected function mutateFormDataBeforeSave(array $data): array
    {
        // Rollen dürfen nur Administratoren ändern
        if (! auth()->user()?->isAdmin()) {
            unset($data['role'], $data['password']);
        }

        return $data;
    }
}
