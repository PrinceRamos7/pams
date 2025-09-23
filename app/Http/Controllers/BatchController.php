<?php

namespace App\Http\Controllers;

use App\Models\Batch;
use Illuminate\Http\Request;
use Inertia\Inertia;

class BatchController extends Controller
{
    // Display all batches
    public function index()
    {
        $batches = Batch::all();
        return Inertia::render('Batches/Index', compact('batches'));
    }

    // Show a specific batch with officer history
    public function show($id)
    {
        $batch = Batch::with('officerHistories.officer')->findOrFail($id);
        return Inertia::render('Batches/Show', compact('batch'));
    }

    // Store a new batch
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'year' => 'nullable|integer',
            'term' => 'nullable|string|max:255',
        ]);

        Batch::create($request->all());

        return redirect()->back()->with('success', 'Batch created successfully.');
    }

    // Update a batch
    public function update(Request $request, $id)
    {
        $batch = Batch::findOrFail($id);

        $request->validate([
            'name' => 'required|string|max:255',
            'year' => 'nullable|integer',
            'term' => 'nullable|string|max:255',
        ]);

        $batch->update($request->all());

        return redirect()->back()->with('success', 'Batch updated successfully.');
    }

    // Delete a batch
    public function destroy($id)
    {
        $batch = Batch::findOrFail($id);
        $batch->delete();

        return redirect()->back()->with('success', 'Batch deleted successfully.');
    }
}
