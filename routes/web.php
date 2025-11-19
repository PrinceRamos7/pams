<?php

use App\Http\Controllers\BatchController;
use App\Http\Controllers\OfficerController;
use App\Http\Controllers\AttendanceEventController;
use App\Http\Controllers\AttendanceRecordController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\MemberController;
use App\Http\Controllers\FaceIOController;
use App\Http\Controllers\SanctionController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use App\Models\Member;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', [App\Http\Controllers\DashboardController::class, 'index'])
    ->middleware(['auth', 'verified'])
    ->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
    Route::get('/profile/register-face', function () {
        return Inertia::render('Profile/RegisterAdminFace');
    })->name('profile.register-face');
});

//Members
Route::middleware('auth')->group(function () {
    Route::get('/members', [MemberController::class, 'index'])->name('members.index');
    Route::get('/members/chart', [MemberController::class, 'chart'])->name('members.chart');
    Route::get('/members/export-pdf', [MemberController::class, 'exportPDF'])->name('members.export-pdf');
    
    // Member History (must come before {member} routes)
    Route::get('/members/history/list', [App\Http\Controllers\MemberHistoryController::class, 'index'])->name('members.history');
    Route::get('/members/history/export-pdf', [App\Http\Controllers\MemberHistoryController::class, 'exportPDF'])->name('members.history.export-pdf');
    Route::get('/members/history/{member}', [App\Http\Controllers\MemberHistoryController::class, 'show'])->name('members.history.show');
    
    Route::post('/members', [MemberController::class, 'store'])->name('members.store');
    Route::post('/members/bulk-import', [MemberController::class, 'bulkImport'])->name('members.bulk-import');
    Route::get('/members/{member_id}', [MemberController::class, 'show'])->name('members.show');
    Route::put('/members/{member_id}', [MemberController::class, 'update'])->name('members.update');
    Route::delete('/members/{member_id}', [MemberController::class, 'destroy'])->name('members.destroy');
    Route::post('/members/{member}/upload-picture', [MemberController::class, 'uploadProfilePicture'])->name('members.upload-picture');
    Route::get('/members/{id}/register-face', function ($id) {
        $member = Member::findOrFail($id);
        return Inertia::render('Members/RegisterFace', ['member' => $member]);
    })->name('members.register-face');
});

//Officers
Route::middleware('auth')->group(function () {
Route::get('/officers', [OfficerController::class, 'index'])->name('officers.index');
Route::get('/officers/history', [OfficerController::class, 'history'])->name('officers.history');
Route::get('/officers/history/export-pdf', [OfficerController::class, 'exportHistoryPDF'])->name('officers.history.export-pdf');
Route::delete('/officers/history/{id}', [OfficerController::class, 'destroyHistory'])->name('officers.history.destroy');
Route::post('/officers/batch', [OfficerController::class, 'storeBatchOfficers'])->name('officers.batch.store');
Route::get('/officers/org-chart', [OfficerController::class, 'organizationChart'])->name('officers.org-chart');
Route::get('/officers/export-pdf', [OfficerController::class, 'exportPDF'])->name('officers.export-pdf');
Route::get('/officers/current', [OfficerController::class, 'current']);
Route::post('/officers', [OfficerController::class, 'store']);
Route::post('/officers/bulk', [OfficerController::class, 'bulkStore']);
Route::get('/officers/{id}', [OfficerController::class, 'show']);
Route::put('/officers/{id}', [OfficerController::class, 'update']);
Route::delete('/officers/{id}', [OfficerController::class, 'destroy']);
});

//Batches
Route::middleware('auth')->group(function () {
Route::get('/batches', [BatchController::class, 'index']);
Route::post('/batches', [BatchController::class, 'store']);
});

//Batch
Route::middleware('auth')->group(function () {
    Route::get('/batches', [BatchController::class, 'index']);
    Route::get('/batches/{id}', [BatchController::class, 'show']);
    Route::post('/batches', [BatchController::class, 'store']);
    Route::put('/batches/{id}', [BatchController::class, 'update']);
    Route::delete('/batches/{id}', [BatchController::class, 'destroy']);
});

