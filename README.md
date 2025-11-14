<p align="center"><a href="https://laravel.com" target="_blank"><img src="https://raw.githubusercontent.com/laravel/art/master/logo-lockup/5%20SVG/2%20CMYK/1%20Full%20Color/laravel-logolockup-cmyk-red.svg" width="400" alt="Laravel Logo"></a></p>

<p align="center">
<a href="https://github.com/laravel/framework/actions"><img src="https://github.com/laravel/framework/workflows/tests/badge.svg" alt="Build Status"></a>
<a href="https://packagist.org/packages/laravel/framework"><img src="https://img.shields.io/packagist/dt/laravel/framework" alt="Total Downloads"></a>
<a href="https://packagist.org/packages/laravel/framework"><img src="https://img.shields.io/packagist/v/laravel/framework" alt="Latest Stable Version"></a>
<a href="https://packagist.org/packages/laravel/framework"><img src="https://img.shields.io/packagist/l/laravel/framework" alt="License"></a>
</p>

# 🎓 Piton Attendance Monitoring System (PAMS)

A modern attendance management system built with Laravel and React, featuring **FaceIO face recognition** for seamless check-in/check-out.

## ✨ Key Features

- 👤 **Face Recognition** - Quick attendance using FaceIO technology
- 📊 **Member Management** - Track students and members
- 📅 **Event Scheduling** - Create and manage attendance events
- ⏰ **Time In/Out Tracking** - Automated attendance recording
- 📸 **Photo Capture** - Visual verification of attendance
- 🔐 **Secure Authentication** - Protected routes and data
- 📱 **Responsive Design** - Works on all devices

## 🚀 Quick Start - 100% FREE Face Recognition!

### ✅ No API Keys Required!
This system uses **face-api.js** - completely FREE and open-source!

### Setup (2 minutes)
```bash
php artisan migrate
npm install
npm run build
```

### That's It!
- ✅ No registration needed
- ✅ No API keys needed
- ✅ No configuration needed
- ✅ Unlimited face enrollments
- ✅ 100% FREE forever!

**📖 Learn More**: See [FREE_FACE_RECOGNITION.md](FREE_FACE_RECOGNITION.md)

## 🛠️ Tech Stack

- **Backend**: Laravel 11
- **Frontend**: React 18 + Inertia.js
- **Styling**: Tailwind CSS
- **Face Recognition**: FaceIO
- **Database**: MySQL
- **Build Tool**: Vite

## 📦 Installation

```bash
# Clone repository
git clone <your-repo-url>
cd pams

# Install PHP dependencies
composer install

# Install Node dependencies
npm install

# Copy environment file
cp .env.example .env

# Generate application key
php artisan key:generate

# Configure database in .env
# Add FaceIO Public ID to .env

# Run migrations
php artisan migrate

# Build assets
npm run build

# Start server
php artisan serve
```

## 🎯 Usage

### Register Member Face
1. Navigate to Members
2. Select a member
3. Click "Register Face"
4. Follow on-screen instructions

### Record Attendance
1. Go to Attendance
2. Select event
3. Choose "Face Time In" or "Face Time Out"
4. Scan face - Done!

## 📁 Project Structure

```
pams/
├── app/
│   ├── Http/Controllers/
│   │   ├── AttendanceRecordController.php
│   │   ├── FaceIOController.php
│   │   └── MemberController.php
│   └── Models/
│       ├── Member.php
│       ├── AttendanceRecord.php
│       └── AttendanceEvent.php
├── resources/
│   └── js/
│       ├── Pages/
│       │   ├── Attendance/
│       │   │   ├── FaceTimeIn.jsx
│       │   │   ├── FaceTimeOut.jsx
│       │   │   └── TimeIn.jsx
│       │   └── Members/
│       │       └── RegisterFace.jsx
│       └── utils/
│           └── faceio.js
└── database/
    └── migrations/
```

## 🔧 Configuration

### Environment Variables
```env
# Application
APP_NAME="PAMS"
APP_URL=http://localhost

# Database
DB_CONNECTION=mysql
DB_DATABASE=pams
DB_USERNAME=root
DB_PASSWORD=

# FaceIO
VITE_FACEIO_PUBLIC_ID=your_public_id
```

## 📚 Documentation

- [FaceIO Setup Guide](FACEIO_SETUP.md) - Detailed setup instructions
- [Quick Start Guide](FACEIO_QUICK_START.md) - Get started in 5 minutes

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is open-sourced software licensed under the [MIT license](https://opensource.org/licenses/MIT).

---

## About Laravel

Laravel is a web application framework with expressive, elegant syntax. We believe development must be an enjoyable and creative experience to be truly fulfilling. Laravel takes the pain out of development by easing common tasks used in many web projects, such as:

- [Simple, fast routing engine](https://laravel.com/docs/routing).
- [Powerful dependency injection container](https://laravel.com/docs/container).
- Multiple back-ends for [session](https://laravel.com/docs/session) and [cache](https://laravel.com/docs/cache) storage.
- Expressive, intuitive [database ORM](https://laravel.com/docs/eloquent).
- Database agnostic [schema migrations](https://laravel.com/docs/migrations).
- [Robust background job processing](https://laravel.com/docs/queues).
- [Real-time event broadcasting](https://laravel.com/docs/broadcasting).

Laravel is accessible, powerful, and provides tools required for large, robust applications.

## Learning Laravel

Laravel has the most extensive and thorough [documentation](https://laravel.com/docs) and video tutorial library of all modern web application frameworks, making it a breeze to get started with the framework.

You may also try the [Laravel Bootcamp](https://bootcamp.laravel.com), where you will be guided through building a modern Laravel application from scratch.

If you don't feel like reading, [Laracasts](https://laracasts.com) can help. Laracasts contains thousands of video tutorials on a range of topics including Laravel, modern PHP, unit testing, and JavaScript. Boost your skills by digging into our comprehensive video library.

## Laravel Sponsors

We would like to extend our thanks to the following sponsors for funding Laravel development. If you are interested in becoming a sponsor, please visit the [Laravel Partners program](https://partners.laravel.com).

### Premium Partners

- **[Vehikl](https://vehikl.com)**
- **[Tighten Co.](https://tighten.co)**
- **[Kirschbaum Development Group](https://kirschbaumdevelopment.com)**
- **[64 Robots](https://64robots.com)**
- **[Curotec](https://www.curotec.com/services/technologies/laravel)**
- **[DevSquad](https://devsquad.com/hire-laravel-developers)**
- **[Redberry](https://redberry.international/laravel-development)**
- **[Active Logic](https://activelogic.com)**

## Contributing

Thank you for considering contributing to the Laravel framework! The contribution guide can be found in the [Laravel documentation](https://laravel.com/docs/contributions).

## Code of Conduct

In order to ensure that the Laravel community is welcoming to all, please review and abide by the [Code of Conduct](https://laravel.com/docs/contributions#code-of-conduct).

## Security Vulnerabilities

If you discover a security vulnerability within Laravel, please send an e-mail to Taylor Otwell via [taylor@laravel.com](mailto:taylor@laravel.com). All security vulnerabilities will be promptly addressed.

## License

The Laravel framework is open-sourced software licensed under the [MIT license](https://opensource.org/licenses/MIT).
