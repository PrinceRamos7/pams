<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\AttendanceRecord;
use App\Models\AttendanceEvent;
use App\Models\Member;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class AttendanceRecordController extends Controller
{
    public function create($eventId)
    {
        $event = AttendanceEvent::findOrFail($eventId);
        
        return Inertia::render('Attendance/RecordAttendance', [
            'event' => $event
        ]);
    }

    public function timeIn($eventId)
    {
        $event = AttendanceEvent::findOrFail($eventId);
        
        // Check if event is closed
        if ($event->status === 'closed') {
            return redirect()->route('attendance.index')
                ->with('error', 'This event is closed. Time-in is no longer available.');
        }
        
        return Inertia::render('Attendance/TimeIn', [
            'event' => $event
        ]);
    }

    public function timeOut($eventId)
    {
        $event = AttendanceEvent::findOrFail($eventId);
        
        // Check if event is closed
        if ($event->status === 'closed') {
            return redirect()->route('attendance.index')
                ->with('error', 'This event is closed. Time-out is no longer available.');
        }
        
        // Get members who have timed in but not timed out yet
        $membersWithTimeIn = AttendanceRecord::with('member')
            ->where('event_id', $eventId)
            ->whereNotNull('time_in')
            ->whereNull('time_out')
            ->get();
        
        return Inertia::render('Attendance/TimeOut', [
            'event' => $event,
            'membersWithTimeIn' => $membersWithTimeIn
        ]);
    }

    public function view(Request $request, $eventId)
    {
        $event = AttendanceEvent::findOrFail($eventId);
        
        $attendanceRecords = AttendanceRecord::with('member')
            ->where('event_id', $eventId)
            ->orderBy('time_in', 'desc')
            ->paginate(15)
            ->withQueryString();
        
        return Inertia::render('Attendance/ViewAttendance', [
            'event' => $event,
            'attendanceRecords' => $attendanceRecords
        ]);
    }
    public function store(Request $request)
    {
        try {
            Log::info('Attendance Record Request:', $request->all());

            $validated = $request->validate([
                'event_id' => 'required|exists:attendance_events,event_id',
                'student_id' => 'nullable|exists:members,student_id',
                'faceio_id' => 'nullable|string',
                'status' => 'required|string|max:50',
                'photo' => 'nullable|string',
                'time_out_only' => 'nullable|boolean',
            ]);

            // Get the event to check time windows
            $event = AttendanceEvent::findOrFail($validated['event_id']);
            
            // Check if event is closed
            if ($event->status === 'closed') {
                return response()->json([
                    'success' => false,
                    'message' => 'This event is closed. Attendance cannot be recorded.',
                ], 422);
            }
            
            // Check if this is a time-out only request (late arrival)
            $isTimeOutOnly = $validated['time_out_only'] ?? false;
            
            // Validate time window based on request type
            $now = now();
            
            if ($isTimeOutOnly) {
                // For late arrivals, check time-out window
                $timeOutStart = \Carbon\Carbon::parse($event->date . ' ' . $event->time_out);
                $timeOutEnd = $timeOutStart->copy()->addMinutes($event->time_out_duration ?? 30);
                
                if ($now->lt($timeOutStart) || $now->gt($timeOutEnd)) {
                    return response()->json([
                        'success' => false,
                        'message' => 'Time-out window is not active. Window: ' . $timeOutStart->format('g:i A') . ' - ' . $timeOutEnd->format('g:i A'),
                    ], 422);
                }
            } else {
                // For normal time-in, check time-in window
                $timeInStart = \Carbon\Carbon::parse($event->date . ' ' . $event->time_in);
                $timeInEnd = $timeInStart->copy()->addMinutes($event->time_in_duration ?? 30);
                
                if ($now->lt($timeInStart) || $now->gt($timeInEnd)) {
                    return response()->json([
                        'success' => false,
                        'message' => 'Time-in window is not active. Window: ' . $timeInStart->format('g:i A') . ' - ' . $timeInEnd->format('g:i A'),
                    ], 422);
                }
            }

            // Find member by student_id or face_id
            if (!empty($validated['faceio_id'])) {
                $member = Member::where('faceio_id', $validated['faceio_id'])->first();
                
                if (!$member) {
                    return response()->json([
                        'success' => false,
                        'message' => 'Face not recognized. Please register your face first.',
                    ], 404);
                }
            } elseif (!empty($validated['student_id'])) {
                $member = Member::where('student_id', $validated['student_id'])->first();
                
                if (!$member) {
                    return response()->json([
                        'success' => false,
                        'message' => 'Student ID not found',
                    ], 404);
                }
            } else {
                return response()->json([
                    'success' => false,
                    'message' => 'Either student_id or face_id is required',
                ], 422);
            }

            // Handle time-out only request (late arrival)
            if ($isTimeOutOnly) {
                // Creating record with only time_out (late arrival - missed time-in window)
                // Check if already has a record
                $existingRecord = AttendanceRecord::where('event_id', $validated['event_id'])
                    ->where('member_id', $member->member_id)
                    ->first();

                if ($existingRecord) {
                    if ($existingRecord->time_out) {
                        return response()->json([
                            'success' => false,
                            'message' => 'You have already timed out for this event at ' . $existingRecord->time_out->format('g:i A'),
                        ], 422);
                    }
                    
                    // Update existing record with time_out
                    $existingRecord->update([
                        'time_out' => now(),
                        'status' => 'late'
                    ]);
                    
                    return response()->json([
                        'success' => true,
                        'message' => 'Time Out recorded successfully (Late arrival)',
                        'record' => $existingRecord->fresh(),
                    ]);
                }
                
                // Create new record with only time_out
                $validated['member_id'] = $member->member_id;
                $validated['time_out'] = now();
                $validated['time_in'] = null;
                $validated['status'] = 'late';
                unset($validated['student_id']);
                unset($validated['faceio_id']);
                unset($validated['time_out_only']);
                
                $record = AttendanceRecord::create($validated);
                $record->load('member');

                return response()->json([
                    'success' => true,
                    'message' => 'Time Out recorded successfully (Late arrival - no time in)',
                    'record' => $record,
                ]);
            }
            
            // Normal time-in flow
            // Check if already timed in for this event
            $existingRecord = AttendanceRecord::where('event_id', $validated['event_id'])
                ->where('member_id', $member->member_id)
                ->whereNotNull('time_in')
                ->first();

            if ($existingRecord) {
                return response()->json([
                    'success' => false,
                    'message' => 'You have already timed in for this event at ' . $existingRecord->time_in->format('g:i A'),
                    'record' => $existingRecord
                ], 422);
            }

            $validated['member_id'] = $member->member_id;
            unset($validated['student_id']);
            unset($validated['faceio_id']);
            unset($validated['time_out_only']);

            // Auto timestamp
            $validated['time_in'] = now();

            // Handle photo if it's base64
            if (!empty($validated['photo']) && strpos($validated['photo'], 'data:image') === 0) {
                $image_parts = explode(";base64,", $validated['photo']);
                $image_base64 = base64_decode($image_parts[1]);

                $fileName = 'attendance_' . uniqid() . '.jpg';
                $filePath = 'attendance_photos/' . $fileName;

                Storage::disk('public')->put($filePath, $image_base64);
                $validated['photo'] = $filePath;
            }

            $record = AttendanceRecord::create($validated);
            $record->load('member');

            Log::info('Attendance recorded successfully', [
                'member_id' => $member->member_id,
                'event_id' => $validated['event_id'],
                'time_in' => $validated['time_in']
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Attendance recorded successfully!',
                'record' => $record,
            ]);

        } catch (\Illuminate\Validation\ValidationException $e) {
            Log::error('Validation failed:', $e->errors());
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $e->errors(),
                'input' => $request->all(),
            ], 422);
        } catch (\Exception $e) {
            Log::error('Attendance record creation failed:', ['error' => $e->getMessage()]);
            return response()->json([
                'success' => false,
                'message' => 'Failed to record attendance: ' . $e->getMessage(),
            ], 500);
        }
    }

    public function update(Request $request, $recordId)
    {
        try {
            $validated = $request->validate([
                'time_out' => 'required',
            ]);

            $record = AttendanceRecord::with('event')->findOrFail($recordId);
            
            // Check if already timed out
            if ($record->time_out) {
                return response()->json([
                    'success' => false,
                    'message' => 'You have already timed out for this event at ' . $record->time_out->format('g:i A'),
                ], 422);
            }
            
            // Check if time-out window is active
            $event = $record->event;
            $now = now();
            $timeOutStart = \Carbon\Carbon::parse($event->date . ' ' . $event->time_out);
            $timeOutEnd = $timeOutStart->copy()->addMinutes($event->time_out_duration ?? 30);
            
            if ($now->lt($timeOutStart) || $now->gt($timeOutEnd)) {
                return response()->json([
                    'success' => false,
                    'message' => 'Time-out window is not active. Window: ' . $timeOutStart->format('g:i A') . ' - ' . $timeOutEnd->format('g:i A'),
                ], 422);
            }

            $record->update([
                'time_out' => now(),
            ]);

            Log::info('Time out recorded successfully', [
                'record_id' => $recordId,
                'member_id' => $record->member_id,
                'time_out' => now()
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Time Out recorded successfully!',
                'record' => $record->fresh(),
            ]);

        } catch (\Exception $e) {
            Log::error('Time out update failed:', ['error' => $e->getMessage()]);
            return response()->json([
                'success' => false,
                'message' => 'Failed to record time out: ' . $e->getMessage(),
            ], 500);
        }
    }

    public function index()
    {
        return response()->json(
            AttendanceRecord::with(['event', 'member'])
                ->orderBy('time_in', 'desc')
                ->get()
        );
    }

    public function checkTimeIn(Request $request)
    {
        try {
            $validated = $request->validate([
                'event_id' => 'required|exists:attendance_events,event_id',
                'student_id' => 'required|exists:members,student_id',
            ]);

            $member = Member::where('student_id', $validated['student_id'])->first();
            
            if (!$member) {
                return response()->json([
                    'success' => false,
                    'message' => 'Member not found',
                ], 404);
            }

            $record = AttendanceRecord::where('event_id', $validated['event_id'])
                ->where('member_id', $member->member_id)
                ->whereNotNull('time_in')
                ->first();

            if (!$record) {
                return response()->json([
                    'success' => false,
                    'message' => 'No time-in record found for this event',
                ], 404);
            }

            return response()->json([
                'success' => true,
                'record' => $record,
            ]);

        } catch (\Exception $e) {
            Log::error('Check time-in failed:', ['error' => $e->getMessage()]);
            return response()->json([
                'success' => false,
                'message' => 'Failed to check time-in: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Export Attendance Records to PDF
     */
    public function exportPDF($eventId)
    {
        $event = \App\Models\AttendanceEvent::findOrFail($eventId);
        
        $records = \App\Models\AttendanceRecord::with('member')
            ->where('event_id', $eventId)
            ->orderBy('time_in', 'asc')
            ->get();

        $pdf = \PDF::loadView('pdf.attendance-records', [
            'event' => $event,
            'records' => $records,
            'generatedAt' => now()->format('F d, Y h:i A')
        ]);

        return $pdf->download('attendance-' . $event->agenda . '-' . now()->format('Y-m-d') . '.pdf');
    }

    /**
     * Find attendance record by event_id and member_id
     */
    public function findRecord(Request $request)
    {
        try {
            $validated = $request->validate([
                'event_id' => 'required|exists:attendance_events,event_id',
                'member_id' => 'required|exists:members,member_id',
            ]);

            $record = AttendanceRecord::where('event_id', $validated['event_id'])
                ->where('member_id', $validated['member_id'])
                ->whereNotNull('time_in')
                ->first();

            if (!$record) {
                return response()->json([
                    'success' => false,
                    'message' => 'No time-in record found for this member',
                ], 404);
            }

            return response()->json([
                'success' => true,
                'record' => $record,
            ]);

        } catch (\Exception $e) {
            Log::error('Find record failed:', ['error' => $e->getMessage()]);
            return response()->json([
                'success' => false,
                'message' => 'Failed to find record: ' . $e->getMessage(),
            ], 500);
        }
    }
}
