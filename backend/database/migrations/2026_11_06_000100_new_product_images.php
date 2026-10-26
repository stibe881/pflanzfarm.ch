<?php

use App\Models\Product;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Storage;

return new class extends Migration
{
    // Neue Produktbilder für Kleingehölze, Portugiesischer Lorbeer und Eibe
    public function up(): void
    {
        foreach (['immergruene-kleingehoelze' => 'immergruene-kleingehoelze-v2.jpg', 'prunus-lusitanica' => 'prunus-lusitanica-v2.jpg', 'taxus-baccata-eibe' => 'taxus-baccata-v2.jpg'] as $slug => $file) {
            $product = Product::query()->where('slug', $slug)->first();
            $source = public_path('assets/'.$file);
            if (! $product || ! is_file($source)) {
                continue;
            }
            Storage::disk('public')->put('bilder/'.$file, file_get_contents($source));
            $product->forceFill(['image' => 'bilder/'.$file])->saveQuietly();
        }
        Cache::forget('catalog');
    }

    public function down(): void {}
};
