# Admin Face Authentication Feature

## Overview
Administrators can now use face recognition as an alternative to password authentication for sensitive operations. This provides a more convenient and secure way to verify admin identity.

## Features

### 1. Admin Face Registration
- Admins can register their face through the profile section
- Face image is captured and stored securely
- Can re-register or remove face registration at any time

### 2. Dual Authentication Methods
- **Password Authentication**: Traditional password entry
- **Face Recognition**: Scan face using camera
- Admins can choose their preferred method for each action

### 3. Supported Operations
Face recognition can be used for:
- Force Reopen Timeout
- Force Begin Timeout
- Force Close Event
- Calculate Sanctions
- Edit Event
- Delete Event
- Delete Member
- Edit Member
- Any other operation requiring password confirmation

## Implementation Details

### Database Changes

**Migration**: `2025_11_17_110000_add_face_image_to_users_table.php`

Added to `users` table:
```php
$table->text('face_image')->nullable()->after('face_descriptor');
```

### Backend Components

#### 1. User Model Updates
**File**: `app/Models/User.php`

Added `face_image` to fillable fields:
```php
protected $fillable = [
    'name',
    'email',
    'password',
    'faceio_id',
    'face_descriptor',
    'face_image', // NEW
];
```

#### 2. FaceIO Controller - Admin Methods
**File**: `app/Http/Controllers/FaceIOController.php`

**New Methods:**

**`enrollAdmin(Request $request)`**
- Enrolls admin face with descriptor and image
- Validates user_id, face_id, face_descriptor, face_image
- Stores face data in users table

**`getEnrolledAdmins()`**
- Returns all enrolled admin faces for authentication
- Used by face recognition modal to verify admin identity

**`unenrollAdmin(Request $request, $userId)`**
- Removes admin face registration
- Clears faceio_id, face_descriptor, and face_image

#### 3. Routes
**File**: `routes/web.php`

```php
// Admin face enrollment routes
Route::post('/enroll-admin', [FaceIOController::class, 'enrollAdmin']);
Route::get('/enrolled-admins', [FaceIOController::class, 'getEnrolledAdmins']);
Route::delete('/unenroll-admin/{userId}', [FaceIOController::class, 'unenrollAdmin']);

// Admin face registration page
Route::get('/profile/register-face', function () {
    return Inertia::render('Profile/RegisterAdminFace');
})->name('profile.register-face');
```

### Frontend Components

#### 1. AuthModal Component
**File**: `resources/js/Components/AuthModal.jsx`

**Enhanced authentication modal with:**
- Tab-based interface (Password / Face Recognition)
- Camera preview with face guide overlay
- Real-time camera status indicator
- Attempt counter (max 3 attempts)
- Error handling and user feedback
- Automatic fallback to password on failure

**Props:**
```javascript
{
    isOpen: boolean,
    onClose: function,
    onConfirm: function,
    title: string,
    message: string,
    actionText: string
}
```

**Usage Example:**
```javascript
import AuthModal from '@/Components/AuthModal';

const [showAuthModal, setShowAuthModal] = useState(false);

const handleSensitiveAction = async (authData) => {
    if (authData.method === 'password') {
        // Verify password with backend
        await verifyPassword(authData.password);
    } else if (authData.method === 'face') {
        // Face already verified, proceed
        console.log('Authenticated user:', authData.user);
    }
    
    // Perform the sensitive action
    await performAction();
};

<AuthModal
    isOpen={showAuthModal}
    onClose={() => setShowAuthModal(false)}
    onConfirm={handleSensitiveAction}
    title="Confirm Delete"
    message="Please verify your identity to delete this member:"
    actionText="Delete"
/>
```

#### 2. Admin Face Registration Page
**File**: `resources/js/Pages/Profile/RegisterAdminFace.jsx`

**Features:**
- Camera preview with face guide
- Real-time status indicators
- Admin information display
- Register/Re-register/Remove options
- Security tips and guidance
- Success/error notifications

**Access:**
- Navigate to Profile → Register Face
- Or directly via route: `/profile/register-face`

### UI/UX Features

#### AuthModal Design:
1. **Gradient Header**: Red gradient with lock icon
2. **Tab Interface**: Easy switching between password and face
3. **Camera Preview**: 
   - 4:3 aspect ratio
   - Face guide overlay (oval with corner markers)
   - Status indicator (active/initializing)
   - Processing overlay during scan
4. **Attempt Counter**: Shows attempts (1/3, 2/3, 3/3)
5. **Error Messages**: Clear, actionable error feedback
6. **Responsive Design**: Works on all screen sizes

#### Registration Page Design:
1. **Professional Layout**: Card-based with red accent border
2. **Admin Info Section**: Shows name, email, registration status
3. **Camera Interface**: Large preview with face guide
4. **Action Buttons**: 
   - Start Camera (green gradient)
   - Register Face (red gradient)
   - Remove Registration (gray)
   - Back to Dashboard
5. **Security Tips**: Helpful guidance for best results

## Security Considerations

### Face Data Storage:
- **Face Descriptors**: Numerical arrays (not reversible to image)
- **Face Images**: Base64 encoded JPEG (for profile display)
- **Database**: Stored in `users` table (not publicly accessible)
- **Encryption**: Consider encrypting face_image field for production

### Authentication Flow:
1. Admin initiates sensitive action
2. AuthModal opens with dual options
3. If face recognition selected:
   - Camera starts automatically
   - Admin positions face in guide
   - Face is scanned and compared with enrolled admins
   - Backend verifies face_id matches a valid admin
4. If password selected:
   - Admin enters password
   - Backend verifies password hash
5. Action proceeds only after successful verification

### Attempt Limiting:
- Maximum 3 face recognition attempts
- After 3 failures, must use password
- Prevents brute force attacks
- Resets on modal close

### Fallback Mechanism:
- Password authentication always available
- Face recognition is optional enhance