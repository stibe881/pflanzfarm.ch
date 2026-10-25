<?php

namespace Database\Seeders;

use App\Models\NewsletterSubscriber;
use App\Models\Order;
use App\Models\ProductVariant;
use App\Models\Setting;
use App\Models\User;
use App\Services\OrderService;
use Illuminate\Database\Seeder;

/**
 * Beispieldaten NUR für die Testumgebung: Test-Konten, Beispielpreise und Beispielbestellungen.
 * Nicht in der Live-Datenbank ausführen.
 */
class TestDataSeeder extends Seeder
{
    public function run(): void
    {
        $admin = User::query()->firstOrCreate(['email' => env('TEST_ADMIN_EMAIL', 'admin@pflanzfarm.test')], [
            'name' => 'Thomas Steinmann (Test)', 'password' => env('TEST_ADMIN_PASSWORD', 'Pflanzfarm-Test-2026'), 'role' => 'admin',
        ]);
        $staff = User::query()->firstOrCreate(['email' => 'team@pflanzfarm.test'], ['name' => 'Susan Steinmann (Test)', 'password' => 'Pflanzfarm-Test-2026', 'role' => 'staff']);
        $customer = User::query()->firstOrCreate(['email' => 'kunde@pflanzfarm.test'], [
            'name' => 'Erika Muster', 'password' => 'Kunde-Test-2026', 'role' => 'customer',
            'phone' => '079 111 22 33', 'street' => 'Gartenweg 1', 'postal_code' => '6210', 'city' => 'Sursee',
        ]);
        foreach ([$admin, $staff, $customer] as $u) {
            $u->forceFill(['email_verified_at' => now()])->save();
        }

        // Beispielpreise für weitere Thuja-Grössen, damit die Grössenwahl getestet werden kann
        foreach (['100–120 cm' => [2200, 30], '120–140 cm' => [2900, 20], '140–160 cm' => [3900, 8]] as $label => [$price, $stock]) {
            ProductVariant::query()->where('label', $label)->update(['price' => $price, 'stock' => $stock, 'active' => true]);
        }

        // Beispiel-IBAN aus der Swiss-QR-Spezifikation, damit Rechnungen einen QR-Zahlteil haben
        Setting::put('iban', 'CH44 3199 9123 0008 8901 2');

        if (Order::query()->exists()) {
            return;
        }
        $orders = app(OrderService::class);
        $thuja = ProductVariant::query()->where('label', '80–100 cm')->value('id');
        $photinia = ProductVariant::query()->whereHas('product', fn ($q) => $q->where('slug', 'photinia-fraseri-red-robin'))->value('id');
        $base = ['name' => $customer->name, 'email' => $customer->email, 'phone' => $customer->phone, 'street' => $customer->street, 'postal_code' => $customer->postal_code, 'city' => $customer->city];

        $o1 = $orders->create([...$base, 'delivery_method' => 'lieferung', 'payment_method' => 'invoice'], [['variant_id' => $thuja, 'quantity' => 24]], $customer);
        $o1->update(['status' => 'bestaetigt', 'confirmed_at' => now()->subDays(3), 'created_at' => now()->subDays(4)]);

        $o2 = $orders->create([...$base, 'delivery_method' => 'abholung', 'payment_method' => 'cash'], [['variant_id' => $photinia, 'quantity' => 3]], $customer);
        $o2->update(['status' => 'geliefert', 'payment_status' => 'bezahlt', 'paid_at' => now()->subDays(10), 'delivered_at' => now()->subDays(10), 'created_at' => now()->subDays(12)]);

        $orders->create(['name' => 'Hans Beispiel', 'email' => 'hans@example.ch', 'phone' => '078 222 33 44', 'street' => 'Dorfstrasse 5', 'postal_code' => '6252', 'city' => 'Dagmersellen', 'delivery_method' => 'lieferung', 'payment_method' => 'invoice', 'note' => 'Bitte vor der Lieferung anrufen.'], [['variant_id' => $thuja, 'quantity' => 40]], null);

        NewsletterSubscriber::query()->firstOrCreate(['email' => 'leser@example.ch'], ['status' => 'bestaetigt', 'confirmed_at' => now(), 'source' => 'website']);
    }
}
