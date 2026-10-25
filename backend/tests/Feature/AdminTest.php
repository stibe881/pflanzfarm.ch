<?php

namespace Tests\Feature;

use App\Models\Order;
use App\Models\Product;
use App\Models\User;
use Database\Seeders\DatabaseSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AdminTest extends TestCase
{
    use RefreshDatabase;

    private function team(string $role = 'admin'): User
    {
        $u = User::factory()->create(['role' => $role]);
        $u->forceFill(['email_verified_at' => now()])->save();

        return $u;
    }

    public function test_customers_and_guests_cannot_open_admin(): void
    {
        $this->get('/admin')->assertRedirect('/admin/login');
        $customer = User::factory()->create(['role' => 'customer']);
        // Kundenkonto wird abgemeldet und zur Admin-Anmeldung geschickt statt «403»
        $this->actingAs($customer)->get('/admin/orders')->assertRedirect('/admin/login');
        $this->assertGuest();
        $this->get('/admin/login')->assertSee('Kundenkonto angemeldet');
    }

    public function test_admin_pages_render(): void
    {
        $this->seed(DatabaseSeeder::class);
        $admin = $this->team();
        $order = Order::factory()->create();
        $pages = [
            '/admin', '/admin/orders', '/admin/orders/'.$order->id, '/admin/orders/'.$order->id.'/edit',
            '/admin/products', '/admin/products/create', '/admin/products/'.Product::first()->id.'/edit',
            '/admin/users', '/admin/users/create', '/admin/users/'.$admin->id,
            '/admin/popups', '/admin/popups/create', '/admin/references', '/admin/guide-articles',
            '/admin/newsletter-subscribers', '/admin/newsletter-campaigns', '/admin/newsletter-campaigns/create', '/admin/settings',
        ];
        foreach ($pages as $url) {
            $this->actingAs($admin)->get($url)->assertOk();
        }
    }

    public function test_staff_cannot_edit_admin_accounts(): void
    {
        $admin = $this->team('admin');
        $staff = $this->team('staff');
        $this->actingAs($staff)->get('/admin/users/'.$admin->id.'/edit')->assertForbidden();
    }
}
