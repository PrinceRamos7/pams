<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Attendance extends Model
{
    use HasFactory;

    // Specify the table name 
    protected $table = 'attendances';

    // Specify the primary key
    protected $primaryKey = 'attendance_id';

    // Mass assignable fields
    protected $fillable = [
        'member_id',
        'date',
        'time_in',
        'time_out',
        'status',
        'agenda',
    ];

    // Relationship: Attendance belongs to a member
    public function member()
    {
        return $this->belongsTo(Member::class, 'member_id');
    }
}
