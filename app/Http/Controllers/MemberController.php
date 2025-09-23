<?php

namespace App\Http\Controllers;

use App\Models\Member;
use Illuminate\Http\Request;
use Inertia\Inertia;

class MemberController extends Controller
{
    /**
     * Display a listing of the members.
     */
    public function index()
    {
        $members = Member::all();
        return Inertia::render('Members/MemberList', [
            'members' => $members,
        ]);

        $members = Member::select('id as member_id', 'firstname', 'lastname')->get();
        return response()->json($members);
    }

    /**
     * Store a newly created member.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'student_id'   => 'required|unique:members,student_id',
            'firstname'    => 'required|string|max:255',
            'lastname'     => 'required|string|max:255',
            'sex'          => 'required|string|max:10',
            'status'       => 'required|string|max:20',
            'age'          => 'nullable|integer',
            'birthdate'    => 'nullable|date',
            'phone_number' => 'nullable|string|max:20',
            'email'        => 'nullable|email|unique:members,email',
            'address'      => 'nullable|string|max:255',
            'year'         => 'nullable|string|max:50',
        ]);

        Member::create($validated);

        return redirect()->back()->with('success', 'Member added successfully!');
    }

    /**
     * Display the specified member.
     */
    public function show(Member $member)
    {
        return response()->json($member);
    }

    /**
     * Update the specified member.
     */
    public function update(Request $request, Member $member)
    {
        $validated = $request->validate([
            'student_id'   => 'required|unique:members,student_id,' . $member->member_id . ',member_id',
            'firstname'    => 'required|string|max:255',
            'lastname'     => 'required|string|max:255',
            'sex'          => 'required|string|max:10',
            'status'       => 'required|string|max:20',
            'age'          => 'nullable|integer',
            'birthdate'    => 'nullable|date',
            'phone_number' => 'nullable|string|max:20',
            'email'        => 'nullable|email|unique:members,email,' . $member->member_id . ',member_id',
            'address'      => 'nullable|string|max:255',
            'year'         => 'nullable|string|max:50',
        ]);

        $member->update($validated);

        return redirect()->back()->with('success', 'Member updated successfully!');
    }

    /**
     * Remove the specified member.
     */
    public function destroy(Member $member)
    {
        $member->delete();
        return redirect()->back()->with('success', 'Member deleted successfully!');
    }
}
