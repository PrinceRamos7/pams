<?php

use App\Http\Controllers\BatchController;
use App\Http\Controllers\OfficerController;
use App\Http\Controllers\AttendanceEventController;
use App\Http\Controllers\AttendanceRecordController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\MemberController;
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

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

//Members
Route::middleware('auth')->group(function () {
    Route::get('/members', [MemberController::class, 'index'])->name('members.index');
    Route::post('/members', [MemberController::class, 'store'])->name('members.store');
    Route::get('/members/{id}', [MemberController::class, 'show'])->name('members.show');
    Route::put('/members/{id}', [MemberController::class, 'update'])->name('members.update');
    Route::delete('/members/{id}', [MemberController::class, 'destroy'])->name('members.destroy');
    Route::get('/members', [MemberController::class, 'index']);

});

//Officers
Route::middleware('auth')->group(function () {
Route::get('/officers/current', [OfficerController::class, 'currentOfficers']);
Route::get('/officers/current', [OfficerController::class, 'current'])->middleware('auth');
Route::get('/officers/current', [OfficerController::class, 'current']);
Route::get('/officers/{officer}', [OfficerController::class, 'show']);
Route::put('/officers/{officer}', [OfficerController::class, 'update']);
Route::post('/officers', [OfficerController::class, 'store']);
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

    Route::get('/attendance-records', [AttendanceRecordController::class, 'index'])->name('attendance-records.index');
    Route::post('/attendance-records', [AttendanceRecordController::class, 'store'])->name('attendance-records.store');
});


require __DIR__.'/auth.php';
