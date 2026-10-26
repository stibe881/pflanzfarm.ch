<?php

namespace App\Support;

use App\Models\Product;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Storage;

/**
 * Weitere Produkte aus dem bisherigen Shop auf pflanzfarm.ch.
 * install() ist wiederholbar: vorhandene Produkte (gleiche Adresse) bleiben unverändert.
 */
class ShopContent
{
    /** Bestand pro Grösse beim ersten Anlegen – im bisherigen Shop wurde kein Bestand geführt, bitte im Admin (Inventur) anpassen */
    public const START_STOCK = 10;

    public static function install(): void
    {
        $sort = (int) Product::query()->max('sort');
        foreach (self::products() as $data) {
            if (Product::query()->where('slug', $data['slug'])->exists()) {
                continue;
            }
            $variants = $data['variants'];
            unset($data['variants']);
            $data['image'] = self::image($data['image']);
            $data['sort'] = ++$sort;
            $product = Product::query()->create($data);
            foreach ($variants as $i => [$label, $chf]) {
                $product->variants()->create(['label' => $label, 'price' => (int) round($chf * 100), 'stock' => self::START_STOCK, 'active' => true, 'sort' => $i]);
            }
        }
        Cache::forget('catalog');
    }

    /** Mitgeliefertes Bild in den Upload-Speicher kopieren (wie beim Grundbestand), damit es im Admin ersetzt werden kann */
    private static function image(string $asset): string
    {
        $source = public_path(ltrim($asset, '/'));
        if (! is_file($source)) {
            return $asset;
        }
        $target = 'bilder/'.basename($asset);
        Storage::disk('public')->put($target, file_get_contents($source));

        return $target;
    }

    public static function products(): array
    {
        // Grössen und Preise aus dem bisherigen Shop, aufsteigend nach Grösse
        $eibe = [['80–100 cm', 35], ['100–120 cm', 45], ['120–140 cm', 65], ['140–160 cm', 85], ['160–180 cm', 125], ['180–200 cm', 195], ['200–225 cm', 250]];

        return [
            [
                'name' => 'Säuleneibe Taxus baccata ‘Fastigiata’', 'slug' => 'saeuleneibe-taxus-baccata-fastigiata', 'latin' => 'Taxus baccata ‘Fastigiata’',
                'category' => 'Heckenpflanzen', 'badge' => 'Neu', 'image' => '/assets/saeuleneibe-fastigiata.jpg',
                'traits' => ['Immergrün', 'Schmal', 'Schattenverträglich'],
                'description' => 'Schmal säulenförmig wachsende Eibe mit dunkelgrünen Nadeln. Ideal für schmale Hecken, als Blickfang im Beet oder im Kübel – schnittverträglich und auch im Schatten dicht.',
                'evergreen' => true, 'locations' => ['sonne', 'halbschatten', 'schatten'], 'uses' => ['hecke', 'sichtschutz', 'solitaer', 'kuebel'],
                'height_min_cm' => 300, 'height_max_cm' => 500, 'growth_cm' => 15, 'hardiness' => 'bis −25 °C', 'planting_months' => [3, 4, 5, 9, 10, 11],
                'variants' => $eibe,
            ],
            [
                'name' => 'Taxus baccata (Eibe)', 'slug' => 'taxus-baccata-eibe', 'latin' => 'Taxus baccata',
                'category' => 'Heckenpflanzen', 'badge' => 'Neu', 'image' => '/assets/taxus-baccata.jpg',
                'traits' => ['Immergrün', 'Heimisch', 'Schnittverträglich'],
                'description' => 'Die heimische Eibe wächst dicht und langlebig und verträgt jeden Schnitt. Für formschöne Hecken und Formgehölze in Sonne und Schatten.',
                'evergreen' => true, 'locations' => ['sonne', 'halbschatten', 'schatten'], 'uses' => ['hecke', 'sichtschutz', 'solitaer'],
                'height_min_cm' => 400, 'height_max_cm' => 1200, 'growth_cm' => 20, 'hardiness' => 'bis −25 °C', 'planting_months' => [3, 4, 5, 9, 10, 11],
                'variants' => $eibe,
            ],
            [
                'name' => 'Prunus lusitanica (Portugiesischer Lorbeer)', 'slug' => 'prunus-lusitanica', 'latin' => 'Prunus lusitanica',
                'category' => 'Heckenpflanzen', 'badge' => 'Neu', 'image' => '/assets/prunus-lusitanica.jpg',
                'traits' => ['Immergrün', 'Glänzendes Laub', 'Schnittverträglich'],
                'description' => 'Portugiesischer Lorbeer mit glänzend dunkelgrünem Laub und roten Blattstielen. Robuster, immergrüner Sichtschutz, der sich gut in Form schneiden lässt.',
                'evergreen' => true, 'locations' => ['sonne', 'halbschatten'], 'uses' => ['hecke', 'sichtschutz', 'solitaer', 'bienen'],
                'height_min_cm' => 300, 'height_max_cm' => 600, 'growth_cm' => 30, 'hardiness' => 'bis −18 °C', 'planting_months' => [3, 4, 5, 9, 10],
                'variants' => [['80–100 cm', 35], ['100–120 cm', 45], ['125–150 cm', 85], ['150–175 cm', 115], ['175–200 cm', 150], ['200–225 cm', 195], ['225–250 cm', 245], ['250–275 cm', 295]],
            ],
            [
                'name' => 'Immergrüne Kleingehölze', 'slug' => 'immergruene-kleingehoelze', 'latin' => 'Zwergkiefern (Pinus) – verschiedene Sorten',
                'category' => 'Kleingehölze', 'badge' => 'Neu', 'image' => '/assets/immergruene-kleingehoelze.jpg', 'height_label' => 'Sorte wählbar',
                'traits' => ['Immergrün', 'Kompakt', 'Kübel'],
                'description' => 'Kompakte Zwergkiefern für Steingarten, Grabbepflanzung, Kübel und kleine Gärten: Japanische Mädchenkiefer, Bergkiefer und Zwerg-Schlangenhautkiefer.',
                'evergreen' => true, 'locations' => ['sonne', 'halbschatten'], 'uses' => ['kuebel', 'solitaer'],
                'height_min_cm' => 50, 'height_max_cm' => 150, 'growth_cm' => 8, 'hardiness' => 'bis −25 °C', 'planting_months' => [3, 4, 5, 9, 10],
                'variants' => [['Japanische Mädchenkiefer', 4.35], ['Bergkiefer', 4.35], ['Zwerg-Schlangenhautkiefer', 4.35]],
            ],
        ];
    }
}
