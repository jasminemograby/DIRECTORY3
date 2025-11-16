# Feature Design Template

**Purpose:** This template guides the design of an individual feature, including structure, API interactions, database needs, and AI/LLM integrations.

**Expected Outputs:**
- Feature design document
- API endpoint specifications
- Database schema changes
- Security considerations
- Implementation plan

---

## Step 1: Feature Identification

**Question 1:** What is the Feature ID? (e.g., F004, F005)

**Your Answer:** [FXXX]

---

**Question 2:** What is the feature title?

**Your Answer:** [Title]

---

**Question 3:** What is the feature description? (What does this feature do?)

**Your Answer:** [Description]

---

**Question 4:** Which features does this depend on? (List feature IDs, or "None")

**Your Answer:** [Dependencies]

---

## Step 2: Architecture & Design Decisions

**Question 5:** What is the main purpose of this feature from a user's perspective? (Non-technical description)

**Your Answer:** [User perspective]

---

**Question 6:** Will this feature interact with external APIs or services? (Yes/No)

**Your Answer:** [Yes/No]

**Instructions for AI:** If the user answers "Yes" to Question 6, dynamically generate follow-up questions. First, ask which APIs/services. Then, for each service mentioned, generate questions about:
- Primary use case for that service
- Authentication required (API Key, OAuth, Bearer Token, None)
- For OAuth: required scopes, token storage location
- Rate limits (if known)
- Whether mock data fallback is needed, and if yes, what the mock data structure should be
Generate these questions on the fly based on the specific services mentioned.

---

**Question 7:** Will this feature use AI/LLM integration? (Yes/No)

**Your Answer:** [Yes/No]

**Instructions for AI:** If the user answers "Yes" to Question 7, dynamically generate follow-up questions. First, ask which AI service (Gemini, OpenAI GPT, Claude, Custom LLM, Other). Then generate questions about:
- Prompt objective (what the AI should do)
- Expected inputs (format and examples)
- Expected outputs (format and examples)
- What guardrails are needed (input sanitization, output validation, rate limiting, prompt injection prevention, token/quota monitoring)
For each guardrail selected, generate questions about how it should be implemented. Generate these questions on the fly based on the specific AI service and requirements mentioned.

---

**Question 8:** Does this feature require database changes? (Yes/No)

**Your Answer:** [Yes/No]

**Instructions for AI:** If the user answers "Yes" to Question 8, dynamically generate follow-up questions. First, ask if new tables are needed or if existing tables will be modified. Then:
- For new tables: ask how many, and for each table, generate questions about table name, purpose, columns, primary key, foreign keys, indexes
- For modified tables: ask which tables and what changes (add columns, modify columns, etc.)
- Ask if new indexes are needed, and if yes, which columns should be indexed
- Ask if there are relationships to other tables, and if yes, what relationships (foreign keys, join tables, etc.)
Generate these questions on the fly based on the specific database needs mentioned.

---

## Step 3: API Design

**Question 9:** What API endpoints are needed? (List all endpoints with HTTP methods)

**Your Answer:**
- [Method] [Endpoint] - [Purpose]
- [Method] [Endpoint] - [Purpose]

---

**Question 10:** What is the request/response format for each endpoint?

**Your Answer:**
```json
// Example request
{
  "field1": "type",
  "field2": "type"
}

// Example response
{
  "success": true,
  "data": {...}
}
```

---

## Step 4: Security Considerations

**Question 11:** What authentication/authorization is required? (None, Basic Auth, OAuth, etc.)

**Your Answer:** [Auth method]

---

**Question 12:** What input validation is needed?

**Your Answer:** [Validation requirements]

---

**Question 13:** What security risks are identified and how will they be mitigated?

**Your Answer:**
- Risk 1: [Mitigation]
- Risk 2: [Mitigation]

---

## Step 5: Implementation Plan

**Question 14:** What are the implementation milestones? (List in order)

**Your Answer:**
1. [Milestone 1]
2. [Milestone 2]
3. [Milestone 3]

---

**Question 15:** What files need to be created? (List frontend, backend, database files)

**Your Answer:**
- Frontend: [List]
- Backend: [List]
- Database: [List]

