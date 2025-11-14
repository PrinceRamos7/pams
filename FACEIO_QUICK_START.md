# FaceIO Quick Start Guide

## 🚀 Quick Setup (5 Minutes)

### Step 1: Get Your FaceIO API Key
1. Visit [https://console.faceio.net/](https://console.faceio.net/)
2. Sign up (it's free!)
3. Create a new application
4. Copy your **Public ID** (looks like: `FIOAPP-XXXXXX`)

### Step 2: Configure Your App
1. Open your `.env` file
2. Add this line:
   ```
   VITE_FACEIO_PUBLIC_ID=FIOAPP-XXXXXX
   ```
   (Replace `FIOAPP-XXXXXX` with your actual Public ID)

### Step 3: Run Migrations
```bash
php artisan migrate
```

### Step 4: Build Assets
```bash
npm run build
```
Or for development:
```bash
npm run dev
```

## ✅ You're Done!

Your system now has face recognition enabled!

## 📱 How to Use

### Register a Member's Face
1. Go to **Members** page
2. Click on any member
3. Click **"Register Face"** button
4. Follow the on-screen instructions
5. Done! The member can now use face recognition

### Use Face Recognition for Attendance
1. Go to **Attendance** page
2. Select an event
3. Click the **⋮** menu button
4. Choose:
   - **"Time In (Face Recognition)"** - for check-in
   - **"Time Out (Face Recognition)"** - for check-out
5. Click **"Scan Face"**
6. The system automatically recognizes the member!

## 🎯 Features

✅ **No Manual Entry** - Just scan your face
✅ **Fast Recognition** - Takes 2-3 seconds
✅ **Secure** - Face data encrypted on FaceIO servers
✅ **Duplicate Prevention** - Can't check in twice
✅ **Fallback Option** - Manual entry still available

## 💡 Tips for Best Results

- ✅ Good lighting on face
- ✅ Look directly at camera
- ✅ Remove glasses (if possible)
- ✅ Neutral expression
- ✅ Stay still during scan

## 🔧 Troubleshooting

### "Face not recognized"
→ Make sure the member registered their face first

### "Enrollment failed"
→ Check your FaceIO Public ID in `.env`
→ Ensure good lighting
→ Try again with better camera angle

### "API Error"
→ Verify your FaceIO Public ID is correct
→ Check internet connection
→ Ensure migrations were run

## 📊 What Was Added

### New Pages
- `/members/{id}/register-face` - Face registration
- `/attendance-records/face-time-in/{eventId}` - Face time in
- `/attendance-records/face-time-out/{eventId}` - Face time out

### New Database Fields
- `members.faceio_id` - Stores facial ID
- `users.faceio_id` - Stores facial ID

### New Features
- Face enrollment for members
- Face authentication for attendance
- Automatic member recognition
- Duplicate check-in prevention

## 🆘 Need Help?

- **FaceIO Docs**: [https://faceio.net/dev-guides](https://faceio.net/dev-guides)
- **FaceIO Console**: [https://console.faceio.net/](https://console.faceio.net/)
- **Full Setup Guide**: See `FACEIO_SETUP.md`

## 🎉 That's It!

Your attendance system now has professional face recognition!
