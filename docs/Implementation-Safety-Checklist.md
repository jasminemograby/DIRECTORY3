# Implementation Safety Checklist

## Critical Rules to Follow

### 1. Profile Status & Access Control
- ✅ Profile sections (Skills, Courses, Dashboard, Requests, Learning Path) **MUST only be visible when `profile_status === 'approved'`**
- ✅ Employees with `profile_status === 'enriched'` should see "Waiting for HR Approval" message
- ✅ Employees with `profile_status === 'basic'` should be redirected to enrichment page
- ✅ Never break the existing profile status flow: `basic` → `enriched` → `approved`

### 2. Enrichment Flow
- ✅ Enrichment is **one-time only** - cannot reconnect LinkedIn/GitHub after enrichment
- ✅ Both LinkedIn and GitHub must be connected before enrichment
- ✅ After enrichment, approval request is automatically created
- ✅ Never allow re-enrichment or re-sync after completion

### 3. HR Approval Workflow
- ✅ HR employees see Company Profile on login (not employee profile)
- ✅ Pending approvals appear in Company Profile "Pending Requests" tab
- ✅ Only HR can approve/reject enriched profiles
- ✅ After approval, employee profile_status changes to 'approved'

### 4. Microservice Integration
- ✅ **ALWAYS use envelope structure**: `{ requester_service, payload, response }`
- ✅ **ALWAYS stringify** requests and responses
- ✅ **ALWAYS implement fallback** to mock data on API failure
- ✅ Use universal endpoints: `/api/fill-content-metrics` (except Learner AI: `/api/fill-learner-ai-fields`)

### 5. Database & Migrations
- ✅ **Single migration file policy** - all changes go in `001_initial_schema.sql`
- ✅ Never create new migration files
- ✅ Always check existing schema before adding fields

### 6. Design System
- ✅ **ALWAYS use design tokens** from `design-tokens.json`
- ✅ Use CSS variables for colors, spacing, typography
- ✅ Header must use logo (logo1 for dark mode, logo2 for light mode)
- ✅ Logo must be on the left side

### 7. Authentication & Authorization
- ✅ Dummy auth mode for testing (clearly labeled)
- ✅ HR detection based on `hr_contact_email` matching employee email
- ✅ Token-based authentication for protected routes
- ✅ Never bypass authentication checks

### 8. Error Handling
- ✅ All API calls must have try-catch with fallback
- ✅ All database operations must handle errors gracefully
- ✅ User-friendly error messages
- ✅ Log errors for debugging

### 9. Backward Compatibility
- ✅ Never remove existing endpoints without deprecation
- ✅ Never change existing response formats without versioning
- ✅ Always test existing features after adding new ones
- ✅ Maintain existing database schema compatibility

### 10. CSV & Company Registration
- ✅ HR contact email from registration form must be in CSV
- ✅ All required fields must be validated
- ✅ Company settings (passing_grade, max_attempts, exercises_limited, num_of_exercises) must be in CSV
- ✅ Decision Maker must exist if approval_policy is 'manual'

## Testing Checklist Before Committing

- [ ] Test employee login flow (basic → enriched → approved)
- [ ] Test HR login (should see Company Profile)
- [ ] Test enrichment flow (LinkedIn + GitHub → enrichment → approval request)
- [ ] Test HR approval workflow
- [ ] Test profile sections visibility (only when approved)
- [ ] Test microservice calls with fallback
- [ ] Test error handling
- [ ] Test existing features still work
- [ ] Test design tokens are applied correctly
- [ ] Test responsive design

