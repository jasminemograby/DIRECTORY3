# GitHub OAuth Setup Guide

This guide explains how to set up GitHub OAuth for employee profile enrichment.

---

## 1. Create GitHub OAuth App

### Step 1: Go to GitHub Developer Settings
1. Visit: https://github.com/settings/developers
2. Sign in with your GitHub account
3. Click **"New OAuth App"** (or **"OAuth Apps"** → **"New OAuth App"**)

### Step 2: Fill in App Details
- **Application name**: Your app name (e.g., "EDUCORE Directory")
- **Homepage URL**: Your frontend URL
  - **Production**: `https://directory-3-two.vercel.app`
  - **Development**: `http://localhost:3000`
- **Authorization callback URL**: Your backend callback URL
  - **Production**: `https://directory3-production.up.railway.app/api/v1/oauth/github/callback`
  - **Local Development**: `http://localhost:3001/api/v1/oauth/github/callback`
- **Application description**: Optional description (e.g., "Employee profile enrichment for EDUCORE Directory")

**Important Notes:**
- The callback URL must **exactly match** what you configure in Railway
- You can add multiple callback URLs for different environments (production, staging, local)
- GitHub allows multiple OAuth apps, so you can create separate ones for dev/prod

### Step 3: Get Credentials
After creating the app, you'll see:
- **Client ID** (also called "Client identifier")
- **Client Secret** (click "Generate a new client secret" if needed)

**Save these credentials** - you'll need them for Railway environment variables.

---

## 2. Configure Scopes

GitHub OAuth apps request scopes (permissions) during authorization. The Directory service requires:

- **`user:email`** - Read user email addresses
- **`read:user`** - Read user profile data
- **`repo`** - Read repository data (for public and private repos the user has access to)

**Note:** These scopes are automatically requested during the OAuth flow. Users will see a permission screen when they authorize your app.

---

## 3. Set Environment Variables in Railway

### Step 1: Go to Railway Dashboard
1. Open your Railway project: https://railway.app
2. Select your backend service
3. Go to **"Variables"** tab

### Step 2: Add Environment Variables
Add the following variables:

```env
GITHUB_CLIENT_ID=your_client_id_here
GITHUB_CLIENT_SECRET=your_client_secret_here
GITHUB_REDIRECT_URI=https://directory3-production.up.railway.app/api/v1/oauth/github/callback
FRONTEND_URL=https://directory-3-two.vercel.app
```

**Important Notes:**
- Replace `your_client_id_here` with your actual Client ID from GitHub
- Replace `your_client_secret_here` with your actual Client Secret
- Update `FRONTEND_URL` to match your frontend deployment URL
- The redirect URI must **exactly match** what you configured in GitHub OAuth app settings
- `GITHUB_REDIRECT_URI` is optional - it will default to the callback URL if not set

### Step 3: Redeploy
After adding variables, Railway will automatically redeploy your service.

---

## 4. Verify Setup

### Check Backend Logs
After redeploy, check Railway logs. You should see:
- ✅ No warning about "GitHub OAuth credentials not configured"
- ✅ Server starts successfully

### Test OAuth Flow
1. Log in as an employee (first login)
2. You should be redirected to `/enrich` page
3. Click "Connect GitHub"
4. You should be redirected to GitHub authorization page
5. After authorizing, you should be redirected back to the app
6. GitHub profile and repository data should be fetched and stored

---

## 5. Troubleshooting

### Issue: "GitHub OAuth credentials not configured"
**Solution**: Make sure `GITHUB_CLIENT_ID` and `GITHUB_CLIENT_SECRET` are set in Railway variables.

### Issue: "Invalid redirect_uri"
**Solution**: 
- Check that the redirect URI in Railway matches exactly what's in GitHub OAuth app settings
- Make sure there are no trailing slashes or extra characters
- The redirect URI must be HTTPS in production
- Verify the callback URL is added in GitHub OAuth app settings

