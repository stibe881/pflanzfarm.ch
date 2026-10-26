<?php

namespace App\Http\Responses;

use Filament\Http\Responses\Auth\Contracts\LogoutResponse;
use Illuminate\Http\RedirectResponse;

/** Nach dem Abmelden im Adminbereich zurück zur Anmeldung unter «Mein Konto» statt zur Filament-Anmeldemaske */
class AdminLogoutResponse implements LogoutResponse
{
    public function toResponse($request): RedirectResponse
    {
        return redirect()->to(url('/konto'));
    }
}
