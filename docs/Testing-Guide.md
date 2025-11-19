# Testing Guide - Company Registration & User Role-Based Access

## ✅ Latest Updates Pushed

All latest changes have been committed and pushed to the repository:
- Profile Edit functionality
- Employee Requests system
- Universal endpoint with AI query generation
- Merged migration files

---

## 🏢 Test Scenario 1: Company Registration & Profile

### Step 1: Company Registration

1. **Navigate to Registration Page**
   - Go to `/register` or click "Register Company"
   - Fill in the registration form:
     - **Company Name**: e.g., "TechFlow Solutions"
     - **Industry**: e.g., "Technology"
     - **Domain**: e.g., "techflow.io"
     - **HR Contact Name**: e.g., "John Smith"
     - **HR Contact Email**: e.g., "hr@techflow.io" (⚠️ **IMPORTANT**: This email must be in the CSV file!)
     - **HR Contact Role**: e.g., "HR Manager"

2. **Submit Registration**
   - Click "Register Company"
   - You should be redirected to CSV upload page
   - Note the `companyId` from the URL

### Step 2: CSV Upload

1. **Prepare CSV File**
   - CSV must include the HR contact email from registration
   - Required company settings fields:
     - `max_attempts`: e.g., 3
     - `passing_grade`: e.g., 70
     - `exercises_limited`: true or false
     - `num_of_exercises`: Required if `exercises_limited` is true
   - Optional: `company_logo`: URL to company logo image
   - Required employee fields:
     - `employee_id`, `full_name`, `email`, `role_type`
     - `department_id`, `department_name`, `team_id`, `team_name`
     - `manager_id` (use empty string if no manager)
     - `password`, `preferred_language`, `status`
     - `current_role_in_company`, `target_role_in_company`
   - ⚠️ **CRITICAL**: The HR email from registration MUST be in the CSV as an employee!

2. **Upload CSV**
   - Click "Choose File" and select your CSV
   - Click "Upload CSV"
   - Wait for processing
   - Review any validation errors
   - Click "Continue" after successful upload

3. **Verify Company Profile**
   - Should redirect to Company Profile page
   - Check that all fields are displayed:
     - ✅ Company logo (circular, or placeholder with first letter)
     - ✅ Company name, industry, domain
     - ✅ HR contact information
     - ✅ Company settings (max_attempts, passing_grade, etc.)
     - ✅ KPIs (if provided)
     - ✅ Departments, Teams, Employees
     - ✅ Hierarchy view
     - ✅ Pending Approvals tab

### Step 3: Verify Company Profile Fields

**Expected Company Profile Display:**

1. **Header Section**
   - Company logo (circular image or placeholder)
   - Company name
   - Industry
   - Domain

2. **Dashboard Tabs**
   - **Overview**: Company metrics, departments, teams
   - **Hierarchy**: Organizational chart (no clickable employee names)
   - **Employees**: List with filter, sort, search
   - **Pending Requests**: Profile approval requests
   - **Settings**: Company settings (if implemented)

3. **Company Settings (from CSV)**
   - `max_attempts`: Displayed in settings
   - `passing_grade`: Displayed in settings
   - `exercises_limited`: Displayed in settings
   - `num_of_exercises`: Displayed if `exercises_limited` is true

4. **KPIs**
   - Displayed if provided in CSV
   - Default: "Not specified" if not provided

---

## 👤 Test Scenario 2: User Login & Role-Based Access

### Role Types

The system supports these roles:
- `REGULAR_EMPLOYEE`: Standard employee
- `TRAINER`: Can teach courses
- `TEAM_MANAGER`: Manages a team
- `DEPARTMENT_MANAGER`: Manages a department
- `DECISION_MAKER`: Approves learning paths (single employee per company)

### Profile Status Flow

1. **`basic`**: Initial state after CSV upload
2. **`enriched`**: After connecting LinkedIn & GitHub
3. **`approved`**: After HR approves the enriched profile
4. **`rejected`**: If HR rejects the profile

---

## 🔐 Test Case 1: HR Employee Login

### Setup
- Use the HR email from company registration (must be in CSV)
- Password from CSV

### Expected Behavior

1. **Login**
   - Log in with HR email and password
   - Should redirect to **Company Profile** (not employee profile)
   - HR sees company-level view

2. **Company Profile Access**
   - ✅ Can view all company information
   - ✅ Can see all employees
   - ✅ Can see pending profile approval requests
   - ✅ Can approve/reject employee profiles
   - ✅ Can add new employees (manual or CSV)
   - ✅ Can view hierarchy

