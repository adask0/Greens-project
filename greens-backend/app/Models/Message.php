<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Message extends Model
{
    use HasFactory;
    
    protected $fillable = [
        'user_id',
        'company_id',
        'listing_id',      // DODANE!
        'sender_name',
        'sender_email',
        'sender_phone',
        'company_name',    // DODANE!
        'subject',
        'message',
        'message_type',    // DODANE!
        'rating',          // DODANE!
        'status',
        'is_urgent',
        'is_read',
        'admin_reply',
        'replied_at',
        'replied_by',
    ];
    
    protected $casts = [
        'is_urgent' => 'boolean',
        'is_read' => 'boolean',
        'rating' => 'decimal:1',  // DODANE!
        'replied_at' => 'datetime',
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
    
    public function listing()  // DODANE!
    {
        return $this->belongsTo(Listing::class);
    }
    
    public function repliedBy()
    {
        return $this->belongsTo(User::class, 'replied_by');
    }
    
    // Scopes
    public function scopeUnread($query)
    {
        return $query->where('is_read', false);
    }
    
    public function scopeUrgent($query)
    {
        return $query->where('is_urgent', true);
    }
    
    public function scopeByStatus($query, $status)
    {
        return $query->where('status', $status);
    }
    
    public function scopeSearch($query, $search)
    {
        return $query->where(function($q) use ($search) {
            $q->where('sender_name', 'like', "%{$search}%")
              ->orWhere('sender_email', 'like', "%{$search}%")
              ->orWhere('subject', 'like', "%{$search}%")
              ->orWhere('message', 'like', "%{$search}%")
              ->orWhereHas('company', function($q) use ($search) {
                  $q->where('name', 'like', "%{$search}%");
              })
              ->orWhereHas('user', function($q) use ($search) {
                  $q->where('name', 'like', "%{$search}%");
              });
        });
    }
}