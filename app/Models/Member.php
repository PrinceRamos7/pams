<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
class Member extends Model
{    use HasFactory;

    protected $table = 'members';
    protected $primaryKey = 'member_id';
   protected $fillable = [
    'student_id',
    'firstname',
    'lastname',
    'sex',
    'age',
    'birthdate',
    'phone_number',
    'address',
    'email',
    'year',
    'status'
];


    public function officer()
{
    return $this->hasOne(Officer::class, 'member_id', 'member_id');
}
   public function attendanceRecords()
    {
        return $this->hasMany(AttendanceRecord::class, 'member_id', 'member_id');
    }

    
}


