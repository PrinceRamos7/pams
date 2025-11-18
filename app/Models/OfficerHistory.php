<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class OfficerHistory extends Model
{
    use HasFactory;

    protected $table = 'officers_history';
    protected $primaryKey = 'history_id';

    protected $fillable = [
        'officer_id',
        'member_id',
        'batch_id',
        'position',
        'sex',
        'action',
        'start_date',
        'end_date',
        'notes',
        'created_by',
        'status',
    ];

    protected $casts = [
        'start_date' => 'date',
        'end_date' => 'date',
    ];

    /**
     * Get the member associated with this history record
     */
    public function member()
    {
        return $this->belongsTo(Member::class, 'member_id', 'member_id');
    }

    /**
     * Get the batch associated with this history record
     */
    public function batch()
    {
        return $this->belongsTo(Batch::class, 'batch_id');
    }

    /**
     * Get the user who created this history record
     */
    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    /**
     * Scope to get active officers (no end date)
     */
    public function scopeActive($query)
    {
        return $query->whereNull('end_date');
    }

    /**
     * Scope to get history for a specific member
     */
    public function scopeForMember($query, $memberId)
    {
        return $query->where('member_id', $memberId);
    }

    /**
     * Scope to get history for a specific position
     */
    public function scopeForPosition($query, $position)
    {
        return $query->where('position', $position);
    }
}
