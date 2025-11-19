<?php

namespace App\Http\Controllers;

use App\Models\MediaTeam;
use Illuminate\Http\Request;
use Inertia\Inertia;

class MediaTeamController extends Controller
{
    public function index(Request $request)
    {
        $query = MediaTeam::with('batch');
        
        if ($request->has('search') && $request->search) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('student_id', 'like', "%{$search}%")
                  ->orWhere('firstname', 'like', "%{$search}%")
                  ->orWhere('lastname', 'like', "%{$search}%")
                  ->orWhere('role', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%");
            });
        }
        
        if ($request->wantsJson() || $request->expectsJson()) {
            return response()->json($query->get());
        }
        
        $mediaTeam = $query->orderBy('created_at', 'desc')->paginate(10)->withQueryString();
        $batches = \App\Models\Batch::orderBy('year', 'desc')->get();
        
        // Get current batch
        $currentBatch = \App\Models\Batch::orderBy('year', 'desc')->first();
        
        // Get members who are not already in media team and from current batch
        $existingMediaTeamStudentIds = MediaTeam::whereNotNull('student_id')->pluck('student_id')->toArray();
        $existingMediaTeamEmails = MediaTeam::whereNotNull('email')->pluck('email')->toArray();
        
        $availableMembers = \App\Models\Member::where('status', 'Active')
            ->where('batch_id', $currentBatch?->id)
            ->where(function($q) use ($existingMediaTeamStudentIds, $existingMediaTeamEmails) {
                $q->whereNotIn('student_id', $existingMediaTeamStudentIds)
                  ->whereNotIn('email', $existingMediaTeamEmails);
            })
            ->orderBy('lastname')
            ->orderBy('firstname')
            ->get();
        
        // Check which leadership roles are already taken
        $hasDirector = MediaTeam::where('role', 'Media Team Director')
            ->where('status', 'Active')
            ->exists();
        
        $hasManagingDirector = MediaTeam::where('role', 'Media Team Managing Director')
            ->where('status', 'Active')
            ->exists();
        
        return Inertia::render('MediaTeam/MediaTeamList', [
            'mediaTeam' => $mediaTeam,
            'batches' => $batches,
            'availableMembers' => $availableMembers,
            'hasDirector' => $hasDirector,
            'hasManagingDirector' => $hasManagingDirector,
            'filters' => $request->only(['search']),
        ]);
    }

    public function chart()
    {
        $mediaTeam = MediaTeam::with('batch')
            ->where('status', 'Active')
            ->orderBy('role')
            ->orderBy('lastname')
            ->get();

        return Inertia::render('MediaTeam/MediaTeamChart', [
            'mediaTeam' => $mediaTeam,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'student_id'   => ['nullable', 'regex:/^\d{2}-\d{5}$/'],
            'firstname'    => ['required', 'string', 'max:255', 'regex:/^[a-zA-Z\s]+$/'],
            'lastname'     => ['required', 'string', 'max:255', 'regex:/^[a-zA-Z\s]+$/'],
            'sex'          => 'required|string|max:10',
            'role'         => 'required|string|max:255',
            'specialization' => 'nullable|string|max:255',
            'age'          => 'nullable|integer',
            'birthdate'    => 'nullable|date',
            'phone_number' => ['nullable', 'string', 'regex:/^09\d{9}$/'],
            'email'        => 'nullable|email',
            'address'      => 'nullable|string|max:255',
            'year'         => 'nullable|string|max:50',
            'batch_id'     => 'nullable|exists:batches,id',
        ]);

        // Check if this member is already in media team (by student_id or email)
        $existingMember = MediaTeam::where(function($q) use ($validated) {
            if (!empty($validated['student_id'])) {
                $q->where('student_id', $validated['student_id']);
            }
            if (!empty($validated['email'])) {
                $q->orWhere('email', $validated['email']);
            }
        })->first();

        if ($existingMember) {
            return back()->withErrors([
                'member' => "This member is already in the media team: {$existingMember->firstname} {$existingMember->lastname}"
            ]);
        }

        // Check if Director or Managing Director role already exists
        if (in_array($validated['role'], ['Media Team Director', 'Media Team Managing Director'])) {
            $existingRole = MediaTeam::where('role', $validated['role'])
                ->where('status', 'Active')
                ->first();
            
            if ($existingRole) {
                return back()->withErrors([
                    'role' => "A {$validated['role']} already exists: {$existingRole->firstname} {$existingRole->lastname}"
                ]);
            }
        }

        $validated['status'] = 'Active';

        MediaTeam::create($validated);

        return redirect()->route('media-team.index');
    }

    public function update(Request $request, $id)
    {
        $mediaTeamMember = MediaTeam::findOrFail($id);
        
        $validated = $request->validate([
            'student_id'   => ['nullable', 'regex:/^\d{2}-\d{5}$/'],
            'firstname'    => ['required', 'string', 'max:255', 'regex:/^[a-zA-Z\s]+$/'],
            'lastname'     => ['required', 'string', 'max:255', 'regex:/^[a-zA-Z\s]+$/'],
            'sex'          => 'required|string|max:10',
            'role'         => 'required|string|max:255',
            'specialization' => 'nullable|string|max:255',
            'age'          => 'nullable|integer',
            'birthdate'    => 'nullable|date',
            'phone_number' => ['nullable', 'regex:/^09\d{9}$/'],
            'email'        => ['nullable', 'email'],
            'address'      => 'nullable|string|max:255',
            'year'         => 'nullable|string|max:50',
            'status'       => 'required|in:Active,Inactive,Alumni',
            'batch_id'     => 'nullable|exists:batches,id',
        ]);

        // Check if Director or Managing Director role already exists (excluding current member)
        if (in_array($validated['role'], ['Media Team Director', 'Media Team Managing Director'])) {
            $existingRole = MediaTeam::where('role', $validated['role'])
                ->where('status', 'Active')
                ->where('media_team_id', '!=', $id)
                ->first();
            
            if ($existingRole) {
                return back()->withErrors([
                    'role' => "A {$validated['role']} already exists: {$existingRole->firstname} {$existingRole->lastname}"
                ]);
            }
        }

        $mediaTeamMember->update($validated);

        return redirect()->route('media-team.index');
    }

    public function destroy($id)
    {
        $mediaTeamMember = MediaTeam::findOrFail($id);
        $mediaTeamMember->delete();

        return redirect()->route('media-team.index');
    }

    public function uploadProfilePicture(Request $request, $id)
    {
        $request->validate([
            'profile_picture' => 'required|image|mimes:jpeg,png,jpg,gif,webp|max:51200', // 50MB max
        ]);

        $mediaTeamMember = MediaTeam::findOrFail($id);

        if ($request->hasFile('profile_picture')) {
            // Create directory if it doesn't exist
            $uploadPath = public_path('uploads/media_team');
            if (!file_exists($uploadPath)) {
                mkdir($uploadPath, 0755, true);
            }

            $file = $request->file('profile_picture');
            $filename = time() . '_' . preg_replace('/[^a-zA-Z0-9._-]/', '', $file->getClientOriginalName());
            $file->move($uploadPath, $filename);
            
            // Delete old picture if exists
            if ($mediaTeamMember->profile_picture) {
                $oldPath = public_path(ltrim($mediaTeamMember->profile_picture, '/'));
                if (file_exists($oldPath)) {
                    unlink($oldPath);
                }
            }
            
            $mediaTeamMember->profile_picture = '/uploads/media_team/' . $filename;
            $mediaTeamMember->save();
        }

        return back();
    }

    public function bulkAdd(Request $request)
    {
        $request->validate([
            'members' => 'required|array|min:1',
            'members.*.firstname' => ['required', 'string', 'max:255', 'regex:/^[a-zA-Z\s]+$/'],
            'members.*.lastname' => ['required', 'string', 'max:255', 'regex:/^[a-zA-Z\s]+$/'],
            'members.*.sex' => 'required|in:Male,Female,Others',
            'members.*.role' => 'required|string|max:255',
            'members.*.specialization' => 'nullable|string|max:255',
            'members.*.student_id' => ['nullable', 'string', 'regex:/^\d{2}-\d{5}$/'],
            'members.*.email' => 'nullable|email',
            'members.*.phone_number' => ['nullable', 'regex:/^09\d{9}$/'],
            'members.*.year' => 'nullable|string',
            'members.*.batch_id' => 'nullable|exists:batches,id',
        ]);

        $successCount = 0;
        $failedCount = 0;
        $errors = [];

        foreach ($request->members as $index => $memberData) {
            try {
                // Check if member already exists in media team
                $exists = MediaTeam::where(function($q) use ($memberData) {
                    if (!empty($memberData['student_id'])) {
                        $q->where('student_id', $memberData['student_id']);
                    }
                    if (!empty($memberData['email'])) {
                        $q->orWhere('email', $memberData['email']);
                    }
                })->exists();

                if ($exists) {
                    $failedCount++;
                    $errors[] = "Member " . ($index + 1) . ": Already exists in media team";
                    continue;
                }

                // Check if Director or Managing Director role already exists
                if (in_array($memberData['role'], ['Media Team Director', 'Media Team Managing Director'])) {
                    $existingRole = MediaTeam::where('role', $memberData['role'])
                        ->where('status', 'Active')
                        ->first();
                    
                    if ($existingRole) {
                        $failedCount++;
                        $errors[] = "Member " . ($index + 1) . ": {$memberData['role']} already exists";
                        continue;
                    }
                }

                MediaTeam::create([
                    'student_id' => $memberData['student_id'] ?? null,
                    'firstname' => $memberData['firstname'],
                    'lastname' => $memberData['lastname'],
                    'sex' => $memberData['sex'],
                    'role' => $memberData['role'],
                    'specialization' => $memberData['specialization'] ?? null,
                    'year' => $memberData['year'] ?? null,
                    'batch_id' => $memberData['batch_id'] ?? null,
                    'email' => $memberData['email'] ?? null,
                    'phone_number' => $memberData['phone_number'] ?? null,
                    'address' => $memberData['address'] ?? null,
                    'status' => 'Active',
                ]);

                $successCount++;
            } catch (\Exception $e) {
                $failedCount++;
                $errors[] = "Member " . ($index + 1) . ": " . $e->getMessage();
            }
        }

        if ($failedCount > 0) {
            return back()->withErrors(['bulk' => implode(', ', $errors)]);
        }

        return redirect()->route('media-team.index');
    }

    public function bulkImport(Request $request)
    {
        $request->validate([
            'members' => 'required|array',
            'members.*.firstname' => ['required', 'string', 'max:255', 'regex:/^[a-zA-Z\s]+$/'],
            'members.*.lastname' => ['required', 'string', 'max:255', 'regex:/^[a-zA-Z\s]+$/'],
            'members.*.sex' => 'required|in:Male,Female,Others',
            'members.*.role' => 'nullable|string|max:255',
            'members.*.specialization' => 'nullable|string|max:255',
            'members.*.student_id' => ['nullable', 'string', 'regex:/^\d{2}-\d{5}$/'],
            'members.*.email' => 'nullable|email',
            'members.*.phone_number' => ['nullable', 'regex:/^09\d{9}$/'],
            'members.*.year' => 'nullable|string',
            'members.*.batch_id' => 'nullable|exists:batches,id',
        ]);

        $successCount = 0;
        $failedCount = 0;
        $errors = [];

        foreach ($request->members as $index => $memberData) {
            try {
                // Check if member already exists in media team
                $exists = MediaTeam::where(function($q) use ($memberData) {
                    if (!empty($memberData['student_id'])) {
                        $q->where('student_id', $memberData['student_id']);
                    }
                    if (!empty($memberData['email'])) {
                        $q->orWhere('email', $memberData['email']);
                    }
                })->exists();

                if ($exists) {
                    $failedCount++;
                    $errors[] = "Row " . ($index + 1) . ": Member already exists in media team";
                    continue;
                }

                $email = $memberData['email'] ?? null;
                if (!$email) {
                    $email = strtolower($memberData['firstname'] . '.' . $memberData['lastname'] . '@mediateam.com');
                    $emailCounter = 1;
                    while (MediaTeam::where('email', $email)->exists()) {
                        $email = strtolower($memberData['firstname'] . '.' . $memberData['lastname'] . $emailCounter . '@mediateam.com');
                        $emailCounter++;
                    }
                }

                MediaTeam::create([
                    'student_id' => $memberData['student_id'] ?? null,
                    'firstname' => $memberData['firstname'],
                    'lastname' => $memberData['lastname'],
                    'sex' => $memberData['sex'],
                    'role' => $memberData['role'] ?? null,
                    'specialization' => $memberData['specialization'] ?? null,
                    'year' => $memberData['year'] ?? null,
                    'batch_id' => $memberData['batch_id'] ?? null,
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
