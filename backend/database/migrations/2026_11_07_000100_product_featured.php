<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    // «Unsere Empfehlungen» auf der Startseite: im Admin pro Produkt wählbar
    public function up(): void
    {
        Schema::table('products', fn (Blueprint $t) => $t->boolean('featured')->default(false)->after('active'));
        // Bisher gezeigte Empfehlungen beibehalten
        DB::table('products')->whereIn('slug', ['thuja-smaragd', 'photinia-fraseri-red-robin', 'diverse-beerenstraeucher'])->update(['featured' => true]);
    }

    public function down(): void
    {
        Schema::table('products', fn (Blueprint $t) => $t->dropColumn('featured'));
    }
};
