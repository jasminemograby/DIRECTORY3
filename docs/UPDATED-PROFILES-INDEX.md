# Updated Profiles Documentation - Index

**Last Updated**: 2025-01-20  
**Purpose**: Central index for all "Updated Profiles" documentation. Use these documents as rollback reference points.

---

## Documentation Files

### 1. Company Profile Documentation
**File**: `UPDATED-PROFILES-COMPANY-PROFILE.md`

**Contents**:
- Complete Company Profile page structure
- All tabs and features (Overview, Hierarchy, Analytics, Employees, Enrollment, Pending Requests, Profile Approvals)
- UI components and their behavior
- Data flow and API endpoints
- Database schema
- Key files reference
- Rollback checklist

**Use When**:
- Company Profile page breaks
- Need to understand company management features
- Need to verify tab structure or employee filtering
- Need to check pending requests or approvals workflow

### 2. Employee Profile Documentation
**File**: `UPDATED-PROFILES-EMPLOYEE-PROFILE.md`

**Contents**:
- Complete Employee Profile page structure
- All profile sections (Basic Info, Bio, Project Summaries, Value Proposition)
- Approval workflow and status states
- Learning & Development tabs (Skills, Courses, Learning Path, Analytics, Requests)
- Trainer-specific features
- Data flow and API endpoints
- Database schema
- Key files reference
- Rollback checklist

**Use When**:
- Employee Profile page breaks
- Need to understand profile enrichment display
- Need to verify Learning & Development tabs
- Need to check trainer features
- Need to understand approval status impact

### 3. Decision Maker Profile Documentation
**File**: `DECISION-MAKER-PROFILE.md`

**Contents**:
- Complete Decision Maker profile features and functionality
- Learning Paths Approvals section details
- Role definition and assignment
- Profile structure and section visibility
- View-only mode behavior
- Data flow and API endpoints
- Component files reference
- Testing checklist
- Future enhancements

**Use When**:
- Decision Maker profile features need verification
- Learning Paths Approvals section breaks
- Need to understand Decision Maker role permissions
- Need to test approval workflow
- Need to check section visibility conditions

### 4. Features and Flows Documentation
**File**: `UPDATED-PROFILES-FEATURES-AND-FLOWS.md`

**Contents**:
- All user flows (registration, login, enrichment, approval, requests)
- Detailed enrichment flow with OpenAI integration
- Approval workflow steps
- Request submission and review flow
- Authentication flow (dummy auth)
- Company registration flow
- Microservice integration patterns
- Rollback checklist

**Use When**:
- Any flow breaks (enrichment, approval, requests)
- Need to understand how features work end-to-end
- Need to verify API call sequences
- Need to check microservice integration patterns

### 4. File Reference Documentation
**File**: `UPDATED-PROFILES-FILE-REFERENCE.md`

**Contents**:
- Complete listing of all project files
- Description of what each file contains
- Purpose of each file
- Organized by category (Frontend, Backend, Database, Documentation)
- File count summary

**Use When**:
- Need to find a specific file
- Need to understand what a file does
- Need to locate code for a specific feature
- Need to understand project structure

---

## Quick Reference

### Company Profile Features

✅ **Tabs**:
- Overview (metrics + company info)
- Hierarchy (organizational structure)
- Analytics (analytics dashboard)
- Employees (list with search/filter/sort)
- Enroll to Courses (course enrollment)
- Pending Requests (employee requests with count badge)
- Profile Approvals (approval workflow with count badge)

✅ **Employee List**:
- Search by name/email
- Single-select role filter dropdown
- Sort by name/email/role/department/team
- Sort direction toggle
- Click employee → Navigate to profile

✅ **Pending Requests**:
- No auto-refresh (fetches once)
- Count badge in tab header
- Request cards with approve/reject/view employee

✅ **Profile Approvals**:
- Count badge in tab header
- Approve/Reject buttons
- Page reloads after action

### Employee Profile Features

✅ **Basic Information**:
- Name, email, roles, department, team
- LinkedIn and GitHub links (direct from database)
- NO employee ID displayed

✅ **Enriched Content**:
- AI-generated bio (2-3 sentences, max 150 words)
- Project summaries (from GitHub repos)
- Value proposition with "READ MORE" button

✅ **Learning & Development** (only when approved):
- Skills tab (hierarchical skills)
- Courses tab (Assigned/In Progress/Completed/Taught for trainers)
- Learning Path tab ("No learning path yet." message)
- Analytics tab
- Requests tab (submit and view requests)

✅ **Trainer Features**:
- Trainer Settings section (below Learning & Development)
- "Taught" section in Courses tab
- NO "Trainer Profile" title
- NO "Courses Taught" in trainer section (moved to Courses tab)

### Key Flows

✅ **Enrichment Flow**:
1. Connect LinkedIn (OAuth)
2. Connect GitHub (OAuth)
3. Automatic enrichment trigger
4. OpenAI generates bio, summaries, value proposition
5. Data saved to database
6. Approval request created
7. Profile status = 'enriched'

✅ **Approval Flow**:
1. HR views pending approvals in Company Profile
2. HR clicks Approve
3. Profile status = 'approved'
4. Employee sees Learning & Development section

✅ **Request Flow**:
1. Employee submits request in Requests tab
2. Request saved to database
3. Request appears in Company Profile → Pending Requests
4. HR can review and approve/reject

---

## Rollback Procedures

