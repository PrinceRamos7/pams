<?php

namespace App\Http\Controllers;

use App\Models\Member;
use App\Models\Officer;
use App\Models\AttendanceEvent;
use App\Models\AttendanceRecord;
use App\Models\Sanction;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;

class DashboardController extends Controller
{
    public function index()
    {
        // Get statistics
        $totalMembers = Member::count();
        $totalEvents = AttendanceEvent::count();
        $upcomingEvents = AttendanceEvent::where('date', '>=', Carbon::today())
            ->where('status', '!=', 'closed')
            ->count();
        
        // Recent events
        $recentEvents = AttendanceEvent::orderBy('date', 'desc')
            ->limit(5)
            ->get()
            ->map(function ($event) {
                $attendanceCount = AttendanceRecord::where('event_id', $event->event_id)->count();
                return [
                    'event_id' => $event->event_id,
                    'agenda' => $event->agenda,
                    'date' => $event->date,
                    'status' => $event->status,
                    'attendance_count' => $attendanceCount,
                ];
            });

        // Sanctions Analytics
        $totalSanctions = Sanction::count();
        $paidSanctions = Sanction::where('status', 'paid')->count();
        $unpaidSanctions = Sanction::where('status', 'unpaid')->count();
        $totalPaidAmount = Sanction::where('status', 'paid')->sum('amount');
        $totalUnpaidAmount = Sanction::where('status', 'unpaid')->sum('amount');
        $totalSanctionAmount = Sanction::sum('amount');

        // Attendance Analytics
        $totalAttendanceRecords = AttendanceRecord::count();
        $presentRecords = AttendanceRecord::where('status', 'Present')->count();
        $lateRecords = AttendanceRecord::where('status', 'late')->count();
        $absentRecords = AttendanceRecord::where('status', 'absent')->count();
        
        // Calculate attendance rate
        $attendanceRate = $totalAttendanceRecords > 0 
            ? round(($presentRecords / $totalAttendanceRecords) * 100, 1) 
            : 0;

        // Current month statistics
        $currentMonthEvents = AttendanceEvent::whereMonth('date', Carbon::now()->month)
            ->whereYear('date', Carbon::now()->year)
            ->count();
        
        $currentMonthAttendance = AttendanceRecord::whereHas('event', function ($query) {
            $query->whereMonth('date', Carbon::now()->month)
                  ->whereYear('date', Carbon::now()->year);
        })->where('status', 'Present')->count();

        $currentMonthSanctions = Sanction::whereHas('event', function ($query) {
            $query->whereMonth('date', Carbon::now()->month)
                  ->whereYear('date', Carbon::now()->year);
        })->count();

        // Top sanctioned members
        $topSanctionedMembers = Sanction::with(['member', 'event'])
            ->selectRaw('member_id, COUNT(*) as sanction_count, SUM(amount) as total_amount')
            ->groupBy('member_id')
            ->orderByDesc('sanction_count')
            ->limit(5)
            ->get()
            ->map(function ($sanction) {
                // Get the most recent sanction for this member to show status and reason
                $recentSanction = Sanction::where('member_id', $sanction->member_id)
                    ->orderBy('created_at', 'desc')
                    ->first();
                
                return [
                    'member_name' => $sanction->member->firstname . ' ' . $sanction->member->lastname,
                    'student_id' => $sanction->member->student_id,
                    'sanction_count' => $sanction->sanction_count,
                    'total_amount' => $sanction->total_amount,
                    'status' => $recentSanction->status ?? 'unpaid',
                    'type' => $recentSanction->status === 'excused' ? 'Excused' : ($recentSanction->reason ?? 'N/A'),
                ];
            });

        return Inertia::render('Dashboard/Dashboard', [
            'stats' => [
                'totalMembers' => $totalMembers,
                'totalEvents' => $totalEvents,
                'upcomingEvents' => $upcomingEvents,
                'currentMonthEvents' => $currentMonthEvents,
                'currentMonthAttendance' => $currentMonthAttendance,
                'currentMonthSanctions' => $currentMonthSanctions,
            ],
            'sanctionAnalytics' => [
                'totalSanctions' => $totalSanctions,
                'paidSanctions' => $paidSanctions,
                'unpaidSanctions' => $unpaidSanctions,
                'totalPaidAmount' => $totalPaidAmount,
                'totalUnpaidAmount' => $totalUnpaidAmount,
                'totalSanctionAmount' => $totalSanctionAmount,
                'paymentRate' => $totalSanctions > 0 ? round(($paidSanctions / $totalSanctions) * 100, 1) : 0,
            ],
            'attendanceAnalytics' => [
                'totalRecords' => $totalAttendanceRecords,
                'presentRecords' => $presentRecords,
                'lateRecords' => $lateRecords,
                'absentRecords' => $absentRecords,
                'attendanceRate' => $attendanceRate,
            ],
            'recentEvents' => $recentEvents,
            'topSanctionedMembers' => $topSanctionedMembers,
        ]);
    }
}
