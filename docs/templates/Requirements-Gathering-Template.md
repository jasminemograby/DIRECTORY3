# Requirements Gathering Template

**Purpose:** This template collects detailed business and functional requirements, breaking them into the smallest independent features possible.

**Expected Outputs:**
- Complete requirements.md document
- Feature breakdown with IDs, titles, descriptions, inputs, outputs
- Dependencies mapping
- Artifact filenames for each feature

---

## Step 1: Business Requirements

**Question 1:** What is the primary business goal of this application? (Describe in 1-2 sentences)

**Your Answer:** [Business goal]

---

**Question 2:** Who are the stakeholders? (List all parties with interest in this project)

**Your Answer:** [Stakeholders]

**Instructions for AI:** Based on the user's answer to Question 2, dynamically generate follow-up questions for each stakeholder mentioned. For each stakeholder, ask about their main concerns, requirements, success criteria, and involvement level. Generate these questions on the fly based on the specific stakeholders mentioned.

---

**Question 3:** What are the success criteria? (How will you know the project is successful?)

**Your Answer:** [Success criteria]

---

## Step 2: Functional Requirements

**Question 4:** What are the main user workflows? (List 3-5 primary workflows)

**Your Answer:**
1. [Workflow 1]
2. [Workflow 2]
3. [Workflow 3]

**Instructions for AI:** Based on the user's answer to Question 4, dynamically generate follow-up questions for each workflow mentioned. For each workflow, ask about: step-by-step description from user's perspective, who performs the workflow (user role/type), what data is needed, what the expected outcome is, and any workflow-specific requirements. Generate these questions on the fly based on the specific workflows mentioned.

---

**Question 5:** What are the user roles and their permissions? (List all roles)

**Your Answer:** [Roles]

**Instructions for AI:** Based on the user's answer to Question 5, dynamically generate follow-up questions for each role mentioned. For each role, ask about: what the role can do (permissions), what the role cannot do (restrictions), what data the role can access, and any role-specific requirements. Generate these questions on the fly based on the specific roles mentioned.

---

## Step 3: Feature Breakdown

**Question 6:** Based on the workflows, what are the smallest independent features? (List 5-10 features)

**Your Answer:**
1. [Feature 1]
2. [Feature 2]
3. [Feature 3]

**Instructions for AI:** Based on the user's answer to Question 6, dynamically generate follow-up questions for each feature mentioned. For each feature, ask about: feature title, what the feature does (description), what inputs the feature needs (data, user actions, etc.), what outputs the feature produces (data, UI changes, etc.), whether the feature depends on other features, and if yes, which features. Generate these questions on the fly based on the specific features mentioned.

---

## Step 4: Non-Functional Requirements

**Question 7:** What are the performance requirements? (Response times, throughput, etc.)

**Your Answer:** [Performance requirements]

**Instructions for AI:** Based on the user's answer to Question 7, dynamically generate follow-up questions about: expected response times for critical operations, concurrent user support, expected data volume (records, file sizes), throughput requirements, scalability needs, and any performance-specific requirements. Generate these questions on the fly based on the specific performance requirements mentioned.

---

**Question 8:** What are the security requirements? (List key security concerns)

**Your Answer:** [Security requirements]

**Instructions for AI:** Based on the user's answer to Question 8, dynamically generate follow-up questions about: what data needs encryption (PII, financial, health data, etc.), what compliance requirements apply (GDPR, HIPAA, PCI-DSS, etc.), what authentication/authorization is needed, and any security-specific requirements. Generate these questions on the fly based on the specific security requirements mentioned.

---

**Question 9:** What are the availability requirements? (Uptime, backup, disaster recovery)

**Your Answer:** [Availability requirements]

**Instructions for AI:** Based on the user's answer to Question 9, dynamically generate follow-up questions about: target uptime (e.g., 99%, 99.9%, 99.99%), Recovery Time Objective (RTO - how quickly service must be restored), Recovery Point Objective (RPO - how much data loss is acceptable), backup strategy, disaster recovery plan, and any availability-specific requirements. Generate these questions on the fly based on the specific availability requirements mentioned.

---

## Step 5: Data Requirements

**Question 10:** What data needs to be stored? (List all data entities)

**Your Answer:** [Data entities]

**Instructions for AI:** Based on the user's answer to Question 10, dynamically generate follow-up questions for each data entity mentioned. For each entity, ask about: what fields/attributes the entity has, how long the entity data should be retained, relationships to other entities, and any entity-specific requirements. Generate these questions on the fly based on the specific data entities mentioned.

---

## Important: Complete Information Collection

**Instructions for AI:** Before proceeding to the Generation Phase, you must ensure ALL required information has been collected. Continue asking dynamic follow-up questions based on the user's answers until you have:

- Complete business requirements and success criteria
- All stakeholders and their concerns identified
- All user workflows fully specified
- All user roles and permissions completely defined
- Complete feature breakdown with all details (inputs, outputs, dependencies)
- All non-functional requirements specified (performance, security, availability)
- All data requirements fully specified

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
- ✅ Business requirements are complete
- ✅ All workflows are fully specified
- ✅ All roles and permissions are defined
- ✅ All features are broken down with complete details
- ✅ All non-functional requirements are specified
- ✅ All data requirements are complete
- ✅ No information is missing or assumed

**If any item above is not verified, continue asking questions.**

---

## Generation Phase

**Only proceed if all information above is verified.**

Based on your complete answers, I will now generate:

1. **requirements.md** - Complete requirements document
2. **Feature List** - All features with IDs, titles, descriptions
3. **Dependencies Map** - Feature dependency relationships
4. **Artifact Filenames** - Proposed file structure for each feature

**Files to be created:**
- `requirements.md`
- `docs/requirements_breakdown.md` (if needed)

---

## Next Steps

After approval, we will proceed to:
- **Architecture-Decision-Template.md** - Decide on architecture, tech stack, and structure

