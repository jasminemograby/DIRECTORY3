# EDUCORE Directory Management System - Technical Implementation Details

**Last Updated**: 2025-01-21  
**Purpose**: Comprehensive technical documentation explaining the "what", "how", and "why" of every implementation decision in the codebase

---

## Table of Contents

1. [Data Model & Design Decisions](#1-data-model--design-decisions)
2. [Architecture & Project Structure](#2-architecture--project-structure)
3. [Internal API Endpoints](#3-internal-api-endpoints)
4. [External API Endpoints](#4-external-api-endpoints)
5. [AI Query Generation for Microservices](#5-ai-query-generation-for-microservices)
6. [LinkedIn & GitHub OAuth Implementation](#6-linkedin--github-oauth-implementation)
7. [OpenAI Integration](#7-openai-integration)
8. [Dummy Authentication System](#8-dummy-authentication-system)
9. [Role-Based Access Control (RBAC)](#9-role-based-access-control-rbac)
10. [Hierarchy Display Based on Permissions](#10-hierarchy-display-based-on-permissions)
11. [Microservice Integration - Actual Implementation](#11-microservice-integration---actual-implementation)
12. [Database Schema & Relationships](#12-database-schema--relationships)

---

## 1. Data Model & Design Decisions

### 1.1 Why PostgreSQL Instead of MongoDB?

**Decision**: PostgreSQL (relational database)  
**Why**:
1. **Structured Data**: Employee, company, department, team data is highly structured with clear relationships
2. **ACID Compliance**: Critical for multi-tenant system where data integrity is essential
3. **Complex Queries**: Need for JOINs, aggregations, and hierarchical queries (departments → teams → employees)
4. **Foreign Key Constraints**: Enforce referential integrity automatically (e.g., employee must belong to a company)
5. **Transaction Support**: CSV uploads require atomic transactions (all-or-nothing)
6. **JSONB Support**: Can store flexible data (LinkedIn/GitHub OAuth data) while maintaining relational structure
7. **Mature Ecosystem**: Better tooling, migrations, and PostgreSQL expertise in the team

**Trade-offs**:
- MongoDB would be better for document-heavy, schema-less data
- PostgreSQL requires schema migrations but provides stronger guarantees

### 1.2 UUID vs Auto-Increment IDs

**Decision**: UUID (Universally Unique Identifier)  
**Why**:
1. **Multi-Tenant Safety**: UUIDs prevent ID collisions across companies
2. **Security**: Harder to guess/enumerate (e.g., `/employees/123` vs `/employees/550e8400-e29b-41d4-a716-446655440000`)
3. **Distributed Systems**: Can generate IDs without coordination (useful for future microservices)
4. **Database Merging**: Easier to merge data from different databases without ID conflicts

**Implementation**:
```sql
-- From database/migrations/001_initial_schema.sql
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
id UUID PRIMARY KEY DEFAULT uuid_generate_v4()
```

**Trade-offs**:
- UUIDs are larger (16 bytes vs 4-8 bytes for integers)
- Slightly slower for indexing, but negligible for this scale
- More readable in logs/debugging

### 1.3 JSONB for OAuth Data

**Decision**: Store LinkedIn/GitHub data as JSONB in `employees` table  
**Why**:
1. **Flexible Schema**: OAuth APIs return different fields based on scopes/permissions
2. **No Schema Changes**: Can store new fields without migrations
3. **Query Support**: PostgreSQL JSONB allows querying nested fields
4. **Single Table**: Avoids complex JOINs for profile enrichment

**Implementation**:
```sql
-- From database/migrations/001_initial_schema.sql
linkedin_data JSONB,
github_data JSONB
```

**Storage Location**: `backend/src/infrastructure/EmployeeRepository.js`
- `updateLinkedInData()`: Stores LinkedIn profile data as JSONB
- `updateGitHubData()`: Stores GitHub profile data as JSONB

**Example Stored Data**:
```json
{
  "id": "abc123",
  "name": "John Doe",
  "email": "john@example.com",
  "headline": "Software Engineer",
  "access_token": "token...",
  "connected_at": "2025-01-21T10:00:00Z"
}
```

### 1.4 Separate Roles Table vs String Array

**Decision**: Separate `employee_roles` table  
**Why**:
1. **Normalization**: Avoids data duplication (employee can have multiple roles)
2. **Query Performance**: Easy to query "all team managers" with indexed lookups
3. **Referential Integrity**: Can add constraints (e.g., only one DECISION_MAKER per company)
4. **Future Extensibility**: Can add role metadata (assigned_date, assigned_by, etc.)

**Implementation**:
```sql
-- From database/migrations/001_initial_schema.sql
CREATE TABLE employee_roles (
  id UUID PRIMARY KEY,
  employee_id UUID REFERENCES employees(id),
  role_type VARCHAR(50) CHECK (role_type IN (...)),
  UNIQUE(employee_id, role_type)
);
```

**Alternative Considered**: Storing roles as `REGULAR_EMPLOYEE + TEAM_MANAGER` string in `employees.role_type`  
**Why Not**: 
- Harder to query (need string matching)
- No referential integrity
- But we DO store it as string in CSV for simplicity, then parse into separate table

### 1.5 Profile Status State Machine

**Decision**: `profile_status` enum with states: 'basic', 'enriched', 'approved', 'rejected'  
**Why**:
1. **Clear Workflow**: Enforces correct sequence (basic → enriched → approved)
2. **Permission Gates**: Frontend can check status before showing features
3. **Database Constraint**: CHECK constraint prevents invalid states
4. **Audit Trail**: Can track profile progression

**Implementation**:
```sql
profile_status VARCHAR(50) DEFAULT 'basic' 
  CHECK (profile_status IN ('basic', 'enriched', 'approved', 'rejected'))
```

**Flow**:
1. **basic**: Initial state from CSV upload
2. **enriched**: After LinkedIn + GitHub + OpenAI enrichment
3. **approved**: After HR approves enriched profile
4. **rejected**: If HR rejects enrichment

**Code Location**: `backend/src/application/EnrichProfileUseCase.js` updates status

---

## 2. Architecture & Project Structure

### 2.1 Why Onion Architecture (Clean Architecture)?

**Decision**: 3-layer Onion Architecture  
**Why**:
1. **Separation of Concerns**: Each layer has a single responsibility
2. **Testability**: Can test business logic without HTTP/database
3. **Maintainability**: Changes in one layer don't cascade to others
4. **Dependency Inversion**: Business logic doesn't depend on infrastructure details
5. **Future-Proof**: Easy to swap databases, APIs, or frameworks

**Layer Structure**:
```
┌─────────────────────────────────────┐
│   Presentation Layer                │  ← HTTP, Controllers
│   (backend/src/presentation/)      │
├─────────────────────────────────────┤
│   Application Layer                 │  ← Business Logic, Use Cases
│   (backend/src/application/)        │
├─────────────────────────────────────┤
│   Infrastructure Layer              │  ← Database, APIs, External Services
│   (backend/src/infrastructure/)     │
└─────────────────────────────────────┘
```

**Dependency Flow**: Presentation → Application → Infrastructure  
**Why This Direction**: 
- Controllers depend on Use Cases (business logic)
- Use Cases depend on Repositories (data access)
- Infrastructure is at the bottom (most concrete, least abstract)

### 2.2 Why Use Cases Instead of Direct Controller → Repository?

**Decision**: Controllers call Use Cases, Use Cases call Repositories  
**Why**:
1. **Business Logic Centralization**: All business rules in one place (Use Cases)
2. **Reusability**: Same Use Case can be called from API, CLI, or background jobs
3. **Testability**: Test business logic without HTTP layer
4. **Transaction Management**: Use Cases can orchestrate multiple repository calls in transactions

**Example Flow**:
```
POST /api/v1/companies/:id/employees
  → EmployeeController.addEmployee()
    → AddEmployeeUseCase.execute()
      → EmployeeRepository.create()
      → EmployeeRolesRepository.create()
      → (Transaction commits)
```

**Code Location**: 
- Controller: `backend/src/presentation/EmployeeController.js`
- Use Case: `backend/src/application/AddEmployeeUseCase.js`
- Repository: `backend/src/infrastructure/EmployeeRepository.js`

### 2.3 Why Separate OAuth Clients from API Clients?

**Decision**: `LinkedInOAuthClient` + `LinkedInAPIClient` (separate classes)  
**Why**:
1. **Single Responsibility**: OAuth handles authentication flow, API handles data fetching
2. **Reusability**: Can use API client with different OAuth tokens
3. **Testability**: Mock OAuth separately from API calls
4. **Clear Separation**: OAuth flow vs. data retrieval are different concerns

**Implementation**:
- `LinkedInOAuthClient`: Handles OAuth 2.0 flow (authorization URL, token exchange)
- `LinkedInAPIClient`: Fetches profile data using access token
- `GitHubOAuthClient`: Handles GitHub OAuth flow
- `GitHubAPIClient`: Fetches GitHub profile and repositories

**Code Locations**:
- `backend/src/infrastructure/LinkedInOAuthClient.js`
- `backend/src/infrastructure/LinkedInAPIClient.js`
- `backend/src/infrastructure/GitHubOAuthClient.js`
- `backend/src/infrastructure/GitHubAPIClient.js`

### 2.4 Why Repository Pattern?

**Decision**: Repository pattern for all database access  
**Why**:
1. **Abstraction**: Business logic doesn't know about SQL
2. **Testability**: Can mock repositories for unit tests
3. **Flexibility**: Can swap PostgreSQL for another database without changing Use Cases
4. **Centralization**: All SQL queries in one place per entity

**Implementation**:
- `EmployeeRepository`: All employee database operations
- `CompanyRepository`: All company database operations
- `DepartmentRepository`: All department operations
- `TeamRepository`: All team operations

**Code Location**: `backend/src/infrastructure/*Repository.js`

---

## 3. Internal API Endpoints

### 3.1 Endpoint Structure

**Base Path**: `/api/v1`  
**Why**: Versioning allows breaking changes in future without breaking existing clients

**Route Registration**: `backend/src/index.js`  
**Pattern**: RESTful routes with resource nesting

### 3.2 Authentication Endpoints

#### POST `/api/v1/auth/login`
**Controller**: `AuthController.login()`  
**Use Case**: `AuthenticateAdminUseCase` → `AuthenticateUserUseCase`  
**Flow**:
1. Receives `{ email, password }`
2. Tries admin authentication first (`AuthenticateAdminUseCase`)
3. If not admin, tries employee authentication (`AuthenticateUserUseCase`)
4. Returns `{ token, user, isAdmin }`

**Why Auto-Detect Admin**: 
- Single login endpoint for all users
- Admin email (`admin@educore.io`) automatically detected
- No separate admin login UI needed

**Code Location**: `backend/src/presentation/AuthController.js:18-62`

#### GET `/api/v1/auth/me`
**Controller**: `AuthController.getCurrentUser()`  
**Middleware**: `authMiddleware`  
**Flow**:
1. `authMiddleware` validates token and sets `req.user`
2. Controller returns `req.user` in envelope format

**Why Envelope Format**: Consistency with other endpoints (even though auth endpoints don't use it)

**Code Location**: `backend/src/presentation/AuthController.js:88-117`

### 3.3 OAuth Endpoints

#### GET `/api/v1/oauth/linkedin/authorize`
**Controller**: `OAuthController.getLinkedInAuthUrl()`  
**Use Case**: `ConnectLinkedInUseCase.getAuthorizationUrl()`  
**Flow**:
1. Gets employee ID from `req.user.id` (from `authMiddleware`)
2. Generates state parameter (base64 JSON with employee ID + timestamp)
3. Calls `LinkedInOAuthClient.getAuthorizationUrl(state)`
4. Returns `{ authorizationUrl, state }`

**Why State Parameter**: 
- CSRF protection
- Associates OAuth callback with employee ID
- Prevents replay attacks

**Code Location**: `backend/src/presentation/OAuthController.js:21-51`

#### GET `/api/v1/oauth/linkedin/callback`
**Controller**: `OAuthController.handleLinkedInCallback()`  
**Use Case**: `ConnectLinkedInUseCase.handleCallback()`  
**Flow**:
1. Receives `code` and `state` from LinkedIn
2. Decodes state to get employee ID
3. Exchanges code for access token (`LinkedInOAuthClient.exchangeCodeForToken()`)
4. Fetches profile data (`LinkedInAPIClient.getCompleteProfile()`)
5. Saves to database (`EmployeeRepository.updateLinkedInData()`)
6. Checks if GitHub also connected
7. If both connected, triggers enrichment automatically
8. Redirects to frontend with token and user data

**Why Automatic Enrichment**: 
- Better UX: No need to click "Enrich" button after connecting both
- Ensures enrichment happens immediately when ready

**Code Location**: `backend/src/presentation/OAuthController.js:58-242`

### 3.4 Employee Management Endpoints

#### GET `/api/v1/companies/:id/employees/:employeeId`
**Controller**: `EmployeeController.getEmployee()`  
**Repository**: `EmployeeRepository.findById()`  
**Flow**:
1. Validates employee belongs to company
2. Fetches employee from database
3. Fetches department/team names via JOIN query
4. Fetches project summaries (if enriched)
5. Fetches trainer settings (if trainer)
6. Fetches employee roles
7. Combines all data into single response

**Why Single Endpoint with All Data**: 
- Reduces API calls from frontend
- Ensures data consistency
- Better performance (one query vs multiple)

**Code Location**: `backend/src/presentation/EmployeeController.js:128-197`

#### GET `/api/v1/companies/:id/employees/:employeeId/management-hierarchy`
**Controller**: `EmployeeController.getManagerHierarchy()`  
**Use Case**: `GetManagerHierarchyUseCase.execute()`  
**Flow**:
1. Gets employee and checks roles (TEAM_MANAGER or DEPARTMENT_MANAGER)
2. For TEAM_MANAGER:
   - Finds team from `employee_managers` (managed employees)
   - Fallback: Finds manager's own team if no managed employees
   - Returns team + all employees in team
3. For DEPARTMENT_MANAGER:
   - Finds department from managed employees
   - Fallback: Finds manager's own department
   - Returns department + all teams + all employees in each team

**Why Fallback Logic**: 
- Edge case: Manager assigned role but no direct reports yet
- Shows manager's own team/department as starting point
- Better UX than showing "no hierarchy"

**Code Location**: `backend/src/application/GetManagerHierarchyUseCase.js`

### 3.5 Profile Enrichment Endpoints

#### POST `/api/v1/employees/:employeeId/enrich`
**Controller**: `EnrichmentController.enrichProfile()`  
**Use Case**: `EnrichProfileUseCase.enrichProfile()`  
**Flow**:
1. Checks if already enriched (one-time only)
2. Validates both LinkedIn and GitHub connected
3. Calls OpenAI to generate bio (`OpenAIAPIClient.generateBio()`)
4. Calls OpenAI to generate project summaries (`OpenAIAPIClient.generateProjectSummaries()`)
5. Calls OpenAI to generate value proposition (`OpenAIAPIClient.generateValueProposition()`)
6. Updates employee profile with all generated data
7. Sends data to Skills Engine (non-critical)
8. Creates approval request for HR

**Why One-Time Only**: 
- Prevents re-enrichment with different data
- Ensures profile consistency
- Cost control (OpenAI API calls)

**Code Location**: `backend/src/application/EnrichProfileUseCase.js:25-243`

### 3.6 Request System Endpoints

#### POST `/api/v1/companies/:id/employees/:employeeId/requests`
**Controller**: `RequestController.submitRequest()`  
**Use Case**: `SubmitEmployeeRequestUseCase.execute()`  
**Flow**:
1. Validates employee belongs to company
2. Checks profile status (must be 'approved')
3. Creates request in `employee_requests` table
4. Returns created request

**Why Profile Status Gate**: 
- Only approved employees can submit requests
- Ensures employee has completed enrichment and approval process

**Code Location**: `backend/src/presentation/RequestController.js:20-64`

#### GET `/api/v1/companies/:id/requests?status=pending`
**Controller**: `RequestController.getCompanyRequests()`  
**Repository**: `EmployeeRequestRepository.findByCompanyId()`  
**Flow**:
1. Queries `employee_requests` table
2. Filters by `company_id` and `status = 'pending'`
3. JOINs with `employees` to get employee names
4. Returns array of requests

**Why Separate Table**: 
- Requests are separate entities from employees
- Can track request history, status changes, reviews
- Supports multiple requests per employee

**Code Location**: `backend/src/presentation/RequestController.js:66-120`

### 3.7 Admin Endpoints

#### GET `/api/v1/admin/companies`
**Controller**: `AdminController.getAllCompanies()`  
**Repository**: `AdminRepository.findAllCompanies()`  
**Middleware**: `authMiddleware` + `adminOnlyMiddleware`  
**Flow**:
1. `adminOnlyMiddleware` checks `req.user.isAdmin === true`
2. Queries all companies (no company_id filter)
3. Returns companies with logos

**Why Separate Admin Routes**: 
- Bypasses company scoping (admin sees all companies)
- Different permissions (read-only)
- Clear separation from company-scoped routes

**Code Location**: `backend/src/presentation/AdminController.js`

---

## 4. External API Endpoints

### 4.1 LinkedIn OAuth API

#### Authorization URL Generation
**Endpoint**: `https://www.linkedin.com/oauth/v2/authorization`  
**Method**: GET (redirect)  
**Parameters**:
- `response_type=code`
- `client_id` (from config)
- `redirect_uri` (must match LinkedIn app settings)
- `state` (base64 JSON with employee ID)
- `scope` (space-separated: `openid profile email` or `r_liteprofile r_emailaddress`)

**What We Send**:
```javascript
// From LinkedInOAuthClient.getAuthorizationUrl()
{
  response_type: 'code',
  client_id: 'LINKEDIN_CLIENT_ID',
  redirect_uri: 'https://directory-service/api/v1/oauth/linkedin/callback',
  state: 'base64-encoded-json-with-employee-id',
  scope: 'openid profile email'
}
```

**What We Receive**:
- Redirect to callback URL with `code` and `state` parameters
- Or error if user denies or scope issues

**Code Location**: `backend/src/infrastructure/LinkedInOAuthClient.js:64-102`

#### Token Exchange
**Endpoint**: `https://www.linkedin.com/oauth/v2/accessToken`  
**Method**: POST  
**What We Send**:
```javascript
// From LinkedInOAuthClient.exchangeCodeForToken()
{
  grant_type: 'authorization_code',
  code: 'authorization-code-from-callback',
  redirect_uri: 'https://directory-service/api/v1/oauth/linkedin/callback',
  client_id: 'LINKEDIN_CLIENT_ID',
  client_secret: 'LINKEDIN_CLIENT_SECRET'
}
```

**What We Receive**:
```json
{
  "access_token": "AQV...",
  "expires_in": 5184000,
  "refresh_token": "AQV...",
  "token_type": "Bearer"
}
```

**Code Location**: `backend/src/infrastructure/LinkedInOAuthClient.js:109-142`

#### Profile Data Fetch
**Endpoint**: `https://api.linkedin.com/v2/userinfo` (OpenID Connect)  
**Method**: GET  
**Headers**: `Authorization: Bearer {access_token}`

**What We Send**: Access token in Authorization header

**What We Receive**:
```json
{
  "sub": "linkedin-user-id",
  "name": "John Doe",
  "given_name": "John",
  "family_name": "Doe",
  "email": "john@example.com",
  "picture": "https://...",
  "locale": "en-US",
  "email_verified": true
}
```

**Note**: Work history (`positions`) is NOT available via OAuth2 - requires additional LinkedIn API products

**Code Location**: `backend/src/infrastructure/LinkedInAPIClient.js:27-69`

**Storage**: Saved to `employees.linkedin_data` JSONB column via `EmployeeRepository.updateLinkedInData()`

### 4.2 GitHub OAuth API

#### Authorization URL Generation
**Endpoint**: `https://github.com/login/oauth/authorize`  
**Method**: GET (redirect)  
**Parameters**:
- `client_id`
- `redirect_uri`
- `state` (base64 JSON with employee ID)
- `scope` (`user:email read:user repo`)

**What We Send**:
```javascript
// From GitHubOAuthClient.getAuthorizationUrl()
{
  client_id: 'GITHUB_CLIENT_ID',
  redirect_uri: 'https://directory-service/api/v1/oauth/github/callback',
  state: 'base64-encoded-json-with-employee-id',
  scope: 'user:email read:user repo'
}
```

**Code Location**: `backend/src/infrastructure/GitHubOAuthClient.js:40-53`

#### Token Exchange
**Endpoint**: `https://github.com/login/oauth/access_token`  
**Method**: POST  
**What We Send**:
```json
{
  "client_id": "GITHUB_CLIENT_ID",
  "client_secret": "GITHUB_CLIENT_SECRET",
  "code": "authorization-code",
  "redirect_uri": "https://directory-service/api/v1/oauth/github/callback"
}
```

**What We Receive**:
```json
{
  "access_token": "gho_...",
  "scope": "user:email,read:user,repo",
  "token_type": "Bearer"
}
```

**Code Location**: `backend/src/infrastructure/GitHubOAuthClient.js:60-96`

#### Profile Data Fetch
**Endpoint**: `https://api.github.com/user`  
**Method**: GET  
**Headers**: `Authorization: token {access_token}`

**What We Send**: Access token in Authorization header

**What We Receive**:
```json
{
  "id": 12345,
  "login": "johndoe",
  "name": "John Doe",
  "email": "john@example.com",
  "bio": "Software engineer",
  "avatar_url": "https://...",
  "company": "Example Corp",
  "location": "San Francisco",
  "public_repos": 42,
  "followers": 100,
  "following": 50
}
```

**Code Location**: `backend/src/infrastructure/GitHubAPIClient.js:26-57`

#### Repositories Fetch
**Endpoint**: `https://api.github.com/user/repos`  
**Method**: GET  
**Headers**: `Authorization: token {access_token}`

**What We Send**: Access token + query params (`per_page=100`, `sort=updated`)

**What We Receive**:
```json
[
  {
    "id": 123,
    "name": "my-repo",
    "full_name": "johndoe/my-repo",
    "description": "Repository description",
    "language": "JavaScript",
    "stargazers_count": 10,
    "forks_count": 5,
    "html_url": "https://github.com/johndoe/my-repo",
    "fork": false,
    "topics": ["javascript", "react"]
  },
  ...
]
```

**Code Location**: `backend/src/infrastructure/GitHubAPIClient.js:160-280`

**Storage**: Saved to `employees.github_data` JSONB column via `EmployeeRepository.updateGitHubData()`

### 4.3 OpenAI API

#### Bio Generation
**Endpoint**: `https://api.openai.com/v1/chat/completions`  
**Method**: POST  
**Model**: `gpt-4-turbo`  
**Temperature**: 0.7  
**Max Tokens**: 500

**What We Send**:
```json
{
  "model": "gpt-4-turbo",
  "messages": [{
    "role": "user",
    "content": "You are a professional HR... [full prompt with LinkedIn + GitHub data]"
  }],
  "temperature": 0.7,
  "max_tokens": 500
}
```

**What We Receive**:
```json
{
  "choices": [{
    "message": {
      "content": "John Doe is a software engineer with expertise in..."
    }
  }]
}
```

**Why gpt-4-turbo**:
- Better quality than gpt-3.5-turbo
- Handles complex prompts with multiple data sources
- More accurate professional writing

**Why Temperature 0.7**:
- Balance between creativity and consistency
- 0.0 = deterministic, 1.0 = very creative
- 0.7 allows variation while maintaining quality

**Why Max Tokens 500**:
- Bio should be 2-3 sentences (150 words max)
- 500 tokens = ~375 words (safety margin)
- Prevents overly long responses

**Code Location**: `backend/src/infrastructure/OpenAIAPIClient.js:27-167`

#### Value Proposition Generation
**Endpoint**: `https://api.openai.com/v1/chat/completions`  
**Method**: POST  
**Model**: `gpt-4-turbo`  
**Temperature**: 0.7  
**Max Tokens**: 300

**What We Send**: Similar structure, but different prompt (focuses on future/company value only)

**What We Receive**: Value proposition text (2-3 sentences)

**Code Location**: `backend/src/infrastructure/OpenAIAPIClient.js:498-617`

### 4.4 Microservice Endpoints (Skills Engine, Course Builder, etc.)

#### Universal Endpoint Pattern
**Endpoint**: `{microservice_base_url}/api/fill-content-metrics`  
**Method**: POST  
**Content-Type**: `application/json` (stringified)

**What We Send**:
```json
{
  "requester_service": "directory",
  "payload": {
    "employee_id": "EMP001",
    "company_id": "company-uuid",
    "employee_type": "regular_employee",
    "raw_data": {
      "linkedin": { ... },
      "github": { ... }
    }
  },
  "response": {
    "user_id": 0,
    "competencies": [],
    "relevance_score": 0,
    "gap": {
      "missing_skills": []
    }
  }
}
```

**What We Receive**:
```json
{
  "requester_service": "directory",
  "payload": { ... },
  "response": {
    "user_id": 1024,
    "competencies": [
      {
        "name": "Data Analysis",
        "nested_competencies": [
          {
            "name": "Data Processing",
            "skills": [
              { "name": "Python", "verified": false },
              { "name": "SQL", "verified": false }
            ]
          }
        ]
      }
    ],
    "relevance_score": 75.5,
    "gap": {
      "missing_skills": ["Docker", "Kubernetes"]
    }
  }
}
```

**Why Envelope Structure**:
- Standardized format across all microservices
- `requester_service`: Identifies caller
- `payload`: Input data
- `response`: Output template (microservice fills it)

**Code Location**: `backend/src/infrastructure/MicroserviceClient.js:21-117`

---

## 5. AI Query Generation for Microservices

### 5.1 Universal Endpoint for Microservices

**Endpoint**: `POST /api/fill-content-metrics`  
**Purpose**: Other microservices call this to get Directory data  
**Controller**: `UniversalEndpointController.handleRequest()`  
**Use Case**: `FillContentMetricsUseCase.execute()`

### 5.2 How AI Query Generation Works

**Component**: `AIQueryGenerator`  
**Model**: Google Gemini (`gemini-1.5-flash`)  
**Why Gemini Instead of OpenAI**:
- Cost-effective for query generation
- Fast responses (flash model)
- Good at SQL generation
- Separate from OpenAI (used for content generation)

**Flow**:
1. Microservice sends envelope with `payload` and `response` template
2. `FillContentMetricsUseCase` calls `AIQueryGenerator.generateQuery()`
3. AI receives:
   - Database schema (from `001_initial_schema.sql`)
   - Payload (what microservice wants)
   - Response template (structure to fill)
4. AI generates SQL SELECT query
5. Query is validated (must be SELECT only, no dangerous keywords)
6. Query is executed with parameters from payload
7. Results are mapped to response template structure
8. Filled response is returned to microservice

**Example**:
```
Input Payload: { employee_id: "EMP001", company_id: "uuid-123" }
Response Template: { user_id: 0, competencies: [], relevance_score: 0 }

AI Generates SQL:
SELECT 
  e.employee_id as user_id,
  e.linkedin_data->>'headline' as headline,
  e.github_data->>'repositories' as repos
FROM employees e
WHERE e.employee_id = $1 AND e.company_id = $2::uuid

Query Executed: Returns row with user_id, headline, repos
Mapped to Template: { user_id: "EMP001", competencies: [...], relevance_score: 75.5 }
```

**Code Location**: 
- `backend/src/infrastructure/AIQueryGenerator.js`
- `backend/src/application/FillContentMetricsUseCase.js`

**Why AI Instead of Hardcoded Queries**:
- Microservices have different data needs
- Can't predict all use cases
- AI adapts to new payload/response structures
- Reduces maintenance (no need to update queries for each microservice)

**Safety Measures**:
- Only SELECT queries allowed (no INSERT/UPDATE/DELETE)
- Dangerous keywords blocked (DROP, TRUNCATE, etc.)
- Parameterized queries (prevents SQL injection)
- Returns empty template on failure (graceful degradation)

---

## 6. LinkedIn & GitHub OAuth Implementation

### 6.1 LinkedIn OAuth Flow

#### Step 1: Generate Authorization URL
**Code**: `ConnectLinkedInUseCase.getAuthorizationUrl()`  
**Flow**:
1. Gets employee ID from authenticated user
2. Creates state parameter (base64 JSON: `{ employeeId, timestamp }`)
3. Calls `LinkedInOAuthClient.getAuthorizationUrl(state)`
4. Returns URL to frontend

**Why State Parameter**:
- CSRF protection
- Associates callback with employee
- Prevents replay attacks

**Code Location**: `backend/src/application/ConnectLinkedInUseCase.js:20-42`

#### Step 2: User Authorizes on LinkedIn
- User redirected to LinkedIn
- User logs in and grants permissions
- LinkedIn redirects back with `code` and `state`

#### Step 3: Handle Callback
**Code**: `ConnectLinkedInUseCase.handleCallback()`  
**Flow**:
1. Decodes state to get employee ID
2. Exchanges code for access token (`LinkedInOAuthClient.exchangeCodeForToken()`)
3. Fetches profile data (`LinkedInAPIClient.getCompleteProfile()`)
4. Saves to database (`EmployeeRepository.updateLinkedInData()`)

**What Gets Saved**:
```javascript
// Stored in employees.linkedin_data (JSONB)
{
  id: "linkedin-user-id",
  name: "John Doe",
  email: "john@example.com",
  headline: "Software Engineer",
  access_token: "AQV...", // Stored for future API calls
  token_expires_at: "2025-02-21T10:00:00Z",
  refresh_token: "AQV...",
  connected_at: "2025-01-21T10:00:00Z"
}
```

**Code Location**: `backend/src/application/ConnectLinkedInUseCase.js:50-127`

### 6.2 GitHub OAuth Flow

**Similar to LinkedIn**, but:
- Different endpoints (`github.com/login/oauth/authorize`)
- Different scopes (`user:email read:user repo`)
- Also fetches repositories (`GitHubAPIClient.getUserRepositories()`)

**What Gets Saved**:
```javascript
// Stored in employees.github_data (JSONB)
{
  id: 12345,
  login: "johndoe",
  name: "John Doe",
  email: "john@example.com",
  bio: "Software engineer",
  avatar_url: "https://...",
  public_repos: 42,
  repositories: [
    {
      name: "my-repo",
      description: "...",
      language: "JavaScript",
      stars: 10,
      forks: 5,
      ...
    }
  ],
  access_token: "gho_...",
  connected_at: "2025-01-21T10:00:00Z"
}
```

**Code Location**: `backend/src/application/ConnectGitHubUseCase.js`

### 6.3 Automatic Enrichment Trigger

**Code**: `OAuthController.handleLinkedInCallback()` and `handleGitHubCallback()`  
**Flow**:
1. After saving OAuth data, checks if both LinkedIn and GitHub connected
2. If both connected, automatically calls `EnrichProfileUseCase.enrichProfile()`
3. Waits for enrichment to complete
4. Redirects to frontend with enrichment status

**Why Automatic**:
- Better UX (no extra button click)
- Ensures enrichment happens when ready
- Prevents users from forgetting to enrich

**Code Location**: `backend/src/presentation/OAuthController.js:148-169`

---

## 7. OpenAI Integration

### 7.1 Model Selection

**Model**: `gpt-4-turbo`  
**Why**:
- Better quality than gpt-3.5-turbo for professional writing
- Handles complex prompts with multiple data sources
- More accurate synthesis of LinkedIn + GitHub data
- Better at following specific instructions (Bio vs Value Proposition separation)

**Alternative Considered**: `gpt-3.5-turbo`  
**Why Not**: Lower quality, less reliable for professional content

### 7.2 Temperature Settings

**Temperature**: 0.7  
**Why**:
- **0.0**: Too deterministic, same output for similar inputs
- **0.7**: Good balance - some variation but maintains quality
- **1.0**: Too creative, might generate inappropriate content

**Impact**: Each enrichment generates slightly different bio/value proposition, but maintains professional quality

### 7.3 Frequency & Rate Limiting

**Frequency**: One-time per employee (enrichment_completed flag)  
**Why**:
- Cost control (OpenAI API is paid)
- Consistency (same data should generate similar content)
- Prevents accidental re-enrichment

**Rate Limiting**: 
- Retry logic with exponential backoff (3 attempts)
- Handles 429 (rate limit) errors gracefully
- Logs rate limit issues for monitoring

**Code Location**: `backend/src/infrastructure/OpenAIAPIClient.js:57-163`

### 7.4 Prompt Engineering

#### Bio Prompt
**Focus**: Past and present only  
**Data Sources**: LinkedIn (professional experience) + GitHub (technical expertise)  
**Output**: 2-3 sentences, 150 words max

**Key Instructions**:
- Do NOT mention future goals, target role, growth steps
- Describe existing background, experience, current responsibilities
- Synthesize LinkedIn + GitHub data
- Third person, professional tone

**Code Location**: `backend/src/infrastructure/OpenAIAPIClient.js:308-435`

#### Value Proposition Prompt
**Focus**: Future and company value only  
**Data Sources**: Employee database only (name, current role, target role, company name)  
**Output**: 2-3 sentences, 150 words max

**Key Instructions**:
- Opens with strategic contribution (NOT "currently works as")
- Do NOT repeat Bio content (career history, technical skills)
- Focus on future potential, organizational impact, development path
- Describe future trajectory inside company

**Code Location**: `backend/src/infrastructure/OpenAIAPIClient.js:622-667`

**Why Separation**:
- Bio = Who they are (past/present)
- Value Proposition = Where they're going (future)
- No duplication between sections
- Clear business value

---

## 8. Dummy Authentication System

### 8.1 Why Dummy Authentication?

**Decision**: Dummy authentication for testing phase  
**Why**:
- Rapid development without waiting for real auth service
- Easy testing with known credentials
- No external dependencies
- Can switch to real auth later via `AUTH_MODE` environment variable

**Trade-off**: NOT SECURE - for testing only

### 8.2 Token Format

**Format**: `dummy-token-{employeeId}-{email}-{timestamp}`  
**Example**: `dummy-token-550e8400-e29b-41d4-a716-446655440000-john@example.com-1705838400000`

**Why This Format**:
- Contains employee ID for quick lookup
- Contains email for fallback lookup
- Contains timestamp for debugging
- Easy to parse and validate

**Admin Token Format**: `dummy-token-admin-{adminId}-{email}-{timestamp}`

**Code Location**: `backend/src/infrastructure/auth/DummyAuthProvider.js:48`

### 8.3 Token Storage

**Frontend**: localStorage  
**Key**: Token stored in browser's localStorage  
**Why**: 
- Persists across page refreshes
- Easy to access in JavaScript
- No server-side session needed

**Backend**: No storage (stateless)  
**Why**:
- Token contains all needed info (employee ID, email)
- Validates by looking up employee in database
- No session management needed

**Code Location**: 
- Frontend: `frontend/src/services/authService.js` (stores in localStorage)
- Backend: `backend/src/infrastructure/auth/DummyAuthProvider.js:68-280` (validates token)

### 8.4 Token Validation Flow

**Code**: `DummyAuthProvider.validateToken()`  
**Flow**:
1. Checks if token starts with `dummy-token-`
2. Parses token to extract employee ID and email
3. Looks up employee in database by ID
4. Fallback: If ID lookup fails, tries email lookup
5. Gets company to check HR status
6. Returns user object with all permissions

**Why Fallback to Email**:
- Handles edge cases (UUID format issues)
- More resilient to token format changes
- Ensures authentication works even if ID parsing fails

**Code Location**: `backend/src/infrastructure/auth/DummyAuthProvider.js:68-280`

### 8.5 Admin Token Validation

**Code**: `DummyAuthProvider.validateAdminToken()`  
**Flow**:
1. Parses admin token format
2. Looks up admin in `directory_admins` table
3. Returns admin user object with `isAdmin: true`

**Code Location**: `backend/src/infrastructure/auth/DummyAuthProvider.js:315-409`

---

## 9. Role-Based Access Control (RBAC)

### 9.1 Permission Checking

**Middleware**: `authMiddleware`, `hrOnlyMiddleware`, `adminOnlyMiddleware`  
**Location**: `backend/src/shared/authMiddleware.js`

**Flow**:
1. `authMiddleware`: Validates token, sets `req.user`
2. `hrOnlyMiddleware`: Checks `req.user.isHR === true`
3. `adminOnlyMiddleware`: Checks `req.user.isAdmin === true || req.user.role === 'DIRECTORY_ADMIN'`

**Code Location**: `backend/src/shared/authMiddleware.js:38-166`

### 9.2 HR Status Detection

**How HR is Detected**:
```javascript
// From DummyAuthProvider.validateToken()
const company = await this.companyRepository.findById(employee.company_id);
const isHR = company && company.hr_contact_email && 
             company.hr_contact_email.toLowerCase() === employee.email.toLowerCase();
```

**Why Email Comparison**:
- HR is identified by matching email to `companies.hr_contact_email`
- No separate HR role needed
- Simple and effective for single HR per company

**Code Location**: `backend/src/infrastructure/auth/DummyAuthProvider.js:225-226`

### 9.3 Role-Based Data Filtering

**Example**: Employee Profile Access  
**Code**: `EmployeeController.getEmployee()`  
**Flow**:
1. Gets employee from database
2. Checks if `req.user.companyId === employee.company_id` (company scoping)
3. Admin bypass: If `req.user.isAdmin`, allows any company
4. Returns employee data

**Why Company Scoping**:
- Multi-tenant system: employees can only see their own company
- Prevents data leakage between companies
- Admin exception: Admin can see all companies (read-only)

**Code Location**: `backend/src/presentation/EmployeeController.js:128-197`

### 9.4 UI Permission Gates

**Frontend**: React components check `user.isHR`, `user.isAdmin`, `user.profileStatus`  
**Example**: 
```javascript
// From frontend/src/components/PendingRequestsSection.js
{!isAdminView && (
  <button onClick={handleApprove}>Approve</button>
)}
```

**Why Frontend + Backend Checks**:
- Frontend: Better UX (hides buttons user can't use)
- Backend: Security (enforces permissions even if frontend is bypassed)
- Defense in depth

**Code Location**: Multiple frontend components check permissions before rendering

---

## 10. Hierarchy Display Based on Permissions

### 10.1 Management Hierarchy Endpoint

**Endpoint**: `GET /api/v1/companies/:id/employees/:employeeId/management-hierarchy`  
**Use Case**: `GetManagerHierarchyUseCase.execute()`

### 10.2 Permission-Based Display

**Who Can See Hierarchy**:
- TEAM_MANAGER: Sees their team's employees
- DEPARTMENT_MANAGER: Sees their department's teams and employees
- HR: Sees all hierarchies (via company profile)
- Admin: Sees all hierarchies (read-only)

**Code Check**:
```javascript
// From GetManagerHierarchyUseCase.execute()
const isDepartmentManager = roles.includes('DEPARTMENT_MANAGER');
const isTeamManager = roles.includes('TEAM_MANAGER');

if (!isDepartmentManager && !isTeamManager) {
  return null; // Not a manager, no hierarchy
}
```

**Code Location**: `backend/src/application/GetManagerHierarchyUseCase.js:38-46`

### 10.3 Fallback Logic

**Problem**: Manager has role but no direct reports yet  
**Solution**: Fallback to manager's own team/department

**Team Manager Fallback**:
```javascript
// From GetManagerHierarchyUseCase.js:160-174
// If no managed employees found, get manager's own team
if (teamResult.rows.length === 0) {
  const managerTeamQuery = `
    SELECT t.id, t.team_id, t.team_name
    FROM employee_teams et
    JOIN teams t ON et.team_id = t.id
    WHERE et.employee_id = $1
  `;
  teamResult = await this.employeeRepository.pool.query(managerTeamQuery, [managerId]);
}
```

**Why Fallback**:
- Edge case: Manager assigned but team not fully set up
- Better UX: Shows something instead of "no hierarchy"
- Manager can see their own team as starting point

**Code Location**: `backend/src/application/GetManagerHierarchyUseCase.js:160-174`

### 10.4 Frontend Display

**Component**: `ProfileManagement`  
**Location**: `frontend/src/components/ProfileManagement.js`

**Flow**:
1. Calls `/management-hierarchy` endpoint
2. Parses response (handles multiple response structures)
3. Displays department/team sections (collapsed by default)
4. Shows employee cards (clickable to navigate to profiles)
5. Read-only for admins (no edit buttons)

**Code Location**: `frontend/src/components/ProfileManagement.js`

---

## 11. Microservice Integration - Actual Implementation

### 11.1 Skills Engine Integration

**Endpoint Called**: `POST {SKILLS_ENGINE_URL}/api/fill-content-metrics`  
**Code**: `MicroserviceClient.getEmployeeSkills()`

**What We Send**:
```javascript
{
  requester_service: "directory",
  payload: {
    employee_id: "EMP001",
    company_id: "company-uuid",
    employee_type: "regular_employee", // or "trainer"
    raw_data: {
      linkedin: { ... }, // Full LinkedIn data from employees.linkedin_data
      github: { ... }    // Full GitHub data from employees.github_data
    }
  },
  response: {
    user_id: 0,
    competencies: [],
    relevance_score: 0,
    gap: {
      missing_skills: []
    }
  }
}
```

**What We Actually Receive** (from mock data fallback):
```javascript
{
  user_id: 1024,
  competencies: [
    {
      name: "Data Analysis",
      nested_competencies: [
        {
          name: "Data Processing",
          skills: [
            { name: "Python", verified: false },
            { name: "SQL", verified: false }
          ]
        },
        {
          name: "Data Visualization",
          skills: [
            { name: "Power BI", verified: false },
            { name: "Tableau", verified: false }
          ]
        }
      ]
    }
  ],
  relevance_score: 75.5,
  gap: {
    missing_skills: ["Docker", "Kubernetes", "AWS"]
  }
}
```

**Code Location**: `backend/src/infrastructure/MicroserviceClient.js:127-145`

**Fallback Logic**:
1. Tries to call Skills Engine API
2. If fails, tries `mockData/index.json` file
3. If file not found, uses hardcoded fallback in `MicroserviceClient.js`
4. Always returns data (never empty)

**Why Always Return Data**:
- Better UX (shows something instead of error)
- Skills Engine might be down
- Mock data ensures frontend always works

### 11.2 Course Builder Integration

**Endpoint Called**: `POST {COURSE_BUILDER_URL}/api/fill-content-metrics`  
**Code**: `MicroserviceClient.getEmployeeCourses()`

**What We Send**:
```javascript
{
  requester_service: "directory",
  payload: {
    employee_id: "EMP001",
    company_id: "company-uuid"
  },
  response: {
    assigned_courses: [],
    in_progress_courses: [],
    completed_courses: []
  }
}
```

**What We Receive** (from mock data):
```javascript
{
  assigned_courses: [
    { course_id: "C001", title: "Introduction to React", status: "assigned" }
  ],
  in_progress_courses: [
    { course_id: "C002", title: "Advanced JavaScript", progress: 50 }
  ],
  completed_courses: [
    { course_id: "C003", title: "Node.js Basics", completed_at: "2025-01-15" }
  ]
}
```

**Code Location**: `backend/src/infrastructure/MicroserviceClient.js:153-166`

### 11.3 Learner AI Integration

**Endpoint Called**: `POST {LEARNER_AI_URL}/api/fill-content-metrics`  
**Code**: `MicroserviceClient.getLearningPath()`

**What We Send**:
```javascript
{
  requester_service: "directory",
  payload: {
    employee_id: "EMP001",
    company_id: "company-uuid"
  },
  response: {
    path_id: "",
    courses: [],
    progress: 0,
    recommendations: []
  }
}
```

**What We Receive** (from mock data):
```javascript
{
  path_id: "path-123",
  courses: [
    { course_id: "C001", title: "Course 1", order: 1 },
    { course_id: "C002", title: "Course 2", order: 2 }
  ],
  progress: 25,
  recommendations: [
    { course_id: "C003", reason: "Based on your skills" }
  ]
}
```

**Code Location**: `backend/src/infrastructure/MicroserviceClient.js:174-220`

### 11.4 Learning Analytics Integration

**Endpoint Called**: `POST {LEARNING_ANALYTICS_URL}/api/fill-content-metrics`  
**Code**: `MicroserviceClient.getLearningDashboard()`

**What We Send**:
```javascript
{
  requester_service: "directory",
  payload: {
    employee_id: "EMP001",
    company_id: "company-uuid"
  },
  response: {
    progress_summary: {},
    recent_activity: [],
    upcoming_deadlines: [],
    achievements: []
  }
}
```

**Code Location**: `backend/src/infrastructure/MicroserviceClient.js:228-242`

### 11.5 Universal Endpoint (Directory → Other Microservices)

**Endpoint**: `POST /api/fill-content-metrics`  
**Purpose**: Other microservices call this to get Directory data  
**Controller**: `UniversalEndpointController.handleRequest()`  
**Use Case**: `FillContentMetricsUseCase.execute()`

**What We Receive** (from other microservices):
```javascript
{
  requester_service: "skills-engine", // or "course-builder", etc.
  payload: {
    employee_id: "EMP001",
    company_id: "company-uuid",
    // ... other fields microservice needs
  },
  response: {
    // Template structure microservice wants filled
    user_id: 0,
    name: "",
    email: "",
    // ... fields to fill
  }
}
```

**What We Do**:
1. AI generates SQL query based on payload + response template
2. Execute query with parameters from payload
3. Map database results to response template
4. Return filled response

**What We Send Back**:
```javascript
{
  requester_service: "skills-engine",
  payload: { ... }, // Echo back
  response: {
    user_id: "EMP001",
    name: "John Doe",
    email: "john@example.com",
    // ... filled fields
  }
}
```

**Code Location**: 
- `backend/src/presentation/UniversalEndpointController.js`
- `backend/src/application/FillContentMetricsUseCase.js`

---

## 12. Database Schema & Relationships

### 12.1 Core Tables

#### `companies`
**Purpose**: Store company information  
**Key Fields**:
- `id` (UUID, PK)
- `company_name`, `industry`, `domain` (UNIQUE)
- `approval_policy` (CHECK: 'manual' or 'auto')
- `kpis` (JSONB)
- `logo_url`

**Why These Fields**:
- `domain` UNIQUE: One company per domain (multi-tenant isolation)
- `approval_policy`: Controls whether learning path approvals are manual or automatic
- `kpis` JSONB: Flexible KPIs per company (no schema changes needed)

#### `employees`
**Purpose**: Store employee information  
**Key Fields**:
- `id` (UUID, PK)
- `company_id` (FK → companies.id)
- `employee_id` (VARCHAR, unique within company)
- `email` (VARCHAR, UNIQUE across all companies)
- `linkedin_data` (JSONB)
- `github_data` (JSONB)
- `profile_status` (CHECK: 'basic', 'enriched', 'approved', 'rejected')

**Why These Fields**:
- `email` UNIQUE: Prevents duplicate accounts across companies
- `linkedin_data`/`github_data` JSONB: Flexible OAuth data storage
- `profile_status`: State machine for enrichment workflow
- `employee_id` + `company_id` UNIQUE: Employee ID unique within company

#### `employee_roles`
**Purpose**: Store employee roles (many-to-many)  
**Key Fields**:
- `employee_id` (FK → employees.id)
- `role_type` (CHECK: 'REGULAR_EMPLOYEE', 'TRAINER', 'TEAM_MANAGER', 'DEPARTMENT_MANAGER', 'DECISION_MAKER')
- UNIQUE(employee_id, role_type)

**Why Separate Table**:
- Employee can have multiple roles
- Easy to query "all team managers"
- Can add role metadata later (assigned_date, etc.)

#### `departments`
**Purpose**: Store department information  
**Key Fields**:
- `id` (UUID, PK)
- `company_id` (FK → companies.id)
- `department_id` (VARCHAR, unique within company)
- UNIQUE(company_id, department_id)

**Why**:
- Departments belong to companies
- Department ID unique within company (not globally)

#### `teams`
**Purpose**: Store team information  
**Key Fields**:
- `id` (UUID, PK)
- `company_id` (FK → companies.id)
- `department_id` (FK → departments.id)
- `team_id` (VARCHAR, unique within company)
- UNIQUE(company_id, team_id)

**Why**:
- Teams belong to departments
- Hierarchical structure: Company → Department → Team → Employee

#### `employee_teams`
**Purpose**: Many-to-many relationship (employees can be in multiple teams)  
**Key Fields**:
- `employee_id` (FK → employees.id)
- `team_id` (FK → teams.id)
- UNIQUE(employee_id, team_id)

**Why Separate Table**:
- Employee can be in multiple teams
- Normalized design (avoids data duplication)

#### `employee_managers`
**Purpose**: Store manager relationships  
**Key Fields**:
- `employee_id` (FK → employees.id)
- `manager_id` (FK → employees.id)
- `relationship_type` (CHECK: 'team_manager' or 'department_manager')
- UNIQUE(employee_id, manager_id, relationship_type)

**Why**:
- Tracks who manages whom
- Distinguishes team vs department managers
- Used for hierarchy queries

#### `employee_requests`
**Purpose**: Store employee requests (learn skills, apply trainer, etc.)  
**Key Fields**:
- `id` (UUID, PK)
- `employee_id` (FK → employees.id)
- `company_id` (FK → companies.id)
- `request_type` (CHECK: 'learn-new-skills', 'apply-trainer', 'self-learning', 'other')
- `status` (CHECK: 'pending', 'approved', 'rejected', 'in_progress', 'completed')
- `reviewed_by` (FK → employees.id)

**Why Separate Table**:
- Requests are separate entities from employees
- Can track request history, status changes
- Supports multiple requests per employee

#### `employee_profile_approvals`
**Purpose**: Store HR approval workflow for enriched profiles  
**Key Fields**:
- `id` (UUID, PK)
- `employee_id` (FK → employees.id)
- `company_id` (FK → companies.id)
- `status` (CHECK: 'pending', 'approved', 'rejected')
- `reviewed_by` (FK → employees.id)
- UNIQUE(employee_id)

**Why**:
- Tracks approval workflow
- Only one approval request per employee (UNIQUE constraint)
- Links to reviewer (HR who approved/rejected)

#### `directory_admins`
**Purpose**: Store platform-level admin accounts  
**Key Fields**:
- `id` (UUID, PK)
- `email` (VARCHAR, UNIQUE)
- `password_hash` (VARCHAR)
- `full_name` (VARCHAR)

**Why Separate Table**:
- Admins are not employees
- No company association
- Platform-level access

### 12.2 Relationships

#### Company → Employees (One-to-Many)
```
companies.id → employees.company_id
ON DELETE CASCADE: Deleting company deletes all employees
```

**Why CASCADE**:
- Data integrity: Orphaned employees don't make sense
- Clean deletion: Remove company and all related data

#### Company → Departments (One-to-Many)
```
companies.id → departments.company_id
ON DELETE CASCADE
```

#### Department → Teams (One-to-Many)
```
departments.id → teams.department_id
ON DELETE CASCADE
```

#### Employee → Roles (One-to-Many)
```
employees.id → employee_roles.employee_id
ON DELETE CASCADE
```

#### Employee → Teams (Many-to-Many)
```
employees.id → employee_teams.employee_id
teams.id → employee_teams.team_id
```

**Why Many-to-Many**:
- Employee can be in multiple teams
- Team can have multiple employees

#### Employee → Managers (Self-Referential)
```
employees.id → employee_managers.employee_id (employee)
employees.id → employee_managers.manager_id (manager)
```

**Why Self-Referential**:
- Managers are also employees
- No separate manager table needed
- Flexible: Any employee can be a manager

### 12.3 Indexes

**Why Indexes**:
- Faster queries on frequently filtered columns
- Better performance for JOINs

**Key Indexes**:
```sql
-- From database/migrations/001_initial_schema.sql
CREATE INDEX idx_employees_email ON employees(email); -- Fast email lookups
CREATE INDEX idx_employees_profile_status ON employees(profile_status); -- Filter by status
CREATE INDEX idx_employee_requests_company_status ON employee_requests(company_id, status); -- Pending requests query
CREATE INDEX idx_employee_profile_approvals_company_status ON employee_profile_approvals(company_id, status); -- Pending approvals query
```

**Why These Specific Indexes**:
- `email`: Used for authentication lookups
- `profile_status`: Used to filter approved employees
- `company_id + status`: Used for company dashboard queries (pending requests/approvals)

### 12.4 Constraints

#### CHECK Constraints
```sql
-- Approval policy must be 'manual' or 'auto'
approval_policy VARCHAR(50) CHECK (approval_policy IN ('manual', 'auto'))

-- Profile status must be valid state
profile_status VARCHAR(50) CHECK (profile_status IN ('basic', 'enriched', 'approved', 'rejected'))

-- Role type must be valid
role_type VARCHAR(50) CHECK (role_type IN ('REGULAR_EMPLOYEE', 'TRAINER', 'TEAM_MANAGER', 'DEPARTMENT_MANAGER', 'DECISION_MAKER'))
```

**Why CHECK Constraints**:
- Database-level validation (can't insert invalid data)
- Prevents application bugs from corrupting data
- Clear error messages when constraint violated

#### UNIQUE Constraints
```sql
-- Email unique across all companies
email VARCHAR(255) UNIQUE NOT NULL

-- Employee ID unique within company
UNIQUE(company_id, employee_id)

-- Only one approval request per employee
UNIQUE(employee_id) -- in employee_profile_approvals
```

**Why UNIQUE Constraints**:
- Data integrity: Prevents duplicates
- Clear error messages
- Database enforces rules even if application has bugs

### 12.5 Why PostgreSQL JSONB?

**Decision**: Use JSONB for `linkedin_data`, `github_data`, `kpis`  
**Why**:
1. **Flexible Schema**: OAuth APIs return different fields
2. **Query Support**: Can query nested fields (`linkedin_data->>'headline'`)
3. **Indexing**: Can create GIN indexes on JSONB for fast queries
4. **Best of Both Worlds**: Relational structure + flexible JSON data

**Example Query**:
```sql
SELECT linkedin_data->>'headline' as headline
FROM employees
WHERE linkedin_data->>'email' = 'john@example.com';
```

**Trade-off**: 
- Less type safety than separate columns
- But necessary for flexible OAuth data

---

## Summary

This document explains the technical implementation details, design decisions, and code flows for the EDUCORE Directory Management System. Every architectural choice, data model decision, and implementation pattern has been explained with the reasoning behind it.

**Key Takeaways**:
- **PostgreSQL**: Chosen for structured data, ACID compliance, and complex queries
- **Onion Architecture**: Separation of concerns, testability, maintainability
- **UUID**: Multi-tenant safety, security, distributed system support
- **JSONB**: Flexible OAuth data storage while maintaining relational structure
- **Use Cases**: Business logic centralization and reusability
- **Dummy Auth**: Testing phase only, easy to switch to real auth
- **RBAC**: Middleware-based permission checking with company scoping
- **OAuth Flow**: State parameter for CSRF protection, automatic enrichment trigger
- **OpenAI**: gpt-4-turbo for quality, temperature 0.7 for balance, one-time enrichment
- **Microservices**: Envelope structure, AI query generation, mock data fallback
- **Database**: Normalized design with proper relationships, constraints, and indexes

---

**Document Version**: 1.0  
**Last Updated**: 2025-01-21  
**Maintained By**: Development Team

---

*This document serves as the technical reference for understanding the implementation details, design decisions, and code flows in the EDUCORE Directory Management System.*

