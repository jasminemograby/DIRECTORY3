# Feature Refine Template

**Purpose:** This template guides refinement of existing features by pre-scanning, proposing changes, updating/deleting files, validating, and logging actions.

**Expected Outputs:**
- Pre-change scan summary
- Refinement plan
- Updated files (or deleted if rebuilding)
- Test results
- Updated logs

---

## Step 1: Feature Identification

**Question 1:** Which feature needs to be refined? (Provide Feature ID, e.g., F001, F002)

**Your Answer:** [FXXX]

---

**Question 2:** Which part of the feature needs to change? (Select all that apply)
- Logic/Functionality
- UI/User Interface
- Data/Database
- API/Endpoints
- AI Prompt/LLM Integration
- Security
- Performance
- Other: [Specify]

**Your Answer:** [Selected parts]

**Instructions for AI:** Based on the user's answer to Question 2, dynamically generate follow-up questions for each selected part:
- For Logic/Functionality: ask what specific logic needs to change, whether this affects other features, and if yes, which features
- For UI/User Interface: ask what UI elements need to change (components, pages, layouts, styling), whether this affects responsive design
- For Data/Database: ask what database changes are needed (new tables, modified tables, migrations), whether data migration is required
- For API/Endpoints: ask what API changes (new, modified, removed endpoints), whether this breaks existing API consumers, and if yes, what the migration plan is
- For AI Prompt/LLM Integration: ask what prompt changes are needed, whether this affects AI outputs, whether guardrails need updating
- For Security: ask what security improvements are needed, whether there are new vulnerabilities to address
- For Performance: ask what performance issues need addressing, what optimization strategies are needed
Generate these questions on the fly based on the specific parts selected.

---

## Step 2: Pre-Change Scan (MANDATORY)

I will now scan the feature's code and flow:

**Scanning:**
1. Reading `docs/project_customization.md` to understand existing customizations
2. Reading `features-map.json` for feature file list
3. Reading all files listed for this feature
4. Analyzing current logic, dependencies, data inputs/outputs
5. Identifying files that will be affected
6. Checking if this refinement affects any existing customizations

**Current Feature Summary:**

**Feature:** [FXXX] - [Title]

**Current Logic:**
[Summary of how the feature currently works]

**Dependencies:**
[List of features/services this depends on]

**Data Inputs:**
[What data the feature receives]

**Data Outputs:**
[What data the feature produces]

**Files Affected:**
[List of files that belong to this feature]

---

## Step 3: Change Request

**Question 3:** What needs to change and why? (Describe in non-technical terms what should be different)

**Your Answer:** [Change description]

---

**Question 4:** What is the expected outcome after this change? (What should happen differently?)

**Your Answer:** [Expected outcome]

---

## Step 4: Refinement Plan

Based on your answers, I will propose:

**What Will Change:**
[Detailed description of changes]

**Files to be Updated:**
[List of files to modify]

**Files to be Deleted:**
[List of files to delete - only feature files, never shared/core]

**Files to be Created:**
[List of new files if needed]

**Why These Changes:**
[Rationale for each change]

**Expected Outputs:**
[What the feature will produce after changes]

