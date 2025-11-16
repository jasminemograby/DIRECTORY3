# Architecture Decision Template

**Purpose:** This template guides architecture decisions including monorepo structure, tech stack, CI/CD plan, and folder organization.

**Expected Outputs:**
- Architecture document (architecture.md)
- Tech stack decisions
- Folder structure
- CI/CD configuration
- Deployment strategy

---

## Step 1: Project Context

**Question 1:** What is the project name?

**Your Answer:** [Project name]

---

**Question 2:** What is the project scale? (Select one)
- Small (1-50 users)
- Medium (50-500 users)
- Large (500-5000 users)
- Enterprise (5000+ users)
- Other: [Specify]

**Your Answer:** [Scale]

**Instructions for AI:** Based on the user's answer to Question 2, dynamically generate follow-up questions. For Medium or larger scales, ask about expected growth rate and horizontal scaling requirements. For "Other", ask about the specific scale, expected user count, growth projections, and scaling requirements. Generate these questions on the fly based on the specific scale mentioned.

---

## Step 2: Tech Stack Decisions

**Question 3:** Has a tech stack been specified in requirements? (Yes/No)

**Your Answer:** [Yes/No]

**Instructions for AI:** Based on the user's answer to Question 3, dynamically generate follow-up questions. If "No", ask about preferences, constraints, or requirements that might inform tech stack selection. If "Yes", proceed to ask about the specific stack components. Generate these questions on the fly based on the answer.

---

**Question 4:** What is the frontend framework? (React, Vue, Angular, Other, Not specified)

**Your Answer:** [Framework]

**Instructions for AI:** Based on the user's answer to Question 4, dynamically generate follow-up questions. For each framework mentioned (React, Vue, Angular, or "Other"), ask about version, TypeScript usage, build tooling, state management, routing, and any framework-specific requirements. If "Other" is selected, ask about the framework name, version, documentation, community support, and why it was chosen. If "Not specified", ask about preferences, constraints, or requirements. Generate these questions on the fly based on the specific framework mentioned.

---

**Question 5:** What is the backend runtime? (Node.js, Python, Java, Other, Not specified)

**Your Answer:** [Runtime]

**Instructions for AI:** Based on the user's answer to Question 5, dynamically generate follow-up questions. For each runtime mentioned (Node.js, Python, Java, or "Other"), ask about version, framework/library choices, TypeScript usage (if applicable), package management, and runtime-specific requirements. If "Other" is selected, ask about the runtime name, version, documentation, deployment considerations, and why it was chosen. If "Not specified", ask about preferences, constraints, or requirements. Generate these questions on the fly based on the specific runtime mentioned.

---

**Question 6:** What is the database? (PostgreSQL, MySQL, MongoDB, Other, Not specified)

**Your Answer:** [Database]

**Instructions for AI:** Based on the user's answer to Question 6, dynamically generate follow-up questions. For each database mentioned (PostgreSQL, MySQL, MongoDB, or "Other"), ask about version, hosting platform, ORM/query builder usage, connection pooling, backup strategy, replication, and database-specific requirements. If "Other" is selected, ask about the database name, type (SQL/NoSQL), version, hosting, scaling considerations, and why it was chosen. If "Not specified", ask about data requirements, query patterns, and preferences. Generate these questions on the fly based on the specific database mentioned.

---

**Question 7:** What styling approach? (Tailwind CSS, CSS Modules, Styled Components, Plain CSS, Not specified)

**Your Answer:** [Styling]

**Instructions for AI:** Based on the user's answer to Question 7, dynamically generate follow-up questions. For each styling approach mentioned, ask about configuration, customization needs, build tooling integration, and any specific requirements. For Tailwind CSS, ask about utility-only approach, custom configuration, and whether standalone CSS files are allowed. For "Other" or "Not specified", ask about preferences, constraints, or design system requirements. Generate these questions on the fly based on the specific styling approach mentioned.

---

## Step 3: Monorepo Structure

**Question 8:** What is the monorepo structure? (Select all that apply)
- frontend/
- backend/
- database/
- shared/
- docs/
- Other: [Specify]

**Your Answer:** [Structure]

**Instructions for AI:** Based on the user's answer to Question 8, dynamically generate follow-up questions. Ask about shared utilities between frontend and backend, where shared code should live, what types of shared code are needed, and any additional directories or special structure requirements. If "Other" directories are mentioned, ask about their purpose and organization. Generate these questions on the fly based on the specific structure mentioned.

