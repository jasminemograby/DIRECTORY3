# Basic Profile Layout - Standard Documentation

This document defines the **standard "Basic Profile" layout** for employee profiles. This layout should be preserved and referenced if any issues occur in the future.

**Last Updated**: 2025-01-20  
**Status**: ✅ Locked as Standard

---

## Profile Structure

The basic profile is displayed in a card with the following sections in order:

### 1. Header Section
- **Profile Photo**: Circular image (24x24, rounded-full) or avatar initial
- **Employee Name**: Large heading (text-3xl, font-bold)
- **Current Role**: Subtitle showing `current_role_in_company`
- **Email**: Small text below role
- **Back Button**: Link to go back
- **Edit Profile Button**: Only visible when viewing own profile (`user?.id === employeeId`)

### 2. Basic Information Section
**Grid Layout**: 2 columns on medium+ screens, 1 column on mobile

**Fields Displayed** (in order):
1. **Email** - Employee email address
2. **Department** - Department name from database (via teams → departments join)
3. **Team** - Team name from database (via employee_teams → teams join)

**Note**: Employee ID is **NOT displayed** in the UI (removed per requirements).

### 3. Professional Links Section
**Conditional**: Only shown if `linkedin_url` or `github_url` exists

**Links**:
- **LinkedIn Profile**: External link to LinkedIn profile
  - URL validation: Ensures URL starts with `http` or `https`
  - Opens in new tab with `target="_blank"` and `rel="noopener noreferrer"`
- **GitHub Profile**: External link to GitHub profile
  - URL validation: Ensures URL starts with `http` or `https`
  - Opens in new tab with `target="_blank"` and `rel="noopener noreferrer"`

### 4. AI-Generated Bio Section
**Conditional**: Only shown if `employee.bio` exists

**Display**:
- **Title**: "Professional Bio"
- **Badge**: "AI-Enriched" badge (green) if `enrichment_completed === true`
- **Content**: Bio text displayed as paragraph with `leading-relaxed` styling

### 5. Value Proposition Section
**Conditional**: Only shown if `employee.value_proposition` exists

**Display**:
- **Title**: "Value Proposition"
- **Badge**: "AI-Enriched" badge (green) if `enrichment_completed === true`
- **Content**: Value proposition text with "READ MORE" link at the end of the last sentence
- **READ MORE Link**: 
  - Clickable text link (teal color, underlined)
  - Shows alert: "You are being redirected to the Skills Engine page."
  - Future: Will redirect to Skills Engine frontend

### 6. Projects & Contributions Section
**Conditional**: Only shown if `project_summaries` array has items

**Display**:
- **Title**: "Projects & Contributions"
- **Badge**: "AI-Enriched" badge (green) if `enrichment_completed === true`
- **Project Cards**: Each project summary displayed in a card with:
  - Repository name (bold)
  - "View on GitHub →" link if `repository_url` exists
  - Project summary text

### 7. Enrichment Status Message
**Conditional**: Only shown if `!enrichment_completed && (!employee.bio || projectSummaries.length === 0)`

**Display**:
- Yellow warning box
- Message: "Profile enrichment is in progress. Bio and project summaries will appear here once enrichment is complete."

---

## Data Sources

### Backend API Endpoint
**GET** `/api/v1/companies/:companyId/employees/:employeeId`

### Response Structure
```json
{
  "employee": {
    "id": "uuid",
    "employee_id": "string",
    "full_name": "string",
    "email": "string",
    "current_role_in_company": "string",
    "target_role_in_company": "string",
    "profile_photo_url": "string | null",
    "linkedin_url": "string | null",
    "github_url": "string | null",
    "bio": "string | null",
    "value_proposition": "string | null",
    "enrichment_completed": "boolean",
    "profile_status": "string",
    "department": "string | null",  // From database join
    "team": "string | null",        // From database join
    "project_summaries": [
      {
        "repository_name": "string",
        "repository_url": "string | null",
        "summary": "string"
      }
    ],
    "roles": ["string"],
    "is_trainer": "boolean",
    "is_decision_maker": "boolean"
  }
}
```

