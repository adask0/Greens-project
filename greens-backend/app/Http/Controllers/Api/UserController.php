<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;

class UserController extends Controller
{
    /**
     * Get user profile
     */
    public function profile(Request $request): JsonResponse
    {
        $user = $request->user()->load(['specializations', 'ratings', 'listings']);
        return response()->json([
            'user' => $user
        ]);
    }


    public function contractorProfile(Request $request): JsonResponse
    {
        $user = $request->user();

        if ($user->user_type !== 'contractor') {
            return response()->json(['message' => 'Access denied. Contractor privileges required.'], 403);
        }

        try {
            // Dodatkowe statystyki dla kontrahentów - używaj twoich relacji
            $stats = [
                'total_listings' => $user->listings()->count(),
                'active_listings' => $user->listings()->where('status', 'active')->count(), // zmienione z is_active
                'total_reviews' => $user->reviews()->count(),
                'average_rating' => $user->ratings()->avg('rating') ?? 0,
            ];

            return response()->json([
                // Wszystkie dane z tabeli users
                'name' => $user->name,
                'email' => $user->email,
                'phone' => $user->phone,
                'city' => $user->city,
                'address' => $user->address,
                'about' => $user->about,
                'avatar' => $user->avatar_url, // używaj accessor z modelu
                'nip' => $user->nip,
                'website' => $user->website,
                'company_description' => $user->company_description,
                'company_name' => $user->company_name,
                'user_type' => $user->user_type,
                'is_admin' => $user->is_admin,

                // Subscription info
                'subscription_type' => $user->subscription_type ?? 'STANDARD',
                'subscription_expires_at' => $user->subscription_expires_at,

                // Pola których nie ma w tabeli users - domyślne wartości
                'subscription' => null,
                'subscription_end_date' => null,
                'status' => 'dostępny',
                'is_active' => true,

                // Specializations z JSON column
                'specializations' => $user->specializations ?? [],

                // Ustawienia powiadomień
                'email_new_messages' => $user->email_new_messages ?? true,
                'email_new_reviews' => $user->email_new_reviews ?? true,
                'email_listing_updates' => $user->email_listing_updates ?? false,
                'email_promotional' => $user->email_promotional ?? false,
                'sms_new_messages' => $user->sms_new_messages ?? true,
                'sms_urgent_notifications' => $user->sms_urgent_notifications ?? true,
                'push_new_messages' => $user->push_new_messages ?? true,
                'push_new_reviews' => $user->push_new_reviews ?? true,

                // Ustawienia prywatności
                'profile_visibility' => $user->profile_visibility ?? 'public',
                'show_phone' => $user->show_phone ?? true,
                'show_email' => $user->show_email ?? false,
                'allow_reviews' => $user->allow_reviews ?? true,
                'allow_messages' => $user->allow_messages ?? true,
                'search_engine_indexing' => $user->search_engine_indexing ?? true,

                // Statystyki
                'statistics' => $stats
            ]);
        } catch (\Exception $e) {
            \Log::error('Profile fetch error: ' . $e->getMessage());
            return response()->json(['error' => 'Server error: ' . $e->getMessage()], 500);
        }
    }

    /**
     * Update contractor profile (rozszerzona walidacja)
     */
    public function updateContractorProfile(Request $request): JsonResponse
    {
        $user = $request->user();

        // Sprawdź czy user jest kontrachentem
        if ($user->user_type !== 'contractor') {
            return response()->json(['message' => 'Access denied. Contractor privileges required.'], 403);
        }

        $validated = $request->validate([
            // Dane osobowe
            'name' => 'required|string|max:255',
            'phone' => 'required|string|max:20',
            'city' => 'required|string|max:100',
            'address' => 'nullable|string|max:255',
            'description' => 'nullable|string|max:1000',

            // Dane firmowe
            'company_name' => 'nullable|string|max:255',
            'company_description' => 'nullable|string|max:1000',
            'nip' => 'nullable|string|max:20',
            'website' => 'nullable|url|max:255',

            // Specjalizacje
            'specializations' => 'nullable|array',
            'specializations.*' => 'string|max:100'
        ]);

        $user->update($validated);

        // Update specializations
        if (isset($validated['specializations'])) {
            $user->specializations()->delete();
            foreach ($validated['specializations'] as $specialization) {
                $user->specializations()->create(['specialization' => $specialization]);
            }
        }

        return response()->json([
            'user' => $user->load(['specializations']),
            'message' => 'Contractor profile updated successfully'
        ]);
    }

    /**
     * Upload avatar
     */
    public function uploadAvatar(Request $request): JsonResponse
    {
        $request->validate([
            'avatar' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048'
        ]);

        $user = $request->user();

        // Delete old avatar
        if ($user->avatar) {
            Storage::disk('public')->delete($user->avatar);
        }

        $avatarPath = $request->file('avatar')->store('avatars', 'public');

        $user->update(['avatar' => $avatarPath]);

        return response()->json([
            'avatar_url' => asset('storage/' . $avatarPath),
            'message' => 'Avatar uploaded successfully'
        ]);
    }

