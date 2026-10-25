<?php

namespace Tests\Feature;

use App\Filament\Resources\OrderResource\Pages\CreateOrder;
use App\Filament\Resources\OrderResource\Pages\ListOrders;
use App\Mail\CreditNoteMail;
use App\Mail\CustomerCancelledOrder;
use App\Mail\LowStockAlert;
use App\Mail\NewsletterCampaignMail;
use App\Mail\OrderConfirmation;
use App\Mail\PaymentReminder;
use App\Models\ActivityLog;
use App\Models\GuideArticle;
use App\Models\NewsletterCampaign;
use App\Models\NewsletterSend;
use App\Models\NewsletterSubscriber;
use App\Models\Order;
use App\Models\Product;
use App\Models\ProductVariant;
use App\Models\User;
use App\Services\InvoicePdf;
use App\Services\NewsletterService;
use App\Services\OrderService;
use App\Services\PaymentReminders;
use Database\Seeders\DatabaseSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Mail;
use Livewire\Livewire;
use Tests\TestCase;

class OperationsTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(DatabaseSeeder::class);
        Mail::fake();
        $this->withHeader('Referer', 'http://localhost/');
    }

    private function thuja(): ProductVariant
    {
        return ProductVariant::query()->where('label', '80–100 cm')->firstOrFail();
    }

    private function admin(): User
    {
        $u = User::factory()->create(['role' => 'admin']);
        $u->forceFill(['email_verified_at' => now()])->save();

        return $u;
    }

    private function payload(array $override = []): array
    {
        return array_merge([
            'items' => [['variant_id' => $this->thuja()->id, 'quantity' => 30]],
            'name' => 'Erika Muster', 'email' => 'erika@example.ch', 'phone' => '079 111 22 33',
            'delivery_method' => 'abholung', 'payment_method' => 'invoice', 'accept_terms' => true,
        ], $override);
    }

    public function test_volume_discount_is_applied_per_line(): void
    {
        $this->thuja()->product->update(['volume_discounts' => [['min_qty' => 20, 'percent' => 5], ['min_qty' => 25, 'percent' => 10]]]);
        $res = $this->postJson('/api/orders', $this->payload())->assertCreated();
        $order = Order::query()->where('number', $res->json('order.number'))->firstOrFail();

        // CHF 15.00 − 10 % = 13.50 × 30
        $this->assertSame(40500, $order->subtotal);
        $this->assertSame(4500, $order->discount_total);
        $this->assertSame(10, $order->items->first()->discount_percent);
        $this->assertSame(1500, $order->items->first()->list_price);
        $this->assertStringStartsWith('%PDF', app(InvoicePdf::class)->render($order));

        $catalog = collect($this->getJson('/api/catalog')->json('products'))->firstWhere('slug', 'thuja-smaragd');
        $this->assertSame([['minQty' => 20, 'percent' => 5], ['minQty' => 25, 'percent' => 10]], $catalog['discounts']);
    }

    public function test_preferred_date_is_validated_and_stored(): void
    {
        $this->postJson('/api/orders', $this->payload(['preferred_date' => today()->toDateString()]))
            ->assertUnprocessable()->assertJsonValidationErrors('preferred_date');

        $date = today()->addDays(3);
        while ($date->isSunday()) {
            $date->addDay();
        }
        $res = $this->postJson('/api/orders', $this->payload(['preferred_date' => $date->toDateString(), 'preferred_slot' => 'vormittag']))->assertCreated();
        $this->assertSame($date->toDateString(), Order::query()->where('number', $res->json('order.number'))->value('preferred_date')->toDateString());
    }

    public function test_low_stock_alert_is_sent_once(): void
    {
        $this->postJson('/api/orders', $this->payload(['items' => [['variant_id' => $this->thuja()->id, 'quantity' => 40]]]))->assertCreated();
        Mail::assertSent(LowStockAlert::class, 1);
        $this->assertNotNull($this->thuja()->low_stock_notified_at);

        $this->postJson('/api/orders', $this->payload(['items' => [['variant_id' => $this->thuja()->id, 'quantity' => 1]]]))->assertCreated();
        Mail::assertSent(LowStockAlert::class, 1);

        // Wieder aufgefüllt: Warnung ist wieder scharf
        $v = $this->thuja();
        $v->update(['stock' => 100]);
        $this->assertNull($v->fresh()->low_stock_notified_at);
    }

    public function test_payment_reminders_for_overdue_invoices(): void
    {
        $order = Order::factory()->create(['created_at' => now()->subDays(40)]);
        $fresh = Order::factory()->create();

        $this->artisan('pflanzfarm:zahlungserinnerungen')->assertSuccessful();
        Mail::assertSent(PaymentReminder::class, fn ($m) => $m->order->is($order));
        Mail::assertNotSent(PaymentReminder::class, fn ($m) => $m->order->is($fresh));
        $this->assertSame(1, $order->fresh()->reminder_count);

        // Abstand noch nicht erreicht: keine zweite Erinnerung
        $this->artisan('pflanzfarm:zahlungserinnerungen');
        Mail::assertSent(PaymentReminder::class, 1);

        $this->travel(11)->days();
        $this->artisan('pflanzfarm:zahlungserinnerungen');
        $this->travel(11)->days();
        $this->artisan('pflanzfarm:zahlungserinnerungen');
        $this->assertSame(2, $order->fresh()->reminder_count, 'höchstens 2 Erinnerungen');
    }

    public function test_cancel_with_refund_creates_credit_note(): void
    {
        $res = $this->postJson('/api/orders', $this->payload(['payment_method' => 'cash']))->assertCreated();
        $order = Order::query()->where('number', $res->json('order.number'))->firstOrFail();
        $order->update(['payment_status' => 'bezahlt', 'paid_at' => now()]);

        app(OrderService::class)->cancel($order, refund: true);
        $order->refresh();
        $this->assertSame('erstattet', $order->payment_status);
        $this->assertSame($order->total, $order->refund_amount);
        $this->assertSame(48, $this->thuja()->stock);
        Mail::assertSent(CreditNoteMail::class);
        $this->assertStringStartsWith('%PDF', app(InvoicePdf::class)->creditNote($order));
    }

    public function test_customer_can_cancel_unconfirmed_order(): void
    {
        $user = User::factory()->create(['role' => 'customer', 'email' => 'erika@example.ch']);
        $this->actingAs($user);
        $number = $this->postJson('/api/orders', $this->payload())->assertCreated()->json('order.number');
        $this->assertTrue(collect($this->getJson('/api/me/orders')->json('orders'))->firstWhere('number', $number)['cancellable']);

        $this->postJson("/api/me/orders/{$number}/cancel")->assertOk()->assertJsonPath('order.status', 'storniert');
        Mail::assertSent(CustomerCancelledOrder::class);
        $this->assertSame('kunde', Order::query()->where('number', $number)->value('cancelled_by'));

        // Bestätigte Bestellungen nicht
        $other = $this->postJson('/api/orders', $this->payload())->json('order.number');
        Order::query()->where('number', $other)->update(['status' => 'bestaetigt']);
        $this->postJson("/api/me/orders/{$other}/cancel")->assertUnprocessable();

        // Fremde Bestellungen nicht
        $foreign = Order::factory()->create();
        $this->postJson("/api/me/orders/{$foreign->number}/cancel")->assertNotFound();
    }

    public function test_admin_creates_phone_order_and_changes_are_logged(): void
    {
        $admin = $this->admin();
        $this->actingAs($admin);

        Livewire::test(CreateOrder::class)
            ->fillForm([
                'name' => 'Hans Telefon', 'phone' => '041 000 00 00', 'email' => '',
                'items' => [['variant_id' => $this->thuja()->id, 'quantity' => 5]],
                'delivery_method' => 'abholung', 'payment_method' => 'cash', 'paid' => true,
                'status' => 'bestaetigt', 'scheduled_date' => today()->addDay()->toDateString(), 'scheduled_slot' => 'vormittag',
            ])
            ->call('create')
            ->assertHasNoFormErrors();

        $order = Order::query()->where('name', 'Hans Telefon')->firstOrFail();
        $this->assertSame('admin', $order->source);
        $this->assertSame('bezahlt', $order->payment_status);
        $this->assertNull($order->email);
        $this->assertSame(43, $this->thuja()->stock);
        Mail::assertNotSent(OrderConfirmation::class);
        $this->assertTrue(ActivityLog::query()->where('subject_type', 'Order')->where('event', 'erstellt')->where('user_id', $admin->id)->exists());

        $product = Product::query()->first();
        $product->update(['name' => 'Neuer Name']);
        $log = ActivityLog::query()->where('subject_type', 'Product')->latest('id')->first();
        $this->assertSame('geändert', $log->event);
        $this->assertSame('Neuer Name', $log->changes['name'][1]);

        // Rüstliste und Lieferschein
        $this->assertStringStartsWith('%PDF', app(InvoicePdf::class)->pickingList(today()->addDay()));
        $this->assertStringStartsWith('%PDF', app(InvoicePdf::class)->deliveryNote($order));
        Livewire::test(ListOrders::class)->assertOk();
    }

    public function test_newsletter_send_tracking_and_schedule(): void
    {
        NewsletterSubscriber::query()->create(['email' => 'a@example.ch', 'status' => 'bestaetigt', 'token' => 'tok-a']);
        NewsletterSubscriber::query()->create(['email' => 'b@example.ch', 'status' => 'ausstehend', 'token' => 'tok-b']);
        $campaign = NewsletterCampaign::query()->create(['subject' => 'Herbst', 'body' => 'Hallo', 'scheduled_at' => now()->addHour()]);

        $this->artisan('pflanzfarm:newsletter-planen');
        $this->assertNull($campaign->fresh()->sent_at);

        $this->travel(2)->hours();
        $this->artisan('pflanzfarm:newsletter-planen');
        $this->assertNotNull($campaign->fresh()->sent_at);
        $this->assertSame(1, $campaign->fresh()->recipients);
        Mail::assertQueued(NewsletterCampaignMail::class, 1);

        // Kein Doppelversand
        $this->assertSame(0, app(NewsletterService::class)->send($campaign->fresh()));

        $send = NewsletterSend::query()->firstOrFail();
        $send->update(['message_id' => 'resend-123', 'sent_at' => now()]);
        event(new \Resend\Laravel\Events\EmailOpened(['type' => 'email.opened', 'data' => ['email_id' => 'resend-123']]));
        event(new \Resend\Laravel\Events\EmailClicked(['type' => 'email.clicked', 'data' => ['email_id' => 'x', 'tags' => ['send_id' => (string) $send->id]]]));
        $this->get('/newsletter/abmelden/tok-a?s='.$send->id)->assertRedirect();

        $stats = NewsletterService::stats($campaign);
        $this->assertSame([1, 1, 1, 100], [$stats['opened'], $stats['clicked'], $stats['unsubscribed'], $stats['open_rate']]);
    }

    public function test_server_rendered_article_and_dynamic_sitemap(): void
    {
        $article = GuideArticle::query()->firstOrFail();
        $this->get('/ratgeber/'.$article->slug)->assertOk()->assertSee('<h1>'.e($article->title).'</h1>', false)->assertSee('"@type":"Article"', false);
        $this->get('/ratgeber/gibt-es-nicht')->assertNotFound();

        $product = Product::query()->where('active', true)->firstOrFail();
        $product->update(['slug' => 'ganz-neu']);
        $this->get('/produkt/ganz-neu')->assertOk()->assertSee('"@type":"Product"', false)->assertSee('CHF', false);

        $this->get('/sitemap.xml')->assertOk()->assertHeader('Content-Type', 'application/xml; charset=UTF-8')
            ->assertSee('/produkt/ganz-neu/')->assertSee('/ratgeber/'.$article->slug.'/');
    }

    public function test_error_mail_is_throttled(): void
    {
        config(['pflanzfarm.error_mails' => true]);
        $this->app['env'] = 'production';
        $e = new \RuntimeException('Kaputt');
        \App\Support\ErrorNotifier::report($e);
        \App\Support\ErrorNotifier::report($e);
        \App\Support\ErrorNotifier::report(new \Symfony\Component\HttpKernel\Exception\NotFoundHttpException);
        $this->app['env'] = 'testing';
        Mail::assertSentCount(1);
    }
}
