# Implementation Questions - External APIs & Microservices

This document lists questions that need clarification before implementing integrations with external APIs and microservices.

**Last Updated**: Before implementation phase

---

## 🔴 Critical Questions (Blocking Implementation)

### 1. Authentication & Authorization

**Question**: How does authentication work for inter-service communication?

**Details Needed**:
- When Skills Engine calls Directory's `/api/fill-content-metrics`, how does it authenticate?
- Do we need API keys/tokens for inter-service communication?
- What's the security model for microservice-to-microservice calls?
- Do we need to send authentication headers in requests to other microservices?
- Is there a shared secret, JWT tokens, or API keys?

**Impact**: Cannot implement universal endpoint without knowing authentication requirements

---

### 2. Gemini AI Integration

**Question**: What are the implementation details for Gemini AI integration?

**Details Needed**:
- What's the API endpoint for Gemini AI?
- Is Gemini AI a separate microservice or a direct API call (Google Gemini API)?
- What's the request/response format?
- Do we have API keys/credentials?
- What's the rate limiting?
- How do we handle errors/timeouts?

**Impact**: Cannot implement employee profile enrichment without Gemini AI details

---

### 3. LinkedIn & GitHub OAuth

**Question**: What are the OAuth implementation details?

**Details Needed**:
- Do we have LinkedIn OAuth app credentials (Client ID, Client Secret)?
- Do we have GitHub OAuth app credentials (Client ID, Client Secret)?
- What OAuth scopes/permissions do we need?
- Where do we store OAuth tokens? (Database? Encrypted?)
- How do we handle token refresh?
- What's the OAuth callback URL structure?
- How long are tokens valid?

**Impact**: Cannot implement employee profile enrichment without OAuth credentials

---

### 4. HR Employee Identification

**Question**: How exactly do we identify HR employees?

**Details Needed**:
- Is it by email match with `companies.hr_contact_email`?
- Is there a specific role type (e.g., "HR_MANAGER")?
- Can there be multiple HR employees per company?
- Is the employee who registered the company automatically HR?
- Do we need a separate `is_hr` flag in employees table?

**Impact**: Cannot implement routing/access control without knowing HR identification method

---

### 5. Employee Login/Authentication

**Question**: How does employee login work?

**Details Needed**:
- Is there a separate Auth Service microservice?
- How do employees authenticate? (Email/password? OAuth? SSO?)
- What's the session/token management?
- How do we get employee ID from authentication token?
- Do we need to integrate with an external auth service?

**Impact**: Cannot implement employee profile pages or enrichment flow without authentication

---

## 🟡 Important Questions (Should Clarify)

### 6. Error Handling & Retry Logic

**Question**: What's the error handling strategy for external calls?

**Details Needed**:
- What happens if a microservice is down?
- How do we handle partial failures?
- Do we implement retry logic? (How many retries? Exponential backoff?)
- What's the timeout for external API calls?
- How do we log errors for monitoring?

**Impact**: Affects reliability and user experience

---

### 7. Mock Data Structure

**Question**: What's the exact structure of mock data?

**Details Needed**:
- Is `/mockData/index.json` already structured correctly?
- Do we need to add more mock data for new integrations?
- What's the format for each microservice's mock responses?
- Should mock data match real API response format exactly?

**Impact**: Fallback mechanism needs correct mock data structure

---

### 8. AI Query Generation

**Question**: How exactly does AI query generation work?

**Details Needed**:
- What AI service/model do we use? (OpenAI? Gemini? Custom?)
- What's the prompt structure?
- How do we ensure SQL security (prevent SQL injection)?
- Do we validate generated SQL before execution?
- What's the fallback if AI query generation fails?

**Impact**: Universal endpoint depends on AI query generation

---

### 9. Schema Matching Logic

**Question**: How does schema matching work?

**Details Needed**:
- Is schema matching done by AI or hardcoded rules?
- What's the mapping logic? (e.g., `user_id` → `employee_id`)
- Do we have a mapping configuration file?
- How do we handle new field mappings?

**Impact**: Universal endpoint needs correct schema matching

---

### 10. Daily Jobs Implementation

**Question**: How should we implement the endpoints for daily jobs?

**Details Needed**:
- For Learning Analytics and Management & Reporting, do we just create endpoints that respond when called?
- Do we need to implement any polling mechanism?
- Should endpoints be ready to respond immediately or can they be async?
- What's the expected response time?

**Impact**: Affects implementation approach for daily sync endpoints

---

## 🟢 Nice to Have (Can Implement Later)

### 11. Monitoring & Logging

**Question**: What monitoring/logging do we need?

**Details Needed**:
- Do we need to log all microservice calls?
- What metrics should we track?
- Do we need error alerting?
- What logging service do we use?

**Impact**: Important for production but not blocking

---

### 12. Rate Limiting

**Question**: Do we need rate limiting?

**Details Needed**:
- Are there rate limits on external APIs?
- Do we need to implement rate limiting on our endpoints?
- What's the rate limit strategy?

**Impact**: Important for production but not blocking

---

## Summary

### Must Answer Before Implementation:
1. ✅ Authentication for inter-service communication
2. ✅ Gemini AI integration details
3. ✅ LinkedIn/GitHub OAuth credentials
4. ✅ HR employee identification method
5. ✅ Employee login/authentication flow

### Should Answer Soon:
6. Error handling strategy
7. Mock data structure
8. AI query generation details
9. Schema matching logic
10. Daily jobs implementation approach

### Can Answer Later:
11. Monitoring/logging
12. Rate limiting

---

## Next Steps

Please provide answers to the **Critical Questions** (1-5) so we can proceed with implementation. The other questions can be answered during implementation or later.

