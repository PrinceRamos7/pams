<?php

namespace App\Console;

use Illuminate\Console\Scheduling\Schedule;
use Illuminate\Foundation\Console\Kernel as ConsoleKernel;
use App\Services\SanctionService;
use Carbon\Carbon;

class Kernel extends ConsoleKernel
{
    /**
     * Define the application's command schedule.
     */
    protected function schedule(Schedule $schedule): void
    {
        // Calculate sanctions every 5 minutes for today's events
        $schedule->call(function () {
            $sanctionService = app(SanctionService::class);
            $sanctionService->calculateSanctionsForDate(Carbon::today());
        })->everyFiveMinutes()
          ->name('calculate-sanctions')
          ->withoutOverlapping();
    }

    /**
     * Register the commands for the application.
     */
    protected function commands(): void
    {
        $this->load(__DIR__.'/Commands');

        require base_path('routes/console.php');
    }
}
