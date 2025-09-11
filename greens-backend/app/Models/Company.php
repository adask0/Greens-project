<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Foundation\Auth\User as Authenticatable;

class Company extends Authenticatable
{
    use HasFactory, HasApiTokens;

    protected $fillable = [
        'name',
        'address',
        'status',
        'email',
        'password',
        'phone',
        'subscription',
        'subscription_end_date',
        'nip',
        'user_id',
        'is_active',
        'user_type',
        'city',
        'about',
        'avatar',
        'website',
        'company_description',
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
        'subscription_expires_at'
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'subscription_end_date' => 'datetime',
        'subscription_expires_at' => 'datetime',
        'is_active' => 'boolean',
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
        'password' => 'hashed',
    ];

    protected $appends = ['rating', 'avatar_url']; // Dodane avatar_url

    /**
     * Check if company is admin
     */
    public function isAdmin(): bool
    {
        return false;
    }

    /**
     * Check if company is contractor
     */
    public function isContractor(): bool
    {
        return true;
    }

    // Relacje
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function listings()
    {
        return $this->hasMany(Listing::class);
    }

    public function messages()
    {
        return $this->hasMany(Message::class);
    }

    public function ratings()
    {
        return $this->hasMany(Rating::class, 'company_id');
    }

    public function reviews()
    {
        return $this->hasMany(Review::class, 'company_id');
    }

    /**
     * Get the company's average rating.
     */
    public function getRatingAttribute(): float
    {
        return round($this->ratings()->avg('rating') ?? 0, 1);
    }

    /**
     * Get the company's avatar URL.
     */
    public function getAvatarUrlAttribute(): ?string
    {
        return $this->avatar ? asset('storage/' . $this->avatar) : null;
    }

    // Scopes
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeByStatus($query, $status)
    {
        return $query->where('status', $status);
    }

    public function scopeSearch($query, $search)
    {
        return $query->where(function($q) use ($search) {
            $q->where('name', 'like', "%{$search}%")
              ->orWhere('email', 'like', "%{$search}%")
              ->orWhere('nip', 'like', "%{$search}%")
              ->orWhere('address', 'like', "%{$search}%");
        });
    }
    // public function specializations()
    // {
    //     return $this->belongsToMany(Specialization::class, 'company_specializations');
    // }
    //     public function getSpecializationsAttribute($value)
    // {
    //     return $value ? json_decode($value, true) : [];
    // }
    
    // public function setSpecializationsAttribute($value)
    // {
    //     $this->attributes['specializations'] = json_encode($value);
    // }
}