### Issue: "Invalid client_id"
**Solution**: 
- Verify the Client ID is correct (no extra spaces)
- Make sure you copied the full Client ID from GitHub

### Issue: "Invalid client_secret"
**Solution**: 
- Verify the Client Secret is correct
- Make sure you generated a new client secret if needed
- Secrets are case-sensitive
- If you regenerated the secret, update it in Railway

### Issue: OAuth callback redirects to wrong URL
**Solution**: 
- Check `FRONTEND_URL` environment variable
- Make sure it matches your frontend deployment URL
- Update GitHub redirect URI if needed

### Issue: "Insufficient scopes"
**Solution**: 
- Verify the OAuth app has the required scopes enabled
- Check that `user:email`, `read:user`, and `repo` are requested
- Users must grant these permissions during authorization

---

## 6. Local Development Setup

For local development, add to your `.env` file (if using one):

```env
GITHUB_CLIENT_ID=your_client_id_here
GITHUB_CLIENT_SECRET=your_client_secret_here
GITHUB_REDIRECT_URI=http://localhost:3001/api/v1/oauth/github/callback
FRONTEND_URL=http://localhost:3000
```

**Note**: Make sure to add `http://localhost:3001/api/v1/oauth/github/callback` to your GitHub OAuth app's callback URLs.

---

## 7. Security Best Practices

1. **Never commit credentials** to version control
2. **Use Railway environment variables** for production secrets
3. **Rotate secrets** if they're ever exposed
4. **Use HTTPS** in production (Railway handles this)
5. **Limit callback URLs** to only your production and development URLs
6. **Use separate OAuth apps** for different environments (dev/staging/prod) if possible
7. **Regularly review** OAuth app permissions and remove unused apps

---

## 8. Required Scopes Explained

### `user:email`
- **Purpose**: Read user email addresses
- **Why needed**: To match GitHub email with employee email in Directory
- **User sees**: "Read your email addresses"

### `read:user`
- **Purpose**: Read user profile information
- **Why needed**: To fetch profile data (name, bio, location, etc.)
- **User sees**: "Read your profile information"

### `repo`
- **Purpose**: Read repository data
- **Why needed**: To fetch user's repositories for project summaries
- **User sees**: "Read your repository data"
- **Note**: This includes both public and private repos the user has access to

---

## 9. Data Fetched from GitHub

After successful OAuth connection, Directory fetches:

1. **Profile Data:**
   - Username (login)
   - Full name
   - Email address
   - Bio
   - Avatar URL
   - Company
   - Blog/website
   - Location
   - Public repository count
   - Followers/following count
   - Account creation date

2. **Repository Data:**
   - Repository name and full name
   - Description
   - URL and clone URL
   - Primary language
   - Stars and forks count
   - Privacy status (public/private)
   - Fork status
   - Creation and update dates
   - Default branch

3. **Stored Data:**
   - All profile data is stored in `employees.github_data` (JSON)
   - GitHub profile URL is stored in `employees.github_url`
   - Access token is stored (encrypted) for future API calls if needed
   - Connection timestamp is recorded

---

## Next Steps

After setting up GitHub OAuth:
1. Test the OAuth flow with a real employee account
2. Verify GitHub data is stored in the database
3. Check that repositories are fetched correctly
4. Proceed with F009A (Gemini AI Integration) to generate bio and project summaries

---

## Support

If you encounter issues:
1. Check Railway logs for detailed error messages
2. Verify all environment variables are set correctly
3. Test the redirect URI in GitHub OAuth app settings
4. Check that the GitHub OAuth app is active and not suspended
5. Ensure the privacy policy URL is accessible (returns 200 OK)
6. Review GitHub API rate limits (5000 requests/hour for authenticated requests)

---

## Reference Links

- [GitHub OAuth Documentation](https://docs.github.com/en/apps/oauth-apps/building-oauth-apps/authorizing-oauth-apps)
- [GitHub API Documentation](https://docs.github.com/en/rest)
- [GitHub Developer Settings](https://github.com/settings/developers)

