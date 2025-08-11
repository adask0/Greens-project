<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Listing;
use App\Models\Company;
use Carbon\Carbon;

class ListingSeeder extends Seeder
{
    public function run(): void
    {
        $companies = Company::all();
        
        if ($companies->isEmpty()) {
            $this->command->info('Brak firm w bazie. Najpierw uruchom CompanySeeder.');
            return;
        }

        $listings = [
            [
                'title' => 'Sprzątanie biur',
                'description' => 'Profesjonalne sprzątanie powierzchni biurowych',
                'long_description' => 'Oferujemy kompleksowe usługi sprzątania biur dla firm każdej wielkości. Nasze doświadczenie wynosi ponad 10 lat, a zespół składa się z wykwalifikowanych specjalistów. Używamy tylko profesjonalnego sprzętu i ekologicznych środków czyszczących, które są bezpieczne dla zdrowia i środowiska.',
                'price' => 150,
                'rating' => 4.8,
                'category' => 'Usługi porządkowe',
                'subcategory' => 'Sprzątanie biur',
                'company_id' => $companies[0]->id,
                'company_name' => $companies[0]->name,
                'location' => 'Warszawa',
                'phone' => '+48 123 456 789',
                'email' => 'kontakt@cleanpro.pl',
                'avatar' => 'avatar1.png',
                'images' => ['image1.png', 'image2.png', 'image3.png'],
                'tags' => ['Sprzątanie', 'Biura', 'Ekologiczne środki'],
                'experience' => 'Posiadamy 10-letnie doświadczenie w branży sprzątającej. Obsługujemy zarówno małe biura, jak i duże kompleksy biurowe.',
                'social_media' => [
                    'facebook' => 'https://facebook.com/cleanpro',
                    'instagram' => 'https://instagram.com/cleanpro'
                ],
                'status' => 'aktywne',
                'is_featured' => true,
                'clicks' => 720,
                'published_at' => Carbon::now()->subDays(30)
            ],
            [
                'title' => 'Zarządzanie blokiem mieszkalnym',
                'description' => 'Kompleksowe zarządzanie nieruchomościami',
                'long_description' => 'Świadczymy usługi zarządzania nieruchomościami mieszkalnymi z pełnym zakresem obowiązków administratora. Zajmujemy się obsługą techniczną, finansową oraz prawną wspólnot mieszkaniowych.',
                'price' => 300,
                'rating' => 4.5,
                'category' => 'Zarządzanie nieruchomościami mieszkalnymi',
                'subcategory' => 'Administracja',
                'company_id' => $companies[1]->id,
                'company_name' => $companies[1]->name,
                'location' => 'Warszawa',
                'phone' => '+48 234 567 890',
                'email' => 'biuro@zarzadcapro.pl',
                'avatar' => 'avatar2.png',
                'images' => ['image2.png', 'image1.png', 'image4.png'],
                'tags' => ['Zarządzanie', 'Wspólnoty', 'Administracja'],
                'experience' => '15 lat doświadczenia w zarządzaniu nieruchomościami. Obsługujemy ponad 200 wspólnot mieszkaniowych.',
                'social_media' => [
                    'facebook' => 'https://facebook.com/zarzadcapro',
                    'linkedin' => 'https://linkedin.com/company/zarzadcapro'
                ],
                'status' => 'aktywne',
                'is_featured' => false,
                'clicks' => 450,
                'published_at' => Carbon::now()->subDays(15)
            ],
            [
                'title' => 'Konserwacja hali przemysłowej',
                'description' => 'Utrzymanie obiektów przemysłowych',
                'long_description' => 'Specjalizujemy się w kompleksowej konserwacji hal przemysłowych, magazynów i obiektów produkcyjnych.',
                'price' => 250,
                'rating' => 4.9,
                'category' => 'Nieruchomości przemysłowe',
                'subcategory' => 'Magazyny',
                'company_id' => $companies[2]->id,
                'company_name' => $companies[2]->name,
                'location' => 'Kraków',
                'phone' => '+48 345 678 901',
                'email' => 'serwis@industrial.pl',
                'avatar' => 'avatar3.png',
                'images' => ['image3.png', 'image4.png', 'image1.png'],
                'tags' => ['Konserwacja', 'Przemysł', 'Hale'],
                'experience' => 'Ponad 20 lat doświadczenia w sektorze przemysłowym.',
                'social_media' => [
                    'instagram' => 'https://instagram.com/industrialservice',
                    'linkedin' => 'https://linkedin.com/company/industrialservice'
                ],
                'status' => 'nie aktywne',
                'is_featured' => false,
                'clicks' => 320,
                'published_at' => Carbon::now()->subDays(45)
            ],
            [
                'title' => 'Mycie okien',
                'description' => 'Profesjonalne mycie okien w budynkach',
                'long_description' => 'Świadczymy usługi profesjonalnego mycia okien w budynkach mieszkalnych, biurowych i przemysłowych.',
                'price' => 120,
                'rating' => 4.7,
                'category' => 'Usługi porządkowe',
                'subcategory' => 'Mycie okien',
                'company_id' => $companies[3]->id,
                'company_name' => $companies[3]->name,
                'location' => 'Wrocław',
                'phone' => '+48 567 890 123',
                'email' => 'info@czysteokna.pl',
                'avatar' => 'avatar4.png',
                'images' => ['image1.png', 'image2.png'],
                'tags' => ['Mycie okien', 'Alpinistyka', 'Budynki'],
                'experience' => '12 lat doświadczenia w myciu okien.',
                'social_media' => [
                    'linkedin' => 'https://linkedin.com/company/czysteokna'
                ],
                'status' => 'aktywne',
                'is_featured' => true,
                'clicks' => 890,
                'published_at' => Carbon::now()->subDays(7)
            ],
            [
                'title' => 'Sprzątanie mieszkań',
                'description' => 'Regularne sprzątanie mieszkań prywatnych',
                'long_description' => 'Oferujemy profesjonalne usługi sprzątania mieszkań. Dostosowujemy się do indywidualnych potrzeb klientów.',
                'price' => 100,
                'rating' => 4.6,
                'category' => 'Usługi porządkowe',
                'subcategory' => 'Sprzątanie mieszkań',
                'company_id' => $companies[4]->id,
                'company_name' => $companies[4]->name,
                'location' => 'Poznań',
                'phone' => '+48 678 901 234',
                'email' => 'kontakt@sprzatamy.pl',
                'avatar' => 'avatar5.png',
                'images' => ['image2.png', 'image3.png', 'image4.png'],
                'tags' => ['Sprzątanie', 'Mieszkania', 'Regularnie'],
                'experience' => '8 lat w branży sprzątania mieszkań.',
                'social_media' => [
                    'facebook' => 'https://facebook.com/sprzatamy',
                    'instagram' => 'https://instagram.com/sprzatamy'
                ],
                'status' => 'aktywne',
                'is_featured' => false,
                'clicks' => 560,
                'published_at' => Carbon::now()->subDays(10)
            ]
        ];

        for ($i = 0; $i < 10; $i++) {
            $company = $companies->random();
            $categories = [
                'Usługi porządkowe' => ['Porządkowe', 'Sprzątanie biur', 'Mycie okien', 'Sprzątanie mieszkań'],
                'Zarządzanie nieruchomościami mieszkalnymi' => ['Mieszkalnictwo', 'Administracja', 'Konserwacja', 'Zarządzanie wspólnotą'],
                'Nieruchomości przemysłowe' => ['Przemysłowe', 'Fabryki', 'Magazyny', 'Hale produkcyjne'],
                'Nieruchomości gruntowe' => ['Gruntowe', 'Działki budowlane', 'Tereny rolne', 'Działki rekreacyjne']
            ];
            
            $category = array_rand($categories);
            $subcategory = $categories[$category][array_rand($categories[$category])];
            
            $listings[] = [
                'title' => 'Ogłoszenie ' . ($i + 6),
                'description' => 'Opis ogłoszenia ' . ($i + 6),
                'long_description' => 'Szczegółowy opis usługi nr ' . ($i + 6),
                'price' => rand(100, 500),
                'rating' => rand(35, 50) / 10,
                'category' => $category,
                'subcategory' => $subcategory,
                'company_id' => $company->id,
                'company_name' => $company->name,
                'location' => $company->address,
                'phone' => $company->phone,
                'email' => $company->email,
                'avatar' => 'avatar' . rand(1, 5) . '.png',
                'images' => ['image1.png', 'image2.png'],
                'tags' => ['Tag1', 'Tag2', 'Tag3'],
                'experience' => 'Doświadczenie w branży',
                'social_media' => [],
                'status' => ['aktywne', 'nie aktywne'][rand(0, 1)],
                'is_featured' => rand(0, 1) == 1,
                'clicks' => rand(100, 1000),
                'published_at' => Carbon::now()->subDays(rand(1, 60))
            ];
        }

        foreach ($listings as $listing) {
            Listing::create($listing);
        }
    }
}