<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

// Hecken-Rechner entfernt: «Pflanzen pro Laufmeter» wird nicht mehr gebraucht
return new class extends Migration
{
    public function up(): void
    {
        if (Schema::hasColumn('products', 'plants_per_meter')) {
            Schema::table('products', fn (Blueprint $table) => $table->dropColumn('plants_per_meter'));
        }
    }

    public function down(): void
    {
        Schema::table('products', fn (Blueprint $table) => $table->decimal('plants_per_meter', 4, 1)->nullable()->after('height_label'));
    }
};
