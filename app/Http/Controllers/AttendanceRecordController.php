<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\AttendanceRecord;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

class AttendanceRecordController extends Controller
{
    public function store(Request $request)
    {
        try {
            Log::info('Attendance Record Request:', $request->all());

            $validated = $request->validate([
                'event_id' => 'required|exists:attendance_events,event_id',
                'member_id' => 'required|exists:members,member_id',
                'status' => 'required|string|max:50',
                'photo' => 'nullable|string',
            ]);

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

            return response()->json([
                'success' => true,
                'message' => 'Attendance recorded successfully!',
                'record' => $record,
            ]);

        } catch (\Illuminate\Validation\ValidationException $e) {
            // Validation errors
            Log::error('Validation failed:', $e->errors());
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $e->errors(),
                'input' => $request->all(),
            ], 422);
        } catch (\Exception $e) {
            // Other errors
            Log::error('Attendance record creation failed:', ['error' => $e->getMessage()]);
            return response()->json([
                'success' => false,
                'message' => 'Failed to record attendance: ' . $e->getMessage(),
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
}
