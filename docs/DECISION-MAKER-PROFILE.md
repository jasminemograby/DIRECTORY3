# Decision Maker Profile - Complete Documentation

**Last Updated**: 2025-01-20  
**Purpose**: Complete reference for Decision Maker profile features, UI, and functionality.

---

## Table of Contents

1. [Overview](#overview)
2. [Role Definition](#role-definition)
3. [Profile Structure](#profile-structure)
4. [Learning Paths Approvals Section](#learning-paths-approvals-section)
5. [Shared Features with Regular Employees](#shared-features-with-regular-employees)
6. [View-Only Mode](#view-only-mode)
7. [Data Flow](#data-flow)
8. [API Endpoints](#api-endpoints)
9. [Component Files](#component-files)
10. [Testing Checklist](#testing-checklist)

---

## Overview

Decision Makers are employees with the `DECISION_MAKER` role who have additional responsibilities for reviewing and approving learning path requests from other employees. They have access to all standard employee profile features plus a dedicated "Learning Paths Approvals" section.

### Key Characteristics

- **Role**: `DECISION_MAKER` (can be combined with other roles like `REGULAR_EMPLOYEE`, `TRAINER`, `DEPARTMENT_MANAGER`, `TEAM_MANAGER`)
- **Special Section**: Learning Paths Approvals (only visible to Decision Makers)
- **Permissions**: Can review and approve learning path requests from employees
- **Profile Access**: Full access to their own profile, read-only when viewing other employees' profiles

---

## Role Definition

### Database Storage

The Decision Maker role is stored in the `employee_roles` table:

```sql
INSERT INTO employee_roles (employee_id, role_type) 
VALUES ('employee-uuid', 'DECISION_MAKER');
```

### CSV Import

When importing employees via CSV, the role can be specified as:

```
REGULAR_EMPLOYEE + DECISION_MAKER
TRAINER + DECISION_MAKER
DEPARTMENT_MANAGER + DECISION_MAKER
TEAM_MANAGER + DECISION_MAKER
```

### Role Detection

The system checks for Decision Maker role using:

```javascript
const isDecisionMaker = employee.roles && 
                       Array.isArray(employee.roles) && 
                       employee.roles.includes('DECISION_MAKER');
```

---

## Profile Structure

### Section Visibility

Decision Maker profiles display the following sections (in order):

1. **Basic Profile Information** (always visible)
   - Name, email, current role, department, team
   - Profile photo
   - Professional links (LinkedIn, GitHub)

2. **AI-Generated Content** (when enriched)
   - Professional Bio
   - Project Summaries
   - Value Proposition

3. **Learning & Development** (when profile is approved)
   - Skills tab
   - Courses tab
   - Learning Path tab
   - Analytics tab
   - Requests tab

4. **Learning Paths Approvals** ⭐ (Decision Maker only)
   - Pending approval requests
   - Approval count badge
   - Review functionality

5. **Trainer Settings** (if also a Trainer)
   - AI-Enabled toggle
   - Public Publishing toggle

6. **Management Section** (if also a Manager and profile approved)
   - Department/Team hierarchy
   - Managed employees list

---

## Learning Paths Approvals Section

### Location

**Component**: `frontend/src/components/LearningPathApprovals.js`  
**Parent**: `frontend/src/pages/EmployeeProfilePage.js` (lines 610-632)

### Visibility Condition

```javascript
{employee.roles && 
 Array.isArray(employee.roles) && 
 employee.roles.includes('DECISION_MAKER') && (
  // Learning Paths Approvals section
)}
```

### Section Title

- **Title**: "Learning Paths Approvals"
- **Display**: Single title in the parent component (no duplicate)
- **Styling**: `text-2xl font-semibold mb-6`

### UI Components

#### 1. Approval Count Badge

**Location**: Top right of the section  
**Visibility**: Only when `approvals.length > 0`  
**Styling**: 
- Background: `rgba(239, 68, 68, 0.1)`
- Text color: `rgb(239, 68, 68)`
- Format: "{count} waiting approval(s)"

**Example**: "3 waiting approvals"

#### 2. Empty State

**Displayed when**: `approvals.length === 0`  
**Message**: "No pending learning path approvals"  
**Styling**: Centered text with card background

#### 3. Approval List

**Displayed when**: `approvals.length > 0`

Each approval item shows:
- **Learning Path Name**: Bold, primary text color
- **Employee Information**: Name and email
- **Request Date**: Formatted date
- **Review Button**: Green gradient button

**Click Behavior**:
- Clicking the card or "Review" button triggers `handleViewApproval(approvalId)`
- Currently shows an alert with approval details
- Future: Will redirect to Learner AI microservice frontend

### Data Structure

#### Approval Object

```javascript
{
  id: 'string',                    // Unique approval ID
  employee_name: 'string',         // Employee full name
  employee_email: 'string',        // Employee email
  learning_path_name: 'string',    // Name of the learning path
  requested_at: 'ISO8601',         // Request timestamp
  status: 'pending'                // Approval status
}
```

### Current Implementation

**Status**: Using mock data  
**Location**: `LearningPathApprovals.js` (lines 17-34)

```javascript
const mockApprovals = [
  {
    id: '1',
    employee_name: 'John Doe',
    employee_email: 'john.doe@company.com',
    learning_path_name: 'Frontend Developer Career Path',
    requested_at: '2025-01-15T10:30:00Z',
    status: 'pending'
  },
  // ... more approvals
];
```

### Future Integration

**Planned**: Integration with Learner AI microservice

```javascript
// TODO: Replace with actual API call when Learner AI microservice is integrated
const response = await fetch(`${LEARNER_AI_URL}/api/approvals`, {
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
});
```

### Review Action

**Current Behavior**:
- Shows alert with approval details
- Message: "Redirecting to Learner AI microservice to review: {learning_path_name}"

**Future Behavior**:
- Redirect to Learner AI frontend
- URL: `${LEARNER_AI_URL}/approvals/${approvalId}`
- Opens in new tab/window

---

## Shared Features with Regular Employees

Decision Makers have access to all standard employee profile features:

### 1. Basic Profile Information
- ✅ Name, email, role, department, team
- ✅ Profile photo
- ✅ Professional links (LinkedIn, GitHub)

### 2. AI-Enriched Content (when enriched)
- ✅ Professional Bio
- ✅ Project Summaries
- ✅ Value Proposition with "READ MORE" link

### 3. Learning & Development (when approved)
- ✅ Skills tab (hierarchical view)
- ✅ Courses tab (assigned, in progress, completed)
- ✅ Learning Path tab
- ✅ Analytics tab
- ✅ Requests tab (submit/view requests)

### 4. Profile Editing
- ✅ Edit Profile button (own profile only)
- ✅ Profile Edit Form

### 5. Trainer Features (if also Trainer)
- ✅ Trainer Settings section
- ✅ AI-Enabled toggle
- ✅ Public Publishing toggle
- ✅ "Taught" courses section

### 6. Management Features (if also Manager and approved)
- ✅ Management section
- ✅ Department/Team hierarchy
- ✅ View Profile buttons for managed employees

---

## View-Only Mode

### When Viewing Own Profile

**Full Access**:
- ✅ Edit profile
- ✅ Submit requests
- ✅ Toggle trainer settings
- ✅ Click "READ MORE" in Value Proposition
- ✅ All interactive elements enabled

### When Viewing Other Employee Profiles

**Read-Only Mode**:
- ❌ Edit profile button hidden
- ❌ Request submission form hidden
- ❌ Trainer settings toggles disabled
- ❌ "READ MORE" buttons hidden
- ✅ All data visible (read-only)

**Implementation**:
```javascript
const isOwnProfile = user?.id === employeeId;
const isViewOnly = !isOwnProfile;
```

**Components Affected**:
- `ProfileRequests`: Hides submit form
- `TrainerSettings`: Disables toggles
- `EmployeeProfilePage`: Hides "READ MORE" buttons

---

## Data Flow

### Loading Approvals

1. **Component Mount**: `LearningPathApprovals` component mounts
2. **Check Conditions**: Verifies `employeeId` and `companyId` exist
3. **Fetch Data**: Calls `fetchApprovals()` function
4. **Current**: Uses mock data with 500ms delay
5. **Future**: Will call Learner AI microservice API
6. **State Update**: Sets `approvals` state with fetched data
7. **Render**: Displays approval list or empty state

### Reviewing Approvals

1. **User Action**: Decision Maker clicks "Review" button or approval card
2. **Handler**: `handleViewApproval(approvalId)` is called
3. **Current**: Shows alert with approval details
4. **Future**: Will redirect to Learner AI microservice frontend

---

## API Endpoints

### Current (Mock)

**None** - Currently using mock data

### Future (Learner AI Integration)

**Get Pending Approvals**:
```
GET /api/v1/learning-paths/approvals/pending
Headers:
  Authorization: Bearer {token}
  Content-Type: application/json
Response:
{
  approvals: [
    {
      id: 'string',
      employee_name: 'string',
      employee_email: 'string',
      learning_path_name: 'string',
      requested_at: 'ISO8601',
      status: 'pending'
    }
  ]
}
```

**Review Approval**:
```
POST /api/v1/learning-paths/approvals/{approvalId}/review
Headers:
  Authorization: Bearer {token}
  Content-Type: application/json
Body:
{
  action: 'approve' | 'reject',
  notes: 'string' (optional)
}
```

---

## Component Files

### Main Components

1. **EmployeeProfilePage.js**
   - Location: `frontend/src/pages/EmployeeProfilePage.js`
   - Lines: 610-632 (Decision Maker section)
   - Responsibility: Conditionally renders Learning Paths Approvals section

2. **LearningPathApprovals.js**
   - Location: `frontend/src/components/LearningPathApprovals.js`
   - Responsibility: Displays and handles approval requests
   - Props: `employeeId`, `companyId`

### Related Components

- `ApprovedProfileTabs.js`: Learning & Development tabs
- `ProfileRequests.js`: Employee request submission
- `TrainerSettings.js`: Trainer-specific settings
- `ProfileManagement.js`: Manager hierarchy view

---

## Testing Checklist

### Decision Maker Role Assignment

- [ ] Employee has `DECISION_MAKER` role in database
- [ ] Role appears in `employee.roles` array
- [ ] Role can be assigned via CSV import
- [ ] Role can be combined with other roles (TRAINER, MANAGER, etc.)

### Section Visibility

- [ ] Learning Paths Approvals section appears for Decision Makers
- [ ] Section does NOT appear for non-Decision Makers
- [ ] Section title appears only once (no duplicates)
- [ ] NOTE text is removed (not displayed)

### Approval Display

- [ ] Empty state shows when no approvals
- [ ] Approval count badge appears when approvals exist
- [ ] Approval list displays correctly
- [ ] Each approval shows: name, email, learning path, date
- [ ] Review button is clickable

### Review Functionality

- [ ] Clicking "Review" shows alert (current)
- [ ] Alert contains correct approval information
- [ ] Card click also triggers review (future)

### Integration with Other Features

- [ ] Decision Maker can access all regular employee features
- [ ] Decision Maker can access Trainer features (if also Trainer)
- [ ] Decision Maker can access Management features (if also Manager)
- [ ] View-only mode works when viewing other profiles

### Edge Cases

- [ ] Handles missing `employeeId`
- [ ] Handles missing `companyId`
- [ ] Handles empty approvals array
- [ ] Handles API errors gracefully
- [ ] Handles network failures

---

## Future Enhancements

### Planned Features

1. **Learner AI Integration**
   - Replace mock data with real API calls
   - Redirect to Learner AI frontend for reviews
   - Real-time approval status updates

2. **Approval Actions**
   - Approve/Reject buttons in the UI
   - Add approval notes/comments
   - Email notifications to employees

3. **Filtering & Sorting**
   - Filter by employee name
   - Filter by learning path type
   - Sort by request date
   - Sort by priority

4. **Bulk Actions**
   - Select multiple approvals
   - Bulk approve/reject
   - Export approval list

5. **Analytics**
   - Approval statistics
   - Average review time
   - Approval rate trends

---

## Troubleshooting

### Section Not Appearing

**Issue**: Learning Paths Approvals section not visible

**Check**:
1. Employee has `DECISION_MAKER` role in `employee_roles` table
2. Role is included in `employee.roles` array
3. Component condition: `employee.roles.includes('DECISION_MAKER')`
4. No JavaScript errors in console

**Solution**:
```sql
-- Verify role exists
SELECT * FROM employee_roles 
WHERE employee_id = '{employee-uuid}' 
AND role_type = 'DECISION_MAKER';
```

### Approvals Not Loading

**Issue**: Empty state always shows, no approvals displayed

**Check**:
1. Mock data is defined in component
2. `fetchApprovals()` is being called
3. No errors in console
4. Component state is updating

**Solution**: Check browser console for errors, verify component is mounting correctly

### Review Button Not Working

**Issue**: Clicking "Review" does nothing

**Check**:
1. `handleViewApproval` function exists
2. Event handlers are properly attached
3. No JavaScript errors
4. Alert is showing (current implementation)

**Solution**: Check browser console, verify click events are firing

---

## Related Documentation

- [Employee Profile Documentation](./UPDATED-PROFILES-EMPLOYEE-PROFILE.md)
- [Company Profile Documentation](./UPDATED-PROFILES-COMPANY-PROFILE.md)
- [Features and Flows](./UPDATED-PROFILES-FEATURES-AND-FLOWS.md)
- [System Overview](./system-overview.md)

---

**End of Document**

