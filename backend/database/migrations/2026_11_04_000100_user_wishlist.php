<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    // Merkliste im Kundenkonto (Produkt-Adressen)
    public function up(): void
    {
        Schema::table('users', fn (Blueprint $t) => $t->json('wishlist')->nullable());
    }

    public function down(): void
    {
        Schema::table('users', fn (Blueprint $t) => $t->dropColumn('wishlist'));
    }
};
