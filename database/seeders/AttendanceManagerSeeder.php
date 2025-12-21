<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class AttendanceManagerSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create Attendance Manager user
        User::updateOrCreate(
            ['email' => 'attendance@piton.com'],
            [
                'name' => 'Attendance Manager',
                'email' => 'attendance@piton.com',
                'password' => Hash::make('password'),
                'role' => 'attendance_manager',
            ]
        );

        $this->command->info('Attendance Manager user created successfully!');
        $this->command->info('Email: attendance@piton.com');
        $this->command->info('Password: password');
    }
}
