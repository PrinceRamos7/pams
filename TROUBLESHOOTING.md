# 🔧 FaceIO Troubleshooting Guide

## Common Issues and Solutions

---

## ❌ Error: "FaceIO Public ID not configured"

### Problem
You see a red warning box saying FaceIO is not configured.

### Solution
1. Visit https://console.faceio.net/
2. Sign up for a free account
3. Create a new application
4. Copy your Public ID (looks like: `FIOAPP-XXXXXX`)
5. Open your `.env` file
6. Find this line:
   ```
   VITE_FACEIO_PUBLIC_ID=your_faceio_public_id_here
   ```
7. Replace `your_faceio_public_id_here` with your actual Public ID:
   ```
   VITE_FACEIO_PUBLIC_ID=FIOAPP-ABC123XYZ
   ```
8. **IMPORTANT:** Restart your dev server:
   ```bash
   # Stop the current server (Ctrl+C)
   npm run dev
   ```
9. Refresh your browser

---

## ❌ Error: "Invalid FaceIO Public ID" (Error Code 10)

### Problem
FaceIO returns error code 10 or says the Public ID is invalid.

### Possible Causes
1. Wrong Public ID format
2. Typo in the Public ID
3. Public ID from wrong application
4. Dev server not restarted after changing `.env`

### Solution
1. Double-check your Public ID in FaceIO console
2. Ensure it starts with `FIOAPP-`
3. Copy it exactly (no extra spaces)
4. Paste it in `.env` file
5. **Restart dev server:**
   ```bash
   npm run dev
   ```
6. Hard refresh browser (Ctrl+Shift+R or Cmd+Shift+R)

---

## ❌ Error: "Cannot read properties of undefined (reading 'authenticate')"

### Problem
JavaScript error when trying to use face recognition.

### Cause
FaceIO not properly initialized (usually due to invalid Public ID).

### Solution
1. Check your `.env` file has correct Public ID
2. Restart dev server
3. Clear browser cache
4. Refresh page

---

## ❌ Error: "No face enrolled" (Error Code 4)

### Problem
Trying to authenticate but face not recognized.

### Solution
1. Go to Members page
2. Click on the member
3. Click "Register Face"
4. Complete face enrollment
5. Try authentication again

---

## ❌ Face Enrollment Fails

### Problem
Face enrollment doesn't complete successfully.

### Possible Causes & Solutions

#### 1. Poor Lighting
- ✅ Move to well-lit area
- ✅ Face camera directly
- ✅ Avoid backlighting

#### 2. Camera Issues
- ✅ Allow camera permissions
- ✅ Check camera works in other apps
- ✅ Try different browser

#### 3. Face Not Detected
- ✅ Remove glasses
- ✅ Remove hat/mask
- ✅ Look directly at camera
- ✅ Stay still during scan

#### 4. Browser Compatibility
- ✅ Use Chrome/Edge (recommended)
- ✅ Update browser to latest version
- ✅ Enable JavaScript

---

## ❌ Changes to .env Not Taking Effect

### Problem
Updated `.env` file but changes don't work.

### Solution
1. **Stop dev server** (Ctrl+C)
2. **Restart dev server:**
   ```bash
   npm run dev
   ```
3. **Hard refresh browser:**
   - Windows/Linux: Ctrl+Shift+R
   - Mac: Cmd+Shift+R
4. **Clear browser cache** if still not working

---

## ❌ "Failed to load resource: 400" Error

### Problem
Browser console shows 400 error from FaceIO widget.

### Cause
Invalid or missing FaceIO Public ID.

### Solution
1. Verify Public ID in `.env` is correct
2. Check it's not still `your_faceio_public_id_here`
3. Restart dev server
4. Refresh browser

---

## ❌ Face Recognition Works in Dev but Not Production

### Problem
Works locally but fails on production server.

