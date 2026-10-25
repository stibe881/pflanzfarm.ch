<?php

namespace App\Services;

use App\Models\Product;
use App\Models\ProductVariant;
use App\Models\ShippingClass;

/** Produkte und Lager als CSV (Excel-tauglich: Semikolon, UTF-8 mit BOM) exportieren und wieder einlesen. */
class ProductCsv
{
    public const HEADER = ['variante_id', 'produkt_slug', 'produkt', 'kategorie', 'groesse', 'artikelnummer', 'preis_chf', 'lager', 'bestellbar', 'nur_abholung', 'versandklasse'];

    public function export(): string
    {
        $out = fopen('php://temp', 'r+');
        fwrite($out, "\xEF\xBB\xBF");
        fputcsv($out, self::HEADER, ';', '"', '');
        $variants = ProductVariant::query()->with(['product', 'shippingClass'])->get()->sortBy(fn ($v) => [$v->product->sort, $v->product->name, $v->sort]);
        foreach ($variants as $v) {
            fputcsv($out, [
                $v->id, $v->product->slug, $v->product->name, $v->product->category, $v->label, $v->sku,
                number_format($v->price / 100, 2, '.', ''), $v->stock, $v->active ? 'ja' : 'nein', $v->pickup_only ? 'ja' : 'nein', $v->shippingClass?->name,
            ], ';', '"', '');
        }
        rewind($out);

        return (string) stream_get_contents($out);
    }

    /**
     * Aktualisiert Grössen (über variante_id, sonst Produkt + Grösse oder Artikelnummer) und legt neue Grössen
     * bei bestehenden Produkten an. Leere Zellen lassen den Wert unverändert.
     *
     * @return array{updated:int, created:int, unchanged:int, errors: array<int, string>}
     */
    public function import(string $csv): array
    {
        $csv = preg_replace('/^\xEF\xBB\xBF/', '', $csv);
        $lines = preg_split('/\r\n|\n|\r/', trim($csv));
        $delimiter = substr_count($lines[0] ?? '', ';') >= substr_count($lines[0] ?? '', ',') ? ';' : ',';
        $header = array_map(fn ($h) => strtolower(trim($h)), str_getcsv(array_shift($lines) ?? '', $delimiter, '"', ''));
        if (! in_array('groesse', $header, true) && ! in_array('variante_id', $header, true)) {
            return ['updated' => 0, 'created' => 0, 'unchanged' => 0, 'errors' => ['Kopfzeile nicht erkannt. Bitte zuerst exportieren und die Datei als Vorlage verwenden.']];
        }

        $stats = ['updated' => 0, 'created' => 0, 'unchanged' => 0, 'errors' => []];
        $classes = ShippingClass::query()->pluck('id', 'name')->mapWithKeys(fn ($id, $n) => [mb_strtolower($n) => $id]);
        foreach ($lines as $n => $line) {
            if (trim($line) === '') {
                continue;
            }
            $row = array_combine($header, array_pad(str_getcsv($line, $delimiter, '"', ''), count($header), ''));
            $row = array_map('trim', $row);
            $nr = $n + 2;

            $variant = ($row['variante_id'] ?? '') !== '' ? ProductVariant::query()->find((int) $row['variante_id']) : null;
            $product = $variant?->product ?? (($row['produkt_slug'] ?? '') !== '' ? Product::query()->where('slug', $row['produkt_slug'])->first() : null);
            if (! $variant && $product && ($row['groesse'] ?? '') !== '') {
                $variant = $product->variants()->where('label', $row['groesse'])->first();
            }
            if (! $variant && ($row['artikelnummer'] ?? '') !== '') {
                $variant = ProductVariant::query()->where('sku', $row['artikelnummer'])->first();
            }

            $data = [];
            if (($row['preis_chf'] ?? '') !== '') {
                $price = str_replace(["'", ' ', 'CHF', ','], ['', '', '', '.'], $row['preis_chf']);
                if (! is_numeric($price) || $price < 0) {
                    $stats['errors'][] = "Zeile {$nr}: Preis «{$row['preis_chf']}» ist keine Zahl.";

                    continue;
                }
                $data['price'] = (int) round(((float) $price) * 100);
            }
            if (($row['lager'] ?? '') !== '') {
                if (! preg_match('/^-?\d+$/', $row['lager'])) {
                    $stats['errors'][] = "Zeile {$nr}: Lager «{$row['lager']}» ist keine ganze Zahl.";

                    continue;
                }
                $data['stock'] = (int) $row['lager'];
            }
            foreach (['bestellbar' => 'active', 'nur_abholung' => 'pickup_only'] as $col => $attr) {
                if (($row[$col] ?? '') !== '') {
                    $data[$attr] = in_array(mb_strtolower($row[$col]), ['ja', '1', 'x', 'yes', 'true'], true);
                }
            }
            if (($row['artikelnummer'] ?? '') !== '') {
                $data['sku'] = $row['artikelnummer'];
            }
            if (($row['versandklasse'] ?? '') !== '') {
                if (! isset($classes[mb_strtolower($row['versandklasse'])])) {
                    $stats['errors'][] = "Zeile {$nr}: Versandklasse «{$row['versandklasse']}» gibt es nicht.";

                    continue;
                }
                $data['shipping_class_id'] = $classes[mb_strtolower($row['versandklasse'])];
            }

            if ($variant) {
                $variant->fill($data);
                if ($variant->isDirty()) {
                    $variant->save();
                    $stats['updated']++;
                } else {
                    $stats['unchanged']++;
                }
            } elseif ($product && ($row['groesse'] ?? '') !== '') {
                $product->variants()->create($data + ['label' => $row['groesse'], 'price' => $data['price'] ?? 0, 'stock' => $data['stock'] ?? 0, 'sort' => $product->variants()->max('sort') + 1]);
                $stats['created']++;
            } else {
                $stats['errors'][] = "Zeile {$nr}: Produkt «".($row['produkt_slug'] ?: $row['produkt'] ?? '')."» nicht gefunden (neue Produkte bitte im Admin anlegen).";
            }
        }

        return $stats;
    }

    /** Preise anpassen: Prozent (z. B. +5 oder −10) und Rundung auf 5 Rappen, 50 Rappen oder ganze Franken. */
    public function adjustPrices(?string $category, float $percent, int $roundTo): int
    {
        $roundTo = max(5, $roundTo);
        $variants = ProductVariant::query()->where('price', '>', 0)
            ->when($category, fn ($q) => $q->whereHas('product', fn ($p) => $p->where('category', $category)))->get();
        foreach ($variants as $v) {
            $v->update(['price' => (int) (round($v->price * (1 + $percent / 100) / $roundTo) * $roundTo)]);
        }

        return $variants->count();
    }
}
