<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Api\CatalogController;
use App\Models\GuideArticle;
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
            $product = Product::query()->where('slug', $m[1])->where('active', true)->with('activeVariants')->first();
            if (! $product) {
                $status = 404;
            } elseif (! is_file($file)) {
                // Neues Produkt, noch nicht vorgerendert: Inhalt und Meta-Daten serverseitig ausgeben
                $html = $this->meta($html, $product->name.' kaufen | Pflanzfarm', trim($product->name.': '.$product->description), '/produkt/'.$product->slug.'/');
                $html = $this->root($html, view('seo.product', $this->productData($product))->render());
            }
        } elseif (preg_match('#^ratgeber/([a-z0-9-]+)$#', $path, $m)) {
            $article = GuideArticle::query()->where('slug', $m[1])->where('published', true)->with('product')->first();
            if (! $article) {
                $status = 404;
            } elseif (! is_file($file)) {
                $html = $this->meta($html, $article->title.' | Ratgeber Pflanzfarm', $article->summary(), '/ratgeber/'.$article->slug.'/');
                $html = $this->root($html, view('seo.article', ['article' => $article, 'jsonLd' => [
                    '@context' => 'https://schema.org', '@type' => 'Article', 'headline' => $article->title,
                    'description' => $article->summary(), 'dateModified' => $article->updated_at?->toIso8601String(),
                    'author' => ['@type' => 'Organization', 'name' => 'Pflanzfarm Steinmann'],
                    'mainEntityOfPage' => rtrim(config('app.url'), '/').'/ratgeber/'.$article->slug.'/',
                ]])->render());
            }
        } elseif (in_array($path, ['konto', 'kasse', 'bestellung/danke', 'warenkorb'], true)) {
            $html = str_replace('<meta name="theme-color"', '<meta name="robots" content="noindex" />'."\n    ".'<meta name="theme-color"', $html);
        }

        return response($html, $status)->header('Content-Type', 'text/html; charset=UTF-8')->header('Cache-Control', 'no-cache, must-revalidate');
    }

    private function productData(Product $product): array
    {
        $variants = $product->activeVariants->filter(fn ($v) => $v->price > 0)->values();
        $image = CatalogController::image($product->image);
        $site = rtrim(config('app.url'), '/');
        $offers = $variants->map(fn ($v) => [
            '@type' => 'Offer', 'name' => $v->label, 'price' => number_format($v->price / 100, 2, '.', ''), 'priceCurrency' => 'CHF',
            'availability' => $v->stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
            'url' => $site.'/produkt/'.$product->slug.'/',
        ])->all();

        return [
            'product' => $product,
            'variants' => $variants,
            'image' => $image,
            'jsonLd' => array_filter([
                '@context' => 'https://schema.org', '@type' => 'Product', 'name' => $product->name,
                'description' => $product->description, 'image' => $image ? $site.$image : null,
                'brand' => ['@type' => 'Brand', 'name' => 'Pflanzfarm Steinmann'],
                'offers' => $product->price_on_request ? null : $offers,
            ]),
        ];
    }

    private function root(string $html, string $content): string
    {
        return str_replace('<div id="root"></div>', '<div id="root">'.$content.'</div>', $html);
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
