<?php

namespace App\Console\Commands;

use App\Models\Popup;
use App\Models\Product;
use App\Models\Reference;
use App\Services\ImageOptimizer;
use Illuminate\Console\Command;

class OptimizeImages extends Command
{
    protected $signature = 'pflanzfarm:bilder-optimieren';

    protected $description = 'Erzeugt WebP-Fassungen für alle bereits hochgeladenen Bilder';

    public function handle(ImageOptimizer $optimizer): int
    {
        $paths = Product::query()->get(['image', 'gallery'])->flatMap(fn ($p) => [$p->image, ...(array) $p->gallery])
            ->merge(Reference::query()->pluck('image'))->merge(Reference::query()->pluck('before_image'))->merge(Popup::query()->pluck('image'))
            ->filter()->unique();
        $done = $paths->filter(fn ($p) => $optimizer->optimize($p))->count();
        $this->info("{$done} Bild(er) optimiert, ".($paths->count() - $done).' übersprungen (schon erledigt oder mitgeliefert).');

        return self::SUCCESS;
    }
}
