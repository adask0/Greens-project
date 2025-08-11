<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Rating;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class RatingController extends Controller
{
    /**
     * Store a newly created rating.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'rated_user_id' => 'required|exists:users,id',
            'rating' => 'required|integer|min:1|max:5',
            'comment' => 'nullable|string|max:500'
        ]);

        // Check if user already rated this user
        $existingRating = Rating::where('user_id', auth()->id())
            ->where('rated_user_id', $validated['rated_user_id'])
            ->first();

        if ($existingRating) {
            return response()->json([
                'message' => 'You have already rated this user'
            ], 422);
        }

        // Prevent self-rating
        if (auth()->id() == $validated['rated_user_id']) {
            return response()->json([
                'message' => 'You cannot rate yourself'
            ], 422);
        }

        $validated['user_id'] = auth()->id();
        $rating = Rating::create($validated);

        return response()->json([
            'rating' => $rating->load(['user']),
            'message' => 'Rating submitted successfully'
        ], 201);
    }

    /**
     * Get ratings for a user
     */
    public function index(Request $request, string $userId): JsonResponse
    {
        $ratings = Rating::with(['user'])
            ->where('rated_user_id', $userId)
            ->latest()
            ->paginate(10);

        return response()->json($ratings);
    }
}