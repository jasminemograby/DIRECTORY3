# Clear Database in Supabase - Step by Step

## ✅ Yes! You can run the SQL script directly in Supabase

Supabase has a built-in SQL Editor that makes this very easy.

---

## Step-by-Step Instructions

### Step 1: Open Supabase Dashboard
1. Go to [https://supabase.com](https://supabase.com)
2. Log in to your account
3. Select your project (the one connected to Directory)

### Step 2: Open SQL Editor
1. In the left sidebar, click on **"SQL Editor"**
2. Click **"New query"** button (top right)

### Step 3: Copy and Paste the SQL Script
1. Open the file: `database/scripts/clear_all_data.sql`
2. Copy **ALL** the SQL code
3. Paste it into the Supabase SQL Editor

Or copy this directly:

```sql
-- Clear all data from the database
-- This will delete all companies, employees, and related data
-- Use with caution - this is irreversible!

-- Delete employee requests (depends on employees)
DELETE FROM employee_requests;

-- Delete employee profile approvals (depends on employees and companies)
DELETE FROM employee_profile_approvals;

-- Delete trainer settings (depends on employees)
DELETE FROM trainer_settings;

-- Delete employee project summaries (depends on employees)
DELETE FROM employee_project_summaries;

-- Delete employee roles (depends on employees)
DELETE FROM employee_roles;

-- Delete employee teams (depends on employees and teams)
DELETE FROM employee_teams;

-- Delete employee managers (depends on employees)
DELETE FROM employee_managers;

-- Delete audit logs (depends on companies and employees)
DELETE FROM audit_logs;

-- Delete employees (depends on companies)
DELETE FROM employees;

-- Delete teams (depends on departments and companies)
DELETE FROM teams;

-- Delete departments (depends on companies)
DELETE FROM departments;

-- Delete company registration requests
DELETE FROM company_registration_requests;

-- Delete companies (this will cascade delete remaining dependencies)
DELETE FROM companies;

-- Verify deletion (should all be 0)
SELECT 
    'companies' as table_name, COUNT(*) as remaining_rows FROM companies
UNION ALL
SELECT 'employees', COUNT(*) FROM employees
UNION ALL
SELECT 'departments', COUNT(*) FROM departments
UNION ALL
SELECT 'teams', COUNT(*) FROM teams
UNION ALL
SELECT 'employee_roles', COUNT(*) FROM employee_roles
UNION ALL
SELECT 'employee_requests', COUNT(*) FROM employee_requests
UNION ALL
SELECT 'employee_profile_approvals', COUNT(*) FROM employee_profile_approvals;
```

### Step 4: Run the Query
1. Click the **"Run"** button (or press `Ctrl+Enter` / `Cmd+Enter`)
2. Wait for execution to complete
3. Check the results at the bottom

### Step 5: Verify
You should see a table with results like this:

| table_name | remaining_rows |
|------------|----------------|
| companies  | 0              |
| employees  | 0              |
| departments| 0              |
| teams      | 0              |
| employee_roles | 0          |
| employee_requests | 0       |
| employee_profile_approvals | 0 |

**All counts should be 0!** ✅

### Step 6: Upload Your CSV
Now you can upload your new CSV file without email conflicts!

---

## Visual Guide

```
Supabase Dashboard
├── SQL Editor (left sidebar)
│   ├── Click "New query"
│   ├── Paste SQL script
│   ├── Click "Run" button
│   └── See results (all should be 0)
```

---

## ⚠️ Important Notes

1. **This is irreversible!** All data will be permanently deleted.
2. Make sure you're connected to the correct Supabase project.
3. The verification query at the end will show you if everything was deleted.
4. If you see any errors, check:
   - Are you connected to the right database?
   - Do you have the correct permissions?
   - Are the table names correct?

---

## Troubleshooting

### Error: "relation does not exist"
- Make sure you've run the migration `001_initial_schema.sql` first
- Check that you're in the correct database/project

### Error: "permission denied"
- Make sure you're logged in as the project owner
- Check your database user permissions

### Some tables still have rows
- Check the verification query results
- If some tables still have data, there might be a foreign key constraint issue
- Try running the DELETE statements one by one

---

## Quick Copy-Paste Version

If you just want to quickly clear everything, use this:

```sql
DELETE FROM employee_requests;
DELETE FROM employee_profile_approvals;
DELETE FROM trainer_settings;
DELETE FROM employee_project_summaries;
DELETE FROM employee_roles;
DELETE FROM employee_teams;
DELETE FROM employee_managers;
DELETE FROM audit_logs;
DELETE FROM employees;
DELETE FROM teams;
DELETE FROM departments;
DELETE FROM company_registration_requests;
DELETE FROM companies;
```

Then verify:
```sql
SELECT 'companies' as table_name, COUNT(*) FROM companies
UNION ALL SELECT 'employees', COUNT(*) FROM employees
UNION ALL SELECT 'departments', COUNT(*) FROM departments
UNION ALL SELECT 'teams', COUNT(*) FROM teams;
```

---

## After Clearing

1. ✅ All tables are empty
2. ✅ No email conflicts
3. ✅ Ready to upload new CSV
4. ✅ Start fresh testing

That's it! Supabase SQL Editor is the easiest way to do this. 🚀

