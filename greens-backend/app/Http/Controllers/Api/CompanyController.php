<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Company;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class CompanyController extends Controller
{
 public function index(Request $request): JsonResponse
    {
        $query = Company::query();

        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        if ($request->has('is_active')) {
            $query->where('is_active', $request->boolean('is_active'));
        }

        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%")
                  ->orWhere('nip', 'like', "%{$search}%")
                  ->orWhere('address', 'like', "%{$search}%");
            });
        }

        $sortBy = $request->get('sort_by', 'created_at');
        $sortOrder = $request->get('sort_order', 'desc');
        $query->orderBy($sortBy, $sortOrder);

        $perPage = $request->get('per_page', 20);
        $companies = $query->paginate($perPage);

        return response()->json([
            'success' => true,
            'data' => $companies
        ]);
    }

    public function all(): JsonResponse
    {
        $companies = Company::all();
        
        return response()->json([
            'success' => true,
            'data' => $companies
        ]);
    }

    public function show($id): JsonResponse
    {
        $company = Company::with(['user', 'listings'])->find($id);
        
        if (!$company) {
            return response()->json([
                'success' => false,
                'message' => 'Firma nie została znaleziona'
            ], 404);
        }
        
        return response()->json([
            'success' => true,
            'data' => $company
        ]);
    }


    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'address' => 'nullable|string|max:255',
            'status' => 'in:dostępny,niedostępny,zawieszony',
            'email' => 'required|email|unique:companies,email',
            'phone' => 'nullable|string|max:20',
            'subscription' => 'nullable|string|max:50',
            'subscription_end_date' => 'nullable|date',
            'nip' => 'nullable|string|max:20|unique:companies,nip',
            'user_id' => 'nullable|exists:users,id',
            'is_active' => 'boolean'
        ]);

        $company = Company::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Firma została utworzona',
            'data' => $company
        ], 201);
    }

    public function update(Request $request, $id): JsonResponse
    {
        $company = Company::find($id);
        
        if (!$company) {
            return response()->json([
                'success' => false,
                'message' => 'Firma nie została znaleziona'
            ], 404);
        }

        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'address' => 'nullable|string|max:255',
            'status' => 'sometimes|in:dostępny,niedostępny,zawieszony',
            'email' => 'sometimes|required|email|unique:companies,email,' . $id,
            'phone' => 'nullable|string|max:20',
            'subscription' => 'nullable|string|max:50',
            'subscription_end_date' => 'nullable|date',
            'nip' => 'nullable|string|max:20|unique:companies,nip,' . $id,
            'is_active' => 'sometimes|boolean'
        ]);

        $company->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Firma została zaktualizowana',
            'data' => $company
        ]);
    }


    public function bulkUpdate(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'companies' => 'required|array',
            'companies.*.id' => 'required|exists:companies,id',
            'companies.*.name' => 'sometimes|required|string|max:255',
            'companies.*.address' => 'nullable|string|max:255',
            'companies.*.status' => 'sometimes|in:dostępny,niedostępny,zawieszony',
            'companies.*.email' => 'sometimes|required|email',
            'companies.*.phone' => 'nullable|string|max:20',
            'companies.*.subscription' => 'nullable|string|max:50',
            'companies.*.nip' => 'nullable|string|max:20'
        ]);

        $updatedCompanies = [];

        foreach ($validated['companies'] as $companyData) {
            $company = Company::find($companyData['id']);
            
            if ($company) {
                $updateData = array_filter($companyData, function($key) {
                    return $key !== 'id';
                }, ARRAY_FILTER_USE_KEY);
                
                $company->update($updateData);
                $updatedCompanies[] = $company;
            }
        }

        return response()->json([
            'success' => true,
            'message' => 'Firmy zostały zaktualizowane',
            'data' => $updatedCompanies
        ]);
    }

    public function destroy($id): JsonResponse
    {
        $company = Company::find($id);
        
        if (!$company) {
            return response()->json([
                'success' => false,
                'message' => 'Firma nie została znaleziona'
            ], 404);
        }

        $company->delete();

        return response()->json([
            'success' => true,
            'message' => 'Firma została usunięta'
        ]);
    }


    public function changeStatus(Request $request, $id): JsonResponse
    {
        $company = Company::find($id);
        
        if (!$company) {
            return response()->json([
                'success' => false,
                'message' => 'Firma nie została znaleziona'
            ], 404);
        }

        $validated = $request->validate([
            'status' => 'required|in:dostępny,niedostępny,zawieszony'
        ]);

        $company->status = $validated['status'];
        $company->save();

        return response()->json([
            'success' => true,
            'message' => 'Status firmy został zmieniony',
            'data' => $company
        ]);
    }
}