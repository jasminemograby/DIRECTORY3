# API Interaction Rules - Impact Analysis

This document identifies the impacts of the API Interaction Rules description on existing code and implementation.

**Generated**: After receiving API Interaction Rules description

---

## 🚨 CRITICAL ARCHITECTURAL CHANGES

### Major Discovery
The API interaction model is **completely different** from what was initially understood:

1. **No Direct Endpoints**: Directory does NOT call specific endpoints like `/api/employees` or `/api/skills`
2. **Universal Endpoint Only**: ALL communication goes through `/api/fill-content-metrics`
3. **Envelope Structure**: Every request uses `{ requester_service, payload, response }`
4. **AI Query Generation**: Directory uses AI to generate SQL dynamically (no hardcoded queries)
5. **Stringification**: Everything must be stringified on both input and output

---

## Impact on Previous Understanding

### ❌ Previous Assumptions (WRONG):
- Directory would call specific endpoints like:
  - `POST /api/skills/normalize`
  - `GET /api/employees/:id/skills`
  - `POST /api/courses/create`
- Each microservice would have multiple REST endpoints
- Directory would use direct database queries

### ✅ Correct Understanding (NEW):
- Directory calls ONE endpoint per microservice: `/api/fill-content-metrics`
- Uses envelope structure with `requester_service`, `payload`, `response`
- Directory itself must implement `/api/fill-content-metrics` to receive requests
- Directory uses AI to generate SQL queries dynamically
- All requests/responses are stringified JSON

---

## Backend Implementation Impacts

### 1. New Universal Endpoint Required

**File**: `/backend/src/presentation/UniversalEndpointController.js` (NEW)

**Purpose**: Handle requests from other microservices

**Flow**:
1. Parse stringified envelope
2. Validate envelope structure
3. Use AI to generate SQL query
4. Execute query
5. Fill response object
6. Return stringified envelope

**Route**: `POST /api/fill-content-metrics`

### 2. AI Query Generation Service

**File**: `/backend/src/infrastructure/AIQueryGenerator.js` (NEW)

**Purpose**: Generate SQL queries dynamically based on:
- `payload` from request
- `response` structure (what fields are needed)
- Migration files (database schema)
- Validation rules

**Requirements**:
- Prevent prompt injection
- Validate generated SQL
- Ensure schema matching (e.g., `user_id` → `employee_id`)

### 3. Schema Matching Service

**File**: `/backend/src/infrastructure/SchemaMatcher.js` (NEW)

**Purpose**: Map request field names to database field names

**Examples**:
- `user_id` → `employee_id`
- `user_name` → `full_name`
- `company_id` → `company_id` (same)
- `skill_list` → (query from `employee_roles` or related tables)

### 4. Microservice Client Utility

**File**: `/backend/src/infrastructure/MicroserviceClient.js` (NEW)

**Purpose**: Generic client for calling other microservices

**Features**:
- Build envelope structure
- Stringify request
- Make HTTP request
- Parse stringified response
- Implement fallback to mock data

**Usage**:
```javascript
const client = new MicroserviceClient('skills-engine');
const response = await client.call({
  payload: { employee_id: 'EMP001' },
  response: { normalized_skills: [], competencies: [] }
});
```

### 5. Fallback Mechanism

**File**: `/mockData/index.json` (NEW)

**Purpose**: Store mock data for all microservices

**Structure**:
```json
{
  "skills-engine": {
    "normalize-skills": { ... },
    "verify-skills": { ... }
  },
  "course-builder": {
    "language-sync": { ... },
    "completion-feedback": { ... }
  },
  ...
}
```

**Implementation**: Every API call must have try-catch with fallback to mock data

### 6. Configuration Updates

**File**: `/backend/src/config.js` (UPDATE)

**Add**:
```javascript
microservices: {
  skillsEngine: { baseUrl: ..., endpoint: '/api/fill-content-metrics' },
  courseBuilder: { baseUrl: ..., endpoint: '/api/fill-content-metrics' },
  // ... all microservices
}
```

### 7. Route Updates

**File**: `/backend/src/index.js` (UPDATE)

**Add**:
```javascript
apiRouter.post('/fill-content-metrics', (req, res, next) => {
  universalEndpointController.handle(req, res, next);
});
```

