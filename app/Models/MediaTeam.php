<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MediaTeam extends Model
{
    protected $table = 'media_team';
    protected $primaryKey = 'media_team_id';

    protected $fillable = [
        'student_id',
        'firstname',
        'lastname',
        'sex',
        'role',
        'specialization',
        'age',
        'birthdate',
        'phone_number',
        'email',
        'address',
        'year',
        'status',
        'profile_picture',
        'faceio_id',
        'face_descriptor',
        'face_image',
        'batch_id',
    ];

    protected $casts = [
        'birthdate' => 'date',
    ];

    public function batch()
    {
        return $this->belongsTo(Batch::class, 'batch_id');
    }

    public function getRouteKeyName()
    {
        return 'media_team_id';
    }
}
