<?php

namespace App\Http\Middleware;

use Closure;
use Filament\Facades\Filament;
use Filament\Http\Middleware\Authenticate;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

/**
 * Wie Filaments Authenticate, aber ein angemeldetes Kundenkonto führt nicht zu «403»,
 * sondern wird abgemeldet und zur Admin-Anmeldung mit Hinweis weitergeleitet.
 */
class AdminAuthenticate extends Authenticate
{
    public function handle($request, Closure $next, ...$guards): Response
    {
        $user = Auth::guard(Filament::getCurrentPanel()?->getAuthGuard() ?? 'web')->user();
        if ($user && ! $user->canAccessPanel(Filament::getCurrentPanel())) {
            Auth::guard('web')->logout();
            $request->session()->invalidate();
            $request->session()->regenerateToken();
            $request->session()->flash('admin_notice', $user->isTeam()
                ? 'Bitte bestätigen Sie zuerst Ihre E-Mail-Adresse.'
                : 'Sie waren mit einem Kundenkonto angemeldet. Bitte melden Sie sich mit Ihrem Team-Konto an.');

            return redirect()->to(Filament::getCurrentPanel()->getLoginUrl());
        }

        return parent::handle($request, $next, ...$guards);
    }
}
