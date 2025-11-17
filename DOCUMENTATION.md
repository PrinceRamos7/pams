# PITON Integrated Management System - Documentation

## Quick Links

### Main Documentation
- **README.md** - Project overview and setup instructions
- **FACE_RECOGNITION_COMPLETE_GUIDE.md** - Complete face recognition guide
- **DEPLOYMENT_CHECKLIST.md** - Deployment steps and checklist
- **TROUBLESHOOTING.md** - Common issues and solutions

---

## System Features

### 1. Face Recognition
Complete face recognition system for attendance and authentication.
- Member face registration and attendance
- Admin face authentication for protected operations
- Profile picture from registered face
- Modern UI with live camera preview

📖 **See**: `FACE_RECOGNITION_COMPLETE_GUIDE.md`

### 2. Attendance Management
- Daily attendance events
- Time in/out windows
- Face recognition or manual entry
- Force begin/reopen/close options
- Automatic sanction calculation

### 3. Sanctions System
- Automatic calculation on event close
- Member sanctions tracking
- Payment status management
- Excuse functionality
- PDF export

### 4. Member Management
- Member registration and profiles
- Face registration
- Profile pictures
- Status tracking
- PDF export

### 5. Officers Management
- Officer positions and history
- Batch management
- Organization chart
- Historical tracking

### 6. Dashboard
- Analytics overview
- Recent events
- Sanction statistics
- Attendance trends
- Hide/Show analytics mode

---

## Technology Stack

### Frontend
- **React** with Inertia.js
- **Tailwind CSS** for styling
- **Lucide React** for icons
- **Shadcn/ui** components
- **Face-api.js** for face recognition

### Backend
- **Laravel 11**
- **PHP 8.2+**
- **MySQL** database
- **Inertia.js** for SPA

---

## Quick Start

### Installation
```bash
# Install dependencies
composer install
npm install

# Setup environment
cp .env.example .env
php artisan key:generate

# Run migrations
php artisan migrate

# Seed database (optional)
php artisan db:seed

# Build assets
npm run build

# Start server
php artisan serve
```

### Development
```bash
# Watch assets
npm run dev

# Run tests
php artisan test
```

---

## Key Features Summary

### Face Recognition
- ✅ Member attendance (time in/out)
- ✅ Admin authentication (password alternative)
- ✅ Profile picture from face
- ✅ Modern UI with live preview
- ✅ 3 attempt limit with fallback

### Attendance
- ✅ Event management
- ✅ Time windows with duration
- ✅ Force operations (begin/reopen/close)
- ✅ Face or manual entry
- ✅ Automatic sanctions

### Sanctions
- ✅ Auto-calculation on close
- ✅ Force reopen removes sanctions
- ✅ Recalculation on final close
- ✅ Payment tracking
- ✅ Excuse functionality

### Security
- ✅ Dual authentication (password/face)
- ✅ Protected operations
- ✅ Audit logging
- ✅ Session management

---

## Support

### Getting Help
1. Check **TROUBLESHOOTING.md** for common issues
2. Review **FACE_RECOGNITION_COMPLETE_GUIDE.md** for face recognition
3. Check **DEPLOYMENT_CHECKLIST.md** for deployment issues
4. Review Laravel logs: `storage/logs/laravel.log`

### Common Issues
- Camera not working → Check browser permissions
- Face not recognized → Ensure good lighting
- Deployment issues → Check DEPLOYMENT_CHECKLIST.md
- General errors → Check TROUBLESHOOTING.md

---

## Project Structure

```
pams/
├── app/                    # Laravel application
│   ├── Http/Controllers/  # Controllers
│   ├── Models/            # Eloquent models
│   └── Services/          # Business logic
├── database/              # Migrations and seeders
├── resources/
│   ├── js/               # React components
│   │   ├── Pages/        # Page components
│   │   ├── Components/   # Reusable components
│   │   └── utils/        # Utilities (faceio.js)
│   ├── css/              # Styles
│   └── views/            # Blade templates
├── routes/               # Route definitions
└── public/               # Public assets
```

---

## Version History

- **v2.0** - Admin face authentication
- **v1.5** - Face image profile display
- **v1.4** - UI/UX improvements
- **v1.3** - Sanction calculation logic
- **v1.2** - Force reopen timeout
- **v1.1** - Face recognition attendance
- **v1.0** - Initial release

---

## License

This project is proprietary software developed for PITON organization.

---

## Credits

Developed for PITON Integrated Management System
