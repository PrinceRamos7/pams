# FaceIO Integration Setup Guide

This guide will help you set up FaceIO face recognition for your attendance system.

## 1. Get FaceIO API Key

1. Go to [https://console.faceio.net/](https://console.faceio.net/)
2. Sign up for a free account
3. Create a new application
4. Copy your **Public ID** (FIOAPP-XXXXXX)

## 2. Configure Environment Variables

1. Open your `.env` file
2. Add the following line with your FaceIO Public ID:
   ```
   VITE_FACEIO_PUBLIC_ID=your_faceio_public_id_here
   ```
3. Replace `your_faceio_public_id_here` with your actual Public ID

## 3. Run Database Migrations

Run the following command to add FaceIO fields to your database:

```bash
php artisan migrate
```

This will add the `faceio_id` column to both `users` and `members` tables.

## 4. Install Dependencies

The FaceIO package has already been installed. If you need to reinstall:

```bash
npm install
```

## 5. Build Frontend Assets

```bash
npm run build
```

Or for development:

```bash
npm run dev
```

## 6. How to Use FaceIO

### For Members - Face Registration

1. Navigate to **Members** section
2. Click on a member to view details
3. Click **"Register Face"** button
4. Follow the on-screen instructions to scan your face
5. Once registered, the member can use face recognition for attendance

### For Attendance - Face Recognition Time In/Out

1. Navigate to **Attendance** section
2. Select an event
3. Choose **"Face Time In"** or **"Face Time Out"**
4. Click **"Scan Face"** button
5. The system will automatically recognize the member and record attendance

## 7. Features

- ✅ Face enrollment for members
- ✅ Face authentication for attendance
- ✅ Automatic member recognition
- ✅ Duplicate check-in prevention
- ✅ Manual entry fallback option
- ✅ Face data removal capability

## 8. Routes Added

### Web Routes (Frontend)
- `/members/{id}/register-face` - Register face for a member
- `/attendance-records/face-time-in/{eventId}` - Face recognition time in
- `/attendance-records/face-time-out/{eventId}` - Face recognition time out

### API Routes (Backend)
- `POST /api/faceio/enroll` - Enroll a member's face
- `POST /api/faceio/authenticate` - Authenticate using face
- `DELETE /api/faceio/unenroll/{memberId}` - Remove face enrollment
- `GET /api/faceio/check-enrollment/{memberId}` - Check enrollment status

## 9. Database Changes

### Members Table
- Added `faceio_id` column (nullable, unique)

### Users Table
- Added `faceio_id` column (nullable, unique)

## 10. Files Created/Modified

### New Files
- `resources/js/utils/faceio.js` - FaceIO utility functions
- `resources/js/Pages/Attendance/FaceTimeIn.jsx` - Face time in page
- `resources/js/Pages/Attendance/FaceTimeOut.jsx` - Face time out page
- `resources/js/Pages/Members/RegisterFace.jsx` - Face registration page
- `app/Http/Controllers/FaceIOController.php` - FaceIO controller
- `database/migrations/2025_11_14_000001_add_faceio_id_to_members_table.php`
- `database/migrations/2025_11_14_000002_add_faceio_id_to_users_table.php`

### Modified Files
- `app/Models/Member.php` - Added faceio_id to fillable
- `app/Models/User.php` - Added faceio_id to fillable
- `app/Http/Controllers/AttendanceRecordController.php` - Added FaceIO support
- `routes/web.php` - Added FaceIO routes
- `.env.example` - Added FaceIO configuration
- `package.json` - Added @faceio/fiojs dependency

## 11. Troubleshooting

### Face enrollment fails
- Ensure good lighting
- Look directly at the camera
- Remove glasses if possible
- Check that your FaceIO Public ID is correct in `.env`

### Member not recognized
- Ensure the member has registered their face first
- Try re-registering the face
- Check browser console for errors

### API errors
- Verify your FaceIO Public ID is correct
- Check that migrations have been run
- Ensure the member exists in the database

## 12. Security Notes

- FaceIO data is stored securely on FaceIO servers
- Only the facial ID is stored in your database
- Face data can be removed at any time
- All routes are protected with authentication middleware

## 13. Support

For FaceIO-specific issues, visit:
- [FaceIO Documentation](https://faceio.net/dev-guides)
- [FaceIO Console](https://console.faceio.net/)
- [FaceIO Support](https://faceio.net/support)

## 14. Next Steps

1. Test face registration with a member
2. Test face authentication for attendance
3. Train your users on proper face scanning techniques
4. Monitor FaceIO usage in your console dashboard
