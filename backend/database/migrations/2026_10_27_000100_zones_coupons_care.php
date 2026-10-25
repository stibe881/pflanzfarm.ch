<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Lieferzonen nach PLZ: Zuschlag zur Versandklasse oder keine Lieferung
        Schema::create('delivery_zones', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->json('postal_ranges'); // [{from: 6000, to: 6299}, ...]
            $table->unsignedInteger('surcharge')->default(0);
            $table->boolean('deliverable')->default(true);
            $table->unsignedInteger('sort')->default(0);
            $table->timestamps();
        });

        // Gutscheine (Wertgutschein mit Restguthaben) und Rabattcodes (Prozent oder Betrag)
        Schema::create('coupons', function (Blueprint $table) {
            $table->id();
            $table->string('code')->unique();
            $table->string('type', 20); // gutschein | prozent | betrag
            $table->unsignedInteger('value'); // Rappen bzw. Prozent
            $table->unsignedInteger('balance')->nullable(); // Restguthaben bei Gutscheinen
            $table->unsignedInteger('min_order')->default(0);
            $table->date('valid_from')->nullable();
            $table->date('valid_until')->nullable();
            $table->unsignedInteger('max_uses')->nullable();
            $table->unsignedInteger('used_count')->default(0);
            $table->string('recipient')->nullable();
            $table->string('note')->nullable();
            $table->boolean('active')->default(true);
            $table->timestamps();
        });

        Schema::table('orders', function (Blueprint $table) {
            $table->foreignId('coupon_id')->nullable()->constrained()->nullOnDelete();
            $table->string('coupon_code')->nullable();
            $table->unsignedInteger('coupon_discount')->default(0);
            $table->boolean('planting')->default(false);
            $table->unsignedInteger('planting_fee')->default(0);
            $table->string('delivery_zone')->nullable();
            $table->unsignedInteger('zone_surcharge')->default(0);
            $table->timestamp('care_mail_sent_at')->nullable();
            $table->timestamp('review_requested_at')->nullable();
            $table->string('paid_reference')->nullable();
        });

        Schema::table('product_variants', function (Blueprint $table) {
            $table->unsignedInteger('planting_price')->nullable()->after('price');
            $table->timestamp('counted_at')->nullable();
        });

        Schema::table('guide_articles', function (Blueprint $table) {
            // Monate (1–12), in denen Käuferinnen des passenden Produkts eine Erinnerung erhalten
            $table->json('remind_months')->nullable();
        });

        // «Benachrichtigen, wenn wieder da»
        Schema::create('stock_alerts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('product_variant_id')->constrained()->cascadeOnDelete();
            $table->string('email');
            $table->string('token', 48)->unique();
            $table->timestamp('notified_at')->nullable();
            $table->timestamps();
            $table->unique(['product_variant_id', 'email']);
        });

        // Pflege-Mails: wer welche Erinnerung in welchem Jahr bekommen hat, und wer keine mehr möchte
        Schema::create('care_reminders', function (Blueprint $table) {
            $table->id();
            $table->string('email');
            $table->foreignId('guide_article_id')->constrained()->cascadeOnDelete();
            $table->unsignedSmallInteger('year');
            $table->timestamps();
            $table->unique(['email', 'guide_article_id', 'year']);
        });
        Schema::create('mail_opt_outs', function (Blueprint $table) {
            $table->id();
            $table->string('email')->unique();
            $table->timestamps();
        });

        // Zahlungsimporte (camt.054) zur Nachverfolgung
        Schema::create('payment_imports', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete();
            $table->string('filename');
            $table->unsignedInteger('entries')->default(0);
            $table->unsignedInteger('matched')->default(0);
            $table->json('result')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('payment_imports');
        Schema::dropIfExists('mail_opt_outs');
        Schema::dropIfExists('care_reminders');
        Schema::dropIfExists('stock_alerts');
        Schema::table('guide_articles', fn (Blueprint $t) => $t->dropColumn('remind_months'));
        Schema::table('product_variants', fn (Blueprint $t) => $t->dropColumn(['planting_price', 'counted_at']));
        Schema::table('orders', function (Blueprint $t) {
            $t->dropConstrainedForeignId('coupon_id');
            $t->dropColumn(['coupon_code', 'coupon_discount', 'planting', 'planting_fee', 'delivery_zone', 'zone_surcharge', 'care_mail_sent_at', 'review_requested_at', 'paid_reference']);
        });
        Schema::dropIfExists('coupons');
        Schema::dropIfExists('delivery_zones');
    }
};
