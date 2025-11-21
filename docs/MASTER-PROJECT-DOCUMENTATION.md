# EDUCORE Directory Management System - Master Documentation

**Last Updated**: 2025-01-21  
**Project**: EDUCORE Directory Management System  
**Version**: 1.0.0  
**Status**: Production/Testing Phase

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [System Architecture](#system-architecture)
3. [Technology Stack](#technology-stack)
4. [Complete Feature List](#complete-feature-list)
5. [User Roles & Permissions](#user-roles--permissions)
6. [API Endpoints Reference](#api-endpoints-reference)
7. [Database Schema](#database-schema)
8. [UI/UX Flows & Components](#uiux-flows--components)
9. [Business Logic & Rules](#business-logic--rules)
10. [CSV Format & Processing](#csv-format--processing)
11. [Authentication & Authorization](#authentication--authorization)
12. [Profile Enrichment System](#profile-enrichment-system)
13. [OpenAI Integration (Bio & Value Proposition)](#openai-integration-bio--value-proposition)
14. [Microservice Integration](#microservice-integration)
15. [Error Handling & Solutions](#error-handling--solutions)
16. [Special Considerations](#special-considerations)
17. [Development Guidelines](#development-guidelines)
18. [How to Continue Development](#how-to-continue-development)
19. [Troubleshooting Guide](#troubleshooting-guide)
20. [Recent Changes & Updates](#recent-changes--updates)

---

## Project Overview

### Purpose
A multi-tenant Company Directory platform that allows companies to manage their employees, roles, teams, and departments efficiently. Each company has its own isolated directory within the EDUCORE platform.

### Core Capabilities
- Multi-tenant company registration and management
- Employee directory with hierarchical organization
- Role-based access control (RBAC)
- CSV-based company onboarding
- Employee profile management with external integrations (LinkedIn, GitHub)
- AI-powered profile enrichment (OpenAI)
- Learning & Development integration (Skills Engine, Course Builder, Learner AI)
- Request system for employee requests
- Admin dashboard for platform-level oversight

### Deployment
- **Backend**: Railway (Node.js/Express)
- **Frontend**: Vercel (React)
- **Database**: PostgreSQL (Supabase/Railway)
- **Environment**: Production-ready with testing capabilities

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

#### 1. Presentation Layer (`backend/src/presentation/`)
- **Purpose**: Handle HTTP requests and responses
- **Components**: Controllers that receive requests, validate input, call use cases, format responses
- **Key Files**:
  - `AuthController.js` - Authentication
  - `CompanyRegistrationController.js` - Company registration
  - `CompanyProfileController.js` - Company profile management
  - `EmployeeController.js` - Employee management
  - `CSVUploadController.js` - CSV upload processing
  - `AdminController.js` - Admin dashboard
  - `RequestController.js` - Employee requests
  - `EnrichmentController.js` - Profile enrichment
  - `OAuthController.js` - OAuth flows (LinkedIn, GitHub)

#### 2. Application Layer (`backend/src/application/`)
- **Purpose**: Business logic and use cases
- **Components**: Use cases that orchestrate business operations
- **Key Files**:
  - `RegisterCompanyUseCase.js` - Company registration logic
  - `ParseCSVUseCase.js` - CSV processing orchestration
  - `EnrichProfileUseCase.js` - Profile enrichment flow
  - `GetEmployeeSkillsUseCase.js` - Skills data retrieval
  - `GetManagerHierarchyUseCase.js` - Management hierarchy
  - `SubmitEmployeeRequestUseCase.js` - Request submission

#### 3. Infrastructure Layer (`backend/src/infrastructure/`)
- **Purpose**: External services, database access, API clients
- **Components**: Repositories, API clients, validators
- **Key Files**:
  - `EmployeeRepository.js` - Employee database operations
  - `CompanyRepository.js` - Company database operations
  - `CSVParser.js` - CSV parsing
  - `CSVValidator.js` - CSV validation
  - `OpenAIAPIClient.js` - OpenAI integration
  - `LinkedInOAuthClient.js` - LinkedIn OAuth
  - `GitHubOAuthClient.js` - GitHub OAuth
  - `MicroserviceClient.js` - Microservice integration

### Directory Structure

```
DIRECTORY3/
├── backend/
│   ├── src/
│   │   ├── presentation/        # Controllers (HTTP handlers)
│   │   ├── application/         # Use Cases (business logic)
│   │   ├── infrastructure/      # Repositories, API clients
│   │   ├── shared/              # Middleware, utilities
│   │   ├── config.js            # Configuration
│   │   └── index.js             # Entry point, routes
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── pages/               # Page components
│   │   ├── components/          # Reusable components
│   │   ├── services/            # API service functions
│   │   ├── context/             # React Context providers
│   │   └── utils/               # Utility functions
│   └── package.json
├── database/
│   ├── migrations/
│   │   └── 001_initial_schema.sql
│   └── scripts/
│       ├── create_admin_account.sql
│       └── fix_approval_policy_constraints.sql
├── docs/                        # Documentation
├── mockData/                     # Mock data for fallbacks
└── design-tokens.json            # Design system tokens
```

---

## Technology Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: PostgreSQL
- **ORM**: Native SQL queries (no ORM)
- **Authentication**: Dummy authentication (testing phase)
- **External APIs**:
  - OpenAI API (GPT-4-turbo) - Bio and Value Proposition generation
  - LinkedIn OAuth (OpenID Connect)
  - GitHub OAuth
  - Microservices (Skills Engine, Course Builder, Learner AI, Learning Analytics)

### Frontend
- **Framework**: React.js
- **Routing**: React Router
- **State Management**: React Context API
- **Styling**: CSS with design tokens
- **Build Tool**: Create React App

### Database
- **Type**: PostgreSQL
- **Hosting**: Supabase / Railway
- **Migrations**: Single migration file (`001_initial_schema.sql`)

### Deployment
- **Backend**: Railway
- **Frontend**: Vercel
- **Environment Variables**: Managed via Railway/Vercel dashboards

---

## Complete Feature List

### 1. Company Registration & Verification
- **Company Registration**: HR/Manager registers company with basic info (name, industry, domain, HR contact)
- **Domain Verification**: Automatic domain validation (DNS check, MX records)
- **Auto-Approval**: Companies with valid domains are auto-approved
- **Company Settings**: Configurable settings (approval policy, KPIs, passing grade, max attempts, exercises)
- **Logo Management**: Company logo upload and display

### 2. CSV Upload & Employee Management
- **CSV Upload**: Bulk employee import via CSV file
- **CSV Validation**: Comprehensive validation (format, required fields, data types, relationships)
- **Employee Creation**: Automatic creation of employees, departments, teams from CSV
- **Role Management**: Support for multiple roles per employee
- **Hierarchy Management**: Automatic manager relationships based on CSV data
- **Email Uniqueness**: Enforces unique emails across all companies
- **Reserved Email Protection**: `admin@educore.io` is reserved for Directory Admin

### 3. Profile Enrichment (LinkedIn + GitHub + AI)
- **LinkedIn OAuth**: Connect LinkedIn account, fetch profile data (OpenID Connect)
- **GitHub OAuth**: Connect GitHub account, fetch repositories and profile
- **AI Enrichment**: OpenAI (GPT-4-turbo) generates professional bio and value proposition
- **Profile Status**: State machine (basic → enriched → approved)
- **HR Approval**: Enriched profiles require HR approval before full access
- **One-Time Only**: Enrichment can only happen once per employee
- **Photo Integration**: Profile photo from LinkedIn (priority) or GitHub (fallback)

### 4. Employee Profile Management
- **Profile Viewing**: View employee profiles with bio, skills, courses, learning path
- **Profile Editing**: Employees can edit their own profiles (after approval)
- **Role-Based Access**: Different views for HR, regular employees, trainers, managers, decision makers
- **Management Hierarchy**: Managers see their team/department structure
- **Trainer Settings**: Trainers have dedicated settings section
- **Skills Display**: Hierarchical tree view of skills from Skills Engine
- **Courses Display**: Integration with Course Builder microservice
- **Learning Path**: Integration with Learner AI microservice

### 5. Company Profile & Management
- **Company Dashboard**: Overview of company, departments, teams, employees
- **Organizational Hierarchy**: Visual representation of departments and teams
- **Employee List**: Full list with search, filter, add/edit/delete (HR only)
- **Pending Requests**: Employee requests requiring HR approval
- **Pending Approvals**: Enriched profiles awaiting HR approval
- **Analytics Dashboard**: Company metrics and KPIs
- **Logo Display**: Company logos with fallback to initial letter

### 6. Admin Dashboard (Directory Admin)
- **Platform-Level Access**: View all companies in the directory
- **Read-Only Mode**: All admin views are read-only (no modifications allowed)
- **Company Cards**: Grid view of all companies with logos, status badges
- **Company Profile Access**: View any company profile (read-only)
- **Employee Profile Access**: View any employee profile (read-only)
- **Management & Reporting**: Placeholder for microservice integration

### 7. Request System
- **Employee Requests**: Employees can submit requests (learn new skills, apply for trainer, etc.)
- **HR Review**: Requests appear in Company Profile → Pending Requests tab
- **Request Types**: learn-new-skills, apply-trainer, self-learning, other
- **Status Tracking**: pending, approved, rejected, in_progress, completed
- **Auto-Refresh**: Requests refresh on tab click and window focus

### 8. Learning & Development Integration
- **Skills Engine**: Integration with Skills Engine microservice
- **Course Builder**: Integration with Course Builder microservice
- **Learner AI**: Integration with Learner AI microservice
- **Learning Analytics**: Integration with Learning Analytics microservice
- **Mock Fallback**: All microservices have mock data fallback
- **Profile Status Gate**: Only visible when `profile_status === 'approved'`

---

## User Roles & Permissions

### Role Types

#### Base Roles
1. **REGULAR_EMPLOYEE**: Standard employee without management responsibilities
2. **TRAINER**: Employee who can teach courses

#### Additional Roles (Can be combined with base roles)
3. **TEAM_MANAGER**: Manages a team (can be combined with REGULAR_EMPLOYEE or TRAINER)
4. **DEPARTMENT_MANAGER**: Manages a department (can be combined with other roles)
5. **DECISION_MAKER**: Has approval authority (often combined with DEPARTMENT_MANAGER)
6. **HR_MANAGER**: Company-level administrator (sees company profile page)
7. **DIRECTORY_ADMIN**: Platform-level administrator (sees all companies)

### Role Combinations
Users can have multiple roles simultaneously:
- `REGULAR_EMPLOYEE + TEAM_MANAGER`
- `REGULAR_EMPLOYEE + DEPARTMENT_MANAGER`
- `TRAINER + DEPARTMENT_MANAGER`
- `TRAINER + TEAM_MANAGER`
- `REGULAR_EMPLOYEE + DECISION_MAKER + DEPARTMENT_MANAGER`

### Role Rules
- **Base Role Requirement**: Every employee MUST have either `REGULAR_EMPLOYEE` or `TRAINER` as a base role
- **DECISION_MAKER Uniqueness**: Only ONE `DECISION_MAKER` per company
- **Format**: Roles are separated by `+` (e.g., `REGULAR_EMPLOYEE + TEAM_MANAGER`)

### Permissions by Role

#### REGULAR_EMPLOYEE
- View own profile
- Edit own profile (after approval)
- Submit requests (after approval)
- View own requests history
- Enrich profile (one-time only)
- View own skills, courses, learning path (after approval)

#### TRAINER
- All REGULAR_EMPLOYEE permissions
- Configure trainer settings
- View courses taught
- View management hierarchy (if also manager)

#### TEAM_MANAGER / DEPARTMENT_MANAGER
- All base role permissions
- View management hierarchy (read-only)
- Navigate to employee profiles from hierarchy

#### HR_MANAGER
- All employee permissions
- View company dashboard
- Approve/reject employee requests
- Approve/reject profile enrichments
- Add/Edit/Delete employees
- Upload CSV files
- View company-wide data

#### DECISION_MAKER
- All employee permissions
- Access to company-level decisions
- View comprehensive company analytics
- Only one per company (enforced in CSV validation)

#### DIRECTORY_ADMIN
- View all companies (read-only)
- View any company profile (read-only)
- View any employee profile (read-only)
- Navigate between companies and employees
- **Cannot** modify any data (read-only mode)
- **Cannot** approve/reject requests
- **Cannot** approve/reject profiles
- **Cannot** edit company details
- **Cannot** modify employee profiles

---

## API Endpoints Reference

### Authentication Endpoints

#### POST `/api/v1/auth/login`
- **Description**: User login (auto-detects admin vs employee)
- **Auth**: None
- **Request Body**: `{ email, password }`
- **Response**: `{ token, user, isAdmin }`

#### POST `/api/v1/auth/logout`
- **Description**: User logout
- **Auth**: None
- **Response**: Success message

#### GET `/api/v1/auth/me`
- **Description**: Get current authenticated user
- **Auth**: Required
- **Response**: User object

### OAuth Endpoints

#### GET `/api/v1/oauth/linkedin/authorize`
- **Description**: Get LinkedIn OAuth authorization URL
- **Auth**: Required
- **Response**: `{ authUrl }`

#### GET `/api/v1/oauth/linkedin/callback`
- **Description**: Handle LinkedIn OAuth callback
- **Auth**: None (OAuth callback)
- **Query Params**: `code`, `state`
- **Response**: Redirect to frontend

#### GET `/api/v1/oauth/github/authorize`
- **Description**: Get GitHub OAuth authorization URL
- **Auth**: Required
- **Response**: `{ authUrl }`

#### GET `/api/v1/oauth/github/callback`
- **Description**: Handle GitHub OAuth callback
- **Auth**: None (OAuth callback)
- **Query Params**: `code`, `state`
- **Response**: Redirect to frontend

### Company Registration & Verification

#### POST `/api/v1/companies/register`
- **Description**: Register a new company
- **Auth**: None
- **Request Body**: `{ company_name, industry, domain, hr_contact_name, hr_contact_email, hr_contact_role }`
- **Response**: `{ company_id, verification_status }`

#### GET `/api/v1/companies/:id/verification`
- **Description**: Get company verification status
- **Auth**: None
- **Response**: `{ status, verified_at, domain }`

#### POST `/api/v1/companies/:id/verify`
- **Description**: Verify company domain
- **Auth**: None
- **Response**: `{ status, verified_at }`

### CSV Upload

#### POST `/api/v1/companies/:id/upload`
- **Description**: Upload CSV file for employee import
- **Auth**: None (or HR only)
- **Request**: Multipart form data with CSV file
- **Response**: `{ success, errors, warnings, rowsProcessed }`

### Company Profile

#### GET `/api/v1/companies/:id/profile`
- **Description**: Get company profile data
- **Auth**: Optional (for enhanced data)
- **Response**: Company profile with departments, teams, employees

### Employee Management

#### POST `/api/v1/companies/:id/employees`
- **Description**: Add new employee
- **Auth**: Required (HR only)
- **Request Body**: Employee data
- **Response**: Created employee object

#### GET `/api/v1/companies/:id/employees/:employeeId`
- **Description**: Get employee profile
- **Auth**: Required
- **Response**: Employee profile data

#### PUT `/api/v1/companies/:id/employees/:employeeId`
- **Description**: Update employee
- **Auth**: Required (HR or self)
- **Request Body**: Updated employee data
- **Response**: Updated employee object

#### DELETE `/api/v1/companies/:id/employees/:employeeId`
- **Description**: Delete employee
- **Auth**: Required (HR only)
- **Response**: Success message

### Employee Profile Data

#### GET `/api/v1/companies/:id/employees/:employeeId/skills`
- **Description**: Get employee skills from Skills Engine
- **Auth**: Required
- **Response**: Skills data (hierarchical structure)

#### GET `/api/v1/companies/:id/employees/:employeeId/courses`
- **Description**: Get employee courses from Course Builder
- **Auth**: Required
- **Response**: Courses data

#### GET `/api/v1/companies/:id/employees/:employeeId/learning-path`
- **Description**: Get employee learning path from Learner AI
- **Auth**: Required
- **Response**: Learning path data

#### GET `/api/v1/companies/:id/employees/:employeeId/dashboard`
- **Description**: Get employee dashboard data
- **Auth**: Required
- **Response**: Dashboard metrics

#### GET `/api/v1/companies/:id/employees/:employeeId/management-hierarchy`
- **Description**: Get management hierarchy for manager
- **Auth**: Required
- **Response**: Hierarchy data (team/department structure)

### Employee Requests

#### POST `/api/v1/companies/:id/employees/:employeeId/requests`
- **Description**: Submit employee request
- **Auth**: Required
- **Request Body**: `{ request_type, title, description }`
- **Response**: Created request object

#### GET `/api/v1/companies/:id/employees/:employeeId/requests`
- **Description**: Get employee's requests
- **Auth**: Required
- **Query Params**: `status` (optional)
- **Response**: Array of requests

#### GET `/api/v1/companies/:id/requests`
- **Description**: Get company pending requests (HR view)
- **Auth**: Required (HR only)
- **Query Params**: `status=pending`
- **Response**: Array of pending requests

#### PUT `/api/v1/companies/:id/requests/:requestId`
- **Description**: Update request status (approve/reject)
- **Auth**: Required (HR only)
- **Request Body**: `{ status, notes }`
- **Response**: Updated request object

### Profile Enrichment

#### POST `/api/v1/employees/:employeeId/enrich`
- **Description**: Start profile enrichment process
- **Auth**: Required
- **Response**: Enrichment status

#### GET `/api/v1/employees/:employeeId/enrichment-status`
- **Description**: Get enrichment status
- **Auth**: Required
- **Response**: `{ status, enriched_at, bio, value_proposition }`

### Profile Approval

#### GET `/api/v1/companies/:id/profile-approvals`
- **Description**: Get pending profile approvals (HR view)
- **Auth**: Required (HR only)
- **Response**: Array of pending approvals

#### POST `/api/v1/companies/:id/profile-approvals/:approvalId/approve`
- **Description**: Approve enriched profile
- **Auth**: Required (HR only)
- **Response**: Success message

#### POST `/api/v1/companies/:id/profile-approvals/:approvalId/reject`
- **Description**: Reject enriched profile
- **Auth**: Required (HR only)
- **Response**: Success message

#### GET `/api/v1/employees/:id/approval-status`
- **Description**: Get employee approval status
- **Auth**: Required
- **Response**: Approval status object

### Trainer Routes

#### GET `/api/v1/employees/:employeeId/trainer-settings`
- **Description**: Get trainer settings
- **Auth**: Required (Trainer only)
- **Response**: Trainer settings object

#### PUT `/api/v1/employees/:employeeId/trainer-settings`
- **Description**: Update trainer settings
- **Auth**: Required (Trainer only)
- **Request Body**: Trainer settings
- **Response**: Updated settings

#### GET `/api/v1/employees/:employeeId/courses-taught`
- **Description**: Get courses taught by trainer
- **Auth**: Required (Trainer only)
- **Response**: Array of courses

### Admin Routes

#### GET `/api/v1/admin/companies`
- **Description**: Get all companies (admin view)
- **Auth**: Required (Admin only)
- **Response**: Array of companies with logos

#### GET `/api/v1/admin/companies/:companyId`
- **Description**: Get company profile (admin view, read-only)
- **Auth**: Required (Admin only)
- **Response**: Company profile data

#### GET `/api/v1/admin/employees/:employeeId`
- **Description**: Get employee profile (admin view, read-only)
- **Auth**: Required (Admin only)
- **Response**: Employee profile data

### Universal Endpoint

#### POST `/api/fill-content-metrics`
- **Description**: Universal endpoint for microservice integration
- **Auth**: None (internal service-to-service)
- **Request Body**: `{ requester_service, payload }`
- **Response**: `{ requester_service, payload, response }`

---

## Database Schema

### Core Tables

#### `companies`
- `id` (UUID, PK)
- `company_name` (VARCHAR)
- `industry` (VARCHAR)
- `domain` (VARCHAR, UNIQUE)
- `logo_url` (TEXT)
- `verification_status` (VARCHAR: 'pending', 'approved', 'rejected')
- `verified_at` (TIMESTAMP)
- `approval_policy` (VARCHAR: 'manual' or 'auto', CHECK constraint)
- `kpis` (JSONB)
- `passing_grade` (INTEGER)
- `max_attempts` (INTEGER)
- `exercises_limited` (BOOLEAN)
- `num_of_exercises` (INTEGER)
- `learning_path_approval` (VARCHAR)
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

#### `employees`
- `id` (UUID, PK)
- `company_id` (UUID, FK → companies.id)
- `employee_id` (VARCHAR) - Unique within company
- `full_name` (VARCHAR)
- `email` (VARCHAR, UNIQUE across all companies)
- `password_hash` (VARCHAR)
- `current_role_in_company` (VARCHAR)
- `target_role_in_company` (VARCHAR)
- `role_type` (VARCHAR) - Combined roles separated by '+'
- `department_id` (VARCHAR)
- `department_name` (VARCHAR)
- `team_id` (VARCHAR)
- `team_name` (VARCHAR)
- `manager_id` (UUID, FK → employees.id)
- `preferred_language` (VARCHAR)
- `status` (VARCHAR: 'active', 'inactive')
- `bio` (TEXT)
- `value_proposition` (TEXT)
- `profile_photo_url` (TEXT)
- `linkedin_data` (JSONB)
- `github_data` (JSONB)
- `profile_status` (VARCHAR: 'basic', 'enriched', 'approved', 'rejected')
- `kpis` (JSONB)
- `ai_enabled` (BOOLEAN) - For trainers
- `public_publish_enable` (BOOLEAN) - For trainers
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

#### `departments`
- `id` (UUID, PK)
- `company_id` (UUID, FK → companies.id)
- `department_id` (VARCHAR) - Unique within company
- `department_name` (VARCHAR)
- `created_at` (TIMESTAMP)

#### `teams`
- `id` (UUID, PK)
- `company_id` (UUID, FK → companies.id)
- `department_id` (UUID, FK → departments.id)
- `team_id` (VARCHAR) - Unique within company
- `team_name` (VARCHAR)
- `created_at` (TIMESTAMP)

#### `employee_requests`
- `id` (UUID, PK)
- `company_id` (UUID, FK → companies.id)
- `employee_id` (UUID, FK → employees.id)
- `request_type` (VARCHAR)
- `title` (VARCHAR)
- `description` (TEXT)
- `status` (VARCHAR: 'pending', 'approved', 'rejected', 'in_progress', 'completed')
- `reviewed_by` (UUID, FK → employees.id)
- `reviewed_at` (TIMESTAMP)
- `notes` (TEXT)
- `requested_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

#### `employee_profile_approvals`
- `id` (UUID, PK)
- `company_id` (UUID, FK → companies.id)
- `employee_uuid` (UUID, FK → employees.id)
- `status` (VARCHAR: 'pending', 'approved', 'rejected')
- `reviewed_by` (UUID, FK → employees.id)
- `reviewed_at` (TIMESTAMP)
- `notes` (TEXT)
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

#### `directory_admins`
- `id` (UUID, PK)
- `email` (VARCHAR, UNIQUE)
- `password_hash` (VARCHAR)
- `full_name` (VARCHAR)
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

### Key Constraints

1. **Email Uniqueness**: `employees.email` must be unique across all companies
2. **Reserved Email**: `admin@educore.io` is reserved (validation in application layer)
3. **Approval Policy**: `companies.approval_policy` must be 'manual' or 'auto' (CHECK constraint)
4. **Profile Status**: `employees.profile_status` must be 'basic', 'enriched', 'approved', or 'rejected'
5. **DECISION_MAKER Uniqueness**: Only one employee per company can have DECISION_MAKER role (enforced in CSV validation)

---

## UI/UX Flows & Components

### Employee Profile Flow

#### Profile Status States
1. **Basic** → Initial profile state (from CSV)
2. **Enriched** → After enrichment process (bio, skills, etc. added)
3. **Approved** → After HR approval (required for submitting requests)
4. **Rejected** → If enrichment is rejected by HR

#### Profile Tabs & Sections

**Overview Tab**:
- Profile photo (LinkedIn → GitHub → fallback)
- Bio (AI-generated, past/present only)
- Value Proposition (AI-generated, future/company value only)
- Current Role
- Target Role
- KPIs

**Learning & Development Tab** (only visible when `profile_status === 'approved'`):
- **Skills Tab**: Hierarchical tree view from Skills Engine
- **Courses Tab**: Courses from Course Builder
- **Learning Path Tab**: Learning path from Learner AI
- **Dashboard Tab**: Analytics from Learning Analytics

**Management Tab** (only for managers):
- Department Hierarchy (expandable/collapsible)
- Team Hierarchy (expandable/collapsible)
- Clickable employee cards

**Trainer Settings Tab** (only for trainers):
- AI Enabled toggle
- Public Publish Enable toggle
- Courses Taught section

**Requests Tab**:
- Submit Request form
- Request history
- Status tracking

### Company Profile Flow

#### Tabs

**Overview Tab**:
- Company logo (with fallback)
- Company information
- Metrics dashboard

**Hierarchy Tab**:
- Department structure
- Team structure
- Employee cards (clickable)

**Employees Tab**:
- Employee list with search/filter
- Add/Edit/Delete buttons (HR only)
- Read-only for admins

**Pending Requests Tab**:
- List of pending employee requests
- Approve/Reject buttons (HR only)
- Read-only for admins
- Auto-refresh on tab click and window focus
- Graceful 401 handling (shows "No requests" instead of error)

**Pending Approvals Tab**:
- List of enriched profiles awaiting approval
- Approve/Reject buttons (HR only)
- Read-only for admins

**Management & Reporting Tab**:
- Analytics dashboard
- Company metrics
- KPI tracking

### Admin Dashboard Flow

#### Overview Tab
- Grid of company cards
- Company logos
- Status badges
- Click to view company profile (read-only)

#### Requests Tab
- System-wide request overview (placeholder)

#### Management & Reporting Tab
- System analytics (placeholder)
- "View System Analytics" link

### Key UI Components

#### Header Component
- Consistent across all pages
- Role badges (HR Manager, Directory Admin)
- Navigation links
- Logout button

#### ProfileSkills Component
- Hierarchical tree view
- Expandable/collapsible nodes
- Icons (▶ collapsed, ▼ expanded)
- Skills as badges at leaf nodes
- Verified skills with checkmark

#### ProfileManagement Component
- Department hierarchy section
- Team hierarchy section
- Expandable/collapsible (closed by default)
- Clickable employee cards
- Fallback logic for edge cases

#### PendingRequestsSection Component
- Auto-refresh on tab click
- Auto-refresh on window focus
- Graceful 401 error handling
- Read-only mode for admins
- Approve/Reject buttons (HR only)

---

## Business Logic & Rules

### CSV Processing Rules

1. **Row Structure**:
   - Row 1: Company-level fields only
   - Rows 2+: Employee fields only
   - All rows must have same column count (employee rows padded with empty fields)

2. **Role Validation**:
   - Base role required: `REGULAR_EMPLOYEE` or `TRAINER`
   - Additional roles: `TEAM_MANAGER`, `DEPARTMENT_MANAGER`, `DECISION_MAKER`
   - Only ONE `DECISION_MAKER` per company
   - Format: `REGULAR_EMPLOYEE + TEAM_MANAGER`

3. **Email Validation**:
   - Must be unique across all companies
   - `admin@educore.io` is reserved (validation error if used)

4. **Approval Policy**:
   - Must be 'manual' or 'auto'
   - If 'manual', must have one DECISION_MAKER

### Profile Enrichment Rules

1. **One-Time Only**: Enrichment can only happen once per employee
2. **Status Flow**: basic → enriched → approved
3. **HR Approval Required**: Enriched profiles require HR approval
4. **Profile Status Gate**: Learning & Development sections only visible when `profile_status === 'approved'`

### Request System Rules

1. **Profile Status Gate**: Employees can only submit requests when `profile_status === 'approved'`
2. **HR Review**: All requests require HR review
3. **Status Flow**: pending → approved/rejected → in_progress → completed

### Management Hierarchy Rules

1. **Team Manager**: Shows team members (fallback to manager's own team if no direct reports)
2. **Department Manager**: Shows department structure (fallback to manager's own department if no managed employees)
3. **Read-Only**: Hierarchy is read-only (no modifications)

### Admin Access Rules

1. **Read-Only**: All admin views are read-only
2. **No Modifications**: Admins cannot approve/reject, edit, or delete
3. **Platform-Level**: Admins see all companies, not company-specific

---

## CSV Format & Processing

### CSV Structure

#### Row 1: Company-Level Fields
```
company_name, industry, logo_url, approval_policy, kpis, passing_grade, max_attempts, 
exercises_limited, num_of_exercises, learning_path_approval, [empty fields for employee columns]
```

#### Rows 2+: Employee Fields
```
[empty fields for company columns], employee_id, full_name, email, role_type, department_id, 
department_name, team_id, team_name, manager_id, password, current_role_in_company, 
target_role_in_company, preferred_language, status, ai_enabled, public_publish_enable
```

### CSV Processing Pipeline

1. **CSVParser** (`backend/src/infrastructure/CSVParser.js`)
   - Parses CSV buffer into rows
   - Separates company row (row 1) from employee rows (rows 2+)
   - Normalizes company data using `normalizeCompanyRow()`
   - Normalizes employee data using `normalizeEmployeeRow()`
   - Handles `approval_policy` normalization ('automatic' → 'auto')

2. **CSVValidator** (`backend/src/infrastructure/CSVValidator.js`)
   - Validates CSV structure (company fields in row 1, employee fields in rows 2+)
   - Validates role types (base role requirement, DECISION_MAKER uniqueness)
   - Validates email uniqueness
   - Validates reserved email (`admin@educore.io`)
   - Validates required fields

3. **DatabaseConstraintValidator** (`backend/src/infrastructure/DatabaseConstraintValidator.js`)
   - Validates data against database constraints
   - Checks mandatory KPIs
   - Validates role types against allowed values

4. **ParseCSVUseCase** (`backend/src/application/ParseCSVUseCase.js`)
   - Orchestrates the entire CSV processing pipeline
   - Handles company settings from `companyRow`
   - Processes employee data from `employeeRows`
   - Executes database insertion within a transaction
   - Validates `approval_policy` before database update

### CSV Validation Rules

- **Column Alignment**: Employee rows must have empty fields for company-level columns (10 empty fields at start)
- **Base Role**: Every employee must have `REGULAR_EMPLOYEE` or `TRAINER`
- **DECISION_MAKER**: Only one per company
- **Email Uniqueness**: Across all companies
- **Reserved Email**: `admin@educore.io` cannot be used
- **Approval Policy**: Must be 'manual' or 'auto'

---

## Authentication & Authorization

### Current Implementation (Testing Phase)

**Dummy Authentication**:
- No real password hashing (for testing)
- Token-based authentication
- Admin auto-detection by email (`admin@educore.io`)
- Employee authentication by email/password

### Authentication Flow

1. **Login**:
   - User submits email/password
   - System tries admin authentication first
   - If not admin, tries employee authentication
   - Returns token and user object

2. **Token Management**:
   - Tokens stored in localStorage (frontend)
   - Admin tokens have `admin-` prefix
   - Tokens included in Authorization header

3. **Middleware**:
   - `authMiddleware`: Requires authentication
   - `optionalAuthMiddleware`: Optional authentication
   - `hrOnlyMiddleware`: HR only access
   - `adminOnlyMiddleware`: Admin only access

### Admin Authentication

- **Email**: `admin@educore.io`
- **Password**: `SecurePass123`
- **Auto-Detection**: System automatically detects admin login
- **Token Prefix**: `admin-` prefix in token
- **Redirect**: Admin redirected to `/admin/dashboard`

---

## Profile Enrichment System

### Enrichment Flow

1. **Employee Initiates**: Employee clicks "Enrich Profile" button
2. **LinkedIn Connection**: Employee connects LinkedIn account (OAuth)
3. **GitHub Connection**: Employee connects GitHub account (OAuth)
4. **AI Generation**: System calls OpenAI API to generate:
   - Professional Bio (past/present only)
   - Value Proposition (future/company value only)
5. **Profile Update**: Bio and value proposition saved to database
6. **Status Update**: Profile status changed to 'enriched'
7. **HR Approval Required**: HR must approve before profile becomes 'approved'

### Enrichment Components

- **LinkedInOAuthClient**: Handles LinkedIn OAuth flow (OpenID Connect)
- **GitHubOAuthClient**: Handles GitHub OAuth flow
- **OpenAIAPIClient**: Generates bio and value proposition
- **EnrichProfileUseCase**: Orchestrates enrichment flow
- **EnrichmentController**: HTTP handler for enrichment endpoints

### One-Time Only Rule

- Enrichment can only happen once per employee
- System checks `profile_status` before allowing enrichment
- If already enriched, enrichment is blocked

---

## OpenAI Integration (Bio & Value Proposition)

### Bio Generation

#### Model & Settings
- **Model**: `gpt-4-turbo`
- **Max Tokens**: 500
- **Temperature**: 0.7

#### Data Fields Sent

**From Employee Database**:
- `full_name`
- `current_role_in_company`
- `target_role_in_company`
- `company_name`

**From LinkedIn Data** (if available):
- `name`, `given_name`, `family_name`
- `email`, `locale`, `headline`
- `summary` (rarely available via OAuth2)
- `positions` / `experience` / `workExperience` (up to 5 positions)

**From GitHub Data** (if available):
- `name`, `login`, `bio`
- `company`, `location`, `blog`
- `public_repos`, `followers`, `following`
- `repositories` (top 10 with details)

#### Bio Prompt Instructions

**CRITICAL**: The Bio prompt focuses ONLY on past and present:
- Do NOT mention future goals, target role, growth steps
- Describe existing professional background, past experience, technical expertise, current responsibilities
- Read like a professional summary of who they are — not where they are going

### Value Proposition Generation

#### Model & Settings
- **Model**: `gpt-4-turbo`
- **Max Tokens**: 300
- **Temperature**: 0.7

#### Data Fields Sent

**From Employee Database ONLY**:
- `full_name`
- `current_role_in_company`
- `target_role_in_company`
- `company_name`

**Note**: Value Proposition does NOT use LinkedIn or GitHub data

#### Value Proposition Prompt Instructions

**CRITICAL**: The Value Proposition prompt focuses ONLY on future and company value:
- Opens with strategic contribution statement (NOT "currently works as")
  - Examples: "[name] plays a key role in...", "In their current position at [company], [name] contributes to...", "[name] supports the success of [company] through..."
- Do NOT repeat elements from Bio (career history, technical skills, GitHub details, LinkedIn data)
- Do NOT describe employee's background or responsibilities
- Focus ONLY on future potential, organizational impact, and development path
- Describe future trajectory inside the company — not their past

### Key Separation

- **Bio**: Past & Present → Who they are, what they've done, current role
- **Value Proposition**: Future & Company Value → Strategic contribution, target role, development needs, organizational impact

---

## Microservice Integration

### Microservices Integrated

1. **Skills Engine**: Employee skills data
2. **Course Builder**: Course enrollment data
3. **Learner AI**: Learning path recommendations
4. **Learning Analytics**: Analytics and metrics

### Integration Pattern

**Universal Envelope Structure**:
```json
{
  "requester_service": "directory_service",
  "payload": { ... },
  "response": { ... }
}
```

### MicroserviceClient

**Location**: `backend/src/infrastructure/MicroserviceClient.js`

**Methods**:
- `getEmployeeSkills(employeeId, companyId)` - Skills Engine
- `getEmployeeCourses(employeeId, companyId)` - Course Builder
- `getEmployeeLearningPath(employeeId, companyId)` - Learner AI
- `getEmployeeDashboard(employeeId, companyId)` - Learning Analytics

**Mock Data Fallback**:
- All microservices have mock data fallback
- Mock data in `mockData/index.json`
- Hardcoded fallback in `MicroserviceClient.js` if file not found
- Ensures data is always displayed even if microservice is unavailable

### Profile Status Gate

- Learning & Development sections only visible when `profile_status === 'approved'`
- Enforced in frontend components
- Backend also checks before returning data

---

## Error Handling & Solutions

### Common Errors & Fixes

#### 1. CSV Upload Errors

**Error**: "Approval policy must be either 'manual' or 'auto'"
- **Cause**: Database constraint conflict (legacy constraint allowing 'automatic')
- **Fix**: Run `database/scripts/fix_approval_policy_constraints.sql` to drop legacy constraint

**Error**: "Invalid email format" or column misalignment
- **Cause**: Employee rows missing empty fields for company columns
- **Fix**: Ensure employee rows have 10 empty fields at start to match header column count

**Error**: "Reserved email cannot be used"
- **Cause**: Attempting to use `admin@educore.io`
- **Fix**: Use different email address

#### 2. Profile Errors

**Error**: "Failed to load pending requests" (401 Unauthorized)
- **Cause**: New company with no requests, or unauthenticated user
- **Fix**: Handle 401 gracefully - show "No requests pending" instead of error

**Error**: "Management hierarchy not found" (404)
- **Cause**: UUID comparison mismatch or no managed employees
- **Fix**: Convert UUIDs to strings for comparison, implement fallback logic

**Error**: Skills not displaying
- **Cause**: Data extraction path issue or mock data not found
- **Fix**: Update data extraction logic, ensure mock data fallback exists

#### 3. Authentication Errors

**Error**: "Admin login not working"
- **Cause**: Admin account not created
- **Fix**: Run `database/scripts/create_admin_account_standalone.sql`

**Error**: "Token not found"
- **Cause**: Token not in localStorage
- **Fix**: Check token storage, ensure login flow completes

### Error Handling Patterns

1. **Graceful Degradation**: Handle 401 errors gracefully when absence of data is acceptable
2. **Fallback Logic**: Management hierarchy has fallbacks for edge cases
3. **Transaction Safety**: All CSV processing in single transaction
4. **Pre-Validation**: Validate emails against database before transaction
5. **Double-Envelope Prevention**: Controllers should NOT manually wrap responses (middleware handles it)

---

## Special Considerations

### Do Not Modify

1. **Response Envelope Format**: Controllers should NOT manually wrap responses (middleware handles it)
2. **Auth Endpoints**: Do NOT use envelope structure for `/auth/*` endpoints
3. **UUID Comparisons**: Always convert to strings before comparing
4. **Admin Email**: `admin@educore.io` is reserved - validation must remain
5. **Profile Status Gates**: Learning & Development sections require `profile_status === 'approved'`

### Important Patterns

1. **Error Handling**: Always handle 401 errors gracefully when absence of data is acceptable
2. **Transaction Safety**: All CSV processing in single transaction
3. **Pre-Validation**: Validate emails against database before transaction
4. **Fallback Logic**: Management hierarchy has fallbacks for edge cases
5. **Read-Only Mode**: Admin views should never allow modifications
6. **Double-Envelope Prevention**: Let `formatResponse` middleware handle response wrapping

### Database Constraints

1. **Approval Policy**: Only 'manual' or 'auto' allowed (CHECK constraint)
2. **Email Uniqueness**: Enforced at database level
3. **Profile Status**: Must be 'basic', 'enriched', 'approved', or 'rejected'
4. **Reserved Email**: `admin@educore.io` validation in application layer

---

## Development Guidelines

### Code Organization

1. **Follow Onion Architecture**: Keep layers separated
2. **Use Cases**: Business logic goes in Application layer
3. **Repositories**: Database access goes in Infrastructure layer
4. **Controllers**: HTTP handling goes in Presentation layer

### Naming Conventions

1. **Use Cases**: `VerbNounUseCase.js` (e.g., `GetEmployeeSkillsUseCase.js`)
2. **Controllers**: `NounController.js` (e.g., `EmployeeController.js`)
3. **Repositories**: `NounRepository.js` (e.g., `EmployeeRepository.js`)

### Error Handling

1. **Use ErrorTranslator**: Translate technical errors to user-friendly messages
2. **Status Codes**: Use appropriate HTTP status codes
3. **Logging**: Log errors with context

### Testing

1. **Unit Tests**: Test use cases and repositories
2. **Integration Tests**: Test API endpoints
3. **CSV Tests**: Test CSV parsing and validation

---

## How to Continue Development

### Setting Up Development Environment

1. **Clone Repository**: `git clone [repo-url]`
2. **Install Dependencies**: 
   - Backend: `cd backend && npm install`
   - Frontend: `cd frontend && npm install`
3. **Set Environment Variables**: Configure `.env` files
4. **Run Database Migrations**: Execute `database/migrations/001_initial_schema.sql`
5. **Create Admin Account**: Run `database/scripts/create_admin_account_standalone.sql`
6. **Start Servers**:
   - Backend: `cd backend && npm start`
   - Frontend: `cd frontend && npm start`

### Adding New Features

1. **Follow Architecture**: Use appropriate layer
2. **Create Use Case**: Add business logic in Application layer
3. **Create Repository Method**: Add database access in Infrastructure layer
4. **Create Controller Method**: Add HTTP handler in Presentation layer
5. **Add Route**: Register route in `backend/src/index.js`
6. **Update Frontend**: Add UI components and service calls
7. **Test**: Write tests and test manually
8. **Document**: Update this documentation

### Modifying Existing Features

1. **Understand Current Implementation**: Read existing code
2. **Check Dependencies**: Understand what depends on the feature
3. **Make Changes**: Follow existing patterns
4. **Test**: Ensure no regressions
5. **Update Documentation**: Update relevant sections

### Database Changes

1. **Update Migration File**: Modify `database/migrations/001_initial_schema.sql`
2. **Test Migration**: Run on test database first
3. **Update Repositories**: Update repository methods if schema changes
4. **Update Documentation**: Update database schema section

---

## Troubleshooting Guide

### CSV Upload Issues

**Problem**: CSV upload fails with validation errors
- **Check**: CSV format matches requirements (row 1 = company, rows 2+ = employees)
- **Check**: Employee rows have empty fields for company columns
- **Check**: Base role requirement (REGULAR_EMPLOYEE or TRAINER)
- **Check**: Only one DECISION_MAKER per company
- **Check**: Email uniqueness and reserved email validation

**Problem**: "Approval policy must be either 'manual' or 'auto'"
- **Solution**: Run `database/scripts/fix_approval_policy_constraints.sql`

### Profile Issues

**Problem**: Skills not displaying
- **Check**: Profile status is 'approved'
- **Check**: Mock data exists in `mockData/index.json`
- **Check**: Data extraction path in frontend component
- **Check**: Backend logs for microservice errors

**Problem**: Management hierarchy not showing
- **Check**: Employee has TEAM_MANAGER or DEPARTMENT_MANAGER role
- **Check**: UUID comparison (convert to strings)
- **Check**: Fallback logic in `GetManagerHierarchyUseCase`

**Problem**: Pending requests not showing
- **Check**: 401 error handling (should show "No requests" instead of error)
- **Check**: Response envelope structure (no double-wrapping)
- **Check**: Database query filters correctly

### Authentication Issues

**Problem**: Admin login not working
- **Check**: Admin account exists in `directory_admins` table
- **Check**: Email is `admin@educore.io`
- **Check**: Password is `SecurePass123`
- **Solution**: Run `database/scripts/create_admin_account_standalone.sql`

**Problem**: Token not found
- **Check**: Token stored in localStorage
- **Check**: Authorization header includes token
- **Check**: Token format (admin tokens have `admin-` prefix)

### UI Issues

**Problem**: Components not rendering
- **Check**: React component imports
- **Check**: Props passed correctly
- **Check**: Console for errors
- **Check**: Network tab for API errors

**Problem**: Styling issues
- **Check**: CSS imports
- **Check**: Design tokens loaded
- **Check**: Component-specific styles

---

## Recent Changes & Updates

### 2025-01-21: OpenAI Prompt Separation

**Changes**:
- Separated Bio and Value Proposition prompts to eliminate overlap
- **Bio Prompt**: Now focuses ONLY on past and present (no future goals, target role, growth steps)
- **Value Proposition Prompt**: Now focuses ONLY on future and company value (no past history, technical skills, GitHub/LinkedIn data)
- **Opening Sentence**: Value Proposition now uses strategic contribution statements instead of "currently works as"

**Files Modified**:
- `backend/src/infrastructure/OpenAIAPIClient.js`
  - `buildBioPrompt()`: Removed future goals, added CRITICAL instruction
  - `buildValuePropositionPrompt()`: Changed opening, added CRITICAL instruction, removed past references

**Impact**:
- Bio and Value Proposition now have distinct purposes
- No duplication between the two sections
- Better alignment with business requirements

### 2025-11-21: Skills Display Update

**Changes**:
- Updated mock skills data from "Software Development" to "Data Analysis" structure
- Implemented hierarchical tree view for skills display
- Removed relevance score and skills gap sections
- Changed "View More" to "Verify Your Skills" button

**Files Modified**:
- `mockData/index.json`: Updated skills structure
- `backend/src/infrastructure/MicroserviceClient.js`: Updated hardcoded fallback
- `frontend/src/components/ProfileSkills.js`: Implemented tree view

### Previous Major Updates

See `docs/Project Summary – Features, UI, Logic, and CSV Requirements.md` for detailed history of:
- CSV format modifications
- Profile UI updates
- Management hierarchy fixes
- Request system implementation
- Admin dashboard implementation
- Error fixes and solutions

---

## Additional Documentation Files

For more detailed information on specific topics, refer to:

- **CSV Format**: `docs/CSV_FORMAT_GUIDE.md`
- **Profile Implementation**: `docs/modification_of_csv_and_profiles.md`
- **OpenAI Integration**: `docs/OPENAI-PROMPTS-AND-DATA.md`
- **System Overview**: `docs/system-overview.md`
- **Project Summary**: `docs/Project Summary – Features, UI, Logic, and CSV Requirements.md`

---

**Document Version**: 1.0  
**Last Updated**: 2025-01-21  
**Maintained By**: Development Team

---

*This master documentation serves as the complete reference for the EDUCORE Directory Management System. Use this document to understand the entire system, continue development, troubleshoot issues, and onboard new team members.*

