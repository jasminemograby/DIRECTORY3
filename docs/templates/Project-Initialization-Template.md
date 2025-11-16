# Project Initialization Template

**Purpose:** This template collects initial non-technical questions about the project to define name, goals, users, and target platforms.

**Expected Outputs:**
- Project name and basic information
- User personas and goals
- Target platforms
- Initial project structure

---

## Step 1: Project Basics

**Question 1:** What is the name of your project?

**Your Answer:** [Project Name]

---

**Question 2:** What is the main purpose of this application? (Describe in 1-2 sentences what problem it solves)

**Your Answer:** [Purpose]

---

**Question 3:** Who are the primary users of this application? (Describe the main user types)

**Your Answer:** [User Types]

---

## Step 2: Scale & Growth

**Question 4:** How many users do you expect initially? (e.g., 10-50, 100-500, 1000+)

**Your Answer:** [User Count]

---

**Question 5:** Do you expect this to scale to thousands of users? (Yes/No)

**Your Answer:** [Yes/No]

---

**Question 6:** How many companies/organizations will use this? (If applicable)

**Your Answer:** [Count or N/A]

---

## Step 3: Platforms

**Question 7:** Which platforms should this application support? (Select all that apply)
- Desktop web browsers
- Tablet web browsers
- Mobile web browsers
- Native mobile apps
- Other: [Specify]

**Your Answer:** [Selected platforms]

**Instructions for AI:** Based on the user's answer to Question 7, dynamically generate follow-up questions. For each selected platform, ask relevant questions such as:
- For Mobile web browsers: screen sizes, mobile-specific features, touch interactions
- For Tablet web browsers: layout approach (shared with mobile or separate)
- For Native mobile apps: which platforms (iOS/Android), backend sharing approach
- If multiple platforms: responsive vs platform-specific design, platform constraints
Generate these questions on the fly based on the specific platforms mentioned.

---

## Step 4: Core Functionality

**Question 8:** What are the 3-5 most important features this application must have? (List in priority order)

**Your Answer:**
1. [Feature 1]
2. [Feature 2]
3. [Feature 3]
4. [Feature 4]
5. [Feature 5]

---

## Step 5: Data & Integration

**Question 9:** Will this application need to integrate with external services? (Yes/No)

**Your Answer:** [Yes/No]

**Instructions for AI:** If the user answers "Yes" to Question 9, dynamically generate follow-up questions. First, ask which services they need (payment processors, email services, social media APIs, cloud storage, authentication services, analytics, etc.). Then, for each service mentioned, generate questions about:
- Primary use case for that service
- Whether they have API keys/accounts
- Rate limits or quotas
- Service-specific requirements (e.g., for payment processors: payment methods and currencies; for social media APIs: what data to fetch and authorization needs; for authentication services: authentication methods and MFA requirements)
Generate these questions on the fly based on the specific services mentioned.

---

**Question 10:** What kind of data will users store in this application? (e.g., user profiles, documents, transactions)

**Your Answer:** [Data types]

**Instructions for AI:** Based on the user's answer to Question 10, dynamically generate follow-up questions. For each data type mentioned, ask relevant questions such as:
- For user profiles: what information fields, visibility settings (public/private)
- For documents: document types, file size ranges, versioning needs
- For transactions: transaction data fields, retention periods
- If sensitive data (PII, financial, health) is mentioned: compliance requirements (GDPR, HIPAA, PCI-DSS), encryption and security measures
Generate these questions on the fly based on the specific data types mentioned.

---

## Important: Complete Information Collection

**Instructions for AI:** Before proceeding to the Generation Phase, you must ensure ALL required information has been collected. Continue asking dynamic follow-up questions based on the user's answers until you have:

- Complete project basics (name, purpose, users)
- Full scale and growth expectations
- All platform requirements with specific details for each selected platform
- Complete core functionality list
- All external service integration details (if applicable)
- Complete data storage requirements with specific details for each data type

**Do NOT proceed to Generation Phase until:**
- All questions have been answered
- All follow-up questions based on answers have been asked and answered
- No assumptions or defaults are needed
- All required information is explicitly provided

If any information is missing, continue asking questions until it is provided.

---

## Final Checklist

**Have ALL required questions been asked and answered?** (Yes/No)

**Your Answer:** [Yes/No]

**If No:** I will continue asking questions until all required information is collected. Please specify what information is still needed.

**If Yes:** I will verify that no assumptions are needed and proceed to the Generation Phase.

---

## Verification Before Generation

**Before generating any outputs, verify:**
- ✅ All project basics are explicitly provided (no defaults)
- ✅ All platform requirements are fully specified
- ✅ All external service details are provided (if applicable)
- ✅ All data storage requirements are complete
- ✅ No information is missing or assumed

**If any item above is not verified, continue asking questions.**

---

## Generation Phase

**Only proceed if all information above is verified.**

Based on your complete answers, I will now generate:

1. **Project Summary Document** - Basic project information
2. **Initial Project Structure** - Folder organization
3. **User Personas** - User type definitions
4. **Platform Requirements** - Target platform specifications

**Files to be created:**
- `docs/project_summary.md`
- Initial folder structure
- `requirements.md` (initial draft)

---

## Next Steps

After approval, we will proceed to:
- **Requirements-Gathering-Template.md** - Collect detailed business and functional requirements

