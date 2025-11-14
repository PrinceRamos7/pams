# Requirements Document

## Introduction

This document outlines the requirements for a comprehensive attendance management system with face recognition, automatic time windows, and sanctions tracking for organization members.

## Glossary

- **System**: The Piton Attendance Monitoring System (PAMS)
- **Member**: A registered member of the organization
- **Attendance Event**: A scheduled event requiring member attendance
- **Time Window**: The allowed period for time-in or time-out
- **Sanction**: A penalty applied to members who fail to attend
- **Face Descriptor**: Mathematical representation of a member's face
- **Student ID**: Unique identifier for each member

---

## Requirements

### Requirement 1: Member Face Registration

**User Story:** As an organization member, I want to register my face in the system, so that I can use face recognition for attendance.

#### Acceptance Criteria

1. WHEN a member accesses the members list, THE System SHALL display a "Register Face" action button for each member
2. WHEN the "Register Face" button is clicked, THE System SHALL open a face registration interface with live camera preview
3. WHEN the camera is started, THE System SHALL display the member's information (name, student ID) for verification
4. WHEN a face is detected and captured, THE System SHALL generate a face descriptor and store it in the database
5. WHEN face registration is successful, THE System SHALL display a success message and return to the members list

---

### Requirement 2: Attendance Event Time Windows

**User Story:** As an administrator, I want to set time-in and time-out periods for attendance events, so that members can only check in during specified windows.

#### Acceptance Criteria

1. WHEN an attendance event is created, THE System SHALL require time-in start time and time-out start time
2. WHEN the time-in period begins, THE System SHALL automatically enable the time-in functionality for 30 minutes
3. WHEN 30 minutes have elapsed from time-in start, THE System SHALL automatically disable time-in functionality
4. WHEN the time-out period begins, THE System SHALL automatically enable the time-out functionality for 30 minutes
5. WHEN 30 minutes have elapsed from time-out start, THE System SHALL automatically disable time-out functionality

---

### Requirement 3: Two-Step Attendance Verification

**User Story:** As an organization member, I want to verify my attendance using both student ID and face recognition, so that the system ensures accurate identification.

#### Acceptance Criteria

1. WHEN a member initiates time-in, THE System SHALL first prompt for student ID entry
2. WHEN a valid student ID is entered, THE System SHALL display the member's information (name, email, year, status)
3. WHEN member information is displayed, THE System SHALL prompt for face recognition verification
4. WHEN face recognition is initiated, THE System SHALL compare the captured face with the registered face descriptor
5. WHEN both student ID and face match, THE System SHALL record the attendance with timestamp
6. IF student ID is invalid, THEN THE System SHALL display an error message and prevent face recognition
7. IF face does not match the registered face, THEN THE System SHALL display an error message and prevent attendance recording

---

### Requirement 4: Automatic Sanction Calculation

**User Story:** As an administrator, I want the system to automatically calculate sanctions for members who fail to attend, so that penalties are applied fairly and consistently.

#### Acceptance Criteria

1. WHEN the time-in window closes, THE System SHALL identify members who did not time in
2. WHEN a member fails to time in, THE System SHALL create a sanction record with 25 pesos penalty
3. WHEN a member times in but fails to time out, THE System SHALL create a sanction record with 12.50 pesos penalty
4. WHEN a sanction is created, THE System SHALL record the event, member, amount, reason, and timestamp
5. WHEN multiple sanctions exist for a member, THE System SHALL calculate the total amount owed

---

### Requirement 5: Sanctions Management

**User Story:** As an administrator, I want to view all sanctions for all members, so that I can track penalties and payments.

#### Acceptance Criteria

1. WHEN the sanctions page is accessed, THE System SHALL display a list of all sanctions
2. WHEN displaying sanctions, THE System SHALL show member name, student ID, event, amount, reason, date, and status
3. WHEN viewing sanctions, THE System SHALL allow filtering by member, date range, and status
4. WHEN viewing a member's sanctions, THE System SHALL display the total amount owed
5. WHEN a sanction is paid, THE System SHALL allow marking it as "Paid" with payment date

---

### Requirement 6: Face Recognition Matching

**User Story:** As the system, I want to ensure that the face being scanned matches the registered face for the student ID entered, so that attendance fraud is prevented.

#### Acceptance Criteria

1. WHEN face recognition is performed, THE System SHALL retrieve the face descriptor for the entered student ID
2. WHEN comparing faces, THE System SHALL calculate the Euclidean distance between descriptors
3. WHEN the distance is below 0.6 threshold, THE System SHALL consider it a match
4. WHEN the distance is above 0.6 threshold, THE System SHALL reject the match and display error
5. WHEN no face descriptor exists for the student ID, THE System SHALL prompt the member to register their face first

---

### Requirement 7: Real-Time Time Window Status

**User Story:** As an organization member, I want to see if time-in or time-out is currently active, so that I know when I can record my attendance.

#### Acceptance Criteria

1. WHEN viewing an attendance event, THE System SHALL display the current time
2. WHEN the current time is within the time-in window, THE System SHALL display "Time In Active" status
3. WHEN the current time is within the time-out window, THE System SHALL display "Time Out Active" status
4. WHEN the current time is outside both windows, THE System SHALL display "Not Active" status
5. WHEN a window is active, THE System SHALL display the remaining time in the window

---

### Requirement 8: Attendance Record Validation

**User Story:** As the system, I want to prevent duplicate attendance records, so that members cannot check in or out multiple times.

#### Acceptance Criteria

1. WHEN a member attempts to time in, THE System SHALL check if they already have a time-in record for the event
2. IF a time-in record exists, THEN THE System SHALL display an error message and prevent duplicate entry
3. WHEN a member attempts to time out, THE System SHALL verify they have a time-in record for the event
4. IF no time-in record exists, THEN THE System SHALL display an error message and prevent time-out
5. WHEN a member has both time-in and time-out records, THE System SHALL prevent any further attendance actions

---

### Requirement 9: Sanction Status Tracking

**User Story:** As an administrator, I want to track the payment status of sanctions, so that I can manage outstanding penalties.

#### Acceptance Criteria

1. WHEN a sanction is created, THE System SHALL set the status to "Unpaid"
2. WHEN a sanction payment is recorded, THE System SHALL update the status to "Paid"
3. WHEN viewing sanctions, THE System SHALL display the payment date for paid sanctions
4. WHEN calculating totals, THE System SHALL only include unpaid sanctions
5. WHEN a member has unpaid sanctions, THE System SHALL display a warning on their profile

---

### Requirement 10: Database Integrity

**User Story:** As the system, I want to maintain data integrity across all tables, so that attendance and sanction records are accurate and reliable.

#### Acceptance Criteria

1. WHEN creating attendance records, THE System SHALL use foreign keys to link to members and events
2. WHEN creating sanction records, THE System SHALL use foreign keys to link to members and events
3. WHEN a member is deleted, THE System SHALL prevent deletion if attendance or sanction records exist
4. WHEN an event is deleted, THE System SHALL prevent deletion if attendance or sanction records exist
5. WHEN database operations fail, THE System SHALL rollback transactions to maintain consistency

---

## Summary

This requirements document defines a comprehensive attendance system with:
- Face registration for members
- Two-step verification (Student ID + Face Recognition)
- Automatic time windows (30 minutes each)
- Automatic sanction calculation (25 pesos full day, 12.50 pesos half day)
- Sanctions tracking and management
- Real-time status indicators
- Duplicate prevention
- Data integrity enforcement

All requirements follow EARS patterns and INCOSE quality rules for clarity and testability.
