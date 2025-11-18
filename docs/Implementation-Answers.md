# Implementation Answers - Confirmation

This document confirms understanding of all critical implementation questions.

**Last Updated**: Based on user answers

---

## ✅ 1. Authentication & Authorization (AUTH SERVICE)

### Understanding:
- **Auth Service exists but is NOT ready yet**
- **Current**: Use dummy/login stub ONLY for local testing and manual QA (not secure, not production)
- **Future**: When Auth Service is ready, integrate Directory to obtain JWTs and perform real login flows
- **Action Required**: 
  - Implement test stub for login
  - Create clear integration point (config + docs) for swapping to Auth Service JWTs later
  - Document the toggle and how to integrate real JWT (endpoints, expected token format, header name)
  - Do NOT implement permanent security logic assuming dummy login
  - Prepare code to switch to real JWT-based auth (feature flag or clear config toggle)

### Status: ✅ **UNDERSTOOD**

---

## ✅ 2. Gemini (AI) Integration

### Understanding:
- **Integration Method**: External API call (Gemini or other LLMs like OpenAI)
- **Purpose**: Analyze raw data and produce bio, projects summary, and enriched text for profiles
- **Action Required**:
  - Provide step-by-step setup guide: endpoint, API keys (.env or secrets), prompts for each enrichment task
  - Automate server code (format request/response)
  - Instruct exactly how to obtain API key and where to paste it
  - Provide minimal sample .env entries and example request/response JSONs
  - Provide recommended prompt templates (short, robust)
  - Guidance on rate limits / retries
  - Create `/docs/Gemini-Integration-Setup.md` with steps and sample curl/postman call
  - Add corresponding mock entry in `/mockData/index.json`

### Status: ✅ **UNDERSTOOD**

---

## ✅ 3. LinkedIn & GitHub OAuth

### Understanding:
- **OAuth must be initiated by employee on first login** (not by HR)
- **Employee must connect LinkedIn/GitHub to enable enrichment**
- **Action Required**:
  - Step-by-step guide for obtaining Client ID, Client Secret, and required OAuth scopes for LinkedIn and GitHub
  - Example redirect URI and recommended minimal scopes for profile + public data
  - Code stubs showing where to store client_id/client_secret (env)
  - How to handle token storage & refresh (recommendations only)
  - UI flow: employee clicks "Connect LinkedIn/GitHub" → OAuth popup → successful callback updates profile and triggers enrichment
  - Create `/docs/OAuth-Setup-and-Flow.md` with exact instructions and example environment variables

### Status: ✅ **UNDERSTOOD**

---

## ✅ 4. HR Employee Identification

### Understanding:
- **Current Rule**: One HR = person who uploaded company CSV and registered the company
- **That HR is the company owner and initial admin** for company actions
- **Future**: Later we will allow multiple HR users; one will remain company owner/primary approver
- **Action Required**:
  - Enforce CSV validation: `decision_maker_id` in CSV must correspond to `employee_id` included in same CSV
  - If not present, fail CSV upload with clear human message asking to provide valid ID

### Status: ✅ **UNDERSTOOD**

---

## ✅ 5. Employee Login / Authentication

### Understanding:
- **Current login is dummy for testing only**
- **Directory is NOT responsible for production authentication**
- **Action Required**:
  - Clearly label dummy login in code and README
  - Provide instructions to replace with real Auth Service integration once available

### Status: ✅ **UNDERSTOOD**

---

## Additional Clarifications

### Error Handling & Retry Logic
- **Decision**: I (Cursor) choose best default policies
- **Action**: Document in `/docs/Error-Retry-Policy.md`
- **Recommended**: Exponential backoff, 3 retries for transient errors

### Mock Data Structure
- **Format**: Single JSON file `/mockData/index.json`
- **Content**: Mock responses for each microservice using expected field shapes already provided

### AI Query Generation
- **Decision**: I decide the approach
- **Requirement**: Implement robust schema-mapping logic
- **AI mapping must tolerate synonyms** (e.g., map `user_id` → `employee_id`) automatically

### Schema Matching Logic
- **Tie to**: AI mapping layer
- **Action**: Document the rules
- **Example**: If remote microservice asks for `user_id` but Directory has `employee_id`, mapper resolves this equivalence

---

## Summary

✅ **All 5 critical blocks are UNDERSTOOD**

Next Steps:
1. Create all required documentation files
2. Implement dummy login stub with clear toggle for future JWT integration
3. Create setup guides for Gemini and OAuth
4. Implement CSV validation for decision_maker_id
5. Document error/retry policies
6. Implement schema matching logic