    /**
     * Get notification settings
     */
    public function getNotificationSettings(Request $request): JsonResponse
    {
        $user = $request->user();

        return response()->json([
            'email_new_messages' => $user->email_new_messages ?? true,
            'email_new_reviews' => $user->email_new_reviews ?? true,
            'email_listing_updates' => $user->email_listing_updates ?? false,
            'email_promotional' => $user->email_promotional ?? false,
            'sms_new_messages' => $user->sms_new_messages ?? true,
            'sms_urgent_notifications' => $user->sms_urgent_notifications ?? true,
            'push_new_messages' => $user->push_new_messages ?? true,
            'push_new_reviews' => $user->push_new_reviews ?? true,
        ]);
    }

    /**
     * Update notification settings
     */
    public function updateNotificationSettings(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'email_new_messages' => 'boolean',
            'email_new_reviews' => 'boolean',
            'email_listing_updates' => 'boolean',
            'email_promotional' => 'boolean',
            'sms_new_messages' => 'boolean',
            'sms_urgent_notifications' => 'boolean',
            'push_new_messages' => 'boolean',
            'push_new_reviews' => 'boolean',
        ]);

        $request->user()->update($validated);

        return response()->json([
            'message' => 'Notification settings updated successfully'
        ]);
    }

    /**
     * Get privacy settings
     */
    public function getPrivacySettings(Request $request): JsonResponse
    {
        $user = $request->user();

        return response()->json([
            'profile_visibility' => $user->profile_visibility ?? 'public',
            'show_phone' => $user->show_phone ?? true,
            'show_email' => $user->show_email ?? false,
            'allow_reviews' => $user->allow_reviews ?? true,
            'allow_messages' => $user->allow_messages ?? true,
            'search_engine_indexing' => $user->search_engine_indexing ?? true,
        ]);
    }

    /**
     * Update privacy settings
     */
    public function updatePrivacySettings(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'profile_visibility' => 'in:public,registered_only,private',
            'show_phone' => 'boolean',
            'show_email' => 'boolean',
            'allow_reviews' => 'boolean',
            'allow_messages' => 'boolean',
            'search_engine_indexing' => 'boolean',
        ]);

        $request->user()->update($validated);

        return response()->json([
            'message' => 'Privacy settings updated successfully'
        ]);
    }

    /**
     * Update user profile (standardowa metoda)
     */
    public function updateProfile(Request $request): JsonResponse
    {
        $user = $request->user();
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'phone' => 'required|string|max:20',
            'address' => 'nullable|string|max:255',
            'city' => 'nullable|string|max:100',
            'nip' => 'nullable|string|max:20',
            'about' => 'nullable|string|max:1000',
            'avatar' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'specializations' => 'nullable|array',
            'specializations.*' => 'string|max:100'
        ]);

        // Handle avatar upload
        if ($request->hasFile('avatar')) {
            // Delete old avatar
            if ($user->avatar) {
                Storage::disk('public')->delete($user->avatar);
            }

            $validated['avatar'] = $request->file('avatar')->store('avatars', 'public');
        }

        $user->update($validated);

        // Update specializations
        if (isset($validated['specializations'])) {
            $user->specializations()->delete();
            foreach ($validated['specializations'] as $specialization) {
                $user->specializations()->create(['specialization' => $specialization]);
            }
        }

        return response()->json([
            'user' => $user->load(['specializations']),
            'message' => 'Profile updated successfully'
        ]);
    }

    /**
     * Change password
     */
    public function changePassword(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'current_password' => 'required',
            'new_password' => 'required|string|min:8|confirmed'
        ]);

        if (!Hash::check($validated['current_password'], $request->user()->password)) {
            return response()->json([
                'message' => 'Current password is incorrect'
            ], 422);
        }

        $request->user()->update([
            'password' => Hash::make($validated['new_password'])
        ]);

        return response()->json([
            'message' => 'Password changed successfully'
        ]);
    }

    public function show(string $id): JsonResponse
    {
        $user = User::with(['specializations', 'ratings.user', 'listings.images'])
            ->findOrFail($id);

        return response()->json([
            'user' => $user
        ]);
    }
    public function getFavorites(Request $request): JsonResponse
    {
        try {
            $user = $request->user();
            $favoriteListings = $user->favorite_listings ?? [];

            if (is_string($favoriteListings)) {
                $favoriteListings = json_decode($favoriteListings, true) ?? [];
            }

            return response()->json([
                'success' => true,
                'favorites' => $favoriteListings
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'favorites' => []
            ], 500);
        }
    }
}
