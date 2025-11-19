<?php

namespace App\Http\Controllers;

use App\Models\Member;
use App\Models\MemberHistory;
use App\Models\Batch;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Barryvdh\DomPDF\Facade\Pdf;

class MemberHistoryController extends Controller
{
    /**
     * Display member history grouped by batch
     */
    public function index()
    {
        // Get all batches with their members (including officers) and history
        $batches = Batch::with(['members' => function($query) {
            $query->with(['history' => function($q) {
                $q->with('user')->orderBy('created_at', 'desc');
            }, 'officer'])->orderBy('firstname');
        }])->orderBy('year', 'desc')->get();

        // Also get officers history data for each batch
        $officersHistory = \App\Models\OfficerHistory::with('member')
            ->whereNotNull('batch_id')
            ->get()
            ->groupBy('batch_id');

        // Get current officers from officers table
        $currentOfficers = \App\Models\Officer::with('member')
            ->whereNotNull('batch_id')
            ->get()
            ->groupBy('batch_id');

        // Format data for frontend
        $formattedBatches = $batches->map(function ($batch) use ($officersHistory, $currentOfficers) {
            // Get officers history for this batch
            $batchOfficersHistory = $officersHistory->get($batch->id, collect());
            
            // Get current officers for this batch
            $batchCurrentOfficers = $currentOfficers->get($batch->id, collect());
            
            // Combine regular members with officers from history
            $allMembers = $batch->members->map(function ($member) use ($batch) {
                    $position = $member->officer ? $member->officer->position : 'Member';
                    
                    return [
                        'member_id' => $member->member_id,
                        'student_id' => $member->student_id,
                        'name' => $member->firstname . ' ' . $member->lastname,
                        'firstname' => $member->firstname,
                        'lastname' => $member->lastname,
                        'sex' => $member->sex,
                        'year' => $member->year,
                        'status' => $member->status,
                        'batch_id' => $batch->id,
                        'position' => $position,
                        'is_officer' => $member->officer ? true : false,
                        'officer_position' => $member->officer ? $member->officer->position : null,
                        'source' => 'member',
                        'history' => $member->history->map(function ($history) use ($position, $member) {
                            // Add position and status to history display
                            $newValues = $history->new_values;
                            if ($newValues && is_array($newValues)) {
                                $newValues['position'] = $position;
                                $newValues['status'] = $member->status;
                            }
                            
                            return [
                                'id' => $history->id,
                                'action' => $history->action,
                                'description' => $history->description,
                                'old_values' => $history->old_values,
                                'new_values' => $newValues,
                                'user_name' => $history->user ? $history->user->name : 'System',
                                'created_at' => $history->created_at->format('M d, Y h:i A'),
                                'created_at_human' => $history->created_at->diffForHumans(),
                            ];
                        })
                    ];
            });

            // Add current officers from officers table
            $currentOfficersData = $batchCurrentOfficers->map(function ($officer) {
                if ($officer->member) {
                    return [
                        'member_id' => $officer->member->member_id,
                        'student_id' => $officer->member->student_id,
                        'name' => $officer->member->firstname . ' ' . $officer->member->lastname,
                        'year' => $officer->member->year ?? 'N/A',
                        'status' => $officer->member->status ?? 'Active',
                        'position' => $officer->position,
                        'is_officer' => true,
                        'officer_position' => $officer->position,
                        'source' => 'current_officer',
                        'history' => collect([[
                            'id' => $officer->officer_id,
                            'action' => 'current_officer',
                            'description' => 'Current Officer: ' . $officer->position,
                            'old_values' => null,
                            'new_values' => [
                                'position' => $officer->position,
                                'status' => $officer->member->status ?? 'Active',
                            ],
                            'user_name' => 'System',
                            'created_at' => $officer->created_at->format('M d, Y h:i A'),
                            'created_at_human' => $officer->created_at->diffForHumans(),
                        ]])
                    ];
                }
                return null;
            })->filter();

            // Add officers from officers_history table
            $officersFromHistory = $batchOfficersHistory->map(function ($officerHistory) {
                // Handle cases where member might be null (graduated/alumni)
                if ($officerHistory->member) {
                    $memberName = $officerHistory->member->firstname . ' ' . $officerHistory->member->lastname;
                    $studentId = $officerHistory->member->student_id;
                    $memberId = $officerHistory->member->member_id;
                } else {
                    // Extract from notes field
                    $notes = $officerHistory->notes ?: 'Unknown';
                    if (preg_match('/^(.+?)\s*\(([^)]+)\)$/', $notes, $matches)) {
                        $memberName = $matches[1];
                        $studentId = $matches[2];
                    } else {
                        $memberName = $notes;
                        $studentId = 'N/A';
                    }
                    $memberId = null;
                }

                return [
                    'member_id' => $memberId,
                    'student_id' => $studentId,
                    'name' => $memberName,
                    'year' => 'N/A',
                    'status' => $officerHistory->status ?? 'Alumni',
                    'position' => $officerHistory->position,
                    'is_officer' => true,
                    'officer_position' => $officerHistory->position,
                    'source' => 'officer_history',
                    'history' => collect([[
                        'id' => $officerHistory->history_id,
                        'action' => 'officer_record',
                        'description' => 'Officer position: ' . $officerHistory->position,
                        'old_values' => null,
                        'new_values' => [
                            'position' => $officerHistory->position,
                            'status' => $officerHistory->status ?? 'Alumni',
                        ],
                        'user_name' => 'System',
                        'created_at' => $officerHistory->created_at->format('M d, Y h:i A'),
                        'created_at_human' => $officerHistory->created_at->diffForHumans(),
                    ]])
                ];
            });

            // Merge members, current officers, and officers from history
            $combinedMembers = $allMembers
                ->concat($currentOfficersData)
                ->concat($officersFromHistory);
            
            // Remove duplicates: if same student_id exists in both, keep the member version
            $uniqueMembers = collect();
            $seenKeys = [];
            
            foreach ($combinedMembers as $item) {
                $key = $item['student_id'] . '|' . $item['name'];
                
                if (!isset($seenKeys[$key])) {
                    $uniqueMembers->push($item);
                    $seenKeys[$key] = true;
                } else {
                    // If we've seen this key and current item is from member table, replace it
                    if ($item['source'] === 'member') {
                        $uniqueMembers = $uniqueMembers->reject(function ($existing) use ($key) {
                            return ($existing['student_id'] . '|' . $existing['name']) === $key;
                        });
                        $uniqueMembers->push($item);
                    }
                }
            }
            
            $combinedMembers = $uniqueMembers->sortBy('name')->values();

            return [
                'id' => $batch->id,
                'name' => $batch->name,
                'year' => $batch->year,
                'member_count' => $combinedMembers->count(),
                'members' => $combinedMembers
            ];
        });

        // Add members without batch_id (unassigned members)
        $unassignedMembers = Member::with(['history' => function($q) {
            $q->with('user')->orderBy('created_at', 'desc');
        }, 'officer'])
        ->whereNull('batch_id')
        ->orderBy('firstname')
        ->get();

        if ($unassignedMembers->count() > 0) {
            $unassignedMembersData = $unassignedMembers->map(function ($member) {
                $position = $member->officer ? $member->officer->position : 'Member';
                
                return [
                    'member_id' => $member->member_id,
                    'student_id' => $member->student_id,
                    'name' => $member->firstname . ' ' . $member->lastname,
                    'firstname' => $member->firstname,
                    'lastname' => $member->lastname,
                    'sex' => $member->sex,
                    'year' => $member->year,
                    'status' => $member->status,
                    'batch_id' => $member->batch_id,
                    'position' => $position,
                    'is_officer' => $member->officer ? true : false,
                    'officer_position' => $member->officer ? $member->officer->position : null,
                    'source' => 'member',
                    'history' => $member->history->map(function ($history) use ($position, $member) {
                        $newValues = $history->new_values;
                        if ($newValues && is_array($newValues)) {
                            $newValues['position'] = $position;
                            $newValues['status'] = $member->status;
                        }
                        
                        return [
                            'id' => $history->id,
                            'action' => $history->action,
                            'description' => $history->description,
                            'old_values' => $history->old_values,
                            'new_values' => $newValues,
                            'user_name' => $history->user ? $history->user->name : 'System',
                            'created_at' => $history->created_at->format('M d, Y h:i A'),
                            'created_at_human' => $history->created_at->diffForHumans(),
                        ];
                    })
                ];
            });

            // Add unassigned members as a separate batch
            $formattedBatches->push([
                'id' => 0,
                'name' => 'Unassigned Members',
                'year' => date('Y'),
                'member_count' => $unassignedMembersData->count(),
                'members' => $unassignedMembersData
            ]);
        }

        return Inertia::render('Members/MemberHistory', [
            'batches' => $formattedBatches
        ]);
    }

