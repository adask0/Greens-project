<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Review;
use App\Models\User;
use App\Models\Company;

class ReviewSeeder extends Seeder
{
    public function run(): void
    {
        $users = User::all();
        $companies = Company::all();

        if ($users->isEmpty() || $companies->isEmpty()) {
            $this->command->warn('Brak użytkowników lub firm w bazie danych!');
            return;
        }

        $comments = [
            'Świetnie wykonana usługa, polecam!',
            'Bardzo profesjonalne podejście, wszystko na czas.',
            'Niestety spóźnienie i niska jakość usługi.',
            'Rewelacyjny kontakt z klientem, szybka realizacja.',
            'Usługa w porządku, ale można lepiej.',
            'Fantastyczna jakość wykonania, pełna satysfakcja!',
            'Przeciętna usługa, nic szczególnego.',
            'Bardzo dobra komunikacja i terminowość.',
            'Słaba jakość za taką cenę, nie polecam.',
            'Profesjonalna obsługa, na pewno skorzystam ponownie.',
        ];

        for ($i = 1; $i <= 50; $i++) {
            Review::create([
                'user_id' => $users->random()->id,
                'company_id' => $companies->random()->id,
                'rating' => rand(1, 5),
                'comment' => $comments[array_rand($comments)],
                'order_number' => 'ZL' . rand(1000, 9999),
                'order_date' => now()->subDays(rand(1, 365)),
                'is_hidden' => rand(0, 100) < 10, // 10% ukrytych
            ]);
        }

        $this->command->info('Dodano 50 przykładowych ocen!');
    }
}