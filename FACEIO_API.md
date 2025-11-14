# FaceIO API Documentation

## Overview

This document describes the FaceIO integration API endpoints for the PAMS (Piton Attendance Monitoring System).

## Base URL

```
http://your-domain.com/api/faceio
```

All endpoints require authentication via Laravel Sanctum/Session.

---

## Endpoints

### 1. Enroll Member Face

Register a member's face with FaceIO.

**Endpoint:** `POST /api/faceio/enroll`

**Headers:**
```
Content-Type: application/json
Accept: application/json
X-CSRF-TOKEN: {csrf_token}
```

**Request Body:**
```json
{
  "member_id": 1,
  "faceio_id": "facial-id-from-faceio"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Face enrolled successfully",
  "member": {
    "member_id": 1,
    "student_id": "2021-001",
    "firstname": "John",
    "lastname": "Doe",
    "faceio_id": "facial-id-from-faceio",
    "email": "john@example.com"
  }
}
```

**Error Response (422):**
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": {
    "faceio_id": ["The faceio id has already been taken."]
  }
}
```

---

### 2. Authenticate Member

Verify a member using their FaceIO facial ID.

**Endpoint:** `POST /api/faceio/authenticate`

**Headers:**
```
Content-Type: application/json
Accept: application/json
X-CSRF-TOKEN: {csrf_token}
```

**Request Body:**
```json
{
  "faceio_id": "facial-id-from-faceio"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Face authenticated successfully",
  "member": {
    "member_id": 1,
    "student_id": "2021-001",
    "firstname": "John",
    "lastname": "Doe",
    "faceio_id": "facial-id-from-faceio",
    "email": "john@example.com",
    "year": "4th Year",
    "status": "Active"
  }
}
```

**Error Response (404):**
```json
{
  "success": false,
  "message": "Face not recognized. Please enroll first."
}
```

---

### 3. Unenroll Member

Remove a member's face registration.

**Endpoint:** `DELETE /api/faceio/unenroll/{memberId}`

**Headers:**
```
Content-Type: application/json
Accept: application/json
X-CSRF-TOKEN: {csrf_token}
```

**URL Parameters:**
- `memberId` (integer) - The member's ID

**Success Response (200):**
```json
{
  "success": true,
  "message": "Face enrollment removed successfully"
}
```

**Error Response (500):**
```json
{
  "success": false,
  "message": "Face unenrollment failed: {error_message}"
}
```

---

### 4. Check Enrollment Status

Check if a member has registered their face.

**Endpoint:** `GET /api/faceio/check-enrollment/{memberId}`

**Headers:**
```
Accept: application/json
```

**URL Parameters:**
- `memberId` (integer) - The member's ID

**Success Response (200):**
```json
{
  "success": true,
  "enrolled": true,
  "faceio_id": "facial-id-from-faceio"
}
```

**Not Enrolled Response (200):**
```json
{
  "success": true,
  "enrolled": false,
  "faceio_id": null
}
```

---

## Attendance Endpoints

### 5. Record Attendance (Time In)

Record attendance using FaceIO or manual entry.

**Endpoint:** `POST /attendance-records`

**Headers:**
```
Content-Type: application/json
Accept: application/json
X-CSRF-TOKEN: {csrf_token}
```

**Request Body (FaceIO):**
```json
{
  "event_id": 1,
  "faceio_id": "facial-id-from-faceio",
  "status": "Present"
}
```

**Request Body (Manual):**
```json
{
  "event_id": 1,
  "student_id": "2021-001",
  "status": "Present",
  "photo": "data:image/jpeg;base64,..."
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Attendance recorded successfully!",
  "record": {
    "record_id": 1,
    "event_id": 1,
    "member_id": 1,
    "time_in": "2025-11-14T10:30:00.000000Z",
    "time_out": null,
    "status": "Present",
    "photo": "attendance_photos/attendance_123456.jpg",
    "member": {
      "member_id": 1,
      "firstname": "John",
      "lastname": "Doe",
      "student_id": "2021-001"
    }
  }
}
```

**Error Response (422):**
```json
{
  "success": false,
  "message": "Member has already timed in for this event",
  "record": {
    "record_id": 1,
    "time_in": "2025-11-14T10:30:00.000000Z"
  }
}
```

---

### 6. Update Attendance (Time Out)

Record time out for an attendance record.

**Endpoint:** `PUT /attendance-records/{recordId}`

**Headers:**
```
Content-Type: application/json
Accept: application/json
X-CSRF-TOKEN: {csrf_token}
```

**URL Parameters:**
- `recordId` (integer) - The attendance record ID

**Request Body:**
```json
{
  "time_out": "2025-11-14T15:30:00.000000Z",
  "photo_out": "data:image/jpeg;base64,..."
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Time Out recorded successfully!",
  "record": {
    "record_id": 1,
    "event_id": 1,
    "member_id": 1,
    "time_in": "2025-11-14T10:30:00.000000Z",
    "time_out": "2025-11-14T15:30:00.000000Z",
    "status": "Present",
    "photo": "attendance_photos/attendance_123456.jpg",
    "photo_out": "attendance_photos/timeout_789012.jpg"
  }
}
```

---

## Frontend Integration

### JavaScript/React Usage

```javascript
import { enrollFace, authenticateFace } from '@/utils/faceio';

