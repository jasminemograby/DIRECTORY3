# API Interaction Rules - Directory Microservice

This document describes the mandatory API communication model for Directory and all other microservices in the EduCore ecosystem.

**Last Updated**: Based on API Interaction Rules description

---

## 🟦 1. Universal API Communication Model

### Critical Rule
**Directory does NOT call dozens of endpoints.**
**All communication MUST go through ONE universal generic endpoint per microservice using a strict envelope structure.**
**This is mandatory for the entire architecture.**

### Universal Endpoints

Each microservice has a SINGLE generic endpoint:

| Microservice | Universal Endpoint |
|--------------|-------------------|
| **Assessment** | `https://assessment-tests-production.up.railway.app/api/fill-content-metrics` |
| **Management Reporting** | `https://lotusproject-production.up.railway.app/api/fill-content-metrics` |
| **Course Builder** | `https://coursebuilderfs-production.up.railway.app/api/fill-content-metrics` |
| **Content Studio** | `https://content-studio-production-76b6.up.railway.app/api/fill-content-metrics` |
| **Skills Engine** | `https://skillsengine-production.up.railway.app/api/fill-content-metrics` |
| **Directory** | `https://directory3-production.up.railway.app/api/fill-content-metrics` |

### Envelope Structure

**Every request MUST contain exactly 3 fields:**

```json
{
  "requester_service": "directory",
  "payload": { ... },
  "response": { ... }
}
```

#### Field Rules:

1. **`requester_service`** (Required)
   - Always a string
   - Identifies who is calling (the name of microservice)
   - Valid values: `"directory"`, `"skills-engine"`, `"coursebuilder"`, `"content-studio"`, `"assessment"`, `"management"`, etc.

2. **`payload`** (Required)
   - The data the calling microservice is sending
   - OR an empty object `{}` if no data is being sent
   - Always parsed and validated by the receiving microservice

3. **`response`** (Required)
   - Defines the shape of the answer you want back
   - Directory must fill EXACTLY these fields
   - Directory returns the same object, with fields populated
   - Example:
     ```json
     {
       "requester_service": "skills-engine",
       "payload": {
         "employee_id": "EMP001",
         "employee_type": "trainer"
       },
       "response": {
         "normalized_skills": [],
         "competencies": [],
         "unverified_skills": []
       }
     }
     ```

### Stringification Rules

**CRITICAL**: Everything must be **STRINGIFIED** on the way in, and **STRINGIFIED** on the way out.

- Request body: `JSON.stringify(envelope)`
- Response body: `JSON.stringify(envelope)`
- The receiving microservice parses the stringified JSON

---

## 🟦 2. Directory's Role in This Architecture

### Directory is a Data Provider

When another microservice calls Directory through its universal endpoint (`/api/fill-content-metrics`), Directory must:

1. **Parse the envelope** (`requester_service`, `payload`, `response`)
2. **Use AI-generated SQL** based on the migration files (NOT raw DB queries)
3. **Execute dynamic queries** automatically
4. **Fill the response object** exactly as requested
5. **Return the completed response** as stringified JSON

### Example Flow:

```
Skills Engine → Directory
{
  "requester_service": "skills-engine",
  "payload": {
    "employee_id": "EMP001"
  },
  "response": {
    "employee_name": "",
    "employee_email": "",
    "current_role": "",
    "target_role": ""
  }
}

Directory processes:
1. Parse envelope
2. AI generates SQL: SELECT full_name, email, current_role_in_company, target_role_in_company FROM employees WHERE employee_id = 'EMP001'
3. Execute query
4. Fill response:
{
  "requester_service": "skills-engine",
  "payload": { ... },
  "response": {
    "employee_name": "John Doe",
    "employee_email": "john@company.com",
    "current_role": "Software Engineer",
    "target_role": "Senior Software Engineer"
  }
}
5. Return stringified JSON
```

---

## 🟦 3. AI Query Generation (CRITICAL)

### AI Receives:
- The `payload` from the request
- The `response` structure (what fields are needed)
- All migration files (database schema)
- Validation rules

### AI Decides:
- Which SQL query to generate to fill the required fields
- How to map request fields to database fields (schema matching)

### Key Requirements:

1. **No SQL Files in Repo**
   - AI builds SQL queries dynamically
   - No hardcoded SQL queries

2. **Prevent Prompt Injection**
   - Validate and sanitize all inputs
   - Ensure AI-generated SQL is safe

3. **Validate Generated SQL**
   - Check SQL syntax
   - Verify against schema
   - Prevent SQL injection

4. **Schema Matching**
   - If microservice requests field `"user_id"` but Directory DB has `"employee_id"`, AI must detect the mapping
   - AI must understand field name variations and map them correctly
   - Example mappings:
     - `user_id` → `employee_id`
     - `user_name` → `full_name`
     - `company_id` → `company_id` (same)
     - `skill_list` → (query from `employee_roles` or Skills Engine data)

