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
    ]);

    $event = AttendanceEvent::create([
        'date' => $request->date,
        'agenda' => $request->agenda,
    ]);

    return response()->json([
        'success' => true,
        'message' => 'Event added successfully!',
        'event' => $event,
    ]);
}
}