// Enroll a face
const handleEnroll = async (memberId) => {
  const result = await enrollFace();
  
  if (result.success) {
    // Save to database
    const response = await fetch('/api/faceio/enroll', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-TOKEN': csrfToken
      },
      body: JSON.stringify({
        member_id: memberId,
        faceio_id: result.facialId
      })
    });
    
    const data = await response.json();
    console.log(data);
  }
};

// Authenticate a face
const handleAuth = async () => {
  const result = await authenticateFace();
  
  if (result.success) {
    // Verify with database
    const response = await fetch('/api/faceio/authenticate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-TOKEN': csrfToken
      },
      body: JSON.stringify({
        faceio_id: result.facialId
      })
    });
    
    const data = await response.json();
    console.log(data.member);
  }
};
```

---

## Error Codes

| Code | Description |
|------|-------------|
| 200  | Success |
| 404  | Resource not found |
| 422  | Validation error |
| 500  | Server error |

---

## Common Error Messages

### FaceIO Errors
- `"Face enrollment failed"` - FaceIO enrollment process failed
- `"Face authentication failed"` - FaceIO authentication failed
- `"Face not recognized"` - No matching face in database

### Validation Errors
- `"The faceio id has already been taken"` - Face already registered
- `"Either student_id or faceio_id is required"` - Missing required field
- `"Member has already timed in for this event"` - Duplicate check-in

---

## Rate Limiting

FaceIO has rate limits based on your plan:
- **Free Plan**: 100 enrollments/month, unlimited authentications
- **Paid Plans**: Higher limits available

Check your usage at [https://console.faceio.net/](https://console.faceio.net/)

---

## Security Considerations

1. **CSRF Protection**: All POST/PUT/DELETE requests require CSRF token
2. **Authentication**: All endpoints require user authentication
3. **Data Encryption**: Face data is encrypted by FaceIO
4. **Privacy**: Only facial IDs are stored, not actual face images
5. **Unique Constraints**: Each face can only be registered once

---

## Testing

### Test Enrollment
```bash
curl -X POST http://localhost/api/faceio/enroll \
  -H "Content-Type: application/json" \
  -H "X-CSRF-TOKEN: your-token" \
  -d '{
    "member_id": 1,
    "faceio_id": "test-facial-id-123"
  }'
```

### Test Authentication
```bash
curl -X POST http://localhost/api/faceio/authenticate \
  -H "Content-Type: application/json" \
  -H "X-CSRF-TOKEN: your-token" \
  -d '{
    "faceio_id": "test-facial-id-123"
  }'
```

---

## Support

For FaceIO-specific issues:
- [FaceIO Documentation](https://faceio.net/dev-guides)
- [FaceIO Console](https://console.faceio.net/)
- [FaceIO Support](https://faceio.net/support)

For PAMS-specific issues:
- Check application logs: `storage/logs/laravel.log`
- Enable debug mode: Set `APP_DEBUG=true` in `.env`
