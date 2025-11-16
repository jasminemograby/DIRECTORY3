# Setup Scaffolding Template

**Purpose:** This template generates project scaffolding including folders, initial config files, and basic project structure.

**Expected Outputs:**
- Complete folder structure
- Initial configuration files
- Basic project setup
- Package.json files
- Environment variable templates

---

## Step 1: Project Structure

**Question 1:** What is the project name?

**Your Answer:** [Project name]

---

**Question 2:** Has the architecture been decided? (Yes/No)

**Your Answer:** [Yes/No]

**Instructions for AI:** Based on the user's answer to Question 2, dynamically generate follow-up questions. If "No", ask about architecture status and whether to proceed with Architecture-Decision-Template first. If "Yes", proceed to ask about scaffolding requirements. **Important:** If the user mentions something not yet asked but related to scaffolding (e.g., specific tools, frameworks, folder structures, configuration needs), dynamically generate follow-up questions until all related information is captured. Do not guess or assume - continue asking until all scaffolding requirements are fully specified.

---

## Step 2: Monorepo Structure

**Question 3:** What is the monorepo structure? (Based on architecture.md, confirm or modify)
- frontend/
- backend/
- database/
- shared/ (if needed)
- docs/
- Other: [Specify]

**Your Answer:** [Structure]

**Instructions for AI:** Based on the user's answer to Question 3, dynamically generate follow-up questions. Ask about additional top-level folders needed, shared code organization, and any special structure requirements. If "Other" directories are mentioned, ask about their purpose and organization. **Important:** If the user mentions something not yet asked but related to monorepo structure (e.g., workspace configuration, package management, build tools), dynamically generate follow-up questions until all related information is captured.

---

## Step 3: Frontend Scaffolding

**Question 4:** What frontend framework? (React, Vue, Angular, Other)

**Your Answer:** [Framework]

**Instructions for AI:** Based on the user's answer to Question 4, dynamically generate follow-up questions for each framework mentioned. For React: ask about React setup (Create React App, Vite, Next.js, Custom), TypeScript usage (and if No, confirm JavaScript ES6+ only), styling approach (Tailwind CSS, CSS Modules, Styled Components, Plain CSS), and if Tailwind CSS, ask about utility-only approach. For Vue/Angular/Other: ask about framework-specific setup, TypeScript usage, styling, and configuration. Ask about folder structure for frontend (confirm or modify). **Important:** If the user mentions something not yet asked but related to frontend scaffolding (e.g., build tools, testing setup, routing, state management), dynamically generate follow-up questions until all related information is captured.

---

## Step 4: Backend Scaffolding

**Question 5:** What backend runtime? (Node.js, Python, Java, Other)

**Your Answer:** [Runtime]

**Instructions for AI:** Based on the user's answer to Question 5, dynamically generate follow-up questions for each runtime mentioned. For Node.js: ask about framework (Express, Fastify, Koa, Other), TypeScript usage, and folder structure. For Python/Java/Other: ask about framework/library choices, language-specific setup, and folder structure. **Important:** If the user mentions something not yet asked but related to backend scaffolding (e.g., API structure, middleware, database connections, testing setup), dynamically generate follow-up questions until all related information is captured.

---

## Step 5: Database Scaffolding

**Question 6:** What database? (PostgreSQL, MySQL, MongoDB, Other)

**Your Answer:** [Database]

**Instructions for AI:** Based on the user's answer to Question 6, dynamically generate follow-up questions for each database mentioned. Ask about folder structure (migrations/, seeds/, schema.sql), ORM usage (and if Yes, which ORM), and database-specific setup requirements. **Important:** If the user mentions something not yet asked but related to database scaffolding (e.g., migration tools, seed data, connection pooling, database-specific features), dynamically generate follow-up questions until all related information is captured.

---

## Step 6: Configuration Files

