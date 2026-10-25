<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Response;

class SpaController extends Controller
{
    /**
     * Liefert die Website aus. Vorgerenderte Seiten (public/<pfad>/index.html) bedient der Webserver direkt;
     * hier landen dynamische Pfade wie neue Produkte, Konto oder Kasse.
     */
    public function __invoke(?string $path = null): Response
    {
        $path = trim((string) $path, '/');
        $file = public_path(($path !== '' ? $path.'/' : '').'index.html');
        // spa.html ist die leere App-Vorlage (ohne vorgerenderten Inhalt), erzeugt von frontend/build.mjs
        $html = is_file($file) ? file_get_contents($file) : (string) @file_get_contents(resource_path('spa.html'));
        if ($html === '') {
            abort(404);
        }

        $status = 200;
        if (preg_match('#^produkt/([a-z0-9-]+)$#', $path, $m)) {
            $product = Product::query()->where('slug', $m[1])->where('active', true)->first();
            if (! $product) {
                $status = 404;
            } elseif (! is_file($file)) {
                $html = $this->meta($html, $product->name.' kaufen | Pflanzfarm', trim($product->name.': '.$product->description), '/produkt/'.$product->slug.'/');
            }
        } elseif (in_array($path, ['konto', 'kasse', 'bestellung/danke', 'warenkorb'], true)) {
            $html = str_replace('<meta name="theme-color"', '<meta name="robots" content="noindex" />'."\n    ".'<meta name="theme-color"', $html);
        }

        return response($html, $status)->header('Content-Type', 'text/html; charset=UTF-8');
    }

    private function meta(string $html, string $title, string $description, string $path): string
    {
        $url = rtrim(config('app.url'), '/').$path;
        $e = fn ($v) => htmlspecialchars($v, ENT_QUOTES);

        return preg_replace(
            ['#<title>[^<]*</title>#', '#(<meta name="description" content=")[^"]*#', '#(<link rel="canonical" href=")[^"]*#', '#(<meta property="og:title" content=")[^"]*#', '#(<meta property="og:description" content=")[^"]*#', '#(<meta property="og:url" content=")[^"]*#'],
            ['<title>'.$e($title).'</title>', '${1}'.$e($description), '${1}'.$e($url), '${1}'.$e($title), '${1}'.$e($description), '${1}'.$e($url)],
            $html
        );
    }
}
