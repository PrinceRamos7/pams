# Design Document

## Overview

This document outlines the technical design for implementing a comprehensive attendance management system with face recognition, automatic time windows, and sanctions tracking.

---

## Architecture

### System Components

1. **Frontend (React + Inertia.js)**
   - Member face registration interface
   - Two-step attendance verification (Student ID + Face)
   - Real-time time window status display
   - Sanctions management dashboard

2. **Backend (Laravel)**
   - Face descriptor storage and retrieval
   - Time window validation logic
   - Automatic sanction calculation
   - Attendance record management
   - Sanctions CRUD operations

3. **Face Recognition (face-api.js)**
   - Face enrollment and descriptor generation
   - Face authentication and matching
   - Euclidean distance calculation

4. **Database (MySQL)**
   - Members with face descriptors
   - Attendance events with time windows
   - Attendance records with timestamps
   - Sanctions with amounts and status

---

## Database Schema

### New Table: `sanctions`

```sql
CREATE TABLE sanctions (
    sanction_id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    member_id BIGINT UNSIGNED NOT NULL,
    event_id BIGINT UNSIGNED NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    reason VARCHAR(255) NOT NULL,
    status ENUM('unpaid', 'paid') DEFAULT 'unpaid',
    payment_date DATETIME NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (member_id) REFERENCES members(member_id) ON DELETE RESTRICT,
    FOREIGN KEY (event_id) REFERENCES attendance_events(event_id) ON DELETE RESTRICT,
    INDEX idx_member_status (member_id, status),
    INDEX idx_event (event_id),
    INDEX idx_status (status)
);
```

### Modified Table: `attendance_events`

Add columns for time window configuration:
- `time_in_duration` INT DEFAULT 30 (minutes)
- `time_out_duration` INT DEFAULT 30 (minutes)

### Modified Table: `attendance_records`

Ensure proper indexing:
- Index on `(event_id, member_id)` for duplicate checking
- Index on `(event_id, time_in)` for sanction calculation

---

## Components and Interfaces

### 1. Face Registration Flow

**Component:** `RegisterFace.jsx`

**Flow:**
1. Display member information
2. Start camera with live preview
3. Capture face and generate descriptor
4. Save descriptor to database
5. Show success message

**API Endpoint:** `POST /api/faceio/enroll`
- Request: `{ member_id, face_id, face_descriptor }`
- Response: `{ success, message, member }`

---

### 2. Two-Step Attendance Verification

**Component:** `TwoStepTimeIn.jsx` / `TwoStepTimeOut.jsx`

**Flow:**
1. **Step 1: Student ID Entry**
   - Input field for student ID
   - Validate student ID exists
   - Display member information
   - Check if face is registered
   - Enable "Next" button

2. **Step 2: Face Recognition**
   - Start camera automatically
   - Display member's registered face info
   - Capture current face
   - Compare with registered face descriptor
   - If match: Record attendance
   - If no match: Show error and retry

**API Endpoints:**
- `GET /api/members/verify/{studentId}` - Verify student ID and get member info
- `POST /api/attendance/verify-and-record` - Verify face and record attendance

---

### 3. Time Window Management

**Component:** `TimeWindowStatus.jsx`

**Logic:**
```javascript
function isTimeInActive(event) {
    const now = new Date();
    const timeInStart = new Date(event.date + 'T' + event.time_in);
    const timeInEnd = new Date(timeInStart.getTime() + event.time_in_duration * 60000);
    return now >= timeInStart && now <= timeInEnd;
}

function isTimeOutActive(event) {
    const now = new Date();
    const timeOutStart = new Date(event.date + 'T' + event.time_out);
    const timeOutEnd = new Date(timeOutStart.getTime() + event.time_out_duration * 60000);
    return now >= timeOutStart && now <= timeOutEnd;
}

function getRemainingTime(event, type) {
    const now = new Date();
    const start = type === 'in' ? event.time_in : event.time_out;
    const duration = type === 'in' ? event.time_in_duration : event.time_out_duration;
    const endTime = new Date(event.date + 'T' + start).getTime() + duration * 60000;
    const remaining = Math.max(0, endTime - now.getTime());
    return Math.floor(remaining / 60000); // minutes
}
```

