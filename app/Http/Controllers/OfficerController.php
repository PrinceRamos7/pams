<?php

namespace App\Http\Controllers;

use App\Models\Officer;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class OfficerController extends Controller
{
    // Position order for sorting
    private function getPositionOrder()
    {
        return [
            'President' => 1,
            'Vice President - Internal' => 2,
            'Vice President - External' => 3,
            'Secretary' => 4,
            'Treasurer' => 5,
            'Auditor' => 6,
            'Business Manager' => 7,
            'Public Information Officer (PIO)' => 8,
            'Attendance Officer' => 9,
            'PITON Representative' => 10,
            'Media Team Director' => 11,
            'Media Team Managing Director' => 12,
        ];
    }

    // Display officers list page
    public function index()
    {
        $officers = Officer::with(['member', 'batch'])->get();
        
        $positionOrder = $this->getPositionOrder();
        
        $officersData = $officers->map(function ($officer) {
            return [
                'officer_id' => $officer->officer_id,
                'position' => $officer->position,
                'member_id' => $officer->member->member_id,
                'member_name' => $officer->member->firstname . ' ' . $officer->member->lastname,
                'batch_name' => $officer->batch ? $officer->batch->name : 'N/A',
                'created_at' => $officer->created_at,
            ];
        })->sortBy(function ($officer) use ($positionOrder) {
            return $positionOrder[$officer['position']] ?? 999;
        })->values();
        
        return inertia('Officers/OfficersList', [
            'officers' => $officersData
        ]);
    }

    // Return current officers
    public function current()
    {
        try {
            $officers = Officer::with(['member', 'batch'])
                ->get();

            $positionOrder = $this->getPositionOrder();

            $data = $officers->map(function ($officer) {
                $batchName = 'N/A';
                if ($officer->batch_id) {
                    $batch = \App\Models\Batch::find($officer->batch_id);
                    if ($batch) {
                        $batchName = $batch->name;
                    }
                }
                
                return [
                    'officer_id' => $officer->officer_id,
                    'position' => $officer->position,
                    'member_id' => $officer->member->member_id,
                    'member_name' => $officer->member->firstname . ' ' . $officer->member->lastname,
                    'batch_name' => $batchName,
                    'created_at' => $officer->created_at,
                ];
            })->sortBy(function ($officer) use ($positionOrder) {
                return $positionOrder[$officer['position']] ?? 999;
            })->values();

            return response()->json($data);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to fetch officers', 'message' => $e->getMessage()], 500);
        }
    }

    // Store new officer
    public function store(Request $request)
    {
        // Positions that can have 2 members
        $multiMemberPositions = ['Public Information Officer (PIO)', 'Business Manager'];
        
        // Check if position allows multiple members
        $positionCount = Officer::where('position', $request->position)->count();
        
        if (in_array($request->position, $multiMemberPositions)) {
            // PIO and Business Manager can have up to 2 members
            if ($positionCount >= 2) {
                return redirect()->back()->withErrors([
                    'position' => 'This position already has 2 members assigned.'
                ]);
            }
        } else {
            // All other positions can only have 1 member
            if ($positionCount >= 1) {
                return redirect()->back()->withErrors([
                    'position' => 'This position is already assigned to another officer.'
                ]);
            }
        }
        
        $request->validate([
            'member_id' => 'required|exists:members,member_id|unique:officers,member_id',
            'position' => 'required|string|max:255',
        ], [
            'member_id.unique' => 'This member already holds an officer position.',
        ]);

        $officer = Officer::create([
            'member_id' => $request->member_id,
            'position' => $request->position,
        ]);

        // Reload officers data with sorting
        $officers = Officer::with('member')->get();
        $positionOrder = $this->getPositionOrder();
        
        $data = $officers->map(function ($officer) {
            return [
                'officer_id' => $officer->officer_id,
                'position' => $officer->position,
                'member_id' => $officer->member->member_id,
                'member_name' => $officer->member->firstname . ' ' . $officer->member->lastname,
                'batch_name' => '',
                'created_at' => $officer->created_at,
            ];
        })->sortBy(function ($officer) use ($positionOrder) {
            return $positionOrder[$officer['position']] ?? 999;
        })->values();

        return redirect()->back()->with([
            'success' => 'Officer added successfully!',
            'officers' => $data
        ]);
    }

    // Show specific officer
    public function show($id)
    {
        $officer = Officer::findOrFail($id);
        return response()->json($officer->load('member'));
    }

    // Update officer
    public function update(Request $request, $id)
    {
        $officer = Officer::findOrFail($id);
        
        $request->validate([
            'member_id' => [
                'required',
                'exists:members,member_id',
                Rule::unique('officers', 'member_id')->ignore($officer->officer_id, 'officer_id'),
            ],
        ], [
            'member_id.unique' => 'This member already holds an officer position.',
        ]);

        $officer->update($request->only('member_id'));

        // Reload officers data with sorting
        $officers = Officer::with('member')->get();
        $positionOrder = $this->getPositionOrder();
        
        $data = $officers->map(function ($officer) {
            return [
                'officer_id' => $officer->officer_id,
                'position' => $officer->position,
                'member_id' => $officer->member->member_id,
                'member_name' => $officer->member->firstname . ' ' . $officer->member->lastname,
                'batch_name' => '',
                'created_at' => $officer->created_at,
            ];
        })->sortBy(function ($officer) use ($positionOrder) {
            return $positionOrder[$officer['position']] ?? 999;
        })->values();

        return redirect()->back()->with([
            'success' => 'Officer updated successfully!',
            'officers' => $data
        ]);
    }

    // Delete officer
    public function destroy($id)
    {
        $officer = Officer::findOrFail($id);
        $officer->delete();
        
        // Reload officers data with sorting
        $officers = Officer::with('member')->get();
        $positionOrder = $this->getPositionOrder();
        
        $data = $officers->map(function ($officer) {
            return [
                'officer_id' => $officer->officer_id,
                'position' => $officer->position,
                'member_id' => $officer->member->member_id,
                'member_name' => $officer->member->firstname . ' ' . $officer->member->lastname,
                'batch_name' => '',
                'created_at' => $officer->created_at,
            ];
        })->sortBy(function ($officer) use ($positionOrder) {
            return $positionOrder[$officer['position']] ?? 999;
        })->values();
        
        return redirect()->back()->with([
            'success' => 'Officer removed successfully!',
            'officers' => $data
        ]);
    }

    // Delete historical officer
    public function destroyHistory($id)
    {
        try {
            $officerHistory = \App\Models\OfficerHistory::findOrFail($id);
            $officerHistory->delete();
            
            return redirect()->back()->with([
                'success' => 'Officer history record deleted successfully!'
            ]);
        } catch (\Exception $e) {
            \Log::error('Delete officer history error: ' . $e->getMessage());
            return redirect()->back()->with([
                'error' => 'Failed to delete officer history record.'
            ]);
        }
    }

    // Export Officers List to PDF
    public function exportPDF()
    {
        try {
            $officers = Officer::with('member')->get();
            $positionOrder = $this->getPositionOrder();

            $data = $officers->map(function ($officer) {
                return [
                    'officer_id' => $officer->officer_id,
                    'position' => $officer->position,
                    'member_id' => $officer->member->member_id,
                    'member_name' => $officer->member->firstname . ' ' . $officer->member->lastname,
                    'created_at' => $officer->created_at,
                ];
            })->sortBy(function ($officer) use ($positionOrder) {
                return $positionOrder[$officer['position']] ?? 999;
            })->values()->toArray();

            $pdfData = [
                'officers' => $data,
                'generatedAt' => now()->format('F d, Y h:i A')
            ];
            
            $pdf = \Barryvdh\DomPDF\Facade\Pdf::loadView('pdf.officers-list', $pdfData);
            $pdf->setPaper('A4', 'portrait');

            return $pdf->download('officers-list-' . now()->format('Y-m-d') . '.pdf');
        } catch (\Exception $e) {
            \Log::error('Officers PDF Export Error: ' . $e->getMessage());
            return response()->json([
                'error' => 'Failed to generate PDF',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    // Show organizational chart
    public function organizationChart()
    {
        $officers = Officer::with('member')->get();
        $positionOrder = $this->getPositionOrder();

        $data = $officers->map(function ($officer) {
            return [
                'officer_id' => $officer->officer_id,
                'position' => $officer->position,
                'member_id' => $officer->member->member_id,
                'firstname' => $officer->member->firstname,
                'lastname' => $officer->member->lastname,
                'student_id' => $officer->member->student_id,
                'profile_picture' => $officer->member->profile_picture ?? null,
            ];
        })->sortBy(function ($officer) use ($positionOrder) {
            return $positionOrder[$officer['position']] ?? 999;
        })->values();

        return \Inertia\Inertia::render('Officers/OrganizationChart', [
            'officers' => $data
        ]);
    }

    // Bulk add officers
    public function bulkStore(Request $request)
    {
        try {
            $request->validate([
                'officers' => 'required|array|min:1',
                'officers.*.member_id' => 'required|exists:members,member_id',
                'officers.*.position' => 'required|string|max:255',
                'batch_id' => 'nullable|exists:batches,id',
                'batch_name' => 'nullable|string|max:255',
            ]);

            $officersData = $request->input('officers');
            $batchId = $request->input('batch_id');
            $batchName = $request->input('batch_name');
            
            // Create new batch if batch_name is provided
            if ($batchName) {
                $batch = \App\Models\Batch::create([
                    'name' => $batchName,
                    'year' => date('Y'),
                ]);
                $batchId = $batch->id;
            }

            $multiMemberPositions = ['Public Information Officer (PIO)', 'Business Manager'];
            $addedCount = 0;
            $errors = [];

            foreach ($officersData as $index => $officerData) {
                // Check if member already has an officer position
                $existingOfficer = Officer::where('member_id', $officerData['member_id'])->first();
                if ($existingOfficer) {
                    $errors[] = "Member ID {$officerData['member_id']} already holds an officer position.";
                    continue;
                }

                // Check position availability
                $positionCount = Officer::where('position', $officerData['position'])->count();
                
                if (in_array($officerData['position'], $multiMemberPositions)) {
                    if ($positionCount >= 2) {
                        $errors[] = "{$officerData['position']} already has 2 members assigned.";
                        continue;
                    }
                } else {
                    if ($positionCount >= 1) {
                        $errors[] = "{$officerData['position']} is already assigned to another officer.";
                        continue;
                    }
                }

                // Create officer with batch_id
                Officer::create([
                    'member_id' => $officerData['member_id'],
                    'position' => $officerData['position'],
                    'batch_id' => $batchId,
                ]);
                
                $addedCount++;
            }

            if ($addedCount > 0) {
                $message = "$addedCount officer(s) added successfully.";
                if (count($errors) > 0) {
                    $message .= " " . count($errors) . " officer(s) could not be added.";
                }
                
                return response()->json([
                    'success' => true,
                    'count' => $addedCount,
                    'message' => $message,
                    'errors' => $errors
                ]);
            } else {
                return response()->json([
                    'success' => false,
                    'message' => 'No officers were added. ' . implode(' ', $errors)
                ], 400);
            }
        } catch (\Exception $e) {
            \Log::error('Bulk add officers error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to add officers: ' . $e->getMessage()
            ], 500);
        }
    }

    // Display officers history page
    public function history()
    {
        try {
            // Get all batches
            $batches = \App\Models\Batch::orderBy('year', 'desc')
                ->orderBy('name', 'desc')
                ->get();

            $positionOrder = $this->getPositionOrder();

            $batchesData = collect();

            // Add batches with their officers
            foreach ($batches as $batch) {
                $batchData = $this->getBatchOfficersData($batch, $positionOrder);
                if ($batchData['officers_count'] > 0) {
                    $batchesData->push($batchData);
                }
            }

            // Add officers without batch (unassigned)
            $unassignedOfficers = Officer::with('member')
                ->whereNull('batch_id')
                ->get();

            if ($unassignedOfficers->count() > 0) {
                $allOfficers = collect();
                
                foreach ($unassignedOfficers as $officer) {
                    $allOfficers->push([
                        'officer_id' => $officer->officer_id,
                        'position' => $officer->position,
                        'member_name' => $officer->member->firstname . ' ' . $officer->member->lastname,
                        'student_id' => $officer->member->student_id,
                        'sex' => $officer->member->sex,
                        'created_at' => $officer->created_at,
                        'end_date' => null,
                        'status' => 'Active',
                        'is_history' => false,
                    ]);
                }

                $sortedOfficers = $allOfficers->sortBy(function ($officer) use ($positionOrder) {
                    return $positionOrder[$officer['position']] ?? 999;
                })->values();

                $batchesData->push([
                    'id' => 0,
                    'name' => 'Current Officers (No Batch)',
                    'year' => date('Y'),
                    'officers_count' => $allOfficers->count(),
                    'officers' => $sortedOfficers
                ]);
            }

            return inertia('Officers/OfficersHistory', [
                'batches' => $batchesData
            ]);
        } catch (\Exception $e) {
            \Log::error('Officers History Error: ' . $e->getMessage());
            return inertia('Officers/OfficersHistory', [
                'batches' => []
            ]);
        }
    }

    // Helper method to get batch officers data
    private function getBatchOfficersData($batch, $positionOrder)
    {
        // Get current officers for this batch from officers table
        $officers = Officer::with('member')
            ->where('batch_id', $batch->id)
            ->get();

        // Get historical officers for this batch from officers_history table
        $historyOfficers = \App\Models\OfficerHistory::with('member')
            ->where('batch_id', $batch->id)
            ->get();

        $allOfficers = collect();

        // Add current officers
        foreach ($officers as $officer) {
            $allOfficers->push([
                'officer_id' => $officer->officer_id,
                'position' => $officer->position,
                'member_name' => $officer->member->firstname . ' ' . $officer->member->lastname,
                'student_id' => $officer->member->student_id,
                'sex' => $officer->member->sex,
                'created_at' => $officer->created_at,
                'end_date' => null,
                'status' => 'Active',
                'is_history' => false,
            ]);
        }

        // Add historical/alumni officers
        foreach ($historyOfficers as $history) {
            // Handle cases where member might be null (graduated/alumni)
            if ($history->member) {
                $memberName = $history->member->firstname . ' ' . $history->member->lastname;
                $studentId = $history->member->student_id;
            } else {
                // Extract from notes field (format: "Name (Student ID)" or just "Name")
                $notes = $history->notes ?: 'Unknown';
                if (preg_match('/^(.+?)\s*\(([^)]+)\)$/', $notes, $matches)) {
                    $memberName = $matches[1];
                    $studentId = $matches[2];
                } else {
                    $memberName = $notes;
                    $studentId = 'N/A';
                }
            }

            $allOfficers->push([
                'officer_id' => $history->history_id,
                'position' => $history->position,
                'member_name' => $memberName,
                'student_id' => $studentId,
                'sex' => $history->sex ?? ($history->member ? $history->member->sex : null),
                'created_at' => $history->start_date ?? $history->created_at,
                'end_date' => $history->end_date,
                'status' => $history->status ?? 'Alumni',
                'is_history' => true,
            ]);
        }

        // Sort all officers by position
        $sortedOfficers = $allOfficers->sortBy(function ($officer) use ($positionOrder) {
            return $positionOrder[$officer['position']] ?? 999;
        })->values();

        return [
            'id' => $batch->id,
            'name' => $batch->name,
            'year' => $batch->year,
            'officers_count' => $allOfficers->count(),
            'officers' => $sortedOfficers
        ];
    }

    // Export Officers History to PDF
    public function exportHistoryPDF()
    {
        try {
            // Get all batches
            $batches = \App\Models\Batch::orderBy('year', 'desc')
                ->orderBy('name', 'desc')
                ->get();

            $positionOrder = $this->getPositionOrder();

            $batchesData = collect();

            foreach ($batches as $batch) {
                $batchData = $this->getBatchOfficersData($batch, $positionOrder);
                // Only include batches that have officers
                if ($batchData['officers_count'] > 0) {
                    $batchesData->push($batchData);
                }
            }

            $batchesData = $batchesData->toArray();

            $pdfData = [
                'batches' => $batchesData,
                'generatedAt' => now()->format('F d, Y h:i A')
            ];
            
            $pdf = \Barryvdh\DomPDF\Facade\Pdf::loadView('pdf.officers-history', $pdfData);
            $pdf->setPaper('A4', 'landscape');

            return $pdf->download('officers-history-' . now()->format('Y-m-d') . '.pdf');
        } catch (\Exception $e) {
            \Log::error('Officers History PDF Export Error: ' . $e->getMessage());
            return response()->json([
                'error' => 'Failed to generate PDF',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    // Store batch officers (Alumni)
    public function storeBatchOfficers(Request $request)
    {
        try {
            $request->validate([
                'batch_id' => 'nullable|exists:batches,id',
                'batch_name' => 'nullable|string|max:255',
                'officers' => 'required|array|min:1',
                'officers.*.position' => 'required|string|max:255',
                'officers.*.member_name' => 'required|string|max:255',
                'officers.*.student_id' => 'nullable|string|max:50',
                'officers.*.sex' => 'nullable|string|in:Male,Female,Others',
                'officers.*.status' => 'required|string',
            ]);

            $officersData = $request->input('officers');
            $batchId = $request->input('batch_id');
            $batchName = $request->input('batch_name');

            // Determine batch to use
            if ($batchId) {
                // Use existing batch
                $batch = \App\Models\Batch::findOrFail($batchId);
            } elseif ($batchName) {
                // Create new batch
                $batch = \App\Models\Batch::create([
                    'name' => $batchName,
                    'year' => date('Y'),
                ]);
            } else {
                return response()->json([
                    'success' => false,
                    'message' => 'Either batch_id or batch_name must be provided'
                ], 400);
            }

            $addedCount = 0;
            $errors = [];

            foreach ($officersData as $officerData) {
                try {
                    $status = $officerData['status'] ?? 'Alumni';
                    $studentId = $officerData['student_id'] ?? null;
                    
                    // Format notes with student ID if provided
                    $notes = $officerData['member_name'];
                    if ($studentId) {
                        $notes .= ' (' . $studentId . ')';
                    }
                    
                    // Create officer history record
                    \App\Models\OfficerHistory::create([
                        'member_id' => null, // Historical officers don't have member_id
                        'position' => $officerData['position'],
                        'sex' => $officerData['sex'] ?? null,
                        'batch_id' => $batch->id,
                        'start_date' => now(),
                        'end_date' => $status === 'Alumni' ? now() : null, // Alumni are inactive, Active have no end date
                        'status' => $status,
                        'notes' => $notes,
                    ]);
                    
                    $addedCount++;
                } catch (\Exception $e) {
                    $errors[] = "Failed to add officer for position {$officerData['position']}: " . $e->getMessage();
                }
            }

            if ($addedCount > 0) {
                $message = "$addedCount officer(s) added to batch '{$batch->name}' successfully.";
                if (count($errors) > 0) {
                    $message .= " " . count($errors) . " officer(s) could not be added.";
                }
                
                return response()->json([
                    'success' => true,
                    'count' => $addedCount,
                    'message' => $message,
                    'errors' => $errors
                ]);
            } else {
                return response()->json([
                    'success' => false,
                    'message' => 'No officers were added. ' . implode(' ', $errors)
                ], 400);
            }
        } catch (\Exception $e) {
            \Log::error('Store batch officers error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to add batch officers: ' . $e->getMessage()
            ], 500);
        }
    }
}
