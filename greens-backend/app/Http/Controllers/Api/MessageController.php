<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Message;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Validator;

class MessageController extends Controller
{
    /**
     * Wyświetl wszystkie wiadomości dla admina
     */
    public function adminIndex(Request $request)
    {
        $query = Message::with(['user', 'company', 'repliedBy']);

        // Sortowanie
        $sortBy = $request->get('sortBy', 'created_at');
        $sortOrder = $request->get('sortOrder', 'desc');
        $query->orderBy($sortBy, $sortOrder);

        // Filtrowanie po statusie
        if ($request->has('status') && $request->status !== '') {
            $query->where('status', $request->status);
        }

        // Wyszukiwanie
        if ($request->has('search') && $request->search !== '') {
            $query->search($request->search);
        }

        $messages = $query->paginate(20);

        return response()->json([
            'data' => $messages->items(),
            'total' => $messages->total(),
            'current_page' => $messages->currentPage(),
            'last_page' => $messages->lastPage(),
            'per_page' => $messages->perPage(),
        ]);
    }

    /**
     * Pokaż konkretną wiadomość
     */
    public function show($id)
    {
        $message = Message::with(['user', 'company', 'repliedBy'])->findOrFail($id);

        // Oznacz jako przeczytane
        if (!$message->is_read) {
            $message->update(['is_read' => true]);
        }

        return response()->json($message);
    }