**Question 7:** What configuration files are needed? (Select all that apply)
- package.json (frontend)
- package.json (backend)
- .env.example (frontend)
- .env.example (backend)
- .gitignore
- README.md
- .eslintrc (if using ESLint)
- .prettierrc (if using Prettier)
- tsconfig.json (if using TypeScript)
- Other: [Specify]

**Your Answer:** [Config files]

**Instructions for AI:** Based on the user's answer to Question 7, dynamically generate follow-up questions for each configuration file type mentioned. For .env.example files: ask what environment variables are needed, and for each variable mentioned, ask about purpose, required/optional status, and default values. For other config files: ask about configuration needs and setup requirements. **Important:** If the user mentions something not yet asked but related to configuration (e.g., specific environment variables, build configurations, tooling setup), dynamically generate follow-up questions until all related information is captured.

---

## Step 7: CI/CD Setup

**Question 8:** What CI/CD provider? (GitHub Actions, GitLab CI, Jenkins, Other, Not yet)

**Your Answer:** [Provider]

**Instructions for AI:** Based on the user's answer to Question 8, dynamically generate follow-up questions for each CI/CD provider mentioned. For GitHub Actions: ask about creating .github/workflows/ directory, what workflows are needed initially (test on PR, lint on PR, deploy on merge, etc.), and workflow configuration. For other providers: ask about provider-specific setup and workflow requirements. **Important:** If the user mentions something not yet asked but related to CI/CD (e.g., specific workflows, deployment targets, testing requirements), dynamically generate follow-up questions until all related information is captured.

---

## Step 8: Documentation Structure

**Question 9:** What documentation structure? (Confirm or modify)
- docs/
  - templates/
  - feature-docs/
  - Other: [Specify]

**Your Answer:** [Structure or "Use default"]

**Instructions for AI:** Based on the user's answer to Question 9, dynamically generate follow-up questions. Ask about specific documentation files needed, documentation structure requirements, and any special documentation needs. **Important:** If the user mentions something not yet asked but related to documentation (e.g., specific docs, templates, guides), dynamically generate follow-up questions until all related information is captured.

---

## Important: Complete Information Collection

**Instructions for AI:** Before proceeding to the Generation Phase, you must ensure ALL required information has been collected. Continue asking dynamic follow-up questions based on the user's answers until you have:

**CRITICAL:** If the user mentions something not yet asked but related to this template (scaffolding, project structure, configuration, tooling, etc.), dynamically generate follow-up questions until all related information is captured. Do not guess or assume - continue asking until all scaffolding requirements are fully specified.

- Complete project name and architecture confirmation
- All monorepo structure decisions specified
- All frontend scaffolding requirements specified
- All backend scaffolding requirements specified
- All database scaffolding requirements specified
- All configuration files requirements specified
- All CI/CD setup requirements specified (if applicable)
- All documentation structure specified

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
- ✅ Architecture is confirmed
- ✅ Monorepo structure is specified
- ✅ Frontend scaffolding is defined
- ✅ Backend scaffolding is defined
- ✅ Database scaffolding is defined
- ✅ Configuration files are specified
- ✅ CI/CD setup is defined (if applicable)
- ✅ No information is missing or assumed

**If any item above is not verified, continue asking questions.**

---

## Generation Phase

**Only proceed if all information above is verified.**

Based on your complete answers and architecture.md, I will now generate:

1. **Folder Structure** - All directories
2. **Configuration Files** - package.json, .env.example, etc.
3. **Basic Setup Files** - README, .gitignore, etc.
4. **Initial Code Structure** - Basic file templates

**Files to be created:**
- [List all files and folders with structure]

---

## Post-Scaffolding

After scaffolding:
- ✅ Folder structure created
- ✅ Configuration files created
- ✅ Basic README created
- ✅ .gitignore created
- ✅ Ready for feature implementation

---

## Next Steps

After scaffolding is complete:
- **Feature-Design-Template.md** - Design first features
- **Implementation-Template.md** - Start implementing features