3. **Pending Approvals Tab**
   - Shows employees with `profile_status = 'enriched'`
   - Can approve or reject profiles
   - After approval, employee's `profile_status` becomes `'approved'`

---

## 👨‍💼 Test Case 2: Regular Employee Login (Basic Profile)

### Setup
- Use any regular employee email from CSV
- Password from CSV
- Employee with `profile_status = 'basic'`

### Expected Behavior

1. **First Login**
   - Log in with employee email and password
   - Should redirect to **Enrichment Page** (one-time mandatory process)
   - Message: "Please connect your LinkedIn and GitHub accounts to enrich your profile"

2. **Enrichment Page**
   - Two buttons: "Connect LinkedIn" and "Connect GitHub"
   - Order doesn't matter
   - Click "Connect LinkedIn":
     - Redirects to LinkedIn OAuth
     - After authorization, redirects back to Enrichment Page
     - Shows green checkmark: "✓ LinkedIn connected successfully!"
     - Button becomes disabled
   - Click "Connect GitHub":
     - Redirects to GitHub OAuth
     - After authorization, redirects back to Enrichment Page
     - Shows green checkmark: "✓ GitHub connected successfully!"
     - Button becomes disabled
   - After BOTH are connected:
     - Data is merged and sent to Gemini AI
     - Profile is enriched (bio, project summaries)
     - `profile_status` changes to `'enriched'`
     - Redirects to Employee Profile Page
     - Shows: "⏳ Waiting for HR Approval"

3. **Profile Page (Enriched, Not Approved)**
   - ✅ Can see basic information
   - ✅ Can see enriched bio (AI-generated)
   - ✅ Can see project summaries (AI-generated)
   - ✅ Can see profile photo (from LinkedIn, fallback to GitHub)
   - ❌ **CANNOT** see:
     - Skills section
     - Courses section
     - Learning Path section
     - Dashboard section
     - Requests section
   - ✅ Can see "Edit Profile" button (own profile only)
   - Message: "Your profile has been enriched and is pending HR review"

---

## ✅ Test Case 3: Regular Employee Login (Approved Profile)

### Setup
- Use employee email from CSV
- Employee with `profile_status = 'approved'` (after HR approval)

### Expected Behavior

1. **Login**
   - Log in with employee email and password
   - Should redirect directly to **Employee Profile Page** (no enrichment page)

2. **Profile Page (Approved)**
   - ✅ Can see all basic information
   - ✅ Can see enriched bio and project summaries
   - ✅ Can see profile photo
   - ✅ **CAN** see and use:
     - **Skills Section**: Fetches from Skills Engine microservice
     - **Courses Section**: Fetches from Course Builder microservice
     - **Learning Path Section**: Fetches from Learner AI microservice
     - **Dashboard Section**: Fetches from Learning Analytics microservice
     - **Requests Section**: Can submit requests (learn new skills, apply trainer, self-learning)
   - ✅ Can edit own profile (Edit Profile button)
   - Message: "✓ Profile Approved - You can now use all system features"

3. **Edit Profile**
   - Click "Edit Profile" button
   - Form appears with current values
   - Can edit:
     - Full name, email
     - Current role, target role
     - Preferred language
     - Bio, LinkedIn URL, GitHub URL
   - Click "Save Changes"
   - Profile updates and form closes

4. **Requests**
   - Can submit new requests
   - Can view existing requests and their status
   - Request types:
     - Learn New Skills
     - Apply for Trainer Role
     - Self-Learning Request
     - Other Request

---

## 🎓 Test Case 4: Trainer Employee Login

### Setup
- Use employee email with `role_type` including `TRAINER`
- Employee with `profile_status = 'approved'`

### Expected Behavior

1. **Login**
   - Same as regular employee (approved)

2. **Profile Page**
   - ✅ All regular employee features
   - ✅ **Additional Trainer Features**:
     - **Trainer Settings Tab**:
       - AI Enabled toggle
       - Public Publish Enable toggle
     - **Courses Taught Tab**:
       - List of courses the trainer is teaching
       - Fetches from Content Studio microservice

---

## 📊 Test Case 5: Decision Maker Employee Login

### Setup
- Use employee email with `role_type` including `DECISION_MAKER`
- Employee with `profile_status = 'approved'`
- This employee is declared as `decision_maker` in company CSV

### Expected Behavior

1. **Login**
   - Same as regular employee (approved)

2. **Profile Page**
   - ✅ All regular employee features
   - ✅ **Additional Decision Maker Features**:
     - **Learning Paths Approvals Tab**:
       - Shows number of pending approvals (e.g., "4 waiting approvals")
       - List of learning path requests from employees
       - Can click to view/approve (redirects to Learner AI frontend or shows mock data)