**Backward Compatibility:**
- ✅ Compatible - [Explanation]
- ⚠️ Breaking Change - [Impact and migration needed]
- ❌ Not Compatible - [Why and what's affected]

**Compatibility Risks:**
[List any risks to existing functionality]

---

## Step 5: Customization Check

**Question 5:** Does this refinement introduce new custom rules or change existing ones documented in `docs/project_customization.md`? (Yes/No)

**Your Answer:** [Yes/No]

**Instructions for AI:** If the user answers "Yes" to Question 5, dynamically generate follow-up questions to understand the new or changed customizations. Ask about: what the custom rule is (or what changed), why it differs from general templates, what impact it has, and any specific implementation details. **CRITICAL:** After collecting all customization details, you MUST automatically update `docs/project_customization.md`:
- If new customization: Add new entry with date, feature ID, rule, impact, status
- If changing existing: Update the relevant entry with new date and modified details

**If Yes:** Describe the custom requirements:

**Your Answer:** [Custom requirements]

---

## Step 6: API/Prompt Check

**Question 6:** Will APIs or AI/LLM prompts be affected by this change? (Yes/No)

**Your Answer:** [Yes/No]

**Instructions for AI:** If the user answers "Yes" to Question 6, dynamically generate follow-up questions. First, ask which APIs/prompts are affected. Then, for each API/Prompt mentioned, generate questions about:
- What changes are needed
- For APIs: whether endpoints are changing (new, modified, removed), whether request/response format is changing, and if yes, what the new format is
- For AI Prompts: what prompt changes (system prompt, user prompt, structure), whether outputs will change, and if yes, what the new output format is, whether guardrails need updating
Generate these questions on the fly based on the specific APIs/prompts mentioned.

---

## Step 7: Confirmation & Approval

**Summary of Changes:**
- Feature: [FXXX]
- Files to update: [Count]
- Files to delete: [Count]
- Files to create: [Count]
- Breaking changes: [Yes/No]

**Files to be Modified/Deleted (based on features-map.json):**
[List all files with explanations]

---

**Approve changes?** (Yes/No)

**Your Answer:** [Yes/No]

**If No:** Please specify what needs adjustment.

**If Yes:** I will proceed with:
1. Delete only files mapped to this feature (never shared/core files)
2. Rebuild the feature according to the plan
3. Run regression tests automatically
4. Report results

---

## Step 8: Execution

**Executing Changes:**
1. ✅ Deleting feature files (only those in features-map.json)
2. ✅ Creating/updating files according to plan
3. ✅ Updating features-map.json if file list changed
4. ✅ Running regression tests
5. ✅ Running unit tests
6. ✅ Running integration tests
7. ✅ Running security checks (if applicable)

---

## Step 9: Post-Change Validation

**Test Results:**
- Unit Tests: [Pass/Fail] - [Details]
- Integration Tests: [Pass/Fail] - [Details]
- Regression Tests: [Pass/Fail] - [Details]
- Security Checks: [Pass/Fail] - [Details]

**Issues Found:**
[List any issues and resolutions]

---

## Step 10: Documentation Update

**Updating Logs:**
- ✅ Feature Log - [Updated]
- ✅ Change Log - [Entry added]
- ✅ Prompt Refinements - [If AI/prompts changed]
- ✅ docs/project_customization.md - [If Question 5 was "Yes", automatically updated with new/changed customizations]
- ✅ features-map.json - [If file list changed]
- ✅ Security Checks - [If security changes]

---

## Important: Complete Information Collection

**Instructions for AI:** Before proceeding to execution, you must ensure ALL required information has been collected. Continue asking dynamic follow-up questions based on the user's answers until you have:

**CRITICAL:** If the user mentions something not yet asked but related to feature refinement (what needs to change, affected parts, API/prompt changes, backward compatibility, etc.), dynamically generate follow-up questions until all related information is captured. Do not guess or assume - continue asking until all refinement requirements are fully specified.

- Complete understanding of what needs to change and why
- All affected parts fully specified (logic, UI, data, API, AI, security, performance)
- All specific changes detailed for each affected part
- All API/prompt changes fully specified (if applicable)
- Complete refinement plan with all files identified
- All backward compatibility implications understood

**Do NOT proceed to execution until:**
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

**If Yes:** I will verify that no assumptions are needed and proceed to execution.

---

## Verification Before Execution

**Before executing changes, verify:**
- ✅ All changes are fully specified (no assumptions)
- ✅ All affected files are identified
- ✅ All API/prompt changes are detailed (if applicable)
- ✅ Backward compatibility is understood
- ✅ All risks are identified
- ✅ No information is missing or assumed

**If any item above is not verified, continue asking questions.**

---

## Execution

**Only proceed if all information above is verified.**

**Refinement Complete:**
- ✅ Changes implemented
- ✅ Tests passing
- ✅ Documentation updated
- ✅ Logs updated
- ✅ Ready for deployment

**Status:** [Complete/Pending Issues]

---

## Next Steps

After successful refinement:
- Feature is ready for use
- If breaking changes: migration guide provided
- If issues found: resolution plan provided

