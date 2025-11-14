# Implementation Plan

## Task List

- [x] 1. Database setup and migrations




  - [ ] 1.1 Create sanctions table migration
    - Create migration file with sanctions table schema
    - Add foreign keys to members and events tables
    - Add indexes for performance


    - _Requirements: 4.4, 10.1, 10.2_
  
  - [x] 1.2 Modify attendance_events table



    - Add time_in_duration column (default 30)




    - Add time_out_duration column (default 30)
    - _Requirements: 2.2, 2.3, 2.4, 2.5_
  
  - [ ] 1.3 Add indexes to attendance_records table
    - Add composite index on (event_id, member_id)


    - Add index on (event_id, time_in)
    - _Requirements: 8.1, 8.2, 10.1_

- [ ] 2. Create Sanction model and service
  - [x] 2.1 Create Sanction model


    - Define table, primary key, and fillable fields
    - Add relationships to Member and Event
    - Add scopes for unpaid/paid sanctions





    - Add amount casting to decimal
    - _Requirements: 4.4, 5.2, 9.1, 9.2_
  
  - [ ] 2.2 Create SanctionService class
    - Implement calculateSanctionsForEvent method


    - Implement createSanction method with duplicate check
    - Add logic for 25 peso (no time-in) sanction
    - Add logic for 12.50 peso (no time-out) sanction





    - _Requirements: 4.1, 4.2, 4.3, 4.4_
  
  - [ ] 2.3 Set up Laravel Scheduler
    - Add scheduled task in Kernel.php
    - Run sanction calculation every 5 minutes


    - Process all events for current day
    - _Requirements: 4.1, 4.2, 4.3_

- [ ] 3. Create sanctions management API
  - [ ] 3.1 Create SanctionController
    - Implement index method with filters





    - Implement show method for single sanction
    - Implement update method for payment
    - Implement summary method for statistics
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 9.2_
  
  - [x] 3.2 Add sanction routes

    - GET /api/sanctions - List all sanctions
    - GET /api/sanctions/member/{memberId} - Member sanctions
    - PUT /api/sanctions/{sanctionId}/pay - Mark as paid
    - GET /api/sanctions/summary - Get summary stats
    - _Requirements: 5.1, 5.3, 5.4_

- [ ] 4. Implement two-step verification API
  - [x] 4.1 Create member verification endpoint

    - GET /api/members/verify/{studentId}
    - Return member info if valid
    - Check if face is registered
    - Return error if student ID invalid
    - _Requirements: 3.1, 3.2, 3.6_
  
  - [ ] 4.2 Update attendance recording endpoint
    - Modify POST /attendance-records endpoint
    - Accept student_id and face_id
    - Verify student ID exists
    - Verify face matches registered face
    - Check time window is active
    - Check for duplicate records
    - Record attendance with timestamp
    - _Requirements: 3.3, 3.4, 3.5, 3.7, 6.1, 6.2, 6.3, 6.4, 8.1, 8.2_

- [ ] 5. Create two-step time-in component
  - [ ] 5.1 Create TwoStepTimeIn.jsx component
    - Create step 1: Student ID entry form
    - Add student ID validation
    - Display member information on valid ID
    - Check if face is registered
    - Show error if no face registered
    - _Requirements: 3.1, 3.2, 3.6_
  
  - [ ] 5.2 Add step 2: Face recognition
    - Auto-start camera when step 2 loads
    - Display member's registered face info
    - Capture and compare face
    - Show match/no-match result
    - Record attendance on successful match
    - Allow retry on failed match (max 3 attempts)
    - _Requirements: 3.3, 3.4, 3.5, 3.7, 6.1, 6.2, 6.3, 6.4_
  
  - [ ] 5.3 Add time window status display
    - Show if time-in window is active
    - Display remaining time in window
    - Disable form if window is closed
    - Show next available window time
    - _Requirements: 2.2, 2.3, 7.1, 7.2, 7.4, 7.5_

- [x] 6. Create two-step time-out component
  - [x] 6.1 Create TwoStepTimeOut.jsx component
    - Reuse two-step verification logic
    - Verify member has time-in record
    - Show error if no time-in exists
    - _Requirements: 3.1, 3.2, 8.3, 8.4_
  
  - [x] 6.2 Add time-out specific validation
    - Check time-out window is active
    - Verify no existing time-out record
    - Record time-out with timestamp
    - _Requirements: 2.4, 2.5, 8.5_

- [x] 7. Create sanctions management interface
  - [x] 7.1 Create SanctionsIndex.jsx component
    - Display sanctions table with all fields
    - Add filters for member, date range, status
    - Show total unpaid amount
    - Add "Mark as Paid" action button
    - _Requirements: 5.1, 5.2, 5.3, 5.4_
  
  - [ ] 7.2 Create SanctionDetails.jsx component (Optional)
    - Show detailed sanction information
    - Display member and event details
    - Show payment history
    - Add payment form
    - _Requirements: 5.2, 5.5, 9.2, 9.3_
  
  - [ ] 7.3 Add sanctions to member profile (Optional)
    - Display member's sanctions list
    - Show total amount owed
    - Display warning if unpaid sanctions exist
    - _Requirements: 5.4, 9.5_

- [ ] 8. Update attendance event management
  - [ ] 8.1 Modify AttendanceEventController
    - Add time_in_duration to fillable (default 30)
    - Add time_out_duration to fillable (default 30)
    - Update validation rules
    - _Requirements: 2.1, 2.2, 2.5_
  
  - [ ] 8.2 Update event creation form
    - Add duration fields for time-in window
    - Add duration fields for time-out window
    - Set default values to 30 minutes
    - Add help text explaining windows
    - _Requirements: 2.1, 2.2, 2.5_

