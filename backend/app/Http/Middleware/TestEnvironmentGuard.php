<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * Schützt eine Testumgebung optional mit einem gemeinsamen Passwort (HTTP-Basic-Auth, nur wenn SITE_PASSWORD gesetzt ist)
 * und verhindert im Testmodus oder mit Passwort, dass Suchmaschinen sie indexieren.
 */
class TestEnvironmentGuard
{
    public function handle(Request $request, Closure $next): Response
    {
        $password = (string) config('pflanzfarm.site_password');
        if ($password === '' || $request->is('stripe/webhook', 'up')) {
            $response = $next($request);
            if (config('pflanzfarm.test_mode')) {
                $response->headers->set('X-Robots-Tag', 'noindex, nofollow');
            }

            return $response;
        }

        if (! hash_equals($password, (string) $request->getPassword())) {
            return response('Testumgebung – bitte anmelden.', 401, ['WWW-Authenticate' => 'Basic realm="Pflanzfarm Testumgebung", charset="UTF-8"']);
        }

        $response = $next($request);
        $response->headers->set('X-Robots-Tag', 'noindex, nofollow');

        return $response;
    }
}
