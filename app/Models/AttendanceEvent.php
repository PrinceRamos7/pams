<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AttendanceEvent extends Model
{
    use HasFactory;

    protected $table = 'attendance_events';
    protected $primaryKey = 'event_id';
    protected $fillable = ['date', 'agenda', 'time_in', 'time_out', 'time_in_duration', 'time_out_duration', 'status', 'closed_at'];
    
    protected $casts = [
        'closed_at' => 'datetime',
    ];

    public function records()
    {
        return $this->hasMany(AttendanceRecord::class, 'event_id', 'event_id');
    }

    public function sanctions()
    {
        return $this->hasMany(Sanction::class, 'event_id', 'event_id');
    }
}
