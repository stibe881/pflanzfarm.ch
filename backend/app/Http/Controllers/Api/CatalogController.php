<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\DeliveryZone;
use App\Models\GuideArticle;
use App\Models\GuideCategory;
use App\Models\Popup;
use App\Models\Product;
use App\Models\Reference;
use App\Models\Setting;
use App\Services\ImageOptimizer;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Storage;

class CatalogController extends Controller
{
    public const CACHE_KEY = 'catalog';

    /** Katalog für die Website, 10 Minuten zwischengespeichert; jede Änderung im Admin leert den Speicher sofort. */
    public function __invoke(): JsonResponse
    {
        return response()->json(Cache::remember(self::CACHE_KEY, now()->addMinutes(10), fn () => $this->build()));
    }

    private function build(): array
    {
        $products = Product::query()->where('active', true)->orderBy('sort')->orderBy('id')
            ->with('activeVariants.shippingClass')->get()
            ->map(fn (Product $p) => self::product($p));

        $popup = Popup::query()->current()->latest('starts_at')->first();

        return [
            'products' => $products,
            'references' => Reference::query()->where('active', true)->orderBy('sort')->orderBy('id')->get()->map(fn (Reference $r) => [
                'id' => $r->id,
                'title' => $r->title,
                'category' => $r->category,
                'description' => $r->description,
                'image' => self::image($r->image),
                'imageSet' => self::imageSet($r->image),
                'before' => $r->before_image ? self::image($r->before_image) : null,
                'beforeSet' => $r->before_image ? self::imageSet($r->before_image) : null,
                'location' => $r->location,
                'year' => $r->year,
                'tags' => $r->tags ?? [],
                'onHomepage' => $r->on_homepage,
            ]),
            'articles' => GuideArticle::query()->where('published', true)->orderBy('sort')->orderBy('id')->with(['product:id,slug', 'category:id,name,slug'])->get()->map(fn (GuideArticle $a) => [
                'id' => $a->slug,
                'title' => $a->title,
                'category' => $a->category?->name,
                'categorySlug' => $a->category?->slug,
                'image' => $a->image ? self::image($a->image) : null,
                'imageSet' => $a->image ? self::imageSet($a->image) : null,
                'excerpt' => $a->summary(),
                'paras' => $a->paragraphs(),
                'updated' => $a->updated_at?->toDateString(),
                'product' => $a->product?->slug,
            ]),
            // Kategorien in der Admin-Reihenfolge (nur solche mit veröffentlichten Artikeln)
            'guideCategories' => GuideCategory::query()->whereHas('articles', fn ($q) => $q->where('published', true))
                ->orderBy('sort')->orderBy('name')->get(['name', 'slug'])->map(fn ($c) => ['name' => $c->name, 'slug' => $c->slug]),
            'popup' => $popup ? [
                'id' => $popup->id,
                'title' => $popup->title,
                'text' => $popup->text,
                'cta' => $popup->cta_label,
                'ctaTarget' => $popup->cta_target,
                'image' => self::image($popup->image),
                'imageSet' => self::imageSet($popup->image),
                'target' => $popup->pages,
                'delay' => $popup->delay,
                'startsAt' => $popup->starts_at?->toDateString(),
                'endsAt' => $popup->ends_at?->toDateString(),
            ] : null,
            'settings' => [
                'openingHours' => Setting::get('opening_hours'),
                'openingNote' => Setting::get('opening_note'),
                'freeDeliveryFrom' => (int) Setting::get('free_delivery_from'),
                'invoiceEnabled' => (bool) Setting::get('invoice_enabled'),
                'cashEnabled' => (bool) Setting::get('cash_enabled'),
                'testMode' => (bool) config('pflanzfarm.test_mode'),
                'planting' => (bool) Setting::get('planting_enabled'),
                'plantingMinFee' => (int) Setting::get('planting_min_fee') / 100,
                'zones' => DeliveryZone::query()->orderBy('sort')->orderBy('id')->get()->map(fn ($z) => [
                    'name' => $z->name,
                    'ranges' => collect($z->postal_ranges)->map(fn ($r) => [(int) $r['from'], (int) (($r['to'] ?? null) ?: $r['from'])])->values(),
                    'surcharge' => $z->surcharge / 100,
                    'deliverable' => $z->deliverable,
                ])->values(),
            ],
        ];
    }

