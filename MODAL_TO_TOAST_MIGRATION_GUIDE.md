# Modal to Toast Migration Guide

## Overview
This guide documents the migration from modal-based notifications to toast notifications across the PITON application.

## ✅ Completed Setup

### 1. Toast Service Created
**File**: `resources/js/utils/toastService.js`

```javascript
import toastService from '@/utils/toastService';

// Usage:
toastService.success('Operation successful!');
toastService.error('Something went wrong');
toastService.warning('Please be careful');
toastService.info('Here is some information');
```

### 2. Global Toaster Added
**File**: `resources/js/app.jsx`
- Global `<Toaster />` component configured
- All pages now have access to toasts
- No need to import Toaster in individual components

## 📋 Files to Migrate

### Priority 1: Notification Modals

#### 1. AttendanceTable.jsx
**Location**: `resources/js/Components/Attendance/AttendanceTable.jsx`

**Changes Needed**:
```javascript
// REMOVE these imports:
import NotificationModal from "../NotificationModal";
import { Toaster } from "react-hot-toast";

// ADD this import:
import toastService from '@/utils/toastService';

// REMOVE this state:
const [notificationModal, setNotificationModal] = useState({
    isOpen: false,
    type: "success",
    title: "",
    message: ""
});

// REMOVE this function:
const showNotificationModal = (title, message, type = "success") => {
    setNotificationModal({
        isOpen: true,
        type,
        title,
        message
    });
};

// REPLACE all calls like:
showNotificationModal("Success!", data.message, "success");
// WITH:
toastService.success(data.message);

// REPLACE:
showNotificationModal("Error!", "Failed to delete event.", "error");
// WITH:
toastService.error("Failed to delete event.");

// REMOVE the NotificationModal JSX at the end of the component
```

**Specific Replacements**:
- Line 175: `showNotificationModal("Success!", data.message, "success")` → `toastService.success(data.message)`
- Line 177: `showNotificationModal("Error!", ...)` → `toastService.error(...)`
- Line 238: `showNotificationModal("Success!", data.message, "success")` → `toastService.success(data.message)`
- Line 240: `showNotificationModal("Error!", ...)` → `toastService.error(...)`
- Line 289: `showNotificationModal("Success!", data.message, "success")` → `toastService.success(data.message)`
- Line 291: `showNotificationModal("Error!", ...)` → `toastService.error(...)`
- Line 333: `showNotificationModal("Success!", data.message, "success")` → `toastService.success(data.message)`
- Line 335: `showNotificationModal("Error!", ...)` → `toastService.error(...)`
- Line 375: `showNotificationModal("Success!", data.message, "success")` → `toastService.success(data.message)`
- Line 377: `showNotificationModal("Error!", ...)` → `toastService.error(...)`

#### 2. RegisterAdminFace.jsx
**Location**: `resources/js/Pages/Profile/RegisterAdminFace.jsx`

**Changes Needed**:
```javascript
// REMOVE:
import NotificationModal from "../../Components/NotificationModal";
const [notificationModal, setNotificationModal] = useState({...});
const showNotificationModal = (title, message, type = "success") => {...};

// ADD:
import toastService from '@/utils/toastService';

// REPLACE:
showNotificationModal("Success!", "Face registered successfully!", "success");
// WITH:
toastService.success("Face registered successfully! You can now use face recognition.");

// REPLACE:
showNotificationModal("Error!", data.message || "Failed to save face data", "error");
// WITH:
toastService.error(data.message || "Failed to save face data");
```

#### 3. RegisterFace.jsx (Members)
**Location**: `resources/js/Pages/Members/RegisterFace.jsx`

**Same changes as RegisterAdminFace.jsx**

#### 4. MemberSanctionDetailsTable.jsx
**Location**: `resources/js/Components/Sanctions/MemberSanctionDetailsTable.jsx`

**Changes Needed**:
```javascript
// REMOVE:
const [showSuccessModal, setShowSuccessModal] = useState(false);

// ADD:
import toastService from '@/utils/toastService';

// REPLACE:
setShowSuccessModal(true);
setTimeout(() => {
    setShowSuccessModal(false);
    router.reload();
}, 2000);
// WITH:
toastService.success("Payment recorded successfully!");
setTimeout(() => router.reload(), 1000);

// REMOVE the success modal JSX
```

### Priority 2: Keep as Modals (Confirmation Dialogs)

These should **NOT** be converted to toasts as they require user confirmation:

1. **AuthModal** - Password/Face authentication
2. **PasswordModal** - Password confirmation for sensitive actions
3. **MarkAsPaidModal** - Payment confirmation with amount input
4. **EditEventModal** - Event editing form
5. **AddMemberModal** - Member creation form
6. **EditMemberModal** - Member editing form
7. **ViewMemberModal** - Member details view

### Priority 3: Success/Error Modals in Face Recognition

**FaceTimeIn.jsx** and **FaceTimeOut.jsx**:
- Keep the success/error modals as they show detailed user information
- These are more than simple notifications - they display member details
- Consider them as "result screens" rather than notifications

## 🔄 Migration Pattern

### Before (Modal):
```javascript
import NotificationModal from "../NotificationModal";

const [notificationModal, setNotificationModal] = useState({
    isOpen: false,
    type: "success",
    title: "",
    message: ""
});

const showNotificationModal = (title, message, type = "success") => {
    setNotificationModal({
        isOpen: true,
        type,
        title,
        message
    });
};

// Usage:
showNotificationModal("Success!", "Record saved", "success");

// JSX:
<NotificationModal
    isOpen={notificationModal.isOpen}
    onClose={() => setNotificationModal({ ...notificationModal, isOpen: false })}
    type={notificationModal.type}
    title={notificationModal.title}
    message={notificationModal.message}
/>
```

### After (Toast):
```javascript
import toastService from '@/utils/toastService';

// Usage:
toastService.success("Record saved");
toastService.error("Failed to save record");
toastService.warning("Please check your input");
toastService.info("Processing your request");

// No JSX needed - handled globally
```

## 📊 Migration Checklist

- [x] Create toast service utility
- [x] Add global Toaster to app.jsx
- [ ] Migrate AttendanceTable.jsx
- [ ] Migrate RegisterAdminFace.jsx
- [ ] Migrate RegisterFace.jsx
- [ ] Migrate MemberSanctionDetailsTable.jsx
- [ ] Test all notifications
- [ ] Remove unused NotificationModal component (optional)

## 🎯 Benefits

1. **Non-blocking**: Users can continue working while seeing notifications
2. **Consistent**: All notifications look and behave the same
3. **Auto-dismiss**: No need to manually close notifications
4. **Stackable**: Multiple notifications can appear simultaneously
5. **Accessible**: Built-in ARIA support
6. **Cleaner Code**: Less state management, simpler components

## 🚀 Next Steps

1. Start with AttendanceTable.jsx (highest priority)
2. Test thoroughly after each migration
3. Ensure no regressions in functionality
4. Update any tests that rely on modal notifications

---

**Note**: This migration improves UX by making notifications less intrusive while keeping important confirmation dialogs as modals.