---

### 4. Automatic Sanction Calculation

**Service:** `SanctionService.php`

**Logic:**
```php
class SanctionService
{
    public function calculateSanctionsForEvent($eventId)
    {
        $event = AttendanceEvent::findOrFail($eventId);
        $allMembers = Member::where('status', 'Active')->get();
        
        // Get time-in window end
        $timeInEnd = Carbon::parse($event->date . ' ' . $event->time_in)
            ->addMinutes($event->time_in_duration);
        
        // Only process if time-in window has closed
        if (Carbon::now()->lt($timeInEnd)) {
            return;
        }
        
        foreach ($allMembers as $member) {
            $record = AttendanceRecord::where('event_id', $eventId)
                ->where('member_id', $member->member_id)
                ->first();
            
            // No time-in: Full day sanction (25 pesos)
            if (!$record || !$record->time_in) {
                $this->createSanction($member->member_id, $eventId, 25.00, 'Failed to time in');
            }
            // Has time-in but no time-out: Half day sanction (12.50 pesos)
            elseif ($record->time_in && !$record->time_out) {
                $timeOutEnd = Carbon::parse($event->date . ' ' . $event->time_out)
                    ->addMinutes($event->time_out_duration);
                
                if (Carbon::now()->gt($timeOutEnd)) {
                    $this->createSanction($member->member_id, $eventId, 12.50, 'Failed to time out');
                }
            }
        }
    }
    
    private function createSanction($memberId, $eventId, $amount, $reason)
    {
        // Check if sanction already exists
        $existing = Sanction::where('member_id', $memberId)
            ->where('event_id', $eventId)
            ->where('reason', $reason)
            ->first();
        
        if (!$existing) {
            Sanction::create([
                'member_id' => $memberId,
                'event_id' => $eventId,
                'amount' => $amount,
                'reason' => $reason,
                'status' => 'unpaid'
            ]);
        }
    }
}
```

**Trigger:** Laravel Scheduler (runs every 5 minutes)
```php
// app/Console/Kernel.php
protected function schedule(Schedule $schedule)
{
    $schedule->call(function () {
        $events = AttendanceEvent::whereDate('date', Carbon::today())->get();
        foreach ($events as $event) {
            app(SanctionService::class)->calculateSanctionsForEvent($event->event_id);
        }
    })->everyFiveMinutes();
}
```

---

### 5. Sanctions Management

**Component:** `SanctionsIndex.jsx`

**Features:**
- Table view of all sanctions
- Filters: Member, Date Range, Status
- Actions: Mark as Paid, View Details
- Summary: Total unpaid amount per member

**API Endpoints:**
- `GET /api/sanctions` - List all sanctions with filters
- `GET /api/sanctions/member/{memberId}` - Get member's sanctions
- `PUT /api/sanctions/{sanctionId}/pay` - Mark sanction as paid
- `GET /api/sanctions/summary` - Get summary statistics

---

## Data Models

### Sanction Model

```php
class Sanction extends Model
{
    protected $table = 'sanctions';
    protected $primaryKey = 'sanction_id';
    
    protected $fillable = [
        'member_id',
        'event_id',
        'amount',
        'reason',
        'status',
        'payment_date'
    ];
    
    protected $casts = [
        'amount' => 'decimal:2',
        'payment_date' => 'datetime'
    ];
    
    public function member()
    {
        return $this->belongsTo(Member::class, 'member_id', 'member_id');
    }
    
    public function event()
    {
        return $this->belongsTo(AttendanceEvent::class, 'event_id', 'event_id');
    }
    
    public function scopeUnpaid($query)
    {
        return $query->where('status', 'unpaid');
    }
    
    public function scopePaid($query)
    {
        return $query->where('status', 'paid');
    }
}
```

---

## Error Handling

### Face Recognition Errors

1. **No Face Registered**
   - Message: "Please register your face first"
   - Action: Redirect to face registration

2. **Face Mismatch**
   - Message: "Face does not match registered face for this student ID"
   - Action: Allow retry (max 3 attempts)

