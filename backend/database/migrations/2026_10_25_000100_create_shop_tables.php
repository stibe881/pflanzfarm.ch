<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique();
            $table->string('latin')->nullable();
            $table->string('category')->index();
            $table->text('description')->nullable();
            $table->json('traits')->nullable();
            $table->string('badge')->nullable();
            $table->string('image')->nullable();
            $table->string('height_label')->nullable();
            // Pflanzen pro Laufmeter für den Hecken-Rechner (leer = nicht im Rechner)
            $table->decimal('plants_per_meter', 4, 1)->nullable();
            $table->boolean('price_on_request')->default(false);
            $table->boolean('active')->default(true)->index();
            $table->unsignedInteger('sort')->default(0);
            $table->timestamps();
        });

        Schema::create('product_variants', function (Blueprint $table) {
            $table->id();
            $table->foreignId('product_id')->constrained()->cascadeOnDelete();
            $table->string('label');
            $table->string('sku')->nullable();
            // Preis in Rappen inkl. MWST
            $table->unsignedInteger('price');
            $table->integer('stock')->default(0);
            $table->boolean('active')->default(true);
            $table->unsignedInteger('sort')->default(0);
            $table->timestamps();
        });

        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->string('number')->unique();
            $table->string('access_token', 64);
            $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete();
            $table->string('status', 20)->default('neu')->index();
            $table->string('payment_method', 20);
            $table->string('payment_status', 20)->default('offen')->index();
            $table->string('delivery_method', 20);
            $table->string('name');
            $table->string('email');
            $table->string('phone', 40)->nullable();
            $table->string('street')->nullable();
            $table->string('postal_code', 12)->nullable();
            $table->string('city')->nullable();
            $table->text('note')->nullable();
            $table->unsignedInteger('subtotal');
            $table->unsignedInteger('shipping');
            $table->unsignedInteger('total');
            $table->string('stripe_session_id')->nullable()->index();
            $table->timestamp('paid_at')->nullable();
            $table->timestamp('confirmed_at')->nullable();
            $table->timestamp('delivered_at')->nullable();
            $table->timestamp('cancelled_at')->nullable();
            $table->boolean('stock_released')->default(false);
            $table->timestamps();
        });

        Schema::create('order_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('order_id')->constrained()->cascadeOnDelete();
            $table->foreignId('product_variant_id')->nullable()->constrained()->nullOnDelete();
            $table->string('product_name');
            $table->string('variant_label');
            $table->unsignedInteger('unit_price');
            $table->unsignedInteger('quantity');
            $table->unsignedInteger('line_total');
            $table->timestamps();
        });

        Schema::create('popups', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->text('text');
            $table->string('cta_label')->default('Mehr erfahren');
            $table->string('cta_target', 20)->default('shop');
            $table->string('image')->nullable();
            $table->date('starts_at')->nullable();
            $table->date('ends_at')->nullable();
            $table->string('pages', 20)->default('startseite');
            $table->unsignedTinyInteger('delay')->default(1);
            $table->boolean('active')->default(true);
            $table->timestamps();
        });

        Schema::create('references', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('category');
            $table->text('description');
            $table->string('image')->nullable();
            $table->string('location')->nullable();
            $table->unsignedSmallInteger('year')->nullable();
            $table->json('tags')->nullable();
            $table->boolean('on_homepage')->default(true);
            $table->boolean('active')->default(true);
            $table->unsignedInteger('sort')->default(0);
            $table->timestamps();
        });

        Schema::create('guide_articles', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('slug')->unique();
            $table->text('body');
            $table->foreignId('product_id')->nullable()->constrained()->nullOnDelete();
            $table->boolean('published')->default(true);
            $table->unsignedInteger('sort')->default(0);
            $table->timestamps();
        });

        Schema::create('settings', function (Blueprint $table) {
            $table->string('key')->primary();
            $table->json('value')->nullable();
            $table->timestamps();
        });

        Schema::create('newsletter_subscribers', function (Blueprint $table) {
            $table->id();
            $table->string('email')->unique();
            $table->string('status', 20)->default('ausstehend')->index();
            $table->string('token', 64)->unique();
            $table->string('source', 40)->nullable();
            $table->timestamp('confirmed_at')->nullable();
            $table->timestamp('unsubscribed_at')->nullable();
            $table->timestamps();
        });

        Schema::create('newsletter_campaigns', function (Blueprint $table) {
            $table->id();
            $table->string('subject');
            $table->string('preheader')->nullable();
            $table->longText('body');
            $table->string('cta_label')->nullable();
            $table->string('cta_url')->nullable();
            $table->timestamp('sent_at')->nullable();
            $table->unsignedInteger('recipients')->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        foreach (['newsletter_campaigns', 'newsletter_subscribers', 'settings', 'guide_articles', 'references', 'popups', 'order_items', 'orders', 'product_variants', 'products'] as $t) {
            Schema::dropIfExists($t);
        }
    }
};
