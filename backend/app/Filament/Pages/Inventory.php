<?php

namespace App\Filament\Pages;

use App\Models\ProductVariant;
use Filament\Notifications\Notification;
use Filament\Pages\Page;
use Illuminate\Support\Collection;

/** Lager zählen im Gelände: fürs Handy gedacht, eine Zeile pro Grösse. */
class Inventory extends Page
{
    protected static ?string $navigationIcon = 'heroicon-o-clipboard-document-check';

    protected static ?string $navigationGroup = 'Shop';

    protected static ?string $navigationLabel = 'Inventur';

    protected static ?string $title = 'Inventur';

    protected static ?int $navigationSort = 6;

    protected static string $view = 'filament.pages.inventory';

    public string $search = '';

    public bool $onlyOpen = false;

    /** @var array<int, string|int|null> gezählte Mengen je Grösse */
    public array $counts = [];

    public static function canAccess(): bool
    {
        return (bool) auth()->user()?->isTeam();
    }

    public function getVariantsProperty(): Collection
    {
        $q = mb_strtolower(trim($this->search));

        return ProductVariant::query()->with('product')->withCount(['stockAlerts as waiting' => fn ($w) => $w->whereNull('notified_at')])
            ->whereHas('product')->get()
            ->filter(fn (ProductVariant $v) => $q === '' || str_contains(mb_strtolower($v->product->name.' '.$v->label.' '.$v->sku), $q))
            ->filter(fn (ProductVariant $v) => ! $this->onlyOpen || ! $v->counted_at || $v->counted_at->lt(now()->subDays(30)))
            ->sortBy(fn ($v) => [$v->product->sort, $v->product->name, $v->sort])
            ->groupBy(fn ($v) => $v->product->name);
    }

    public function save(int $id): void
    {
        $value = $this->counts[$id] ?? null;
        if ($value === null || $value === '' || ! is_numeric($value) || (int) $value < 0) {
            Notification::make()->title('Bitte eine Zahl ab 0 eingeben')->warning()->send();

            return;
        }
        $variant = ProductVariant::query()->with('product')->findOrFail($id);
        $old = $variant->stock;
        $variant->update(['stock' => (int) $value, 'counted_at' => now()]);
        unset($this->counts[$id]);

        $diff = (int) $value - $old;
        Notification::make()
            ->title($variant->product->name.' '.$variant->label.': '.(int) $value.' Stück')
            ->body($diff === 0 ? 'Bestand stimmt.' : 'Abweichung '.($diff > 0 ? '+' : '').$diff.' gegenüber dem System.')
            ->success()->send();
    }

    public function confirm(int $id): void
    {
        $this->counts[$id] = ProductVariant::query()->findOrFail($id)->stock;
        $this->save($id);
    }

    public function saveAll(): void
    {
        $ids = array_keys(array_filter($this->counts, fn ($v) => $v !== null && $v !== ''));
        foreach ($ids as $id) {
            $this->save((int) $id);
        }
        if (! $ids) {
            Notification::make()->title('Keine neuen Zahlen eingetragen')->send();
        }
    }
}
