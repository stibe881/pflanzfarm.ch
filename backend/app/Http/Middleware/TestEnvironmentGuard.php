<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * Schützt eine Testumgebung mit einem gemeinsamen Passwort (HTTP-Basic-Auth)
 * und verhindert, dass Suchmaschinen sie indexieren. Aktiv nur, wenn SITE_PASSWORD gesetzt ist.
 */
class TestEnvironmentGuard
{
    public function handle(Request $request, Closure $next): Response
    {
        $password = (string) config('pflanzfarm.site_password');
        if ($password === '' || $request->is('stripe/webhook', 'up')) {
            return $next($request);
        }

        if (! hash_equals($password, (string) $request->getPassword())) {
            return response('Testumgebung – bitte anmelden.', 401, ['WWW-Authenticate' => 'Basic realm="Pflanzfarm Testumgebung", charset="UTF-8"']);
        }

        $response = $next($request);
        $response->headers->set('X-Robots-Tag', 'noindex, nofollow');

        return $response;
    }
}