### If Company Profile Breaks

1. Read `UPDATED-PROFILES-COMPANY-PROFILE.md`
2. Verify:
   - Tab structure matches documentation
   - Employee list filtering (single-select role dropdown)
   - Pending Requests count badge
   - Profile Approvals count badge
   - No auto-refresh in Pending Requests
3. Check API response handling (envelope structure)
4. Verify component props match documentation

### If Employee Profile Breaks

1. Read `UPDATED-PROFILES-EMPLOYEE-PROFILE.md`
2. Verify:
   - Basic information displays (department_name, team_name from JOINs)
   - LinkedIn link is direct from database
   - Value Proposition "READ MORE" placement
   - Learning & Development only shows when approved
   - Trainer "Taught" section in Courses tab
   - No "Dashboard" tab in Learning & Development
3. Check profile_status impact on visibility
4. Verify request submission envelope structure

### If Flows Break

1. Read `UPDATED-PROFILES-FEATURES-AND-FLOWS.md`
2. Verify:
   - Enrichment triggers after both OAuth connections
   - Approval workflow updates profile_status
   - Request submission uses envelope structure
   - Authentication skips envelope for auth endpoints
   - Microservice calls have mock fallback
3. Check API call sequences match documentation
4. Verify database state transitions

---

## Database State Reference

### Employee Profile Status States

- `basic`: Initial state, no enrichment
- `enriched`: Enrichment complete, awaiting approval
- `approved`: Approved by HR, full access
- `rejected`: Rejected by HR

### Enrichment Completion

- `enrichment_completed`: Boolean flag (true after successful enrichment)
- `enrichment_completed_at`: Timestamp of completion

### Approval Status

- `employee_profile_approvals.status`: 'pending' | 'approved' | 'rejected'
- `employee_profile_approvals.reviewed_at`: Timestamp of review
- `employee_profile_approvals.reviewed_by`: HR employee ID

---

## API Response Structure

### Standard Envelope

All API responses (except auth endpoints) use:
```javascript
{
  requester_service: 'directory_service',
  response: {
    // Actual data
  }
}
```

**Frontend Handling**:
```javascript
const data = response?.response || response;
```

### Auth Endpoints

Auth endpoints (`/auth/login`, `/auth/logout`, `/auth/me`) do NOT use envelope structure.

**Frontend**: `api.js` interceptor skips envelope wrapping for auth endpoints.

---

## Key Design Decisions

1. **No Auto-Refresh**: Pending Requests section fetches once on mount, no polling
2. **Count Badges**: Red badges show pending counts in tab headers
3. **Single-Select Role Filter**: Employee list uses dropdown, not multi-select
4. **No Status Filter**: Removed Active/Inactive filter from employee list
5. **Direct LinkedIn Links**: No validation, direct from database
6. **Value Proposition "READ MORE"**: Placed at end of last sentence
7. **Trainer "Taught"**: Only in Courses tab, only for trainers
8. **No Dashboard Tab**: Removed from Learning & Development
9. **Envelope Structure**: All non-auth endpoints use envelope
10. **No Mock Fallback**: Enrichment fails explicitly if OpenAI fails

---

## File Locations

For a complete listing of all files with descriptions, see **`UPDATED-PROFILES-FILE-REFERENCE.md`**.

### Frontend Key Files

- `frontend/src/pages/CompanyProfilePage.js`
- `frontend/src/pages/EmployeeProfilePage.js`
- `frontend/src/components/CompanyDashboard.js`
- `frontend/src/components/EmployeeList.js`
- `frontend/src/components/PendingRequestsSection.js`
- `frontend/src/components/PendingProfileApprovals.js`
- `frontend/src/components/ApprovedProfileTabs.js`
- `frontend/src/components/ProfileCourses.js`
- `frontend/src/components/ProfileRequests.js`

### Backend Key Files

- `backend/src/presentation/CompanyProfileController.js`
- `backend/src/presentation/EmployeeController.js`
- `backend/src/presentation/RequestController.js`
- `backend/src/presentation/EmployeeProfileApprovalController.js`
- `backend/src/application/EnrichProfileUseCase.js`
- `backend/src/application/GetCompanyProfileUseCase.js`
- `backend/src/infrastructure/OpenAIAPIClient.js`
- `backend/src/infrastructure/EmployeeRepository.js`

---

## Last Known Working State

**Date**: 2025-01-20  
**Commit**: Current as of documentation creation

**Verified Features**:
- ✅ Company Profile with all tabs
- ✅ Employee Profile with enrichment display
- ✅ Approval workflow
- ✅ Request submission and display
- ✅ Learning & Development tabs (when approved)
- ✅ Trainer features
- ✅ No auto-refresh in Pending Requests
- ✅ Count badges in tabs
- ✅ Single-select role filter
- ✅ Direct LinkedIn links

---

## How to Use This Documentation

1. **Before Making Changes**: Read relevant documentation file
2. **During Development**: Reference expected behavior
3. **After Changes**: Verify against documentation
4. **If Something Breaks**: Use rollback procedures
5. **For New Features**: Update documentation files

---

## Questions?

If something doesn't match the documentation:
1. Check if it's a recent change not yet documented
2. Verify against the actual code files listed
3. Check git history for when behavior changed
4. Update documentation if behavior is intentionally different

---

**Remember**: These documents are a snapshot of the working system. Use them as a reference point for rollback and understanding expected behavior.

