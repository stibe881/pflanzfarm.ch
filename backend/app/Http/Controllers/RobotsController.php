<?php

namespace App\Http\Controllers;

use Illuminate\Http\Response;

/** robots.txt passend zur Domain: Testseite gesperrt, echte Website mit Sitemap der aktuellen Domain. */
class RobotsController extends Controller
{
    public function __invoke(): Response
    {
        $site = rtrim(config('app.url'), '/');
        $body = config('pflanzfarm.test_mode')
            ? "User-agent: *\nDisallow: /\n"
            : "User-agent: *\nDisallow: /admin\nDisallow: /api\nDisallow: /konto\nDisallow: /kasse\nDisallow: /warenkorb\n\nSitemap: {$site}/sitemap.xml\n";

        return response($body)->header('Content-Type', 'text/plain; charset=UTF-8');
    }
}
