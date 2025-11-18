<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Member extends Model
{
    use HasFactory;

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
        'profile_picture',
        'faceio_id',
        'face_descriptor',
        'face_image',
        'year',
        'status',
        'batch_id'
    ];

    public function batch()
    {
        return $this->belongsTo(Batch::class, 'batch_id', 'id');
    }

    public function officer()
    {
        return $this->hasOne(Officer::class, 'member_id', 'member_id');
    }

    public function attendanceRecords()
    {
        return $this->hasMany(AttendanceRecord::class, 'member_id', 'member_id');
    }

    public function history()
    {
        return $this->hasMany(MemberHistory::class, 'member_id', 'member_id');
    }

    /**
     * Boot method to track changes
     */
    protected static function booted()
    {
        static::created(function ($member) {
            MemberHistory::log(
                $member->member_id,
                'created',
                'Member account created',
                null,
                $member->only(['student_id', 'firstname', 'lastname', 'email', 'year', 'status'])
            );
        });

        static::updated(function ($member) {
            $changes = $member->getChanges();
            if (!empty($changes) && !isset($changes['updated_at'])) {
                MemberHistory::log(
                    $member->member_id,
                    'updated',
                    'Member information updated',
                    $member->getOriginal(),
                    $changes
                );
            }
        });
    }
}
