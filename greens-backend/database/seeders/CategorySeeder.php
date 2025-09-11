<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Category;

class CategorySeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            [
                'name' => 'Fotograf',
                'slug' => 'fotograf',
                'description' => 'Usługi fotograficzne',
                'icon' => '📸'
            ],
            [
                'name' => 'Zarządzanie nieruchomościami',
                'slug' => 'zarzadzanie-nieruchomosci',
                'description' => 'Profesjonalne zarządzanie nieruchomościami',
                'icon' => '🏠'
            ],
            [
                'name' => 'Sprzątanie',
                'slug' => 'sprzatanie',
                'description' => 'Usługi sprzątania',
                'icon' => '🧹'
            ]
        ];

        foreach ($categories as $category) {
            Category::create($category);
        }
    }
}