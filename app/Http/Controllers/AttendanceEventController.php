<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\AttendanceEvent;
use Inertia\Inertia;

class AttendanceEventController extends Controller
{
    /**
     * Display attendance events
     * Return JSON if requested (API fetch)
     */
    public function index(Request $request)
    {
        $events = AttendanceEvent::orderBy('date', 'desc')->get();

        // If the request expects JSON, return JSON
        if ($request->wantsJson()) {
            return response()->json($events);
        }

        // Otherwise, render the Inertia page
        return Inertia::render('Attendance/Index', [
            'events' => $events,
        ]);
    }

    /**
     * Store a new attendance event
     */
    public function store(Request $request)
    {
        $request->validate([
            'date' => 'required|date',
            'agenda' => 'required|string|max:255',
            'time_in' => 'required',
            'time_out' => 'required',
        ]);

        $event = AttendanceEvent::create([
            'date' => $request->date,
            'agenda' => $request->agenda,
            'time_in' => $request->time_in,
            'time_out' => $request->time_out,
            'time_in_duration' => $request->time_in_duration ?? 30,
            'time_out_duration' => $request->time_out_duration ?? 30,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Event added successfully!',
            'event' => $event,
        ]);
    }

    /**
     * Update an attendance event
     */
    public function update(Request $request, $eventId)
    {
        try {
            $request->validate([
                'date' => 'required|date',
                'agenda' => 'required|string|max:255',
                'time_in' => 'required',
                'time_out' => 'required',
            ]);

            $event = AttendanceEvent::findOrFail($eventId);
            
            $event->update([
                'date' => $request->date,
                'agenda' => $request->agenda,
                'time_in' => $request->time_in,
                'time_out' => $request->time_out,
                'time_in_duration' => $request->time_in_duration ?? $event->time_in_duration ?? 30,
                'time_out_duration' => $request->time_out_duration ?? $event->time_out_duration ?? 30,
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Event updated successfully!',
                'event' => $event->fresh(),
            ]);
        } catch (\Exception $e) {
            \Log::error('Failed to update event', ['error' => $e->getMessage(), 'eventId' => $eventId]);
            return response()->json([
                'success' => false,
                'message' => 'Failed to update event: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Delete an attendance event
     */
    public function destroy($eventId)
    {
        try {
            $event = AttendanceEvent::findOrFail($eventId);
            $eventName = $event->agenda;
            
            $event->delete();

            return response()->json([
                'success' => true,
                'message' => "Event '{$eventName}' deleted successfully!",
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete event: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Force begin time out window
     */
    public function forceBeginTimeOut($eventId)
    {
        try {
            $event = AttendanceEvent::findOrFail($eventId);
            
            // Check if already closed
            if ($event->status === 'closed') {
                return response()->json([
                    'success' => false,
                    'message' => 'Event is already closed.',
                ], 400);
            }
            
            // Check if time out window is already active
            $now = now();
            $eventDateTime = \Carbon\Carbon::parse($event->date . ' ' . $event->time_out);
            $endTime = $eventDateTime->copy()->addMinutes($event->time_out_duration ?? 30);
            
            if ($now->greaterThanOrEqualTo($eventDateTime) && $now->lessThanOrEqualTo($endTime)) {
                return response()->json([
                    'success' => false,
                    'message' => 'Time-out window is already active.',
                ], 400);
            }
            
            // Update the time_out to current time to force open the window
            $event->update([
                'time_out' => $now->format('H:i:s'),
            ]);
            
            return response()->json([
                'success' => true,
                'message' => "Time-out window opened for '{$event->agenda}'. Members can now time out.",
                'event' => $event->fresh(),
            ]);
        } catch (\Exception $e) {
            \Log::error('Failed to force begin time out', ['error' => $e->getMessage(), 'eventId' => $eventId]);
            return response()->json([
                'success' => false,
                'message' => 'Failed to open time-out window: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Force reopen time out window (extend time-out duration)
     */
    public function forceReopenTimeOut($eventId)
    {
        try {
            $event = AttendanceEvent::findOrFail($eventId);
            
            // Check if already closed
            if ($event->status === 'closed') {
                return response()->json([
                    'success' => false,
                    'message' => 'Event is already closed. Cannot reopen time-out window.',
                ], 400);
            }
            
            // Check if time out window is still active
            $now = now();
            $eventDateTime = \Carbon\Carbon::parse($event->date . ' ' . $event->time_out);
            $endTime = $eventDateTime->copy()->addMinutes($event->time_out_duration ?? 30);
            
            if ($now->lessThanOrEqualTo($endTime)) {
                return response()->json([
                    'success' => false,
                    'message' => 'Time-out window is still active. Cannot reopen until it expires.',
                ], 400);
            }
            
            // Extend time-out duration by 30 minutes from now
            $event->update([
                'time_out' => $now->format('H:i:s'),
                'time_out_duration' => 30, // Reset to 30 minutes
            ]);
            
            return response()->json([
                'success' => true,
                'message' => "Time-out window reopened for '{$event->agenda}'. Members can time out for the next 30 minutes.",
                'event' => $event->fresh(),
            ]);
        } catch (\Exception $e) {
            \Log::error('Failed to reopen time out window', ['error' => $e->getMessage(), 'eventId' => $eventId]);
            return response()->json([
                'success' => false,
                'message' => 'Failed to reopen time-out window: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Force close an event and calculate sanctions
     */
    public function forceClose($eventId)
    {
        try {
            $event = AttendanceEvent::findOrFail($eventId);
            
            // Check if already closed
            if ($event->status === 'closed') {
                return response()->json([
                    'success' => false,
                    'message' => 'Event is already closed.',
                ], 400);
            }
            
            \Log::info('Force closing event', ['event_id' => $eventId, 'agenda' => $event->agenda]);
            
            $sanctionService = app(\App\Services\SanctionService::class);
            
            // Calculate sanctions for this event
            $result = $sanctionService->calculateSanctionsForEvent($eventId);
            
            \Log::info('Sanction calculation result', [
                'event_id' => $eventId,
                'success' => $result['success'],
                'sanctions_created' => $result['sanctions_created'] ?? 0,
                'message' => $result['message'] ?? 'No message'
            ]);
            
            // Mark event as closed regardless of sanction calculation result
            $event->update([
                'status' => 'closed',
                'closed_at' => now(),
            ]);
            
            if ($result['success']) {
                return response()->json([
                    'success' => true,
                    'message' => "Event '{$event->agenda}' closed. {$result['sanctions_created']} sanctions created.",
                    'sanctions_created' => $result['sanctions_created'],
                    'event' => $event->fresh(),
                ]);
            } else {
                return response()->json([
                    'success' => true,
                    'message' => "Event '{$event->agenda}' closed, but sanction calculation had issues: {$result['message']}",
                    'sanctions_created' => 0,
                    'event' => $event->fresh(),
                ]);
            }
        } catch (\Exception $e) {
            \Log::error('Failed to force close event', [
                'error' => $e->getMessage(),
                'eventId' => $eventId,
                'trace' => $e->getTraceAsString()
            ]);
            return response()->json([
                'success' => false,
                'message' => 'Failed to close event: ' . $e->getMessage(),
            ], 500);
        }
    }
}
