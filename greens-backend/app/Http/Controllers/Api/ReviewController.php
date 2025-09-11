<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Review;
use App\Models\Company;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class ReviewController extends Controller
{
    public function adminIndex(Request $request): JsonResponse
    {
        $query = Review::with(['user', 'company']);

        // Sortowanie
        if ($request->has('sort_by') && $request->sort_by) {
            $sortBy = $request->get('sort_by', 'created_at');
            $sortOrder = $request->get('sort_order', 'desc');
            
            $allowedColumns = ['created_at', 'rating', 'order_date', 'is_hidden'];
            
            if (in_array($sortBy, $allowedColumns)) {
                $query->orderBy($sortBy, $sortOrder);
            } else {
                $query->orderBy('created_at', 'desc');
            }
        } else {
            $query->orderBy('created_at', 'desc');
        }

        // Filtrowanie po statusie (ukryty/widoczny)
        if ($request->has('status') && $request->status !== '') {
            if ($request->status === 'hidden') {
                $query->where('is_hidden', true);
            } elseif ($request->status === 'visible') {
                $query->where('is_hidden', false);
            }
        }

        // Filtrowanie po ocenie
        if ($request->has('rating') && $request->rating !== '') {
            $query->where('rating', $request->rating);
        }

        // Filtrowanie po firmie
        if ($request->has('company_id') && $request->company_id !== '') {
            $query->where('company_id', $request->company_id);
        }

        // Wyszukiwanie
        if ($request->has('search') && $request->search !== '') {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('comment', 'like', "%{$search}%")
                  ->orWhere('order_number', 'like', "%{$search}%")
                  ->orWhereHas('user', function($userQuery) use ($search) {
                      $userQuery->where('name', 'like', "%{$search}%");
                  })
                  ->orWhereHas('company', function($companyQuery) use ($search) {
                      $companyQuery->where('name', 'like', "%{$search}%");
                  });
            });
        }

        $perPage = $request->get('per_page', 15);
        $reviews = $query->paginate($perPage);

        return response()->json([
            'success' => true,
            'data' => $reviews
        ]);
    }

    public function index(Request $request): JsonResponse
    {
        $query = Review::with(['user', 'company'])->visible();

        if ($request->has('company_id')) {
            $query->where('company_id', $request->company_id);
        }

        if ($request->has('rating')) {
            $query->where('rating', $request->rating);
        }

        $sortBy = $request->get('sort_by', 'created_at');
        $sortOrder = $request->get('sort_order', 'desc');
        $query->orderBy($sortBy, $sortOrder);

        $perPage = $request->get('per_page', 10);
        $reviews = $query->paginate($perPage);

        return response()->json([
            'success' => true,
            'data' => $reviews
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
            'company_id' => 'required|exists:companies,id',
            'rating' => 'required|integer|min:1|max:5',
            'comment' => 'nullable|string|max:1000',
            'order_number' => 'nullable|string|max:255',
            'order_date' => 'nullable|date',
        ]);

        $review = Review::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Ocena została dodana',
            'data' => $review->load(['user', 'company'])
        ], 201);
    }

    public function update(Request $request, $id): JsonResponse
    {
        $review = Review::find($id);
        
        if (!$review) {
            return response()->json([
                'success' => false,
                'message' => 'Ocena nie została znaleziona'
            ], 404);
        }

        $validated = $request->validate([
            'rating' => 'sometimes|integer|min:1|max:5',
            'comment' => 'nullable|string|max:1000',
            'order_number' => 'nullable|string|max:255',
            'order_date' => 'nullable|date',
            'is_hidden' => 'sometimes|boolean',
            'admin_note' => 'nullable|string|max:500',
        ]);

        $review->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Ocena została zaktualizowana',
            'data' => $review->load(['user', 'company'])
        ]);
    }

    public function toggleVisibility($id): JsonResponse
    {
        $review = Review::find($id);
        
        if (!$review) {
            return response()->json([
                'success' => false,
                'message' => 'Ocena nie została znaleziona'
            ], 404);
        }

        $review->is_hidden = !$review->is_hidden;
        $review->save();

        return response()->json([
            'success' => true,
            'message' => $review->is_hidden ? 'Komentarz został ukryty' : 'Komentarz został przywrócony',
            'data' => $review->load(['user', 'company'])
        ]);
    }

    public function bulkUpdate(Request $request): JsonResponse
{
    $validated = $request->validate([
        'ids' => 'required|array',
        'ids.*' => 'exists:reviews,id',
        'action' => 'required|in:hide,show,delete',
        'admin_note' => 'nullable|string|max:500'
    ]);

    $reviews = Review::whereIn('id', $validated['ids']);
    $count = $reviews->count();

    if ($count === 0) {
        return response()->json([
            'success' => false,
            'message' => 'Nie znaleziono wybranych ocen'
        ], 404);
    }

    switch ($validated['action']) {
        case 'hide':
            $reviews->update([
                'is_hidden' => true,
                'admin_note' => $validated['admin_note'] ?? 'Ukryte przez administratora'
            ]);
            $message = "Ukryto {$count} komentarzy";
            break;
        
        case 'show':
            $reviews->update([
                'is_hidden' => false,
                'admin_note' => $validated['admin_note'] ?? 'Przywrócone przez administratora'
            ]);
            $message = "Przywrócono {$count} komentarzy";
            break;
        
        case 'delete':
            $reviews->delete();
            $message = "Usunięto {$count} komentarzy";
            break;
    }

    \Log::info("Bulk action wykonana", [
        'action' => $validated['action'],
        'ids' => $validated['ids'],
        'count' => $count,
    ]);

    return response()->json([
        'success' => true,
        'message' => $message,
        'count' => $count
    ]);
}

    public function destroy($id): JsonResponse
    {
        $review = Review::find($id);
        
        if (!$review) {
            return response()->json([
                'success' => false,
                'message' => 'Ocena nie została znaleziona'
            ], 404);
        }

        $review->delete();

        return response()->json([
            'success' => true,
            'message' => 'Ocena została usunięta'
        ]);
    }

    public function statistics(): JsonResponse
    {
        $stats = [
            'total' => Review::count(),
            'visible' => Review::where('is_hidden', false)->count(),
            'hidden' => Review::where('is_hidden', true)->count(),
            'average_rating' => Review::avg('rating'),
            'by_rating' => Review::selectRaw('rating, count(*) as count')
                ->groupBy('rating')
                ->orderBy('rating')
                ->get(),
            'recent' => Review::with(['user', 'company'])
                ->orderBy('created_at', 'desc')
                ->limit(5)
                ->get()
        ];

        return response()->json([
            'success' => true,
            'data' => $stats
        ]);
    }
}