### Database Queries

**Department and Team Names**:
```sql
SELECT 
  d.department_name,
  t.team_name
FROM employees e
LEFT JOIN employee_teams et ON e.id = et.employee_id
LEFT JOIN teams t ON et.team_id = t.id
LEFT JOIN departments d ON t.department_id = d.id
WHERE e.id = $1
LIMIT 1
```

---

## Styling Standards

### Colors
- **Primary Text**: `var(--text-primary, #1e293b)`
- **Secondary Text**: `var(--text-secondary, #64748b)`
- **Muted Text**: `var(--text-muted, #94a3b8)`
- **Links**: `text-teal-600 hover:text-teal-700`
- **Card Background**: `var(--gradient-card)`
- **Card Border**: `var(--border-default)`
- **Card Shadow**: `var(--shadow-card)`

### Spacing
- **Section Margin Bottom**: `mb-6` (24px)
- **Title Margin Bottom**: `mb-4` (16px)
- **Grid Gap**: `gap-4` (16px)

### Typography
- **Page Title**: `text-3xl font-bold`
- **Section Title**: `text-xl font-semibold`
- **Body Text**: `leading-relaxed`

---

## Profile Status Messages

### Enriched (Pending Approval)
- **Color**: Yellow/Amber
- **Message**: "⏳ Waiting for HR Approval - Your profile has been enriched and is pending HR review."

### Approved
- **Color**: Green
- **Message**: "✓ Profile Approved - Your profile has been approved by HR. You can now use all system features."

### Rejected
- **Color**: Red
- **Message**: "❌ Profile Rejected - Your enriched profile has been rejected by HR. Please contact HR for more information."

---

## Conditional Sections

### Approved Employee Features
**Visible when**: `profile_status === 'approved'`

**Sections**:
- Skills Section
- Courses Section
- Learning Path Section
- Dashboard Section
- Requests Section

### Learning Path Approvals
**Visible when**: Employee has `DECISION_MAKER` role

### Trainer Sections
**Visible when**: `employee.is_trainer === true`

**Sections**:
- Trainer Settings
- Courses Taught

---

## URL Validation

### LinkedIn URL
- **Validation**: Checks if URL exists and is not string "undefined"
- **Format Fix**: If URL doesn't start with `http` or `https`, prepends `https://`
- **Display**: Only shown if valid URL exists

### GitHub URL
- **Validation**: Checks if URL exists and is not string "undefined"
- **Format Fix**: If URL doesn't start with `http` or `https`, prepends `https://`
- **Display**: Only shown if valid URL exists

---

## Important Notes

1. **Employee ID**: Removed from UI display (not shown to users)
2. **Department/Team**: Fetched from database via JOIN queries, not from employee table directly
3. **LinkedIn URL**: Validated and formatted before display to prevent "undefined" links
4. **Profile Layout**: This is the standard layout - any changes should be documented here
5. **Enrichment Status**: Only shown when enrichment is incomplete

---

## File Locations

- **Frontend Component**: `frontend/src/pages/EmployeeProfilePage.js`
- **Backend Controller**: `backend/src/presentation/EmployeeController.js`
- **Backend Repository**: `backend/src/infrastructure/EmployeeRepository.js`

---

## Testing Checklist

- [ ] Profile photo displays correctly (or shows avatar initial)
- [ ] Employee name and role display correctly
- [ ] Email displays correctly
- [ ] Department name displays from database (not N/A)
- [ ] Team name displays from database (not N/A)
- [ ] Employee ID is NOT displayed
- [ ] LinkedIn link works and goes to correct profile
- [ ] GitHub link works and goes to correct profile
- [ ] Bio displays if available
- [ ] Value Proposition displays with READ MORE at end
- [ ] Project summaries display if available
- [ ] Enrichment status messages display correctly
- [ ] Conditional sections (approved features, trainer, etc.) show/hide correctly

---

**This layout is locked as the standard. Any modifications should update this documentation.**

