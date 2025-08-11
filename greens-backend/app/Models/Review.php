<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Review extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'company_id',
        'rating',
        'comment',
        'order_number',
        'order_date',
        'is_hidden',
        'admin_note',
    ];

    protected $casts = [
        'rating' => 'integer',
        'is_hidden' => 'boolean',
        'order_date' => 'date',
    ];

    // Relacje
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function company()
    {
        return $this->belongsTo(Company::class);
    }

    // Scopes
    public function scopeVisible($query)
    {
        return $query->where('is_hidden', false);
    }

    public function scopeHidden($query)
    {
        return $query->where('is_hidden', true);
    }

    public function scopeByRating($query, $rating)
    {
        return $query->where('rating', $rating);
    }

    public function scopeByCompany($query, $companyId)
    {
        return $query->where('company_id', $companyId);
    }

    // Accessor dla nr zlecenia z datą
    public function getOrderNumberWithDateAttribute()
    {
        if ($this->order_number && $this->order_date) {
            return $this->order_number . ' (' . $this->order_date->format('d.m.Y') . ')';
        }
        return $this->order_number ?: '-';
    }
}