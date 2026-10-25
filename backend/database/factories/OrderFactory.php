<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class OrderFactory extends Factory
{
    public function definition(): array
    {
        return [
            'number' => 'PF-'.now()->year.'-'.fake()->unique()->numberBetween(1000, 9999),
            'access_token' => Str::random(48),
            'status' => 'neu',
            'payment_method' => 'invoice',
            'payment_status' => 'offen',
            'delivery_method' => 'abholung',
            'name' => fake()->name(),
            'email' => fake()->safeEmail(),
            'phone' => '079 000 00 00',
            'subtotal' => 4500,
            'shipping' => 0,
            'total' => 4500,
        ];
    }
}