### Implementation Notes:
- AI query generation must be implemented as a service/utility
- Must have validation layer before executing AI-generated SQL
- Must log all AI-generated queries for auditing

---

## 🟦 4. Fallback Mechanism

### Critical Rule
**Whenever Directory calls another microservice:**
- If the call fails (timeout, network error, 500, missing fields)
- Directory MUST load mock data from: `/mockData/index.json`
- Every microservice has a dedicated mock entry
- **Cursor must ALWAYS implement fallback logic automatically**

### Fallback Scenarios:
1. **Network Error**: Connection timeout, DNS failure
2. **HTTP Error**: 500, 502, 503, 404
3. **Missing Fields**: Response doesn't contain required fields
4. **Invalid Response**: Response structure doesn't match expected format

### Mock Data Structure:

```json
{
  "skills-engine": {
    "normalize-skills": {
      "normalized_skills": [...],
      "competencies": [...],
      "unverified_skills": [...]
    },
    "verify-skills": {
      "verified_skills": [...],
      "relevance_score": 75
    }
  },
  "course-builder": {
    "language-sync": {
      "status": "success"
    },
    "completion-feedback": {
      "course_id": "...",
      "feedback": "..."
    }
  },
  "content-studio": {
    "create-course": {
      "course_id": "...",
      "status": "created"
    },
    "trainer-status": {
      "status": "active"
    }
  },
  "learner-ai": {
    "learning-path": {
      "path_id": "...",
      "courses": [...]
    }
  },
  "assessment": {
    "assessment-result": {
      "score": 85,
      "passed": true
    }
  },
  "management-reporting": {
    "analytics": {
      "total_employees": 100,
      "active_courses": 50
    }
  }
}
```

### Implementation:
- Every API call to another microservice must have try-catch
- On error, load from `/mockData/index.json`
- Log fallback usage for monitoring

---

## 🟦 5. Global URLs Configuration

### Storage Location
All microservice base URLs are stored in:
- **Config file**: `/backend/src/config.js`
- **Environment variables**: `.env` (for production)

### Configuration Structure:

```javascript
// backend/src/config.js
const config = {
  microservices: {
    skillsEngine: {
      baseUrl: process.env.SKILLS_ENGINE_URL || 'https://skillsengine-production.up.railway.app',
      endpoint: '/api/fill-content-metrics'
    },
    courseBuilder: {
      baseUrl: process.env.COURSE_BUILDER_URL || 'https://coursebuilderfs-production.up.railway.app',
      endpoint: '/api/fill-content-metrics'
    },
    contentStudio: {
      baseUrl: process.env.CONTENT_STUDIO_URL || 'https://content-studio-production-76b6.up.railway.app',
      endpoint: '/api/fill-content-metrics'
    },
    assessment: {
      baseUrl: process.env.ASSESSMENT_URL || 'https://assessment-tests-production.up.railway.app',
      endpoint: '/api/fill-content-metrics'
    },
    learnerAI: {
      baseUrl: process.env.LEARNER_AI_URL || 'https://learner-ai-production.up.railway.app',
      endpoint: '/api/fill-content-metrics'
    },
    managementReporting: {
      baseUrl: process.env.MANAGEMENT_REPORTING_URL || 'https://lotusproject-production.up.railway.app',
      endpoint: '/api/fill-content-metrics'
    },
    learningAnalytics: {
      baseUrl: process.env.LEARNING_ANALYTICS_URL || 'https://learning-analytics-production.up.railway.app',
      endpoint: '/api/fill-content-metrics'
    }
  },
  directory: {
    baseUrl: process.env.DIRECTORY_URL || 'https://directory3-production.up.railway.app',
    endpoint: '/api/fill-content-metrics'
  }
};
```

### Environment Variables:

```env
SKILLS_ENGINE_URL=https://skillsengine-production.up.railway.app
COURSE_BUILDER_URL=https://coursebuilderfs-production.up.railway.app
CONTENT_STUDIO_URL=https://content-studio-production-76b6.up.railway.app
ASSESSMENT_URL=https://assessment-tests-production.up.railway.app
LEARNER_AI_URL=https://learner-ai-production.up.railway.app
MANAGEMENT_REPORTING_URL=https://lotusproject-production.up.railway.app
LEARNING_ANALYTICS_URL=https://learning-analytics-production.up.railway.app
DIRECTORY_URL=https://directory3-production.up.railway.app
```

---

## 🟦 6. Directory's Universal Endpoint Implementation

### Endpoint: `POST /api/fill-content-metrics`

Directory must implement this endpoint to receive requests from other microservices.

### Request Handler Flow:

1. **Parse Request**:
   ```javascript
   const envelope = JSON.parse(req.body); // Already stringified
   const { requester_service, payload, response } = envelope;
   ```

