# EDUCORE Directory Management System - Technical Overview

**Last Updated**: 2025-01-20  
**Version**: 1.0.0  
**Status**: Development/Testing Phase

---

## Table of Contents

1. [System Architecture](#system-architecture)
2. [Technology Stack](#technology-stack)
3. [Directory Structure](#directory-structure)
4. [Implemented Features](#implemented-features)
5. [System Flows](#system-flows)
6. [Authentication System](#authentication-system)
7. [Profile Enrichment Flow](#profile-enrichment-flow)
8. [Database Schema](#database-schema)
9. [Microservice Integration](#microservice-integration)
10. [Temporary/Dummy Implementations](#temporarydummy-implementations)
11. [Known Limitations](#known-limitations)
12. [Critical Files (DO NOT MODIFY)](#critical-files-do-not-modify)
13. [Development Guidelines](#development-guidelines)
14. [How to Continue Development](#how-to-continue-development)

---

## System Architecture

### Architecture Pattern: Onion Architecture (Clean Architecture)

The system follows a **3-layer Onion Architecture**:

```
┌─────────────────────────────────────┐
│   Presentation Layer (Controllers)  │  ← HTTP requests/responses
├─────────────────────────────────────┤
│   Application Layer (Use Cases)     │  ← Business logic
├─────────────────────────────────────┤
│   Infrastructure Layer (Repositories)│  ← Database, APIs, External services
└─────────────────────────────────────┘
```

### Layer Responsibilities

#### 1. **Presentation Layer** (`backend/src/presentation/`)
- **Purpose**: Handle HTTP requests and responses
- **Components**: Controllers that receive requests, validate input, call use cases, format responses
- **Key Files**:
  - `AuthController.js` - Login/logout/current user
  - `OAuthController.js` - LinkedIn/GitHub OAuth callbacks
  - `CompanyRegistrationController.js` - Company registration
  - `CSVUploadController.js` - CSV file upload and processing
  - `EmployeeController.js` - Employee CRUD operations
  - `EnrichmentController.js` - Profile enrichment endpoints
  - `UniversalEndpointController.js` - Generic microservice endpoint

#### 2. **Application Layer** (`backend/src/application/`)
- **Purpose**: Business logic and orchestration
- **Components**: Use cases that implement specific business workflows
- **Key Files**:
  - `AuthenticateUserUseCase.js` - User authentication logic
  - `EnrichProfileUseCase.js` - Profile enrichment orchestration
  - `ConnectLinkedInUseCase.js` - LinkedIn OAuth flow
  - `ConnectGitHubUseCase.js` - GitHub OAuth flow
  - `ParseCSVUseCase.js` - CSV parsing and employee creation
  - `GetEmployeeSkillsUseCase.js` - Fetch skills from Skills Engine
  - `GetEmployeeCoursesUseCase.js` - Fetch courses from Course Builder
  - `FillContentMetricsUseCase.js` - AI query generation for universal endpoint

#### 3. **Infrastructure Layer** (`backend/src/infrastructure/`)
- **Purpose**: External integrations and data persistence
- **Components**: Repositories, API clients, database connections
- **Key Files**:
  - `EmployeeRepository.js` - Employee database operations
  - `CompanyRepository.js` - Company database operations
  - `GeminiAPIClient.js` - Google Gemini AI integration
  - `LinkedInOAuthClient.js` - LinkedIn OAuth flow
  - `GitHubOAuthClient.js` - GitHub OAuth flow
  - `MicroserviceClient.js` - Generic client for other microservices
  - `MockDataService.js` - Fallback mock data when services fail

---

## Technology Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: PostgreSQL (Supabase)
- **ORM**: Native PostgreSQL client (`pg`)
- **Authentication**: Dummy auth (testing) + JWT-ready (production)
- **OAuth**: LinkedIn OpenID Connect, GitHub OAuth 2.0
- **AI**: Google Gemini 1.5 Flash API
- **File Processing**: `csv-parser`, `multer`

### Frontend
- **Framework**: React
- **Routing**: React Router
- **State Management**: React Context API
- **Styling**: Tailwind CSS + Design Tokens (CSS variables)
- **HTTP Client**: Axios with interceptors

### Deployment
- **Backend**: Railway
- **Frontend**: Vercel
- **Database**: Supabase (PostgreSQL)

---

## Directory Structure

```
DIRECTORY3/
├── backend/
│   ├── src/
│   │   ├── application/          # Use cases (business logic)
│   │   ├── infrastructure/       # Repositories, API clients
│   │   │   └── auth/             # Authentication providers
│   │   ├── presentation/         # Controllers (HTTP handlers)
│   │   ├── shared/               # Shared utilities
│   │   ├── scripts/              # Utility scripts
│   │   └── index.js              # Entry point
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/           # React components
│   │   ├── context/              # React Context providers
│   │   ├── pages/                # Page components
│   │   ├── services/             # API service functions
│   │   └── utils/                # Utility functions
│   └── package.json
├── database/
│   ├── migrations/
│   │   └── 001_initial_schema.sql  # Single migration file (policy: one migration only)
│   └── scripts/
│       └── clear_all_data.sql      # Database cleanup script
├── docs/                          # Documentation
├── mockData/                       # Mock data for fallbacks
└── design-tokens.json             # Design system tokens
```

---

## Implemented Features

### Core Features

#### 1. Company Registration & Verification
- **Company Registration**: HR/Manager registers company with basic info (name, industry, domain, HR contact)
- **Domain Verification**: Automatic domain validation (DNS check, MX records)
- **Auto-Approval**: Companies with valid domains are auto-approved
- **Company Settings**: Configurable settings (approval policy, KPIs, passing grade, max attempts, exercises)

#### 2. CSV Upload & Employee Management
- **CSV Upload**: Bulk employee import via CSV file
- **CSV Validation**: Comprehensive validation (format, required fields, data types, relationships)
- **Employee Creation**: Automatic creation of employees, departments, teams from CSV
- **Role Management**: Support for multiple roles per employee (REGULAR_EMPLOYEE, TRAINER, TEAM_MANAGER, DEPARTMENT_MANAGER, DECISION_MAKER)
- **Hierarchy Management**: Automatic manager relationships based on CSV data
- **Email Uniqueness**: Enforces unique emails across all companies

#### 3. Profile Enrichment (LinkedIn + GitHub + AI)
- **LinkedIn OAuth**: Connect LinkedIn account, fetch profile data
- **GitHub OAuth**: Connect GitHub account, fetch repositories and profile
- **AI Enrichment**: Google Gemini AI generates professional bio and project summaries
- **Profile Status**: State machine (basic → enriched → approved)
- **HR Approval**: Enriched profiles require HR approval before full access

#### 4. Employee Profile Management
- **Profile Viewing**: View employee profiles with bio, skills, courses, learning path
- **Profile Editing**: Employees can edit their own profiles
- **Profile Photo**: Fetched from LinkedIn (priority) or GitHub (fallback)
- **Role-Based Access**: Different views for HR, regular employees, trainers, decision makers

#### 5. Company Profile & Management
- **Company Dashboard**: Overview of company, departments, teams, employees
- **Hierarchy View**: Visual representation of company structure
- **Employee List**: Searchable, filterable, sortable employee list
- **Add Employee**: Manual entry or CSV upload for new employees
- **Company Logo**: Optional company logo (circular display)
- **Pending Approvals**: HR can approve/reject enriched employee profiles

#### 6. Learning & Development Integration
- **Skills Engine**: Normalized skills from LinkedIn/GitHub data
- **Course Builder**: Employee courses (assigned, in progress, completed)
- **Learner AI**: Personalized learning paths
- **Learning Analytics**: Learning dashboard with progress, activity, deadlines
- **Skills Gap Analysis**: Missing skills identification

#### 7. Request Management
- **Employee Requests**: Employees can submit requests (learn-new-skills, apply-trainer, self-learning)
- **Request Status**: Track request status (pending, approved, rejected)
- **Request History**: View all employee requests

#### 8. Trainer Features
- **Trainer Profile**: Special profile section for trainers
- **Trainer Settings**: AI-enabled, public publish settings
- **Courses Taught**: List of courses taught by trainer

#### 9. Decision Maker Features
- **Learning Path Approvals**: Decision makers can approve learning path requests
- **Approval Dashboard**: View pending learning path approvals
- **Approval Count**: Display number of pending approvals

#### 10. Universal Microservice Endpoint
- **AI Query Generation**: Dynamically generate SQL queries using Gemini AI
- **Generic Endpoint**: `/api/fill-content-metrics` for all microservice communication
- **Envelope Pattern**: Standardized request/response format
- **Fallback Mechanism**: Mock data when microservices fail

### User Roles & Access

#### HR/Manager
- **Company Profile Access**: View and manage company profile
- **Employee Management**: Add, edit, view employees
- **Profile Approvals**: Approve/reject enriched employee profiles
- **Company Settings**: Configure company settings (KPIs, approval policy, etc.)

#### Regular Employee
- **Profile Enrichment**: Connect LinkedIn and GitHub (one-time)
- **Profile Viewing**: View own profile
- **Profile Editing**: Edit own profile information
- **Learning & Development**: View skills, courses, learning path, dashboard (after approval)
- **Request Submission**: Submit learning requests

#### Trainer
- **All Regular Employee Features** +
- **Trainer Profile**: Special trainer section
- **Trainer Settings**: Configure AI and publish settings
- **Courses Taught**: View courses taught

#### Decision Maker
- **All Regular Employee Features** +
- **Learning Path Approvals**: Approve learning path requests from employees
- **Approval Dashboard**: View pending approvals

---

## System Flows

### 1. Company Registration Flow

```
1. HR/Manager visits registration page
   ↓
2. Fill registration form:
   - Company name
   - Industry
   - Domain
   - HR contact name
   - HR contact email
   - HR contact role
   ↓
3. Submit registration
   ↓
4. Backend: RegisterCompanyUseCase
   - Create company record
   - Create HR employee record (from HR contact info)
   - Set verification_status = 'pending'
   ↓
5. Backend: VerifyCompanyUseCase (automatic)
   - Validate domain (DNS, MX records)
   - If valid → Set verification_status = 'approved'
   ↓
6. Redirect to CSV upload page
   ↓
7. HR uploads CSV with employees
   ↓
8. CSV processing:
   - Parse CSV
   - Validate data
   - Create departments, teams, employees
   - Set up relationships (managers, roles)
   ↓
9. Redirect to Company Profile
```

### 2. Employee Login Flow

```
1. Employee visits login page
   ↓
2. Enter email + password
   ↓
3. Backend: AuthenticateUserUseCase
   - Find employee by email
   - Verify password (bcrypt)
   - Generate dummy token
   - Build user object with roles, profile status, OAuth status
   ↓
4. Frontend: Store token + user in localStorage
   ↓
5. Route based on profile status:
   
   IF profile_status === 'basic' AND NOT bothOAuthConnected:
     → Redirect to /enrich (Enrichment Page)
   
   ELSE IF isHR:
     → Redirect to /company/{companyId} (Company Profile)
   
   ELSE:
     → Redirect to /employee/{employeeId} (Employee Profile)
```

### 3. Profile Enrichment Flow

See [Profile Enrichment Flow](#profile-enrichment-flow) section above for complete details.

### 4. HR Approval Flow

```
1. Employee completes enrichment
   - Profile status = 'enriched'
   - Approval request created in employee_profile_approvals
   ↓
2. HR logs in
   - Redirected to Company Profile
   ↓
3. HR navigates to "Pending Profile Approvals" tab
   ↓
4. HR sees list of pending approvals
   ↓
5. HR clicks on employee name
   ↓
6. HR views enriched profile (bio, project summaries)
   ↓
7. HR clicks "Approve" or "Reject"
   ↓
8. Backend: Update profile_status to 'approved' or 'rejected'
   ↓
9. Employee logs in again
   ↓
10. IF approved:
    - Profile shows "✓ Profile Approved"
    - Learning & Development section visible
    - Skills, Courses, Learning Path, Dashboard, Requests all accessible
```

### 5. Employee Profile Viewing Flow

```
1. Employee logs in (after approval)
   ↓
2. Redirected to /employee/{employeeId}
   ↓
3. Employee Profile Page displays:
   
   Basic Information:
   - Employee ID, Email, Department, Team
   - Current Role, Target Role
   - Preferred Language, Status
   
   Professional Links:
   - LinkedIn URL, GitHub URL
   
   Professional Bio:
   - AI-generated bio (if enriched)
   
   Project Summaries:
   - AI-generated summaries from GitHub repos
   
   Learning & Development (if approved):
   - Skills (from Skills Engine)
   - Courses (from Course Builder)
   - Learning Path (from Learner AI)
   - Dashboard (from Learning Analytics)
   - Requests (employee requests)
   
   Trainer Profile (if trainer):
   - Trainer Settings
   - Courses Taught
   
   Learning Path Approvals (if decision maker):
   - Pending approvals list
```

### 6. CSV Upload Flow

```
1. HR/Manager on CSV upload page
   ↓
2. Select CSV file
   ↓
3. Click "Upload CSV"
   ↓
4. Backend: CSVUploadController
   ↓
5. ParseCSVUseCase:
   - Parse CSV file
   - Normalize rows
   - Validate data (format, types, relationships)
   ↓
6. IF validation fails:
   - Return errors to frontend
   - Display errors on page
   - User corrects CSV and re-uploads
   ↓
7. IF validation passes:
   - Start database transaction
   - Update company settings (from first row)
   - Create departments (if not exist)
   - Create teams (if not exist)
   - Create/update employees
   - Create employee roles
   - Assign employees to teams
   - Create manager relationships
   - Create trainer settings (if applicable)
   - Commit transaction
   ↓
8. Return success message
   ↓
9. Show "Continue" button (don't auto-redirect)
   ↓
10. User clicks "Continue"
    ↓
11. Redirect to Company Profile
```

### 7. Microservice Integration Flow

```
1. Employee profile page loads (after approval)
   ↓
2. Frontend calls API: GET /companies/{companyId}/employees/{employeeId}/skills
   ↓
3. Backend: EmployeeController.getEmployeeSkills()
   ↓
4. GetEmployeeSkillsUseCase:
   - Verify employee exists
   - Verify profile is approved
   - Get employee roles (trainer vs regular)
   - Get LinkedIn/GitHub raw data
   ↓
5. MicroserviceClient.getEmployeeSkills():
   - Build envelope: { requester_service, payload, response }
   - Stringify envelope
   - POST to Skills Engine: /api/fill-content-metrics
   ↓
6. IF success:
   - Parse response
   - Return skills data
   ↓
7. IF failure:
   - Log error
   - Fallback to MockDataService
   - Return mock skills data
   ↓
8. Frontend displays skills in ProfileSkills component
```

### 8. Learning Path Approval Flow (Decision Maker)

```
1. Employee submits learning path request
   ↓
2. Request stored in employee_requests table
   ↓
3. Decision Maker logs in
   ↓
4. Decision Maker sees "Learning Path Approvals" section
   ↓
5. Decision Maker sees count: "4 waiting approvals"
   ↓
6. Decision Maker clicks on approval item
   ↓
7. Redirect to Learner AI microservice frontend
   (Currently: placeholder/mock - will redirect when Learner AI frontend is available)
   ↓
8. Decision Maker reviews and approves/rejects
   ↓
9. Request status updated
```

---

## Authentication System

### Current Implementation: **Dummy Authentication** (Testing Only)

**⚠️ CRITICAL**: The system currently uses **dummy authentication** for testing. This is **NOT secure** and must be replaced with real JWT-based authentication before production.

### Authentication Flow

```
1. User submits email + password
   ↓
2. AuthenticateUserUseCase.execute(email, password)
   ↓
3. Find employee by email in database
   ↓
4. Verify password using bcrypt.compare()
   ↓
5. Generate dummy token: `dummy-token-{employeeId}-{email}-{timestamp}`
   ↓
6. Return token + user object to frontend
   ↓
7. Frontend stores token in localStorage
   ↓
8. Token included in Authorization header for subsequent requests
```

### Dummy Token Format

```
dummy-token-{employeeId}-{email}-{timestamp}
Example: dummy-token-7d57bfa5-4e8f-445b-b657-eff274c9b3f1-emily.davis@innovate.io-1705678901234
```

### Token Validation

- **Current**: `authMiddleware.js` validates dummy tokens by extracting employee ID from token string
- **Future**: Will validate JWT tokens from Auth Service

### Authentication Files

- **Backend**:
  - `backend/src/infrastructure/auth/DummyAuthProvider.js` - Dummy auth implementation
  - `backend/src/infrastructure/auth/AuthFactory.js` - Factory to switch between dummy/auth-service
  - `backend/src/shared/authMiddleware.js` - Token validation middleware
  - `backend/src/application/AuthenticateUserUseCase.js` - Authentication logic

- **Frontend**:
  - `frontend/src/context/AuthContext.js` - Auth state management
  - `frontend/src/services/authService.js` - Auth API calls

### Password Hashing

- **Algorithm**: bcrypt (10 rounds)
- **Storage**: `employees.password_hash` column
- **Default Password**: If CSV password is empty, uses `SecurePass123`
- **Update Behavior**: Only updates password if provided in CSV (preserves existing hash if not)

---

## Profile Enrichment Flow

### Overview

The enrichment flow is a **critical feature** that must not be broken. It combines LinkedIn + GitHub OAuth → Gemini AI → Profile Enrichment → HR Approval.

### Complete Flow Diagram

```
1. Employee First Login
   ↓
2. Redirect to /enrich (EnrichProfilePage)
   ↓
3. Employee clicks "Connect LinkedIn"
   ↓
4. Redirect to LinkedIn OAuth
   ↓
5. User authorizes → LinkedIn redirects back
   ↓
6. Backend: handleLinkedInCallback()
   - Exchange code for access token
   - Fetch LinkedIn profile data
   - Store in employees.linkedin_data (JSONB)
   - Generate dummy token + user object
   - Redirect to /enrich?linkedin=connected&token=...&user=...
   ↓
7. Frontend: Extract token + user from URL
   - Store in localStorage
   - Update linkedinConnected state
   - Show "✓ LinkedIn connected successfully!"
   - Clear URL params (linkedin, token, user)
   ↓
8. Employee clicks "Connect GitHub"
   ↓
9. Redirect to GitHub OAuth
   ↓
10. User authorizes → GitHub redirects back
   ↓
11. Backend: handleGitHubCallback()
    - Exchange code for access token
    - Fetch GitHub profile + repositories
    - Store in employees.github_data (JSONB)
    - Check: Both linkedin_data AND github_data exist?
    - YES → Trigger enrichment automatically
    - Generate dummy token + user object
    - Redirect to /enrich?github=connected&token=...&user=...
   ↓
12. EnrichProfileUseCase.enrichProfile()
    - Fetch LinkedIn + GitHub data
    - Call GeminiAPIClient.generateBio()
    - Call GeminiAPIClient.generateProjectSummaries()
    - Store bio in employees.bio
    - Store project summaries in employee_project_summaries table
    - Update profile_status to 'enriched'
    - Create approval request in employee_profile_approvals
   ↓
13. Frontend: Detect both connected
    - Show "✓ Both LinkedIn and GitHub connected!"
    - Redirect to /employee/{id}?enrichment=complete
   ↓
14. Employee Profile Page
    - Shows "⏳ Waiting for HR Approval"
    - Learning & Development section HIDDEN (only visible when approved)
   ↓
15. HR logs in → Company Profile → Pending Profile Approvals tab
   ↓
16. HR clicks "Approve" on employee profile
   ↓
17. Backend: Update profile_status to 'approved'
   ↓
18. Employee logs in again
   ↓
19. Employee Profile Page
    - Shows "✓ Profile Approved"
    - Learning & Development section VISIBLE
    - Skills, Courses, Learning Path, Dashboard, Requests all visible
```

### Critical Enrichment Files

**Backend**:
- `backend/src/presentation/OAuthController.js` - OAuth callbacks, token generation, enrichment trigger
- `backend/src/application/EnrichProfileUseCase.js` - Enrichment orchestration
- `backend/src/infrastructure/GeminiAPIClient.js` - Gemini API calls, prompt building
- `backend/src/infrastructure/EmployeeRepository.js` - `updateLinkedInData()`, `updateGitHubData()`, `updateEnrichment()`

**Frontend**:
- `frontend/src/pages/EnrichProfilePage.js` - OAuth callback handling, state management
- `frontend/src/context/AuthContext.js` - Token persistence during OAuth
- `frontend/src/components/LinkedInConnectButton.js` - LinkedIn OAuth initiation
- `frontend/src/components/GitHubConnectButton.js` - GitHub OAuth initiation

### Profile Status States

- `basic` - Initial state (no enrichment)
- `enrichment_pending` - Not currently used
- `enriched` - After Gemini enrichment completes (waiting for HR approval)
- `approved` - After HR approves (employee can use full features)

### OAuth Token Persistence (Critical Fix)

**Problem**: Token was lost during OAuth redirects, causing redirect to login page.

**Solution**:
1. Backend includes token + user in ALL OAuth redirect URLs (even on errors)
2. Frontend extracts and stores token + user from URL before any validation
3. AuthContext skips token validation during OAuth callbacks
4. Use boolean coercion (`!!errorParam`) for OAuth callback detection

**See**: `docs/OAUTH-TOKEN-PERSISTENCE-FIX.md`, `docs/ENRICHMENT-FEATURE-PROTECTION.md`

---

## Database Schema

### Key Tables

#### `companies`
- Company information, HR contact, verification status
- Company settings: `passing_grade`, `max_attempts`, `exercises_limited`, `num_of_exercises`
- `logo_url` - Optional company logo (circular display)

#### `employees`
- Employee basic info: `full_name`, `email`, `employee_id`
- Authentication: `password_hash` (bcrypt)
- Profile: `bio` (AI-generated), `profile_photo_url`, `profile_status`
- OAuth data: `linkedin_data` (JSONB), `github_data` (JSONB)
- Roles: `current_role_in_company`, `target_role_in_company`
- Settings: `preferred_language`, `status`

#### `employee_roles`
- Many-to-many: Employees can have multiple roles
- Roles: `REGULAR_EMPLOYEE`, `TRAINER`, `TEAM_MANAGER`, `DEPARTMENT_MANAGER`, `DECISION_MAKER`
- Combinations allowed: `REGULAR_EMPLOYEE + DECISION_MAKER`

#### `employee_project_summaries`
- AI-generated project summaries from GitHub repositories
- Linked to `employees.id`

#### `employee_profile_approvals`
- HR approval requests for enriched profiles
- Status: `pending`, `approved`, `rejected`

#### `departments`, `teams`
- Company hierarchy structure

### Migration Policy

**⚠️ CRITICAL**: This project has a **one migration file policy**. All schema changes must be added to `database/migrations/001_initial_schema.sql`. Do NOT create additional migration files.

---

## Microservice Integration

### Universal Endpoint Pattern

All microservice communication uses a **universal endpoint pattern**:

**Endpoint**: `POST /api/fill-content-metrics`

**Request Envelope**:
```json
{
  "requester_service": "directory",
  "payload": {
    "employee_id": "EMP001",
    "company_id": "COMP001",
    ...
  },
  "response": {
    "user_id": "",
    "competencies": [],
    ...
  }
}
```

**Response Envelope**:
```json
{
  "requester_service": "directory",
  "payload": { ... },  // Echo original payload
  "response": { ... }  // Filled response
}
```

**Important**: Request body is **stringified JSON** (not plain JSON object).

### Integrated Microservices

1. **Skills Engine** (`skillsEngine`)
   - Endpoint: `/api/fill-content-metrics`
   - Purpose: Normalize skills from LinkedIn/GitHub raw data
   - Method: `MicroserviceClient.getEmployeeSkills()`

2. **Course Builder** (`courseBuilder`)
   - Endpoint: `/api/fill-content-metrics`
   - Purpose: Get employee courses (assigned, in progress, completed)
   - Method: `MicroserviceClient.getEmployeeCourses()`

3. **Learner AI** (`learnerAI`)
   - Endpoint: `/api/fill-learner-ai-fields` (⚠️ Different endpoint)
   - Purpose: Get personalized learning path
   - Method: `MicroserviceClient.getLearningPath()`

4. **Learning Analytics** (`learningAnalytics`)
   - Endpoint: `/api/fill-content-metrics`
   - Purpose: Get learning dashboard data
   - Method: `MicroserviceClient.getLearningDashboard()`

5. **Management & Reporting** (`managementReporting`)
   - Endpoint: `/api/fill-content-metrics`
   - Purpose: Company-level analytics

6. **Content Studio** (`contentStudio`)
   - Endpoint: `/api/fill-content-metrics`
   - Purpose: Course creation, trainer status

7. **Assessment** (`assessment`)
   - Endpoint: `/api/fill-content-metrics`
   - Purpose: Assessment results

### Fallback Mechanism

**All microservice calls have fallback to mock data**:
- If microservice call fails → `MockDataService.getMockData()`
- Mock data stored in `mockData/index.json`
- Ensures system continues working even if microservices are down

### AI Query Generator

**Purpose**: Generate SQL queries dynamically using Gemini AI for the universal endpoint.

**File**: `backend/src/infrastructure/AIQueryGenerator.js`

**How it works**:
1. Receives payload + response template
2. Loads database schema from `001_initial_schema.sql`
3. Calls Gemini API with prompt: "Generate SQL to fill response template from payload"
4. Validates generated SQL (must be SELECT only, no DDL/DML)
5. Returns SQL query

**Use Case**: `FillContentMetricsUseCase.js` - Executes AI-generated query and maps results to response template.

---

## Temporary/Dummy Implementations

### 1. Dummy Authentication

**Location**: `backend/src/infrastructure/auth/DummyAuthProvider.js`

**What it does**:
- Generates dummy tokens (not real JWTs)
- Validates tokens by parsing employee ID from token string
- No real security - for testing only

**How to replace**:
- Set `AUTH_MODE=auth-service` in Railway
- Configure `AUTH_SERVICE_URL` and `JWT_SECRET`
- Implement `AuthServiceProvider.js` to call real Auth Service

### 2. Mock Data Service

**Location**: `backend/src/infrastructure/MockDataService.js`, `mockData/index.json`

**What it does**:
- Provides fallback data when microservices fail
- Used by `MicroserviceClient` for all microservice calls
- Ensures system works even if external services are down

**When to keep**: Always keep as fallback mechanism

### 3. Default Passwords

**Location**: `backend/src/application/ParseCSVUseCase.js`

**What it does**:
- If CSV password is empty, uses `SecurePass123` as default
- This is a temporary solution for testing

**Future**: Require password in CSV or implement password reset flow

### 4. Dummy Token in OAuth Callbacks

**Location**: `backend/src/presentation/OAuthController.js`

**What it does**:
- Generates dummy tokens during OAuth callbacks
- Includes token + user in redirect URL

**Future**: Replace with real JWT from Auth Service

### 5. Profile Photo Fallback

**Location**: `backend/src/infrastructure/EmployeeRepository.js`

**What it does**:
- Fetches profile photo from LinkedIn (priority)
- Falls back to GitHub photo if LinkedIn photo not available
- Falls back to placeholder (first letter of name) if neither available

---

## Known Limitations

### 1. Single Migration File Policy

- All schema changes must go in `001_initial_schema.sql`
- Cannot split migrations into multiple files
- Must use `ALTER TABLE` statements for updates

### 2. Dummy Authentication

- Not secure - must be replaced before production
- Tokens are just strings, not cryptographically signed
- No token expiration or refresh mechanism

### 3. OAuth State Management

- State parameter contains employee ID (base64 encoded)
- No expiration on state - could be reused if intercepted
- Future: Add state expiration and cryptographic signing

### 4. CSV Password Handling

- If password is empty in CSV, uses default `SecurePass123`
- No password strength validation
- No password reset flow

### 5. HR Identification

- Currently assumes one HR per company (the registrant)
- HR identified by matching `employees.email` with `companies.hr_contact_email`
- No multi-HR support yet

### 6. Decision Maker Role

- Only one Decision Maker per company (from CSV `decision_maker_id`)
- Decision Maker sees "Learning Path Approvals" tab
- No delegation or multiple decision makers

### 7. Profile Status Transitions

- `enrichment_pending` status exists but is not used
- Direct transition: `basic` → `enriched` → `approved`
- No rejection workflow (status exists but not implemented)

### 8. Microservice Error Handling

- All microservice failures fall back to mock data
- No retry mechanism
- No error notification to admins

### 9. Gemini API

- Uses free tier (Gemini 1.5 Flash)
- Rate limits: 25 RPM, 250K TPM, 500 RPD
- No retry on rate limit errors
- Generic fallback if API fails

### 10. LinkedIn OAuth Scopes

- Currently uses OpenID Connect scopes: `openid`, `profile`, `email`
- Legacy scopes (`r_liteprofile`, `r_emailaddress`) not supported
- Requires "Sign In with LinkedIn using OpenID Connect" product in LinkedIn app

---

## Critical Files (DO NOT MODIFY)

### Enrichment Flow Protection

These files are **critical** for the enrichment flow. Do NOT modify without:
1. Understanding the complete flow
2. Testing end-to-end (OAuth → Enrichment → Profile → Approval)
3. Reading `docs/ENRICHMENT-FEATURE-PROTECTION.md`

**Backend**:
- `backend/src/presentation/OAuthController.js` - OAuth callbacks, token generation
- `backend/src/application/EnrichProfileUseCase.js` - Enrichment orchestration
- `backend/src/infrastructure/GeminiAPIClient.js` - Gemini API integration
- `backend/src/infrastructure/EmployeeRepository.js` - `updateLinkedInData()`, `updateGitHubData()`, `updateEnrichment()`

**Frontend**:
- `frontend/src/pages/EnrichProfilePage.js` - OAuth callback handling
- `frontend/src/context/AuthContext.js` - Token persistence during OAuth
- `frontend/src/components/LinkedInConnectButton.js` - LinkedIn OAuth initiation
- `frontend/src/components/GitHubConnectButton.js` - GitHub OAuth initiation

### Authentication Protection

**Backend**:
- `backend/src/infrastructure/auth/DummyAuthProvider.js` - Dummy auth implementation
- `backend/src/shared/authMiddleware.js` - Token validation
- `backend/src/application/AuthenticateUserUseCase.js` - Authentication logic

**Frontend**:
- `frontend/src/context/AuthContext.js` - Auth state management

### Database Schema

- `database/migrations/001_initial_schema.sql` - **Single migration file** (do not split)

### Configuration

- `backend/src/config.js` - Microservice URLs, auth config
- `design-tokens.json` - Design system tokens

---

## Development Guidelines

### 1. Architecture Rules

- **Follow Onion Architecture**: Controllers → Use Cases → Repositories
- **No direct database access from controllers**: Always use repositories
- **No business logic in repositories**: Only data access
- **Use cases orchestrate**: Call multiple repositories/services

### 2. Error Handling

- **Always use try-catch** in controllers
- **Return proper HTTP status codes**: 400 (bad request), 401 (unauthorized), 404 (not found), 500 (server error)
- **Log errors** with context: `console.error('[ComponentName] Error:', error)`
- **Use ErrorTranslator** for user-friendly error messages

### 3. Database Transactions

- **Use transactions** for multi-step operations (CSV upload, enrichment)
- **Always rollback on error**: `await client.query('ROLLBACK')`
- **Release connection**: `client.release()` in finally block

### 4. OAuth Flow Rules

- **Always include token + user in redirect URLs** (even on errors)
- **Use boolean coercion** for OAuth callback detection: `!!errorParam`
- **Never redirect to login during OAuth callbacks** (including errors)
- **Clear URL params after processing**: Remove `linkedin`, `github`, `token`, `user` from URL

### 5. Password Handling

- **Always hash passwords** with bcrypt (10 rounds)
- **Only update password if provided** in CSV (preserve existing hash if not)
- **Use default password** (`SecurePass123`) if CSV password is empty

### 6. Microservice Integration

- **Always use envelope structure**: `{ requester_service, payload, response }`
- **Stringify request body**: `JSON.stringify(envelope)`
- **Always have fallback**: Use `MockDataService` if microservice fails
- **Log microservice calls**: Success and failure

### 7. Frontend State Management

- **Use React Context** for global state (AuthContext)
- **Store token + user in localStorage** (temporary - will use cookies with JWT)
- **Clear URL params** after OAuth callbacks
- **Check OAuth callback state** before redirecting

### 8. Testing

- **Test end-to-end flows**: OAuth → Enrichment → Profile → Approval
- **Test error cases**: OAuth failures, microservice failures, validation errors
- **Check Railway logs** for backend errors
- **Check browser console** for frontend errors

---

## How to Continue Development

### Starting a New Chat Session

1. **Read this document first** - Understand the system architecture
2. **Read `docs/ENRICHMENT-FEATURE-PROTECTION.md`** - Understand critical enrichment flow
3. **Check `docs/OAUTH-TOKEN-PERSISTENCE-FIX.md`** - Understand OAuth token handling
4. **Review recent commits** - Understand what was changed recently

### Before Making Changes

1. **Identify affected layers** - Which layer(s) need changes?
2. **Check critical files list** - Are you modifying a protected file?
3. **Understand dependencies** - What other components depend on this?
4. **Plan testing** - How will you test the changes?

### Making Changes Safely

1. **Start with small changes** - Don't refactor everything at once
2. **Test incrementally** - Test after each change
3. **Check for regressions** - Ensure existing features still work
4. **Update documentation** - Document new features or changes

### Common Tasks

#### Adding a New Feature

1. Create use case in `backend/src/application/`
2. Create repository method in `backend/src/infrastructure/`
3. Create controller endpoint in `backend/src/presentation/`
4. Add frontend service in `frontend/src/services/`
5. Add frontend component/page in `frontend/src/`
6. Update routes in `frontend/src/App.js`
7. Test end-to-end

#### Fixing a Bug

1. Reproduce the bug
2. Check logs (Railway for backend, browser console for frontend)
3. Identify root cause
4. Fix in appropriate layer
5. Test fix
6. Check for regressions
7. Document fix if critical

#### Integrating a New Microservice

1. Add microservice config to `backend/src/config.js`
2. Add method to `MicroserviceClient.js`
3. Add use case to call microservice
4. Add controller endpoint
5. Add mock data to `mockData/index.json`
6. Test with real service and fallback

### Environment Variables

**Backend (Railway)**:
- `DATABASE_URL` - PostgreSQL connection string
- `GEMINI_API_KEY` - Google Gemini API key
- `LINKEDIN_CLIENT_ID` - LinkedIn OAuth client ID
- `LINKEDIN_CLIENT_SECRET` - LinkedIn OAuth client secret
- `GITHUB_CLIENT_ID` - GitHub OAuth client ID
- `GITHUB_CLIENT_SECRET` - GitHub OAuth client secret
- `FRONTEND_URL` - Frontend URL for OAuth redirects
- `AUTH_MODE` - `dummy` (current) or `auth-service` (future)

**Frontend (Vercel)**:
- `REACT_APP_API_URL` - Backend API URL

### Database Management

**Clear Database**:
- Use `database/scripts/clear_all_data.sql` in Supabase SQL Editor
- Or use `backend/src/scripts/clearDatabase.js` (Node.js script)

**Migration**:
- Add changes to `database/migrations/001_initial_schema.sql`
- Run migration in Supabase SQL Editor
- **Never create new migration files**

### Deployment

**Backend (Railway)**:
- Auto-deploys on push to `main` branch
- Check Railway logs for errors
- Health check: `GET /health`

**Frontend (Vercel)**:
- Auto-deploys on push to `main` branch
- Check Vercel build logs for errors

---

## Warnings

### ⚠️ DO NOT:

1. **Split migration files** - Only use `001_initial_schema.sql`
2. **Modify enrichment flow without testing** - Read `docs/ENRICHMENT-FEATURE-PROTECTION.md` first
3. **Remove OAuth token/user from redirect URLs** - Always include both (even on errors)
4. **Remove fallback mechanisms** - Always have mock data fallback
5. **Skip boolean coercion in OAuth detection** - Use `!!errorParam`, not `errorParam`
6. **Redirect to login during OAuth callbacks** - Show error on enrich page instead
7. **Remove password hashing** - Always hash passwords with bcrypt
8. **Modify critical files without understanding dependencies** - Check critical files list
9. **Remove design tokens** - Frontend depends on `design-tokens.json`
10. **Change OAuth callback URL structure** - Frontend expects specific params

### ✅ DO:

1. **Test end-to-end** - OAuth → Enrichment → Profile → Approval
2. **Check logs** - Railway (backend) and browser console (frontend)
3. **Use transactions** - For multi-step database operations
4. **Handle errors gracefully** - Always have fallbacks
5. **Document changes** - Update relevant docs
6. **Follow architecture** - Controllers → Use Cases → Repositories
7. **Clear URL params** - After OAuth callbacks
8. **Preserve session** - During OAuth errors
9. **Hash passwords** - Always use bcrypt
10. **Test with real data** - Don't rely only on mocks

---

## Additional Resources

- **Enrichment Protection**: `docs/ENRICHMENT-FEATURE-PROTECTION.md`
- **OAuth Token Fix**: `docs/OAUTH-TOKEN-PERSISTENCE-FIX.md`
- **LinkedIn OAuth Setup**: `docs/LINKEDIN-SCOPES-SETUP.md`
- **Gemini API Status**: `docs/Gemini-API-Status.md`
- **Test Accounts**: `docs/TEST-ACCOUNTS.md`
- **Roadmap Status**: `docs/Roadmap-Status-Summary.md`

---

**End of Document**