//Attendance
Route::middleware('auth')->group(function () {
    Route::get('/attendance-events', [AttendanceEventController::class, 'index'])->name('attendance.index');
    Route::post('/attendance-events', [AttendanceEventController::class, 'store'])->name('attendance.store');
    Route::put('/attendance-events/{eventId}', [AttendanceEventController::class, 'update'])->name('attendance.update');
    Route::delete('/attendance-events/{eventId}', [AttendanceEventController::class, 'destroy'])->name('attendance.destroy');
    Route::post('/attendance-events/{eventId}/force-begin-timeout', [AttendanceEventController::class, 'forceBeginTimeOut'])->name('attendance.force-begin-timeout');
    Route::post('/attendance-events/{eventId}/force-reopen-timeout', [AttendanceEventController::class, 'forceReopenTimeOut'])->name('attendance.force-reopen-timeout');
    Route::post('/attendance-events/{eventId}/force-close', [AttendanceEventController::class, 'forceClose'])->name('attendance.force-close');

    Route::get('/attendance-records', [AttendanceRecordController::class, 'index'])->name('attendance-records.index');
    Route::get('/attendance-records/create/{eventId}', [AttendanceRecordController::class, 'create'])->name('attendance-records.create');
    Route::get('/attendance-records/time-in/{eventId}', [AttendanceRecordController::class, 'timeIn'])->name('attendance-records.time-in');
    Route::get('/attendance-records/time-out/{eventId}', [AttendanceRecordController::class, 'timeOut'])->name('attendance-records.time-out');
    Route::get('/attendance-records/view/{eventId}', [AttendanceRecordController::class, 'view'])->name('attendance-records.view');
    Route::post('/attendance-records', [AttendanceRecordController::class, 'store'])->name('attendance-records.store');
    Route::put('/attendance-records/{recordId}', [AttendanceRecordController::class, 'update'])->name('attendance-records.update');
    
    // Two-Step Verification Attendance Routes
    Route::get('/attendance-records/two-step-time-in/{eventId}', function ($eventId) {
        $event = \App\Models\AttendanceEvent::findOrFail($eventId);
        
        // Check if event is closed
        if ($event->status === 'closed') {
            return redirect()->route('attendance.index')
                ->with('error', 'This event is closed. Time-in is no longer available.');
        }
        
        return Inertia::render('Attendance/FaceTimeIn', ['event' => $event]);
    })->name('attendance-records.two-step-time-in');
    
    Route::get('/attendance-records/two-step-time-out/{eventId}', function ($eventId) {
        $event = \App\Models\AttendanceEvent::findOrFail($eventId);
        
        // Check if event is closed
        if ($event->status === 'closed') {
            return redirect()->route('attendance.index')
                ->with('error', 'This event is closed. Time-out is no longer available.');
        }
        
        return Inertia::render('Attendance/FaceTimeOut', ['event' => $event]);
    })->name('attendance-records.two-step-time-out');
    
    // Legacy FaceIO Attendance Routes (kept for backward compatibility)
    Route::get('/attendance-records/face-time-in/{eventId}', function ($eventId) {
        $event = \App\Models\AttendanceEvent::findOrFail($eventId);
        
        // Check if event is closed
        if ($event->status === 'closed') {
            return redirect()->route('attendance.index')
                ->with('error', 'This event is closed. Time-in is no longer available.');
        }
        
        return Inertia::render('Attendance/FaceTimeIn', ['event' => $event]);
    })->name('attendance-records.face-time-in');
    
    Route::get('/attendance-records/face-time-out/{eventId}', function ($eventId) {
        $event = \App\Models\AttendanceEvent::findOrFail($eventId);
        
        // Check if event is closed
        if ($event->status === 'closed') {
            return redirect()->route('attendance.index')
                ->with('error', 'This event is closed. Time-out is no longer available.');
        }
        
        $membersWithTimeIn = \App\Models\AttendanceRecord::with('member')
            ->where('event_id', $eventId)
            ->whereNotNull('time_in')
            ->whereNull('time_out')
            ->get();
        return Inertia::render('Attendance/FaceTimeOut', [
            'event' => $event,
            'membersWithTimeIn' => $membersWithTimeIn
        ]);
    })->name('attendance-records.face-time-out');
});

