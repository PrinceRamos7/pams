# Sanctions System

## Overview
The sanctions system automatically calculates and tracks penalties for members who fail to attend events or complete their time-in/time-out requirements.

## Sanction Rules

### Full Day Sanction (₱25.00)
- **Reason**: Failed to time in
- **Applies when**: Member did not time in at all during the event

### Half Day Sanction (₱12.50)
- **Reason**: Failed to time out
- **Applies when**: Member timed in but did not time out

### No Sanction (₱0.00)
- **Applies when**: Member completed both time-in and time-out

## How Sanctions are Calculated

### Automatic Calculation
Sanctions are automatically calculated when:
1. An event is **Force Closed** by an admin
2. The system runs the scheduled command: `php artisan sanctions:calculate`

### Manual Calculation
You can manually calculate sanctions for a specific date:
```bash
php artisan sanctions:calculate 2025-11-14
```

Or for today's events:
```bash
php artisan sanctions:calculate
```

## Viewing Sanctions

Navigate to **Sanctions** in the sidebar to view:
- Total sanctions count
- Unpaid sanctions count
- Total unpaid amount
- Total paid amount
- Detailed list of all sanctions with filters

## Managing Sanctions

### Mark as Paid
1. Go to the Sanctions page
2. Find the sanction in the list
3. Click **Mark as Paid** button
4. Confirm the action

### Filtering
- **Search**: Filter by member name or student ID
- **Status**: Filter by All, Unpaid, or Paid status

## Database Structure

### Sanctions Table
- `sanction_id`: Primary key
- `member_id`: Foreign key to members table
- `event_id`: Foreign key to attendance_events table
- `amount`: Sanction amount (decimal)
- `reason`: Reason for sanction
- `status`: 'unpaid' or 'paid'
- `payment_date`: Date when sanction was paid
- `created_at`: When sanction was created
- `updated_at`: Last update timestamp

## Important Notes

1. **Event Status**: Sanctions are only calculated for events with status 'closed' or when time windows have passed
2. **Active Members Only**: Only members with status 'Active' are included in sanction calculations
3. **No Duplicates**: The system prevents creating duplicate sanctions for the same member/event/reason
4. **Automatic on Force Close**: When you force close an event, sanctions are automatically calculated
5. **Philippine Time**: All timestamps use Philippine Time (Asia/Manila timezone)

## API Endpoints

### Get All Sanctions
```
GET /api/sanctions
```

### Get Sanctions Summary
```
GET /api/sanctions/summary
```

### Get Member Sanctions
```
GET /api/sanctions/member/{memberId}
```

### Mark Sanction as Paid
```
PUT /api/sanctions/{sanctionId}/pay
```

## Troubleshooting

### No Sanctions Showing
1. Check if events are closed: `php artisan tinker --execute="App\Models\AttendanceEvent::all(['event_id', 'agenda', 'status']);"`
2. Run sanctions calculation: `php artisan sanctions:calculate`
3. Check sanctions count: `php artisan tinker --execute="echo App\Models\Sanction::count();"`

### Sanctions Not Calculating
1. Verify event status is 'closed'
2. Check if time windows have passed
3. Verify members have status 'Active'
4. Check Laravel logs: `storage/logs/laravel.log`
