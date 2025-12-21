<?php

namespace App\Http\Controllers;

use App\Models\PerformanceCategory;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PerformanceCategoryController extends Controller
{
    /**
     * Display a listing of performance categories
     */
    public function index()
    {
        $categories = PerformanceCategory::ordered()->get();
        $totalWeight = $categories->where('is_active', true)->sum('percentage_weight');
        
        return Inertia::render('Performance/CategorySettings', [
            'categories' => $categories,
            'totalWeight' => $totalWeight,
        ]);
    }

    /**
     * Store a newly created category
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'percentage_weight' => 'required|numeric|min:0|max:100',
            'display_order' => 'nullable|integer',
        ]);

        // Check if total weight exceeds 100%
        $currentTotal = PerformanceCategory::where('is_active', true)->sum('percentage_weight');
        if ($currentTotal + $validated['percentage_weight'] > 100) {
            return back()->withErrors([
                'percentage_weight' => 'Total weight cannot exceed 100%. Current total: ' . $currentTotal . '%'
            ]);
        }

        PerformanceCategory::create($validated);

        return redirect()->route('performance.categories.index')
            ->with('success', 'Category created successfully');
    }

    /**
     * Update the specified category
     */
    public function update(Request $request, PerformanceCategory $category)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'percentage_weight' => 'required|numeric|min:0|max:100',
            'is_active' => 'boolean',
            'display_order' => 'nullable|integer',
        ]);

        // Check if total weight exceeds 100% (excluding current category)
        $currentTotal = PerformanceCategory::where('is_active', true)
            ->where('id', '!=', $category->id)
            ->sum('percentage_weight');
            
        if ($currentTotal + $validated['percentage_weight'] > 100) {
            return back()->withErrors([
                'percentage_weight' => 'Total weight cannot exceed 100%. Current total (excluding this): ' . $currentTotal . '%'
            ]);
        }

        $category->update($validated);

        return redirect()->route('performance.categories.index')
            ->with('success', 'Category updated successfully');
    }

    /**
     * Remove the specified category
     */
    public function destroy(PerformanceCategory $category)
    {
        $category->delete();

        return redirect()->route('performance.categories.index')
            ->with('success', 'Category deleted successfully');
    }

    /**
     * Validate total weight
     */
    public function validateWeight(Request $request)
    {
        $excludeId = $request->input('exclude_id');
        
        $total = PerformanceCategory::where('is_active', true)
            ->when($excludeId, function ($query) use ($excludeId) {
                return $query->where('id', '!=', $excludeId);
            })
            ->sum('percentage_weight');

        return response()->json([
            'current_total' => $total,
            'remaining' => 100 - $total,
            'is_valid' => $total <= 100,
        ]);
    }
}
