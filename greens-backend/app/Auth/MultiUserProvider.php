<?php

namespace App\Auth;

use Illuminate\Auth\EloquentUserProvider;
use Illuminate\Contracts\Auth\Authenticatable;
use App\Models\User;
use App\Models\Company;

class MultiUserProvider extends EloquentUserProvider
{
    /**
     * Retrieve a user by their unique identifier.
     */
    public function retrieveById($identifier): ?Authenticatable
    {
        // Sprawdź najpierw w tabeli users
        $user = User::find($identifier);
        if ($user) {
            return $user;
        }

        // Jeśli nie znaleziono, sprawdź w companies
        return Company::find($identifier);
    }

    /**
     * Retrieve a user by the given credentials.
     */
    public function retrieveByCredentials(array $credentials): ?Authenticatable
    {
        if (empty($credentials) || 
            (count($credentials) === 1 && array_key_exists('password', $credentials))) {
            return null;
        }

        // Usuń hasło z credentials dla wyszukiwania
        $query = $credentials;
        unset($query['password']);

        // Sprawdź najpierw w users
        $user = User::where($query)->first();
        if ($user) {
            return $user;
        }

        // Sprawdź w companies
        return Company::where($query)->first();
    }

    /**
     * Validate a user against the given credentials.
     */
    public function validateCredentials(Authenticatable $user, array $credentials): bool
    {
        return $this->hasher->check($credentials['password'], $user->getAuthPassword());
    }

    /**
     * Retrieve a user by their unique identifier and "remember me" token.
     */
    public function retrieveByToken($identifier, $token): ?Authenticatable
    {
        // Sprawdź w users
        $user = User::where($this->getModel()->getKeyName(), $identifier)
            ->where($this->getModel()->getRememberTokenName(), $token)
            ->first();
            
        if ($user) {
            return $user;
        }

        // Sprawdź w companies
        return Company::where('id', $identifier)
            ->where('remember_token', $token)
            ->first();
    }

    /**
     * Update the "remember me" token for the given user in storage.
     */
    public function updateRememberToken(Authenticatable $user, $token): void
    {
        $user->setRememberToken($token);
        $user->save();
    }
}