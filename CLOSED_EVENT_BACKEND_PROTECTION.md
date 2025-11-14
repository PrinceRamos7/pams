# Closed Event Backend Protection

## Overview
Added server-side validation to prevent access to time-in and time-out pages when an event is closed. This ensures that even if someone bypasses the frontend disabled buttons, they cannot access closed events.

## Problem
- Frontend buttons were disabled for closed events
- However, users could still access time-in/time-out pages by directly navigating to the URL
- The "CLOSED" badge was showing but the page was still accessible
- No backend validation was preventing attendance recording for closed events

## Solution
Added closed status checks at multiple levels:

### 1. Route Level Protection
**Location**: `routes/web.php`

**Protected Routes**:
- `/attendance-records/two-step-time-in/{eventId}`
- `/attendance-records/two-step-time-out/{eventId}`
- `/attendance-records/face-time-in/{eventId}`
- `/attendance-records/face-time-out/{eventId}`

**Implementation**:
```php
Route::get('/attendance-records/two-step-time-in/{eventId}', function ($eventId) {
    $event = \App\Models\AttendanceEvent::findOrFail($eventId);
    
    // Check if event is closed
    if ($event->status === 'closed') {
        return redirect()->route('attendance.index')
            ->with('error', 'This event is closed. Time-in is no longer available.');
    }
    
    return Inertia::render('Attendance/TwoStepTimeIn', ['event' => $event]);
})->name('attendance-records.two-step-time-in');
```

**Behavior**:
- Checks event status before rendering the page
- If closed, redirects to attendance index page
- Shows error message: "This event is closed. Time-in/Time-out is no longer available."

### 2. Controller Level Protection
**Location**: `app/Http/Controllers/AttendanceRecordController.php`

**Protected Methods**:
- `timeIn($eventId)` - Regular time-in page
- `timeOut($eventId)` - Regular time-out page
- `store(Request $request)` - Attendance record creation

**Implementation in timeIn/timeOut**:
```php
public function timeIn($eventId)
{
    $event = AttendanceEvent::findOrFail($eventId);
    
    // Check if event is closed
    if ($event->status === 'closed') {
        return redirect()->route('attendance.index')
            ->with('error', 'This event is closed. Time-in is no longer available.');
    }
    
    return Inertia::render('Attendance/TimeIn', [
        'event' => $event
    ]);
}
```

**Implementation in store**:
```php
// Get the event to check time windows
$event = AttendanceEvent::findOrFail($validated['event_id']);

// Check if event is closed
if ($event->status === 'closed') {
    return response()->json([
        'success' => false,
        'message' => 'This event is closed. Attendance cannot be recorded.',
    ], 422);
}
```

**Behavior**:
- Validates event status before processing
- Returns JSON error for API calls
- Redirects with error message for page requests

## Protected Endpoints

### Time-In Routes:
1. ✅ `/attendance-records/two-step-time-in/{eventId}` - Two-step verification time-in
2. ✅ `/attendance-records/face-time-in/{eventId}` - Legacy FaceIO time-in
3. ✅ `/attendance-records/time-in/{eventId}` - Regular time-in (via controller)

### Time-Out Routes:
1. ✅ `/attendance-records/two-step-time-out/{eventId}` - Two-step verification time-out
2. ✅ `/attendance-records/face-time-out/{eventId}` - Legacy FaceIO time-out
3. ✅ `/attendance-records/time-out/{eventId}` - Regular time-out (via controller)

### API Endpoints:
1. ✅ `POST /attendance-records` - Attendance record creation

## Security Layers

### Layer 1: Frontend (UI)
- Disabled buttons with visual feedback
- "Closed" badge on event cards
- Grayed out appearance
- Error notifications on click

### Layer 2: Backend Routes
- Status check before rendering pages
- Redirect to attendance index
- Flash error messages

### Layer 3: Controller Methods
- Status validation in controller methods
- Prevents page rendering for closed events
- Consistent error handling

### Layer 4: API Validation
- Status check in store method
- Prevents attendance record creation
- Returns JSON error response

## User Experience Flow

### Attempting to Access Closed Event:

1. **Via Frontend Button**:
   - Button is disabled and grayed out
   - Shows "Closed" badge
   - Click shows error notification
   - No navigation occurs

2. **Via Direct URL**:
   - User types URL directly in browser
   - Backend checks event status
   - Redirects to attendance index
   - Shows error message: "This event is closed. Time-in is no longer available."

3. **Via API Call**:
   - Frontend sends attendance record request
   - Backend validates event status
   - Returns 422 error with message
   - Frontend shows error notification

## Error Messages

### Redirect Messages (Flash):
- "This event is closed. Time-in is no longer available."
- "This event is closed. Time-out is no longer available."

### API Error Messages (JSON):
- "This event is closed. Attendance cannot be recorded."

### Frontend Notifications:
- "Event is closed. Cannot time in."
- "Event is closed. Cannot time out."

## Testing Checklist

- [x] Two-step time-in redirects for closed events
- [x] Two-step time-out redirects for closed events
- [x] Legacy face time-in redirects for closed events
- [x] Legacy face time-out redirects for closed events
- [x] Regular time-in redirects for closed events
- [x] Regular time-out redirects for closed events
- [x] API prevents attendance recording for closed events
- [x] Error messages are clear and helpful
- [x] Redirects go to correct page (attendance index)
- [x] Open events still work normally

## Files Modified

1. **routes/web.php**
   - Added closed status checks to all time-in/time-out routes
   - Added redirect logic with error messages

2. **app/Http/Controllers/AttendanceRecordController.php**
   - Added closed status check to `timeIn()` method
   - Added closed status check to `timeOut()` method
   - Added closed status check to `store()` method

## Benefits

1. **Security**: Prevents unauthorized attendance recording
2. **Data Integrity**: Ensures closed events cannot be modified
3. **User Experience**: Clear feedback when trying to access closed events
4. **Consistency**: Same behavior across all time-in/time-out methods
5. **Defense in Depth**: Multiple layers of protection

## Future Enhancements

Potential improvements:
1. Add audit log for attempted access to closed events
2. Show closure reason on redirect page
3. Add "Event Closed" page instead of redirect
4. Allow admins to reopen events temporarily
5. Add grace period before full closure
6. Send notifications when events are closed
