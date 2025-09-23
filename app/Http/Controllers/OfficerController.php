<?php

namespace App\Http\Controllers;

use App\Models\OfficerHistory;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class OfficerController extends Controller
{
    // Return current officers
    public function current()
    {
        try {
            $officers = OfficerHistory::with('member', 'batch')
                ->whereNull('term_end') // only current term
                ->get();

            $data = $officers->map(function ($officer) {
                return [
                    'officer_id' => $officer->id,
                    'position' => $officer->position,
                    'member_id' => $officer->member->id,
                    'member_name' => $officer->member->firstname . ' ' . $officer->member->lastname,
                    'batch_name' => $officer->batch->name ?? '',
                    'created_at' => $officer->created_at,
                ];
            });

            return response()->json($data);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to fetch officers', 'message' => $e->getMessage()], 500);
        }
    }

    // Store new officer
    public function store(Request $request)
    {
        $request->validate([
            'member_id' => 'required|exists:members,id',
            'position' => 'required|string|max:255',
        ]);

        $officer = OfficerHistory::create([
            'member_id' => $request->member_id,
            'batch_id' => 1, // default batch
            'position' => $request->position,
            'term_start' => now(),
            'term_end' => null,
        ]);

        return response()->json(['message' => 'Officer added successfully', 'officer' => $officer]);
    }

    // Show specific officer
    public function show(OfficerHistory $officer)
    {
        return response()->json($officer->load('member', 'batch'));
    }

    // Update officer
    public function update(Request $request, OfficerHistory $officer)
    {
        $request->validate([
            'member_id' => 'required|exists:members,id',
            'batch_id' => 'required|exists:batches,id',
            'position' => [
                'required',
                'string',
                'max:255',
                Rule::unique('officer_history')->where(function ($query) use ($request, $officer) {
                    return $query->where('batch_id', $request->batch_id)
                                 ->whereNull('term_end')
                                 ->where('id', '<>', $officer->id);
                }),
            ],
        ]);

        $officer->update($request->only('member_id', 'batch_id', 'position'));

        return response()->json(['message' => 'Officer updated successfully']);
    }

    // Delete officer
    public function destroy(OfficerHistory $officer)
    {
        $officer->delete();
        return response()->json(['message' => 'Officer deleted successfully']);
    }
}