---

## Step 4: Deployment Strategy

**Question 9:** What are the deployment targets? (Select all that apply)
- Frontend: [Vercel, Netlify, AWS, Other]
- Backend: [Railway, Heroku, AWS, Other]
- Database: [Supabase, AWS RDS, Self-hosted, Other]

**Your Answer:** [Targets]

**Instructions for AI:** Based on the user's answer to Question 9, dynamically generate follow-up questions for each deployment target mentioned. For Frontend: ask about the specific platform, environment variables needed, build configuration, and deployment settings. For Backend: ask about the specific platform, port configuration, environment variables, scaling, and deployment settings. For Database: ask about the hosting platform, connection pooling, backup strategy, and database-specific settings. If "Other" is mentioned for any target, ask about the platform name, configuration, and why it was chosen. Generate these questions on the fly based on the specific targets mentioned.

---

## Step 5: CI/CD Configuration

**Question 10:** What CI/CD provider will be used? (GitHub Actions, GitLab CI, Jenkins, Other, Not specified)

**Your Answer:** [Provider]

**Instructions for AI:** Based on the user's answer to Question 10, dynamically generate follow-up questions. For each provider mentioned, ask about required workflows (tests, security scans, preview deploys, full deploys, migrations), secrets management, rollback hooks, health checks, and provider-specific configuration. If "Other" is selected, ask about the provider name, configuration approach, and why it was chosen. If "Not specified", ask about requirements and preferences. Generate these questions on the fly based on the specific provider mentioned.

---

## Step 6: API Design

**Question 11:** What API architecture? (REST, GraphQL, gRPC, Hybrid, Not specified)

**Your Answer:** [Architecture]

**Instructions for AI:** Based on the user's answer to Question 11, dynamically generate follow-up questions. For REST: ask about base path, response format, error response format, versioning strategy, and REST-specific requirements. For GraphQL: ask about schema design, resolvers, subscriptions, and GraphQL-specific requirements. For gRPC: ask about service definitions, protocol buffers, and gRPC-specific requirements. For Hybrid: ask about which architectures are combined and how. If "Other" or "Not specified", ask about requirements and preferences. Generate these questions on the fly based on the specific architecture mentioned.

---

## Step 7: Security Architecture

**Question 12:** What authentication approach? (JWT, Session-based, OAuth, API Keys, Not specified)

**Your Answer:** [Approach]

**Instructions for AI:** Based on the user's answer to Question 12, dynamically generate follow-up questions. For JWT: ask about token storage location, expiration strategy, refresh token handling, and JWT-specific requirements. For Session-based: ask about session storage, expiration, and session management. For OAuth: ask about which providers, scopes needed, token storage, and OAuth flow type. For API Keys: ask about key generation, storage, rotation, and usage. If "Other" or "Not specified", ask about requirements and preferences. Generate these questions on the fly based on the specific authentication approach mentioned.

---

## Important: Complete Information Collection

**Instructions for AI:** Before proceeding to the Generation Phase, you must ensure ALL required information has been collected. Continue asking dynamic follow-up questions based on the user's answers until you have:

- Complete project context and scale
- All tech stack decisions fully specified (frontend, backend, database, styling)
- Complete monorepo structure defined
- All deployment targets and strategies specified
- Complete CI/CD configuration requirements
- All API architecture decisions specified
- Complete security architecture defined

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
- ✅ Project context and scale are specified
- ✅ All tech stack decisions are complete
- ✅ Monorepo structure is defined
- ✅ Deployment strategy is specified
- ✅ CI/CD requirements are complete
- ✅ API architecture is decided
- ✅ Security architecture is defined
- ✅ No information is missing or assumed

**If any item above is not verified, continue asking questions.**

---

## Generation Phase

**Only proceed if all information above is verified.**

Based on your complete answers, I will now generate:

1. **architecture.md** - Complete architecture document
2. **Folder Structure** - Monorepo organization
3. **CI/CD Configuration** - GitHub Actions workflow
4. **Tech Stack Summary** - All technology decisions
5. **Deployment Plan** - Deployment strategy

**Files to be created:**
- `architecture.md`
- `.github/workflows/deploy.yml` (if GitHub Actions)
- `docs/architecture_decisions.md`

---

## Next Steps

After approval, we will proceed to:
- **Flow-Breakdown-Template.md** - Map requirements into detailed feature flows

