# Database Migration Instructions

## Quick Fix: Add Missing Tables/Columns

If you're getting errors like `relation "employee_profile_approvals" does not exist`, you need to run the migration.

### Option 1: Run via Supabase Dashboard (Recommended)

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Click **"New query"**
4. Open the file: `database/migrations/002_add_profile_approvals.sql`
5. Copy the entire contents
6. Paste into the SQL Editor
7. Click **"Run"** (or press Ctrl+Enter)
8. You should see success messages:
   - ✅ employee_profile_approvals table created successfully
   - ✅ profile_status column added to employees table

### Option 2: Run Full Migration (If starting fresh)

1. Go to Supabase dashboard → **SQL Editor**
2. Open `database/migrations/001_initial_schema.sql`
3. Copy entire contents
4. Paste and run in SQL Editor

### Option 3: Using Railway CLI (If configured)

```bash
# Connect to Railway database
railway connect

# Run migration
psql $DATABASE_URL -f database/migrations/002_add_profile_approvals.sql
```

### Verification

After running the migration, verify in Supabase:
1. Go to **Table Editor**
2. You should see `employee_profile_approvals` table
3. Check `employees` table - it should have `profile_status` column

---

## What This Migration Adds

1. **`profile_status` column** to `employees` table
   - Values: 'basic', 'enriched', 'approved', 'rejected'
   - Default: 'basic'

2. **`employee_profile_approvals` table**
   - Tracks HR approval requests for enriched profiles
   - Links employees to their approval status

3. **Indexes** for performance
   - Index on `employees.profile_status`
   - Indexes on `employee_profile_approvals` for company and employee lookups

