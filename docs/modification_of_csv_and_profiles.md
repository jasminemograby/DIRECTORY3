# CSV Format and Profiles Modification Documentation

## Table of Contents
1. [CSV Format Modifications](#csv-format-modifications)
2. [Profiles UI & Logic Implementation](#profiles-ui--logic-implementation)
3. [Error Fixes and Solutions](#error-fixes-and-solutions)

---

## CSV Format Modifications

### Overview
The CSV upload format was restructured to clearly separate company-level configuration from employee data. This ensures better data organization and validation.

### New CSV Structure

#### Row 1: Company-Level Fields Only
The first row contains **only** company configuration fields. All employee-specific fields should be empty/null in this row.

**Required Company Fields:**
- `company_name` - Name of the company
- `industry` - Industry classification
- `domain` - Company domain URL
- `logo_url` - URL to company logo image
- `hr_contact_name` - HR contact person name
- `hr_contact_email` - HR contact email
- `hr_contact_role` - HR contact role/title
- `approval_policy` - Company approval policy setting
- `kpis` - Company KPIs (JSON array format)
- All other fields should be empty/null

#### Rows 2+: Employee Data Only
Subsequent rows contain **only** employee-specific fields. Company-level fields should be empty/null in these rows.

**Required Employee Fields:**
- `employee_id` - Unique employee identifier within company
- `full_name` - Employee full name
- `email` - Employee email (must be unique)
- `password_hash` - Hashed password (or will be generated)
- `current_role_in_company` - Current job title/role
- `target_role_in_company` - Target/desired role
- `preferred_language` - Language preference
- `role_type` - **MUST include base role**: `REGULAR_EMPLOYEE` or `TRAINER`
  - Additional roles can be combined: `REGULAR_EMPLOYEE + TEAM_MANAGER`, `TRAINER + DEPARTMENT_MANAGER`, etc.
  - **Only ONE `DECISION_MAKER` per company**
- `department_id` - Department identifier
- `team_id` - Team identifier
- `manager_employee_id` - Manager's employee_id (if applicable)
- `bio` - Employee biography
- `profile_photo_url` - Profile photo URL
- `linkedin_url` - LinkedIn profile URL
- `github_url` - GitHub profile URL
- `kpis` - Employee-specific KPIs (JSON array format)

### Validation Rules

#### Role Type Validation
- **Base Role Requirement**: Every employee must have either `REGULAR_EMPLOYEE` or `TRAINER` as a base role
- **Role Combination**: Additional roles can be added (e.g., `TEAM_MANAGER`, `DEPARTMENT_MANAGER`, `DECISION_MAKER`)
- **DECISION_MAKER Uniqueness**: Only one employee per company can have the `DECISION_MAKER` role
- **Format**: Roles are separated by `+` (e.g., `REGULAR_EMPLOYEE + TEAM_MANAGER`)

#### Email Validation
- Must be unique across all employees
- Must follow standard email format
- **Reserved Email**: `admin@educore.io` is reserved for Directory Admin and cannot be used

#### Company-Level Validation
- Company fields must only appear in row 1
- Employee fields must only appear in rows 2+
- All rows must have the same number of columns (matching header)

### CSV Processing Flow

1. **CSVParser** (`backend/src/infrastructure/CSVParser.js`)
   - Parses CSV buffer into rows
   - Separates company row (row 1) from employee rows (rows 2+)
   - Normalizes company data using `normalizeCompanyRow()`
   - Normalizes employee data using `normalizeEmployeeRow()`

2. **CSVValidator** (`backend/src/infrastructure/CSVValidator.js`)
   - Validates CSV structure (company fields in row 1, employee fields in rows 2+)
   - Validates role types (base role requirement, DECISION_MAKER uniqueness)
   - Validates email uniqueness
   - Validates required fields

3. **DatabaseConstraintValidator** (`backend/src/infrastructure/DatabaseConstraintValidator.js`)
   - Validates data against database constraints
   - Checks mandatory KPIs
   - Validates role types against allowed values

4. **ParseCSVUseCase** (`backend/src/application/ParseCSVUseCase.js`)
   - Orchestrates the entire CSV processing pipeline
   - Handles company settings from `companyRow`
   - Processes employee data from `employeeRows`
   - Executes database insertion within a transaction

### Example CSV Structure

```csv
company_name,industry,domain,logo_url,hr_contact_name,hr_contact_email,hr_contact_role,approval_policy,kpis,employee_id,full_name,email,password_hash,current_role_in_company,target_role_in_company,preferred_language,role_type,department_id,team_id,manager_employee_id,bio,profile_photo_url,linkedin_url,github_url
LOTUS_TECHHUB,High-Tech / Technology,https://www.lotustechhub.com/he,https://portlandtrust.org.il/wp-content/uploads/2023/03/LOTUS-new-logo.png,HR Manager,hr@lotustechhub.com,HR Manager,auto,["kpi1","kpi2"],,,,,,,,,,,,,
,,,,,,,,,HR001,Rola Hassoun,rola.hassoun@lotustechhub.com,hashed_password,HR Manager,HR Manager,English,REGULAR_EMPLOYEE + HR_MANAGER,DEPT001,TEAM001,,HR professional with 5+ years experience,,,,,
,,,,,,,,,CEO001,Maysa Halaby,maysa.halaby@lotustechhub.com,hashed_password,Founder & CEO,Founder & CEO,English,REGULAR_EMPLOYEE + DECISION_MAKER,DEPT001,TEAM001,,Company founder and CEO,,,,,
```

---

## Profiles UI & Logic Implementation

### Employee Profiles

#### Profile Types by Role

##### 1. Regular Employee Profile
**Data Shown:**
- Basic information (name, email, role, department, team)
- Profile photo
- Bio and enrichment data
- Skills and courses
- Learning path
- Project summaries
- Requests section (for submitting requests)

**Actions Available:**
- View own profile
- Edit own profile (if approved)
- Submit requests (if profile is approved)
- View own requests history
- Enrich profile (if not yet enriched)

**Permissions:**
- Can edit own profile only after approval
- Can submit requests only after profile approval
- Cannot approve/reject other employees' requests
- Cannot view management hierarchy (unless they are a manager)

##### 2. Trainer Profile
**Data Shown:**
- All regular employee data
- **Trainer Settings Section** (appears at top of Management tab)
  - Trainer preferences
  - Course assignments
  - Training schedule
- **Management Section** (appears below Trainer Settings if manager)
  - Management hierarchy (if also TEAM_MANAGER or DEPARTMENT_MANAGER)

**Actions Available:**
- All regular employee actions
- Configure trainer settings
- View courses taught
- View management hierarchy (if manager)

**Special Logic:**
- Trainer Settings section appears first in Management tab
- Management hierarchy appears below Trainer Settings if trainer is also a manager
- Both sections are collapsed by default

##### 3. Manager Profile (TEAM_MANAGER or DEPARTMENT_MANAGER)
**Data Shown:**
- All regular employee data
- **Management Section**
  - For TEAM_MANAGER: Shows team members and team structure
  - For DEPARTMENT_MANAGER: Shows department teams and employees
  - Expandable/collapsible sections
  - Employee cards with names, roles, and basic info

**Actions Available:**
- All regular employee actions
- View management hierarchy (read-only)
- Navigate to employee profiles from hierarchy

**Special Logic:**
- Management hierarchy is collapsed by default
- If no direct reports found, system falls back to:
  - For TEAM_MANAGER: Shows all employees in manager's assigned team
  - For DEPARTMENT_MANAGER: Shows all employees in manager's department
- Hierarchy UI matches Company Profile hierarchy tab style

##### 4. HR Manager Profile
**Data Shown:**
- All regular employee data
- Company-level information
- Pending requests (company-wide)
- Pending profile approvals

**Actions Available:**
- All regular employee actions
- Approve/reject employee requests
- Approve/reject employee profile enrichments
- View company dashboard

**Permissions:**
- Can approve/reject requests from all company employees
- Can approve/reject profile enrichments
- Can view company-wide data

##### 5. Decision Maker Profile
**Data Shown:**
- All regular employee data
- Company-level analytics and metrics
- Strategic overview

**Actions Available:**
- All regular employee actions
- Access to company-level decisions
- View comprehensive company analytics

**Special Logic:**
- Only one DECISION_MAKER per company (enforced in CSV validation)

#### Profile Status Flow

1. **Basic** - Initial profile state
2. **Enriched** - After enrichment process (bio, skills, etc. added)
3. **Approved** - After HR approval (required for submitting requests)
4. **Rejected** - If enrichment is rejected by HR

#### Profile Sections

**Overview Tab:**
- Basic information
- Bio and enrichment data
- Skills and courses
- Learning path
- Project summaries

**Management Tab:**
- Trainer Settings (if trainer)
- Management Hierarchy (if manager)
- Both sections collapsed by default

**Requests Tab:**
- Submit new request
- View request history
- Request status tracking

---

### Company Profile

#### Data Shown
- Company logo (circular, 80px)
- Company name and industry
- Company metrics (employee count, departments, teams)
- Organizational hierarchy
- Employee list
- Analytics dashboard
- Pending requests
- Pending profile approvals

#### Tabs Available

1. **Overview**
   - Company metrics
   - Company information (name, industry, domain)
   - Quick stats

2. **Dashboard**
   - Analytics dashboard
   - Charts and visualizations

3. **Hierarchy**
   - Organizational structure
   - Departments and teams
   - Employee assignments
   - Expandable/collapsible sections

4. **Employees**
   - Full employee list
   - Search and filter
   - Add/Edit/Delete employees (HR only)
   - CSV upload (HR only)

5. **Enroll to Courses**
   - Course enrollment section

6. **Pending Requests**
   - Employee requests requiring approval
   - Approve/Reject actions (HR only)
   - Request details and history

7. **Approvals**
   - Pending profile approvals
   - Approve/Reject enriched profiles (HR only)

#### Actions Available

**For HR Managers:**
- View all company data
- Approve/reject employee requests
- Approve/reject profile enrichments
- Add/Edit/Delete employees
- Upload CSV files
- View company analytics

**For Regular Employees:**
- View company hierarchy (read-only)
- View employee list (read-only)
- View company information (read-only)

**For Admins (Read-Only Mode):**
- View all company data
- **Cannot** approve/reject requests
- **Cannot** approve/reject profiles
- **Cannot** edit company details
- **Cannot** modify employee profiles
- Read-only notices displayed in Requests and Approvals tabs

#### Special Logic

**Logo Display:**
- Logo URL stored in `companies.logo_url`
- Displayed as circular image (80px)
- Fallback to company initial if logo missing or fails to load
- Error handling for broken image URLs

**Pending Requests:**
- Auto-refresh when tab is clicked
- Auto-refresh when window regains focus
- Shows request count badge on tab
- Read-only mode for admins (buttons disabled)

**Pending Approvals:**
- Shows employees with enriched profiles awaiting approval
- Approve/Reject buttons (HR only)
- Read-only mode for admins (buttons hidden)

---

### Admin Profile (Directory Admin)

#### Data Shown
- Admin avatar (circular, initial letter)
- Admin name and role
- Company cards in Overview tab
  - Company logo (60px circular)
  - Company name
  - Industry
  - Domain
  - Status badge (pending/approved/rejected)
  - Created date

#### Tabs Available

1. **Overview**
   - Grid of company cards
   - Each card shows company logo, name, industry, domain, status
   - Click to view company profile (read-only)

2. **Requests**
   - Placeholder for future company-level requests
   - (Coming soon message)

3. **Management & Reporting**
   - Placeholder for microservice integration
   - "View System Analytics" link (shows redirect message)

#### Actions Available
- View all companies
- View any company profile (read-only)
- View any employee profile (read-only)
- Navigate between companies and employees
- **Cannot** modify any data (read-only mode)

#### Special Logic

**Company Cards:**
- Logo displayed with fallback to company initial
- Status badge color-coded (green=approved, yellow=pending, red=rejected)
- Clicking card navigates to company profile with `?admin=true` query param

**Read-Only Mode:**
- All company profiles accessed via admin show read-only notices
- Approve/Reject buttons disabled in Requests tab
- Approve/Reject buttons hidden in Approvals tab
- Edit buttons disabled in employee profiles

**Navigation:**
- All links include `?admin=true` query param
- Maintains admin context throughout navigation

---

## Error Fixes and Solutions

### 1. CSV Column Misalignment Error

**Error:**
```
Invalid email format: HR Manager
12 rows with errors
```

**Root Cause:**
Employee rows (row 3+) were missing empty fields corresponding to company-level columns at the beginning, causing column misalignment.

**Solution:**
- Updated CSV generation to include 10 empty fields at the start of each employee row
- Ensured all rows have the same number of columns (26) matching the header
- Fixed in `test_company_lotus_techhub.csv`

**Prevention:**
- CSV validator checks column count consistency
- Parser normalizes rows before processing

---

### 2. Pending Requests Not Visible (401 Unauthorized)

**Error:**
```
Failed to load pending requests
401 Unauthorized error
```

**Root Cause:**
- `RequestController.getCompanyRequests` was returning data in double-envelope format
- Frontend was parsing `response.response.requests` but actual path was `response.response.response.requests`

**Solution:**
- Removed manual envelope wrapping from `RequestController.getCompanyRequests`
- Let `formatResponse` middleware handle envelope wrapping
- Frontend now correctly parses `response.response.requests`

**Files Changed:**
- `backend/src/presentation/RequestController.js`
- `frontend/src/components/PendingRequestsSection.js`

---

### 3. Employee Profile Not Loading After Enrichment

**Error:**
```
Syntax error: Identifier 'isAdminView' has already been declared
```

**Root Cause:**
- Duplicate `isAdminView` variable declaration in `EmployeeProfilePage.js`

**Solution:**
- Removed duplicate declaration
- Fixed `useEffect` dependency to correctly use `isAdminView`

**Files Changed:**
- `frontend/src/pages/EmployeeProfilePage.js`

---

### 4. Management Hierarchy 404 Error

**Error:**
```
GET /companies/:companyId/employees/:employeeId/management-hierarchy → 404
Failed to load management hierarchy
```

**Root Causes:**
1. UUID comparison mismatch: `employee.company_id` (UUID object) vs `companyId` (string)
2. Manager hierarchy logic not finding direct reports
3. Response format not matching frontend expectations

**Solutions:**
1. Fixed UUID comparison: `String(employee.company_id) !== String(companyId)`
2. Added fallback logic for team managers:
   - First checks for directly managed employees
   - If none found, queries manager's own assigned team
3. Added fallback for department managers:
   - Queries manager's own department if no managed employees found
4. Ensured response format matches frontend expectations
5. Added extensive logging for debugging

**Files Changed:**
- `backend/src/application/GetManagerHierarchyUseCase.js`
- `backend/src/presentation/EmployeeController.js`
- `frontend/src/components/ProfileManagement.js`

---

### 5. Admin Overview Missing Companies

**Error:**
```
Companies not appearing in Admin Dashboard Overview
```

**Root Cause:**
- Same double-envelope issue as pending requests
- `AdminController.getAllCompanies` was manually wrapping response
- `formatResponse` middleware wrapped it again

**Solution:**
- Removed manual envelope wrapping from all `AdminController` methods
- Let `formatResponse` middleware handle wrapping
- Frontend now correctly parses `response.response.companies`

**Files Changed:**
- `backend/src/presentation/AdminController.js`
- `frontend/src/pages/AdminDashboard.js`

---

### 6. Invalid Hierarchy Data Structure

**Error:**
```
Invalid hierarchy data structure received
Expected hierarchy.manager_type but got: null
```

**Root Cause:**
- Frontend expecting different response structure than backend provided
- Response parsing not handling all possible formats

**Solution:**
- Updated `ProfileManagement.js` to handle multiple response formats
- Added fallback parsing strategies
- Updated UI to match `CompanyHierarchy` component style
- Set default state for sections to collapsed

**Files Changed:**
- `frontend/src/components/ProfileManagement.js`

---

### 7. Logo Not Displayed in Company Profile

**Error:**
```
Company logo not showing in company profile
```

**Root Cause:**
- Logo URL not being fetched or displayed correctly
- Image loading errors not handled

**Solution:**
- Verified logo URL in database
- Added error handling for image loading
- Added fallback to company initial if image fails
- Fixed logo display in company profile header

**Files Changed:**
- `frontend/src/pages/CompanyProfilePage.js`

---

## Key Implementation Details

### Response Envelope Format

All API responses follow this structure (handled by `formatResponse` middleware):

```javascript
{
  requester_service: 'directory_service',
  response: {
    // Actual data here
  }
}
```

**Important:** Controllers should **NOT** manually wrap responses. The middleware handles it automatically.

### UUID Handling

- Always convert UUIDs to strings for comparison: `String(uuid1) === String(uuid2)`
- Database returns UUIDs as objects, URL params are strings
- Use `$1::uuid` casting in SQL queries for consistency

### Admin Read-Only Mode

- Detected via `?admin=true` query param or `user.isAdmin` or `user.role === 'DIRECTORY_ADMIN'`
- All edit/approve/reject actions disabled
- Read-only notices displayed
- Navigation maintains `?admin=true` context

### Refresh Mechanisms

- **Pending Requests**: Refreshes on tab click and window focus
- **Company Profile**: Refreshes on tab navigation
- **Employee Profile**: Refreshes on data updates

---

## Testing Checklist

### CSV Upload
- [ ] Company fields only in row 1
- [ ] Employee fields only in rows 2+
- [ ] Base role requirement (REGULAR_EMPLOYEE or TRAINER)
- [ ] Only one DECISION_MAKER per company
- [ ] Email uniqueness validation
- [ ] Reserved email validation (admin@educore.io)

### Employee Profiles
- [ ] Regular employee can view/edit own profile
- [ ] Trainer sees Trainer Settings section
- [ ] Manager sees Management Hierarchy
- [ ] HR can approve/reject requests
- [ ] Admin sees read-only view

### Company Profile
- [ ] Logo displays correctly
- [ ] Pending requests visible and refreshable
- [ ] Pending approvals visible
- [ ] Admin read-only mode works
- [ ] All tabs functional

### Admin Dashboard
- [ ] Companies appear in Overview
- [ ] Company logos display
- [ ] Clicking company navigates to read-only profile
- [ ] Management & Reporting link works

---

## Future Enhancements

1. **CSV Validation Improvements**
   - Real-time validation feedback
   - Better error messages with row numbers
   - Preview before upload

2. **Profile Enhancements**
   - Bulk actions for HR
   - Advanced filtering and search
   - Export functionality

3. **Admin Features**
   - Company-level analytics
   - System-wide reporting
   - User management

---

*Last Updated: 2025-11-21*
*Document Version: 1.0*

