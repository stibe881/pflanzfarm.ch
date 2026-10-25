<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('shipping_classes', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('description')->nullable();
            // Versandkosten in Rappen; im Warenkorb zählt die teuerste Klasse
            $table->unsignedInteger('price');
            $table->boolean('is_default')->default(false);
            $table->unsignedInteger('sort')->default(0);
            $table->timestamps();
        });

        Schema::table('product_variants', function (Blueprint $table) {
            $table->foreignId('shipping_class_id')->nullable()->after('stock')->constrained()->nullOnDelete();
            $table->boolean('pickup_only')->default(false)->after('shipping_class_id');
        });

        // Bisherige Lieferpauschale als Standardklasse übernehmen
        $fee = DB::table('settings')->where('key', 'delivery_fee')->value('value');
        DB::table('shipping_classes')->insert([
            'name' => 'Standardlieferung',
            'description' => 'Lieferung mit unserem Fahrzeug',
            'price' => $fee !== null ? (int) json_decode($fee) : 4900,
            'is_default' => true,
            'created_at' => now(),
            'updated_at' => now(),
        ]);
        DB::table('settings')->where('key', 'delivery_fee')->delete();
    }

    public function down(): void
    {
        Schema::table('product_variants', function (Blueprint $table) {
            $table->dropConstrainedForeignId('shipping_class_id');
            $table->dropColumn('pickup_only');
        });
        Schema::dropIfExists('shipping_classes');
    }
};
