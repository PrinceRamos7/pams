# 📋 Sanctions System Guide

## How Sanctions Work

The system automatically calculates sanctions based on attendance:

- **₱25.00** - Full day sanction (No time-in)
- **₱12.50** - Half day sanction (No time-out)
- **₱0.00** - No sanction (Complete attendance)

---

## Manual Sanction Calculation

Since automatic calculation requires a cron job (Laravel Scheduler), you can manually calculate sanctions using this command:

### Calculate Sanctions for Today
```bash
php artisan sanctions:calculate
```

### Calculate Sanctions for Specific Date
```bash
php artisan sanctions:calculate 2025-11-14
```

---

## Example Workflow

### 1. Create an Event
- Date: 2025-11-14
- Time In: 08:00 (Window: 08:00 - 08:30)
- Time Out: 17:00 (Window: 17:00 - 17:30)

### 2. Members Attend
- **Member A**: Times in at 08:15, times out at 17:10 ✅ No sanction
- **Member B**: Times in at 08:20, forgets to time out ⚠️ ₱12.50 sanction
- **Member C**: Doesn't attend at all ❌ ₱25.00 sanction

### 3. Calculate Sanctions (After time windows close)
```bash
php artisan sanctions:calculate 2025-11-14
```

Output:
```
Calculating sanctions for date: 2025-11-14
Processing event: Meeting (ID: 1)
  ✓ Created 2 sanctions
Total sanctions created: 2
```

### 4. View Sanctions
- Go to Sanctions page in the system
- See all sanctions with member names, amounts, and status
- Filter by paid/unpaid
- Search by member name or student ID

### 5. Mark as Paid
- Click "Mark as Paid" button when member pays
- Sanction status changes from "Unpaid" to "Paid"

---

## Testing the System

### Step 1: Ensure You Have Members
```bash
php artisan tinker --execute="echo Member::count();"
```

If 0, add members through the Members page.

### Step 2: Create a Test Event
- Go to Attendance page
- Click "New Event"
- Fill in:
  - Date: Today
  - Event Name: "Test Meeting"
  - Time In: 08:00
  - Time Out: 17:00
- Click "Create Event"

### Step 3: Simulate Attendance
**Option A: Some members attend**
- Have 1-2 members time in and time out
- Leave other members without attendance

**Option B: No one attends**
- Don't record any attendance

### Step 4: Calculate Sanctions
```bash
php artisan sanctions:calculate
```

### Step 5: View Results
- Go to Sanctions page
- You should see sanctions for members who didn't attend

---

## Automatic Sanctions (Production Setup)

For automatic calculation, set up Laravel Scheduler:

### 1. Update `app/Console/Kernel.php`
```php
protected function schedule(Schedule $schedule)
{
    // Calculate sanctions every 5 minutes
    $schedule->call(function () {
        $sanctionService = app(SanctionService::class);
        $events = AttendanceEvent::whereDate('date', today())->get();
        foreach ($events as $event) {
            $sanctionService->calculateSanctionsForEvent($event->event_id);
        }
    })->everyFiveMinutes();
}
```

### 2. Set Up Cron Job (Linux/Mac)
```bash
* * * * * cd /path-to-your-project && php artisan schedule:run >> /dev/null 2>&1
```

### 3. For Windows (Task Scheduler)
Create a task that runs every minute:
```
Program: C:\path\to\php.exe
Arguments: C:\path\to\project\artisan schedule:run
```

---

## Sanctions Page Features

### Summary Cards
- Total Sanctions
- Unpaid Sanctions Count
- Total Unpaid Amount
- Total Paid Amount

### Sanctions Table
- Student ID
- Member Name
- Event Name
- Sanction Type (No Time In / No Time Out)
- Amount
- Date
- Status (Paid/Unpaid)
- Actions (Mark as Paid button)

### Filters
- Search by name or student ID
- Filter by status (All/Unpaid/Paid)

---

## Weekly Sanctions Report

To see sanctions per member per week, you can:

### Option 1: Use Date Filters (Coming Soon)
The sanctions page will have date range filters to show weekly data.

### Option 2: Database Query
```bash
php artisan tinker
```

```php
// Get sanctions for current week
$startOfWeek = Carbon::now()->startOfWeek();
$endOfWeek = Carbon::now()->endOfWeek();

$sanctions = Sanction::with(['member', 'event'])
    ->whereBetween('created_at', [$startOfWeek, $endOfWeek])
    ->get()
    ->groupBy('member_id');

foreach ($sanctions as $memberId => $memberSanctions) {
    $member = $memberSanctions->first()->member;
    $total = $memberSanctions->sum('amount');
    echo "{$member->firstname} {$member->lastname}: ₱{$total}\n";
}
```

---

## Troubleshooting

### "Failed to load sanctions"
- Check if the route is accessible: Visit `/sanctions` in browser
- Check Laravel logs: `storage/logs/laravel.log`
- Verify database connection

### No sanctions created
- Ensure time windows have closed
- Check if members are marked as "Active"
- Verify attendance records exist
- Run calculation command manually

### Sanctions not showing
- Refresh the page
- Clear browser cache
- Check browser console for errors

---

## Quick Commands Reference

```bash
# Calculate sanctions for today
php artisan sanctions:calculate

# Calculate for specific date
php artisan sanctions:calculate 2025-11-14

# Check sanctions count
php artisan tinker --execute="echo Sanction::count();"

# View all sanctions
php artisan tinker --execute="echo json_encode(Sanction::with(['member', 'event'])->get());"

# Clear unpaid sanctions (testing only!)
php artisan tinker --execute="Sanction::unpaid()->delete();"
```

---

## Next Steps

1. ✅ Test manual sanction calculation
2. ✅ View sanctions in the UI
3. ✅ Test marking sanctions as paid
4. ⏳ Set up automatic calculation (optional)
5. ⏳ Add weekly report feature (optional)

---

**The sanctions system is now ready to use!** 🎉
