<?php

namespace App\Services;

use App\Models\Sanction;
use App\Models\AttendanceEvent;
use App\Models\AttendanceRecord;
use App\Models\Member;
use Carbon\Carbon;
use Illuminate\Support\Facades\Log;

class SanctionService
{
    /**
     * Calculate and create sanctions for an event
     * 
     * @param int $eventId
     * @return array
     */
    public function calculateSanctionsForEvent($eventId)
    {
        try {
            $event = AttendanceEvent::findOrFail($eventId);
            
            // Get time-in window end time
            $timeInEnd = Carbon::parse($event->date . ' ' . $event->time_in)
                ->addMinutes($event->time_in_duration ?? 30);
            
            // Get time-out window end time
            $timeOutEnd = Carbon::parse($event->date . ' ' . $event->time_out)
                ->addMinutes($event->time_out_duration ?? 30);
            
            $now = Carbon::now();
            $sanctionsCreated = [];
            
            // Only process if event is closed OR time-in window has passed
            if ($event->status !== 'closed' && $now->lt($timeInEnd)) {
                return [
                    'success' => true,
                    'message' => 'Time-in window still active',
                    'sanctions_created' => 0
                ];
            }
            
            // Get all active members
            $allMembers = Member::where('status', 'Active')->get();
            
            foreach ($allMembers as $member) {
                $record = AttendanceRecord::where('event_id', $eventId)
                    ->where('member_id', $member->member_id)
                    ->first();
                
                // Case 1: No record at all - Absent (25 pesos)
                if (!$record) {
                    $sanction = $this->createSanction(
                        $member->member_id,
                        $eventId,
                        25.00,
                        'Absent'
                    );
                    
                    if ($sanction) {
                        $sanctionsCreated[] = $sanction;
                    }
                }
                // Case 2: No time-in but has time-out - Half day sanction (12.50 pesos)
                elseif (!$record->time_in && $record->time_out) {
                    $sanction = $this->createSanction(
                        $member->member_id,
                        $eventId,
                        12.50,
                        'No time in'
                    );
                    
                    if ($sanction) {
                        $sanctionsCreated[] = $sanction;
                    }
                }
                // Case 3: Has time-in but no time-out - Half day sanction (12.50 pesos)
                elseif ($record->time_in && !$record->time_out) {
                    // Only create sanction if event is closed OR time-out window has passed
                    if ($event->status === 'closed' || $now->gt($timeOutEnd)) {
                        $sanction = $this->createSanction(
                            $member->member_id,
                            $eventId,
                            12.50,
                            'No time out'
                        );
                        
                        if ($sanction) {
                            $sanctionsCreated[] = $sanction;
                        }
                    }
                }
                // Case 4: No time-in and no time-out - Absent (25 pesos)
                elseif (!$record->time_in && !$record->time_out) {
                    $sanction = $this->createSanction(
                        $member->member_id,
                        $eventId,
                        25.00,
                        'Absent'
                    );
                    
                    if ($sanction) {
                        $sanctionsCreated[] = $sanction;
                    }
                }
                // Case 5: Has both time-in and time-out - No sanction
            }
            
            Log::info('Sanctions calculated for event', [
                'event_id' => $eventId,
                'sanctions_created' => count($sanctionsCreated)
            ]);
            
            return [
                'success' => true,
                'message' => 'Sanctions calculated successfully',
                'sanctions_created' => count($sanctionsCreated),
                'sanctions' => $sanctionsCreated
            ];
            
        } catch (\Exception $e) {
            Log::error('Failed to calculate sanctions', [
                'event_id' => $eventId,
                'error' => $e->getMessage()
            ]);
            
            return [
                'success' => false,
                'message' => 'Failed to calculate sanctions: ' . $e->getMessage(),
                'sanctions_created' => 0
            ];
        }
    }
    
    /**
     * Create a sanction record
     * 
     * @param int $memberId
     * @param int $eventId
     * @param float $amount
     * @param string $reason
     * @return Sanction|null
     */
    private function createSanction($memberId, $eventId, $amount, $reason)
    {
        try {
            // Check if sanction already exists
            $existing = Sanction::where('member_id', $memberId)
                ->where('event_id', $eventId)
                ->where('reason', $reason)
                ->first();
            
            if ($existing) {
                Log::info('Sanction already exists', [
                    'member_id' => $memberId,
                    'event_id' => $eventId,
                    'reason' => $reason
                ]);
                return null;
            }
            
            // Create new sanction
            $sanction = Sanction::create([
                'member_id' => $memberId,
                'event_id' => $eventId,
                'amount' => $amount,
                'reason' => $reason,
                'status' => 'unpaid'
            ]);
            
            Log::info('Sanction created', [
                'sanction_id' => $sanction->sanction_id,
                'member_id' => $memberId,
                'event_id' => $eventId,
                'amount' => $amount,
                'reason' => $reason
            ]);
            
            return $sanction;
            
        } catch (\Exception $e) {
            Log::error('Failed to create sanction', [
                'member_id' => $memberId,
                'event_id' => $eventId,
                'error' => $e->getMessage()
            ]);
            
            return null;
        }
    }
    
    /**
     * Calculate sanctions for all events on a specific date
     * 
     * @param string $date
     * @return array
     */
    public function calculateSanctionsForDate($date)
    {
        $events = AttendanceEvent::whereDate('date', $date)->get();
        $results = [];
        
        foreach ($events as $event) {
            $results[] = $this->calculateSanctionsForEvent($event->event_id);
        }
        
        return $results;
    }
    
    /**
     * Get total unpaid sanctions for a member
     * 
     * @param int $memberId
     * @return float
     */
    public function getTotalUnpaidForMember($memberId)
    {
        return Sanction::forMember($memberId)
            ->unpaid()
            ->sum('amount');
    }
    
    /**
     * Get all unpaid sanctions for a member
     * 
     * @param int $memberId
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function getUnpaidSanctionsForMember($memberId)
    {
        return Sanction::with(['event'])
            ->forMember($memberId)
            ->unpaid()
            ->orderBy('created_at', 'desc')
            ->get();
    }
}
