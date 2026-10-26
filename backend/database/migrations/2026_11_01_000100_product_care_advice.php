<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    // Pflanzberatung je Produkt (Galerie-Kachel «Gut begleitet»)
    public function up(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->text('care_location')->nullable();
            $table->text('care_planting')->nullable();
            $table->text('care_first')->nullable();
            $table->text('care_ongoing')->nullable();
        });
    }

    public function down(): void
    {
        Schema::table('products', fn (Blueprint $t) => $t->dropColumn(['care_location', 'care_planting', 'care_first', 'care_ongoing']));
    }
};
