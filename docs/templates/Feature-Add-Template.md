# Feature Add Template

**Purpose:** This template guides the addition of a new feature by asking purpose, data needs, external APIs, AI prompts, creating files, and updating features-map.json.

**Expected Outputs:**
- Feature specification (id, title, description, inputs, outputs, artifact filenames)
- File list to create
- Test skeletons (TDD-first)
- Migration plan if DB changes required
- Updated features-map.json

---

## Pre-Add Scan

Before adding a feature, I will:
1. Read `requirements.md`, `flow.md`, `architecture.md`, and `docs/project_customization.md`
2. Check `features-map.json` for existing features
3. Verify no file conflicts with existing features

---

## Step 1: Feature Purpose

**Question 1:** What is the purpose of this new feature? (Describe what it does from a user's perspective)

**Your Answer:** [Purpose]

---

**Question 2:** What user flow does this feature support? (Step-by-step user actions)

**Your Answer:**
1. [Step 1]
2. [Step 2]
3. [Step 3]

---

**Question 3:** What is the expected growth/scale for this feature? (e.g., how many users, how much data)

**Your Answer:** [Scale]

---

## Step 2: Data Needs

**Question 4:** What data does this feature need to store or access? (List all data types)

**Your Answer:** [Data types]

---

**Question 5:** Does this feature require new database tables or modifications? (Yes/No)

**Your Answer:** [Yes/No]

**Instructions for AI:** If the user answers "Yes" to Question 5, dynamically generate follow-up questions. First, ask if new tables are needed or if existing tables will be modified. Then:
- For new tables: ask how many, and for each table, generate questions about table name, purpose, columns/fields with data types, primary key type, foreign keys (if any), and indexes (if any)
- For modified tables: ask which tables, what changes (add columns, modify columns, add indexes), and for each change, generate specific questions about the modifications
- Ask if data migration is needed, and if yes, generate questions about what data to migrate and any transformations required
- Ask about data retention and archival requirements, and if yes, generate questions about retention periods and archive/delete strategy
Generate these questions on the fly based on the specific database needs mentioned.

---

## Step 3: External APIs & Integrations

**Question 6:** Does this feature need to call external APIs? (Yes/No)

**Your Answer:** [Yes/No]

**Instructions for AI:** If the user answers "Yes" to Question 6, dynamically generate follow-up questions. First, ask which API provider(s) and what specific endpoints will be called. For each endpoint mentioned, generate questions about:
- Request data format
- Response data format
- Expected response time
Then ask about authentication method required. Based on the auth method selected (OAuth, API Key, Bearer Token, Basic Auth, None), generate specific questions:
- For OAuth: OAuth flow type, required scopes, token storage location, token refresh handling
- For API Key: storage location, whether user-specific or shared
- For Bearer Token: how token is obtained, token expiration
Ask about rate limits, and if provided, generate questions about handling rate limit exceeded scenarios. Ask if mock data fallback is needed, and if yes, generate questions about mock data structure and storage location. Ask about API-specific requirements (webhooks, polling, real-time), and if webhooks are mentioned, generate questions about trigger events, endpoint URL, and security handling. Generate these questions on the fly based on the specific APIs and requirements mentioned.

---

## Step 4: AI/LLM Integration

**Question 7:** Does this feature use AI/LLM integration? (Yes/No)

**Your Answer:** [Yes/No]

**Instructions for AI:** If the user answers "Yes" to Question 7, dynamically generate follow-up questions. First, ask which AI service (Gemini, OpenAI GPT, Claude, Custom LLM, Other). Then generate questions about:
- Prompt objective (what the AI should do)
- Input data format and examples
- Output format (JSON, text, structured data)
- Expected response length
- Whether specific output examples are available
Then ask what guardrails are needed (input sanitization, output validation, rate limiting, content filtering, prompt injection prevention, token/quota monitoring). For each guardrail selected, generate specific questions:
- For Input sanitization: what types of input need sanitization
- For Output validation: what validation rules should be applied
- For Rate limiting: what rate limits should be enforced
- For Prompt injection prevention: what techniques should be prevented
Ask if AI responses will be cached, and if yes, generate questions about cache duration and cache key determination. Ask what should happen if AI service fails (retry, fallback, error, mock data), and based on the answer, generate questions about alternative services or mock data storage. Generate these questions on the fly based on the specific AI service and requirements mentioned.

---

## Step 5: Customization Requirements

**Question 8:** Does this feature require any special/custom rules that differ from general templates? (Yes/No)

**Your Answer:** [Yes/No]

**Instructions for AI:** If the user answers "Yes" to Question 8, dynamically generate follow-up questions to fully understand the custom requirements. Ask about: what the custom rule is, why it differs from general templates, what impact it has on the feature/project, and any specific implementation details. **CRITICAL:** After collecting all custom requirements, you MUST automatically update `docs/project_customization.md` with a new entry following this format:
- **Date:** [Current date]
- **Feature:** [Feature ID if applicable]
- **Rule:** [Description of the customization]
- **Impact:** [What this affects]
- **Status:** Applied/Pending

**If Yes:** Describe the custom requirements:

**Your Answer:** [Custom requirements]

---

## Step 6: Feature Specification

Based on your answers, I will generate:

**Feature ID:** [Auto-generated: FXXX]

**Feature Title:** [From Question 1]

**Feature Description:** [From Question 1]

**Inputs:** [From Questions 2, 4, 6, 7]

**Outputs:** [From Questions 2, 6, 7]

**Dependencies:** [From analysis of existing features]

**Artifact Filenames:** [To be determined based on architecture]

---

## Step 7: File List Generation

I will now propose the files to create:

**Frontend Files:**
- [List of frontend components/pages]

**Backend Files:**
- [List of backend services/controllers/routes]

**Database Files:**
- [List of migrations/schema changes]

**Test Files:**
- [List of test files - TDD-first]

---

## Step 8: Test Skeletons (TDD)

**Question 9:** What are the key test scenarios for this feature? (List 3-5 scenarios)

**Your Answer:**
1. [Test scenario 1]
2. [Test scenario 2]
3. [Test scenario 3]

I will create test skeletons before implementation code.

---

## Step 9: Migration Plan

**If database changes are needed:**

**Migration Steps:**
1. [Step 1]
2. [Step 2]
3. [Step 3]

**Rollback Plan:**
[How to rollback if needed]

---

## Important: Complete Information Collection

**Instructions for AI:** Before proceeding to the Generation Phase, you must ensure ALL required information has been collected. Continue asking dynamic follow-up questions based on the user's answers until you have:

**CRITICAL:** If the user mentions something not yet asked but related to this feature (purpose, data needs, external APIs, AI integration, database changes, file requirements, etc.), dynamically generate follow-up questions until all related information is captured. Do not guess or assume - continue asking until all feature requirements are fully specified.

- Complete feature purpose and user flow
- All data needs fully specified (tables, columns, relationships if database changes needed)
- All external API details (endpoints, auth, rate limits, mock data if applicable)
- Complete AI/LLM integration details (service, prompts, guardrails, failure handling if applicable)
- All file requirements (frontend, backend, database, tests)
- All test scenarios specified

**Do NOT proceed to Generation Phase until:**
- All questions have been answered
- All follow-up questions based on answers have been asked and answered
- No assumptions or defaults are needed for any aspect
- All required information is explicitly provided

If any information is missing, continue asking questions until it is provided.

---

## Final Checklist & Verification

**Have ALL required questions been asked and answered?** (Yes/No)

**Your Answer:** [Yes/No]

**If No:** I will continue asking questions until all required information is collected. Please specify what information is still needed.

**If Yes:** I will verify that no assumptions are needed and proceed to the Generation Phase.

---

## Verification Before Generation

**Before generating any outputs, verify:**
- ✅ Feature purpose and flow are completely specified
- ✅ All database changes are fully detailed (if applicable)
- ✅ All external API integrations are fully specified (if applicable)
- ✅ All AI/LLM integration details are complete (if applicable)
- ✅ All file requirements are specified
- ✅ All test scenarios are defined
- ✅ No information is missing or assumed

**If any item above is not verified, continue asking questions.**

---

## Generation Phase

**Only proceed if all information above is verified.**

I will now:

1. **Create Feature Specification** - Complete feature spec document
2. **Create File List** - All files to be created
3. **Create Test Skeletons** - TDD-first test files
4. **Create Migration Plan** - If database changes needed
5. **Update features-map.json** - Add new feature and file list
6. **Update docs/feature_log.md** - Add feature entry
7. **Update docs/change_log.md** - Log the addition
8. **Update docs/project_customization.md** - If Question 8 was "Yes", add customization entry automatically

**Files to be created/updated:**
- [List all files with diffs]

---

## Approval Before Creation

**Summary of what will be created:**
- Feature: [Title]
- Files: [Count] new files
- Tests: [Count] test files
- Database: [Changes or None]

**Have you reviewed the proposed files and are you ready to proceed?** (Yes/No)

**Your Answer:** [Yes/No]

**If No:** Please specify what needs adjustment.

**If Yes:** I will:
1. Show diffs of all files to be created
2. Wait for explicit approval
3. Create all files
4. Run unit tests and regression suite
5. Report results and update logs

---

## Post-Creation Validation

After creation:
- ✅ Run unit tests
- ✅ Run regression suite
- ✅ Update Feature Log
- ✅ Update Change Log
- ✅ Update Prompt Refinements (if AI used)
- ✅ Update Project Customization (if custom rules added)

