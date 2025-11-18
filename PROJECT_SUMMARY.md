# PITON Attendance Monitoring System (PAMS)

## Project Overview
A comprehensive attendance monitoring and member management system for PITON organization built with Laravel, Inertia.js, and React.

## Key Features

### 1. Member Management
- Member registration and profile management
- Bulk member import via CSV/manual entry
- Member history tracking with batch organization
- Visual member chart grouped by year level
- Profile picture upload and management
- Face recognition enrollment

### 2. Officers Management
- Officer assignment and role management
- Officer history tracking
- Organization chart visualization
- Batch officer management

### 3. Attendance System
- Event creation and management
- Two-step time-in/time-out process
- Face recognition for attendance
- Manual attendance recording
- Attendance reports and PDF export

### 4. Sanctions System
- Automatic sanction calculation based on attendance
- Manual sanction management
- Payment tracking (Paid/Unpaid/Excused)
- Member sanction details and history
- Event-based sanction reports
- PDF export for sanctions

### 5. Dashboard & Analytics
- Real-time statistics
- Attendance analytics
- Sanction analytics
- Recent events overview
- Top sanctioned members
- Toggle analytics view (Zen mode)

## Technical Stack

### Backend
- **Framework**: Laravel 11
- **Database**: MySQL
- **Authentication**: Laravel Breeze

### Frontend
- **Framework**: React 18
- **Routing**: Inertia.js
- **UI Components**: Radix UI, Shadcn/ui
- **Styling**: Tailwind CSS
- **Notifications**: React Hot Toast
- **Charts**: HTML2Canvas for exports

### Key Libraries
- Face recognition integration
- PDF generation (DomPDF)
- Image compression
- Form validation

## Project Structure

```
app/
├── Http/Controllers/
│   ├── AttendanceEventController.php
│   ├── AttendanceRecordController.php
│   ├── BatchController.php
│   ├── DashboardController.php
│   ├── FaceIOController.php
│   ├── MemberController.php
│   ├── MemberHistoryController.php
│   ├── OfficerController.php
│   └── SanctionController.php
├── Models/
│   ├── AttendanceEvent.php
│   ├── AttendanceRecord.php
│   ├── Member.php
│   ├── MemberHistory.php
│   ├── Officer.php
│   ├── OfficerHistory.php
│   └── Sanction.php
└── Services/
    └── SanctionService.php

resources/js/
├── Pages/
│   ├── Attendance/
│   ├── Dashboard/
│   ├── Members/
│   ├── Officers/
│   └── Sanctions/
└── Components/
    ├── Attendance/
    ├── Dashboard/
    ├── Members/
    ├── Officers/
    ├── Sanctions/
    └── ui/
```

## Important Routes

### Members
- `/members` - Member list
- `/members/chart` - Member chart
- `/members/history/list` - Member history

### Officers
- `/officers` - Officers list
- `/officers/history` - Officers history
- `/officers/org-chart` - Organization chart

### Attendance
- `/attendance-events` - Events list
- `/attendance-records/view/{eventId}` - View attendance

### Sanctions
- `/sanctions` - Events with sanctions
- `/sanctions/members` - Member sanctions
- `/sanctions/member/{memberId}` - Member sanction details

## Setup Instructions

### Prerequisites
- PHP 8.2+
- MySQL 8.0+
- Node.js 18+
- Composer

### Installation
1. Clone the repository
2. Install dependencies:
   ```bash
   composer install
   npm install
   ```
3. Configure environment:
   ```bash
   cp .env.example .env
   php artisan key:generate
   ```
4. Configure database in `.env`
5. Run migrations:
   ```bash
   php artisan migrate --seed
   ```
6. Build assets:
   ```bash
   npm run dev
   ```

### Running the Application
```bash
# Start Laravel server
php artisan serve

# Start Vite dev server (in another terminal)
npm run dev
```

## Key Documentation Files
- `README.md` - Project overview and setup
- `FACE_RECOGNITION_COMPLETE_GUIDE.md` - Face recognition setup
- `PHP_UPLOAD_CONFIG.md` - PHP upload configuration
- `START_MYSQL_GUIDE.md` - MySQL setup guide

## Database Schema

### Main Tables
- `members` - Member information
- `member_history` - Member change tracking
- `officers` - Officer assignments
- `officers_history` - Officer change tracking
- `attendance_events` - Event information
- `attendance_records` - Attendance records
- `sanctions` - Sanction records
- `batches` - Batch/cohort information
- `bulk_member_imports` - Bulk import tracking

## Features Implemented

✅ Member CRUD operations
✅ Bulk member import
✅ Member history tracking
✅ Member chart visualization
✅ Officer management
✅ Officer history tracking
✅ Organization chart
✅ Attendance event management
✅ Face recognition attendance
✅ Manual attendance recording
✅ Automatic sanction calculation
✅ Sanction payment tracking
✅ Dashboard analytics
✅ PDF exports for all modules
✅ Toast notifications
✅ Profile picture upload
✅ Search and filtering

## Development Notes

### Code Organization
- Pages handle routing and data fetching
- Components are reusable UI elements
- Controllers handle business logic
- Services handle complex operations
- Models define database relationships

### Best Practices
- Use Inertia.js for page navigation
- Use toast notifications for user feedback
- Validate data on both client and server
- Use transactions for complex operations
- Track changes in history tables

## Maintenance

### Regular Tasks
- Backup database regularly
- Monitor storage for uploaded images
- Review and archive old events
- Update dependencies periodically

### Troubleshooting
- Check Laravel logs: `storage/logs/laravel.log`
- Check browser console for frontend errors
- Verify database connections
- Clear cache: `php artisan cache:clear`

## Support
For issues or questions, refer to the documentation files or contact the development team.

---
Last Updated: November 18, 2025
