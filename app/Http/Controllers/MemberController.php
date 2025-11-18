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
        $query = Member::with('batch');
        
        // Search functionality - searches across all records
        if ($request->has('search') && $request->search) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('student_id', 'like', "%{$search}%")
                  ->orWhere('firstname', 'like', "%{$search}%")
                  ->orWhere('lastname', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%");
            });
        }
        
        // Year filter
        if ($request->has('year') && $request->year !== 'all') {
            $query->where('year', $request->year);
        }
        
        // Return JSON if requested via AJAX
        if ($request->wantsJson() || $request->expectsJson()) {
            return response()->json($query->get());
        }
        
        // Paginate for Inertia page (10 per page)
        $members = $query->orderBy('created_at', 'desc')->paginate(10)->withQueryString();
        
        // Get all batches for the form
        $batches = \App\Models\Batch::orderBy('year', 'desc')->get();
        
        // Otherwise return Inertia page
        return Inertia::render('Members/MemberList', [
            'members' => $members,
            'batches' => $batches,
            'filters' => $request->only(['search', 'year']),
        ]);
    }

    /**
     * Display members chart organized by year
     */
    public function chart()
    {
        $members = Member::with('batch')
            ->where('status', 'Active')
            ->orderBy('year')
            ->orderBy('lastname')
            ->get();

        return Inertia::render('Members/MembersChart', [
            'members' => $members,
        ]);
    }

    /**
     * Store a newly created member.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'student_id'   => ['nullable', 'unique:members,student_id', 'regex:/^\d{2}-\d{5}$/'],
            'firstname'    => ['required', 'string', 'max:255', 'regex:/^[a-zA-Z\s]+$/'],
            'lastname'     => ['required', 'string', 'max:255', 'regex:/^[a-zA-Z\s]+$/'],
            'sex'          => 'required|string|max:10',
            'age'          => 'nullable|integer',
            'birthdate'    => 'nullable|date',
            'phone_number' => ['nullable', 'string', 'regex:/^09\d{9}$/', 'unique:members,phone_number'],
            'email'        => 'nullable|email|unique:members,email',
            'address'      => 'nullable|string|max:255',
            'year'         => 'nullable|string|max:50',
            'batch_id'     => 'nullable|exists:batches,id',
        ], [
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
    public function update(Request $request, $member_id)
    {
        $member = Member::where('member_id', $member_id)->firstOrFail();
        
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
            'batch_id'     => 'nullable|exists:batches,id',
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
    public function destroy($member_id)
    {
        $member = Member::where('member_id', $member_id)->firstOrFail();
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

    /**
     * Upload profile picture for a member
     */
    public function uploadProfilePicture(Request $request, $memberId)
    {
        try {
            $request->validate([
                'profile_picture' => 'required|image|mimes:jpeg,png,jpg,gif|max:10240', // 10MB max
            ]);

            $member = Member::where('member_id', $memberId)->firstOrFail();

            if ($request->hasFile('profile_picture')) {
                $file = $request->file('profile_picture');
                $filename = 'member_' . $memberId . '_' . time() . '.' . $file->getClientOriginalExtension();
                
                // Store in public/storage/profile_pictures
                $path = $file->storeAs('profile_pictures', $filename, 'public');
                
                // Delete old profile picture if exists
                if ($member->profile_picture) {
                    $oldPath = str_replace('/storage/', '', $member->profile_picture);
                    \Storage::disk('public')->delete($oldPath);
                }
                
                // Update member with new profile picture path
                $member->profile_picture = '/storage/' . $path;
                $member->save();
                
                \Log::info('Profile picture uploaded successfully', [
                    'member_id' => $memberId,
                    'path' => $member->profile_picture
                ]);

                return response()->json([
                    'success' => true,
                    'message' => 'Profile picture uploaded successfully',
                    'profile_picture' => $member->profile_picture
                ]);
            }

            return response()->json([
                'success' => false,
                'message' => 'No file uploaded'
            ], 400);
        } catch (\Exception $e) {
            \Log::error('Profile picture upload error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to upload profile picture: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Bulk import members
     */
    public function bulkImport(Request $request)
    {
        $request->validate([
            'members' => 'required|array',
            'members.*.firstname' => ['required', 'string', 'max:255', 'regex:/^[a-zA-Z\s]+$/'],
            'members.*.lastname' => ['required', 'string', 'max:255', 'regex:/^[a-zA-Z\s]+$/'],
            'members.*.sex' => 'required|in:Male,Female,Others',
            'members.*.year' => 'required|in:First Year,Second Year,Third Year,Fourth Year',
            'members.*.batch_id' => 'required|exists:batches,id',
            'members.*.student_id' => ['nullable', 'string', 'regex:/^\d{2}-\d{5}$/', 'unique:members,student_id'],
            'members.*.email' => 'nullable|email|unique:members,email',
            'members.*.phone_number' => ['nullable', 'regex:/^09\d{9}$/', 'unique:members,phone_number'],
            'members.*.address' => 'nullable|string|max:255',
        ]);

        $successCount = 0;
        $failedCount = 0;
        $errors = [];

        foreach ($request->members as $index => $memberData) {
            try {
                // Check if student_id already exists (if provided)
                if (!empty($memberData['student_id'])) {
                    $exists = Member::where('student_id', $memberData['student_id'])->exists();
                    if ($exists) {
                        $failedCount++;
                        $errors[] = "Row " . ($index + 1) . ": Student ID {$memberData['student_id']} already exists";
                        continue;
                    }
                }

                // Use provided email or generate one
                $email = $memberData['email'] ?? null;
                if (!$email) {
                    $email = strtolower($memberData['firstname'] . '.' . $memberData['lastname'] . '@example.com');
                    $emailCounter = 1;
                    while (Member::where('email', $email)->exists()) {
                        $email = strtolower($memberData['firstname'] . '.' . $memberData['lastname'] . $emailCounter . '@example.com');
                        $emailCounter++;
                    }
                }

                Member::create([
                    'student_id' => $memberData['student_id'] ?? null,
                    'firstname' => $memberData['firstname'],
                    'lastname' => $memberData['lastname'],
                    'sex' => $memberData['sex'],
                    'year' => $memberData['year'],
                    'batch_id' => $memberData['batch_id'],
                    'email' => $email,
                    'phone_number' => $memberData['phone_number'] ?? null,
                    'address' => $memberData['address'] ?? null,
                    'status' => 'Active',
                ]);

                $successCount++;
            } catch (\Exception $e) {
                $failedCount++;
                $errors[] = "Row " . ($index + 1) . ": " . $e->getMessage();
            }
        }

        // Log the import
        \App\Models\BulkMemberImport::create([
            'imported_by' => auth()->id(),
            'total_records' => count($request->members),
            'successful_records' => $successCount,
            'failed_records' => $failedCount,
            'errors' => $failedCount > 0 ? json_encode($errors) : null,
            'status' => $failedCount > 0 ? 'completed_with_errors' : 'completed',
        ]);

        return response()->json([
            'success' => true,
            'message' => "Successfully imported {$successCount} members" . ($failedCount > 0 ? " ({$failedCount} failed)" : ""),
            'data' => [
                'successful' => $successCount,
                'failed' => $failedCount,
                'errors' => $errors,
            ]
        ]);
    }
}
