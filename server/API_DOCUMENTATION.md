# Authentication API Documentation

## Base URL
```
http://localhost:5000/api/users
```

## Authentication Endpoints

### 1. User Signup
**POST** `/signup`

Register a new user with the following fields:
- `fullname` (required): User's full name
- `phone` (required): Phone number (must be unique)
- `email` (required): Email address (must be unique)
- `college` (required): College/University name
- `password` (required): Password (will be hashed)

**Request Body:**
```json
{
    "fullname": "John Doe",
    "phone": "+919876543210",
    "email": "john.doe@example.com",
    "college": "ABC University",
    "password": "securepassword123"
}
```

**Response:**
```json
{
    "success": true,
    "message": "User registered successfully",
    "data": {
        "_id": "user_id",
        "fullname": "John Doe",
        "phone": "+919876543210",
        "email": "john.doe@example.com",
        "college": "ABC University",
        "isVerified": false,
        "createdAt": "2024-01-01T00:00:00.000Z",
        "updatedAt": "2024-01-01T00:00:00.000Z"
    }
}
```

### 2. Login with Email and Password
**POST** `/login/email`

Login using email and password:
- `email` (required): User's email address
- `password` (required): User's password

**Request Body:**
```json
{
    "email": "john.doe@example.com",
    "password": "securepassword123"
}
```

**Response:**
```json
{
    "success": true,
    "message": "Login successful",
    "data": {
        "_id": "user_id",
        "fullname": "John Doe",
        "phone": "+919876543210",
        "email": "john.doe@example.com",
        "college": "ABC University",
        "isVerified": false,
        "createdAt": "2024-01-01T00:00:00.000Z",
        "updatedAt": "2024-01-01T00:00:00.000Z"
    },
    "token": "jwt_token_here"
}
```

### 3. Send OTP for Phone Login
**POST** `/login/phone/send-otp`

Send OTP to user's phone number:
- `phone` (required): User's phone number

**Request Body:**
```json
{
    "phone": "+919876543210"
}
```

**Response:**
```json
{
    "success": true,
    "message": "OTP sent successfully",
    "data": {
        "phone": "+919876543210",
        "otp": "123456"
    }
}
```

**Note:** In production, the OTP should not be returned in the response. It should be sent via SMS.

### 4. Verify OTP and Login
**POST** `/login/phone/verify-otp`

Verify OTP and complete phone login:
- `phone` (required): User's phone number
- `otp` (required): OTP received on phone

**Request Body:**
```json
{
    "phone": "+919876543210",
    "otp": "123456"
}
```

**Response:**
```json
{
    "success": true,
    "message": "Login successful",
    "data": {
        "_id": "user_id",
        "fullname": "John Doe",
        "phone": "+919876543210",
        "email": "john.doe@example.com",
        "college": "ABC University",
        "isVerified": false,
        "createdAt": "2024-01-01T00:00:00.000Z",
        "updatedAt": "2024-01-01T00:00:00.000Z"
    },
    "token": "jwt_token_here"
}
```

## Protected Routes

For routes that require authentication, include the JWT token in the Authorization header:

```
Authorization: Bearer <jwt_token>
```

## Error Responses

### 400 Bad Request
```json
{
    "success": false,
    "message": "Error message here"
}
```

### 401 Unauthorized
```json
{
    "success": false,
    "message": "Invalid email or password"
}
```

### 404 Not Found
```json
{
    "success": false,
    "message": "User not found with this phone number"
}
```

### 500 Internal Server Error
```json
{
    "success": false,
    "message": "Internal server error",
    "error": "Error details"
}
```

## OTP Features

- OTP is valid for 10 minutes
- OTP is automatically deleted after use or expiration
- OTP is unique per phone number
- In production, integrate with SMS service (Twilio, AWS SNS, etc.)

## Security Features

- Passwords are hashed using bcrypt
- JWT tokens expire after 7 days
- Phone numbers and emails must be unique
- Input validation on all endpoints
