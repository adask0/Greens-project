<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Company;
use Faker\Factory as Faker;

class CompanySeeder extends Seeder
{
    public function run(): void
    {
        $faker = Faker::create('pl_PL');
        
        $companies = [
            [
                'name' => 'AgroClean Sp. z o.o.',
                'address' => 'Warszawa, ul. Polna 15',
                'status' => 'dostępny',
                'email' => 'kontakt@agroclean.pl',
                'phone' => '22 123 45 67',
                'subscription' => '12 mies.',
                'subscription_end_date' => now()->addMonths(12),
                'nip' => '5252801234',
                'is_active' => true
            ],
            [
                'name' => 'EkoFarma Mazowsze',
                'address' => 'Piaseczno, ul. Słoneczna 8',
                'status' => 'dostępny',
                'email' => 'biuro@ekofarma.pl',
                'phone' => '22 756 89 12',
                'subscription' => '6 mies.',
                'subscription_end_date' => now()->addMonths(6),
                'nip' => '1234567890',
                'is_active' => true
            ],
            [
                'name' => 'Green Solutions',
                'address' => 'Kraków, ul. Zielona 42',
                'status' => 'niedostępny',
                'email' => 'info@greensolutions.pl',
                'phone' => '12 345 67 89',
                'subscription' => '3 mies.',
                'subscription_end_date' => now()->addMonths(3),
                'nip' => '6789012345',
                'is_active' => true
            ],
            [
                'name' => 'Natura Plus',
                'address' => 'Wrocław, ul. Parkowa 21',
                'status' => 'dostępny',
                'email' => 'natura@naturaplus.pl',
                'phone' => '71 234 56 78',
                'subscription' => '7 mies.',
                'subscription_end_date' => now()->addMonths(7),
                'nip' => '9876543210',
                'is_active' => true
            ],
            [
                'name' => 'BioTech Innovations',
                'address' => 'Poznań, ul. Innowacyjna 10',
                'status' => 'zawieszony',
                'email' => 'office@biotech.pl',
                'phone' => '61 890 12 34',
                'subscription' => '1 mies.',
                'subscription_end_date' => now()->addMonth(),
                'nip' => '1122334455',
                'is_active' => false
            ]
        ];

        foreach ($companies as $company) {
            Company::create($company);
        }

        for ($i = 0; $i < 6; $i++) {
            Company::create([
                'name' => $faker->company,
                'address' => $faker->city . ', ' . $faker->streetAddress,
                'status' => $faker->randomElement(['dostępny', 'niedostępny', 'zawieszony']),
                'email' => $faker->unique()->companyEmail,
                'phone' => $faker->phoneNumber,
                'subscription' => $faker->numberBetween(1, 12) . ' mies.',
                'subscription_end_date' => now()->addMonths($faker->numberBetween(1, 12)),
                'nip' => $faker->unique()->numerify('##########'),
                'is_active' => $faker->boolean(80) // 80% szans na true
            ]);
        }
    }
}