3. **Camera Access Denied**
   - Message: "Please allow camera access"
   - Action: Show browser permission instructions

### Attendance Errors

1. **Invalid Student ID**
   - Message: "Student ID not found"
   - Action: Clear input and allow retry

2. **Duplicate Time-In**
   - Message: "You have already timed in for this event"
   - Action: Show existing record

3. **Time Window Closed**
   - Message: "Time-in/out window is not active"
   - Action: Show next available window

4. **No Time-In Record**
   - Message: "You must time in before timing out"
   - Action: Redirect to time-in

---

## Testing Strategy

### Unit Tests

1. **Time Window Validation**
   - Test active/inactive status
   - Test remaining time calculation
   - Test edge cases (exactly at start/end)

2. **Sanction Calculation**
   - Test full day sanction (no time-in)
   - Test half day sanction (no time-out)
   - Test no sanction (complete attendance)
   - Test duplicate prevention

3. **Face Matching**
   - Test successful match
   - Test failed match
   - Test no registered face

### Integration Tests

1. **Two-Step Attendance Flow**
   - Test complete flow (ID + Face)
   - Test invalid ID
   - Test face mismatch
   - Test duplicate prevention

2. **Automatic Sanction Creation**
   - Test sanction creation after window closes
   - Test sanction amounts
   - Test duplicate prevention

### End-to-End Tests

1. **Complete Attendance Cycle**
   - Register face
   - Time in with ID + Face
   - Time out with ID + Face
   - Verify no sanctions

2. **Sanction Workflow**
   - Miss time-in
   - Verify 25 peso sanction
   - Mark as paid
   - Verify status update

---

## Security Considerations

1. **Face Descriptor Storage**
   - Store as encrypted JSON
   - Never expose raw descriptors in API responses
   - Use HTTPS for all face data transmission

2. **Student ID Validation**
   - Rate limit verification attempts
   - Log failed attempts
   - Lock account after 5 failed attempts

3. **Sanction Modifications**
   - Require admin authentication
   - Log all sanction changes
   - Prevent retroactive modifications

---

## Performance Optimization

1. **Database Indexing**
   - Index on `(event_id, member_id)` for attendance lookups
   - Index on `(member_id, status)` for sanction queries
   - Index on `date` for event queries

2. **Caching**
   - Cache active events for current day
   - Cache member face descriptors
   - Cache sanction summaries

3. **Background Jobs**
   - Queue sanction calculations
   - Queue face descriptor processing
   - Queue notification sending

---

## UI/UX Design

### Time-In/Out Interface

```
┌─────────────────────────────────────┐
│  Time In - Morning Meeting          │
│  Date: Nov 14, 2025                 │
│  Status: ⚫ ACTIVE (25 min left)    │
├─────────────────────────────────────┤
│                                     │
│  Step 1: Enter Student ID           │
│  ┌─────────────────────────────┐   │
│  │ 2021-001234                 │   │
│  └─────────────────────────────┘   │
│                                     │
│  ✓ John Doe                         │
│    4th Year - Active                │
│    john@example.com                 │
│                                     │
│  [Next: Face Recognition →]         │
│                                     │
└─────────────────────────────────────┘
```

### Sanctions Dashboard

```
┌─────────────────────────────────────┐
│  Sanctions Management               │
├─────────────────────────────────────┤
│  Filters: [All Members ▼] [Unpaid ▼]│
│                                     │
│  Total Unpaid: ₱1,250.00            │
├─────────────────────────────────────┤
│  Member      Event    Amount Status │
│  John Doe    Nov 14   ₱25.00 Unpaid│
│  Jane Smith  Nov 14   ₱12.50 Unpaid│
│  Bob Jones   Nov 13   ₱25.00 Paid  │
└─────────────────────────────────────┘
```

---

## Summary

This design provides:
- Complete two-step verification system
- Automatic time window management
- Intelligent sanction calculation
- Comprehensive sanctions tracking
- Robust error handling
- Performance optimization
- Security best practices

All components are designed to work together seamlessly while maintaining data integrity and user experience.
