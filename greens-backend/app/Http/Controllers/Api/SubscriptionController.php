<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Subscription;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class SubscriptionController extends Controller
{
    public function index(): JsonResponse
    {
        $subscriptions = Subscription::all();
        
        return response()->json([
            'success' => true,
            'data' => $subscriptions
        ]);
    }


    public function show($id): JsonResponse
    {
        $subscription = Subscription::find($id);
        
        if (!$subscription) {
            return response()->json([
                'success' => false,
                'message' => 'Subskrypcja nie została znaleziona'
            ], 404);
        }
        
        return response()->json([
            'success' => true,
            'data' => $subscription
        ]);
    }

    public function update(Request $request, $id): JsonResponse
    {
        $subscription = Subscription::find($id);
        
        if (!$subscription) {
            return response()->json([
                'success' => false,
                'message' => 'Subskrypcja nie została znaleziona'
            ], 404);
        }

        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'duration' => 'sometimes|required|string|max:255',
            'price' => 'sometimes|required|numeric|min:0'
        ]);

        $subscription->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Subskrypcja została zaktualizowana',
            'data' => $subscription
        ]);
    }

    public function bulkUpdate(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'subscriptions' => 'required|array',
            'subscriptions.*.id' => 'required|exists:subscriptions,id',
            'subscriptions.*.name' => 'sometimes|required|string|max:255',
            'subscriptions.*.duration' => 'sometimes|required|string|max:255',
            'subscriptions.*.price' => 'sometimes|required|numeric|min:0'
        ]);

        $updatedSubscriptions = [];

        foreach ($validated['subscriptions'] as $subscriptionData) {
            $subscription = Subscription::find($subscriptionData['id']);
            
            if ($subscription) {
                $subscription->update(array_filter($subscriptionData, function($key) {
                    return $key !== 'id';
                }, ARRAY_FILTER_USE_KEY));
                
                $updatedSubscriptions[] = $subscription;
            }
        }

        return response()->json([
            'success' => true,
            'message' => 'Subskrypcje zostały zaktualizowane',
            'data' => $updatedSubscriptions
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:subscriptions,name',
            'duration' => 'required|string|max:255',
            'price' => 'required|numeric|min:0'
        ]);

        $subscription = Subscription::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Subskrypcja została utworzona',
            'data' => $subscription
        ], 201);
    }


    public function destroy($id): JsonResponse
    {
        $subscription = Subscription::find($id);
        
        if (!$subscription) {
            return response()->json([
                'success' => false,
                'message' => 'Subskrypcja nie została znaleziona'
            ], 404);
        }

        $subscription->delete();

        return response()->json([
            'success' => true,
            'message' => 'Subskrypcja została usunięta'
        ]);
    }
}