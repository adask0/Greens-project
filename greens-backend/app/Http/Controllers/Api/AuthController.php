<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Company;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\ValidationException;
use Carbon\Carbon;

class AuthController extends Controller
{

    public function register(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8|confirmed',
            'phone' => 'nullable|string|max:20',
            'city' => 'nullable|string|max:100',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'phone' => $request->phone,
            'city' => $request->city,
            'user_type' => 'client',
        ]);

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'user' => $user,
            'token' => $token,
            'message' => 'User registered successfully'
        ], 201);
    }


    public function registerCompany(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:companies',
            'password' => 'required|string|min:8|confirmed',
            'phone' => 'required|string|max:20',
            'address' => 'required|string|max:255',
            'nip' => 'nullable|string|max:20|unique:companies',
            'status' => 'in:dostępny,niedostępny,zawieszony',
            'subscription' => 'nullable|string|max:50',
            'subscription_end_date' => 'nullable|date',
            'is_active' => 'boolean'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        $company = Company::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'phone' => $request->phone,
            'address' => $request->address,
            'nip' => $request->nip,
            'status' => $request->status ?? 'dostępny',
            'subscription' => $request->subscription ?? '1 mies.',
            'subscription_end_date' => $request->subscription_end_date ?? Carbon::now()->addMonth(),
            'is_active' => $request->is_active ?? true,
            'user_type' => 'contractor',
        ]);

        $token = $company->createToken('auth_token')->plainTextToken;

        return response()->json([
            'company' => $company,
            'token' => $token,
            'message' => 'Company registered successfully'
        ], 201);
    }


public function login(Request $request): JsonResponse
{
    $validator = Validator::make($request->all(), [
        'email' => 'required|email',
        'password' => 'required',
    ]);

    if ($validator->fails()) {
        return response()->json([
            'message' => 'Validation failed',
            'errors' => $validator->errors()
        ], 422);
    }

    $user = User::where('email', $request->email)->first();

    if ($user && Hash::check($request->password, $user->password)) {
        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'user' => $user,
            'token' => $token,
            'type' => 'user',
            'message' => 'User login successful'
        ]);
    }

    $company = Company::where('email', $request->email)->first();

    if ($company && Hash::check($request->password, $company->password)) {
        $token = $company->createToken('auth_token')->plainTextToken;

        return response()->json([
            'user' => $company,
            'token' => $token,
            'type' => 'company',
            'message' => 'Company login successful'
        ]);
    }

    return response()->json([
        'message' => 'Invalid credentials'
    ], 401);
}

    public function logout(Request $request): JsonResponse
    {
        $authUser = $request->user();
        
        if ($authUser) {
            $authUser->currentAccessToken()->delete();
        }

        return response()->json([
            'message' => 'Logged out successfully'
        ]);
    }

    public function me(Request $request): JsonResponse
    {
        $authUser = $request->user();
        
        if ($authUser instanceof Company) {
            return response()->json([
                'user' => $authUser,
                'user_type' => 'contractor'
            ]);
        }

        return response()->json([
            'user' => $authUser,
            'user_type' => 'user'
        ]);
    }

    public function forgotPassword(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        return response()->json([
            'message' => 'Password reset link sent to your email'
        ]);
    }


    public function resetPassword(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'token' => 'required',
            'email' => 'required|email',
            'password' => 'required|string|min:8|confirmed',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }


        return response()->json([
            'message' => 'Password reset successfully'
        ]);
    }
}