- [ ] 9. Add real-time time window indicators
  - [ ] 9.1 Create TimeWindowStatus.jsx component
    - Calculate if time-in window is active
    - Calculate if time-out window is active
    - Display active/inactive status with colors
    - Show remaining time in active window
    - Update every minute
    - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5_
  
  - [ ] 9.2 Update AttendanceTable.jsx
    - Add TimeWindowStatus component to each event
    - Show visual indicators (green=active, gray=inactive)
    - Disable buttons when windows are closed
    - _Requirements: 7.2, 7.3, 7.4_

- [ ] 10. Add face registration to members list
  - [ ] 10.1 Update MemberList.jsx
    - Add "Register Face" action button to each row
    - Show face registration status icon
    - Add quick link to registration page
    - _Requirements: 1.1_
  
  - [ ] 10.2 Update RegisterFace.jsx
    - Ensure proper member info display
    - Add success redirect back to members list
    - Show clear instructions
    - _Requirements: 1.2, 1.3, 1.4, 1.5_

- [ ] 11. Implement duplicate prevention
  - [ ] 11.1 Add duplicate check in AttendanceRecordController
    - Check for existing time-in before recording
    - Check for existing time-out before recording
    - Return appropriate error messages
    - _Requirements: 8.1, 8.2, 8.5_
  
  - [ ] 11.2 Add validation in frontend
    - Disable time-in if already recorded
    - Disable time-out if already recorded
    - Show existing record information
    - _Requirements: 8.1, 8.2, 8.5_

- [x] 12. Add navigation and routes
  - [x] 12.1 Add sanctions routes
    - Add route for sanctions index page
    - Add route for sanction details page
    - Add route for member sanctions view
    - _Requirements: 5.1_
  
  - [x] 12.2 Update sidebar navigation
    - Add "Sanctions" menu item
    - Add icon for sanctions
    - Show badge with unpaid count
    - _Requirements: 5.1_
  
  - [x] 12.3 Update attendance routes
    - Add two-step-time-in route
    - Add two-step-time-out route
    - Keep manual entry routes as fallback
    - Keep legacy face routes for backward compatibility
    - _Requirements: 3.1, 3.3_

- [ ] 13. Add error handling and validation
  - [ ] 13.1 Implement face recognition error handling
    - Handle "no face registered" error
    - Handle "face mismatch" error
    - Handle "camera access denied" error
    - Add retry logic with attempt limits
    - _Requirements: 3.6, 3.7, 6.5_
  
  - [ ] 13.2 Implement attendance error handling
    - Handle "invalid student ID" error
    - Handle "duplicate time-in" error
    - Handle "time window closed" error
    - Handle "no time-in record" error
    - _Requirements: 8.1, 8.2, 8.3, 8.4_
  
  - [ ] 13.3 Add user-friendly error messages
    - Create error message component
    - Add clear action instructions
    - Add retry buttons where appropriate
    - _Requirements: All error scenarios_

- [ ] 14. Testing and validation
  - [ ] 14.1 Test two-step verification flow
    - Test valid student ID + matching face
    - Test invalid student ID
    - Test valid ID + non-matching face
    - Test no face registered scenario
    - _Requirements: 3.1-3.7_
  
  - [ ] 14.2 Test time window logic
    - Test active time-in window
    - Test expired time-in window
    - Test active time-out window
    - Test expired time-out window
    - _Requirements: 2.2-2.5, 7.1-7.5_
  
  - [ ] 14.3 Test sanction calculation
    - Test 25 peso sanction for no time-in
    - Test 12.50 peso sanction for no time-out
    - Test no sanction for complete attendance
    - Test duplicate sanction prevention
    - _Requirements: 4.1-4.5_
  
  - [ ] 14.4 Test sanctions management
    - Test viewing all sanctions
    - Test filtering sanctions
    - Test marking sanctions as paid
    - Test calculating totals
    - _Requirements: 5.1-5.5_

- [ ] 15. Documentation and deployment
  - [ ] 15.1 Update README with new features
    - Document two-step verification process
    - Document time window configuration
    - Document sanctions system
    - Add troubleshooting guide
    - _Requirements: All_
  
  - [ ] 15.2 Create user guide
    - Write guide for members (how to register face and attend)
    - Write guide for admins (how to manage sanctions)
    - Add screenshots and examples
    - _Requirements: All_
  
  - [ ] 15.3 Run final tests
    - Test complete attendance cycle
    - Test sanction workflow
    - Test all error scenarios
    - Verify database integrity
    - _Requirements: All_

---

## Implementation Notes

- Start with database migrations (Task 1) to establish foundation
- Build backend services and APIs (Tasks 2-4) before frontend
- Implement frontend components (Tasks 5-7) with backend ready
- Add real-time features and polish (Tasks 8-10)
- Implement validation and error handling (Tasks 11-13)
- Thorough testing before deployment (Task 14)
- Complete documentation (Task 15)

## Estimated Timeline

- Database & Backend: 2-3 days
- Frontend Components: 2-3 days
- Integration & Testing: 1-2 days
- Documentation: 1 day
- **Total: 6-9 days**

## Success Criteria

- ✅ Members can register faces from members list
- ✅ Two-step verification (ID + Face) works for time-in/out
- ✅ Time windows automatically activate/deactivate
- ✅ Sanctions automatically calculated after windows close
- ✅ Sanctions can be viewed, filtered, and marked as paid
- ✅ Face matching prevents fraud (wrong face for student ID)
- ✅ Duplicate attendance prevented
- ✅ All error scenarios handled gracefully
- ✅ System is bug-free and fully functional
