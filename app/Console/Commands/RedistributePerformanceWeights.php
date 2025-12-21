<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\PerformanceCategory;

class RedistributePerformanceWeights extends Command
{
    protected $signature = 'performance:redistribute-weights';
    protected $description = 'Redistribute performance category weights equally';

    public function handle()
    {
        $activeCategories = PerformanceCategory::where('is_active', true)->get();
        $count = $activeCategories->count();

        if ($count === 0) {
            $this->error('No active categories found.');
            return 1;
        }

        $equalWeight = round(100 / $count, 2);
        
        $this->info("Redistributing weights among {$count} active categories...");
        
        foreach ($activeCategories as $index => $category) {
            $oldWeight = $category->percentage_weight;
            
            // For the last category, adjust to ensure total is exactly 100%
            if ($index === $count - 1) {
                $currentTotal = $activeCategories->take($count - 1)->sum('percentage_weight');
                $category->percentage_weight = round(100 - $currentTotal, 2);
            } else {
                $category->percentage_weight = $equalWeight;
            }
            
            $category->save();
            
            $this->line("  {$category->name}: {$oldWeight}% → {$category->percentage_weight}%");
        }

        $total = PerformanceCategory::where('is_active', true)->sum('percentage_weight');
        $this->info("\nTotal weight: {$total}%");
        $this->info('✓ Weights redistributed successfully!');
        
        return 0;
    }
}
