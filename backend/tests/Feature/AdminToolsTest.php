<?php

namespace Tests\Feature;

use App\Filament\Resources\OrderResource\Pages\ListOrders;
use App\Filament\Resources\OrderResource\Pages\OrderBoard;
use App\Filament\Resources\ProductResource;
use App\Mail\OrderConfirmation;
use App\Mail\OrderStatusUpdate;
use App\Models\Customer;
use App\Models\Order;
use App\Models\Product;
use App\Models\ProductVariant;
use App\Models\User;
use App\Services\InvoicePdf;
use App\Services\ProductCsv;
use Database\Seeders\DatabaseSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Mail;
use Livewire\Livewire;
use Tests\TestCase;

class AdminToolsTest extends TestCase
{
    use RefreshDatabase;

    private User $admin;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(DatabaseSeeder::class);
        Mail::fake();
        $this->withHeader('Referer', 'http://localhost/');
        $this->admin = User::factory()->create(['role' => 'admin']);
        $this->admin->forceFill(['email_verified_at' => now()])->save();
    }

    private function order(array $override = []): Order
    {
        $res = $this->postJson('/api/orders', array_merge([
            'items' => [['variant_id' => ProductVariant::query()->where('label', '80–100 cm')->value('id'), 'quantity' => 2]],
            'name' => 'Erika Muster', 'email' => 'erika@example.ch', 'phone' => '079 111 22 33',
            'delivery_method' => 'abholung', 'payment_method' => 'invoice', 'accept_terms' => true,
        ], $override))->assertCreated();

        return Order::query()->where('number', $res->json('order.number'))->firstOrFail();
    }

    public function test_orders_are_linked_to_one_customer_card(): void
    {
        $a = $this->order();
        $b = $this->order(['email' => 'ERIKA@example.ch', 'phone' => '079 999 99 99']);
        $this->assertSame($a->customer_id, $b->customer_id);
        $this->assertSame('079 999 99 99', Customer::query()->find($a->customer_id)->phone);
        $this->assertSame(1, Customer::query()->count());
        Mail::assertSent(OrderConfirmation::class, fn ($m) => preg_match('#<img src="https?://[^"]+/thuja-smaragd-v2\.jpg"#', $m->render()) === 1);
    }

    public function test_board_moves_orders_and_remembers_view(): void
    {
        $this->actingAs($this->admin);
        $order = $this->order();

        Livewire::test(OrderBoard::class)->assertSee($order->number)->call('move', $order->id, 'bestaetigt');
        $this->assertSame('bestaetigt', $order->fresh()->status);
        Mail::assertSent(OrderStatusUpdate::class, 1);

        Livewire::test(OrderBoard::class)->set('notify', false)->call('move', $order->id, 'geliefert');
        $this->assertSame('geliefert', $order->fresh()->status);
        Mail::assertSent(OrderStatusUpdate::class, 1);

        $this->assertSame('board', $this->admin->fresh()->admin_preferences['orders_view']);
        $this->get('/admin/orders')->assertRedirect('/admin/orders/board');
    }

    public function test_bulk_confirm_and_combined_pdfs(): void
    {
        $this->actingAs($this->admin);
        $orders = collect([$this->order(), $this->order(), $this->order()]);
        $orders[2]->update(['status' => 'geliefert']);

        Livewire::test(ListOrders::class)
            ->callTableBulkAction('confirmMany', $orders->pluck('id')->all(), ['scheduled_date' => today()->addDay()->toDateString(), 'notify' => false]);
        $this->assertSame(['bestaetigt', 'bestaetigt', 'geliefert'], $orders->map(fn ($o) => $o->fresh()->status)->all());
        $this->assertSame(today()->addDay()->toDateString(), $orders[0]->fresh()->scheduled_date->toDateString());

        $pdf = app(InvoicePdf::class)->deliveryNotes($orders);
        $this->assertSame(3, preg_match_all('#/Type\s*/Page\b#', $pdf));
        $this->assertStringStartsWith('%PDF', app(InvoicePdf::class)->pickingList(null, $orders));
    }

    public function test_timeline_and_notes(): void
    {
        $this->actingAs($this->admin);
        $order = $this->order();
        $order->notes()->create(['user_id' => $this->admin->id, 'body' => 'Ruft zurück']);
        $order->update(['phone' => '041 000 00 00']);
        $titles = $order->fresh()->timeline()->pluck('title')->all();
        $this->assertContains('Notiz', $titles);
        $this->assertContains('Geändert: Telefon', $titles);
        $this->get('/admin/orders/'.$order->id)->assertOk()->assertSee('Ruft zurück');
        $this->get('/admin/customers/'.$order->customer_id)->assertOk()->assertSee('Erika Muster');
        Livewire::test(\App\Filament\Resources\CustomerResource\RelationManagers\OrdersRelationManager::class, ['ownerRecord' => $order->customer, 'pageClass' => \App\Filament\Resources\CustomerResource\Pages\ViewCustomer::class])
            ->assertSee($order->number);
    }

    public function test_csv_roundtrip_price_adjust_and_duplicate(): void
    {
        $this->actingAs($this->admin);
        $csv = app(ProductCsv::class)->export();
        $this->assertStringStartsWith("\xEF\xBB\xBF".'variante_id;produkt_slug', $csv);

        $thuja = ProductVariant::query()->where('label', '80–100 cm')->firstOrFail();
        $import = "variante_id;produkt_slug;groesse;preis_chf;lager\n{$thuja->id};thuja-smaragd;80–100 cm;16.50;60\n;thuja-smaragd;250–300 cm;99;2\n;gibt-es-nicht;1 m;5;1\n{$thuja->id};;;abc;\n";
        $r = app(ProductCsv::class)->import($import);
        $this->assertSame([1, 1], [$r['updated'], $r['created']]);
        $this->assertCount(2, $r['errors']);
        $this->assertSame([1650, 60], [$thuja->fresh()->price, $thuja->fresh()->stock]);
        $this->assertSame(9900, ProductVariant::query()->where('label', '250–300 cm')->value('price'));

        app(ProductCsv::class)->adjustPrices('Heckenpflanzen', 10, 50);
        $this->assertSame(1800, $thuja->fresh()->price); // 18.15 → 18.00

        $copy = ProductResource::duplicate(Product::query()->where('slug', 'thuja-smaragd')->firstOrFail());
        $this->assertSame('thuja-smaragd-kopie', $copy->slug);
        $this->assertFalse($copy->active);
        $this->assertSame(0, (int) $copy->variants()->sum('stock'));
        $this->assertSame(Product::query()->where('slug', 'thuja-smaragd')->first()->variants()->count(), $copy->variants()->count());
    }

    public function test_catalog_exposes_profile(): void
    {
        $thuja = collect($this->getJson('/api/catalog')->json('products'))->firstWhere('slug', 'thuja-smaragd');
        $this->assertTrue($thuja['profile']['evergreen']);
        $this->assertSame(['sonne', 'halbschatten'], $thuja['profile']['locations']);
        $this->assertSame(25, $thuja['profile']['growth']);
    }
}
