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

    // Display officers index page
    public function index()
    {
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

        return \Inertia\Inertia::render('Officers/Index', [
            'officers' => $data
        ]);
    }

    // Return current officers
    public function current()
    {
        try {
            $officers = Officer::with('member')
                ->get();

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
}