    public function store(Request $request)
    {
        try {
            \Log::info('=== MESSAGE STORE DEBUG ===');
            \Log::info('Request data:', $request->all());
            \Log::info('Auth user:', auth()->check() ? auth()->user()->toArray() : 'Not logged in');

            // Sprawdź czy użytkownik jest zalogowany
            if (!auth()->check()) {
                return response()->json([
                    'message' => 'Musisz być zalogowany'
                ], 401);
            }

            // POPRAWKA: Upewnij się że listing_id jest zawsze wymagane dla komentarzy
            if ($request->has('listing_id') || $request->message_type === 'comment') {
                // To jest komentarz
                $rules = [
                    'listing_id' => 'required|integer|exists:listings,id',
                    'message' => 'required|string|max:1000',
                    'subject' => 'nullable|string|max:255', // Zmienione na nullable
                    'sender_name' => 'nullable|string|max:255', // Zmienione na nullable
                    'sender_email' => 'nullable|email|max:255', // Zmienione na nullable
                    'sender_phone' => 'nullable|string|max:20',
                    'message_type' => 'nullable|string',
                    'rating' => 'nullable|numeric|min:1|max:5',
                ];
            } else {
                // To jest zwykła wiadomość (stare reguły)
                $rules = [
                    'user_id' => 'required|exists:users,id',
                    'company_id' => 'required|exists:companies,id',
                    'sender_name' => 'required|string|max:255',
                    'sender_email' => 'required|email|max:255',
                    'sender_phone' => 'nullable|string|max:20',
                    'subject' => 'required|string|max:255',
                    'message' => 'required|string|max:2000',
                    'is_urgent' => 'boolean',
                ];
            }

            \Log::info('Using validation rules:', $rules);

            $validator = Validator::make($request->all(), $rules);

            if ($validator->fails()) {
                \Log::error('Validation failed:', $validator->errors()->toArray());
                return response()->json([
                    'message' => 'Błędy walidacji',
                    'errors' => $validator->errors()
                ], 422);
            }

            $data = $validator->validated();

            // POPRAWKA: Dodaj user_id i inne dane
            $user = auth()->user();
            $data['user_id'] = $user->id;
            $data['status'] = 'pending';
            $data['message_type'] = $data['message_type'] ?? 'comment';
            $data['is_urgent'] = false;
            $data['is_read'] = false;

            // POPRAWKA: Upewnij się że sender_name i sender_email są ustawione
            $data['sender_name'] = $data['sender_name'] ?? ($user->name ?? $user->company_name ?? 'Anonim');
            $data['sender_email'] = $data['sender_email'] ?? $user->email;
            $data['subject'] = $data['subject'] ?? 'Komentarz do ogłoszenia';

            // POPRAWKA: Pobierz dane o listing TYLKO jeśli listing_id istnieje
            if (isset($data['listing_id'])) {
                $listing = \App\Models\Listing::find($data['listing_id']);
                if ($listing) {
                    $data['company_name'] = $listing->company_name;
                    $data['company_id'] = $listing->company_id ?? null;
                } else {
                    \Log::error('Listing not found:', ['listing_id' => $data['listing_id']]);
                    return response()->json([
                        'message' => 'Ogłoszenie nie zostało znalezione'
                    ], 404);
                }
            } else {
                $data['company_id'] = $data['company_id'] ?? null;
            }

            \Log::info('Final data to save:', $data);

            $message = Message::create($data);

            \Log::info('Message created successfully:', $message->toArray());

            $responseMessage = ($data['message_type'] ?? 'inquiry') === 'comment'
                ? 'Komentarz został wysłany do moderacji'
                : 'Wiadomość została wysłana';

            return response()->json([
                'message' => $responseMessage,
                'data' => $message
            ], 201);
        } catch (\Exception $e) {
            \Log::error('=== ERROR IN MESSAGE STORE ===');
            \Log::error('Error: ' . $e->getMessage());
            \Log::error('File: ' . $e->getFile());
            \Log::error('Line: ' . $e->getLine());

            return response()->json([
                'message' => 'Błąd serwera: ' . $e->getMessage(),
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Odpowiedź admina na wiadomość
     */
    public function adminReply(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'message' => 'required|string|max:1000',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Błędy walidacji',
                'errors' => $validator->errors()
            ], 422);
        }

        $message = Message::findOrFail($id);

        // Zaktualizuj wiadomość
        $message->update([
            'status' => 'replied',
            'admin_reply' => $request->message,
            'replied_at' => now(),
            'replied_by' => auth()->id(),
            'is_read' => true,
        ]);

        // Tutaj można dodać wysyłanie emaila
        // Mail::to($message->sender_email)->send(new AdminReplyMail($message, $request->message));

        return response()->json([
            'message' => 'Odpowiedź została wysłana',
            'data' => $message->load(['user', 'company', 'repliedBy'])
        ]);
    }
    public function getComments($listingId)
    {
        \Log::info('Getting comments for listing: ' . $listingId);

        try {
            $listing = \App\Models\Listing::findOrFail($listingId);
            \Log::info('Listing found: ' . $listing->id);

            $allComments = Message::where('listing_id', $listingId)
                ->where('message_type', 'comment')
                ->get();
            \Log::info('All comments found: ' . $allComments->count());

            $approvedComments = Message::where('listing_id', $listingId)
                ->where('message_type', 'comment')
                ->where('status', 'approved')
                ->orderBy('created_at', 'desc')
                ->get();
            \Log::info('Approved comments found: ' . $approvedComments->count());

            foreach ($approvedComments as $comment) {
                \Log::info('Comment: ' . $comment->id . ' - ' . $comment->message . ' - Status: ' . $comment->status);
            }

            return response()->json([
                'data' => $approvedComments->map(function ($comment) {
                    return [
                        'id' => $comment->id,
                        'message' => $comment->message,
                        'sender_name' => $comment->sender_name,
                        'sender_email' => $comment->sender_email,
                        'rating' => $comment->rating,
                        'created_at' => $comment->created_at,
                        'admin_reply' => $comment->admin_reply,
                        'status' => $comment->status,
                    ];
                })
            ]);
        } catch (\Exception $e) {
            \Log::error('Error getting comments: ' . $e->getMessage());
            return response()->json([
                'message' => 'Error',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Zmiana statusu wiadomości
     */
    public function updateStatus(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'status' => 'required|in:pending,approved,rejected,replied,resolved,spam',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Nieprawidłowy status',
                'errors' => $validator->errors()
            ], 422);
        }

        $message = Message::findOrFail($id);
        $message->update([
            'status' => $request->status,
            'is_read' => true,
        ]);

        return response()->json([
            'message' => 'Status został zaktualizowany',
            'data' => $message->load(['user', 'company'])
        ]);
    }

    /**
     * Masowa aktualizacja statusów
     */
    public function bulkUpdate(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'message_ids' => 'required|array',
            'message_ids.*' => 'exists:messages,id',
            'status' => 'required|in:pending,approved,rejected,replied,resolved,spam',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Błędy walidacji',
                'errors' => $validator->errors()
            ], 422);
        }

        $updated = Message::whereIn('id', $request->message_ids)
            ->update([
                'status' => $request->status,
                'is_read' => true,
            ]);

