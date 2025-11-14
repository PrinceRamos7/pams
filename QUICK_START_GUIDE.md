# 🚀 Quick Start Guide - Attendance System

## Prerequisites
- ✅ Laravel application running
- ✅ Database migrated
- ✅ Camera access enabled in browser
- ✅ At least one member in the system

---

## 🎯 Step-by-Step Testing Guide

### Step 1: Register a Member's Face

1. **Navigate to Members**
   - Click "Members" in the sidebar
   - You should see a list of members

2. **Register Face**
   - Find a member in the list
   - Click the "Register Face" button/action
   - Allow camera access when prompted
   - Look directly at the camera
   - Wait for face scan to complete
   - You should see "Face registered successfully!"

**✅ Checkpoint**: Member now has a `faceio_id` in the database

---

### Step 2: Create an Attendance Event

1. **Navigate to Attendance**
   - Click "Attendance" in the sidebar
   - Click "New Event" button

2. **Fill Event Details**
   ```
   Date: [Today's date]
   Event Name: Morning Meeting
   Time In: 08:00
   Time Out: 17:00
   ```

3. **Create Event**
   - Click "Create Event"
   - Event should appear in the list

**✅ Checkpoint**: Event created with time windows

---

### Step 3: Test Two-Step Time-In

1. **Start Time-In**
   - Find your event in the list
   - Click the menu (⋮) button
   - Click "Time In (ID + Face)"

2. **Step 1: Enter Student ID**
   - Enter the student ID of the member you registered
   - Click "Next: Face Recognition →"
   - System should verify the student ID
   - You should see member info displayed

3. **Step 2: Face Recognition**
   - Camera should auto-start
   - Look directly at the camera
   - Click "Scan Face & Record Attendance"
   - Wait for face recognition
   - You should see "Face verified successfully!"
   - Then "Time In recorded successfully!"

**✅ Checkpoint**: Attendance record created with time_in

---

### Step 4: Test Two-Step Time-Out

1. **Start Time-Out**
   - Go back to Attendance page
   - Find the same event
   - Click menu (⋮) → "Time Out (ID + Face)"

2. **Step 1: Enter Student ID**
   - Enter the same student ID
   - Click "Next: Face Recognition →"
   - System should verify you have timed in
   - You should see member info + time-in time

3. **Step 2: Face Recognition**
   - Camera should auto-start
   - Look directly at the camera
   - Click "Scan Face & Record Time Out"
   - Wait for face recognition
   - You should see "Face verified successfully!"
   - Then "Time Out recorded successfully!"

**✅ Checkpoint**: Attendance record updated with time_out

---

### Step 5: View Attendance Records

1. **View Records**
   - Go to Attendance page
   - Find your event
   - Click menu (⋮) → "View Attendance"

2. **Verify Data**
   - You should see the member's record
   - Time In should be displayed
   - Time Out should be displayed
   - Status should be "Present"

**✅ Checkpoint**: Complete attendance record visible

---

### Step 6: Test Sanctions (Manual)

Since automatic sanctions require a scheduler, let's test manually:

1. **Navigate to Sanctions**
   - Click "Sanctions" in the sidebar
   - You should see the sanctions page

2. **View Summary**
   - Summary cards should show:
     - Total Sanctions
     - Unpaid Sanctions
     - Total Unpaid Amount
     - Total Paid Amount

3. **Test Filters**
   - Try searching by name or student ID
   - Try filtering by status (All/Unpaid/Paid)

**✅ Checkpoint**: Sanctions UI working

---

## 🧪 Test Scenarios

### Scenario 1: Invalid Student ID
**Test**: Enter a non-existent student ID
**Expected**: Error message "Student ID not found"

### Scenario 2: No Face Registered
**Test**: Try to time-in with a member who hasn't registered face
**Expected**: Error message "Please register your face first"

### Scenario 3: Wrong Face
**Test**: Enter Student ID A, but scan face of Student ID B
**Expected**: Error message "Face does not match the entered student ID"

### Scenario 4: Duplicate Time-In
**Test**: Try to time-in twice for the same event
**Expected**: Error message "You have already timed in for this event"

### Scenario 5: Time-Out Without Time-In
**Test**: Try to time-out without timing in first
**Expected**: Error message "You must time in first before timing out"

### Scenario 6: Duplicate Time-Out
**Test**: Try to time-out twice for the same event
**Expected**: Error message "You have already timed out for this event"

---

## 🔧 Troubleshooting

### Camera Not Working
1. Check browser permissions
2. Ensure HTTPS or localhost
3. Try different browser
4. Check if camera is being used by another app

### Face Recognition Fails
1. Ensure good lighting
2. Look directly at camera
3. Remove glasses if possible
4. Stay still during scan
5. Try again (max 3 attempts)

### Time Window Issues
1. Check event time settings
2. Verify current time is within window
3. Default window is 30 minutes
4. Set `testMode = true` in AttendanceTable.jsx to bypass time checks

### Database Errors
1. Run migrations: `php artisan migrate`
2. Check database connection
3. Verify foreign keys exist
4. Check Laravel logs

---

## 📊 Expected Database State After Testing

### members table
```
member_id | student_id | firstname | lastname | faceio_id
1         | 2021-0001  | John      | Doe      | face_abc123
```

### attendance_events table
```
event_id | date       | agenda          | time_in | time_out | time_in_duration | time_out_duration
1        | 2025-11-14 | Morning Meeting | 08:00   | 17:00    | 30               | 30
```

### attendance_records table
```
record_id | event_id | member_id | time_in             | time_out            | status
1         | 1        | 1         | 2025-11-14 08:15:00 | 2025-11-14 17:10:00 | Present
```

### sanctions table
```
(Empty if member completed both time-in and time-out)
```

---

## 🎯 Success Criteria

After completing all steps, you should have:

- ✅ Member with registered face
- ✅ Attendance event created
- ✅ Complete attendance record (time-in + time-out)
- ✅ No errors during the process
- ✅ All validations working correctly
- ✅ Sanctions page accessible

---

## 🚀 Next Steps

1. **Test with Multiple Members**
   - Register faces for 5-10 members
   - Have them all time-in/out
   - Verify no conflicts

2. **Test Time Windows**
   - Create event with specific time windows
   - Try to access outside windows
   - Verify error messages

3. **Test Sanctions**
   - Create event
   - Have some members skip time-in
   - Have some members skip time-out
   - Manually create sanctions in database
   - Verify sanctions appear in UI
   - Test marking as paid

4. **Production Setup**
   - Set `testMode = false` in AttendanceTable.jsx
   - Configure Laravel scheduler for automatic sanctions
   - Set up email notifications (optional)
   - Configure backup system

---

## 📞 Need Help?

Check these files for reference:
- `SYSTEM_COMPLETE.md` - Complete system documentation
- `TROUBLESHOOTING.md` - Common issues and solutions
- `storage/logs/laravel.log` - Laravel error logs
- Browser console - JavaScript errors

---

**Happy Testing! 🎉**
