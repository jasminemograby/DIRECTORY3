# Enrichment Flow Documentation

## Current Implementation Flow

### Step 1: Employee Connects LinkedIn OAuth
1. Employee clicks "Connect LinkedIn" on `/enrich` page
2. Frontend calls `GET /api/v1/oauth/linkedin/authorize`
3. Backend (`OAuthController.getLinkedInAuthUrl`) generates LinkedIn OAuth URL
4. Employee authorizes on LinkedIn
5. LinkedIn redirects to `GET /api/v1/oauth/linkedin/callback?code=...&state=...`
6. Backend (`OAuthController.handleLinkedInCallback`):
   - Calls `ConnectLinkedInUseCase.handleCallback()`
   - Fetches LinkedIn profile data (OpenID Connect)
   - Stores in `employees.linkedin_data` (JSONB) via `EmployeeRepository.updateLinkedInData()`
   - Generates dummy token + user object
   - Redirects to `/enrich?linkedin=connected&token=...&user=...`

### Step 2: Employee Connects GitHub OAuth
1. Employee clicks "Connect GitHub" on `/enrich` page
2. Frontend calls `GET /api/v1/oauth/github/authorize`
3. Backend (`OAuthController.getGitHubAuthUrl`) generates GitHub OAuth URL
4. Employee authorizes on GitHub
5. GitHub redirects to `GET /api/v1/oauth/github/callback?code=...&state=...`
6. Backend (`OAuthController.handleGitHubCallback`):
   - Calls `ConnectGitHubUseCase.handleCallback()`
   - Fetches GitHub profile + repositories
   - Stores in `employees.github_data` (JSONB) via `EmployeeRepository.updateGitHubData()`
   - Checks if both LinkedIn and GitHub are connected
   - **If both connected → Triggers enrichment automatically**

### Step 3: Profile Enrichment (Automatic Trigger)
When both OAuth connections are complete, `OAuthController` calls:
```
EnrichProfileUseCase.enrichProfile(employeeId)
```

**EnrichProfileUseCase.enrichProfile() Flow:**

1. **Fetch Employee Data**
   - Gets employee from database
   - Checks if already enriched (prevents re-enrichment)
   - Verifies both `linkedin_data` and `github_data` exist

2. **Parse OAuth Data**
   - Parses `linkedin_data` (JSONB) → `linkedinData` object
   - Parses `github_data` (JSONB) → `githubData` object
   - Extracts `employeeBasicInfo`: `{ full_name, current_role_in_company, target_role_in_company }`

3. **Generate Bio with Gemini AI**
   - Calls `GeminiAPIClient.generateBio(linkedinData, githubData, employeeBasicInfo)`
   - **Prompt includes:**
     - LinkedIn profile data (name, headline, summary, positions, experience)
     - GitHub profile data (repositories, languages, contributions)
     - Employee basic info (name, current role, target role)
   - **Returns:** Professional bio (3-5 sentences, 250 words max)
   - **Fallback:** If Gemini fails → Uses `MockDataService.getMockBio()`
   - **Logs:** Detailed logging of API calls, responses, and errors

4. **Generate Project Summaries with Gemini AI**
   - Extracts repositories from `githubData.repositories`
   - Calls `GeminiAPIClient.generateProjectSummaries(repositories)`
   - **Prompt includes:**
     - Repository details (name, description, language, stars, forks, URL)
     - Top 20 repositories with full details
   - **Returns:** Array of `{ repository_name, repository_url, summary }`
   - Each summary: 2-3 sentences, 200 words max, unique per repository
   - **Fallback:** If Gemini fails → Uses `MockDataService.getMockProjectSummaries()`
   - **Logs:** Detailed logging of API calls and parsing

5. **Store Enrichment Data**
   - Calls `EmployeeRepository.updateEnrichment(employeeId, bio, projectSummaries, geminiSucceeded)`
   - Updates `employees.bio` with generated bio
   - Deletes old project summaries
   - Inserts new project summaries into `employee_project_summaries` table
   - Sets `profile_status = 'enriched'`
   - Sets `enrichment_completed = TRUE` (only if Gemini succeeded for both bio and summaries)
   - Sets `enrichment_completed_at = CURRENT_TIMESTAMP`

6. **Send Skills to Skills Engine** (Non-critical)
   - Calls `MicroserviceClient.getEmployeeSkills()` to normalize skills
   - Falls back silently if Skills Engine fails

7. **Create HR Approval Request**
   - Calls `EmployeeProfileApprovalRepository.createApprovalRequest()`
   - Creates record in `employee_profile_approvals` table
   - Status: `pending`

8. **Return Result**
   - Returns enrichment result with employee data and approval request

### Step 4: Frontend Display
After enrichment completes:
1. Backend redirects to `/enrich?linkedin=connected&github=connected&enriched=true&token=...&user=...`
2. Frontend (`EnrichProfilePage`) detects enrichment complete
3. Redirects to `/employee/{id}?enrichment=complete`
4. Employee Profile Page displays:
   - **Professional Bio** (from `employees.bio`)
   - **Project Summaries** (from `employee_project_summaries` table)
   - Both marked with "AI-Enriched" badge if `enrichment_completed = TRUE`

### Step 5: HR Approval
1. HR logs in → Redirected to Company Profile
2. HR navigates to "Pending Profile Approvals" tab
3. HR sees list of enriched profiles
4. HR clicks "Approve" on employee profile
5. Backend updates `profile_status = 'approved'`
6. Employee can now see "Learning & Development" section