2. **Validate Envelope**:
   - Check `requester_service` is valid
   - Check `payload` is object
   - Check `response` is object

3. **AI Query Generation**:
   - Pass `payload`, `response` structure, migration files to AI
   - AI generates SQL query
   - Validate generated SQL

4. **Execute Query**:
   - Run AI-generated SQL against database
   - Get results

5. **Fill Response**:
   - Map query results to `response` object fields
   - Handle schema matching (e.g., `user_id` → `employee_id`)

6. **Return Response**:
   ```javascript
   const filledEnvelope = {
     requester_service,
     payload,
     response: { /* filled fields */ }
   };
   res.send(JSON.stringify(filledEnvelope));
   ```

### Error Handling:
- If AI query generation fails → return error in response
- If SQL execution fails → return error in response
- If field mapping fails → return error in response
- Always return valid envelope structure (even on error)

---

## 🟦 7. Directory Calling Other Microservices

### Request Flow:

1. **Build Envelope**:
   ```javascript
   const envelope = {
     requester_service: "directory",
     payload: { /* data to send */ },
     response: { /* fields we want back */ }
   };
   ```

2. **Stringify**:
   ```javascript
   const requestBody = JSON.stringify(envelope);
   ```

3. **Make Request**:
   ```javascript
   const response = await axios.post(
     `${microserviceUrl}/api/fill-content-metrics`,
     requestBody,
     { headers: { 'Content-Type': 'application/json' } }
   );
   ```

4. **Parse Response**:
   ```javascript
   const envelope = JSON.parse(response.data); // Response is stringified
   const { response: filledResponse } = envelope;
   ```

5. **Fallback on Error**:
   ```javascript
   try {
     // Make request
   } catch (error) {
     // Load from /mockData/index.json
     const mockData = require('../mockData/index.json');
     const filledResponse = mockData[microserviceName][operationName];
   }
   ```

---

## 🟦 8. Validation Required Before Any New Feature

### Before Building New Features, ALWAYS Validate:

1. **Are all connections between microservices correctly implemented?**
   - Check if universal endpoint is used
   - Check if envelope structure is correct
   - Check if stringification is applied

2. **Does Directory have the database fields required by that integration?**
   - Check migration files
   - Verify schema matches request/response needs
   - Add fields if missing

3. **Does the universal endpoint support the needed request/response?**
   - Verify `/api/fill-content-metrics` can handle the request
   - Verify AI query generation can fill the response
   - Test schema matching

4. **Is fallback mock data ready?**
   - Add mock entries to `/mockData/index.json`
   - Test fallback logic
   - Ensure mock data structure matches expected response

### Never Continue Development If:
- Integration model is unclear
- Universal endpoint is not implemented
- Fallback mechanism is missing
- Mock data is not prepared

---

## Implementation Checklist

### Backend Implementation:
- [ ] Implement `/api/fill-content-metrics` endpoint in Directory
- [ ] Create AI query generation service
- [ ] Implement schema matching logic
- [ ] Add SQL validation layer
- [ ] Implement fallback mechanism
- [ ] Create microservice client utilities
- [ ] Update config with all microservice URLs
- [ ] Create `/mockData/index.json` with all mock entries

### Frontend Implementation:
- [ ] Update API service to use envelope structure (if needed)
- [ ] Handle stringified requests/responses
- [ ] Display fallback indicators (if mock data is used)

### Testing:
- [ ] Test universal endpoint with various request types
- [ ] Test AI query generation
- [ ] Test schema matching
- [ ] Test fallback mechanism
- [ ] Test error handling

---

## Critical Notes

1. **No Direct Endpoint Calls**: Never call specific endpoints like `/api/employees` or `/api/skills`. Always use `/api/fill-content-metrics`.

2. **Always Stringify**: Both request and response must be stringified JSON.

3. **Always Use Envelope**: Every request must have `requester_service`, `payload`, `response`.

4. **Always Implement Fallback**: Every external call must have fallback to mock data.

5. **AI Query Generation is Mandatory**: Directory cannot use hardcoded SQL queries when responding to other microservices.

6. **Schema Matching is Critical**: AI must understand field name variations and map them correctly.

---

## Files to Create/Update

### New Files:
- `/backend/src/infrastructure/AIQueryGenerator.js` - AI query generation service
- `/backend/src/infrastructure/SchemaMatcher.js` - Schema matching logic
- `/backend/src/infrastructure/MicroserviceClient.js` - Generic client for calling other microservices
- `/backend/src/presentation/UniversalEndpointController.js` - Handler for `/api/fill-content-metrics`
- `/mockData/index.json` - Mock data for all microservices

### Files to Update:
- `/backend/src/config.js` - Add microservice URLs
- `/backend/src/index.js` - Add universal endpoint route
- All existing API service files - Update to use envelope structure

