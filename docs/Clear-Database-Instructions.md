# Clear Database Instructions

## Problem
You're getting email conflicts when uploading a CSV because employees with those emails already exist in the database from previous testing.

## Solution
Clear all existing data from the database before uploading the new CSV.

---

## Method 1: Using Node.js Script (Recommended)

### Step 1: Run the Clear Script

```bash
node backend/src/scripts/clearDatabase.js
```

This script will:
- ✅ Delete all companies, employees, departments, teams
- ✅ Delete all related data (roles, requests, approvals, etc.)
- ✅ Verify that all tables are empty
- ✅ Show you a summary of what was deleted

### Step 2: Verify

The script will show you a verification report. All counts should be 0.

### Step 3: Upload CSV

Now you can upload your new CSV file without email conflicts.

---

## Method 2: Using SQL Script (Alternative)

### Step 1: Connect to Your Database

If you're using Supabase or PostgreSQL directly:

1. Open your database admin panel (Supabase Dashboard, pgAdmin, etc.)
2. Navigate to SQL Editor

### Step 2: Run the SQL Script

Copy and paste the contents of `database/scripts/clear_all_data.sql` into the SQL editor and execute it.

### Step 3: Verify

The script will show you remaining row counts. All should be 0.

### Step 4: Upload CSV

Now you can upload your new CSV file.

---

## Method 3: Using Railway CLI (If using Railway)

If your database is on Railway:

1. Get your database connection string from Railway
2. Connect using psql or a database client
3. Run the SQL script from `database/scripts/clear_all_data.sql`

---

## What Gets Deleted

The script deletes data from these tables (in order):
1. `employee_requests`
2. `employee_profile_approvals`
3. `trainer_settings`
4. `employee_project_summaries`
5. `employee_roles`
6. `employee_teams`
7. `employee_managers`
8. `audit_logs`
9. `employees`
10. `teams`
11. `departments`
12. `company_registration_requests`
13. `companies`

---

## ⚠️ Warning

**This operation is irreversible!** All data will be permanently deleted. Make sure you want to clear everything before running the script.

---

## After Clearing

1. ✅ Database is empty
2. ✅ No email conflicts
3. ✅ Ready to upload new CSV
4. ✅ Start fresh testing

---

## Troubleshooting

### Error: "relation does not exist"
- Make sure you've run the migration: `001_initial_schema.sql`
- Check that your database connection is correct

### Error: "permission denied"
- Make sure your database user has DELETE permissions
- Check your database connection credentials

### Script doesn't run
- Make sure Node.js is installed
- Check that `dotenv` is installed: `npm install dotenv`
- Verify `DATABASE_URL` is set in your `.env` file

---

## Quick Command

```bash
# From project root
node backend/src/scripts/clearDatabase.js
```

That's it! Your database will be cleared and ready for a fresh CSV upload.

