# Postman Testing Guide - Microservice Generic Endpoints

This guide shows how to test the generic endpoints (`/api/fill-content-metrics`) for each microservice using Postman.

## 📋 Prerequisites

1. **Postman installed** (or use any REST client)
2. **Microservice URLs** from `backend/src/config.js`
3. **Envelope structure** understanding

---

## 🔧 Postman Setup

### 1. Request Method & URL

- **Method**: `POST`
- **URL**: `https://[microservice-url]/api/fill-content-metrics`
- **Headers**: 
  ```
  Content-Type: application/json
  ```

### 2. Request Body (Raw JSON)

**IMPORTANT**: The body must use the envelope structure:
```json
{
  "requester_service": "directory",
  "payload": { ... },
  "response": { ... }
}
```

---

## 📝 Example Requests

### 1. Test Skills Engine

**URL**: `POST https://skillsengine-production.up.railway.app/api/fill-content-metrics`

**Headers**:
```
Content-Type: application/json
```

**Body** (Raw JSON):
```json
{
  "requester_service": "directory",
  "payload": {
    "employee_id": "EMP001",
    "company_id": "COMP001",
    "employee_type": "regular_employee",
    "raw_data": {
      "github": {
        "login": "testuser",
        "bio": "Software Developer",
        "repos": [
          {
            "name": "test-repo",
            "language": "JavaScript",
            "description": "Test repository"
          }
        ]
      },
      "linkedin": {
        "firstName": "John",
        "lastName": "Doe",
        "headline": "Software Engineer"
      }
    }
  },
  "response": {
    "user_id": 0,
    "competencies": [],
    "relevance_score": 0
  }
}
```

**Expected Response**:
```json
{
  "requester_service": "directory",
  "payload": { ... },
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
    "relevance_score": 75.5
  }
}
```

---

### 2. Test Course Builder

**URL**: `POST https://coursebuilderfs-production.up.railway.app/api/fill-content-metrics`

**Body**:
```json
{
  "requester_service": "directory",
  "payload": {
    "employee_id": "EMP001",
    "company_id": "COMP001"
  },
  "response": {
    "assigned_courses": [],
    "in_progress_courses": [],
    "completed_courses": []
  }
}
```

---

### 3. Test Learner AI

**URL**: `POST https://learner-ai-backend-production.up.railway.app/api/fill-learner-ai-fields`

**⚠️ Note**: Learner AI uses a **different endpoint** (`/api/fill-learner-ai-fields` instead of `/api/fill-content-metrics`)

**Body**:
```json
{
  "requester_service": "directory",
  "payload": {
    "employee_id": "EMP001",
    "company_id": "COMP001"
  },
  "response": {
    "path_id": "",
    "courses": [],
    "progress": 0,
    "recommendations": []
  }
}
```

---

### 4. Test Management & Reporting

**URL**: `POST https://lotusproject-production.up.railway.app/api/fill-content-metrics`

**Body**:
```json
{
  "requester_service": "directory",
  "payload": {
    "company_id": "COMP001",
    "company_name": "Test Company"
  },
  "response": {
    "status": "",
    "analytics": {}
  }
}
```

---

### 5. Test Learning Analytics

**URL**: `POST https://learning-analytics-production.up.railway.app/api/fill-content-metrics`

**Body**:
```json
{
  "requester_service": "directory",
  "payload": {
    "employee_id": "EMP001",
    "company_id": "COMP001"
  },
  "response": {
    "progress_summary": {},
    "recent_activity": [],
    "upcoming_deadlines": [],
    "achievements": []
  }
}
```

---

### 6. Test Content Studio

**URL**: `POST https://content-studio-production-76b6.up.railway.app/api/fill-content-metrics`

**Body**:
```json
{
  "requester_service": "directory",
  "payload": {
    "trainer_id": "TR-123",
    "trainer_name": "Anna Cohen",
    "company_id": "COMP001",
    "aiEnabled": true,
    "can_publish_publicly": false,
    "exercises_limited": true,
    "num_of_exercises": 4
  },
  "response": {
    "course_id": "",
    "course_name": "",
    "trainer_id": "",
    "trainer_name": "",
    "status": ""
  }
}
```

---

### 7. Test Assessment

**URL**: `POST https://assessment-tests-production.up.railway.app/api/fill-content-metrics`

**Body**:
```json
{
  "requester_service": "directory",
  "payload": {
    "passing_grade": 70,
    "max_attempts": 3
  },
  "response": {
    "status": ""
  }
}
```

---

## 🧪 Testing Directory's Own Endpoint

You can also test if Directory's universal endpoint works (when other microservices call Directory):

**URL**: `POST https://directory3-production.up.railway.app/api/fill-content-metrics`

**Example - Skills Engine calling Directory**:
```json
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
```

**Expected Response** (Directory fills the response):
```json
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
```

---

## ✅ Success Criteria

1. **Status Code**: `200 OK`
2. **Response Structure**: Must match envelope format with `requester_service`, `payload`, and `response`
3. **Response Fields**: The `response` object should have fields filled (not empty/default values)
4. **Content-Type**: Response should be `application/json`

---

## ❌ Common Issues

### Issue 1: 404 Not Found
- **Cause**: Wrong endpoint URL
- **Solution**: Check the URL, especially for Learner AI (uses `/api/fill-learner-ai-fields`)

### Issue 2: 400 Bad Request
- **Cause**: Missing required fields in envelope
- **Solution**: Ensure all three fields are present: `requester_service`, `payload`, `response`

### Issue 3: 500 Internal Server Error
- **Cause**: Microservice might be down or payload structure is incorrect
- **Solution**: Check microservice logs, verify payload structure matches spec

### Issue 4: Empty Response Fields
- **Cause**: Response template might not match what microservice expects
- **Solution**: Check the microservice integration spec for correct response template

---

## 📦 Postman Collection

You can create a Postman Collection with all these requests:

1. **Create New Collection**: "EduCore Microservices"
2. **Add Environment Variables**:
   - `SKILLS_ENGINE_URL`: `https://skillsengine-production.up.railway.app`
   - `COURSE_BUILDER_URL`: `https://coursebuilderfs-production.up.railway.app`
   - `LEARNER_AI_URL`: `https://learner-ai-backend-production.up.railway.app`
   - `MANAGEMENT_REPORTING_URL`: `https://lotusproject-production.up.railway.app`
   - `LEARNING_ANALYTICS_URL`: `https://learning-analytics-production.up.railway.app`
   - `CONTENT_STUDIO_URL`: `https://content-studio-production-76b6.up.railway.app`
   - `ASSESSMENT_URL`: `https://assessment-tests-production.up.railway.app`
   - `DIRECTORY_URL`: `https://directory3-production.up.railway.app`

3. **Use Variables in URLs**: `{{SKILLS_ENGINE_URL}}/api/fill-content-metrics`

---

## 🔍 Debugging Tips

1. **Check Response Headers**: Look for `Content-Type: application/json`
2. **Check Response Body**: Should be stringified JSON (might need to parse)
3. **Check Console Logs**: If testing locally, check backend logs
4. **Test with Minimal Payload**: Start with empty `payload: {}` and minimal `response: {}`
5. **Verify Envelope Structure**: Always include all three fields

---

## 📞 Next Steps

After testing:
1. ✅ Verify all endpoints respond correctly
2. ✅ Check response structure matches envelope format
3. ✅ Verify response fields are filled (not empty)
4. ✅ Test error handling (wrong payload, missing fields)
5. ✅ Test fallback mechanism (if microservice is down)