// Face Recognition API Routes (Free - No API Key Required!)
Route::prefix('api/faceio')->middleware('auth')->group(function () {
    // Member face enrollment
    Route::post('/enroll', [FaceIOController::class, 'enrollMember']);
    Route::get('/enrolled-faces', [FaceIOController::class, 'getEnrolledFaces']);
    Route::post('/authenticate', [FaceIOController::class, 'authenticateMember']);
    Route::delete('/unenroll/{memberId}', [FaceIOController::class, 'unenrollMember']);
    Route::get('/check-enrollment/{memberId}', [FaceIOController::class, 'checkEnrollment']);
    
    // Admin face enrollment
    Route::post('/enroll-admin', [FaceIOController::class, 'enrollAdmin']);
    Route::get('/enrolled-admins', [FaceIOController::class, 'getEnrolledAdmins']);
    Route::delete('/unenroll-admin/{userId}', [FaceIOController::class, 'unenrollAdmin']);
});

// Member Verification API
Route::prefix('api/members')->middleware('auth')->group(function () {
    Route::get('/verify/{studentId}', [FaceIOController::class, 'verifyByStudentId'])->name('api.members.verify');
});

// Attendance Records API
Route::prefix('api/attendance-records')->middleware('auth')->group(function () {
    Route::get('/check-time-in', [AttendanceRecordController::class, 'checkTimeIn'])->name('api.attendance-records.check-time-in');
    Route::get('/find', [AttendanceRecordController::class, 'findRecord'])->name('api.attendance-records.find');
    Route::post('/find', [AttendanceRecordController::class, 'findRecord'])->name('api.attendance-records.find.post');
});

// Password Verification API
Route::post('/api/verify-password', [SanctionController::class, 'verifyPassword'])->middleware('auth')->name('api.verify-password');

// Sanctions API Routes
Route::prefix('api/sanctions')->middleware('auth')->group(function () {
    Route::get('/', [SanctionController::class, 'index'])->name('api.sanctions.index');
    Route::get('/summary', [SanctionController::class, 'summary'])->name('api.sanctions.summary');
    Route::get('/member/{memberId}', [SanctionController::class, 'memberSanctions'])->name('api.sanctions.member');
    Route::get('/{sanctionId}', [SanctionController::class, 'show'])->name('api.sanctions.show');
    Route::put('/{sanctionId}', [SanctionController::class, 'update'])->name('api.sanctions.update');
    Route::put('/{sanctionId}/pay', [SanctionController::class, 'markAsPaid'])->name('api.sanctions.pay');
    Route::put('/{sanctionId}/excuse', [SanctionController::class, 'markAsExcused'])->name('api.sanctions.excuse');
    Route::delete('/event/{eventId}', [SanctionController::class, 'deleteEventSanctions'])->name('api.sanctions.delete-event');
});

// Sanctions Web Routes
Route::middleware('auth')->group(function () {
    Route::get('/sanctions', [SanctionController::class, 'index'])->name('sanctions.index');
    Route::get('/sanctions/event/{eventId}', [SanctionController::class, 'eventSanctions'])->name('sanctions.event');
    Route::get('/sanctions/members', [SanctionController::class, 'memberSanctionsIndex'])->name('sanctions.members');
    Route::get('/sanctions/member/{memberId}', [SanctionController::class, 'memberSanctionDetails'])->name('sanctions.member.details');
    
    // PDF Export Routes
    Route::get('/sanctions/export-pdf', [SanctionController::class, 'exportEventsPDF'])->name('sanctions.export-pdf');
    Route::get('/sanctions/event/{eventId}/export-pdf', [SanctionController::class, 'exportEventSanctionsPDF'])->name('sanctions.event.export-pdf');
    Route::get('/sanctions/members/export-pdf', [SanctionController::class, 'exportMemberSanctionsPDF'])->name('sanctions.members.export-pdf');
    
    // Mark sanction as paid
    Route::post('/sanctions/{sanctionId}/mark-paid', [SanctionController::class, 'markAsPaid'])->name('sanctions.mark-paid');
});



// Attendance PDF Export
Route::middleware('auth')->group(function () {
    Route::get('/attendance-records/{eventId}/export-pdf', [AttendanceRecordController::class, 'exportPDF'])->name('attendance-records.export-pdf');
});

require __DIR__.'/auth.php';
