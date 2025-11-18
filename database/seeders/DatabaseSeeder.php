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

        // Seed PITON officers and members
        $this->call(PitonOfficersSeeder::class);
    }
}
