# LinkedIn Email Permissions Guide

## Issue: Email Access Denied (403 Error)

When connecting LinkedIn, you may see this error in Railway logs:

```
[LinkedInAPIClient] Could not fetch email: {
  status: 403,
  code: 'ACCESS_DENIED',
  serviceErrorCode: 100,
  message: 'Not enough permissions to access: emailAddress.FINDER-members.NO_VERSION'
}
```

## Understanding the Error

This error occurs when trying to fetch email from LinkedIn's legacy v2 API endpoint. However, **this is not a critical error** - the email should already be available from the OpenID Connect `userinfo` endpoint if the `email` scope is granted.

## How It Works

### OpenID Connect (Recommended - Already Implemented)

1. **Scopes Requested**: `openid`, `profile`, `email`
2. **Endpoint**: `https://api.linkedin.com/v2/userinfo`
3. **Email Source**: Included in userinfo response if `email` scope is granted
4. **Status**: ✅ This is the primary method and should work

### Legacy Email Endpoint (Fallback - Optional)

1. **Endpoint**: `https://api.linkedin.com/v2/emailAddress?q=members&projection=(elements*(handle~))`
2. **Requirement**: Requires "emailAddress" product approval in LinkedIn Developer Portal
3. **Status**: ⚠️ This is a fallback and may fail if product is not approved

## Current Implementation

The code now:
1. ✅ First tries OpenID Connect userinfo endpoint (includes email if scope granted)
2. ✅ Only calls legacy email endpoint if email is missing from userinfo
3. ✅ Gracefully handles 403 errors (email is optional)
4. ✅ Logs clear warnings when email endpoint fails

## Solution Options

### Option 1: Use OpenID Connect Email (Recommended - No Action Needed)

The `email` scope in OpenID Connect should provide email via the userinfo endpoint. If email is still missing:

1. **Verify LinkedIn App Configuration**:
   - Go to [LinkedIn Developer Portal](https://www.linkedin.com/developers/apps)
   - Select your app
   - Go to "Auth" tab
   - Ensure "OpenID Connect" is enabled
   - Verify redirect URI matches exactly (no trailing slashes)

2. **Verify Scopes**:
   - The code requests: `openid`, `profile`, `email`
   - These should be automatically available for OpenID Connect apps

### Option 2: Request EmailAddress Product (If Needed)

If you need the legacy email endpoint as a fallback:

1. **Go to LinkedIn Developer Portal**:
   - Visit: https://www.linkedin.com/developers/apps
   - Select your app

2. **Request Products**:
   - Go to "Products" tab
   - Find "Email Address" product
   - Click "Request access"
   - Fill out the form explaining why you need email access
   - Wait for LinkedIn approval (can take 1-2 business days)

3. **After Approval**:
   - The legacy email endpoint will work
   - This is still a fallback - OpenID Connect email is preferred

## Verification

### Check if Email is Working

1. **Check Railway Logs** during LinkedIn connection:
   ```
   [LinkedInAPIClient] ✅ Email retrieved from OpenID Connect userinfo endpoint
   ```
   OR
   ```
   [LinkedInAPIClient] ⚠️  Email not in userinfo response (may need separate email endpoint)
   [LinkedInAPIClient] ⚠️  Email endpoint requires "emailAddress" product approval
   ```

2. **Check Database**:
   - After LinkedIn connection, check `employees.linkedin_data` column
   - The JSON should contain an `email` field if successful

3. **Check Profile**:
   - After enrichment, the employee profile should show LinkedIn data
   - Email is optional - profile enrichment will work without it

## Impact

**Email is optional** for profile enrichment:
- ✅ LinkedIn connection will succeed even if email fetch fails
- ✅ Profile enrichment will work without email
- ✅ Gemini bio generation will work without email
- ⚠️ Only impact: Email won't be stored in `linkedin_data` JSON

## Current Status

The code has been updated to:
- ✅ Prioritize OpenID Connect userinfo email (no product approval needed)
- ✅ Only use legacy endpoint as fallback
- ✅ Handle 403 errors gracefully
- ✅ Log clear warnings for debugging

**No action required** - the system will work with OpenID Connect email. The 403 error is expected if the emailAddress product is not approved, but it doesn't affect functionality.

