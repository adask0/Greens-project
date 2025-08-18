<?php

namespace App\Models;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'phone',
        'address',
        'city',
        'nip',
        'about',
        'avatar',
        'is_admin',
        'user_type',
        'company_name',
        'company_description',
        'website',
        'specializations',
        'email_new_messages',
        'email_new_reviews',
        'email_listing_updates',
        'email_promotional',
        'sms_new_messages',
        'sms_urgent_notifications',
        'push_new_messages',
        'push_new_reviews',
        'profile_visibility',
        'show_phone',
        'show_email',
        'allow_reviews',
        'allow_messages',
        'search_engine_indexing',
        'subscription_type',
        'subscription_expires_at',
        'favorite_listings',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
        'is_admin' => 'boolean',
        'specializations' => 'array',
        'email_new_messages' => 'boolean',
        'email_new_reviews' => 'boolean',
        'email_listing_updates' => 'boolean',
        'email_promotional' => 'boolean',
        'sms_new_messages' => 'boolean',
        'sms_urgent_notifications' => 'boolean',
        'push_new_messages' => 'boolean',
        'push_new_reviews' => 'boolean',
        'show_phone' => 'boolean',
        'show_email' => 'boolean',
        'allow_reviews' => 'boolean',
        'allow_messages' => 'boolean',
        'search_engine_indexing' => 'boolean',
        'is_active' => 'boolean',
        'favorite_listings' => 'array',

    ];

    /**
     * The accessors to append to the model's array form.
     *
     * @var array
     */
    protected $appends = ['rating'];

    /**
     * Check if user is admin
     */
    public function isAdmin(): bool
    {
        return $this->is_admin === true;
    }

    /**
     * Get the listings for the user.
     */
    public function listings(): HasMany
    {
        return $this->hasMany(Listing::class);
    }

    /**
     * Get the ratings received by the user.
     */
    public function ratings(): HasMany
    {
        return $this->hasMany(Rating::class, 'rated_user_id');
    }

    /**
     * Get the ratings given by the user.
     */
    public function givenRatings(): HasMany
    {
        return $this->hasMany(Rating::class, 'user_id');
    }

    /**
     * Get the specializations for the user.
     */
    // public function specializations(): HasMany
    // {
    //     return $this->hasMany(UserSpecialization::class);
    // }

    /**
     * Get the user's average rating.
     */
    public function getRatingAttribute(): float
    {
        return round($this->ratings()->avg('rating') ?? 0, 1);
    }

    /**
     * Get the user's avatar URL.
     */
    public function getAvatarUrlAttribute(): ?string
    {
        return $this->avatar ? asset('storage/' . $this->avatar) : null;
    }

    public function reviews()
    {
        return $this->hasMany(Review::class);
    }

    public function reviewsGiven()
    {
        return $this->hasMany(Review::class, 'user_id');
    }
    public function messages()
    {
        return $this->hasMany(Message::class);
    }

    public function sentMessages()
    {
        return $this->hasMany(Message::class, 'replied_by');
    }
}