---

## Data Flow Diagram

```
LinkedIn OAuth → employees.linkedin_data (JSONB)
                                    ↓
GitHub OAuth → employees.github_data (JSONB)
                                    ↓
                    ┌───────────────┴───────────────┐
                    ↓                               ↓
         GeminiAPIClient.generateBio()    GeminiAPIClient.generateProjectSummaries()
                    ↓                               ↓
         employees.bio (TEXT)         employee_project_summaries (TABLE)
                    ↓                               ↓
                    └───────────────┬───────────────┘
                                    ↓
                    EmployeeProfilePage displays both
```

---

## Gemini API Integration Details

### Bio Generation
- **Model:** `gemini-1.5-flash`
- **Endpoint:** `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent`
- **Input:**
  - LinkedIn profile data (full object)
  - GitHub profile data (full object)
  - Employee basic info (name, current role, target role)
- **Output:** Plain text bio (3-5 sentences, 250 words max)
- **Retry Logic:** 3 attempts with exponential backoff (2s, 4s, 8s) on rate limits
- **Error Handling:** Falls back to mock data if all retries fail

### Project Summaries Generation
- **Model:** `gemini-1.5-flash`
- **Endpoint:** `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent`
- **Input:**
  - Array of repository objects (up to 20)
  - Each repository: name, description, language, stars, forks, URL, etc.
- **Output:** JSON array `[{ repository_name, summary }]`
- **Retry Logic:** 3 attempts with exponential backoff on rate limits
- **Error Handling:** Falls back to mock data if all retries fail

---

## Database Schema

### `employees` table
- `linkedin_data` (JSONB) - Full LinkedIn profile data
- `github_data` (JSONB) - Full GitHub profile data
- `bio` (TEXT) - AI-generated professional bio
- `enrichment_completed` (BOOLEAN) - True if Gemini succeeded
- `enrichment_completed_at` (TIMESTAMP) - When enrichment completed
- `profile_status` (VARCHAR) - 'basic' → 'enriched' → 'approved'

### `employee_project_summaries` table
- `employee_id` (UUID) - Foreign key to employees
- `repository_name` (VARCHAR) - GitHub repository name
- `repository_url` (VARCHAR) - GitHub repository URL
- `summary` (TEXT) - AI-generated project summary

---

## Critical Logging Points

All enrichment steps are logged with detailed information:

1. **EnrichProfileUseCase:**
   - `[EnrichProfileUseCase] ========== STARTING ENRICHMENT ==========`
   - Employee ID, email, enrichment status
   - LinkedIn/GitHub data presence
   - Gemini API call status
   - Bio generation success/failure
   - Project summaries generation success/failure
   - Enrichment completion status

2. **GeminiAPIClient:**
   - `[GeminiAPIClient] ========== GENERATING BIO ==========`
   - API key configuration status
   - Prompt length
   - API call attempts
   - Response status and data
   - Retry attempts on rate limits
   - Error details

3. **OAuthController:**
   - `[OAuthController] ========== LINKEDIN CALLBACK RECEIVED ==========`
   - `[OAuthController] ========== GITHUB CALLBACK RECEIVED ==========`
   - OAuth connection status
   - Enrichment trigger status

---

## Testing Checklist

To verify enrichment flow is working:

1. ✅ Check Railway logs for:
   - `[EnrichProfileUseCase] ========== STARTING ENRICHMENT ==========`
   - `[GeminiAPIClient] ========== GENERATING BIO ==========`
   - `[GeminiAPIClient] ✅ Bio generated successfully by Gemini`
   - `[GeminiAPIClient] ✅ Generated X project summaries by Gemini`

2. ✅ Check database:
   - `employees.linkedin_data` is not null
   - `employees.github_data` is not null
   - `employees.bio` contains unique, personalized text (not generic)
   - `employees.enrichment_completed = TRUE`
   - `employee_project_summaries` has entries with unique summaries

3. ✅ Check frontend:
   - Bio displays on employee profile page
   - Project summaries display with unique descriptions
   - "AI-Enriched" badge appears if enrichment_completed = TRUE

4. ✅ Verify no mock data:
   - Bio should be unique per employee (not "They are a...")
   - Project summaries should reference specific repository details
   - Check logs for "⚠️ MOCK BIO USED" or "⚠️ MOCK SUMMARIES USED" warnings

---

## Common Issues

### Issue: Generic Bio
**Symptom:** All employees have same bio, uses "they" instead of "he/she"
**Cause:** Gemini API not being called, or prompt not using employee-specific data
**Solution:** 
- Check Railway logs for Gemini API calls
- Verify `GEMINI_API_KEY` is configured
- Check if `enrichment_completed = FALSE` (indicates mock data was used)

### Issue: Enrichment Not Triggering
**Symptom:** Both OAuth connected but no enrichment
**Cause:** `isReadyForEnrichment()` check failing
**Solution:**
- Check Railway logs for `[EnrichProfileUseCase] Ready for enrichment: false`
- Verify both `linkedin_data` and `github_data` exist in database
- Check if `enrichment_completed = TRUE` (prevents re-enrichment)

### Issue: Project Summaries Missing
**Symptom:** Bio appears but no project summaries
**Cause:** No repositories in GitHub data, or Gemini API failed
**Solution:**
- Check `github_data.repositories` array length
- Check Railway logs for project summaries generation
- Verify GitHub OAuth fetched repositories correctly

---

**Last Updated:** 2025-01-20

