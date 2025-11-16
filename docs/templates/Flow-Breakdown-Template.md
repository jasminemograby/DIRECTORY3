# Flow Breakdown Template

**Purpose:** This template maps requirements into detailed feature flows, specifying inputs, outputs, and data paths for each feature.

**Expected Outputs:**
- Complete flow.md document
- Feature flow diagrams
- Data flow specifications
- Input/output mappings

---

## Step 1: Requirements Review

Before starting, I will:
1. Read `requirements.md` to understand all features
2. Read `architecture.md` to understand system structure
3. Identify all features that need flow mapping

---

## Step 2: Feature Flow Mapping

**Question 1:** Which feature should we map first? (Provide Feature ID, e.g., F001, or "All" for all features)

**Your Answer:** [FXXX or "All"]

---

**Question 2:** What is the primary user flow for this feature? (List steps 1-10)

**Your Answer:**
1. [Step 1]
2. [Step 2]
3. [Step 3]

**Instructions for AI:** Based on the user's answer to Question 2, dynamically generate follow-up questions. Ask if there are alternative flows, and if yes, ask how many. Then, for each alternative flow mentioned, ask about: what the alternative flow is (list steps), when it occurs (trigger condition), and how it differs from the primary flow. Generate these questions on the fly based on the specific flows mentioned.

---

## Step 3: Actors & Services

**Question 3:** Who/what are the actors in this flow? (Select all that apply)
- Users (specify roles)
- Frontend application
- Backend services
- External APIs
- Database
- AI/LLM services
- Other microservices
- Other: [Specify]

**Your Answer:** [Actors]

**Instructions for AI:** Based on the user's answer to Question 3, dynamically generate follow-up questions for each actor mentioned. For each actor, ask about: the actor's role in this flow, what actions the actor performs, and any actor-specific requirements. If "Other" is mentioned, ask about the actor type, purpose, and role. Generate these questions on the fly based on the specific actors mentioned.

---

## Step 4: Data Flow

**Question 4:** What data flows through this feature? (List all data entities)

**Your Answer:** [Data entities]

**Instructions for AI:** Based on the user's answer to Question 4, dynamically generate follow-up questions for each data entity mentioned. For each entity, ask about: where the entity originates (user input, database, external API, etc.), where the entity goes (database, external API, user display, etc.), whether the entity is transformed along the way, and if yes, how it is transformed. Generate these questions on the fly based on the specific data entities mentioned.

---

## Step 5: Input/Output Specification

**Question 5:** What are the inputs to this feature? (List all inputs with sources)

**Your Answer:** [Inputs]

**Instructions for AI:** Based on the user's answer to Question 5, dynamically generate follow-up questions for each input mentioned. For each input, ask about: input format (JSON, form data, query params, etc.), whether the input is required or optional, whether the input is validated, and if yes, what validation rules apply. Generate these questions on the fly based on the specific inputs mentioned.

---

**Question 6:** What are the outputs of this feature? (List all outputs with destinations)

**Your Answer:** [Outputs]

**Instructions for AI:** Based on the user's answer to Question 6, dynamically generate follow-up questions for each output mentioned. For each output, ask about: output format (JSON, HTML, file, etc.), where the output goes (user display, database, external API, etc.), whether the output is stored, and if yes, where it is stored (database table, file system, cache, etc.). Generate these questions on the fly based on the specific outputs mentioned.

---

## Step 6: External Service Integration

**Question 7:** Does this flow involve external services? (Yes/No)

**Your Answer:** [Yes/No]

**Instructions for AI:** If the user answers "Yes" to Question 7, dynamically generate follow-up questions. First, ask which external services. Then, for each service mentioned, ask about: when in the flow the service gets called (at which step), what data is sent to the service, what data is received from the service, what happens if the service fails (retry, fallback, error, mock data), and if mock data is used, where mock data is stored. Generate these questions on the fly based on the specific services mentioned.

---

## Step 7: Error Handling

**Question 8:** What error scenarios exist in this flow? (List scenarios)

**Your Answer:** [Error scenarios]

**Instructions for AI:** Based on the user's answer to Question 8, dynamically generate follow-up questions for each error scenario mentioned. For each scenario, ask about: when the scenario occurs (at which step), how it is handled (show error, retry, fallback, log), what user-facing message is shown (if applicable), and any scenario-specific requirements. Generate these questions on the fly based on the specific error scenarios mentioned.

---

## Step 8: Flow Dependencies

**Question 9:** Does this flow depend on other features? (Yes/No)

**Your Answer:** [Yes/No]

**Instructions for AI:** If the user answers "Yes" to Question 9, dynamically generate follow-up questions. First, ask which features. Then, for each feature dependency mentioned, ask about: how the dependency works (must complete first, provides data, etc.), what data or functionality is provided, and any dependency-specific requirements. Generate these questions on the fly based on the specific feature dependencies mentioned.

---

## Important: Complete Information Collection

**Instructions for AI:** Before proceeding to the Generation Phase, you must ensure ALL required information has been collected. Continue asking dynamic follow-up questions based on the user's answers until you have:

- Complete primary user flow with all steps
- All alternative flows identified and specified (if applicable)
- All actors and their roles fully specified
- Complete data flow with all entities and transformations
- All inputs and outputs fully specified with formats
- All external service integrations detailed (if applicable)
- All error scenarios and handling specified
- All flow dependencies identified

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
- ✅ Primary flow is complete
- ✅ All alternative flows are specified (if applicable)
- ✅ All actors and roles are defined
- ✅ Data flow is complete
- ✅ All inputs/outputs are specified
- ✅ External services are detailed (if applicable)
- ✅ Error handling is specified
- ✅ No information is missing or assumed

**If any item above is not verified, continue asking questions.**

---

## Generation Phase

**Only proceed if all information above is verified.**

Based on your complete answers, I will now generate:

1. **Flow Document** - Complete flow.md with detailed step-by-step flows
2. **Data Flow Diagrams** - Visual representation of data paths
3. **Input/Output Mappings** - Complete I/O specifications
4. **Service Integration Map** - External service call points

**Files to be created/updated:**
- `flow.md`
- `docs/feature-docs/FXXX/flow.md` (if feature-specific)

---

## Next Steps

After approval, we will proceed to:
- **UI-UX-Design-Template.md** - Design UI/UX for features
- **Feature-Design-Template.md** - Design individual features

