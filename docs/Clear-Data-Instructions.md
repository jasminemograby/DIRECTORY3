# Clear All Data Instructions

This document explains how to clear all companies and employees data from the database for testing purposes.

## ⚠️ WARNING

**This will delete ALL data from the database!** Use only for testing/development purposes.

---

## Method 1: Using SQL Script (Recommended for Supabase)

### Steps:

1. **Open Supabase SQL Editor**
   - Go to your Supabase project dashboard
   - Navigate to "SQL Editor"
   - Click "New Query"

2. **Copy and paste the SQL script**
   - Open `scripts/clear-all-data.sql`
   - Copy all the SQL commands
   - Paste into the SQL Editor

3. **Run the script**
   - Click "Run" or press `Ctrl+Enter` (Windows) / `Cmd+Enter` (Mac)
   - Wait for the script to complete

4. **Verify deletion**
   - The script will show counts of remaining records
   - All counts should be `0` if deletion was successful

---

## Method 2: Using Node.js Script (For Local Development)

### Prerequisites:
- Node.js installed
- Database connection configured in `backend/src/config.js`

### Steps:

1. **Navigate to project root**
   ```bash
   cd DIRECTORY3
   ```

2. **Run the script**
   ```bash
   node scripts/clear-all-data.js
   ```

3. **Verify output**
   - The script will show progress for each table deletion
   - At the end, it will show remaining record counts
   - All counts should be `0` if deletion was successful

---

## What Gets Deleted

The script deletes data from these tables (in order):

1. `employee_profile_approvals` - Profile approval requests
2. `employee_project_summaries` - AI-generated project summaries
3. `trainer_settings` - Trainer configuration
4. `employee_roles` - Employee role assignments
5. `employee_teams` - Employee-team relationships
6. `employee_managers` - Manager-employee relationships
7. `employees` - All employee records
8. `teams` - All team records
9. `departments` - All department records
10. `companies` - All company records
11. `company_registration_requests` - Registration requests
12. `audit_logs` - Audit trail logs

---

## After Clearing Data

Once the data is cleared, you can:

1. **Re-register companies** using the same CSV files
2. **Test the full registration flow** again
3. **Test employee login and enrichment** with fresh data

---

## Troubleshooting

### Error: "relation does not exist"
- Make sure you've run the migration (`001_initial_schema.sql`) first
- Check that all tables exist in your database

### Error: "foreign key constraint violation"
- This shouldn't happen if you use the provided script (it deletes in the correct order)
- If it does, check the error message to see which table is causing the issue

### Some records still exist
- Check the verification output at the end of the script
- Manually delete remaining records if needed
- Make sure you're connected to the correct database

---

## Safety Tips

1. **Backup first** (if you have important data):
   ```sql
   -- Export data before clearing (optional)
   -- Use Supabase dashboard or pg_dump
   ```

2. **Double-check** you're connected to the right database (development, not production)

3. **Verify** the deletion was successful by checking the counts at the end

---

## Quick Reference

**SQL Script Location:** `scripts/clear-all-data.sql`  
**Node.js Script Location:** `scripts/clear-all-data.js`  
**Migration File:** `database/migrations/001_initial_schema.sql`

