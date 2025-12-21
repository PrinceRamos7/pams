<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable;

    // Role constants
    const ROLE_ADMIN = 'admin';
    const ROLE_ATTENDANCE_OFFICER = 'attendance_officer';
    const ROLE_ATTENDANCE_MANAGER = 'attendance_manager';
    const ROLE_BUSINESS_MANAGER = 'business_manager';

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
        'faceio_id',
        'face_descriptor',
        'face_image',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    /**
     * Check if user is admin
     */
    public function isAdmin(): bool
    {
        return $this->role === self::ROLE_ADMIN;
    }

    /**
     * Check if user is attendance officer
     */
    public function isAttendanceOfficer(): bool
    {
        return $this->role === self::ROLE_ATTENDANCE_OFFICER;
    }

    /**
     * Check if user is attendance manager
     */
    public function isAttendanceManager(): bool
    {
        return $this->role === self::ROLE_ATTENDANCE_MANAGER;
    }

    /**
     * Check if user is business manager
     */
    public function isBusinessManager(): bool
    {
        return $this->role === self::ROLE_BUSINESS_MANAGER;
    }

    /**
     * Check if user has access to attendance features
     */
    public function canManageAttendance(): bool
    {
        return in_array($this->role, [self::ROLE_ADMIN, self::ROLE_ATTENDANCE_OFFICER, self::ROLE_ATTENDANCE_MANAGER]);
    }

    /**
     * Check if user has access to financial features
     */
    public function canManageFinances(): bool
    {
        return in_array($this->role, [self::ROLE_ADMIN, self::ROLE_BUSINESS_MANAGER]);
    }
}
