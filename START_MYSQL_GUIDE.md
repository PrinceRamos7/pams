# 🚀 How to Start MySQL in XAMPP

## ⚠️ Current Issue:
MySQL is not running. You need to start it before running migrations.

---

## 📋 Method 1: Using XAMPP Control Panel (RECOMMENDED)

### Steps:
1. **Open XAMPP Control Panel**
   - Go to: `C:\xampp\xampp-control.exe`
   - Or search "XAMPP" in Windows Start Menu

2. **Start MySQL**
   - Find the "MySQL" row
   - Click the **"Start"** button next to MySQL
   - Wait for it to turn **GREEN**

3. **Verify it's Running**
   - You should see "Running" status
   - Port should show: 3306

4. **Run Migrations**
   ```bash
   php artisan migrate
   ```

---

## 📋 Method 2: Using Command Line

### Option A: Start MySQL Service
```bash
net start mysql
```

### Option B: Start MySQL Directly
```bash
C:\xampp\mysql\bin\mysqld.exe --console
```
(Keep this window open)

---

## 🔧 Method 3: If MySQL Won't Start

### Check Error Logs:
```bash
notepad C:\xampp\mysql\data\mysql_error.log
```

### Common Issues & Solutions:

#### Issue 1: Port 3306 Already in Use
**Check what's using port 3306:**
```bash
netstat -ano | findstr :3306
```

**Solution:**
- Stop other MySQL services
- Or change XAMPP MySQL port in `C:\xampp\mysql\bin\my.ini`

#### Issue 2: MySQL Service Not Installed
**Install MySQL as Windows Service:**
```bash
C:\xampp\mysql\bin\mysqld.exe --install
```

#### Issue 3: Corrupted MySQL Data
**Backup and reset:**
1. Backup: `C:\xampp\mysql\data`
2. Stop MySQL
3. Delete data folder
4. Restore from backup or reinstall

---

## ✅ How to Verify MySQL is Running

### Method 1: XAMPP Control Panel
- MySQL row should be **GREEN**
- Status should say **"Running"**

### Method 2: Command Line
```bash
# Check if MySQL process is running
tasklist | findstr mysqld

# Try to connect
mysql -u root -p
```

### Method 3: Test Connection
```bash
php artisan tinker
# Then type:
DB::connection()->getPdo();
```

---

## 🎯 After MySQL Starts Successfully

Run the migrations:
```bash
php artisan migrate
```

You should see:
```
INFO  Running migrations.

2025_11_18_134709_add_batch_id_to_members_table ................ DONE
2025_11_18_135334_add_role_to_users_table ...................... DONE
2025_11_18_140107_create_member_history_table .................. DONE
```

---

## 🆘 Still Having Issues?

### Quick Diagnostics:
```bash
# Check PHP can see MySQL
php -m | findstr mysql

# Check database config
php artisan config:clear
php artisan config:cache

# Test database connection
php artisan db:show
```

### Alternative: Use Different Database
If MySQL continues to fail, you can temporarily use SQLite:

1. **Update `.env`:**
   ```
   DB_CONNECTION=sqlite
   # DB_HOST=127.0.0.1
   # DB_PORT=3306
   # DB_DATABASE=pams
   ```

2. **Create SQLite database:**
   ```bash
   touch database/database.sqlite
   ```

3. **Run migrations:**
   ```bash
   php artisan migrate
   ```

---

## 📞 Need More Help?

Check these files:
- MySQL Error Log: `C:\xampp\mysql\data\mysql_error.log`
- XAMPP Error Log: `C:\xampp\apache\logs\error.log`
- PHP Error Log: Check your PHP error log location

---

**Once MySQL is running, all your implemented features will be ready to use! 🎉**