---

## Step 6: Testing Strategy

**Question 16:** What unit tests are needed?

**Your Answer:** [Test scenarios]

---

**Question 17:** What integration tests are needed?

**Your Answer:** [Test scenarios]

---

## Generation Phase

Based on your answers, I will now generate:

1. **Feature Design Document** - Complete design specification
2. **API Specifications** - Endpoint details
3. **Database Schema Changes** - If applicable
4. **Security Assessment** - Risks and mitigations
5. **Implementation Plan** - Step-by-step milestones

**Files to be created/updated:**
- `docs/feature-docs/FXXX/feature-design.md`
- `features-map.json` (updated with file list)
- `docs/feature_log.md` (updated)

---

## Important: Complete Information Collection

**Instructions for AI:** Before proceeding to the Generation Phase, you must ensure ALL required information has been collected. Continue asking dynamic follow-up questions based on the user's answers until you have:

**CRITICAL:** If the user mentions something not yet asked but related to feature design (external APIs, AI/LLM integration, database changes, API endpoints, security considerations, etc.), dynamically generate follow-up questions until all related information is captured. Do not guess or assume - continue asking until all design requirements are fully specified.

- Complete feature identification and description
- All external API/service integration details (if applicable)
- Complete AI/LLM integration details (if applicable)
- All database changes fully specified (if applicable)
- Complete API endpoint specifications
- All security considerations addressed
- Complete implementation plan with milestones
- All file requirements specified

**Do NOT proceed to Generation Phase until:**
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

**If Yes:** I will verify that no assumptions are needed and proceed to the Generation Phase.

---

## Verification Before Generation

**Before generating any outputs, verify:**
- ✅ Feature is fully identified and described
- ✅ All external integrations are fully specified (if applicable)
- ✅ All AI/LLM details are complete (if applicable)
- ✅ All database changes are detailed (if applicable)
- ✅ All API endpoints are specified
- ✅ All security considerations are addressed
- ✅ Implementation plan is complete
- ✅ No information is missing or assumed

**If any item above is not verified, continue asking questions.**

---

## Generation Phase

**Only proceed if all information above is verified.**

Based on your complete answers, I will now generate:

1. **Feature Design Document** - Complete design specification
2. **API Specifications** - Endpoint details
3. **Database Schema Changes** - If applicable
4. **Security Assessment** - Risks and mitigations
5. **Implementation Plan** - Step-by-step milestones

**Files to be created/updated:**
- `docs/feature-docs/FXXX/feature-design.md`
- `features-map.json` (updated with file list)
- `docs/feature_log.md` (updated)

---

## Design Decisions Summary

### Architecture
- **Approach:** [Description of architectural approach]
- **Patterns Used:** [Design patterns, if any]
- **Service Layer:** [Backend services involved]
- **Data Flow:** [How data flows through the system]

### API Design
- **Endpoints:** [List of API endpoints]
- **Request/Response Format:** [Structure]
- **Error Handling:** [Error response format]

### Database Design
- **Tables Affected:** [List of tables]
- **Schema Changes:** [New columns, tables, indexes]
- **Relationships:** [Foreign keys, relationships]

### Security Considerations
- **Authentication:** [Auth requirements]
- **Authorization:** [RBAC, permissions]
- **Data Validation:** [Input validation approach]
- **Security Risks:** [Identified risks and mitigations]

---

## Implementation Plan

### Milestones
1. [Milestone 1]
2. [Milestone 2]
3. [Milestone 3]

### Artifacts
- **Frontend:** [List of frontend files]
- **Backend:** [List of backend files]
- **Database:** [Migration files, schema changes]

### Testing Strategy
- **Unit Tests:** [What to test]
- **Integration Tests:** [Integration test approach]
- **E2E Tests:** [End-to-end test scenarios]

---

## External Integrations
- **Services:** [External services used]
- **APIs:** [External APIs integrated]
- **Mock Data:** [Fallback strategy]

---

## Notes
[Additional notes, considerations, or decisions]

---

## Approval
- **Design Approved:** [Date]
- **Ready for Implementation:** [Date]

