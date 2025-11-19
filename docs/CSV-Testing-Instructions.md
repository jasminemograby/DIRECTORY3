# CSV Testing Instructions

## 📋 Test CSV File: `test_company_complete.csv`

This CSV file includes all required fields and is ready for testing.

### Company Information

- **Company Name**: TechFlow Solutions
- **Industry**: Technology
- **Domain**: techflow.io
- **HR Contact**: Sarah Johnson (sarah.johnson@techflow.io)
- **Company Logo**: Placeholder image URL (will display as circular logo)

### Company Settings

- **max_attempts**: 3
- **passing_grade**: 70
- **exercises_limited**: true
- **num_of_exercises**: 10
- **approval_policy**: manual
- **KPIs**: "Employee Growth: 15% annually, Training Completion: 90%, Skill Development: 80%"

### Employees Included (10 employees)

1. **Sarah Johnson** (sarah.johnson@techflow.io)
   - Role: REGULAR_EMPLOYEE + DECISION_MAKER
   - Department: IT / Development Team
   - **This is the HR contact - can log in to see Company Profile**
   - **This is also the Decision Maker - can approve learning paths**

2. **Michael Chen** (michael.chen@techflow.io)
   - Role: REGULAR_EMPLOYEE
   - Department: IT / Development Team
   - Manager: Sarah Johnson
   - **Use for testing regular employee flow**

3. **Emma Thompson** (emma.thompson@techflow.io)
   - Role: REGULAR_EMPLOYEE
   - Department: IT / Development Team
   - Manager: Sarah Johnson
   - **Use for testing regular employee flow**

4. **David Rodriguez** (david.rodriguez@techflow.io)
   - Role: TRAINER
   - Department: IT / Backend Team
   - Manager: Sarah Johnson
   - **Use for testing trainer features**

5. **Jennifer Martinez** (jennifer.martinez@techflow.io)
   - Role: REGULAR_EMPLOYEE
   - Department: IT / Backend Team
   - Manager: David Rodriguez
   - **Use for testing regular employee flow**

6. **Robert Kim** (robert.kim@techflow.io)
   - Role: TEAM_MANAGER
   - Department: IT / Development Team
   - Manager: Sarah Johnson
   - **Use for testing team manager features**

7. **Lisa Anderson** (lisa.anderson@techflow.io)
   - Role: REGULAR_EMPLOYEE
   - Department: IT / Development Team
   - Manager: Robert Kim
   - **Use for testing regular employee flow**

8. **James Wilson** (james.wilson@techflow.io)
   - Role: REGULAR_EMPLOYEE
   - Department: Sales / Sales Team
   - No manager
   - **Use for testing employee without manager**

9. **Patricia Miller** (patricia.miller@techflow.io)
   - Role: REGULAR_EMPLOYEE
   - Department: IT / Development Team
   - Manager: Robert Kim
   - **Use for testing regular employee flow**

10. **Christopher Lee** (christopher.lee@techflow.io)
    - Role: REGULAR_EMPLOYEE
    - Department: IT / Backend Team
    - Manager: David Rodriguez
    - **Use for testing regular employee flow**

### All Passwords

All employees have the same password for testing: **`password123`**

---

## 🚀 Testing Steps

### Step 1: Company Registration

1. Go to registration page
2. Fill in:
   - **Company Name**: TechFlow Solutions
   - **Industry**: Technology
   - **Domain**: techflow.io
   - **HR Contact Name**: Sarah Johnson
   - **HR Contact Email**: sarah.johnson@techflow.io ⚠️ **IMPORTANT**
   - **HR Contact Role**: HR Director
3. Click "Register Company"
4. You'll be redirected to CSV upload page

### Step 2: Upload CSV

1. Click "Choose File"
2. Select `test_company_complete.csv`
3. Click "Upload CSV"
4. Wait for processing
5. Review any validation messages
6. Click "Continue" to go to Company Profile

### Step 3: Verify Company Profile

Check that you see:
- ✅ Company logo (circular placeholder with "TF")
- ✅ Company name: "TechFlow Solutions"
- ✅ Industry: "Technology"
- ✅ All tabs: Overview, Hierarchy, Dashboard, Employees, Enroll to Courses, Requests, Approvals
- ✅ Company settings visible
- ✅ 10 employees listed
- ✅ 2 departments (IT, Sales)
- ✅ 3 teams (Development Team, Backend Team, Sales Team)

