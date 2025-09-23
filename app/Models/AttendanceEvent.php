<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AttendanceEvent extends Model
{
    use HasFactory;

    protected $table = 'attendance_events';
    protected $primaryKey = 'event_id';
    protected $fillable = ['date', 'agenda'];

    public function records()
    {
        return $this->hasMany(AttendanceRecord::class, 'event_id', 'event_id');
    }
}
