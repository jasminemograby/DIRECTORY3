# Authentication Implementation - Directory

This document describes the authentication system implementation with support for both dummy (testing) and real Auth Service (production) modes.

**Last Updated**: Based on authentication requirements

---

## Overview

Directory supports **two authentication modes** controlled by a simple environment variable:

- **Mode A (Default)**: Dummy Auth - For local testing only
- **Mode B (Future)**: Real Auth Service - For production with real JWT validation

The implementation uses a clean abstraction layer, so switching modes requires **only a configuration change** - no code rewriting.

---

## Configuration

### Environment Variable

Set the authentication mode using the `AUTH_MODE` environment variable:

```bash
# For testing (default)
AUTH_MODE=dummy

# For production (when Auth Service is ready)
AUTH_MODE=auth-service
```

### Configuration File

The configuration is defined in `/backend/src/config.js`:

```javascript
auth: {
  mode: process.env.AUTH_MODE || 'dummy', // 'dummy' or 'auth-service'
  
  // Auth Service Configuration (for AUTH_MODE=auth-service)
  authService: {
    baseUrl: process.env.AUTH_SERVICE_URL || 'https://auth-service-production.up.railway.app',
    loginEndpoint: '/api/auth/login',
    validateEndpoint: '/api/auth/validate',
    jwtSecret: process.env.JWT_SECRET,
    jwtHeaderName: process.env.JWT_HEADER_NAME || 'Authorization',
    jwtTokenPrefix: process.env.JWT_TOKEN_PREFIX || 'Bearer',
  },
  
  // Dummy Auth Configuration (for AUTH_MODE=dummy)
  dummy: {
    testUsers: {
      'hr@testcompany.com': { ... },
      'employee@testcompany.com': { ... }
    }
  }
}
```

---

## Mode A: Dummy Auth (Testing Only)

### Purpose

**FOR LOCAL TESTING ONLY - NOT SECURE - DO NOT USE IN PRODUCTION**

This mode allows testing Directory functionality without real authentication.

### How It Works

1. **No Real Authentication**: Login always succeeds if email exists in test users
2. **No Real JWT Validation**: Tokens are simple strings, not real JWTs
3. **Fake User Sessions**: Returns temporary fake user data for testing

### Test Users

Default test users (defined in `config.js`):

- `hr@testcompany.com` - HR user (sees Company Profile)
- `employee@testcompany.com` - Regular employee (sees Employee Profile)

### Login Flow

```javascript
// POST /api/auth/login
{
  "email": "hr@testcompany.com",
  "password": "any-password" // Ignored in dummy mode
}

// Response
{
  "success": true,
  "token": "dummy-token-hr@testcompany.com-1234567890",
  "user": {
    "email": "hr@testcompany.com",
    "employeeId": "dummy-hr-employee-id",
    "companyId": "dummy-company-id",
    "isHR": true,
    "fullName": "Test HR User"
  }
}
```

### Token Validation

In dummy mode, tokens are validated by:
1. Checking if token starts with `"dummy-token-"`
2. Extracting email from token
3. Looking up user in test users

**This is NOT secure** - just for testing.

### Usage

```bash
# Set environment variable
export AUTH_MODE=dummy

# Or in .env file
AUTH_MODE=dummy
```

---

## Mode B: Real Auth Service (Production)

### Purpose

**FOR PRODUCTION USE**

This mode integrates with the real Auth Service microservice for secure authentication.

### How It Works

1. **Real Authentication**: Login requests sent to Auth Service
2. **Real JWT Validation**: Validates JWTs using secret or Auth Service endpoint
3. **Real User Sessions**: Extracts user data from validated JWTs

### Configuration Required

When switching to `AUTH_MODE=auth-service`, set these environment variables:

```bash
AUTH_MODE=auth-service
AUTH_SERVICE_URL=https://auth-service-production.up.railway.app
JWT_SECRET=your-jwt-secret-key  # Optional: if validating locally
JWT_HEADER_NAME=Authorization    # Optional: default is 'Authorization'
JWT_TOKEN_PREFIX=Bearer          # Optional: default is 'Bearer'
```

### Login Flow

```javascript
// POST /api/auth/login
{
  "email": "user@company.com",
  "password": "real-password"
}

// Directory sends request to Auth Service:
// POST https://auth-service-production.up.railway.app/api/auth/login
{
  "email": "user@company.com",
  "password": "real-password"
}

// Auth Service returns:
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": { ... }
}

// Directory returns to client:
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "email": "user@company.com",
    "employeeId": "real-employee-id",
    "companyId": "real-company-id",
    "isHR": false,
    "fullName": "Real User Name"
  }
}
```

### Token Validation

Two options for JWT validation:

**Option 1: Local Validation (Recommended)**
- Uses `JWT_SECRET` to validate tokens locally
- Faster (no network call)
- Requires JWT_SECRET to be set

**Option 2: Auth Service Validation**
- Sends token to Auth Service for validation
- More secure (Auth Service controls validation)
- Requires network call

### Usage

```bash
# Set environment variables
export AUTH_MODE=auth-service
export AUTH_SERVICE_URL=https://auth-service-production.up.railway.app
export JWT_SECRET=your-secret-key

# Or in .env file
AUTH_MODE=auth-service
AUTH_SERVICE_URL=https://auth-service-production.up.railway.app
JWT_SECRET=your-secret-key
```

