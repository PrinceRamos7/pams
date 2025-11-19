<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        User::firstOrCreate(
            ['email' => 'pitonadmin@gmail.com'],
            [
                'name' => 'Piton Admin',
                'password' => bcrypt('masterprince123'),
            ]
        );

        // Seed PITON members and officers for AY 2025-2026
        $this->call(PitonMembersAndOfficersAY2025_2026Seeder::class);
    }
}