    public static function product(Product $p): array
    {
        // Grössen ohne Preis sind nicht bestellbar (ausser «Preis auf Anfrage»)
        $variants = $p->activeVariants->filter(fn ($v) => $p->price_on_request || $v->price > 0)->map(fn ($v) => [
            'id' => $v->id,
            'label' => $v->label,
            'price' => $v->price / 100,
            'stock' => max(0, $v->stock),
            'pickupOnly' => $v->pickup_only,
            'plantingPrice' => $v->effectivePlantingPrice() / 100,
            'shipping' => ($class = $v->effectiveShippingClass()) ? ['name' => $class->name, 'price' => $class->price / 100] : null,
        ])->values();

        return [
            'id' => $p->slug,
            'dbId' => $p->id,
            'slug' => $p->slug,
            'name' => $p->name,
            'latin' => $p->latin,
            'category' => $p->category,
            'price' => $variants->min('price') ?? 0,
            'priceOnRequest' => $p->price_on_request,
            'image' => self::image($p->image),
            'imageSet' => self::imageSet($p->image),
            'gallery' => collect($p->gallery ?? [])->map(fn ($g) => self::image(
                Storage::disk('public')->exists($v = ImageOptimizer::variant($g, 1600)) ? $v : $g
            ))->values()->all(),
            'discounts' => collect($p->volume_discounts ?? [])->map(fn ($t) => ['minQty' => (int) $t['min_qty'], 'percent' => min(90, (int) $t['percent'])])
                ->filter(fn ($t) => $t['minQty'] > 1 && $t['percent'] > 0)->sortBy('minQty')->values()->all(),
            'badge' => $p->badge,
            'height' => $p->height_label ?? ($variants->first()['label'] ?? ''),
            'traits' => $p->traits ?? [],
            'description' => $p->description,
            'profile' => [
                'evergreen' => $p->evergreen,
                'locations' => array_values((array) $p->locations),
                'uses' => array_values((array) $p->uses),
                'heightMin' => $p->height_min_cm,
                'heightMax' => $p->height_max_cm,
                'growth' => $p->growth_cm,
                'hardiness' => $p->hardiness,
                'months' => array_map('intval', array_values((array) $p->planting_months)),
            ],
            'care' => $p->careAdvice(),
            'variants' => $variants->pluck('label')->all(),
            'variantData' => $variants->all(),
            'stock' => $variants->sum('stock'),
        ];
    }

    /** Bildpfade: mitgelieferte Bilder liegen unter /assets, hochgeladene unter /storage. */
    public static function image(?string $path): string
    {
        if (! $path) {
            return '';
        }

        // Relativ, damit die Bilder unabhängig von der Domain funktionieren
        return str_starts_with($path, '/assets/') ? $path : '/storage/'.ltrim($path, '/');
    }

    public static function imageSet(?string $path): string
    {
        // Aus den mitgelieferten Bildern übernommene Uploads nutzen weiterhin die optimierten WebP-Dateien
        if ($path && str_starts_with($path, 'bilder/')) {
            $path = '/assets/'.basename($path);
        }
        if (! $path || ! str_starts_with($path, '/assets/')) {
            // Hochgeladene Bilder: optimierte WebP-Fassungen, falls vorhanden
            return ($path ? ImageOptimizer::srcset(ltrim($path, '/')) : null) ?? self::image($path);
        }
        // Für die mitgelieferten Bilder gibt es WebP-Varianten in zwei Breiten.
        $map = [
            '/assets/thuja-smaragd.jpg' => '/assets/thuja-smaragd-400.webp 400w, /assets/thuja-smaragd-800.webp 800w',
            '/assets/photinia-red-robin.jpg' => '/assets/photinia-red-robin-400.webp 400w, /assets/photinia-red-robin-800.webp 800w',
            '/assets/diverse-beerenstraeucher.jpg' => '/assets/diverse-beerenstraeucher-400.webp 400w, /assets/diverse-beerenstraeucher-800.webp 800w',
            '/assets/pflanzfarm-garten-1.jpg' => '/assets/pflanzfarm-garten-1-640.webp 640w, /assets/pflanzfarm-garten-1-1280.webp 1280w',
            '/assets/pflanzfarm-garten-2.jpg' => '/assets/pflanzfarm-garten-2-640.webp 640w, /assets/pflanzfarm-garten-2-1280.webp 1280w',
            '/assets/pflanzfarm-garten-3.jpg' => '/assets/pflanzfarm-garten-3-640.webp 640w, /assets/pflanzfarm-garten-3-1280.webp 1280w',
        ];

        return $map[$path] ?? $path;
    }
}
