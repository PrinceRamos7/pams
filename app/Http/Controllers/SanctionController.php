<?php

namespace App\Http\Controllers;

use App\Models\Sanction;
use App\Models\AttendanceEvent;
use App\Services\SanctionService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Hash;
use Barryvdh\DomPDF\Facade\Pdf;
use Inertia\Inertia;

class SanctionController extends Controller
{
    protected $sanctionService;
    
    public function __construct(SanctionService $sanctionService)
    {
        $this->sanctionService = $sanctionService;
    }

    /**
     * Verify user password for sensitive operations
     */
    public function verifyPassword(Request $request)
    {
        try {
            $request->validate([
                'password' => 'required|string'
            ]);

            $user = auth()->user();
            
            if (!Hash::check($request->password, $user->password)) {
                return response()->json([
                    'success' => false,
                    'message' => 'Invalid password'
                ], 401);
            }

            return response()->json([
                'success' => true,
                'message' => 'Password verified'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Password verification failed'
            ], 500);
        }
    }
    
    /**
     * Display a listing of sanctions grouped by events
     */
    public function index(Request $request)
    {
        // Get all sanctions with relationships
        $allSanctions = Sanction::with(['member', 'event'])->get();
        
        // Group sanctions by event
        $eventSanctions = $allSanctions->groupBy('event_id')->map(function ($sanctions, $eventId) {
            return [
                'event_id' => $eventId,
                'event' => $sanctions->first()->event,
                'sanction_count' => $sanctions->count(),
                'total_amount' => $sanctions->sum('amount'),
                'unpaid_amount' => $sanctions->where('status', 'unpaid')->sum('amount'),
            ];
        })->values()->sortByDesc('event.date')->values();
        
        // Calculate totals
        $totalUnpaid = $allSanctions->where('status', 'unpaid')->sum('amount');
        $totalPaid = $allSanctions->where('status', 'paid')->sum('amount');
        
        if ($request->wantsJson()) {
            return response()->json([
                'success' => true,
                'eventSanctions' => $eventSanctions,
                'summary' => [
                    'total_unpaid' => $totalUnpaid,
                    'total_paid' => $totalPaid,
                    'total_count' => $allSanctions->count()
                ]
            ]);
        }
        
        return Inertia::render('Sanctions/Index', [
            'eventSanctions' => $eventSanctions,
            'summary' => [
                'total_sanctions' => $allSanctions->count(),
                'unpaid_sanctions' => $allSanctions->where('status', 'unpaid')->count(),
                'total_unpaid_amount' => $totalUnpaid,
                'total_paid_amount' => $totalPaid
            ]
        ]);
    }
    
    /**
     * Display sanctions for a specific event
     */
    public function eventSanctions(Request $request, $eventId)
    {
        try {
            $event = AttendanceEvent::findOrFail($eventId);
            
            $query = Sanction::with(['member'])
                ->where('event_id', $eventId)
                ->orderBy('created_at', 'desc');
            
            // Get all for summary calculations
            $allSanctions = Sanction::where('event_id', $eventId)->get();
            $totalAmount = $allSanctions->sum('amount');
            $unpaidAmount = $allSanctions->where('status', 'unpaid')->sum('amount');
            
            // Paginate for display (15 per page)
            $sanctions = $query->paginate(15)->withQueryString();
            
            return Inertia::render('Sanctions/EventDetail', [
                'event' => $event,
                'sanctions' => $sanctions,
                'summary' => [
                    'total_sanctions' => $allSanctions->count(),
                    'total_amount' => $totalAmount,
                    'unpaid_amount' => $unpaidAmount,
                    'paid_amount' => $totalAmount - $unpaidAmount
                ]
            ]);
        } catch (\Exception $e) {
            return redirect()->route('sanctions.index')
                ->with('error', 'Event not found');
        }
    }
    
    /**
     * Display the specified sanction
     */
    public function show($sanctionId)
    {
        try {
            $sanction = Sanction::with(['member', 'event'])->findOrFail($sanctionId);
            
            return response()->json([
                'success' => true,
                'sanction' => $sanction
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Sanction not found'
            ], 404);
        }
    }
    
    /**
     * Get sanctions for a specific member
     */
    public function memberSanctions($memberId)
    {
        try {
            $sanctions = Sanction::with(['event'])
                ->where('member_id', $memberId)
                ->orderBy('created_at', 'desc')
                ->get();
            
            $totalUnpaid = $this->sanctionService->getTotalUnpaidForMember($memberId);
            
            return response()->json([
                'success' => true,
                'sanctions' => $sanctions,
                'total_unpaid' => $totalUnpaid
            ]);
        } catch (\Exception $e) {
            Log::error('Failed to get member sanctions', [
                'member_id' => $memberId,
                'error' => $e->getMessage()
            ]);
            
            return response()->json([
                'success' => false,
                'message' => 'Failed to get member sanctions'
            ], 500);
        }
    }
    
