# Deployment Template

**Purpose:** This template handles CI/CD, deploys frontend/backend/database, creates preview deploys, and handles rollback if needed.

**Expected Outputs:**
- Deployment configuration
- CI/CD workflow updates
- Deployment status
- Rollback plan (if needed)

---

## Step 1: Deployment Scope

**Question 1:** What should be deployed? (Select all that apply)
- Frontend
- Backend
- Database migrations
- All of the above
- Other: [Specify]

**Your Answer:** [Deployment scope]

**Dynamic Follow-ups:**
- **If Frontend:**
  - **Question 1a:** What is the deployment target? (Vercel, Netlify, AWS, Other)
  - **Your Answer:** [Target]
  - **Question 1b:** Is this a preview deploy or production? (Preview/Production)
  - **Your Answer:** [Type]

- **If Backend:**
  - **Question 1c:** What is the deployment target? (Railway, Heroku, AWS, Other)
  - **Your Answer:** [Target]
  - **Question 1d:** Is this a preview deploy or production? (Preview/Production)
  - **Your Answer:** [Type]

- **If Database migrations:**
  - **Question 1e:** What is the database platform? (Supabase, AWS RDS, Self-hosted, Other)
  - **Your Answer:** [Platform]
  - **Question 1f:** How many migrations? (Number)
  - **Your Answer:** [Count]

---

## Step 2: Pre-Deployment Checks

**Question 2:** Have pre-deployment checks been completed? (Select all that apply)
- ✅ Tests passing
- ✅ Code review completed
- ✅ Security scan passed
- ✅ Linting passed
- ✅ Build successful
- ⏳ Not all completed

**Your Answer:** [Checks status]

**Dynamic Follow-ups:**
- **If Not all completed:**
  - **Question 2a:** Which checks are missing? (List)
  - **Your Answer:** [Missing checks]
  - **Question 2b:** Should I proceed anyway? (Yes/No - not recommended)
  - **Your Answer:** [Yes/No]

---

## Step 3: Environment Variables

**Question 3:** Are all required environment variables configured? (Yes/No)

**Your Answer:** [Yes/No]

