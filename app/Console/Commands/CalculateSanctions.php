<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Services\SanctionService;
use App\Models\AttendanceEvent;
use Carbon\Carbon;

class CalculateSanctions extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'sanctions:calculate {date?}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Calculate sanctions for attendance events';

    protected $sanctionService;

    public function __construct(SanctionService $sanctionService)
    {
        parent::__construct();
        $this->sanctionService = $sanctionService;
    }

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $date = $this->argument('date') ?? Carbon::today()->toDateString();
        
        $this->info("Calculating sanctions for date: {$date}");
        
        $events = AttendanceEvent::whereDate('date', $date)->get();
        
        if ($events->isEmpty()) {
            $this->warn("No events found for {$date}");
            return 0;
        }
        
        $totalSanctions = 0;
        
        foreach ($events as $event) {
            $this->info("Processing event: {$event->agenda} (ID: {$event->event_id})");
            
            $result = $this->sanctionService->calculateSanctionsForEvent($event->event_id);
            
            if ($result['success']) {
                $count = $result['sanctions_created'];
                $totalSanctions += $count;
                $this->info("  ✓ Created {$count} sanctions");
            } else {
                $this->error("  ✗ Failed: {$result['message']}");
            }
        }
        
        $this->info("\nTotal sanctions created: {$totalSanctions}");
        
        return 0;
    }
}
