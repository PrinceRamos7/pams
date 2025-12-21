<?php

namespace App\Http\Controllers;

use App\Models\Member;
use App\Models\PerformanceCategory;
use App\Models\StudentPerformance;
use Illuminate\Http\Request;
use Inertia\Inertia;

class StudentPerformanceController extends Controller
{
    /**
     * Display student performance analytics
     */
    public function show($memberId)
    {
        $member = Member::with(['batch', 'performances.category'])
            ->findOrFail($memberId);

        $categories = PerformanceCategory::active()->ordered()->get();
        
        // Get performances with category details
        $performances = $member->performances()
            ->with('category')
            ->get()
            ->map(function ($performance) {
                return [
                    'id' => $performance->id,
                    'category_id' => $performance->category_id,
                    'category_name' => $performance->category->name,
                    'score' => $performance->score,
                    'weight' => $performance->category->percentage_weight,
                    'weighted_score' => $performance->weighted_score,
                    'remarks' => $performance->remarks,
                ];
            });

        // Calculate total performance score
        $totalScore = $performances->sum('weighted_score');

        // Prepare chart data
        $chartData = $categories->map(function ($category) use ($performances) {
            $performance = $performances->firstWhere('category_id', $category->id);
            return [
                'category' => $category->name,
                'weight' => $category->percentage_weight,
                'score' => $performance ? $performance['score'] : 0,
                'weighted_score' => $performance ? $performance['weighted_score'] : 0,
            ];
        });

        return Inertia::render('Performance/StudentPerformance', [
            'member' => $member,
            'categories' => $categories,
            'performances' => $performances,
            'totalScore' => round($totalScore, 2),
            'chartData' => $chartData,
        ]);
    }

    /**
     * Store or update student performance
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'member_id' => 'required|exists:members,member_id',
            'category_id' => 'required|exists:performance_categories,id',
            'score' => 'required|numeric|min:0|max:100',
            'remarks' => 'nullable|string|max:500',
        ]);

        StudentPerformance::updateOrCreate(
            [
                'member_id' => $validated['member_id'],
                'category_id' => $validated['category_id'],
            ],
            [
                'score' => $validated['score'],
                'remarks' => $validated['remarks'] ?? null,
            ]
        );

        return back()->with('success', 'Performance score saved successfully');
    }

    /**
     * Bulk update student performances
     */
    public function bulkUpdate(Request $request, $memberId)
    {
        $validated = $request->validate([
            'performances' => 'required|array',
            'performances.*.category_id' => 'required|exists:performance_categories,id',
            'performances.*.score' => 'required|numeric|min:0|max:100',
            'performances.*.remarks' => 'nullable|string|max:500',
        ]);

        $member = Member::findOrFail($memberId);

        foreach ($validated['performances'] as $performanceData) {
            StudentPerformance::updateOrCreate(
                [
                    'member_id' => $member->member_id,
                    'category_id' => $performanceData['category_id'],
                ],
                [
                    'score' => $performanceData['score'],
                    'remarks' => $performanceData['remarks'] ?? null,
                ]
            );
        }

        return back()->with('success', 'All performance scores updated successfully');
    }

    /**
     * Delete a performance record
     */
    public function destroy($id)
    {
        $performance = StudentPerformance::findOrFail($id);
        $performance->delete();

        return back()->with('success', 'Performance record deleted successfully');
    }
}