---

## Impact on Existing Code

### ❌ Code That Needs Major Changes:

1. **All Existing API Service Files** (if any exist)
   - Must be rewritten to use envelope structure
   - Must use universal endpoint
   - Must implement fallback

2. **Any Direct Database Queries in Controllers**
   - When responding to other microservices, must use AI query generation
   - Cannot use hardcoded SQL

3. **Request/Response Formatting**
   - Must stringify all requests
   - Must parse stringified responses
   - Must use envelope structure

### ✅ Code That Can Stay (with modifications):

1. **Internal Directory Endpoints** (for frontend)
   - Frontend → Directory endpoints can stay as-is
   - Only Directory ↔ Other Microservices uses universal endpoint

2. **Database Repositories**
   - Can still use direct queries for internal operations
   - But when responding to other microservices, must use AI generation

---

## Frontend Impacts

### Minimal Impact
Frontend continues to call Directory's internal endpoints (e.g., `/api/v1/companies/:id/profile`).

**No changes needed** for:
- Company Profile page
- Employee Profile page (when built)
- Registration flows
- CSV upload

**Only change**: If frontend needs to call other microservices directly (unlikely), it would need to use envelope structure.

---

## Database Schema Impacts

### No Schema Changes Required
The database schema remains the same. The AI query generation will work with the existing schema.

**However**: AI query generation must understand:
- All table names
- All column names
- Relationships between tables
- How to map request fields to database fields

---

## Testing Impacts

### New Testing Requirements:

1. **Test Universal Endpoint**:
   - Test with various `requester_service` values
   - Test with various `payload` structures
   - Test with various `response` structures
   - Test schema matching

2. **Test AI Query Generation**:
   - Test prompt injection prevention
   - Test SQL validation
   - Test schema matching accuracy
   - Test error handling

3. **Test Fallback Mechanism**:
   - Test network error fallback
   - Test HTTP error fallback
   - Test missing field fallback
   - Test invalid response fallback

4. **Test Microservice Client**:
   - Test envelope building
   - Test stringification
   - Test request/response parsing
   - Test fallback logic

---

## Unclear Points - Updated Status

### ✅ Now Answered:

1. **Redirect URLs** - ✅ ANSWERED
   - URLs stored in config
   - All use `/api/fill-content-metrics` endpoint
   - User context passed in `payload`

### ⚠️ Still Unclear (Need Third Description):

1. **Employee Profile Enrichment Timing** - Still unclear
2. **LinkedIn/GitHub OAuth Flow** - Still unclear
3. **Decision Maker Designation** - Still unclear
4. **Trainer Status Lifecycle** - Still unclear
5. **Course Completion Display** - Still unclear
6. **Skill Verification Button** - Still unclear
7. **Learning Path Approval Policy** - Still unclear

---

## Implementation Priority

### Phase 1: Core Infrastructure (CRITICAL)
1. Implement `/api/fill-content-metrics` endpoint
2. Create AI query generation service
3. Create schema matching service
4. Create microservice client utility
5. Implement fallback mechanism
6. Create mock data file

### Phase 2: Integration
1. Update config with all microservice URLs
2. Test universal endpoint with sample requests
3. Test AI query generation
4. Test fallback mechanism

### Phase 3: Feature Integration
1. Integrate Skills Engine (envelope structure)
2. Integrate Course Builder (envelope structure)
3. Integrate Content Studio (envelope structure)
4. Integrate all other microservices

---

## Critical Notes

1. **This is a MAJOR architectural change** - affects how Directory communicates with ALL microservices

2. **AI Query Generation is mandatory** - Directory cannot use hardcoded SQL when responding to other microservices

3. **Fallback is mandatory** - Every external call must have fallback to mock data

4. **Stringification is mandatory** - All requests/responses must be stringified

5. **Envelope structure is mandatory** - Every request must have `requester_service`, `payload`, `response`

6. **No exceptions** - This applies to ALL microservice communication

---

## Files Created

1. `/docs/API-Interaction-Rules.md` - Complete API interaction rules documentation
2. `/docs/API-Interaction-Rules-Impacts.md` - This impact analysis document

