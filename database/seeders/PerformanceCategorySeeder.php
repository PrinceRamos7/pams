<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\PerformanceCategory;

class PerformanceCategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categories = [
            [
                'name' => 'Activity Score',
                'percentage_weight' => 30.00,
                'is_active' => true,
                'display_order' => 1,
            ],
            [
                'name' => 'Tutor Rating',
                'percentage_weight' => 25.00,
                'is_active' => true,
                'display_order' => 2,
            ],
            [
                'name' => 'Attendance',
                'percentage_weight' => 20.00,
                'is_active' => true,
                'display_order' => 3,
            ],
            [
                'name' => 'Project Contribution',
                'percentage_weight' => 15.00,
                'is_active' => true,
                'display_order' => 4,
            ],
            [
                'name' => 'Peer Review',
                'percentage_weight' => 10.00,
                'is_active' => true,
                'display_order' => 5,
            ],
        ];

        foreach ($categories as $category) {
            PerformanceCategory::create($category);
        }
    }
}
