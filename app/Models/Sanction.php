<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Sanction extends Model
{
    use HasFactory;

    protected $table = 'sanctions';
    protected $primaryKey = 'sanction_id';
    
    protected $fillable = [
        'member_id',
        'event_id',
        'amount',
        'reason',
        'status',
        'payment_date'
    ];
    
    protected $casts = [
        'amount' => 'decimal:2',
        'payment_date' => 'datetime'
    ];
    
    protected $appends = ['paid_at', 'is_paid'];
    
    /**
     * Get paid_at attribute (alias for payment_date)
     */
    public function getPaidAtAttribute()
    {
        return $this->payment_date;
    }
    
    /**
     * Get is_paid attribute (check if status is 'paid')
     */
    public function getIsPaidAttribute()
    {
        return $this->status === 'paid';
    }
    
    /**
     * Get the member that owns the sanction
     */
    public function member()
    {
        return $this->belongsTo(Member::class, 'member_id', 'member_id');
    }
    
    /**
     * Get the event that the sanction is for
     */
    public function event()
    {
        return $this->belongsTo(AttendanceEvent::class, 'event_id', 'event_id');
    }
    
    /**
     * Scope a query to only include unpaid sanctions
     */
    public function scopeUnpaid($query)
    {
        return $query->where('status', 'unpaid');
    }
    
    /**
     * Scope a query to only include paid sanctions
     */
    public function scopePaid($query)
    {
        return $query->where('status', 'paid');
    }
    
    /**
     * Scope a query to filter by member
     */
    public function scopeForMember($query, $memberId)
    {
        return $query->where('member_id', $memberId);
    }
    
    /**
     * Scope a query to filter by event
     */
    public function scopeForEvent($query, $eventId)
    {
        return $query->where('event_id', $eventId);
    }
    
    /**
     * Mark sanction as paid
     */
    public function markAsPaid()
    {
        $this->status = 'paid';
        $this->payment_date = now();
        $this->save();
    }
}
