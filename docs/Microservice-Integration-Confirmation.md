# Microservice Integration - Confirmation

## ✅ Confirmed Understanding

### 1. Envelope Structure (MANDATORY)
Every microservice call MUST use:
```json
{
  "requester_service": "directory",
  "payload": { /* data we send */ },
  "response": { /* template of what we want back */ }
}
```

### 2. Stringification (MANDATORY)
- Request: `JSON.stringify(envelope)` before sending
- Response: Parse stringified JSON when receiving
- Both ways are stringified

### 3. Universal Endpoints
- **Most microservices**: `/api/fill-content-metrics`
- **Learner AI**: `/api/fill-learner-ai-fields` ⚠️ Different endpoint

### 4. What Directory Sends to Skills Engine
**When**: First profile enrichment (after LinkedIn + GitHub connected)
```json
{
  "requester_service": "directory",
  "payload": {
    "employee_id": "<employee_id>",
    "company_id": "<company_id>",
    "employee_type": "<roleType>", // e.g., "trainer", "regular_employee"
    "raw_data": {
      "github": { /* GitHub API JSON */ },
      "linkedin": { /* LinkedIn API JSON */ }
    }
  },
  "response": {
    "user_id": 0,
    "competencies": [],
    "relevance_score": 0
  }
}
```

### 5. What Directory Receives from Skills Engine
```json
{
  "requester_service": "directory",
  "payload": { /* same as sent */ },
  "response": {
    "user_id": 1024,
    "competencies": [
      {
        "name": "Data Science",
        "nested_competencies": [
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
        ]
      }
    ],
    "relevance_score": 78.4,
    "gap": {
      "missing_skills": ["Power BI", "Tableau"]
    }
  }
}
```

### 6. What Directory Sends to Course Builder
**When**: Fetching employee courses
```json
{
  "requester_service": "directory",
  "payload": {
    "employee_id": "<employee_id>",
    "company_id": "<company_id>"
  },
  "response": {
    "assigned_courses": [],
    "in_progress_courses": [],
    "completed_courses": []
  }
}
```

### 7. What Directory Sends to Learner AI
**When**: Fetching learning path
```json
{
  "requester_service": "directory",
  "payload": {
    "employee_id": "<employee_id>",
    "company_id": "<company_id>"
  },
  "response": {
    "path_id": "",
    "courses": [],
    "progress": 0,
    "recommendations": []
  }
}
```
**Endpoint**: `/api/fill-learner-ai-fields` (different from others)

### 8. Fallback Mechanism (MANDATORY)
- If API call fails → use mock data from `/mockData/index.json`
- Mock data structure: `mockData[microservice-name][operation-name]`
- Example: `mockData['skills-engine']['normalize-skills']`

### 9. Profile Status Check (MANDATORY)
- Skills, Courses, Dashboard, Requests, Learning Path sections **ONLY visible when `profile_status === 'approved'`**
- Employees with `profile_status === 'enriched'` see "Waiting for HR Approval"
- Employees with `profile_status === 'basic'` are redirected to enrichment page

### 10. Implementation Safety
- ✅ Never break existing enrichment flow
- ✅ Never break HR approval workflow
- ✅ Never break profile status logic
- ✅ Always use envelope structure
- ✅ Always implement fallback
- ✅ Always check profile_status before showing sections

