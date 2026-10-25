<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->string('source', 20)->default('online')->after('access_token');
            // Wunschtermin der Kundschaft und festgelegter Liefer-/Abholtermin
            $table->date('preferred_date')->nullable()->after('note');
            $table->string('preferred_slot', 20)->nullable()->after('preferred_date');
            $table->date('scheduled_date')->nullable()->index()->after('preferred_slot');
            $table->string('scheduled_slot', 40)->nullable()->after('scheduled_date');
            $table->unsignedInteger('discount_total')->default(0)->after('subtotal');
            // Zahlungserinnerungen
            $table->unsignedTinyInteger('reminder_count')->default(0);
            $table->timestamp('last_reminded_at')->nullable();
            // Rückerstattung / Gutschrift
            $table->string('stripe_payment_intent')->nullable();
            $table->unsignedInteger('refund_amount')->default(0);
            $table->timestamp('refunded_at')->nullable();
            $table->string('cancelled_by', 20)->nullable();
        });
        // Telefonbestellungen ohne E-Mail-Adresse erlauben
        Schema::table('orders', fn (Blueprint $table) => $table->string('email')->nullable()->change());

        Schema::table('order_items', function (Blueprint $table) {
            $table->unsignedInteger('list_price')->nullable()->after('unit_price');
            $table->unsignedTinyInteger('discount_percent')->default(0)->after('list_price');
        });

        Schema::table('products', function (Blueprint $table) {
            $table->json('gallery')->nullable()->after('image');
            $table->json('volume_discounts')->nullable()->after('plants_per_meter');
        });

        Schema::table('product_variants', function (Blueprint $table) {
            $table->timestamp('low_stock_notified_at')->nullable();
        });

        Schema::table('guide_articles', function (Blueprint $table) {
            $table->string('excerpt', 300)->nullable()->after('slug');
        });

        Schema::table('newsletter_campaigns', function (Blueprint $table) {
            $table->timestamp('scheduled_at')->nullable()->after('cta_url');
        });

        Schema::create('newsletter_sends', function (Blueprint $table) {
            $table->id();
            $table->foreignId('newsletter_campaign_id')->constrained()->cascadeOnDelete();
            $table->foreignId('newsletter_subscriber_id')->nullable()->constrained()->nullOnDelete();
            $table->string('email');
            $table->string('message_id')->nullable()->index();
            $table->timestamp('sent_at')->nullable();
            $table->timestamp('opened_at')->nullable();
            $table->timestamp('clicked_at')->nullable();
            $table->timestamp('bounced_at')->nullable();
            $table->timestamp('unsubscribed_at')->nullable();
            $table->timestamps();
            $table->unique(['newsletter_campaign_id', 'email']);
        });

        Schema::create('activity_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete();
            $table->string('subject_type');
            $table->unsignedBigInteger('subject_id')->nullable();
            $table->string('subject_label')->nullable();
            $table->string('event', 30);
            $table->json('changes')->nullable();
            $table->timestamp('created_at')->useCurrent()->index();
            $table->index(['subject_type', 'subject_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('activity_logs');
        Schema::dropIfExists('newsletter_sends');
        Schema::table('newsletter_campaigns', fn (Blueprint $t) => $t->dropColumn('scheduled_at'));
        Schema::table('guide_articles', fn (Blueprint $t) => $t->dropColumn('excerpt'));
        Schema::table('product_variants', fn (Blueprint $t) => $t->dropColumn('low_stock_notified_at'));
        Schema::table('products', fn (Blueprint $t) => $t->dropColumn(['gallery', 'volume_discounts']));
        Schema::table('order_items', fn (Blueprint $t) => $t->dropColumn(['list_price', 'discount_percent']));
        Schema::table('orders', fn (Blueprint $t) => $t->dropColumn([
            'source', 'preferred_date', 'preferred_slot', 'scheduled_date', 'scheduled_slot', 'discount_total',
            'reminder_count', 'last_reminded_at', 'stripe_payment_intent', 'refund_amount', 'refunded_at', 'cancelled_by',
        ]));
    }
};
