# PHP Upload Configuration for Large Images

## Changes Made

### 1. Frontend Image Compression
- Added automatic image compression in `OrganizationChart.jsx`
- Images larger than 1MB are automatically compressed before upload
- Maximum dimensions: 1920px width
- Quality: Starts at 90% and reduces until file is under 1MB
- Supports images up to 10MB+ (will be compressed)

### 2. Backend Validation
- Updated `MemberController::uploadProfilePicture()` to accept up to 10MB files
- Changed from `max:2048` (2MB) to `max:10240` (10MB)

### 3. PHP Configuration (Manual Setup Required)

You need to update your `php.ini` file to handle larger uploads:

```ini
upload_max_filesize = 20M
post_max_size = 25M
max_execution_time = 300
memory_limit = 256M
```

#### How to Find and Edit php.ini:

**Option 1: Using Command Line**
```bash
php --ini
```
This will show you the location of your php.ini file.

**Option 2: Create a PHP info file**
Create a file `info.php` in your public folder:
```php
<?php phpinfo(); ?>
```
Visit it in browser and search for "Loaded Configuration File"

**Option 3: Common Locations**
- Windows (XAMPP): `C:\xampp\php\php.ini`
- Windows (Laragon): `C:\laragon\bin\php\php8.x\php.ini`
- Linux: `/etc/php/8.x/apache2/php.ini` or `/etc/php/8.x/fpm/php.ini`
- Mac (MAMP): `/Applications/MAMP/bin/php/php8.x/conf/php.ini`

#### After Editing:
1. Save the php.ini file
2. Restart your web server (Apache/Nginx)
3. Restart PHP-FPM if using it

**For Laravel Valet (Mac):**
```bash
valet restart
```

**For XAMPP:**
- Stop and start Apache from XAMPP Control Panel

**For Laragon:**
- Click "Stop All" then "Start All"

### 4. Laravel Storage Setup

Make sure storage is linked:
```bash
php artisan storage:link
```

## Testing

1. Try uploading a 10MB+ image
2. It should automatically compress to under 1MB
3. Upload should succeed
4. Check the `storage/app/public/profile_pictures` folder

## Troubleshooting

If uploads still fail:
1. Check PHP error logs
2. Verify php.ini changes took effect: `php -i | grep upload_max_filesize`
3. Check Laravel logs: `storage/logs/laravel.log`
4. Ensure storage folder has write permissions
