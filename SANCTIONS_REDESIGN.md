# Sanctions Page Redesign - November 14, 2025

## Overview
Redesigned the Sanctions system to show events grouped by sanctions instead of individual sanction records.

## New Structure

### Main Sanctions Page (`/sanctions`)
Shows a list of events that have sanctions with:
- **ID**: Event ID
- **Event**: Event name/agenda
- **Total Amount**: Sum of all sanctions for that event
- **Date**: Event date
- **Actions**: Three-dot menu button with hover tooltip showing member count

### Event Detail Page (`/sanctions/event/{eventId}`)
Shows all members with sanctions for a specific event:
- **Student ID**: Member's student ID
- **Member Name**: Full name
- **Type**: 
  - "No Time In" (₱25.00) - Failed to time in
  - "No Time Out" (₱12.50) - Failed to time out
  - "Absent" - Neither time in nor time out
- **Amount**: Sanction amount
- **Status**: Paid or Unpaid
- **Actions**: "Mark as Paid" button for unpaid sanctions

## Features

### Main Page Features
1. **Summary Cards**:
   - Total Sanctions count
   - Unpaid Sanctions count
   - Total Unpaid Amount
   - Total Paid Amount

2. **Search**: Filter events by ID or event name

3. **Hover Tooltip**: Shows "View X member(s) with sanctions" when hovering over the three-dot button

### Event Detail Features
1. **Back Button**: Navigate back to main sanctions page

2. **Event Information**: Shows event name and formatted date

3. **Summary Cards**:
   - Total Members with sanctions
   - Total Amount
   - Unpaid Amount
   - Paid Amount

4. **Search**: Filter members by name or student ID

5. **Mark as Paid**: Individual button for each unpaid sanction

## Technical Implementation

### Controller Changes
**File**: `app/Http/Controllers/SanctionController.php`

1. **index()**: Groups sanctions by event_id and returns aggregated data
2. **eventSanctions($eventId)**: Returns all sanctions for a specific event

### Frontend Components
**Files**: 
- `resources/js/Pages/Sanctions/Index.jsx` - Main page
- `resources/js/Pages/Sanctions/EventDetail.jsx` - Event detail page

### Routes Added
```php
Route::get('/sanctions', [SanctionController::class, 'index'])->name('sanctions.index');
Route::get('/sanctions/event/{eventId}', [SanctionController::class, 'eventSanctions'])->name('sanctions.event');
```

## Data Flow

1. User visits `/sanctions`
2. Controller groups all sanctions by event
3. Main page displays events with total amounts
4. User clicks three-dot menu on an event
5. Navigates to `/sanctions/event/{eventId}`
6. Detail page shows all members with sanctions for that event
7. User can mark individual sanctions as paid
8. Page reloads with updated data

## UI/UX Improvements

1. **Cleaner Overview**: Main page shows high-level event data instead of overwhelming individual records
2. **Drill-Down Navigation**: Users can click to see details only when needed
3. **Visual Feedback**: Hover tooltips provide context before clicking
4. **Color Coding**:
   - Red: No Time In / Unpaid
   - Orange: No Time Out
   - Green: Paid
5. **Responsive Design**: Works on all screen sizes

## Example Data

### Main Page Display
```
ID | Event        | Total Amount | Date       | Actions
6  | Meeting      | ₱87.50      | 11/14/2025 | ⋮ (4 members)
7  | Anniversary  | ₱75.00      | 11/14/2025 | ⋮ (3 members)
```

### Event Detail Display (Event 6 - Meeting)
```
Student ID | Member Name      | Type        | Amount  | Status
23-00776   | Prince Andrey R. | No Time Out | ₱12.50  | Unpaid
23-12345   | Carlos Sainz     | No Time In  | ₱25.00  | Unpaid
23-00777   | Renato Beronia   | No Time In  | ₱25.00  | Unpaid
23-00778   | Joe Bayucan      | No Time In  | ₱25.00  | Unpaid
```

## Testing

1. Navigate to `/sanctions` - Should show 2 events
2. Hover over three-dot button - Should show tooltip
3. Click three-dot button - Should navigate to event detail
4. Search for members - Should filter results
5. Click "Mark as Paid" - Should update status and reload
6. Click "Back to Sanctions" - Should return to main page

## Benefits

1. **Better Organization**: Events are the natural grouping for sanctions
2. **Easier Management**: Admins can see which events have issues at a glance
3. **Faster Navigation**: Less scrolling through individual records
4. **Clear Context**: Members are shown in the context of their event
5. **Scalability**: Works well even with many events and sanctions