3. **Important Note**
   - Only the single Decision Maker sees this tab
   - Other employees do NOT see learning path approvals
   - Learning path approvals are NOT shown in Company Profile

---

## 🔍 Test Case 6: Employee Login (Rejected Profile)

### Setup
- Use employee email
- Employee with `profile_status = 'rejected'`

### Expected Behavior

1. **Login**
   - Redirects to Employee Profile Page

2. **Profile Page**
   - ❌ **CANNOT** see:
     - Skills, Courses, Learning Path, Dashboard, Requests
   - Message: "❌ Profile Rejected - Your enriched profile has been rejected by HR. Please contact HR for more information."
   - ✅ Can still edit basic profile information

---

## 📝 Testing Checklist

### Company Registration
- [ ] Company registration form works
- [ ] HR email is saved correctly
- [ ] Redirects to CSV upload page
- [ ] Company ID is generated

### CSV Upload
- [ ] CSV validation works
- [ ] HR email is in CSV (required)
- [ ] Company settings are saved (max_attempts, passing_grade, etc.)
- [ ] Company logo is displayed (if provided)
- [ ] All employees are created
- [ ] Departments and teams are created
- [ ] Redirects to Company Profile after upload

### Company Profile
- [ ] Company logo displays (circular or placeholder)
- [ ] All company fields are visible
- [ ] Hierarchy tab shows org chart
- [ ] Employees tab has filter/sort/search
- [ ] Pending Requests tab shows enriched profiles
- [ ] HR can approve/reject profiles

### Employee Login - Basic
- [ ] Redirects to Enrichment Page
- [ ] Can connect LinkedIn
- [ ] Can connect GitHub
- [ ] Both connections work
- [ ] Profile is enriched after both connections
- [ ] Redirects to profile page
- [ ] Shows "Waiting for HR Approval" message

### Employee Login - Enriched (Not Approved)
- [ ] Redirects to profile page (no enrichment page)
- [ ] Can see basic info and enriched content
- [ ] Cannot see Skills, Courses, Learning Path, Dashboard, Requests
- [ ] Can edit profile

### Employee Login - Approved
- [ ] Redirects to profile page
- [ ] Can see all sections (Skills, Courses, Learning Path, Dashboard, Requests)
- [ ] Skills section loads from Skills Engine
- [ ] Courses section loads from Course Builder
- [ ] Learning Path section loads from Learner AI
- [ ] Dashboard section loads from Learning Analytics
- [ ] Can submit requests
- [ ] Can edit profile

### Trainer Features
- [ ] Trainer Settings tab visible
- [ ] Courses Taught tab visible
- [ ] Trainer settings can be updated

### Decision Maker Features
- [ ] Learning Paths Approvals tab visible
- [ ] Shows pending approvals count
- [ ] Only Decision Maker sees this tab

### Profile Edit
- [ ] Edit Profile button visible (own profile only)
- [ ] Form loads with current values
- [ ] Validation works
- [ ] Save updates profile
- [ ] Cancel closes form

---

## 🐛 Common Issues to Check

1. **HR Cannot Login**
   - ⚠️ **Issue**: HR email not in CSV
   - **Fix**: Ensure HR email from registration is included in CSV as an employee

2. **Employee Stuck on Enrichment Page**
   - ⚠️ **Issue**: LinkedIn/GitHub already connected but still showing enrichment page
   - **Fix**: Check `enrichment_completed` flag in database

3. **Approved Employee Cannot See Skills/Courses**
   - ⚠️ **Issue**: `profile_status` is not `'approved'`
   - **Fix**: HR must approve the profile in Company Profile → Pending Requests

4. **Company Logo Not Showing**
   - ⚠️ **Issue**: Logo URL invalid or not provided
   - **Fix**: Check `logo_url` in CSV, ensure URL is accessible

5. **Missing Company Settings**
   - ⚠️ **Issue**: Required fields not in CSV
   - **Fix**: Ensure `max_attempts`, `passing_grade`, `exercises_limited` are in CSV

---

## 📞 Support

If you encounter issues:
1. Check Railway logs for backend errors
2. Check browser console for frontend errors
3. Verify database state (profile_status, enrichment_completed)
4. Check environment variables (GEMINI_API_KEY, OAuth credentials)

---

## 🎯 Next Steps After Testing

1. Verify all test cases pass
2. Document any bugs or issues
3. Test edge cases (empty CSV, invalid data, etc.)
4. Test with multiple companies and employees
5. Verify microservice integrations (Skills Engine, Course Builder, etc.)

