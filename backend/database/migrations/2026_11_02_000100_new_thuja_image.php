<?php

use App\Models\Product;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Storage;

return new class extends Migration
{
    // Neues Produktbild für Thuja Smaragd (ersetzt das bisherige Bild)
    public function up(): void
    {
        $product = Product::query()->where('slug', 'thuja-smaragd')->first();
        $source = public_path('assets/thuja-smaragd-v2.jpg');
        if (! $product || ! is_file($source)) {
            return;
        }
        Storage::disk('public')->put('bilder/thuja-smaragd-v2.jpg', file_get_contents($source));
        $product->forceFill(['image' => 'bilder/thuja-smaragd-v2.jpg'])->saveQuietly();
        Cache::forget('catalog');
    }

    public function down(): void {}
};
