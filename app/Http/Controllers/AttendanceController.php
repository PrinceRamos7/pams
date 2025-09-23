<?php

namespace App\Http\Controllers;

use App\Models\Attendance;
use App\Models\Member;
use Inertia\Inertia;
use Illuminate\Http\Request;

class AttendanceController extends Controller
{
    public function index()
    {
        $members = Member::all();
        $attendances = Attendance::whereDate('date', now())->get()->keyBy('member_id');

        return Inertia::render('Attendance/Index', [
            'members' => $members,
            'attendances' => $attendances,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'member_id' => 'required|exists:members,id',
            'status' => 'nullable|in:present,absent,late',
            'agenda' => 'nullable|string|max:255',
            'time_in' => 'nullable|date_format:H:i',
            'time_out' => 'nullable|date_format:H:i',
        ]);

        Attendance::updateOrCreate(
            [
                'member_id' => $request->member_id,
                'date' => now(),
            ],
            [
                'status' => $request->status,
                'agenda' => $request->agenda,
                'time_in' => $request->time_in,
                'time_out' => $request->time_out,
            ]
        );

        return redirect()->back()->with('success', 'Attendance saved.');
    }
}