        return response()->json([
            'message' => "Zaktualizowano {$updated} wiadomości",
            'updated_count' => $updated
        ]);
    }

    /**
     * Usuń wiadomość
     */
    public function destroy($id)
    {
        $message = Message::findOrFail($id);
        $message->delete();

        return response()->json([
            'message' => 'Wiadomość została usunięta'
        ]);
    }

    /**
     * Wiadomości dla contractor (użytkownika firmy)
     */
    public function contractorMessages(Request $request)
    {
        $user = auth()->user();

        // Sprawdź czy user ma przypisaną firmę
        if (!$user->company_id) {
            return response()->json([
                'message' => 'Brak przypisanej firmy'
            ], 403);
        }

        $query = Message::with(['user', 'company'])
            ->where('company_id', $user->company_id)
            ->orderBy('created_at', 'desc');

        // Filtrowanie i wyszukiwanie jak w adminIndex
        if ($request->has('status') && $request->status !== '') {
            $query->where('status', $request->status);
        }

        if ($request->has('search') && $request->search !== '') {
            $query->search($request->search);
        }

        $messages = $query->paginate(20);

        return response()->json([
            'data' => $messages->items(),
            'total' => $messages->total(),
            'current_page' => $messages->currentPage(),
            'last_page' => $messages->lastPage(),
        ]);
    }

    /**
     * Odpowiedź contractor na wiadomość
     */
    public function contractorReply(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'message' => 'required|string|max:1000',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Błędy walidacji',
                'errors' => $validator->errors()
            ], 422);
        }

        $message = Message::findOrFail($id);
        $user = auth()->user();

        // Sprawdź czy wiadomość należy do firmy usera
        if ($message->company_id !== $user->company_id) {
            return response()->json([
                'message' => 'Brak uprawnień'
            ], 403);
        }

        $message->update([
            'status' => 'replied',
            'admin_reply' => $request->message, // Można zmienić na contractor_reply
            'replied_at' => now(),
            'replied_by' => $user->id,
            'is_read' => true,
        ]);

        return response()->json([
            'message' => 'Odpowiedź została wysłana',
            'data' => $message->load(['user', 'company', 'repliedBy'])
        ]);
    }

    /**
     * Oznacz wiadomość jako przeczytaną
     */
    public function contractorMarkRead($id)
    {
        $message = Message::findOrFail($id);
        $user = auth()->user();

        if ($message->company_id !== $user->company_id) {
            return response()->json([
                'message' => 'Brak uprawnień'
            ], 403);
        }

        $message->update(['is_read' => true]);

        return response()->json([
            'message' => 'Oznaczono jako przeczytane'
        ]);
    }

    /**
     * Statystyki wiadomości
     */
    public function statistics()
    {
        $stats = [
            'total' => Message::count(),
            'pending' => Message::where('status', 'pending')->count(),
            'approved' => Message::where('status', 'approved')->count(),
            'rejected' => Message::where('status', 'rejected')->count(),
            'replied' => Message::where('status', 'replied')->count(),
            'unread' => Message::where('is_read', false)->count(),
            'urgent' => Message::where('is_urgent', true)->count(),
        ];

        return response()->json($stats);
    }
    public function storeComment(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'listing_id' => 'required|integer|exists:listings,id',
            'message' => 'required|string|max:1000',
            'rating' => 'nullable|numeric|min:1|max:5',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Błędy walidacji',
                'errors' => $validator->errors()
            ], 422);
        }

        $user = auth()->user();
        $listing = \App\Models\Listing::find($request->listing_id);

        $comment = Message::create([
            'user_id' => $user->id,
            'listing_id' => $request->listing_id,
            'company_id' => $listing->company_id ?? null,
            'sender_name' => $user->name ?? $user->company_name,
            'sender_email' => $user->email,
            'sender_phone' => $user->phone ?? '',
            'company_name' => $listing->company_name ?? '',
            'subject' => 'Komentarz do ogłoszenia',
            'message' => $request->message,
            'message_type' => 'comment',
            'rating' => $request->rating,
            'status' => 'pending',
            'is_urgent' => false,
            'is_read' => false,
        ]);

        return response()->json([
            'message' => 'Komentarz został wysłany do moderacji',
            'data' => $comment
        ], 201);
    }

    public function getApprovedComments($listingId)
    {
        try {
            \Log::info('Getting approved comments for listing:', ['listing_id' => $listingId]);

            $listing = \App\Models\Listing::findOrFail($listingId);

            $comments = Message::where('listing_id', $listingId)
                ->where('message_type', 'comment')
                ->where('status', 'approved')
                ->orderBy('created_at', 'desc')
                ->get();

            \Log::info('Found comments:', ['count' => $comments->count()]);

            return response()->json([
                'data' => $comments->map(function ($comment) {
                    return [
                        'id' => $comment->id,
                        'message' => $comment->message,
                        'sender_name' => $comment->sender_name,
                        'sender_email' => $comment->sender_email,
                        'rating' => $comment->rating,
                        'created_at' => $comment->created_at,
                        'admin_reply' => $comment->admin_reply,
                        'status' => $comment->status,
                    ];
                })
            ]);
        } catch (\Exception $e) {
            \Log::error('Error getting approved comments:', [
                'error' => $e->getMessage(),
                'listing_id' => $listingId
            ]);

            return response()->json([
                'message' => 'Błąd podczas pobierania komentarzy',
                'error' => $e->getMessage()
            ], 500);
        }
    }
    public function contractorReviews(Request $request)
    {
        try {
            $user = auth()->user();

            \Log::info('Contractor reviews - user:', [
                'id' => $user->id,
                'type' => class_basename($user),
                'name' => $user->name
            ]);

            if (!($user instanceof \App\Models\Company)) {
                return response()->json([
                    'success' => false,
                    'message' => 'Dostęp tylko dla firm'
                ], 400);
            }

            // Pobierz komentarze (reviews) dla tej firmy
            $query = Message::with(['user', 'listing'])
                ->where('company_name', $user->name)
                ->where('message_type', 'comment') // Tylko komentarze
                ->orderBy('created_at', 'desc');

            // Filtrowanie
            if ($request->has('status') && $request->status !== '') {
                $query->where('status', $request->status);
            }

            if ($request->has('rating') && $request->rating !== '') {
                $query->where('rating', $request->rating);
            }

            if ($request->has('search') && $request->search !== '') {
                $search = $request->search;
                $query->where(function ($q) use ($search) {
                    $q->where('message', 'like', "%{$search}%")
                        ->orWhere('sender_name', 'like', "%{$search}%");
                });
            }

            $perPage = $request->get('per_page', 15);
            $reviews = $query->paginate($perPage);

            \Log::info('Found reviews for company:', [
                'company_name' => $user->name,
                'count' => $reviews->total()
            ]);

            return response()->json([
                'success' => true,
                'data' => $reviews
            ]);
        } catch (\Exception $e) {
            \Log::error('Error fetching contractor reviews:', [
                'error' => $e->getMessage(),
                'user_id' => auth()->id(),
                'user_type' => class_basename(auth()->user())
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Błąd podczas pobierania opinii',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Statystyki reviews dla contractor
     */
    public function contractorReviewsStatistics(Request $request)
    {
        try {
            $user = auth()->user();

            if (!($user instanceof \App\Models\Company)) {
                return response()->json([
                    'success' => false,
                    'message' => 'Dostęp tylko dla firm'
                ], 400);
            }

            $reviews = Message::where('company_name', $user->name)
                ->where('message_type', 'comment')
                ->whereNotNull('rating')
                ->get();

            $totalReviews = $reviews->count();
            $averageRating = $totalReviews > 0 ? $reviews->avg('rating') : 0;

            $breakdown = [
                5 => $reviews->where('rating', 5)->count(),
                4 => $reviews->where('rating', 4)->count(),
                3 => $reviews->where('rating', 3)->count(),
                2 => $reviews->where('rating', 2)->count(),
                1 => $reviews->where('rating', 1)->count(),
            ];

            return response()->json([
                'success' => true,
                'data' => [
                    'average_rating' => round($averageRating, 1),
                    'total_reviews' => $totalReviews,
                    'rating_breakdown' => $breakdown
                ]
            ]);
        } catch (\Exception $e) {
            \Log::error('Error fetching review statistics:', [
                'error' => $e->getMessage(),
                'user_id' => auth()->id()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Błąd podczas pobierania statystyk',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function contractorReviewReply(Request $request, $id)
    {
        try {
            $user = auth()->user();

            if (!($user instanceof \App\Models\Company)) {
                return response()->json([
                    'success' => false,
                    'message' => 'Dostęp tylko dla firm'
                ], 400);
            }

            $review = Message::where('company_name', $user->name)
                ->where('message_type', 'comment')
                ->findOrFail($id);

            $validated = $request->validate([
                'message' => 'required|string|max:1000'
            ]);

            // NIE ustawiaj replied_by - pozostaw jako null
            // Dzięki temu frontend będzie wiedział że to kontrahent odpowiedział
            $review->update([
                'admin_reply' => $validated['message'],
                'replied_at' => now()
                // replied_by pozostaje null - to identyfikuje odpowiedź kontrahenta
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Odpowiedź została dodana',
                'data' => $review
            ]);
        } catch (\Exception $e) {
            \Log::error('Error adding reply:', [
                'error' => $e->getMessage(),
                'review_id' => $id
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Błąd podczas dodawania odpowiedzi',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function contractorReviewVisibility(Request $request, $id)
    {
        try {
            $user = auth()->user();

            if (!($user instanceof \App\Models\Company)) {
                return response()->json([
                    'success' => false,
                    'message' => 'Dostęp tylko dla firm'
                ], 400);
            }

            $review = Message::where('company_name', $user->name)
                ->where('message_type', 'comment')
                ->findOrFail($id);

            $validated = $request->validate([
                'status' => 'required|in:approved,hidden,pending'
            ]);

            $review->update([
                'status' => $validated['status']
            ]);

            $message = $validated['status'] === 'approved' ? 'Opinia została pokazana' : 'Opinia została ukryta';

            return response()->json([
                'success' => true,
                'message' => $message,
                'data' => $review
            ]);
        } catch (\Exception $e) {
            \Log::error('Error toggling visibility:', [
                'error' => $e->getMessage(),
                'review_id' => $id
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Błąd podczas zmiany widoczności',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
