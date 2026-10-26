<?php

namespace Tests\Feature;

use App\Mail\NewOrderNotification;
use App\Mail\NewsletterCampaignMail;
use App\Mail\NewsletterConfirmation;
use App\Mail\OrderConfirmation;
use App\Models\NewsletterCampaign;
use App\Models\NewsletterSubscriber;
use App\Models\Order;
use App\Models\ProductVariant;
use App\Models\Setting;
use App\Models\User;
use App\Services\InvoicePdf;
use App\Services\StripeCheckout;
use Database\Seeders\DatabaseSeeder;
use Illuminate\Auth\Notifications\VerifyEmail;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Notification;
use Illuminate\Support\Facades\URL;
use Mockery;
use Tests\TestCase;

class ShopTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(DatabaseSeeder::class);
        Mail::fake();
        // Wie im Browser: Anfragen von der eigenen Website sind zustandsbehaftet (Session-Login)
        $this->withHeader('Referer', 'http://localhost/');
    }

    private function orderPayload(array $override = []): array
    {
        $variant = ProductVariant::query()->where('label', '80–100 cm')->first();

        return array_merge([
            'items' => [['variant_id' => $variant->id, 'quantity' => 30]],
            'name' => 'Erika Muster', 'email' => 'erika@example.ch', 'phone' => '079 111 22 33',
            'delivery_method' => 'lieferung', 'street' => 'Gartenweg 1', 'postal_code' => '6210', 'city' => 'Sursee',
            'payment_method' => 'invoice', 'accept_terms' => true,
        ], $override);
    }

    public function test_catalog_lists_only_active_variants_with_prices(): void
    {
        $res = $this->getJson('/api/catalog')->assertOk();
        $thuja = collect($res->json('products'))->firstWhere('slug', 'thuja-smaragd');
        $this->assertSame(['80–100 cm'], $thuja['variants']);
        $this->assertEquals(15, $thuja['variantData'][0]['price']);
        $this->assertSame(48, $thuja['stock']);
        $this->assertTrue(collect($res->json('products'))->firstWhere('slug', 'diverse-beerenstraeucher')['priceOnRequest']);
    }

    public function test_invoice_order_reserves_stock_and_sends_mails(): void
    {
        $res = $this->postJson('/api/orders', $this->orderPayload())->assertCreated();
        $order = Order::query()->where('number', $res->json('order.number'))->firstOrFail();

        $this->assertSame(45000, $order->subtotal);
        $this->assertSame(4900, $order->shipping, 'Lieferpauschale unter CHF 500');
        $this->assertSame(18, ProductVariant::query()->where('label', '80–100 cm')->value('stock'));
        Mail::assertSent(OrderConfirmation::class, fn ($m) => $m->hasTo('erika@example.ch'));
        Mail::assertSent(NewOrderNotification::class);

        // Danke-Seite mit Token, ohne Token nicht abrufbar
        $this->getJson('/api/orders/'.$order->number.'?t='.$res->json('token'))->assertOk()->assertJsonPath('order.total', 499);
        $this->getJson('/api/orders/'.$order->number)->assertNotFound();
    }

    public function test_order_fails_when_stock_is_insufficient(): void
    {
        $this->postJson('/api/orders', $this->orderPayload(['items' => [['variant_id' => ProductVariant::query()->where('label', '80–100 cm')->value('id'), 'quantity' => 49]]]))
            ->assertUnprocessable()->assertJsonValidationErrors('items');
        $this->assertSame(0, Order::count());
    }

    public function test_cash_only_for_pickup_and_terms_required(): void
    {
        $this->postJson('/api/orders', $this->orderPayload(['payment_method' => 'cash']))->assertJsonValidationErrors('payment_method');
        $this->postJson('/api/orders', $this->orderPayload(['accept_terms' => false]))->assertJsonValidationErrors('accept_terms');
        $this->postJson('/api/orders', $this->orderPayload(['delivery_method' => 'abholung', 'street' => null, 'payment_method' => 'cash']))->assertCreated();
    }

    public function test_price_on_request_products_cannot_be_ordered(): void
    {
        $berries = ProductVariant::query()->whereHas('product', fn ($q) => $q->where('slug', 'diverse-beerenstraeucher'))->first();
        $this->postJson('/api/orders', $this->orderPayload(['items' => [['variant_id' => $berries->id, 'quantity' => 1]]]))->assertJsonValidationErrors('items');
    }

    public function test_shipping_uses_most_expensive_class_and_pickup_only(): void
    {
        $paket = \App\Models\ShippingClass::query()->create(['name' => 'Paket', 'price' => 1200]);
        $gross = \App\Models\ShippingClass::query()->create(['name' => 'Grosslieferung', 'price' => 12000]);
        $photinia = ProductVariant::query()->whereHas('product', fn ($q) => $q->where('slug', 'photinia-fraseri-red-robin'))->first();
        $photinia->update(['shipping_class_id' => $paket->id]);
        $thuja = ProductVariant::query()->where('label', '80–100 cm')->first();

        // nur Paket-Artikel: CHF 12
        $r = $this->postJson('/api/orders', $this->orderPayload(['items' => [['variant_id' => $photinia->id, 'quantity' => 1]]]))->assertCreated();
        $this->assertSame(1200, Order::query()->where('number', $r->json('order.number'))->value('shipping'));

        // Paket + Grosslieferung: es zählt die teuerste Klasse
        $thuja->update(['shipping_class_id' => $gross->id]);
        $r = $this->postJson('/api/orders', $this->orderPayload(['items' => [['variant_id' => $photinia->id, 'quantity' => 1], ['variant_id' => $thuja->id, 'quantity' => 2]]]))->assertCreated();
        $this->assertSame(12000, Order::query()->where('number', $r->json('order.number'))->value('shipping'));

        // Nur-Abholung-Artikel kann nicht geliefert werden
        $thuja->update(['pickup_only' => true]);
        $this->postJson('/api/orders', $this->orderPayload(['items' => [['variant_id' => $thuja->id, 'quantity' => 1]]]))->assertJsonValidationErrors('delivery_method');
        $this->postJson('/api/orders', $this->orderPayload(['items' => [['variant_id' => $thuja->id, 'quantity' => 1]], 'delivery_method' => 'abholung', 'street' => null]))->assertCreated();

        $catalog = collect($this->getJson('/api/catalog')->json('products'))->firstWhere('slug', 'thuja-smaragd');
        $this->assertTrue($catalog['variantData'][0]['pickupOnly']);
        $this->assertSame('Grosslieferung', $catalog['variantData'][0]['shipping']['name']);
    }

    public function test_variant_without_price_is_not_orderable(): void
    {
        $variant = ProductVariant::query()->where('label', '100–120 cm')->first();
        $variant->update(['active' => true, 'stock' => 10]);
        $this->assertNotContains('100–120 cm', collect($this->getJson('/api/catalog')->json('products'))->firstWhere('slug', 'thuja-smaragd')['variants']);
        $this->postJson('/api/orders', $this->orderPayload(['items' => [['variant_id' => $variant->id, 'quantity' => 1]]]))->assertJsonValidationErrors('items');
    }

    public function test_stripe_checkout_and_webhook(): void
    {
        $stripe = Mockery::mock(StripeCheckout::class);
        $stripe->shouldReceive('createSession')->once()->andReturnUsing(function (Order $o) {
            $o->update(['stripe_session_id' => 'cs_test_123']);

            return 'https://checkout.stripe.com/c/pay/cs_test_123';
        });
        $this->app->instance(StripeCheckout::class, $stripe);

        $res = $this->postJson('/api/orders', $this->orderPayload(['payment_method' => 'stripe']))->assertCreated();
        $this->assertStringStartsWith('https://checkout.stripe.com', $res->json('redirect'));
        Mail::assertNothingSent();

        config(['services.stripe.webhook_secret' => 'whsec_test']);
        $payload = json_encode(['id' => 'evt_1', 'object' => 'event', 'type' => 'checkout.session.completed', 'data' => ['object' => ['id' => 'cs_test_123', 'object' => 'checkout.session', 'payment_status' => 'paid']]]);
        $t = time();
        $sig = 't='.$t.',v1='.hash_hmac('sha256', $t.'.'.$payload, 'whsec_test');

        $this->call('POST', '/stripe/webhook', [], [], [], ['HTTP_STRIPE_SIGNATURE' => 'falsch', 'CONTENT_TYPE' => 'application/json'], $payload)->assertStatus(400);
        $this->call('POST', '/stripe/webhook', [], [], [], ['HTTP_STRIPE_SIGNATURE' => $sig, 'CONTENT_TYPE' => 'application/json'], $payload)->assertOk();

        $order = Order::query()->first();
        $this->assertSame('bezahlt', $order->payment_status);
        Mail::assertSent(OrderConfirmation::class);
    }

    public function test_expired_stripe_session_releases_stock(): void
    {
        $order = app(\App\Services\OrderService::class)->create($this->orderPayload(['payment_method' => 'stripe']), [['variant_id' => ProductVariant::query()->where('label', '80–100 cm')->value('id'), 'quantity' => 10]], null);
        $order->update(['stripe_session_id' => 'cs_exp']);
        $this->assertSame(38, ProductVariant::query()->where('label', '80–100 cm')->value('stock'));

        config(['services.stripe.webhook_secret' => 'whsec_test']);
        $payload = json_encode(['id' => 'evt_2', 'object' => 'event', 'type' => 'checkout.session.expired', 'data' => ['object' => ['id' => 'cs_exp', 'object' => 'checkout.session']]]);
        $t = time();
        $this->call('POST', '/stripe/webhook', [], [], [], ['HTTP_STRIPE_SIGNATURE' => 't='.$t.',v1='.hash_hmac('sha256', $t.'.'.$payload, 'whsec_test'), 'CONTENT_TYPE' => 'application/json'], $payload)->assertOk();

        $this->assertSame('storniert', $order->fresh()->status);
        $this->assertSame(48, ProductVariant::query()->where('label', '80–100 cm')->value('stock'));
    }

    public function test_invoice_pdf_with_qr_bill(): void
    {
        Setting::put('iban', 'CH44 3199 9123 0008 8901 2');
        $res = $this->postJson('/api/orders', $this->orderPayload())->assertCreated();
        $order = Order::query()->first();
        $pdf = app(InvoicePdf::class)->render($order);
        $this->assertStringStartsWith('%PDF', $pdf);
        $this->get('/api/orders/'.$order->number.'/rechnung?t='.$res->json('token'))->assertOk()->assertHeader('Content-Type', 'application/pdf');
    }

    public function test_registration_verification_and_account_flow(): void
    {
        Notification::fake();
        $this->postJson('/api/register', ['name' => 'Kurt', 'email' => 'Kurt@Example.ch', 'password' => 'sicheres-passwort-1', 'password_confirmation' => 'sicheres-passwort-1'])
            ->assertCreated()->assertJsonPath('user.verified', false);
        $user = User::query()->where('email', 'kurt@example.ch')->firstOrFail();
        Notification::assertSentTo($user, VerifyEmail::class);

        $url = URL::temporarySignedRoute('verification.verify', now()->addHour(), ['id' => $user->id, 'hash' => sha1($user->email)]);
        $this->get($url)->assertRedirect('/konto/?verifiziert=1');
        $this->assertTrue($user->fresh()->hasVerifiedEmail());

        $this->postJson('/api/orders', $this->orderPayload(['email' => 'kurt@example.ch']))->assertCreated();
        $this->getJson('/api/me/orders')->assertOk()->assertJsonCount(1, 'orders');
        $this->getJson('/api/me/export')->assertOk()->assertJsonPath('konto.email', 'kurt@example.ch');

        $this->deleteJson('/api/me', ['password' => 'falsch'])->assertJsonValidationErrors('password');
        $this->deleteJson('/api/me', ['password' => 'sicheres-passwort-1'])->assertOk();
        $this->assertNull(User::query()->where('email', 'kurt@example.ch')->first());
        $this->assertNull(Order::query()->first()->user_id, 'Bestellung bleibt, ohne Konto');
    }

    public function test_login_logout(): void
    {
        User::factory()->create(['email' => 'anna@example.ch', 'password' => 'geheimes-passwort']);
        $this->postJson('/api/login', ['email' => 'anna@example.ch', 'password' => 'falsch'])->assertJsonValidationErrors('email');
        $this->postJson('/api/login', ['email' => 'ANNA@example.ch', 'password' => 'geheimes-passwort'])->assertOk()->assertJsonPath('user.email', 'anna@example.ch');
        $this->getJson('/api/me')->assertJsonPath('user.email', 'anna@example.ch');
        $this->postJson('/api/logout')->assertOk();
    }

    public function test_team_login_on_website_redirects_to_admin(): void
    {
        User::factory()->create(['email' => 'kunde@example.ch', 'password' => 'geheimes-passwort']);
        $this->postJson('/api/login', ['email' => 'kunde@example.ch', 'password' => 'geheimes-passwort'])->assertOk()->assertJsonMissingPath('redirect');
        $this->postJson('/api/logout');

        $admin = User::factory()->create(['email' => 'chef@example.ch', 'password' => 'geheimes-passwort', 'role' => 'admin']);
        $admin->forceFill(['email_verified_at' => now()])->save();
        $this->postJson('/api/login', ['email' => 'chef@example.ch', 'password' => 'geheimes-passwort'])->assertOk()->assertJsonPath('redirect', '/admin');
        $this->get('/admin')->assertOk();
    }

    public function test_login_works_through_demo_tunnel_domain(): void
    {
        config(['sanctum.stateful' => ['localhost:8080', '*.trycloudflare.com']]);
        User::factory()->create(['email' => 'demo@example.ch', 'password' => 'geheimes-passwort']);
        $this->withHeader('Referer', 'https://blau-garten-test.trycloudflare.com/konto/')
            ->postJson('/api/login', ['email' => 'demo@example.ch', 'password' => 'geheimes-passwort'])->assertOk();
    }

    public function test_newsletter_double_opt_in_and_unsubscribe(): void
    {
        $this->postJson('/api/newsletter', ['email' => 'leser@example.ch'])->assertOk()->assertJsonPath('status', 'ausstehend');
        $sub = NewsletterSubscriber::query()->firstOrFail();
        Mail::assertSent(NewsletterConfirmation::class);

        $this->get('/newsletter/bestaetigen/'.$sub->token)->assertRedirect('/?newsletter=bestaetigt');
        $this->assertSame('bestaetigt', $sub->fresh()->status);

        $mail = new NewsletterCampaignMail(NewsletterCampaign::query()->create(['subject' => 'Test', 'body' => 'Hallo']), $sub->fresh());
        $mail->assertSeeInHtml('/newsletter/abmelden/'.$sub->token);

        $this->post('/newsletter/abmelden/'.$sub->token)->assertOk();
        $this->assertSame('abgemeldet', $sub->fresh()->status);
    }

    public function test_contact_form_sends_mail_and_ignores_bots(): void
    {
        $this->postJson('/api/contact', ['name' => 'Bot', 'contact' => 'x', 'topic' => 'x', 'message' => 'x', 'website' => 'spam'])->assertOk();
        Mail::assertNothingSent();
        $this->postJson('/api/contact', ['name' => 'Rita', 'contact' => 'rita@example.ch', 'topic' => 'Offerte für eine Hecke', 'message' => '25 m Thuja'])->assertOk();
        Mail::assertSent(\App\Mail\ContactMessage::class, fn ($m) => $m->hasReplyTo('rita@example.ch'));
    }

    public function test_spa_fallback_serves_unknown_product_as_404(): void
    {
        $file = resource_path('spa.html');
        $original = is_file($file) ? file_get_contents($file) : null;
        file_put_contents($file, '<html><head><title>x</title><meta name="theme-color" content="#000"></head><body><div id="root"></div></body></html>');
        try {
            $this->get('/produkt/gibt-es-nicht/')->assertNotFound();
            $this->get('/konto/')->assertOk()->assertSee('noindex', false);
        } finally {
            $original === null ? unlink($file) : file_put_contents($file, $original);
        }
    }

    public function test_pages_use_current_domain_for_link_preview(): void
    {
        config(['app.url' => 'https://pflanzfarm.gross-ict.ch']);

        $html = $this->get('/')->assertOk()->getContent();
        $this->assertStringContainsString('<meta property="og:image" content="https://pflanzfarm.gross-ict.ch/assets/og-image.jpg"', $html);
        $this->assertStringContainsString('<meta property="og:url" content="https://pflanzfarm.gross-ict.ch/"', $html);
        $this->assertStringNotContainsString('https://pflanzfarm.ch/', $html);
        $this->assertStringContainsString('info@pflanzfarm.ch', $html);

        config(['app.url' => 'https://pflanzfarm.ch']);
        $this->assertStringContainsString('content="https://pflanzfarm.ch/assets/og-image.jpg"', $this->get('/kontakt')->assertOk()->getContent());
    }

    public function test_order_and_contact_survive_failing_mail_server(): void
    {
        // Mailserver nicht erreichbar (wie eine nicht bestätigte Resend-Domain): Bestellung muss trotzdem klappen
        \Illuminate\Support\Facades\Mail::shouldReceive('to')->andThrow(new \RuntimeException('The pflanzfarm.ch domain is not verified.'));

        $this->postJson('/api/orders', $this->orderPayload(['newsletter' => true]))->assertCreated();
        $this->assertSame(1, \App\Models\Order::query()->count());

        $this->postJson('/api/contact', ['name' => 'Anna', 'contact' => 'anna@example.ch', 'topic' => 'Beratung', 'message' => 'Hallo'])
            ->assertStatus(422)->assertJsonValidationErrors('message');
    }
}
