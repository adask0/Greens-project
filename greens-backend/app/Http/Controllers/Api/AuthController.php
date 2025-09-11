<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Company;
use App\Models\PasswordResetToken;
use App\Mail\PasswordResetMail;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
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
            'city' => 'required|string|max:100', // DODANE POLE MIASTO
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
            'city' => $request->city, // DODANE POLE MIASTO
            'nip' => $request->nip,
            'status' => $request->status ?? 'dostępny',
            'subscription' => $request->subscription ?? '1 mies.',
            'subscription_end_date' => $request->subscription_end_date ?? Carbon::now()->addMonth(),
            'is_active' => $request->is_active ?? true,
            'user_type' => 'contractor',
            // avatar będzie dodane przez osobny endpoint po rejestracji
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

        $email = $request->email;

        // Sprawdź czy email istnieje w tabeli users lub companies
        $user = User::where('email', $email)->first();
        $company = Company::where('email', $email)->first();

        if (!$user && !$company) {
            return response()->json([
                'message' => 'Nie znaleziono konta z tym adresem e-mail'
            ], 404);
        }

        // Usuń stare tokeny dla tego e-maila
        PasswordResetToken::where('email', $email)->delete();

        // Wygeneruj nowy token
        $token = Str::random(64);

        // Zapisz token w bazie danych
        PasswordResetToken::create([
            'email' => $email,
            'token' => $token,
            'created_at' => Carbon::now()
        ]);

        // Wyślij e-mail z linkiem resetującym
        try {
            Mail::to($email)->send(new PasswordResetMail($token, $email));

            return response()->json([
                'message' => 'Instrukcje resetowania hasła zostały wysłane na Twój adres e-mail.'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Wystąpił błąd podczas wysyłania e-maila. Spróbuj ponownie.'
            ], 500);
        }
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

        // Sprawdź czy token istnieje i jest ważny (nie starszy niż 60 minut)
        $passwordReset = PasswordResetToken::where([
            'email' => $request->email,
            'token' => $request->token
        ])->where('created_at', '>', Carbon::now()->subMinutes(60))->first();

        if (!$passwordReset) {
            return response()->json([
                'message' => 'Token jest nieprawidłowy lub wygasł'
            ], 400);
        }

        // Znajdź użytkownika lub firmę
        $user = User::where('email', $request->email)->first();
        $company = Company::where('email', $request->email)->first();

        if ($user) {
            // Zaktualizuj hasło użytkownika
            $user->update([
                'password' => Hash::make($request->password)
            ]);
        } elseif ($company) {
            // Zaktualizuj hasło firmy
            $company->update([
                'password' => Hash::make($request->password)
            ]);
        } else {
            return response()->json([
                'message' => 'Nie znaleziono konta z tym adresem e-mail'
            ], 404);
        }

        // Usuń token po użyciu
        $passwordReset->delete();

        return response()->json([
            'message' => 'Hasło zostało pomyślnie zresetowane'
        ]);
    }

    public function showResetForm(Request $request, $token)
    {
        $email = $request->query('email');

        if (!$email) {
            return response()->json([
                'message' => 'Nieprawidłowy link resetowania hasła'
            ], 400);
        }

        // Sprawdź czy token jest ważny
        $passwordReset = PasswordResetToken::where([
            'email' => $email,
            'token' => $token
        ])->where('created_at', '>', Carbon::now()->subMinutes(60))->first();

        if (!$passwordReset) {
            return response()->json([
                'message' => 'Link resetowania hasła jest nieprawidłowy lub wygasł'
            ], 400);
        }

        return response()->json([
            'message' => 'Token jest ważny',
            'token' => $token,
            'email' => $email
        ]);
    }
}
