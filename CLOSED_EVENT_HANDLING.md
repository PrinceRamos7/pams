# Closed Event Handling

## Overview
Enhanced the attendance system to properly handle closed events by disabling Time In/Time Out buttons and displaying a clear "Closed" status badge.

## Changes Made

### 1. Visual Status Indicator
**Location**: Event card header

**Added**:
- Red "Closed" badge next to event title when `event.status === 'closed'`
- Badge styling: `bg-red-100 text-red-700` with rounded corners
- Positioned inline with event name for immediate visibility

**Example**:
```
📅 Meeting [Closed]
Fri, Nov 14, 2025
```

### 2. Disabled Time In Button
**Location**: Dropdown menu

**Behavior**:
- When event is closed:
  - Button becomes grayed out (`opacity-50`)
  - Cursor changes to `not-allowed`
  - Background changes to `bg-gray-50`
  - Shows "Closed" badge instead of "Active"
  - Click shows error notification: "Event is closed. Cannot time in."
  - Prevents navigation to time-in page

**Visual States**:
- **Active**: Green text, green hover background, "Active" badge
- **Inactive**: Gray text, no hover effect
- **Closed**: Gray text, gray background, "Closed" badge, not clickable

### 3. Disabled Time Out Button
**Location**: Dropdown menu

**Behavior**:
- When event is closed:
  - Button becomes grayed out (`opacity-50`)
  - Cursor changes to `not-allowed`
  - Background changes to `bg-gray-50`
  - Shows "Closed" badge instead of "Active"
  - Click shows error notification: "Event is closed. Cannot time out."
  - Prevents navigation to time-out page

**Visual States**:
- **Active**: Red text, red hover background, "Active" badge
- **Inactive**: Gray text, no hover effect
- **Closed**: Gray text, gray background, "Closed" badge, not clickable

### 4. Error Notifications
**Added clear error messages**:
- "Event is closed. Cannot time in." - When trying to time in on closed event
- "Event is closed. Cannot time out." - When trying to time out on closed event
- "Time In period is not active" - When time-in window is not open
- "Time Out period is not active" - When time-out window is not open

## Technical Implementation

### Event Status Check
```javascript
if (event.status === 'closed') {
    e.preventDefault();
    showNotification("Event is closed. Cannot time in.", "error");
    setOpenMenuId(null);
    return;
}
```

### Conditional Styling
```javascript
className={`w-full text-left px-4 py-2 flex items-center gap-3 ${
    event.status === 'closed' || (!isTimeInActive(event) && !testMode)
        ? 'opacity-50 cursor-not-allowed text-gray-400 bg-gray-50' 
        : 'hover:bg-green-50 text-green-700 cursor-pointer'
}`}
```

### Status Badge Display
```javascript
{event.status === 'closed' ? (
    <span className="ml-auto px-2 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full">
        Closed
    </span>
) : isTimeInActive(event) && (
    <span className="ml-auto px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
        Active
    </span>
)}
```

## User Experience Flow

### For Open Events:
1. User sees event card with no status badge
2. Time In/Time Out buttons are enabled (if within time window)
3. Buttons show "Active" badge when time window is open
4. Clicking button navigates to attendance page

### For Closed Events:
1. User sees event card with red "Closed" badge
2. Time In/Time Out buttons are grayed out
3. Buttons show "Closed" badge
4. Hovering shows `not-allowed` cursor
5. Clicking button:
   - Prevents navigation
   - Shows error notification
   - Closes dropdown menu
   - No action is performed

## Benefits

1. **Clear Visual Feedback**: Users immediately see which events are closed
2. **Prevents Errors**: Disabled buttons prevent accidental clicks
3. **Better UX**: Clear error messages explain why action can't be performed
4. **Consistent Behavior**: Same pattern for both Time In and Time Out
5. **Accessibility**: Proper cursor states and visual indicators

## Testing Checklist

- [x] Closed event shows "Closed" badge in card header
- [x] Time In button is disabled for closed events
- [x] Time Out button is disabled for closed events
- [x] Clicking disabled Time In shows error notification
- [x] Clicking disabled Time Out shows error notification
- [x] Buttons show "Closed" badge instead of "Active"
- [x] Cursor changes to `not-allowed` on hover
- [x] Navigation is prevented for closed events
- [x] Open events still work normally
- [x] Active time windows still show "Active" badge

## Files Modified

1. **resources/js/Components/Attendance/AttendanceTable.jsx**
   - Added "Closed" badge to event card header
   - Enhanced Time In button with closed status check
   - Enhanced Time Out button with closed status check
   - Improved error notifications
   - Updated button styling for disabled state

## Future Enhancements

Potential improvements:
1. Add "Ended" badge for events that naturally ended (vs force closed)
2. Show reason for closure (manual close, auto-close, etc.)
3. Add tooltip explaining why buttons are disabled
4. Allow viewing attendance even for closed events
5. Add "Reopen Event" option for admins
6. Show closure timestamp
7. Display who closed the event
