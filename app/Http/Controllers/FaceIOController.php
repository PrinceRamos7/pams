<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Member;
use App\Models\User;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;

class FaceIOController extends Controller
{
    /**
     * Enroll a member's face with face-api.js
     */
    public function enrollMember(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'member_id' => 'required|exists:members,member_id',
                'face_id' => 'required|string',
                'face_descriptor' => 'required|array'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422);
            }

            $member = Member::findOrFail($request->member_id);
            
            // Store face ID and descriptor
            $member->faceio_id = $request->face_id;
            $member->face_descriptor = json_encode($request->face_descriptor);
            $member->save();

            Log::info('Member face enrolled', [
                'member_id' => $member->member_id,
                'face_id' => $request->face_id
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Face enrolled successfully',
                'member' => $member
            ]);

        } catch (\Exception $e) {
            Log::error('Face enrollment failed', ['error' => $e->getMessage()]);
            return response()->json([
                'success' => false,
                'message' => 'Face enrollment failed: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get all enrolled faces for authentication
     */
    public function getEnrolledFaces()
    {
        try {
            $members = Member::whereNotNull('face_descriptor')
                ->whereNotNull('faceio_id')
                ->get(['member_id', 'student_id', 'firstname', 'lastname', 'faceio_id', 'face_descriptor']);

            $enrolledFaces = $members->map(function ($member) {
                return [
                    'faceId' => $member->faceio_id,
                    'descriptor' => json_decode($member->face_descriptor),
                    'member' => [
                        'member_id' => $member->member_id,
                        'student_id' => $member->student_id,
                        'firstname' => $member->firstname,
                        'lastname' => $member->lastname,
                    ]
                ];
            });

            return response()->json([
                'success' => true,
                'faces' => $enrolledFaces
            ]);

        } catch (\Exception $e) {
            Log::error('Failed to get enrolled faces', ['error' => $e->getMessage()]);
            return response()->json([
                'success' => false,
                'message' => 'Failed to get enrolled faces: ' . $e->getMessage()
            ], 500);
        }
    }
    
    /**
     * Authenticate a member using face ID
     */
    public function authenticateMember(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'face_id' => 'required|string'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422);
            }

            $member = Member::where('faceio_id', $request->face_id)->first();

            if (!$member) {
                return response()->json([
                    'success' => false,
                    'message' => 'Face not recognized. Please enroll first.'
                ], 404);
            }

            Log::info('Member authenticated via face recognition', [
                'member_id' => $member->member_id,
                'face_id' => $request->face_id
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Face authenticated successfully',
                'member' => $member
            ]);

        } catch (\Exception $e) {
            Log::error('Face authentication failed', ['error' => $e->getMessage()]);
            return response()->json([
                'success' => false,
                'message' => 'Face authentication failed: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Remove FaceIO enrollment from a member
     */
    public function unenrollMember(Request $request, $memberId)
    {
        try {
            $member = Member::findOrFail($memberId);
            
            $oldFaceioId = $member->faceio_id;
            $member->faceio_id = null;
            $member->save();

            Log::info('Member face unenrolled', [
                'member_id' => $member->member_id,
                'old_faceio_id' => $oldFaceioId
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Face enrollment removed successfully'
            ]);

        } catch (\Exception $e) {
            Log::error('Face unenrollment failed', ['error' => $e->getMessage()]);
            return response()->json([
                'success' => false,
                'message' => 'Face unenrollment failed: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Check if a member has FaceIO enrolled
     */
    public function checkEnrollment($memberId)
    {
        try {
            $member = Member::findOrFail($memberId);

            return response()->json([
                'success' => true,
                'enrolled' => !empty($member->faceio_id),
                'faceio_id' => $member->faceio_id
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to check enrollment: ' . $e->getMessage()
            ], 500);
        }
    }
    
    /**
     * Verify member by student ID
     */
    public function verifyByStudentId($studentId)
    {
        try {
            $member = Member::where('student_id', $studentId)->first();

            if (!$member) {
                return response()->json([
                    'success' => false,
                    'message' => 'Student ID not found'
                ], 404);
            }

            // Check if face is registered
            $faceRegistered = !empty($member->faceio_id) && !empty($member->face_descriptor);

            return response()->json([
                'success' => true,
                'member' => [
                    'member_id' => $member->member_id,
                    'student_id' => $member->student_id,
                    'firstname' => $member->firstname,
                    'lastname' => $member->lastname,
                    'email' => $member->email,
                    'year' => $member->year,
                    'status' => $member->status,
                    'face_registered' => $faceRegistered
                ],
                'face_registered' => $faceRegistered
            ]);

        } catch (\Exception $e) {
            Log::error('Failed to verify student ID', [
                'student_id' => $studentId,
                'error' => $e->getMessage()
            ]);
            
            return response()->json([
                'success' => false,
                'message' => 'Failed to verify student ID: ' . $e->getMessage()
            ], 500);
        }
    }
}