---

## Architecture

### Abstraction Layer

All authentication logic goes through the `AuthProvider` abstraction:

```
Application Code
    ↓
AuthFactory.create()
    ↓
AuthProvider (interface)
    ↓
    ├── DummyAuthProvider (for testing)
    └── AuthServiceProvider (for production)
```

### Files Structure

```
backend/src/
├── config.js                          # Configuration (includes auth config)
├── infrastructure/auth/
│   ├── AuthProvider.js                # Abstract base class
│   ├── DummyAuthProvider.js           # Dummy auth implementation
│   ├── AuthServiceProvider.js         # Real auth service implementation
│   └── AuthFactory.js                 # Factory to create provider
└── shared/
    └── authMiddleware.js              # Express middleware for auth
```

### Key Principles

1. **No Hardcoding**: All auth logic uses the abstraction
2. **Easy Switching**: Change `AUTH_MODE` environment variable only
3. **Clean Separation**: Dummy and real auth are separate implementations
4. **No Refactoring Needed**: When Auth Service is ready, just change config

---

## Usage in Code

### Login Endpoint

```javascript
const AuthFactory = require('./infrastructure/auth/AuthFactory');

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  const authProvider = AuthFactory.create();
  
  const result = await authProvider.authenticate(email, password);
  
  if (result.success) {
    res.json({
      requester_service: 'directory_service',
      response: result
    });
  } else {
    res.status(401).json({
      requester_service: 'directory_service',
      response: { error: result.error }
    });
  }
});
```

### Protected Routes

```javascript
const { authMiddleware } = require('./shared/authMiddleware');

// Protected route - requires authentication
app.get('/api/employees', authMiddleware, async (req, res) => {
  // req.user is available here
  const user = req.user;
  // ... use user.employeeId, user.companyId, user.isHR, etc.
});

// HR-only route
const { hrOnlyMiddleware } = require('./shared/authMiddleware');

app.get('/api/companies/:id/approvals', 
  authMiddleware, 
  hrOnlyMiddleware, 
  async (req, res) => {
    // Only HR users can access this
  }
);
```

---

## Switching from Dummy to Real Auth

### Steps (When Auth Service is Ready)

1. **Update Environment Variables**:
   ```bash
   AUTH_MODE=auth-service
   AUTH_SERVICE_URL=https://auth-service-production.up.railway.app
   JWT_SECRET=your-jwt-secret-key
   ```

2. **Restart Application**:
   ```bash
   npm restart
   ```

3. **That's It!** No code changes needed.

### What Happens

- `AuthFactory.create()` will now return `AuthServiceProvider` instead of `DummyAuthProvider`
- All authentication calls will go through the real Auth Service
- JWT validation will use real tokens
- No application code needs to change

---

## Security Notes

### Dummy Mode

⚠️ **WARNING**: Dummy mode is **NOT SECURE**:
- No password validation
- Tokens are not encrypted
- Anyone can generate valid tokens
- **ONLY USE FOR LOCAL TESTING**

### Real Auth Mode

✅ **Production Ready**:
- Real password validation via Auth Service
- Secure JWT tokens
- Token expiration and validation
- Proper authentication flow

---

## Testing

### Test Dummy Mode

```bash
# Set mode
export AUTH_MODE=dummy

# Test login
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "hr@testcompany.com", "password": "any"}'

# Test protected route
curl -X GET http://localhost:3001/api/employees \
  -H "Authorization: Bearer dummy-token-hr@testcompany.com-1234567890"
```

### Test Real Auth Mode

```bash
# Set mode
export AUTH_MODE=auth-service
export AUTH_SERVICE_URL=https://auth-service-production.up.railway.app

# Test login (will call real Auth Service)
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "user@company.com", "password": "real-password"}'
```

---

## Troubleshooting

### Issue: "Invalid AUTH_MODE"

**Solution**: Ensure `AUTH_MODE` is either `'dummy'` or `'auth-service'`

### Issue: "AUTH_SERVICE_URL is required"

**Solution**: Set `AUTH_SERVICE_URL` environment variable when using `AUTH_MODE=auth-service`

### Issue: "Failed to connect to Auth Service"

**Solution**: 
- Check if Auth Service is running
- Verify `AUTH_SERVICE_URL` is correct
- Check network connectivity

---

## Files Created

1. `/backend/src/infrastructure/auth/AuthProvider.js` - Abstract base class
2. `/backend/src/infrastructure/auth/DummyAuthProvider.js` - Dummy auth implementation
3. `/backend/src/infrastructure/auth/AuthServiceProvider.js` - Real auth service implementation
4. `/backend/src/infrastructure/auth/AuthFactory.js` - Factory to create provider
5. `/backend/src/shared/authMiddleware.js` - Express middleware
6. `/docs/Authentication-Implementation.md` - This document

---

## Summary

✅ **Clean Abstraction**: All auth logic goes through `AuthProvider` interface
✅ **Easy Toggle**: Change `AUTH_MODE` environment variable only
✅ **No Hardcoding**: No permanent dummy logic
✅ **Production Ready**: Real Auth Service integration ready when needed
✅ **No Refactoring**: Switching modes requires only config change

