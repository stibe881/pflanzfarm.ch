<?php

namespace Database\Seeders;

use App\Models\GuideArticle;
use App\Models\Popup;
use App\Models\Product;
use App\Models\Reference;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Storage;

/** Übernimmt die bisherigen Inhalte der Website in die Datenbank. */
class DatabaseSeeder extends Seeder
{
    /** Kopiert ein mitgeliefertes Bild in den Upload-Speicher, damit es im Admin ersetzt werden kann. */
    private function img(string $asset): string
    {
        $source = public_path(ltrim($asset, '/'));
        if (! is_file($source)) {
            return $asset;
        }
        $target = 'bilder/'.basename($asset);
        Storage::disk('public')->put($target, file_get_contents($source));

        return $target;
    }

    public function run(): void
    {
        $thuja = Product::query()->create([
            'name' => 'Thuja Smaragd', 'slug' => 'thuja-smaragd', 'latin' => 'Thuja occidentalis „Smaragd“',
            'category' => 'Heckenpflanzen', 'badge' => 'Bestseller', 'image' => $this->img('/assets/thuja-smaragd.jpg'),
            'traits' => ['Immergrün', 'Pflegeleicht'], 'plants_per_meter' => 3, 'sort' => 1,
            'description' => 'Der bewährte Klassiker für dichte, formschöne Hecken und natürlichen Sichtschutz.',
        ]);
        // Nur für 80–100 cm ist ein Preis bekannt; die übrigen Grössen sind inaktiv, bis im Admin Preis und Bestand erfasst sind.
        foreach (['80–100 cm', '100–120 cm', '120–140 cm', '140–160 cm', '160–180 cm', '180–200 cm', '200–225 cm', '225–250 cm'] as $i => $label) {
            $thuja->variants()->create(['label' => $label, 'price' => $i === 0 ? 1500 : 0, 'stock' => $i === 0 ? 48 : 0, 'active' => $i === 0, 'sort' => $i]);
        }

        $photinia = Product::query()->create([
            'name' => 'Photinia fraseri ‘Red Robin’', 'slug' => 'photinia-fraseri-red-robin', 'latin' => 'Photinia × fraseri ‘Red Robin’',
            'category' => 'Heckenpflanzen', 'badge' => 'Beliebt', 'image' => $this->img('/assets/photinia-red-robin.jpg'),
            'traits' => ['Immergrün', 'Sonnig', 'Blütenreich'], 'plants_per_meter' => 2, 'sort' => 2,
            'height_label' => 'Liefergrösse auf Anfrage',
            'description' => 'Glanzmispel mit attraktivem rotem Austrieb für strukturierte, immergrüne Pflanzungen.',
        ]);
        $photinia->variants()->create(['label' => 'Liefergrösse auf Anfrage', 'price' => 4500, 'stock' => 17]);

        $berries = Product::query()->create([
            'name' => 'Diverse Beerensträucher', 'slug' => 'diverse-beerenstraeucher', 'latin' => 'Ribes – verschiedene Sorten',
            'category' => 'Beerensträucher', 'badge' => 'Sortiment', 'image' => $this->img('/assets/diverse-beerenstraeucher.jpg'),
            'traits' => ['Sonnig', 'Naschgarten'], 'sort' => 3, 'price_on_request' => true, 'height_label' => 'Verschiedene Sorten',
            'description' => 'Verschiedene Beerensträucher für einen vielfältigen Naschgarten. Preis und Verfügbarkeit auf Anfrage.',
        ]);
        $berries->variants()->create(['label' => 'Sorten und Grössen auf Anfrage', 'price' => 0, 'stock' => 6]);

        foreach ([
            ['Formgehölze & Taxus', 'Baumschule', 'Auswahl an Formgehölzen und Taxus aus der Pflanzfarm.', '/assets/pflanzfarm-garten-1.jpg', ['Neubau']],
            ['Sichtschutz mit Photinia', 'Garten & Umbauten', 'Immergrüner Sichtschutz mit Photinia und sauber gefassten Gartenflächen.', '/assets/pflanzfarm-garten-2.jpg', ['Sichtschutz', 'Gartenumbau']],
            ['Thuja-Sichtschutz', 'Garten & Umbauten', 'Gepflegter Sichtschutz mit Thuja für einen klar gefassten Gartenraum.', '/assets/pflanzfarm-garten-3.jpg', ['Sichtschutz']],
        ] as $i => [$title, $cat, $desc, $img, $tags]) {
            Reference::query()->create(['title' => $title, 'category' => $cat, 'description' => $desc, 'image' => $this->img($img), 'location' => 'Kanton Luzern', 'year' => 2025, 'tags' => $tags, 'sort' => $i]);
        }

        Popup::query()->create([
            'title' => 'Herbstzeit ist Pflanzzeit', 'text' => 'Jetzt Heckenpflanzen sichern und im passenden Pflanzfenster liefern lassen.',
            'cta_label' => 'Hecken entdecken', 'cta_target' => 'shop', 'image' => $this->img('/assets/pflanzfarm-garten-3.jpg'),
            'starts_at' => '2026-09-15', 'ends_at' => '2026-11-30', 'pages' => 'startseite', 'delay' => 1,
        ]);
        Popup::query()->create([
            'title' => 'Frühling: Zeit für neue Hecken', 'text' => 'Sobald der Boden frostfrei ist, beginnt die zweite Pflanzsaison. Sichern Sie sich jetzt Ihre Heckenpflanzen – auf Wunsch mit Pflanzservice.',
            'cta_label' => 'Hecken entdecken', 'cta_target' => 'shop', 'image' => $this->img('/assets/pflanzfarm-garten-2.jpg'),
            'starts_at' => '2027-03-01', 'ends_at' => '2027-05-15', 'pages' => 'startseite', 'delay' => 1,
        ]);

        $articles = [
            ['Thuja-Hecke pflanzen: Zeitpunkt, Abstand und Pflege', 'thuja-hecke-pflanzen', $thuja->id, [
                'Die beste Pflanzzeit ist der Herbst von September bis November oder der Frühling von März bis Mai – jeweils bei frostfreiem, nicht zu nassem Boden. Im Herbst wurzeln die Pflanzen dank der Bodenwärme besonders gut ein.',
                'Für eine dichte Hecke mit Thuja Smaragd in der Grösse 80–100 cm rechnen wir mit rund drei Pflanzen pro Laufmeter. Spannen Sie eine Schnur, damit die Hecke gerade wird, und heben Sie Pflanzlöcher aus, die etwa doppelt so breit sind wie der Wurzelballen.',
                'Wässern Sie den Ballen vor dem Pflanzen gründlich, setzen Sie die Pflanze nicht tiefer als im Topf und giessen Sie kräftig an. Eine Mulchschicht hält die Feuchtigkeit im Boden. Im ersten Jahr regelmässig giessen – als immergrüne Pflanze braucht Thuja auch an frostfreien Wintertagen Wasser.',
            ]],
            ['Photinia ‘Red Robin’ schneiden für den roten Austrieb', 'photinia-schneiden', $photinia->id, [
                'Die Glanzmispel zeigt ihren leuchtend roten Austrieb vor allem nach einem Schnitt. Schneiden Sie die Hecke nach dem ersten Austrieb ab Ende Mai bis Juni in Form.',
                'Ein zweiter, leichter Schnitt bis spätestens Mitte August regt einen weiteren roten Austrieb an. Später sollten Sie nicht mehr stark schneiden, damit die jungen Triebe vor dem Winter ausreifen.',
                'Photinia liebt sonnige bis halbschattige, etwas geschützte Standorte. In den ersten Wintern schützt ein Vlies bei starkem Frost ohne Schnee vor Austrocknung.',
            ]],
            ['Beerensträucher pflanzen und schneiden', 'beerenstraeucher-pflanzen', $berries->id, [
                'Johannis- und Stachelbeeren pflanzen Sie am besten im Herbst an einen sonnigen bis halbschattigen Platz. Lassen Sie zwischen den Sträuchern etwa 1.2 bis 1.5 Meter Abstand.',
                'Setzen Sie Johannisbeeren etwas tiefer als im Topf – so bilden sie mehr kräftige Bodentriebe. Nach der Ernte entfernen Sie die ältesten, drei- bis vierjährigen Triebe bodennah und lassen junge, kräftige Triebe stehen.',
            ]],
            ['Richtig giessen im ersten Standjahr', 'richtig-giessen', null, [
                'Lieber selten, dafür durchdringend: Eine frisch gepflanzte Heckenpflanze braucht bei Trockenheit ein- bis zweimal pro Woche etwa 10 bis 20 Liter Wasser, je nach Grösse und Boden.',
                'Machen Sie die Fingerprobe: Ist die Erde in einigen Zentimetern Tiefe trocken, wird gegossen. Staunässe vermeiden – bei schweren Böden hilft eine Drainageschicht im Pflanzloch.',
            ]],
            ['Wann darf die Hecke geschnitten werden?', 'hecke-schneiden', null, [
                'Ein Formschnitt im Juni sowie ein zweiter leichter Schnitt im Spätsommer halten die meisten Hecken dicht. Schneiden Sie an einem bedeckten Tag, damit die Schnittstellen nicht verbrennen.',
                'Prüfen Sie vor jedem Schnitt, ob Vögel in der Hecke brüten – während der Brutzeit von etwa März bis August sind stärkere Rückschnitte zu vermeiden.',
            ]],
        ];
        foreach ($articles as $i => [$title, $slug, $productId, $paras]) {
            GuideArticle::query()->create(['title' => $title, 'slug' => $slug, 'product_id' => $productId, 'body' => implode("\n\n", $paras), 'sort' => $i]);
        }
    }
}
