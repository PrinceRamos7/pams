<?php

namespace App\Http\Controllers;

use App\Models\Member;
use Illuminate\Http\Request;
use Inertia\Inertia;

class MemberController extends Controller
{
    /**
     * Display a listing of the members.
     */
    public function index(Request $request)
    {
        $query = Member::query();
        
        // Search functionality
        if ($request->has('search') && $request->search) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('student_id', 'like', "%{$search}%")
                  ->orWhere('firstname', 'like', "%{$search}%")
                  ->orWhere('lastname', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%");
            });
        }
        
        // Return JSON if requested via AJAX
        if ($request->wantsJson() || $request->expectsJson()) {
            return response()->json($query->get());
        }
        
        // Paginate for Inertia page (10 per page)
        $members = $query->orderBy('created_at', 'desc')->paginate(10)->withQueryString();
        
        // Otherwise return Inertia page
        return Inertia::render('Members/MemberList', [
            'members' => $members,
            'filters' => $request->only(['search']),
        ]);
    }

    /**
     * Store a newly created member.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'student_id'   => ['required', 'unique:members,student_id', 'regex:/^\d{2}-\d{5}$/'],
            'firstname'    => ['required', 'string', 'max:255', 'regex:/^[a-zA-Z\s]+$/'],
            'lastname'     => ['required', 'string', 'max:255', 'regex:/^[a-zA-Z\s]+$/'],
            'sex'          => 'required|string|max:10',
            'age'          => 'nullable|integer',
            'birthdate'    => 'nullable|date',
            'phone_number' => ['nullable', 'string', 'regex:/^09\d{9}$/', 'unique:members,phone_number'],
            'email'        => 'nullable|email|unique:members,email',
            'address'      => 'nullable|string|max:255',
            'year'         => 'nullable|string|max:50',
        ], [
            'student_id.required' => 'Student ID is required.',
            'student_id.unique' => 'This Student ID is already registered.',
            'student_id.regex' => 'Student ID must be in format XX-XXXXX (e.g., 23-00001).',
            'firstname.required' => 'First name is required.',
            'firstname.regex' => 'First name must contain only letters and spaces.',
            'lastname.required' => 'Last name is required.',
            'lastname.regex' => 'Last name must contain only letters and spaces.',
            'phone_number.regex' => 'Phone number must be 11 digits starting with 09.',
            'phone_number.unique' => 'This phone number is already registered.',
            'email.unique' => 'This email address is already registered.',
            'sex.required' => 'Sex is required.',
        ]);

        // Set status to Active by default
        $validated['status'] = 'Active';

        Member::create($validated);

        return redirect()->back()->with('success', 'Member added successfully!');
    }

    /**
     * Display the specified member.
     */
    public function show(Member $member)
    {
        return response()->json($member);
    }

    /**
     * Update the specified member.
     */
    public function update(Request $request, $member)
    {
        $member = Member::where('member_id', $member)->firstOrFail();
        
        $validated = $request->validate([
            'student_id'   => ['required', 'unique:members,student_id,' . $member->member_id . ',member_id', 'regex:/^\d{2}-\d{5}$/'],
            'firstname'    => ['required', 'string', 'max:255', 'regex:/^[a-zA-Z\s]+$/'],
            'lastname'     => ['required', 'string', 'max:255', 'regex:/^[a-zA-Z\s]+$/'],
            'sex'          => 'required|string|max:10',
            'status'       => 'required|string|max:20',
            'age'          => 'nullable|integer',
            'birthdate'    => 'nullable|date',
            'phone_number' => ['nullable', 'string', 'regex:/^09\d{9}$/', 'unique:members,phone_number,' . $member->member_id . ',member_id'],
            'email'        => 'nullable|email|unique:members,email,' . $member->member_id . ',member_id',
            'address'      => 'nullable|string|max:255',
            'year'         => 'nullable|string|max:50',
        ], [
            'student_id.required' => 'Student ID is required.',
            'student_id.unique' => 'This Student ID is already registered.',
            'student_id.regex' => 'Student ID must be in format XX-XXXXX (e.g., 23-00001).',
            'firstname.required' => 'First name is required.',
            'firstname.regex' => 'First name must contain only letters and spaces.',
            'lastname.required' => 'Last name is required.',
            'lastname.regex' => 'Last name must contain only letters and spaces.',
            'phone_number.regex' => 'Phone number must be 11 digits starting with 09.',
            'phone_number.unique' => 'This phone number is already registered.',
            'email.unique' => 'This email address is already registered.',
            'sex.required' => 'Sex is required.',
            'status.required' => 'Status is required.',
        ]);

        $member->update($validated);

        return redirect()->back()->with('success', 'Member updated successfully!');
    }

    /**
     * Remove the specified member.
     */
    public function destroy($member)
    {
        $member = Member::where('member_id', $member)->firstOrFail();
        $member->delete();
        return redirect()->back()->with('success', 'Member deleted successfully!');
    }

    /**
     * Export Members List to PDF
     */
    public function exportPDF()
    {
        try {
            \Log::info('PDF Export started');
            
            $members = Member::orderBy('lastname', 'asc')
                ->orderBy('firstname', 'asc')
                ->get();

            \Log::info('PDF Export - Member count: ' . $members->count());
            
            if ($members->isEmpty()) {
                \Log::warning('PDF Export - No members found');
                return redirect()->back()->with('error', 'No members found to export.');
            }

            \Log::info('PDF Export - Loading view');
            
            $data = [
                'members' => $members,
                'generatedAt' => now()->format('F d, Y h:i A')
            ];
            
            $pdf = \Barryvdh\DomPDF\Facade\Pdf::loadView('pdf.members-list', $data);
            
            \Log::info('PDF Export - View loaded, setting paper');
            
            $pdf->setPaper('A4', 'landscape');
            
            \Log::info('PDF Export - Downloading PDF');

            return $pdf->download('members-list-' . now()->format('Y-m-d') . '.pdf');
        } catch (\Exception $e) {
            \Log::error('PDF Export Error: ' . $e->getMessage());
            \Log::error('PDF Export Stack: ' . $e->getTraceAsString());
            return response()->json([
                'error' => 'Failed to generate PDF',
                'message' => $e->getMessage()
            ], 500);
        }
    }
}
