<?php

namespace Tests\Feature;

use App\Filament\Pages\Inventory;
use App\Filament\Resources\CouponResource;
use App\Mail\BackInStock;
use App\Mail\CareTips;
use App\Mail\SeasonalCareTip;
use App\Models\Coupon;
use App\Models\DeliveryZone;
use App\Models\GuideArticle;
use App\Models\MailOptOut;
use App\Models\Order;
use App\Models\ProductVariant;
use App\Models\Setting;
use App\Models\User;
use App\Services\ImageOptimizer;
use App\Services\InvoicePdf;
use App\Services\OrderService;
use App\Services\PaymentImporter;
use Database\Seeders\DatabaseSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Storage;
use Livewire\Livewire;
use Tests\TestCase;

class ExtrasTest extends TestCase
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

    private function payload(array $override = []): array
    {
        return array_merge([
            'items' => [['variant_id' => $this->thuja()->id, 'quantity' => 10]],
            'name' => 'Erika Muster', 'email' => 'erika@example.ch', 'phone' => '079 111 22 33',
            'delivery_method' => 'lieferung', 'street' => 'Gartenweg 1', 'postal_code' => '6210', 'city' => 'Sursee',
            'payment_method' => 'invoice', 'accept_terms' => true,
        ], $override);
    }

    private function order(array $override = []): Order
    {
        $res = $this->postJson('/api/orders', $this->payload($override))->assertCreated();

        return Order::query()->where('number', $res->json('order.number'))->firstOrFail();
    }

    public function test_delivery_zone_surcharge_and_blocked_zone(): void
    {
        DeliveryZone::query()->create(['name' => 'Tessin', 'postal_ranges' => [['from' => 6500, 'to' => 6999]], 'surcharge' => 6000, 'sort' => 1]);
        DeliveryZone::query()->create(['name' => 'Ausland-Enklave', 'postal_ranges' => [['from' => 8238]], 'deliverable' => false, 'sort' => 2]);

        $this->assertSame(4900, $this->order()->shipping, 'ohne Zone: nur Versandklasse');
        $ticino = $this->order(['postal_code' => '6600', 'city' => 'Locarno']);
        $this->assertSame(4900 + 6000, $ticino->shipping);
        $this->assertSame('Tessin', $ticino->delivery_zone);

        $this->postJson('/api/orders', $this->payload(['postal_code' => '8238']))->assertUnprocessable()->assertJsonValidationErrors('postal_code');
        $this->assertSame('Tessin', $this->getJson('/api/catalog')->json('settings.zones.0.name'));
    }

    public function test_planting_service_with_minimum_fee(): void
    {
        $order = $this->order(['planting' => true]);
        // 10 × CHF 8.00 = 80, Mindestbetrag 150
        $this->assertSame(15000, $order->planting_fee);
        $this->assertSame(15000 + 4900 + 15000, $order->total);

        $this->thuja()->update(['planting_price' => 2000]);
        $this->assertSame(20000, $this->order(['planting' => true])->planting_fee);
        $this->assertSame(0, $this->order(['planting' => true, 'delivery_method' => 'abholung'])->planting_fee, 'nur mit Lieferung');
        $this->assertStringStartsWith('%PDF', app(InvoicePdf::class)->render($order));
    }

    public function test_percent_code_and_gift_voucher_with_balance(): void
    {
        Coupon::query()->create(['code' => 'herbst10', 'type' => 'prozent', 'value' => 10, 'max_uses' => 1]);
        $this->postJson('/api/coupons/check', ['code' => 'HERBST10', 'subtotal' => 150])->assertOk()->assertJsonPath('coupon.type', 'prozent');

        $order = $this->order(['coupon_code' => 'Herbst10']);
        $this->assertSame(1500, $order->coupon_discount);
        $this->assertSame(15000 - 1500 + 4900, $order->total);
        $this->postJson('/api/orders', $this->payload(['coupon_code' => 'HERBST10']))->assertJsonValidationErrors('coupon_code');

        // Storno gibt die Einlösung frei
        app(OrderService::class)->cancel($order);
        $this->assertSame(0, Coupon::findByCode('HERBST10')->used_count);

        $gift = Coupon::query()->create(['code' => 'PF-GESCHENK', 'type' => 'gutschein', 'value' => 10000]);
        $this->assertSame(10000, $gift->balance);
        $first = $this->order(['coupon_code' => 'pf-geschenk']);
        $this->assertSame(10000, $first->coupon_discount);
        $this->assertSame(0, $gift->fresh()->balance);
        $this->postJson('/api/coupons/check', ['code' => 'PF-GESCHENK', 'subtotal' => 150])->assertUnprocessable();
        $this->assertStringStartsWith('%PDF', app(InvoicePdf::class)->voucher($gift));
    }

    public function test_voucher_covering_everything_skips_stripe(): void
    {
        Coupon::query()->create(['code' => 'ALLES', 'type' => 'gutschein', 'value' => 100000]);
        $res = $this->postJson('/api/orders', $this->payload(['payment_method' => 'stripe', 'coupon_code' => 'ALLES']))->assertCreated();
        $this->assertNull($res->json('redirect'));
        $order = Order::query()->where('number', $res->json('order.number'))->firstOrFail();
        $this->assertSame(0, $order->total);
        $this->assertSame('bezahlt', $order->payment_status);
        $this->assertSame(100000 - 19900, Coupon::findByCode('ALLES')->balance);
    }

    public function test_coupon_admin_create_stores_cents_and_percent(): void
    {
        $data = CouponResource::store(['type' => 'gutschein', 'code' => 'X1', 'amount' => 5000, 'min_order' => 0, 'active' => true]);
        $this->assertSame(['value' => 5000, 'balance' => 5000], array_intersect_key($data, ['value' => 1, 'balance' => 1]));
        $data = CouponResource::store(['type' => 'prozent', 'code' => 'X2', 'percent' => '15', 'min_order' => 0]);
        $this->assertSame(15, $data['value']);
        $this->assertNull($data['balance']);
    }

    public function test_back_in_stock_alert(): void
    {
        $v = $this->thuja();
        $v->update(['stock' => 0]);
        $this->postJson('/api/stock-alerts', ['variant_id' => $v->id, 'email' => 'warte@example.ch'])->assertOk();
        $this->postJson('/api/stock-alerts', ['variant_id' => $v->id, 'email' => 'warte@example.ch'])->assertOk();

        $v->update(['stock' => 20]);
        Mail::assertQueued(BackInStock::class, 1);
        $v->update(['stock' => 30]);
        Mail::assertQueued(BackInStock::class, 1);
    }

    public function test_care_mail_after_delivery_and_seasonal_reminder_with_opt_out(): void
    {
        Setting::put('google_review_url', 'https://g.page/r/test/review');
        $order = $this->order();
        $order->update(['status' => 'geliefert', 'delivered_at' => now()->subDays(15)]);
        $optedOut = $this->order(['email' => 'nein@example.ch']);
        $optedOut->update(['status' => 'geliefert', 'delivered_at' => now()->subDays(15)]);
        $this->get(MailOptOut::url('nein@example.ch'))->assertRedirect('/?pflegetipps=abgemeldet');
        $this->get('/pflegetipps/abmelden?e=erika@example.ch&s=falsch');
        $this->assertFalse(MailOptOut::has('erika@example.ch'));

        $article = GuideArticle::query()->where('product_id', $this->thuja()->product_id)->firstOrFail();
        $article->update(['remind_months' => [now()->month]]);

        $this->artisan('pflanzfarm:pflegemails')->assertSuccessful();
        Mail::assertQueued(CareTips::class, fn ($m) => $m->hasTo('erika@example.ch') && $m->reviewUrl);
        Mail::assertNotQueued(CareTips::class, fn ($m) => $m->hasTo('nein@example.ch'));
        Mail::assertQueued(SeasonalCareTip::class, 1);
        $this->assertNotNull($order->fresh()->review_requested_at);

        $this->artisan('pflanzfarm:pflegemails');
        Mail::assertQueued(CareTips::class, 1);
        Mail::assertQueued(SeasonalCareTip::class, 1);
    }

    public function test_camt054_import_marks_invoices_paid(): void
    {
        $a = $this->order();
        $b = $this->order();
        $c = $this->order();
        $ref = InvoicePdf::qrReference($a);
        $xml = <<<XML
<?xml version="1.0" encoding="UTF-8"?>
<Document xmlns="urn:iso:std:iso:20022:tech:xsd:camt.054.001.08"><BkToCstmrDbtCdtNtfctn><Ntfctn>
<Ntry><Amt Ccy="CHF">{$this->chf($a->total)}</Amt><CdtDbtInd>CRDT</CdtDbtInd><Sts><Cd>BOOK</Cd></Sts><BookgDt><Dt>2026-10-20</Dt></BookgDt>
 <NtryDtls><TxDtls><Amt Ccy="CHF">{$this->chf($a->total)}</Amt><RltdPties><Dbtr><Pty><Nm>Erika Muster</Nm></Pty></Dbtr></RltdPties>
 <RmtInf><Strd><CdtrRefInf><Tp><CdOrPrtry><Prtry>QRR</Prtry></CdOrPrtry></Tp><Ref>{$ref}</Ref></CdtrRefInf></Strd></RmtInf></TxDtls>
 <TxDtls><Amt Ccy="CHF">{$this->chf($b->total)}</Amt><RmtInf><Ustrd>Rechnung {$b->number} danke</Ustrd></RmtInf></TxDtls>
 <TxDtls><Amt Ccy="CHF">10.00</Amt><RmtInf><Ustrd>{$c->number}</Ustrd></RmtInf></TxDtls>
 <TxDtls><Amt Ccy="CHF">55.00</Amt><RmtInf><Ustrd>Spende</Ustrd></RmtInf></TxDtls>
 </NtryDtls></Ntry>
<Ntry><Amt Ccy="CHF">99.00</Amt><CdtDbtInd>DBIT</CdtDbtInd></Ntry>
</Ntfctn></BkToCstmrDbtCdtNtfctn></Document>
XML;
        $importer = app(PaymentImporter::class);
        $entries = $importer->parse($xml);
        $this->assertCount(4, $entries);
        $rows = $importer->apply($entries);

        $this->assertSame(['bezahlt', 'bezahlt', 'Betrag zu tief', 'nicht zugeordnet'], array_map(fn ($r) => explode(' (', $r['status'])[0], $rows));
        $this->assertSame('bezahlt', $a->fresh()->payment_status);
        $this->assertSame('2026-10-20', $a->fresh()->paid_at->toDateString());
        $this->assertSame('bezahlt', $b->fresh()->payment_status);
        $this->assertSame('offen', $c->fresh()->payment_status);
        $this->assertSame('bereits bezahlt', $importer->apply($entries)[0]['status']);
    }

    private function chf(int $cents): string
    {
        return number_format($cents / 100, 2, '.', '');
    }

    public function test_inventory_page_saves_counts(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $admin->forceFill(['email_verified_at' => now()])->save();
        $this->actingAs($admin);
        $v = $this->thuja();

        Livewire::test(Inventory::class)
            ->assertSee('Thuja Smaragd')
            ->set("counts.{$v->id}", '44')->call('save', $v->id)
            ->call('confirm', $v->id);
        $this->assertSame(44, $v->fresh()->stock);
        $this->assertNotNull($v->fresh()->counted_at);
    }

    public function test_uploaded_images_get_webp_variants(): void
    {
        if (! function_exists('imagewebp')) {
            $this->markTestSkipped('GD ohne WebP');
        }
        Storage::fake('public');
        Storage::disk('public')->put('produkte/foto.jpg', UploadedFile::fake()->image('foto.jpg', 2400, 1600)->getContent());

        $product = $this->thuja()->product;
        $product->update(['image' => 'produkte/foto.jpg', 'gallery' => ['produkte/foto.jpg']]);

        foreach (ImageOptimizer::WIDTHS as $w) {
            Storage::disk('public')->assertExists('produkte/foto-'.$w.'.webp');
        }
        $this->assertSame(800, getimagesizefromstring(Storage::disk('public')->get('produkte/foto-800.webp'))[0]);
        $p = collect($this->getJson('/api/catalog')->json('products'))->firstWhere('slug', $product->slug);
        $this->assertStringContainsString('foto-400.webp 400w', $p['imageSet']);
        $this->assertSame('/storage/produkte/foto-1600.webp', $p['gallery'][0]);
    }
}
