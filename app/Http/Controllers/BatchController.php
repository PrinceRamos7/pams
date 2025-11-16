<?php

namespace App\Http\Controllers;

use App\Models\Batch;
use Illuminate\Http\Request;

class BatchController extends Controller
{
    /**
     * Display a listing of batches
     */
    public function index()
    {
        $batches = Batch::orderBy('year', 'desc')
            ->orderBy('name', 'desc')
            ->get();
        
        return response()->json($batches);
    }

    /**
     * Store a newly created batch
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'year' => 'nullable|integer',
            'term' => 'nullable|string|max:255',
        ]);

        $batch = Batch::create($validated);

        return response()->json([
            'success' => true,
            'batch' => $batch,
            'message' => 'Batch created successfully'
        ]);
    }
}
