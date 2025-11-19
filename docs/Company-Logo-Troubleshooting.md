# Company Logo Troubleshooting Guide

## Issue: Company Logo Not Displaying

If you don't see the company logo in the Company Profile page, follow these steps:

### Step 1: Verify Database Column Exists

The `logo_url` column must exist in the `companies` table. Run this SQL in Supabase SQL Editor:

```sql
-- Check if logo_url column exists
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'companies' AND column_name = 'logo_url';
```

If the column doesn't exist, you need to add it:

```sql
-- Add logo_url column to companies table
ALTER TABLE companies ADD COLUMN IF NOT EXISTS logo_url VARCHAR(500);
```

### Step 2: Verify Logo URL is in Database

Check if the logo URL was saved for your company:

```sql
-- Replace 'YOUR_COMPANY_ID' with your actual company UUID
SELECT id, company_name, logo_url 
FROM companies 
WHERE id = 'YOUR_COMPANY_ID';
```

### Step 3: Check Browser Console

Open browser DevTools (F12) and check the Console tab. You should see:
- `[CompanyProfilePage] Full response:` - Shows the full API response
- `[CompanyProfilePage] Company logo_url:` - Shows the logo URL value

### Step 4: Check Railway Logs

In Railway logs, look for:
- `[CompanyProfileController] Company logo_url: ...` - Shows if logo_url is being returned from database

### Step 5: Verify CSV Format

Make sure your CSV has the `logo_url` column (or `company_logo` or `logo`) in the header:

```csv
company_id,company_name,industry,learning_path_approval,primary_KPIs,logo_url,department_id,...
```

The logo URL should be in every row (it's a company-level field, but CSV format requires it in each row).

### Step 6: Verify Logo URL is Valid

The logo URL must be:
- A publicly accessible URL (no authentication required)
- A valid image format (PNG, JPG, SVG, etc.)
- Accessible from the internet (not a local file path)

### Common Issues

1. **Column doesn't exist**: Run the migration to add `logo_url` column
2. **Logo URL not saved**: Check Railway logs during CSV upload for `[ParseCSVUseCase] Updated company logo URL: ...`
3. **Image fails to load**: Check browser console for image loading errors. The system will fallback to initial letter if image fails.
4. **Response structure**: Check if `profileData.company.logo_url` exists in browser console

### Quick Test

1. Open browser console (F12)
2. Navigate to Company Profile page
3. Check console logs for logo_url value
4. Check Railway logs for backend logo_url value
5. If both show the URL but image doesn't display, the image URL might be invalid or blocked

