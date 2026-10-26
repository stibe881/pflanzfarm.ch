<?php

namespace Tests\Feature;

use App\Mail\OrderConfirmation;
use App\Models\Order;
use App\Models\ProductVariant;
use App\Services\Integrations;
use App\Services\StripeCheckout;
use App\Support\EnvFile;
use Database\Seeders\DatabaseSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Mail\Events\MessageSending;
use Illuminate\Support\Facades\Mail;
use Mockery;
use Symfony\Component\Mime\Email;
use Tests\TestCase;

class IntegrationsTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(DatabaseSeeder::class);
        $this->withHeader('Referer', 'http://localhost/');
    }

    public function test_stripe_key_rules_for_test_and_live_site(): void
    {
        config(['pflanzfarm.test_mode' => true]);
        $this->assertSame('test', StripeCheckout::keyMode('sk_test_abc'));
        $this->assertNull(StripeCheckout::keyProblem('sk_test_abc'));
        $this->assertStringContainsString('nur Stripe-Testschlüssel', StripeCheckout::keyProblem('sk_live_abc'));
        $this->assertNotNull(StripeCheckout::keyProblem('pk_test_abc'));

        config(['pflanzfarm.test_mode' => false]);
        $this->assertNull(StripeCheckout::keyProblem('sk_live_abc'));
        $this->assertSame('live', StripeCheckout::keyMode('rk_live_abc'));
    }

    public function test_live_key_on_test_site_is_refused_at_checkout(): void
    {
        config(['pflanzfarm.test_mode' => true, 'pflanzfarm.fake_payments' => false, 'services.stripe.secret' => 'sk_live_xyz']);
        $this->postJson('/api/orders', [
            'items' => [['variant_id' => ProductVariant::query()->where('label', '80–100 cm')->value('id'), 'quantity' => 1]],
            'name' => 'A', 'email' => 'a@example.ch', 'phone' => '079 000 00 00', 'delivery_method' => 'abholung',
            'payment_method' => 'stripe', 'accept_terms' => true,
        ])->assertUnprocessable()->assertJsonValidationErrors('payment_method');
        $this->assertSame('abgebrochen', Order::query()->value('payment_status'));
        $this->assertSame(48, ProductVariant::query()->where('label', '80–100 cm')->value('stock'), 'Bestand wieder frei');
    }

    public function test_sync_marks_paid_or_cancels_expired(): void
    {
        config(['pflanzfarm.fake_payments' => false]);
        Mail::fake();
        $make = fn ($n) => Order::factory()->create(['payment_method' => 'stripe', 'payment_status' => 'ausstehend', 'stripe_session_id' => 'cs_test_'.$n, 'created_at' => now()->subHour()]);
        $paid = $make(1);
        $expired = $make(2);
        $stripe = Mockery::mock(StripeCheckout::class)->makePartial();
        $stripe->shouldReceive('retrieveSession')->with('cs_test_1')->andReturn((object) ['payment_status' => 'paid', 'status' => 'complete', 'payment_intent' => 'pi_1']);
        $stripe->shouldReceive('retrieveSession')->with('cs_test_2')->andReturn((object) ['payment_status' => 'unpaid', 'status' => 'expired']);
        $this->app->instance(StripeCheckout::class, $stripe);

        $this->artisan('pflanzfarm:stripe-abgleich')->assertSuccessful();
        $this->assertSame('bezahlt', $paid->fresh()->payment_status);
        $this->assertSame('pi_1', $paid->fresh()->stripe_payment_intent);
        Mail::assertSent(OrderConfirmation::class);
        $this->assertSame('storniert', $expired->fresh()->status);
    }

    public function test_robots_txt_depends_on_mode(): void
    {
        config(['pflanzfarm.test_mode' => true]);
        $this->get('/robots.txt')->assertOk()->assertSee('Disallow: /');
        config(['pflanzfarm.test_mode' => false, 'app.url' => 'https://pflanzfarm.ch']);
        $this->get('/robots.txt')->assertSee('Sitemap: https://pflanzfarm.ch/sitemap.xml')->assertDontSee("Disallow: /\n", false);
    }

    public function test_mail_redirect_on_test_site(): void
    {
        $email = (new Email)->to('kunde@example.ch')->subject('Hallo')->text('x');
        config(['pflanzfarm.test_mode' => true, 'pflanzfarm.mail_redirect_to' => 'team@example.ch']);
        (new \App\Providers\AppServiceProvider($this->app))->boot();
        event(new MessageSending($email));
        $this->assertSame('team@example.ch', $email->getTo()[0]->getAddress());
        $this->assertSame('[Test an kunde@example.ch] Hallo', $email->getSubject());
    }

    public function test_env_file_writer(): void
    {
        $path = tempnam(sys_get_temp_dir(), 'env');
        file_put_contents($path, "APP_URL=https://alt.ch\nMAIL_FROM_NAME=\"Alt\"\n");
        $env = new EnvFile($path);
        $env->set(['APP_URL' => 'https://pflanzfarm.ch', 'MAIL_FROM_NAME' => 'Pflanzfarm Steinmann', 'STRIPE_SECRET' => 'sk_test_1']);
        $this->assertSame("APP_URL=https://pflanzfarm.ch\nMAIL_FROM_NAME=\"Pflanzfarm Steinmann\"\nSTRIPE_SECRET=sk_test_1\n", file_get_contents($path));
        $this->assertSame('Pflanzfarm Steinmann', $env->get('MAIL_FROM_NAME'));
        unlink($path);
    }

    public function test_status_command_and_admin_page_in_fake_mode(): void
    {
        config(['pflanzfarm.fake_payments' => true, 'pflanzfarm.test_mode' => true, 'mail.default' => 'log', 'app.url' => 'https://pflanzfarm.gross-ict.ch']);
        $rows = app(Integrations::class)->checks();
        $this->assertSame('warn', collect($rows)->firstWhere('area', 'Stripe')['status']);
        $this->artisan('pflanzfarm:status')->assertSuccessful();

        $admin = \App\Models\User::factory()->create(['role' => 'admin']);
        $admin->forceFill(['email_verified_at' => now()])->save();
        $this->actingAs($admin)->get('/admin/system-status')->assertOk()->assertSee('Simulierte Zahlung');
    }

    public function test_setup_command_writes_env_and_handles_unreachable_resend(): void
    {
        $envPath = base_path('.env.testing-setup');
        file_put_contents($envPath, "APP_URL=https://pflanzfarm.gross-ict.ch\nMAIL_MAILER=log\n");
        $this->app->bind(EnvFile::class, fn () => new EnvFile($envPath));
        config(['pflanzfarm.test_mode' => true, 'resend.api_key' => null, 'services.resend.key' => null]);
        $integrations = Mockery::mock(Integrations::class)->makePartial();
        $integrations->shouldReceive('resendDomain')->andReturn(false);
        $integrations->shouldReceive('setupResendWebhook')->andReturn('whsec_resend');
        $integrations->resendError = 'API key is invalid';
        $this->app->instance(Integrations::class, $integrations);

        $this->artisan('pflanzfarm:einrichten')
            ->expectsQuestion('Resend API-Schlüssel (re_…)', 're_123')
            ->expectsQuestion('Absender-Adresse', 'shop@pflanzfarm.ch')
            ->expectsQuestion('Absender-Name', 'Pflanzfarm Steinmann (Test)')
            ->expectsQuestion('Nur Testseite: alle E-Mails an eine feste Adresse umleiten? (leer = an die echten Empfänger)', 'team@example.ch')
            ->expectsConfirmation('Stripe jetzt einrichten?', 'no')
            ->assertSuccessful();

        $content = file_get_contents($envPath);
        unlink($envPath);
        foreach (['RESEND_API_KEY=re_123', 'MAIL_MAILER=resend', 'MAIL_FROM_ADDRESS=shop@pflanzfarm.ch', 'MAIL_REDIRECT_TO=team@example.ch', 'RESEND_WEBHOOK_SECRET=whsec_resend'] as $line) {
            $this->assertStringContainsString($line, $content);
        }
    }

    public function test_domain_switch_to_live(): void
    {
        $envPath = base_path('.env.testing-domain');
        file_put_contents($envPath, "APP_URL=https://pflanzfarm.gross-ict.ch\nPFLANZFARM_TEST_MODE=true\nSTRIPE_FAKE=true\nMAIL_REDIRECT_TO=a@b.ch\n");
        $this->app->bind(EnvFile::class, fn () => new EnvFile($envPath));
        $this->artisan('pflanzfarm:domain', ['domain' => 'https://pflanzfarm.ch/', '--live' => true])
            ->expectsConfirmation('So übernehmen?', 'yes')->assertSuccessful();
        $env = new EnvFile($envPath);
        $this->assertSame(['https://pflanzfarm.ch', 'pflanzfarm.ch,www.pflanzfarm.ch', 'false', 'false', ''],
            [$env->get('APP_URL'), $env->get('SANCTUM_STATEFUL_DOMAINS'), $env->get('PFLANZFARM_TEST_MODE'), $env->get('STRIPE_FAKE'), $env->get('MAIL_REDIRECT_TO')]);
        unlink($envPath);
    }
}