### Solution
1. Check production `.env` has correct Public ID
2. Ensure you ran `npm run build` on production
3. Clear production cache:
   ```bash
   php artisan config:cache
   php artisan route:cache
   php artisan view:cache
   ```
4. Restart web server

---

## ❌ Database Errors

### Problem
Errors about `faceio_id` column not found.

### Solution
1. Run migrations:
   ```bash
   php artisan migrate
   ```
2. Check migrations ran successfully:
   ```bash
   php artisan migrate:status
   ```
3. Verify column exists in database

---

## ❌ Routes Not Found

### Problem
404 errors when accessing face recognition pages.

### Solution
1. Clear route cache:
   ```bash
   php artisan route:clear
   php artisan route:cache
   ```
2. Verify routes exist:
   ```bash
   php artisan route:list | findstr face
   ```

---

## 🔍 Debugging Steps

### 1. Check Browser Console
1. Press F12 to open Developer Tools
2. Go to Console tab
3. Look for error messages
4. Note error codes

### 2. Check Laravel Logs
```bash
# View recent logs
tail -f storage/logs/laravel.log
```

### 3. Check FaceIO Console
1. Visit https://console.faceio.net/
2. Go to your application
3. Check enrollment count
4. Check authentication count
5. Review error logs

### 4. Verify Configuration
```bash
# Check .env file
cat .env | grep FACEIO

# Should show:
# VITE_FACEIO_PUBLIC_ID=FIOAPP-XXXXXX
```

---

## 📋 Configuration Checklist

Use this to verify everything is set up correctly:

- [ ] FaceIO account created
- [ ] Application created in FaceIO console
- [ ] Public ID copied
- [ ] Public ID added to `.env` file
- [ ] `.env` file saved
- [ ] Dev server restarted
- [ ] Browser refreshed
- [ ] No red warning box on face pages
- [ ] Camera permissions granted
- [ ] Migrations run successfully
- [ ] Routes registered correctly

---

## 🆘 Still Having Issues?

### Check Documentation
1. `FACEIO_QUICK_START.md` - Quick setup guide
2. `FACEIO_SETUP.md` - Detailed setup
3. `FACEIO_API.md` - API documentation

### Check FaceIO Resources
- Console: https://console.faceio.net/
- Docs: https://faceio.net/dev-guides
- Support: https://faceio.net/support

### Check Application Logs
- Laravel: `storage/logs/laravel.log`
- Browser: Developer Console (F12)

### Common Commands
```bash
# Restart dev server
npm run dev

# Clear all caches
php artisan config:clear
php artisan route:clear
php artisan view:clear
php artisan cache:clear

# Rebuild assets
npm run build

# Check routes
php artisan route:list

# Check migrations
php artisan migrate:status
```

---

## 💡 Pro Tips

### For Best Results
1. Use Chrome or Edge browser
2. Ensure good lighting
3. Look directly at camera
4. Remove glasses during enrollment
5. Stay still during scan

### For Development
1. Always restart dev server after `.env` changes
2. Hard refresh browser after changes
3. Check browser console for errors
4. Monitor FaceIO console for usage

### For Production
1. Use production Public ID (not dev)
2. Build assets before deploying
3. Clear all caches after deployment
4. Test thoroughly before going live

---

## 📞 Getting Help

If you're still stuck:

1. **Check the error message carefully**
   - Note the exact error code
   - Copy the full error message

2. **Review the documentation**
   - Most issues are covered in the guides

3. **Check FaceIO status**
   - Visit https://status.faceio.net/

4. **Contact FaceIO support**
   - For FaceIO-specific issues
   - Include your Public ID (not secret key!)

---

## ✅ Success Indicators

You know it's working when:
- ✅ No red warning boxes
- ✅ Face enrollment completes
- ✅ Face authentication works
- ✅ Attendance records correctly
- ✅ No console errors
- ✅ FaceIO console shows activity

---

**Most issues are solved by:**
1. Configuring the correct Public ID
2. Restarting the dev server
3. Refreshing the browser

**Good luck! 🚀**
