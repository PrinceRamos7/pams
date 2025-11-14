<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AttendanceRecord extends Model
{
    use HasFactory;

    protected $table = 'attendance_records';
    protected $primaryKey = 'record_id';
    
    // Add 'status' to fillable if your database has this column
    protected $fillable = [
        'event_id', 
        'member_id', 
        'time_in', 
        'time_out', 
        'status',
        'photo',
        'photo_out'
    ];

    protected $casts = [
        'time_in' => 'datetime',
        'time_out' => 'datetime',
    ];

    public function event()
    {
        return $this->belongsTo(AttendanceEvent::class, 'event_id', 'event_id');
    }

    public function member()
    {
        return $this->belongsTo(Member::class, 'member_id', 'member_id');
    }
}
