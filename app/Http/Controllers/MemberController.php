<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Member;

class MemberController extends Controller
{
    public function index()
    {
        $members = Member::all();
        return inertia('Members/MemberList', ['members' => $members]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'student_id' => 'required|unique:members,student_id',
            'firstname' => 'required|string|max:255',
            'lastname' => 'required|string|max:255',
            'sex' => 'required|string|max:10',
            'age' => 'required|integer',
            'birthdate' => 'required|date',
            'phone_number' => 'required|string|max:20',
            'address' => 'required|string|max:255',
            'email' => 'required|email|unique:members,email',
            'year' => 'required|string|max:10',
            'status' => 'required|string|max:20',
        ]);

        Member::create($validated);

        return redirect()->back()->with('success', 'Member added successfully!');
    }


    //Update
    public function update(Request $request, $id)
{
    // Validate request
    $request->validate([
        'student_id' => 'required|string|max:255',
        'firstname' => 'required|string|max:255',
        'lastname'  => 'required|string|max:255',
        'sex'       => 'required|string|max:10',
        'status'    => 'required|string|max:20',
        'age'       => 'nullable|integer',
        'birthdate' => 'nullable|date',
        'phone_number' => 'nullable|string|max:20',
        'email'        => 'nullable|email|max:255',
        'address'      => 'nullable|string|max:500',
        'year'         => 'nullable|string|max:50',
    ]);

    // Find the member
    $member = Member::findOrFail($id);

    // Update the member
    $member->update($request->all());

    

}

//Delete
 public function destroy($id)
    {
        $member = Member::findOrFail($id);
        $member->delete();

        return redirect()->back()->with('success', 'Member deleted successfully.');
    }
}
