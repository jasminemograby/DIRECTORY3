# API Endpoint Fix

## Issue
The frontend was calling `/api/v1/companies/register` but the `apiBaseUrl` already includes `/api/v1`, causing a 404 error.

## Fix Applied
- Updated `frontend/src/services/companyRegistrationService.js` to call `/companies/register` instead of `/api/v1/companies/register`
- Updated `frontend/src/services/companyVerificationService.js` to call `/companies/${companyId}/verification` instead of `/api/v1/companies/${companyId}/verification`

## Vercel Environment Variable Check

Make sure you have set the following environment variable in Vercel:

**Variable Name:** `REACT_APP_API_BASE_URL`  
**Value:** `https://directory3-production.up.railway.app/api/v1`

### How to Set in Vercel:
1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add/Update:
   - **Key:** `REACT_APP_API_BASE_URL`
   - **Value:** `https://directory3-production.up.railway.app/api/v1`
   - **Environment:** Production (and Preview if needed)
4. **Redeploy** your Vercel application after setting the variable

## Testing
After redeploying with the correct environment variable:
1. The frontend will call: `https://directory3-production.up.railway.app/api/v1/companies/register`
2. The backend should respond correctly

## Railway Backend Check
Also verify that your Railway backend is running and accessible at:
- `https://directory3-production.up.railway.app/health`

This should return a JSON response with status "ok".

