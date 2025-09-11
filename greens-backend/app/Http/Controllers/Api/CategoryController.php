<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class CategoryController extends Controller
{
    /**
     * Display a listing of categories.
     */
    public function index(): JsonResponse
    {
        $categories = Category::withCount('listings')->get();

        return response()->json($categories);
    }

    /**
     * Display the specified category with its listings.
     */
    public function show(string $id): JsonResponse
    {
        $category = Category::with(['listings.user', 'listings.images'])
            ->findOrFail($id);

        return response()->json($category);
    }
}