### Step 4: Test HR Login

1. Log out (if logged in)
2. Log in with:
   - **Email**: sarah.johnson@techflow.io
   - **Password**: password123
3. Should redirect to **Company Profile** (not employee profile)
4. Check "Pending Requests" tab - should be empty initially
5. Check "Employees" tab - should see all 10 employees

### Step 5: Test Regular Employee Login (Basic Profile)

1. Log out
2. Log in with:
   - **Email**: michael.chen@techflow.io
   - **Password**: password123
3. Should redirect to **Enrichment Page**
4. Connect LinkedIn (OAuth flow)
5. Connect GitHub (OAuth flow)
6. After both connected, should redirect to profile page
7. Should see: "⏳ Waiting for HR Approval"
8. Should NOT see: Skills, Courses, Learning Path, Dashboard, Requests sections

### Step 6: Test HR Approval

1. Log out
2. Log in as HR (sarah.johnson@techflow.io)
3. Go to "Pending Requests" tab
4. Should see Michael Chen's profile approval request
5. Click "Approve"
6. Profile status changes to "approved"

### Step 7: Test Approved Employee

1. Log out
2. Log in as Michael Chen (michael.chen@techflow.io)
3. Should redirect directly to Employee Profile (no enrichment page)
4. Should see: "✓ Profile Approved"
5. Should see ALL sections:
   - ✅ Skills (from Skills Engine)
   - ✅ Courses (from Course Builder)
   - ✅ Learning Path (from Learner AI)
   - ✅ Dashboard (from Learning Analytics)
   - ✅ Requests (can submit)
6. Click "Edit Profile" - should be able to edit

### Step 8: Test Trainer Features

1. Log out
2. Log in with:
   - **Email**: david.rodriguez@techflow.io
   - **Password**: password123
3. Complete enrichment (connect LinkedIn & GitHub)
4. Get HR approval
5. Should see:
   - ✅ All regular employee features
   - ✅ **Trainer Settings** tab
   - ✅ **Courses Taught** tab

### Step 9: Test Decision Maker Features

1. Log out
2. Log in as HR (sarah.johnson@techflow.io) - who is also Decision Maker
3. Go to Employee Profile (click on Sarah's profile)
4. Should see:
   - ✅ All regular employee features
   - ✅ **Learning Paths Approvals** tab
   - ✅ Can see pending learning path approvals

---

## 📝 Notes

- **HR Email**: Must use `sarah.johnson@techflow.io` for company registration
- **Company Logo**: Uses placeholder URL - will display as circular logo
- **All Passwords**: `password123` for easy testing
- **Manager Relationships**: Some employees have managers, some don't (tests both cases)
- **Multiple Roles**: Sarah has both REGULAR_EMPLOYEE and DECISION_MAKER roles
- **Different Departments**: IT and Sales departments for hierarchy testing

---

## 🐛 Troubleshooting

If you encounter issues:

1. **HR Cannot Login**
   - Verify `sarah.johnson@techflow.io` is in the CSV
   - Check that CSV was uploaded successfully

2. **Company Logo Not Showing**
   - The placeholder URL should work, but if not, you can replace it with any valid image URL
   - Or remove the `company_logo` field to test placeholder with first letter

3. **Employee Cannot See Skills/Courses**
   - Ensure profile is approved by HR
   - Check `profile_status` in database should be `'approved'`

4. **Enrichment Page Keeps Appearing**
   - Check that both LinkedIn and GitHub are connected
   - Verify `enrichment_completed` flag is true in database

---

## ✅ Expected Results

After uploading this CSV, you should have:
- ✅ 1 company (TechFlow Solutions)
- ✅ 2 departments (IT, Sales)
- ✅ 3 teams (Development Team, Backend Team, Sales Team)
- ✅ 10 employees with various roles
- ✅ Company settings configured
- ✅ Company logo displayed
- ✅ Hierarchy structure visible
- ✅ Ready for end-to-end testing

Good luck with testing! 🚀

