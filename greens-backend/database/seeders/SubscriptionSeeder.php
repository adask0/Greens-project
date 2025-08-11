<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Subscription;

class SubscriptionSeeder extends Seeder
{
    public function run(): void
    {
        Subscription::insert([
            [
                'name' => 'STANDARD',
                'duration' => 'jeden miesiąc',
                'price' => 5,
            ],
            [
                'name' => 'PLUS',
                'duration' => 'pół roku',
                'price' => 30,
            ],
            [
                'name' => 'PREMIUM',
                'duration' => 'cały rok',
                'price' => 50,
            ],
        ]);
    }
}