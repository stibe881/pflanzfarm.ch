<?php

namespace App\Http\Controllers;

use App\Models\GuideArticle;
use App\Models\Product;
use Illuminate\Http\Response;

/** Sitemap für Suchmaschinen, immer aktuell mit allen sichtbaren Produkten und Ratgeber-Artikeln. */
class SitemapController extends Controller
{
    public const PAGES = ['/', '/shop/', '/referenzen/', '/ueber-uns/', '/gartenservice/', '/ratgeber/', '/kontakt/', '/agb/', '/datenschutz/', '/impressum/', '/barrierefreiheit/'];

    public function __invoke(): Response
    {
        $site = rtrim(config('app.url'), '/');
        $urls = collect(self::PAGES)->map(fn ($p) => [$p, null])
            ->concat(Product::query()->where('active', true)->orderBy('sort')->get(['slug', 'updated_at'])->map(fn ($p) => ['/produkt/'.$p->slug.'/', $p->updated_at]))
            ->concat(GuideArticle::query()->where('published', true)->orderBy('sort')->get(['slug', 'updated_at'])->map(fn ($a) => ['/ratgeber/'.$a->slug.'/', $a->updated_at]));

        $xml = '<?xml version="1.0" encoding="UTF-8"?>'."\n".'<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'."\n";
        foreach ($urls as [$path, $updated]) {
            $xml .= '  <url><loc>'.e($site.$path).'</loc>'.($updated ? '<lastmod>'.$updated->toDateString().'</lastmod>' : '').'</url>'."\n";
        }

        return response($xml.'</urlset>'."\n")->header('Content-Type', 'application/xml; charset=UTF-8');
    }
}
