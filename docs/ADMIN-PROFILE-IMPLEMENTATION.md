# ADMIN Profile Implementation - Complete Documentation

**Date**: 2025-01-20  
**Feature**: Platform-Level Directory Admin  
**Purpose**: Complete reference for ADMIN profile implementation. Use this for rollback if needed.

---

## Table of Contents

1. [Overview](#overview)
2. [Files Created](#files-created)
3. [Files Modified](#files-modified)
4. [Database Changes](#database-changes)
5. [API Endpoints Added](#api-endpoints-added)
6. [Frontend Routes Added](#frontend-routes-added)
7. [Rollback Instructions](#rollback-instructions)
8. [Testing Checklist](#testing-checklist)

---

## Overview

Implemented a platform-level ADMIN role (`DIRECTORY_ADMIN`) that allows admins to:
- Log in without being tied to any company
- View all companies in the directory
- View company profiles (read-only)
- View employee profiles (read-only)
- Access Management & Reporting (placeholder)
- View Pending Requests (placeholder)

**Key Principle**: All admin views are **read-only** - no modifications, approvals, or actions allowed.

---

## Files Created

### Backend Files

1. **`backend/src/infrastructure/AdminRepository.js`**
   - **Purpose**: Handles database operations for directory admins
   - **Key Methods**:
     - `findByEmail(email)` - Find admin by email
     - `findById(id)` - Find admin by ID
     - `verifyPassword(plainPassword, hashedPassword)` - Verify password
     - `create(adminData)` - Create new admin (for setup)
   - **Dependencies**: `pg` (Pool), `bcrypt`, `config`

2. **`backend/src/application/AuthenticateAdminUseCase.js`**
   - **Purpose**: Handles admin authentication logic
   - **Key Methods**:
     - `execute(email, password)` - Authenticate admin and return token/user
   - **Dependencies**: `AdminRepository`, `config`

3. **`backend/src/presentation/AdminController.js`**
   - **Purpose**: HTTP request handlers for admin operations
   - **Key Methods**:
     - `getAllCompanies(req, res, next)` - Get all companies (no company scoping)
     - `getCompany(req, res, next)` - Get company by ID (read-only)
     - `getEmployee(req, res, next)` - Get employee by ID (read-only, bypasses company scoping)
   - **Dependencies**: `CompanyRepository`, `EmployeeRepository`

### Frontend Files

4. **`frontend/src/services/adminService.js`**
   - **Purpose**: API service for admin operations
   - **Key Functions**:
     - `getAllCompanies()` - Fetch all companies
     - `getCompany(companyId)` - Fetch company by ID
   - **Dependencies**: `api` (axios instance)

5. **`frontend/src/components/AdminHeader.js`**
   - **Purpose**: Header component for admin dashboard
   - **Features**:
     - Displays admin name and email
     - Logout button
   - **Dependencies**: `useAuth`, `useNavigate`

6. **`frontend/src/pages/AdminDashboard.js`**
   - **Purpose**: Main admin dashboard page
   - **Features**:
     - Directory Overview tab (company cards)
     - Pending Requests tab (placeholder)
     - Management & Reporting button (placeholder)
   - **Dependencies**: `AdminHeader`, `adminService`, `useNavigate`

---

## Files Modified

### Backend Files

1. **`database/migrations/001_initial_schema.sql`**
   - **Changes**: Added `directory_admins` table definition
   - **Lines Added**: After line 209 (after `value_proposition` column)
   - **Code Added**:
     ```sql
     -- Directory Admins table (platform-level admins, not tied to any company)
     CREATE TABLE IF NOT EXISTS directory_admins (
         id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
         email VARCHAR(255) UNIQUE NOT NULL,
         password_hash VARCHAR(255) NOT NULL,
         full_name VARCHAR(255) NOT NULL,
         role VARCHAR(50) DEFAULT 'DIRECTORY_ADMIN' CHECK (role = 'DIRECTORY_ADMIN'),
         is_active BOOLEAN DEFAULT TRUE,
         created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
         updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
     );
     
     -- Create index on email for faster lookups
     CREATE INDEX IF NOT EXISTS idx_directory_admins_email ON directory_admins(email);
     ```

2. **`backend/src/presentation/AuthController.js`**
   - **Changes**: 
     - Added `AuthenticateAdminUseCase` import
     - Added `authenticateAdminUseCase` to constructor
     - Modified `login()` method to check `isAdmin` flag and route to admin authentication
   - **Lines Modified**: 
     - Line 4: Added import
     - Line 8: Added to constructor
     - Line 15-44: Modified login method
   - **Key Change**: 
     ```javascript
     // Check if this is an admin login
     if (isAdmin === true) {
       const result = await this.authenticateAdminUseCase.execute(email, password);
       // ... return admin result
     }
     // Regular employee login continues as before
     ```

3. **`backend/src/infrastructure/auth/DummyAuthProvider.js`**
   - **Changes**:
     - Added `AdminRepository` import
     - Added `adminRepository` to constructor
     - Added `validateAdminToken()` method
     - Modified `validateToken()` to check for admin tokens
   - **Lines Modified**:
     - Line 7: Added import
     - Line 24: Added to constructor
     - Line 66-73: Modified validateToken to check admin tokens
     - Lines 306-380: Added validateAdminToken method (new)
   - **Key Change**: Admin tokens have format `dummy-token-admin-{adminId}-{email}-{timestamp}`

4. **`backend/src/index.js`**
   - **Changes**:
     - Added `AdminController` import
     - Added `adminController` variable declaration
     - Added `adminController` initialization
     - Added admin routes: `/admin/companies` and `/admin/companies/:companyId` and `/admin/employees/:employeeId`
   - **Lines Modified**:
     - Line 29: Added import
     - Line 148: Added variable declaration
     - Line 175: Added initialization
     - Lines 351-370: Added admin routes

### Frontend Files

5. **`frontend/src/services/authService.js`**
   - **Changes**: Modified `login()` function to accept `isAdmin` parameter
   - **Lines Modified**: Line 12
   - **Change**: 
     ```javascript
     export const login = async (email, password, isAdmin = false) => {
       // ... sends isAdmin flag to backend
     }
     ```

6. **`frontend/src/context/AuthContext.js`**
   - **Changes**: Modified `login()` function to accept `isAdmin` parameter and route admins to `/admin/dashboard`
   - **Lines Modified**: Line 276
   - **Key Change**:
     ```javascript
     const login = async (email, password, isAdmin = false) => {
       // ... after successful login
       if (result.user.isAdmin || result.user.role === 'DIRECTORY_ADMIN') {
         navigate('/admin/dashboard');
         return { success: true };
       }
       // ... existing employee/HR routing continues
     }
     ```

7. **`frontend/src/components/LoginForm.js`**
   - **Changes**:
     - Added `isAdmin` to form state
     - Added admin login checkbox
     - Updated login call to pass `isAdmin` flag
   - **Lines Modified**:
     - Line 9-12: Added `isAdmin: false` to formData
     - Line 60: Updated login call
     - Lines 164-177: Added admin checkbox (before submit button)

8. **`frontend/src/pages/CompanyProfilePage.js`**
   - **Changes**:
     - Added `useAuth` and `useSearchParams` imports
     - Added `isAdminView` detection logic
     - Updated `handleEmployeeClick` to include `?admin=true` for admin views
     - Passed `isAdminView` prop to `CompanyDashboard`
   - **Lines Modified**:
     - Line 5: Added imports
     - Lines 19-22: Added isAdminView detection
     - Lines 62-67: Updated handleEmployeeClick
     - Line 203: Added isAdminView prop

9. **`frontend/src/pages/EmployeeProfilePage.js`**
   - **Changes**:
     - Added admin view detection
     - Updated `isViewOnly` logic to include admin view
     - Updated employee fetching to allow admin access (no companyId required)
   - **Lines Modified**:
     - Lines 118-120: Added admin view detection and updated isViewOnly
     - Line 31: Updated getEmployee call to allow null companyId
     - Line 53: Updated useEffect dependency

10. **`frontend/src/components/CompanyDashboard.js`**
    - **Changes**: Added `isAdminView` prop and passed it to child components
    - **Lines Modified**:
      - Line 13: Added prop (defaults to false)
      - Line 200: Passed to EmployeeList
      - Line 232: Passed to PendingProfileApprovals

11. **`frontend/src/components/EmployeeList.js`**
    - **Changes**: Added `isAdminView` prop and conditionally hide Add/Edit/Delete buttons
    - **Lines Modified**:
      - Line 9: Added prop (defaults to false)
      - Line 214: Conditionally hide Add button
      - Lines 236-295: Conditionally hide Add Employee dropdown
      - Lines 488-499: Conditionally hide Edit/Delete buttons

12. **`frontend/src/components/PendingProfileApprovals.js`**
    - **Changes**: Added `isAdminView` prop and conditionally hide Approve/Reject buttons
    - **Lines Modified**:
      - Line 8: Added prop (defaults to false)
      - Lines 155-193: Conditionally hide Approve/Reject buttons
      - Line 157: Updated View Profile navigation to include `?admin=true` for admin

13. **`frontend/src/services/employeeService.js`**
    - **Changes**: Updated `getEmployee()` to use admin endpoint when companyId is null
    - **Lines Modified**: Lines 39-47
    - **Change**:
      ```javascript
      const url = companyId 
        ? `/companies/${companyId}/employees/${employeeId}`
        : `/admin/employees/${employeeId}`;
      ```

14. **`frontend/src/App.js`**
    - **Changes**:
      - Added `AdminDashboard` import
      - Added `ConditionalHeader` component to hide header for admin routes
      - Added `/admin/dashboard` route
    - **Lines Modified**:
      - Line 2: Added `useLocation` import
      - Line 13: Added `AdminDashboard` import
      - Lines 17-25: Added `ConditionalHeader` component
      - Line 35: Added admin route

---

## Database Changes

### New Table: `directory_admins`

**Schema**:
```sql
CREATE TABLE IF NOT EXISTS directory_admins (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'DIRECTORY_ADMIN' CHECK (role = 'DIRECTORY_ADMIN'),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_directory_admins_email ON directory_admins(email);
```

**Location**: `database/migrations/001_initial_schema.sql` (after line 209)

**No existing tables modified** - only additions.

---

## API Endpoints Added

### Admin Endpoints (Protected by authMiddleware)

1. **`GET /api/v1/admin/companies`**
   - **Purpose**: Get all companies in the directory
   - **Auth**: Required (admin only)
   - **Response**: List of companies with name, status, created date
   - **Controller**: `AdminController.getAllCompanies()`

2. **`GET /api/v1/admin/companies/:companyId`**
   - **Purpose**: Get company details (read-only)
   - **Auth**: Required (admin only)
   - **Response**: Full company object
   - **Controller**: `AdminController.getCompany()`

3. **`GET /api/v1/admin/employees/:employeeId`**
   - **Purpose**: Get employee details (read-only, bypasses company scoping)
   - **Auth**: Required (admin only)
   - **Response**: Full employee object with roles, project summaries, etc.
   - **Controller**: `AdminController.getEmployee()`

### Modified Endpoints

4. **`POST /api/v1/auth/login`**
   - **Change**: Now accepts `isAdmin` boolean in request body
   - **Behavior**: Routes to admin authentication if `isAdmin === true`

---

## Frontend Routes Added

1. **`/admin/dashboard`**
   - **Component**: `AdminDashboard`
   - **Features**: Directory Overview, Pending Requests, Management & Reporting
   - **Header**: Uses `AdminHeader` (no regular Header shown)

---

## Rollback Instructions

### Step 1: Revert Database Changes

**Option A: Remove table (if no admin data needed)**
```sql
DROP TABLE IF EXISTS directory_admins CASCADE;
DROP INDEX IF EXISTS idx_directory_admins_email;
```

**Option B: Keep table but disable (if admin data should be preserved)**
```sql
-- No action needed - table can remain
```

### Step 2: Delete Created Files

Delete these files:
```bash
# Backend
rm backend/src/infrastructure/AdminRepository.js
rm backend/src/application/AuthenticateAdminUseCase.js
rm backend/src/presentation/AdminController.js

# Frontend
rm frontend/src/services/adminService.js
rm frontend/src/components/AdminHeader.js
rm frontend/src/pages/AdminDashboard.js
```

### Step 3: Revert Modified Files

#### Backend Files

1. **`database/migrations/001_initial_schema.sql`**
   - Remove lines 211-226 (directory_admins table and index)

2. **`backend/src/presentation/AuthController.js`**
   - Remove `AuthenticateAdminUseCase` import (line 5)
   - Remove `authenticateAdminUseCase` from constructor (line 11)
   - Revert `login()` method to original (remove admin check, lines 17-25)

3. **`backend/src/infrastructure/auth/DummyAuthProvider.js`**
   - Remove `AdminRepository` import (line 7)
   - Remove `adminRepository` from constructor (line 24)
   - Remove admin token check from `validateToken()` (lines 66-73)
   - Remove `validateAdminToken()` method (lines 306-380)

4. **`backend/src/index.js`**
   - Remove `AdminController` import (line 29)
   - Remove `adminController` variable (line 148)
   - Remove `adminController` initialization (line 175)
   - Remove admin routes (lines 351-370)

#### Frontend Files

5. **`frontend/src/services/authService.js`**
   - Revert `login()` to original signature (remove `isAdmin` parameter)

6. **`frontend/src/context/AuthContext.js`**
   - Revert `login()` to original signature (remove `isAdmin` parameter)
   - Remove admin routing logic (lines 285-290)

7. **`frontend/src/components/LoginForm.js`**
   - Remove `isAdmin` from formData (line 11)
   - Remove admin checkbox (lines 164-177)
   - Revert login call (line 60)

8. **`frontend/src/pages/CompanyProfilePage.js`**
   - Remove `useAuth` and `useSearchParams` imports if not used elsewhere
   - Remove `isAdminView` detection (lines 19-22)
   - Revert `handleEmployeeClick` (lines 62-67)
   - Remove `isAdminView` prop from CompanyDashboard (line 203)

9. **`frontend/src/pages/EmployeeProfilePage.js`**
   - Remove admin view detection (lines 118-120)
   - Revert employee fetching (line 31)
   - Revert useEffect dependency (line 53)

10. **`frontend/src/components/CompanyDashboard.js`**
    - Remove `isAdminView` prop (line 13)
    - Remove prop passing to EmployeeList (line 200)
    - Remove prop passing to PendingProfileApprovals (line 232)

11. **`frontend/src/components/EmployeeList.js`**
    - Remove `isAdminView` prop (line 9)
    - Remove conditional hiding of Add button (line 214)
    - Remove conditional hiding of Add dropdown (lines 236-295)
    - Remove conditional hiding of Edit/Delete (lines 488-499)

12. **`frontend/src/components/PendingProfileApprovals.js`**
    - Remove `isAdminView` prop (line 8)
    - Remove conditional hiding of Approve/Reject (lines 155-193)
    - Revert View Profile navigation (line 157)

13. **`frontend/src/services/employeeService.js`**
    - Revert `getEmployee()` to original (remove admin endpoint logic)

14. **`frontend/src/App.js`**
    - Remove `AdminDashboard` import (line 13)
    - Remove `ConditionalHeader` component (lines 17-25)
    - Remove `/admin/dashboard` route (line 35)
    - Restore original Header rendering

### Step 4: Verify Rollback

1. Test employee login - should work as before
2. Test HR login - should work as before
3. Test company profile - should work as before
4. Test employee profile - should work as before
5. Verify no admin-related code remains

---

## Testing Checklist

### Admin Authentication

- [ ] Admin can log in with email/password + "Admin Login" checkbox
- [ ] Admin is redirected to `/admin/dashboard` after login
- [ ] Admin token is generated correctly (`dummy-token-admin-{id}-{email}-{timestamp}`)
- [ ] Admin token validation works in DummyAuthProvider

### Admin Dashboard

- [ ] Directory Overview tab shows all companies
- [ ] Company cards display: name, status, industry, domain, created date
- [ ] Status badges show correct colors (approved/pending/rejected)
- [ ] Clicking company card navigates to company profile
- [ ] Management & Reporting button shows placeholder alert
- [ ] Pending Requests tab shows placeholder message

### Admin View-Only Mode

- [ ] Admin can view company profile (read-only)
- [ ] Admin cannot see Add/Edit/Delete buttons in Employee List
- [ ] Admin cannot see Approve/Reject buttons in Pending Approvals
- [ ] Admin can click "View Profile" on employees
- [ ] Admin can view employee profiles (read-only)
- [ ] Admin cannot edit employee profiles
- [ ] Admin cannot submit requests
- [ ] Admin cannot toggle trainer settings

### Existing Functionality (Should Still Work)

- [ ] Employee login works (without admin checkbox)
- [ ] HR login works
- [ ] Company profile works for HR
- [ ] Employee profile works for employees
- [ ] All existing features unchanged

---

## Key Design Decisions

1. **Separate Admin Table**: Admins are stored separately from employees to maintain clear separation
2. **View-Only Mode**: All admin views are read-only to prevent accidental modifications
3. **Query Parameter Detection**: Admin view is detected via `?admin=true` query param or user role
4. **Conditional Rendering**: UI elements are conditionally hidden (not removed) for admin view
5. **Backward Compatible**: All changes are additive - existing functionality remains intact

---

## Future Enhancements (Not Implemented)

1. **Management & Reporting Integration**: Currently shows placeholder alert
2. **Pending Requests Functionality**: Currently shows placeholder message
3. **Admin Management**: No UI for creating/managing admin accounts (must be done via SQL)
4. **Admin Permissions**: All admins have same permissions (no role-based admin permissions)

---

## Notes

- Admin accounts must be created manually via SQL or AdminRepository.create()
- Admin passwords are hashed using bcrypt (same as employees)
- Admin tokens follow same dummy format as employees but with `admin-` prefix
- All admin endpoints require authentication (authMiddleware)
- Admin views bypass company scoping (can view any company/employee)

---

## Creating Admin Account

### Option 1: Using SQL Script

1. **Generate password hash** (use bcrypt with 10 rounds):
   - Online tool: https://bcrypt-generator.com/
   - Or use Node.js: `const bcrypt = require('bcrypt'); const hash = await bcrypt.hash('your-password', 10);`

2. **Run SQL script**:
   ```sql
   INSERT INTO directory_admins (email, password_hash, full_name, role, is_active)
   VALUES (
     'admin@educore.io',  -- Your admin email
     '$2b$10$...',  -- Your bcrypt hash
     'Directory Admin',  -- Admin name
     'DIRECTORY_ADMIN',
     TRUE
   );
   ```

3. **Script location**: `database/scripts/create_admin_account.sql`

### Option 2: Using Node.js Script

1. **Update credentials** in `database/scripts/create_admin_account.js`:
   ```javascript
   const adminData = {
     email: 'admin@educore.io',
     password: 'YourSecurePassword',  // ⚠️ Change this!
     full_name: 'Directory Admin'
   };
   ```

2. **Run script**:
   ```bash
   node database/scripts/create_admin_account.js
   ```

### Default Admin Account (For Testing)

**Email**: `admin@educore.io` (example - you must create this)  
**Password**: Set during account creation  
**Note**: No default account exists - you must create one first!

---

**End of Document**