    /**
     * Update a sanction
     */
    public function update(Request $request, $sanctionId)
    {
        try {
            $validated = $request->validate([
                'amount' => 'required|numeric|min:0',
                'reason' => 'required|string',
                'status' => 'required|in:paid,unpaid,excused',
            ]);

            $sanction = Sanction::findOrFail($sanctionId);
            
            // If status changed to paid, set payment_date
            if ($validated['status'] === 'paid' && $sanction->status === 'unpaid') {
                $validated['payment_date'] = now();
            }
            
            // If status changed to unpaid, clear payment_date
            if ($validated['status'] === 'unpaid' && $sanction->status === 'paid') {
                $validated['payment_date'] = null;
            }
            
            $sanction->update($validated);
            
            Log::info('Sanction updated', [
                'sanction_id' => $sanctionId,
                'changes' => $validated
            ]);
            
            return response()->json([
                'success' => true,
                'message' => 'Sanction updated successfully',
                'sanction' => $sanction->fresh()
            ]);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            Log::error('Failed to update sanction', [
                'sanction_id' => $sanctionId,
                'error' => $e->getMessage()
            ]);
            
            return response()->json([
                'success' => false,
                'message' => 'Failed to update sanction: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Mark a sanction as paid
     */
    public function markAsPaid(Request $request, $sanctionId)
    {
        try {
            $sanction = Sanction::findOrFail($sanctionId);
            
            if ($sanction->status === 'paid') {
                return response()->json([
                    'success' => false,
                    'message' => 'Sanction is already marked as paid'
                ], 400);
            }
            
            $sanction->markAsPaid();
            
            Log::info('Sanction marked as paid', [
                'sanction_id' => $sanctionId,
                'member_id' => $sanction->member_id,
                'amount' => $sanction->amount
            ]);
            
            return response()->json([
                'success' => true,
                'message' => 'Sanction marked as paid successfully',
                'sanction' => $sanction->fresh()
            ]);
        } catch (\Exception $e) {
            Log::error('Failed to mark sanction as paid', [
                'sanction_id' => $sanctionId,
                'error' => $e->getMessage()
            ]);
            
            return response()->json([
                'success' => false,
                'message' => 'Failed to mark sanction as paid: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Mark a sanction as excused (sets amount to 0 and status to excused)
     */
    public function markAsExcused(Request $request, $sanctionId)
    {
        try {
            $sanction = Sanction::findOrFail($sanctionId);
            
            if ($sanction->status === 'excused') {
                return response()->json([
                    'success' => false,
                    'message' => 'Sanction is already marked as excused'
                ], 400);
            }
            
            $originalAmount = $sanction->amount;
            
            $sanction->update([
                'status' => 'excused',
                'amount' => 0,
                'payment_date' => now()
            ]);
            
            Log::info('Sanction marked as excused', [
                'sanction_id' => $sanctionId,
                'member_id' => $sanction->member_id,
                'original_amount' => $originalAmount,
                'new_amount' => 0
            ]);
            
            return response()->json([
                'success' => true,
                'message' => 'Sanction marked as excused successfully',
                'sanction' => $sanction->fresh()
            ]);
        } catch (\Exception $e) {
            Log::error('Failed to mark sanction as excused', [
                'sanction_id' => $sanctionId,
                'error' => $e->getMessage()
            ]);
            
            return response()->json([
                'success' => false,
                'message' => 'Failed to mark sanction as excused: ' . $e->getMessage()
            ], 500);
        }
    }
    
    /**
     * Delete all sanctions for a specific event
     */
    public function deleteEventSanctions($eventId)
    {
        try {
            $deleted = Sanction::where('event_id', $eventId)->delete();
            
            Log::info('Event sanctions deleted', [
                'event_id' => $eventId,
                'count' => $deleted
            ]);
            
            return response()->json([
                'success' => true,
                'message' => "{$deleted} sanction(s) deleted successfully",
                'deleted_count' => $deleted
            ]);
        } catch (\Exception $e) {
            Log::error('Failed to delete event sanctions', [
                'event_id' => $eventId,
                'error' => $e->getMessage()
            ]);
            
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete sanctions'
            ], 500);
        }
    }

    /**
     * Get sanctions summary statistics
     */
    public function summary()
    {
        try {
            $totalUnpaidAmount = Sanction::unpaid()->sum('amount');
            $totalPaidAmount = Sanction::paid()->sum('amount');
            $unpaidSanctions = Sanction::unpaid()->count();
            $paidSanctions = Sanction::paid()->count();
            $totalSanctions = Sanction::count();
            
            // Get members with unpaid sanctions
            $membersWithUnpaid = Sanction::with('member')
                ->unpaid()
                ->get()
                ->groupBy('member_id')
                ->map(function ($sanctions) {
                    return [
                        'member' => $sanctions->first()->member,
                        'total_unpaid' => $sanctions->sum('amount'),
                        'sanction_count' => $sanctions->count()
                    ];
                })
                ->values();
            
            return response()->json([
                'success' => true,
                'summary' => [
                    'total_unpaid_amount' => $totalUnpaidAmount,
                    'total_paid_amount' => $totalPaidAmount,
                    'unpaid_sanctions' => $unpaidSanctions,
                    'paid_sanctions' => $paidSanctions,
                    'total_sanctions' => $totalSanctions,
                    'members_with_unpaid' => $membersWithUnpaid
                ]
            ]);
        } catch (\Exception $e) {
            Log::error('Failed to get sanctions summary', [
                'error' => $e->getMessage()
            ]);
            
            return response()->json([
                'success' => false,
                'message' => 'Failed to get sanctions summary'
            ], 500);
        }
    }

    /**
     * Export Events with Sanctions to PDF
     */
    public function exportEventsPDF()
    {
        $events = AttendanceEvent::with(['sanctions.member'])
            ->withCount('sanctions')
            ->orderBy('date', 'desc')
            ->get();

        $pdf = Pdf::loadView('pdf.events-with-sanctions', [
            'events' => $events,
            'generatedAt' => now()->format('F d, Y h:i A')
        ]);

        return $pdf->download('events-with-sanctions-' . now()->format('Y-m-d') . '.pdf');
    }

    /**
     * Export Members with Sanctions for specific event to PDF
     */
    public function exportEventSanctionsPDF($eventId)
    {
        $event = AttendanceEvent::findOrFail($eventId);
        
        $sanctions = Sanction::with('member')
            ->where('event_id', $eventId)
            ->orderBy('created_at', 'desc')
            ->get();

        $pdf = Pdf::loadView('pdf.event-sanctions', [
            'event' => $event,
            'sanctions' => $sanctions,
            'generatedAt' => now()->format('F d, Y h:i A')
        ]);

        return $pdf->download('sanctions-' . $event->agenda . '-' . now()->format('Y-m-d') . '.pdf');
    }

    /**
     * Display member sanctions page
     */
    public function memberSanctionsIndex()
    {
        // Get all members with sanctions, grouped by member
        $memberSanctions = Sanction::with('member')
            ->selectRaw('member_id, COUNT(*) as sanction_count, SUM(amount) as total_amount, 
                        SUM(CASE WHEN status = "unpaid" THEN amount ELSE 0 END) as unpaid_amount,
                        SUM(CASE WHEN status = "paid" THEN amount ELSE 0 END) as paid_amount')
            ->groupBy('member_id')
            ->orderByDesc('total_amount')
            ->get()
            ->map(function ($sanction) {
                return [
                    'member_id' => $sanction->member_id,
                    'member_name' => $sanction->member->firstname . ' ' . $sanction->member->lastname,
                    'student_id' => $sanction->member->student_id,
                    'sanction_count' => $sanction->sanction_count,
                    'total_amount' => $sanction->total_amount,
                    'unpaid_amount' => $sanction->unpaid_amount,
                    'paid_amount' => $sanction->paid_amount,
                ];
            });

        $summary = [
            'total_members' => $memberSanctions->count(),
            'total_unpaid' => $memberSanctions->sum('unpaid_amount'),
            'total_paid' => $memberSanctions->sum('paid_amount'),
        ];

        return Inertia::render('Sanctions/MemberSanctions', [
            'memberSanctions' => $memberSanctions,
            'summary' => $summary
        ]);
    }

    /**
     * Display member sanction details
     */
    public function memberSanctionDetails($memberId)
    {
        $member = \App\Models\Member::findOrFail($memberId);
        
        $sanctions = Sanction::with('event')
            ->where('member_id', $memberId)
            ->orderBy('created_at', 'desc')
            ->get();

        $summary = [
            'total_sanctions' => $sanctions->count(),
            'total_amount' => $sanctions->sum('amount'),
            'unpaid_amount' => $sanctions->where('status', 'unpaid')->sum('amount'),
            'paid_amount' => $sanctions->where('status', 'paid')->sum('amount'),
        ];

        return Inertia::render('Sanctions/MemberSanctionDetails', [
            'member' => $member,
            'sanctions' => $sanctions,
            'summary' => $summary
        ]);
    }

    /**
     * Export Member Sanctions to PDF
     */
    public function exportMemberSanctionsPDF()
    {
        $memberSanctions = Sanction::with('member')
            ->selectRaw('member_id, COUNT(*) as sanction_count, SUM(amount) as total_amount, 
                        SUM(CASE WHEN status = "unpaid" THEN amount ELSE 0 END) as unpaid_amount,
                        SUM(CASE WHEN status = "paid" THEN amount ELSE 0 END) as paid_amount')
            ->groupBy('member_id')
            ->orderByDesc('total_amount')
            ->get()
            ->map(function ($sanction) {
                return [
                    'member_name' => $sanction->member->firstname . ' ' . $sanction->member->lastname,
                    'student_id' => $sanction->member->student_id,
                    'sanction_count' => $sanction->sanction_count,
                    'total_amount' => $sanction->total_amount,
                    'unpaid_amount' => $sanction->unpaid_amount,
                    'paid_amount' => $sanction->paid_amount,
                ];
            });

        $pdf = Pdf::loadView('pdf.member-sanctions', [
            'memberSanctions' => $memberSanctions,
            'generatedAt' => now()->format('F d, Y h:i A')
        ]);

        return $pdf->download('member-sanctions-' . now()->format('Y-m-d') . '.pdf');
    }
}