    /**
     * Display history for a specific member
     */
    public function show($memberId)
    {
        $member = Member::with(['history' => function($query) {
            $query->with('user')->orderBy('created_at', 'desc');
        }, 'batch'])->findOrFail($memberId);

        $history = $member->history->map(function ($h) {
            return [
                'id' => $h->id,
                'action' => $h->action,
                'description' => $h->description,
                'old_values' => $h->old_values,
                'new_values' => $h->new_values,
                'user_name' => $h->user ? $h->user->name : 'System',
                'created_at' => $h->created_at->format('M d, Y h:i A'),
                'created_at_human' => $h->created_at->diffForHumans(),
            ];
        });

        return response()->json([
            'success' => true,
            'member' => [
                'member_id' => $member->member_id,
                'student_id' => $member->student_id,
                'name' => $member->firstname . ' ' . $member->lastname,
                'year' => $member->year,
                'status' => $member->status,
                'batch' => $member->batch ? $member->batch->name : 'No Batch',
            ],
            'history' => $history
        ]);
    }

    /**
     * Export member history to PDF
     */
    public function exportPDF()
    {
        $batches = Batch::with(['members' => function($query) {
            $query->with(['history' => function($q) {
                $q->with('user')->orderBy('created_at', 'desc');
            }])->orderBy('firstname');
        }])->orderBy('year', 'desc')->get();

        $pdf = Pdf::loadView('pdf.member-history', [
            'batches' => $batches,
            'generatedAt' => now()->format('F d, Y h:i A')
        ]);

        $pdf->setPaper('A4', 'landscape');

        return $pdf->download('member-history-' . now()->format('Y-m-d') . '.pdf');
    }
}
