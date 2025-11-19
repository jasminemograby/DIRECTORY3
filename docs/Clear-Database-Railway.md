# Clear Database on Railway - Quick Guide

## Problem
Email conflicts when uploading CSV because employees already exist.

## Solution Options

---

## Option 1: Use Railway Database Console (Easiest)

### Step 1: Open Railway Database
1. Go to your Railway dashboard
2. Click on your PostgreSQL service
3. Click on the **"Data"** tab or **"Query"** tab

### Step 2: Run SQL Script
1. Copy the SQL from `database/scripts/clear_all_data.sql`
2. Paste it into the Railway SQL editor
3. Click **"Run"** or **"Execute"**

### Step 3: Verify
The script will show you remaining row counts. All should be 0.

### Step 4: Upload CSV
Now upload your new CSV file!

---

## Option 2: Use Railway CLI

### Step 1: Install Railway CLI (if not installed)
```bash
npm i -g @railway/cli
```

### Step 2: Login
```bash
railway login
```

### Step 3: Link to your project
```bash
railway link
```

### Step 4: Connect to database
```bash
railway connect postgres
```

### Step 5: Run SQL script
```bash
psql < database/scripts/clear_all_data.sql
```

Or copy-paste the SQL commands directly in the psql console.

---

## Option 3: Use Node.js Script (If DATABASE_URL is set)

### Step 1: Set DATABASE_URL
Make sure your `.env` file has:
```
DATABASE_URL=your_railway_database_url
```

Or set it in Railway environment variables.

### Step 2: Run script
```bash
node backend/src/scripts/clearDatabase.js
```

---

## Option 4: Quick SQL Commands (Copy-Paste)

If you just want to quickly clear everything, copy and paste this into Railway's SQL editor:

```sql
-- Clear all data
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

-- Verify (should all be 0)
SELECT 'companies' as table_name, COUNT(*) as count FROM companies
UNION ALL SELECT 'employees', COUNT(*) FROM employees
UNION ALL SELECT 'departments', COUNT(*) FROM departments
UNION ALL SELECT 'teams', COUNT(*) FROM teams;
```

---

## Recommended: Option 1 (Railway Database Console)

This is the easiest method:
1. ✅ No CLI needed
2. ✅ No environment variables needed
3. ✅ Direct access to database
4. ✅ See results immediately

Just go to Railway → Your PostgreSQL service → Data/Query tab → Paste SQL → Run!

---

## After Clearing

1. ✅ All tables are empty
2. ✅ No email conflicts
3. ✅ Ready to upload new CSV
4. ✅ Start fresh testing

---

## Need Help?

If you're still having issues:
1. Check Railway logs for any errors
2. Verify you have the correct database selected
3. Make sure you have write permissions
4. Try the quick SQL commands (Option 4) first

