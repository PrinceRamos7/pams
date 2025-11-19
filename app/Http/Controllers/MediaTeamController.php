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
        
        return Inertia::render('MediaTeam/MediaTeamList', [
            'mediaTeam' => $mediaTeam,
            'batches' => $batches,
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
            'student_id'   => ['nullable', 'unique:media_team,student_id', 'regex:/^\d{2}-\d{5}$/'],
            'firstname'    => ['required', 'string', 'max:255', 'regex:/^[a-zA-Z\s]+$/'],
            'lastname'     => ['required', 'string', 'max:255', 'regex:/^[a-zA-Z\s]+$/'],
            'sex'          => 'required|string|max:10',
            'role'         => 'nullable|string|max:255',
            'specialization' => 'nullable|string|max:255',
            'age'          => 'nullable|integer',
            'birthdate'    => 'nullable|date',
            'phone_number' => ['nullable', 'string', 'regex:/^09\d{9}$/', 'unique:media_team,phone_number'],
            'email'        => 'nullable|email|unique:media_team,email',
            'address'      => 'nullable|string|max:255',
            'year'         => 'nullable|string|max:50',
            'batch_id'     => 'nullable|exists:batches,id',
        ]);

        $validated['status'] = 'Active';

        $mediaTeamMember = MediaTeam::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Media team member added successfully!',
            'data' => $mediaTeamMember
        ]);
    }

    public function update(Request $request, $id)
    {
        $mediaTeamMember = MediaTeam::findOrFail($id);
        
        $validated = $request->validate([
            'student_id'   => ['nullable', 'regex:/^\d{2}-\d{5}$/', 'unique:media_team,student_id,' . $id . ',media_team_id'],
            'firstname'    => ['required', 'string', 'max:255', 'regex:/^[a-zA-Z\s]+$/'],
            'lastname'     => ['required', 'string', 'max:255', 'regex:/^[a-zA-Z\s]+$/'],
            'sex'          => 'required|string|max:10',
            'role'         => 'nullable|string|max:255',
            'specialization' => 'nullable|string|max:255',
            'age'          => 'nullable|integer',
            'birthdate'    => 'nullable|date',
            'phone_number' => ['nullable', 'regex:/^09\d{9}$/', 'unique:media_team,phone_number,' . $id . ',media_team_id'],
            'email'        => ['nullable', 'email', 'unique:media_team,email,' . $id . ',media_team_id'],
            'address'      => 'nullable|string|max:255',
            'year'         => 'nullable|string|max:50',
            'status'       => 'required|in:Active,Inactive,Alumni',
            'batch_id'     => 'nullable|exists:batches,id',
        ]);

        $mediaTeamMember->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Media team member updated successfully!',
            'data' => $mediaTeamMember
        ]);
    }

    public function destroy($id)
    {
        $mediaTeamMember = MediaTeam::findOrFail($id);
        $mediaTeamMember->delete();

        return response()->json([
            'success' => true,
            'message' => 'Media team member deleted successfully!'
        ]);
    }

    public function uploadProfilePicture(Request $request, $id)
    {
        $request->validate([
            'profile_picture' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        $mediaTeamMember = MediaTeam::findOrFail($id);

        if ($request->hasFile('profile_picture')) {
            $file = $request->file('profile_picture');
            $filename = time() . '_' . $file->getClientOriginalName();
            $file->move(public_path('uploads/media_team'), $filename);
            
            if ($mediaTeamMember->profile_picture && file_exists(public_path($mediaTeamMember->profile_picture))) {
                unlink(public_path($mediaTeamMember->profile_picture));
            }
            
            $mediaTeamMember->profile_picture = 'uploads/media_team/' . $filename;
            $mediaTeamMember->save();
        }

        return response()->json([
            'success' => true,
            'message' => 'Profile picture uploaded successfully!',
            'profile_picture' => $mediaTeamMember->profile_picture
        ]);
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
            'members.*.student_id' => ['nullable', 'string', 'regex:/^\d{2}-\d{5}$/', 'unique:media_team,student_id'],
            'members.*.email' => 'nullable|email|unique:media_team,email',
            'members.*.phone_number' => ['nullable', 'regex:/^09\d{9}$/', 'unique:media_team,phone_number'],
            'members.*.year' => 'nullable|string',
            'members.*.batch_id' => 'nullable|exists:batches,id',
        ]);

        $successCount = 0;
        $failedCount = 0;
        $errors = [];

        foreach ($request->members as $index => $memberData) {
            try {
                if (!empty($memberData['student_id'])) {
                    $exists = MediaTeam::where('student_id', $memberData['student_id'])->exists();
                    if ($exists) {
                        $failedCount++;
                        $errors[] = "Row " . ($index + 1) . ": Student ID {$memberData['student_id']} already exists";
                        continue;
                    }
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
