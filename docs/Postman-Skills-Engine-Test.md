# Postman Test - Skills Engine Normalize Skills

## Test: Send Raw Data to Skills Engine and Get Normalized Skills

### Request Configuration

**Method**: `POST`

**URL**: 
```
https://skillsengine-production.up.railway.app/api/fill-content-metrics
```

**Headers**:
```
Content-Type: application/json
```

### Request Body (Raw JSON)

```json
{
  "requester_service": "directory",
  "payload": {
    "employee_id": "EMP001",
    "company_id": "COMP001",
    "employee_type": "regular_employee",
    "raw_data": {
      "github": {
        "login": "johndoe",
        "id": 12345678,
        "avatar_url": "https://avatars.githubusercontent.com/u/12345678",
        "name": "John Doe",
        "bio": "Full-stack developer passionate about JavaScript, React, Node.js, and Python. Building scalable web applications.",
        "company": "TechFlow Innovations",
        "blog": "https://johndoe.dev",
        "location": "San Francisco, CA",
        "email": "john.doe@example.com",
        "public_repos": 25,
        "public_gists": 10,
        "followers": 150,
        "following": 80,
        "created_at": "2018-01-15T10:30:00Z",
        "updated_at": "2024-11-19T15:45:00Z",
        "repositories": [
          {
            "id": 123456789,
            "name": "ecommerce-platform",
            "full_name": "johndoe/ecommerce-platform",
            "description": "Full-stack e-commerce platform built with React and Node.js",
            "url": "https://api.github.com/repos/johndoe/ecommerce-platform",
            "html_url": "https://github.com/johndoe/ecommerce-platform",
            "language": "JavaScript",
            "stargazers_count": 45,
            "forks_count": 12,
            "open_issues_count": 3,
            "created_at": "2023-05-10T08:00:00Z",
            "updated_at": "2024-10-15T14:20:00Z",
            "pushed_at": "2024-11-10T09:30:00Z",
            "is_fork": false,
            "is_private": false
          },
          {
            "id": 234567890,
            "name": "data-analysis-tool",
            "full_name": "johndoe/data-analysis-tool",
            "description": "Python tool for analyzing large datasets using pandas and numpy",
            "url": "https://api.github.com/repos/johndoe/data-analysis-tool",
            "html_url": "https://github.com/johndoe/data-analysis-tool",
            "language": "Python",
            "stargazers_count": 28,
            "forks_count": 8,
            "open_issues_count": 1,
            "created_at": "2023-08-20T10:15:00Z",
            "updated_at": "2024-09-25T11:45:00Z",
            "pushed_at": "2024-11-05T16:20:00Z",
            "is_fork": false,
            "is_private": false
          },
          {
            "id": 345678901,
            "name": "react-component-library",
            "full_name": "johndoe/react-component-library",
            "description": "Reusable React components with TypeScript",
            "url": "https://api.github.com/repos/johndoe/react-component-library",
            "html_url": "https://github.com/johndoe/react-component-library",
            "language": "TypeScript",
            "stargazers_count": 67,
            "forks_count": 15,
            "open_issues_count": 2,
            "created_at": "2023-02-14T09:30:00Z",
            "updated_at": "2024-11-12T13:10:00Z",
            "pushed_at": "2024-11-15T10:00:00Z",
            "is_fork": false,
            "is_private": false
          }
        ]
      },
      "linkedin": {
        "id": "abc123xyz",
        "firstName": {
          "localized": {
            "en_US": "John"
          },
          "preferredLocale": {
            "country": "US",
            "language": "en"
          }
        },
        "lastName": {
          "localized": {
            "en_US": "Doe"
          },
          "preferredLocale": {
            "country": "US",
            "language": "en"
          }
        },
        "profilePicture": {
          "displayImage": "https://media.licdn.com/dms/image/profile-picture-url"
        },
        "headline": "Senior Full-Stack Developer | React | Node.js | Python | Building Scalable Web Applications",
        "summary": "Experienced full-stack developer with 5+ years of expertise in JavaScript, React, Node.js, and Python. Passionate about building scalable web applications and solving complex technical challenges. Strong background in frontend development, backend architecture, and database design.",
        "positions": {
          "elements": [
            {
              "id": 1234567890,
              "title": "Senior Full-Stack Developer",
              "description": "Lead development of e-commerce platform using React and Node.js. Architected scalable backend services handling 1M+ daily requests. Mentored junior developers and established coding standards.",
              "companyName": "TechFlow Innovations",
              "location": {
                "country": "US",
                "geographicArea": "San Francisco Bay Area"
              },
              "timePeriod": {
                "startDate": {
                  "year": 2021,
                  "month": 3
                },
                "endDate": null
              }
            },
            {
              "id": 2345678901,
              "title": "Full-Stack Developer",
              "description": "Developed and maintained multiple web applications using React, Node.js, and PostgreSQL. Collaborated with cross-functional teams to deliver high-quality software solutions.",
              "companyName": "StartupXYZ",
              "location": {
                "country": "US",
                "geographicArea": "San Francisco"
              },
              "timePeriod": {
                "startDate": {
                  "year": 2019,
                  "month": 6
                },
                "endDate": {
                  "year": 2021,
                  "month": 2
                }
              }
            }
          ]
        },
        "skills": {
          "elements": [
            {
              "name": "JavaScript",
              "endorsementCount": 25
            },
            {
              "name": "React",
              "endorsementCount": 20
            },
            {
              "name": "Node.js",
              "endorsementCount": 18
            },
            {
              "name": "Python",
              "endorsementCount": 15
            },
            {
              "name": "TypeScript",
              "endorsementCount": 12
            },
            {
              "name": "PostgreSQL",
              "endorsementCount": 10
            }
          ]
        }
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

### Expected Response

If Skills Engine is working correctly, you should receive:

```json
{
  "requester_service": "directory",
  "payload": { ... },
  "response": {
    "user_id": 1024,
    "competencies": [
      {
        "name": "Software Development",
        "nested_competencies": [
          {
            "name": "Frontend Development",
            "nested_competencies": [
              {
                "name": "JavaScript Frameworks",
                "skills": [
                  { "name": "React", "verified": true },
                  { "name": "TypeScript", "verified": true }
                ]
              }
            ]
          },
          {
            "name": "Backend Development",
            "nested_competencies": [
              {
                "name": "Server Technologies",
                "skills": [
                  { "name": "Node.js", "verified": true },
                  { "name": "Python", "verified": true }
                ]
              }
            ]
          },
          {
            "name": "Database Management",
            "nested_competencies": [
              {
                "name": "Relational Databases",
                "skills": [
                  { "name": "PostgreSQL", "verified": true }
                ]
              }
            ]
          }
        ]
      }
    ],
    "relevance_score": 85.5,
    "gap": {
      "missing_skills": ["Docker", "Kubernetes", "AWS"]
    }
  }
}
```

### What to Check

1. ✅ **Status Code**: Should be `200 OK`
2. ✅ **Response Structure**: Must have `requester_service`, `payload`, and `response`
3. ✅ **Competencies**: Should be a hierarchical structure (competence → nested_competencies → skills)
4. ✅ **Skills**: Should have `name` and `verified` fields
5. ✅ **Relevance Score**: Should be a number (0-100)
6. ✅ **User ID**: Should be filled (not 0)

### Simplified Test (Minimal Data)

If you want to test with minimal data first:

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
        "repositories": [
          {
            "name": "test-repo",
            "language": "JavaScript",
            "description": "Test repository"
          }
        ]
      },
      "linkedin": {
        "firstName": { "localized": { "en_US": "John" } },
        "lastName": { "localized": { "en_US": "Doe" } },
        "headline": "Software Engineer",
        "summary": "Experienced developer"
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

### Troubleshooting

**If you get 404:**
- Check the URL is correct: `https://skillsengine-production.up.railway.app/api/fill-content-metrics`
- Make sure you're using POST method

**If you get 400 Bad Request:**
- Verify all three envelope fields are present: `requester_service`, `payload`, `response`
- Check that `raw_data` contains both `github` and `linkedin` objects

**If you get 500 Internal Server Error:**
- Skills Engine might be down or processing error
- Check the response body for error details
- Try with simplified/minimal data first

**If response fields are empty:**
- Skills Engine might not be processing the data correctly
- Check if the raw_data structure matches what Skills Engine expects
- Verify the response template structure

### Next Steps After Testing

1. ✅ Verify Skills Engine returns normalized competencies
2. ✅ Check the hierarchy structure (competence → nested → skills)
3. ✅ Verify skills have `verified` status
4. ✅ Check relevance_score is calculated
5. ✅ Test with different employee types (trainer, regular_employee, etc.)

