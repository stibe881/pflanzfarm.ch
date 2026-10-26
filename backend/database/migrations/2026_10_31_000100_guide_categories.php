<?php

use App\Support\GuideContent;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('guide_categories', function (Blueprint $table) {
            $table->id();
            $table->string('name')->unique();
            $table->string('slug')->unique();
            $table->unsignedInteger('sort')->default(0);
            $table->timestamps();
        });
        Schema::table('guide_articles', function (Blueprint $table) {
            $table->foreignId('guide_category_id')->nullable()->after('id')->constrained('guide_categories')->nullOnDelete();
            $table->string('image')->nullable()->after('excerpt');
        });

        // Kategorien anlegen, bestehende Artikel zuordnen und die neuen Tipps ergänzen
        GuideContent::install();
    }

    public function down(): void
    {
        Schema::table('guide_articles', function (Blueprint $table) {
            $table->dropConstrainedForeignId('guide_category_id');
            $table->dropColumn('image');
        });
        Schema::dropIfExists('guide_categories');
    }
};
