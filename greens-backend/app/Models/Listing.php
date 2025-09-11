<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Listing extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'description',
        'long_description',
        'price',
        'rating',
        'category',
        'subcategory',
        'company_id',
        'company_name',
        'location',
        'phone',
        'email',
        'avatar',
        'images',
        'tags',
        'experience',
        'social_media',
        'status',
        'is_featured',
        'clicks',
        'user_id',
        'published_at'
    ];

    protected $casts = [
        'images' => 'array',
        'tags' => 'array',
        'social_media' => 'array',
        'price' => 'decimal:2',
        'rating' => 'decimal:1',
        'is_featured' => 'boolean',
        'clicks' => 'integer',
        'published_at' => 'datetime'
    ];

    public function company()
    {
        return $this->belongsTo(Company::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function scopeActive($query)
    {
        return $query->where('status', 'aktywne');
    }

    public function scopeFeatured($query)
    {
        return $query->where('is_featured', true);
    }

    public function incrementClicks()
    {
        $this->increment('clicks');
    }
}