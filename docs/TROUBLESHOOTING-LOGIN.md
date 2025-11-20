# Troubleshooting Login Issues

## Error: "Invalid email or password"

This error occurs when:
1. The employee doesn't exist in the database (CSV not uploaded)
2. The password doesn't match the stored hash
3. The email format is incorrect

## Step-by-Step Troubleshooting

### Step 1: Verify CSV Upload
**Check if the employee exists in the database:**
- Make sure you've uploaded the CSV file after company registration
- The CSV file must be uploaded successfully
- Check Railway/Supabase logs for CSV processing errors

### Step 2: Verify Email Format
**Ensure email matches exactly:**
- Email from CSV: `alex.johnson@innovatetech.io`
- Use lowercase (system normalizes to lowercase)
- No extra spaces

### Step 3: Verify Password
**Password from CSV:**
- Password: `SecurePass123`
- Case-sensitive
- No extra spaces

### Step 4: Check Database
**If using Supabase:**
1. Go to Supabase Dashboard → Table Editor
2. Open `employees` table
3. Search for email: `alex.johnson@innovatetech.io`
4. Verify:
   - Employee exists
   - `password_hash` field is populated (not null)
   - `email` matches exactly

**If using Railway:**
1. Connect to PostgreSQL database
2. Run query:
   ```sql
   SELECT email, password_hash IS NOT NULL as has_password, status 
   FROM employees 
   WHERE email = 'alex.johnson@innovatetech.io';
   ```

### Step 5: Test Password Hash
**If employee exists but password doesn't work:**
- The password from CSV should be hashed with bcrypt
- Default password if CSV password is empty: `default123`
- Try logging in with `default123` if CSV password doesn't work

## Common Issues

### Issue 1: CSV Not Uploaded
**Symptom:** Employee doesn't exist in database
**Solution:** Upload the CSV file after company registration

### Issue 2: Password Field Empty in CSV
**Symptom:** Password hash is set to default `default123`
**Solution:** Ensure CSV has password field populated, or use `default123` to login

### Issue 3: Email Mismatch
**Symptom:** Employee not found
**Solution:** 
- Check exact email spelling
- Ensure no extra spaces
- Use lowercase

### Issue 4: Password Hash Not Created
**Symptom:** `password_hash` is NULL in database
**Solution:** 
- Re-upload CSV
- Check Railway/Supabase logs for errors during CSV processing

## Test Accounts (from test_company_with_logo.csv)

### Regular Employee
- **Email:** `alex.johnson@innovatetech.io`
- **Password:** `SecurePass123`

### Trainer
- **Email:** `sarah.williams@innovatetech.io`
- **Password:** `SecurePass123`

### HR / Decision Maker
- **Email:** `jennifer.martinez@innovatetech.io`
- **Password:** `SecurePass123`

## Quick Fix: Reset Password

If password doesn't work, you can manually update it in the database:

```sql
-- Update password hash for an employee
UPDATE employees 
SET password_hash = '$2b$10$YourBcryptHashHere' 
WHERE email = 'alex.johnson@innovatetech.io';
```

Or use the default password `default123` if the CSV password field was empty.

## Verification Query

Run this query to check employee status:

```sql
SELECT 
  email,
  full_name,
  employee_id,
  CASE 
    WHEN password_hash IS NULL THEN 'NO PASSWORD'
    ELSE 'HAS PASSWORD'
  END as password_status,
  status,
  profile_status
FROM employees 
WHERE email = 'alex.johnson@innovatetech.io';
```

