<?php

use App\Models\Product;
use App\Support\ShopContent;
use Illuminate\Database\Migrations\Migration;

return new class extends Migration
{
    // Säuleneibe, Eibe, Portugiesischer Lorbeer und Kleingehölze aus dem bisherigen Shop ergänzen.
    // Bei einer neuen, leeren Installation übernimmt das der DatabaseSeeder.
    public function up(): void
    {
        if (Product::query()->exists()) {
            ShopContent::install();
        }
    }

    public function down(): void {}
};