**Dynamic Follow-ups (if No or Unknown):**
- **Question 3a:** Which environment variables are needed? (List)
- **Your Answer:** [Variables]
- **For each variable:**
  - **Question 3b-[Variable]:** What is the value for [Variable]? (Or confirm it's set in deployment platform)
  - **Your Answer:** [Value or "Set in platform"]

---

## Step 4: Deployment Strategy

**Question 4:** What deployment strategy? (Select one)
- Direct deploy (push to main/master)
- Branch-based (deploy specific branch)
- Tag-based (deploy on git tag)
- PR preview (deploy PR as preview)
- Manual trigger
- Other: [Specify]

**Your Answer:** [Strategy]

**Dynamic Follow-ups:**
- **If Branch-based:**
  - **Question 4a:** Which branch? (Branch name)
  - **Your Answer:** [Branch]
  - **Question 4b:** Is this a feature branch or release branch?
  - **Your Answer:** [Branch type]

- **If Tag-based:**
  - **Question 4c:** What is the tag format? (e.g., v1.0.0, release-*, milestone-*)
  - **Your Answer:** [Tag format]

- **If PR preview:**
  - **Question 4d:** Should preview URL be commented on PR? (Yes/No)
  - **Your Answer:** [Yes/No]

---

## Step 5: CI/CD Configuration

**Question 5:** What CI/CD provider? (GitHub Actions, GitLab CI, Jenkins, Other)

**Your Answer:** [Provider]

**Dynamic Follow-ups:**
- **If GitHub Actions:**
  - **Question 5a:** Should I update .github/workflows/deploy.yml? (Yes/No)
  - **Your Answer:** [Yes/No]
  - **Question 5b:** What secrets are configured? (List or "Check platform")
  - **Your Answer:** [Secrets]
  - **Question 5c:** Should deployment run automatically on merge/tag? (Yes/No)
  - **Your Answer:** [Yes/No]

---

## Step 6: Database Migrations

**Question 6:** Are database migrations needed? (Yes/No)

**Your Answer:** [Yes/No]

**Dynamic Follow-ups (if Yes):**
- **Question 6a:** How many migration files? (Number)
- **Your Answer:** [Count]
- **Question 6b:** What is the migration order? (List migration files in order)
- **Your Answer:** [Order]
- **Question 6c:** Should migrations run automatically or manually? (Automatic/Manual)
- **Your Answer:** [Approach]
- **Question 6d:** Is there a rollback plan? (Yes/No)
- **Your Answer:** [Yes/No]
  - **If No:**
    - **Question 6d-1:** Should I create rollback migrations? (Yes/No)
    - **Your Answer:** [Yes/No]

---

## Step 7: Health Checks

**Question 7:** Should health checks be configured? (Yes/No)

**Your Answer:** [Yes/No]

**Dynamic Follow-ups (if Yes):**
- **Question 7a:** What health check endpoints? (List, e.g., /health, /api/health)
- **Your Answer:** [Endpoints]
- **Question 7b:** What should health checks verify? (Database connection, external services, etc.)
- **Your Answer:** [Checks]
- **Question 7c:** What is the health check interval? (e.g., every 30s, every 1min)
- **Your Answer:** [Interval]
- **Question 7d:** What happens if health check fails? (Restart, alert, rollback)
- **Your Answer:** [Action]

---

## Step 8: Rollback Plan

**Question 8:** Should a rollback plan be prepared? (Yes/No)

**Your Answer:** [Yes/No]

**Dynamic Follow-ups (if Yes):**
- **Question 8a:** What triggers rollback? (Health check failure, error rate threshold, manual trigger)
- **Your Answer:** [Triggers]
- **Question 8b:** How is rollback performed? (Revert to previous version, restore database backup, etc.)
- **Your Answer:** [Rollback method]
- **Question 8c:** Is rollback automated or manual? (Automated/Manual)
- **Your Answer:** [Approach]

---

## Important: Complete Information Collection

**Instructions for AI:** Before proceeding to deployment, you must ensure ALL required information has been collected. Continue asking dynamic follow-up questions based on the user's answers until you have:

**CRITICAL:** If the user mentions something not yet asked but related to deployment (deployment targets, environment variables, migrations, health checks, rollback plans, CI/CD configuration, etc.), dynamically generate follow-up questions until all related information is captured. Do not guess or assume - continue asking until all deployment requirements are fully specified.

- Complete deployment scope identified
- All pre-deployment checks verified
- All environment variables configured
- Complete deployment strategy specified
- All CI/CD configuration requirements specified
- All database migration requirements specified (if applicable)
- All health check requirements specified (if applicable)
- Complete rollback plan specified (if applicable)

**Do NOT proceed to deployment until:**
- All questions have been answered
- All follow-up questions based on answers have been asked and answered
- No assumptions or defaults are needed
- All required information is explicitly provided

If any information is missing, continue asking questions until it is provided.

---

## Final Checklist & Verification

**Have ALL required questions been asked and answered?** (Yes/No)

**Your Answer:** [Yes/No]

**If No:** I will continue asking questions until all required information is collected. Please specify what information is still needed.

**If Yes:** I will verify that no assumptions are needed and proceed to deployment.

---

## Verification Before Deployment

**Before deploying, verify:**
- ✅ Deployment scope is defined
- ✅ Pre-deployment checks are complete
- ✅ Environment variables are configured
- ✅ Deployment strategy is specified
- ✅ CI/CD configuration is complete
- ✅ Database migrations are planned (if applicable)
- ✅ Health checks are configured (if applicable)
- ✅ Rollback plan is ready (if applicable)
- ✅ No information is missing or assumed

**If any item above is not verified, continue asking questions.**

---

## Generation Phase

**Only proceed if all information above is verified.**

Based on your complete answers, I will now:

1. **Update CI/CD Workflow** - Configure deployment pipeline
2. **Prepare Deployment** - Build and package applications
3. **Deploy Services** - Frontend, backend, database
4. **Run Health Checks** - Verify deployment success
5. **Generate Deployment Report** - Status and URLs

**Files to be created/updated:**
- `.github/workflows/deploy.yml` (if GitHub Actions)
- `docs/deployment_log.md`

---

## Deployment Execution

**Deploying:**
1. ✅ Building frontend
2. ✅ Building backend
3. ✅ Running migrations
4. ✅ Deploying to platforms
5. ✅ Running health checks

**Deployment URLs:**
- Frontend: [URL]
- Backend: [URL]
- Health Check: [URL]

---

## Final Checklist

**Have you made all decisions and is this step fully planned?** (Yes/No)

**Your Answer:** [Yes/No]

**If No:** Please specify what needs clarification.

**If Yes:** I will proceed to deploy.

---

## Post-Deployment

After deployment:
- ✅ Services deployed
- ✅ Health checks passing
- ✅ URLs available
- ✅ Ready for testing

---

## Rollback (if needed)

**Rollback Triggered:** [Reason]

**Rolling back:**
1. ✅ Reverting to previous version
2. ✅ Restoring database (if needed)
3. ✅ Verifying rollback success

---

## Next Steps

After successful deployment:
- **Maintenance-and-Monitoring-Template.md** - Set up monitoring
- Test deployed services
- Monitor for issues

