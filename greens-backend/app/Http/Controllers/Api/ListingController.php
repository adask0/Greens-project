<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Listing;
use App\Models\Company;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class ListingController extends Controller
{
    public function adminIndex(Request $request): JsonResponse
    {
        \Log::info('Admin listings request:', $request->all());

        $query = Listing::with(['company']);

        if ($request->has('sort_by') && $request->sort_by) {
            $sortBy = $request->get('sort_by', 'created_at');
            $sortOrder = $request->get('sort_order', 'desc');

            \Log::info("Sorting by: {$sortBy}, order: {$sortOrder}");

            // Sprawdź czy kolumna istnieje
            $allowedColumns = ['created_at', 'published_at', 'clicks', 'price', 'title', 'id'];

            if (in_array($sortBy, $allowedColumns)) {
                $query->orderBy($sortBy, $sortOrder);
            } else {
                \Log::warning("Invalid sort column: {$sortBy}");
                $query->orderBy('created_at', 'desc');
            }
        } else {
            $query->orderBy('created_at', 'desc');
        }

        if ($request->has('status') && $request->status !== '') {
            // UŻYWAJ ANGIELSKICH STATUSÓW
            $query->where('status', $request->status);
        }

        if ($request->has('is_featured')) {
            $query->where('featured', $request->boolean('is_featured'));
        }

        if ($request->has('search') && $request->search !== '') {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                    ->orWhere('company_name', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%");
            });
        }

        $perPage = $request->get('per_page', 15);
        $listings = $query->paginate($perPage);

        return response()->json([
            'success' => true,
            'data' => $listings
        ]);
    }

    public function index(Request $request): JsonResponse
    {
        $query = Listing::where('status', 'active'); // TYLKO AKTYWNE OGŁOSZENIA

        if ($request->has('category')) {
            $query->where('category', $request->category);
        }

        if ($request->has('subcategory')) {
            $query->where('subcategory', $request->subcategory);
        }

        if ($request->has('location')) {
            $query->where('location', 'like', "%{$request->location}%");
        }

        if ($request->has('price_min')) {
            $query->where('price', '>=', $request->price_min);
        }
        if ($request->has('price_max')) {
            $query->where('price', '<=', $request->price_max);
        }

        if ($request->has('featured')) {
            $query->where('featured', $request->boolean('featured'));
        }

        $sortBy = $request->get('sort_by', 'created_at');
        $sortOrder = $request->get('sort_order', 'desc');

        if ($sortBy === 'featured') {
            $query->orderBy('featured', 'desc')->orderBy('created_at', 'desc');
        } else {
            $query->orderBy($sortBy, $sortOrder);
        }

        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%")
                    ->orWhere('long_description', 'like', "%{$search}%");
            });
        }

        $perPage = $request->get('per_page', 12);
        $listings = $query->paginate($perPage);

        return response()->json([
            'success' => true,
            'data' => $listings
        ]);
    }

    public function show($id): JsonResponse
    {
        $listing = Listing::with(['company'])->find($id);

        if (!$listing) {
            return response()->json([
                'success' => false,
                'message' => 'Ogłoszenie nie zostało znalezione'
            ], 404);
        }

        $listing->incrementClicks();

        return response()->json([
            'success' => true,
            'data' => $listing
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'long_description' => 'nullable|string',
            'price' => 'required|numeric|min:0',
            'category' => 'required|string',
            'subcategory' => 'required|string',
            'company_id' => 'required|exists:companies,id',
            'location' => 'required|string',
            'phone' => 'nullable|string',
            'email' => 'nullable|email',
            'avatar' => 'nullable|string',
            'images' => 'nullable|array',
            'tags' => 'nullable|array',
            'experience' => 'nullable|string',
            'social_media' => 'nullable|array',
            'status' => 'in:active,inactive,pending', // ZMIENIONE NA ANGIELSKIE
            'is_featured' => 'boolean'
        ]);

        $company = Company::find($validated['company_id']);
        $validated['company_name'] = $company->name;
        $validated['published_at'] = now();

        $listing = Listing::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Ogłoszenie zostało utworzone',
            'data' => $listing
        ], 201);
    }

    public function update(Request $request, $id): JsonResponse
    {
        $listing = Listing::find($id);

        if (!$listing) {
            return response()->json([
                'success' => false,
                'message' => 'Ogłoszenie nie zostało znalezione'
            ], 404);
        }

        $validated = $request->validate([
            'title' => 'sometimes|required|string|max:255',
            'description' => 'sometimes|required|string',
            'long_description' => 'nullable|string',
            'price' => 'sometimes|required|numeric|min:0',
            'category' => 'sometimes|required|string',
            'subcategory' => 'sometimes|required|string',
            'company_id' => 'sometimes|required|exists:companies,id',
            'location' => 'sometimes|required|string',
            'phone' => 'nullable|string',
            'email' => 'nullable|email',
            'avatar' => 'nullable|string',
            'images' => 'nullable|array',
            'tags' => 'nullable|array',
            'experience' => 'nullable|string',
            'social_media' => 'nullable|array',
            'status' => 'sometimes|in:active,inactive,pending', // ZMIENIONE NA ANGIELSKIE
            'is_featured' => 'sometimes|boolean'
        ]);

        if (isset($validated['company_id'])) {
            $company = Company::find($validated['company_id']);
            $validated['company_name'] = $company->name;
        }

        $listing->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Ogłoszenie zostało zaktualizowane',
            'data' => $listing
        ]);
    }

    public function changeStatus(Request $request, $id): JsonResponse
    {
        try {
            \Log::info('=== CHANGE STATUS DEBUG ===');
            \Log::info('Listing ID:', ['id' => $id]);
            \Log::info('Request data:', $request->all());

            $listing = Listing::find($id);

            if (!$listing) {
                return response()->json([
                    'success' => false,
                    'message' => 'Ogłoszenie nie zostało znalezione'
                ], 404);
            }

            $validated = $request->validate([
                'status' => 'required|in:active,inactive,pending' // ZMIENIONE NA ANGIELSKIE
            ]);

            \Log::info('Old status:', ['old_status' => $listing->status]);
            \Log::info('New status:', ['new_status' => $validated['status']]);

            $listing->status = $validated['status'];
            $listing->save();

            \Log::info('Status updated successfully');

            return response()->json([
                'success' => true,
                'message' => 'Status ogłoszenia został zmieniony',
                'data' => $listing
            ]);
        } catch (\Exception $e) {
            \Log::error('=== ERROR IN CHANGE STATUS ===');
            \Log::error('Error: ' . $e->getMessage());
            \Log::error('File: ' . $e->getFile());
            \Log::error('Line: ' . $e->getLine());

            return response()->json([
                'success' => false,
                'message' => 'Błąd serwera: ' . $e->getMessage(),
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function toggleFeatured($id): JsonResponse
    {
        $listing = Listing::find($id);

        if (!$listing) {
            return response()->json([
                'success' => false,
                'message' => 'Ogłoszenie nie zostało znalezione'
            ], 404);
        }

        $featuredCount = Listing::where('featured', true)->count();

        if (!$listing->featured && $featuredCount >= 5) {
            return response()->json([
                'success' => false,
                'message' => 'Osiągnięto limit wyróżnionych ogłoszeń (5)'
            ], 400);
        }

        $listing->featured = !$listing->featured;
        $listing->save();

        return response()->json([
            'success' => true,
            'message' => $listing->featured ? 'Ogłoszenie zostało wyróżnione' : 'Usunięto wyróżnienie ogłoszenia',
            'data' => $listing,
            'featured_count' => Listing::where('featured', true)->count()
        ]);
    }

    public function destroy($id): JsonResponse
    {
        $listing = Listing::find($id);

        if (!$listing) {
            return response()->json([
                'success' => false,
                'message' => 'Ogłoszenie nie zostało znalezione'
            ], 404);
        }

        $listing->delete();

        return response()->json([
            'success' => true,
            'message' => 'Ogłoszenie zostało usunięte'
        ]);
    }

    public function statistics(): JsonResponse
    {
        $stats = [
            'total' => Listing::count(),
            'active' => Listing::where('status', 'active')->count(), // ZMIENIONE
            'inactive' => Listing::where('status', 'inactive')->count(), // ZMIENIONE
            'pending' => Listing::where('status', 'pending')->count(), // ZMIENIONE
            'featured' => Listing::where('featured', true)->count(),
            'total_clicks' => Listing::sum('clicks'),
            'avg_price' => Listing::avg('price'),
            'by_category' => Listing::select('category')
                ->selectRaw('count(*) as count')
                ->groupBy('category')
                ->get(),
            'by_status' => Listing::select('status')
                ->selectRaw('count(*) as count')
                ->groupBy('status')
                ->get()
        ];

        return response()->json([
            'success' => true,
            'data' => $stats
        ]);
    }

    public function incrementClicks($id)
    {
        try {
            $listing = \App\Models\Listing::findOrFail($id);

            $listing->increment('clicks');

            return response()->json([
                'message' => 'Licznik kliknięć został zaktualizowany',
                'clicks' => $listing->clicks
            ]);
        } catch (\Exception $e) {
            \Log::error('Błąd podczas aktualizacji licznika kliknięć: ' . $e->getMessage());

            return response()->json([
                'message' => 'Błąd podczas aktualizacji licznika kliknięć',
                'error' => $e->getMessage()
            ], 500);
        }
    }
    public function uploadImages(Request $request, $listingId)
    {
        try {
            $listing = Listing::findOrFail($listingId);

            if ($listing->user_id !== auth()->id()) {
                return response()->json([
                    'message' => 'Brak uprawnień'
                ], 403);
            }

            $request->validate([
                'images' => 'required|array|max:10',
                'images.*' => 'image|mimes:jpeg,jpg,png,webp|max:5120' // 5MB max
            ]);

            $uploadedImages = [];

            foreach ($request->file('images') as $image) {
                $filename = time() . '_' . uniqid() . '.' . $image->getClientOriginalExtension();

                $path = $image->storeAs('listings', $filename, 'public');

                $currentImages = $listing->images ? json_decode($listing->images, true) : [];
                $currentImages[] = $filename;

                $listing->update(['images' => json_encode($currentImages)]);

                $uploadedImages[] = [
                    'filename' => $filename,
                    'url' => asset('storage/listings/' . $filename)
                ];
            }

            return response()->json([
                'message' => 'Zdjęcia zostały przesłane',
                'images' => $uploadedImages
            ]);
        } catch (\Exception $e) {
            \Log::error('Error uploading images: ' . $e->getMessage());

            return response()->json([
                'message' => 'Błąd podczas przesyłania zdjęć',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function deleteImage(Request $request, $listingId, $imageName)
    {
        try {
            $listing = Listing::findOrFail($listingId);

            if ($listing->user_id !== auth()->id()) {
                return response()->json([
                    'message' => 'Brak uprawnień'
                ], 403);
            }

            $currentImages = $listing->images ? json_decode($listing->images, true) : [];

            $currentImages = array_filter($currentImages, function ($img) use ($imageName) {
                return $img !== $imageName;
            });

            $filePath = storage_path('app/public/listings/' . $imageName);
            if (file_exists($filePath)) {
                unlink($filePath);
            }

            $listing->update(['images' => json_encode(array_values($currentImages))]);

            return response()->json([
                'message' => 'Zdjęcie zostało usunięte'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Błąd podczas usuwania zdjęcia',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function getImages($listingId)
    {
        try {
            $listing = Listing::findOrFail($listingId);

            if ($listing->user_id !== auth()->id()) {
                return response()->json([
                    'message' => 'Brak uprawnień'
                ], 403);
            }

            $images = $listing->images ? json_decode($listing->images, true) : [];

            $imageUrls = array_map(function ($filename) {
                return [
                    'filename' => $filename,
                    'url' => asset('storage/listings/' . $filename)
                ];
            }, $images);

            return response()->json([
                'images' => $imageUrls
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Błąd podczas pobierania zdjęć',
                'error' => $e->getMessage()
            ], 500);
        }
    }
    public function contractorIndex(Request $request): JsonResponse
    {
        try {
            $user = auth()->user();

            \Log::info('Contractor index - user:', [
                'id' => $user->id,
                'type' => class_basename($user),
                'table' => $user->getTable(),
                'name' => $user->name
            ]);

            // SPRAWDŹ CZY TO FIRMA Z TABELI COMPANIES
            $companyName = null;

            if ($user instanceof \App\Models\Company) {
                // Zalogowany jako firma - użyj nazwy firmy
                $companyName = $user->name;
                \Log::info('User is Company, using company name:', ['company_name' => $companyName]);
            } else {
                \Log::error('User is not a Company');
                return response()->json([
                    'success' => false,
                    'message' => 'Dostęp tylko dla firm'
                ], 400);
            }

            // Pobierz ogłoszenia dla tej firmy PO NAZWIE
            $query = Listing::where('company_name', $companyName)
                ->orderBy('created_at', 'desc');

            // Filtrowanie
            if ($request->has('status') && $request->status !== '') {
                $query->where('status', $request->status);
            }

            if ($request->has('search') && $request->search !== '') {
                $search = $request->search;
                $query->where(function ($q) use ($search) {
                    $q->where('title', 'like', "%{$search}%")
                        ->orWhere('description', 'like', "%{$search}%");
                });
            }

            $perPage = $request->get('per_page', 15);
            $listings = $query->paginate($perPage);

            \Log::info('Found listings for company:', [
                'company_name' => $companyName,
                'count' => $listings->total()
            ]);

            return response()->json([
                'success' => true,
                'data' => $listings
            ]);
        } catch (\Exception $e) {
            \Log::error('Error in contractor listings index:', [
                'error' => $e->getMessage(),
                'user_id' => auth()->id(),
                'user_type' => class_basename(auth()->user())
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Błąd podczas pobierania ogłoszeń',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function contractorStore(Request $request): JsonResponse
    {
        try {
            \Log::info('=== CONTRACTOR STORE DEBUG ===');
            \Log::info('Request data:', $request->all());

            if (!auth()->check()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Użytkownik nie jest zalogowany'
                ], 401);
            }

            $user = auth()->user();
            \Log::info('Authenticated user:', [
                'id' => $user->id,
                'type' => class_basename($user),
                'table' => $user->getTable(),
                'name' => $user->name ?? 'N/A'
            ]);

            // SPRAWDŹ CZY TO FIRMA
            if (!($user instanceof \App\Models\Company)) {
                \Log::error('User is not a Company');
                return response()->json([
                    'success' => false,
                    'message' => 'Dostęp tylko dla firm'
                ], 400);
            }

            $companyName = $user->name;
            \Log::info('User is Company:', ['company_name' => $companyName]);

            $validated = $request->validate([
                'title' => 'required|string|max:255',
                'description' => 'required|string|max:1000',
                'long_description' => 'nullable|string|max:5000',
                'price' => 'required|numeric|min:0',
                'category' => 'required|string|max:255',
                'subcategory' => 'required|string|max:255',
                'location' => 'required|string|max:255',
                'phone' => 'nullable|string|max:20',
                'email' => 'nullable|email|max:255',
                'status' => 'in:active,inactive,pending',
            ]);

            \Log::info('Validated data:', $validated);

            // USUŃ company_id - używamy tylko company_name
            $validated['user_id'] = $user->id;
            $validated['company_name'] = $companyName;
            $validated['published_at'] = now();
            $validated['status'] = $validated['status'] ?? 'active';
            $validated['featured'] = false;
            $validated['is_featured'] = false;
            $validated['clicks'] = 0;
            $validated['category_id'] = null;

            \Log::info('Final data to insert:', $validated);

            $listing = Listing::create($validated);

            \Log::info('Listing created successfully:', $listing->toArray());

            return response()->json([
                'success' => true,
                'message' => 'Ogłoszenie zostało utworzone',
                'data' => $listing
            ], 201);
        } catch (\Illuminate\Validation\ValidationException $e) {
            \Log::error('Validation error:', $e->errors());
            return response()->json([
                'success' => false,
                'message' => 'Błędy walidacji',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            \Log::error('=== ERROR IN CONTRACTOR STORE ===');
            \Log::error('Error: ' . $e->getMessage());
            \Log::error('File: ' . $e->getFile());
            \Log::error('Line: ' . $e->getLine());

            return response()->json([
                'success' => false,
                'message' => 'Błąd podczas tworzenia ogłoszenia',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function contractorUpdate(Request $request, $id): JsonResponse
    {
        try {
            $user = auth()->user();

            if (!($user instanceof \App\Models\Company)) {
                return response()->json([
                    'success' => false,
                    'message' => 'Dostęp tylko dla firm'
                ], 400);
            }

            // Znajdź ogłoszenie należące do tej firmy PO NAZWIE
            $listing = Listing::where('company_name', $user->name)->findOrFail($id);

            $validated = $request->validate([
                'title' => 'sometimes|required|string|max:255',
                'description' => 'sometimes|required|string|max:1000',
                'long_description' => 'nullable|string|max:5000',
                'price' => 'sometimes|required|numeric|min:0',
                'category' => 'sometimes|required|string|max:255',
                'subcategory' => 'sometimes|required|string|max:255',
                'location' => 'sometimes|required|string|max:255',
                'phone' => 'nullable|string|max:20',
                'email' => 'nullable|email|max:255',
                'status' => 'sometimes|in:active,inactive,pending',
            ]);

            $listing->update($validated);

            return response()->json([
                'success' => true,
                'message' => 'Ogłoszenie zostało zaktualizowane',
                'data' => $listing
            ]);
        } catch (\Exception $e) {
            \Log::error('Error updating contractor listing:', [
                'error' => $e->getMessage(),
                'user_id' => auth()->id(),
                'listing_id' => $id
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Błąd podczas aktualizacji ogłoszenia',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function contractorDestroy($id): JsonResponse
    {
        try {
            $user = auth()->user();

            if (!($user instanceof \App\Models\Company)) {
                return response()->json([
                    'success' => false,
                    'message' => 'Dostęp tylko dla firm'
                ], 400);
            }

            $listing = Listing::where('company_name', $user->name)->findOrFail($id);

            // Usuń zdjęcia z dysku
            if ($listing->images) {
                $images = json_decode($listing->images, true);
                foreach ($images as $image) {
                    $filePath = storage_path('app/public/listings/' . $image);
                    if (file_exists($filePath)) {
                        unlink($filePath);
                    }
                }
            }

            $listing->delete();

            return response()->json([
                'success' => true,
                'message' => 'Ogłoszenie zostało usunięte'
            ]);
        } catch (\Exception $e) {
            \Log::error('Error deleting contractor listing:', [
                'error' => $e->getMessage(),
                'user_id' => auth()->id(),
                'listing_id' => $id
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Błąd podczas usuwania ogłoszenia',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function toggleFavorite($id): JsonResponse
    {
        try {
            $user = auth()->user();
            $listing = Listing::findOrFail($id);

            $favoriteListings = $user->favorite_listings ?? [];

            if (is_string($favoriteListings)) {
                $favoriteListings = json_decode($favoriteListings, true) ?? [];
            }

            $listingId = (int)$id;

            if (in_array($listingId, $favoriteListings)) {
                $favoriteListings = array_filter($favoriteListings, function ($fav) use ($listingId) {
                    return $fav !== $listingId;
                });
                $isFavorited = false;
                $message = 'Usunięto z ulubionych!';
            } else {
                $favoriteListings[] = $listingId;
                $isFavorited = true;
                $message = 'Dodano do ulubionych!';
            }

            $user->update(['favorite_listings' => json_encode(array_values($favoriteListings))]);

            return response()->json([
                'success' => true,
                'is_favorited' => $isFavorited,
                'message' => $message
            ]);
        } catch (\Exception $e) {
            \Log::error('Error toggling favorite: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'Wystąpił błąd podczas dodawania do ulubionych'
            ], 500);
        }
    }



    public function contractorToggleStatus(Request $request, $id): JsonResponse
    {
        try {
            $user = auth()->user();

            if (!($user instanceof \App\Models\Company)) {
                return response()->json([
                    'success' => false,
                    'message' => 'Dostęp tylko dla firm'
                ], 400);
            }

            $listing = Listing::where('company_name', $user->name)->findOrFail($id);

            $validated = $request->validate([
                'status' => 'required|in:active,inactive,pending'
            ]);

            $listing->update(['status' => $validated['status']]);

            return response()->json([
                'success' => true,
                'message' => 'Status ogłoszenia został zmieniony',
                'data' => $listing
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Błąd podczas zmiany statusu',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function contractorToggleFeatured($id): JsonResponse
    {
        try {
            $user = auth()->user();

            if (!($user instanceof \App\Models\Company)) {
                return response()->json([
                    'success' => false,
                    'message' => 'Dostęp tylko dla firm'
                ], 400);
            }

            $listing = Listing::where('company_name', $user->name)->findOrFail($id);

            // Sprawdź limit wyróżnionych ogłoszeń dla firmy
            $featuredCount = Listing::where('company_name', $user->name)
                ->where('featured', true)
                ->count();

            if (!$listing->featured && $featuredCount >= 3) {
                return response()->json([
                    'success' => false,
                    'message' => 'Osiągnięto limit wyróżnionych ogłoszeń (3)'
                ], 400);
            }

            $listing->featured = !$listing->featured;
            $listing->is_featured = $listing->featured;
            $listing->save();

            return response()->json([
                'success' => true,
                'message' => $listing->featured ? 'Ogłoszenie zostało wyróżnione' : 'Usunięto wyróżnienie ogłoszenia',
                'data' => $listing
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Błąd podczas zmiany wyróżnienia',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
