# Cybersecurity Validation Template

**Purpose:** This template runs security scans, validates inputs, prevents injection, checks secrets and AI prompt safety.

**Expected Outputs:**
- Security assessment report
- Vulnerability scan results
- Security recommendations
- Compliance checklist
- Updated security_checks.md

---

## Step 1: Feature Identification

**Question 1:** What is the Feature ID to validate? (e.g., F004, F005, or "All" for full system)

**Your Answer:** [FXXX or "All"]

---

**Question 2:** What is the feature title? (or "Full System" if validating all)

**Your Answer:** [Title]

---

## Step 2: Threat Assessment

**Question 3:** What types of data does this feature handle? (Select all that apply)
- User input (forms, text)
- File uploads
- API responses
- Database queries
- Authentication tokens
- PII (Personally Identifiable Information)
- Financial data
- Health data
- Other sensitive data: [Specify]

**Your Answer:** [Data types]

**Instructions for AI:** Based on the user's answer to Question 3, dynamically generate follow-up questions for each data type mentioned. For User input: ask about input validation (client-side, server-side, both), input length limits, and validation rules. For File uploads: ask about allowed file types, maximum file size, file content scanning, and upload security. For PII: ask about what PII is collected, encryption at rest, encryption in transit (HTTPS), and PII handling requirements. For Financial/Health data: ask about data protection requirements, compliance needs, and security measures. For Authentication tokens: ask about token storage, expiration, and security. For API responses/Database queries: ask about data handling and security. If "Other sensitive data" is mentioned, ask about the data type, sensitivity level, and protection requirements. Generate these questions on the fly based on the specific data types mentioned.

---

## Step 3: Injection Prevention

**Question 4:** What injection risks exist? (Select all that apply)
- SQL injection
- XSS (Cross-Site Scripting)
- Command injection
- LDAP injection
- XML injection
- No injection risks
- Other: [Specify]

**Your Answer:** [Risks]

**Instructions for AI:** Based on the user's answer to Question 4, dynamically generate follow-up questions for each injection risk mentioned. For SQL injection: ask about parameterized queries usage, dynamic SQL generation, and how dynamic SQL is secured (schema validation, input sanitization). For XSS: ask about input escaping before rendering, whether React's built-in escaping is sufficient, use of dangerouslySetInnerHTML, and content sanitization methods. For Command/LDAP/XML injection: ask about prevention methods, input validation, and security measures. If "Other" is mentioned, ask about the injection type, risks, and prevention methods. If "No injection risks" is selected, verify this is accurate by asking about data handling methods. Generate these questions on the fly based on the specific risks mentioned.

---

## Step 4: Authentication & Authorization

**Question 5:** What authentication is used? (Select all that apply)
- JWT tokens
- Session-based
- OAuth
- API keys
- Basic auth
- None (public)
- Other: [Specify]

**Your Answer:** [Auth methods]

**Instructions for AI:** Based on the user's answer to Question 5, dynamically generate follow-up questions for each authentication method mentioned. For JWT tokens: ask about token storage location (LocalStorage, Cookies, Memory), XSS risks awareness (if LocalStorage), token expiration, and token refresh implementation. For Session-based: ask about session storage, expiration, and session management. For OAuth: ask about which providers, token storage security, and token refresh handling. For API keys: ask about key generation, storage, rotation, and usage. For Basic auth: ask about usage context and security measures. If "Other" is mentioned, ask about the authentication method, implementation, and security. If "None (public)" is selected, verify this is intentional and ask about public access security. Generate these questions on the fly based on the specific authentication methods mentioned.

---

**Question 6:** What authorization model is used? (Select all that apply)
- Role-Based Access Control (RBAC)
- Attribute-Based Access Control (ABAC)
- Permission-based
- Company/user isolation
- None (all users equal)
- Other: [Specify]

**Your Answer:** [Authorization]

**Instructions for AI:** Based on the user's answer to Question 6, dynamically generate follow-up questions for each authorization model mentioned. For RBAC: ask about what roles exist, whether role checks are performed on backend (and if not, why), and role implementation details. For ABAC: ask about attributes used, policy implementation, and ABAC-specific requirements. For Permission-based: ask about permission structure, permission checks, and implementation. For Company/user isolation: ask about how data isolation is enforced (database queries, middleware, application logic), whether isolation is tested, and isolation requirements. If "Other" is mentioned, ask about the authorization model, implementation, and requirements. If "None (all users equal)" is selected, verify this is intentional. Generate these questions on the fly based on the specific authorization models mentioned.

---

## Step 5: Secrets & Configuration

**Question 7:** What secrets are used? (Select all that apply)
- API keys
- Database passwords
- OAuth client secrets
- JWT secrets
- Encryption keys
- Other: [Specify]

**Your Answer:** [Secrets]

**Instructions for AI:** Based on the user's answer to Question 7, dynamically generate follow-up questions for each secret type mentioned. For each secret type, ask about: where secrets are stored (environment variables, config files, database, hardcoded), and if hardcoded, warn about security risk and ask if help is needed to migrate to environment variables. Ask whether secrets are in version control, and if yes, warn about security risk and ask if help is needed to remove them. Ask about secret rotation strategy, access control, and secret management. If "Other" is mentioned, ask about the secret type, purpose, and storage/management requirements. Generate these questions on the fly based on the specific secret types mentioned.

---

## Step 6: AI/LLM Security

**Question 8:** Does this feature use AI/LLM? (Yes/No)

**Your Answer:** [Yes/No]

**Instructions for AI:** If the user answers "Yes" to Question 8, dynamically generate follow-up questions about: which AI service (Gemini, OpenAI, Claude, Other), prompt structure (system prompt, user prompt, etc.), prompt injection prevention implementation, and if not implemented, what injection techniques should be prevented. Ask about user input sanitization before sending to AI, AI output validation, rate limits on AI calls (and if yes, what the limits are), and AI usage logging/monitoring. If "Other" AI service is mentioned, ask about the service name, API, and security considerations. Generate these questions on the fly based on the specific AI service and requirements mentioned.

---

## Step 7: Compliance

**Question 9:** What compliance requirements apply? (Select all that apply)
- GDPR
- HIPAA
- PCI-DSS
- SOC 2
- CCPA
- None
- Other: [Specify]

**Your Answer:** [Compliance]

**Instructions for AI:** Based on the user's answer to Question 9, dynamically generate follow-up questions for each compliance requirement mentioned. For GDPR: ask about user consent collection, right to deletion implementation, data portability support, and GDPR-specific requirements. For HIPAA: ask about PHI encryption, access logs, and HIPAA-specific requirements. For PCI-DSS: ask about payment data handling, encryption, and PCI-DSS-specific requirements. For SOC 2: ask about security controls, monitoring, and SOC 2-specific requirements. For CCPA: ask about data rights, disclosure requirements, and CCPA-specific requirements. If "Other" is mentioned, ask about the compliance requirement, applicable regulations, and implementation needs. Generate these questions on the fly based on the specific compliance requirements mentioned.

---

## Step 8: Security Scanning

**Question 10:** What security scans should be run? (Select all that apply)
- Dependency vulnerability scan (npm audit)
- Static code analysis
- Secrets detection scan
- SQL injection scan
- XSS scan
- All of the above
- Other: [Specify]

**Your Answer:** [Scans]

**Instructions for AI:** Based on the user's answer to Question 10, dynamically generate follow-up questions for each scan type mentioned. For Dependency vulnerability scan: ask whether to run npm audit, what severity level to report (Low, Medium, High, Critical, All), and scan configuration. For Static code analysis: ask about analysis tools, what to analyze, and analysis configuration. For Secrets detection scan: ask about scan tools, what to scan, and scan configuration. For SQL injection/XSS scans: ask about scan tools, scan scope, and scan configuration. If "Other" is mentioned, ask about the scan type, purpose, and configuration. Generate these questions on the fly based on the specific scans mentioned.

---

## Important: Complete Information Collection

**Instructions for AI:** Before proceeding to the Generation Phase, you must ensure ALL required information has been collected. Continue asking dynamic follow-up questions based on the user's answers until you have:

- Complete threat assessment with all data types identified
- All injection risks identified and prevention methods specified
- Complete authentication and authorization details
- All secrets and configuration management specified
- Complete AI/LLM security details (if applicable)
- All compliance requirements specified (if applicable)
- All security scan requirements specified

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
- ✅ Threat assessment is complete
- ✅ All injection risks are identified
- ✅ Authentication/authorization is specified
- ✅ Secrets management is defined
- ✅ AI/LLM security is complete (if applicable)
- ✅ Compliance requirements are specified (if applicable)
- ✅ Security scan requirements are defined
- ✅ No information is missing or assumed

**If any item above is not verified, continue asking questions.**

---

## Generation Phase

**Only proceed if all information above is verified.**

Based on your complete answers, I will now:

1. **Run Security Scans** - Execute selected security scans
2. **Generate Security Report** - Document findings and recommendations
3. **Create Remediation Plan** - Steps to fix identified issues
4. **Update Security Logs** - Record in security_checks.md

**Files to be created/updated:**
- `docs/security_checks.md`
- `docs/feature-docs/FXXX/security-validation.md` (if feature-specific)

---

## Security Assessment Summary

---

## Security Controls

### Authentication
- **Method:** [Authentication method used]
- **Token Management:** [How tokens are handled]
- **Session Management:** [Session handling]

### Authorization
- **RBAC:** [Role-based access control]
- **Permissions:** [Permission checks]
- **Data Isolation:** [Company/user data isolation]

### Input Validation
- **Client-Side:** [Frontend validation]
- **Server-Side:** [Backend validation]
- **SQL Injection Prevention:** [How SQL injection is prevented]
- **XSS Prevention:** [How XSS is prevented]

### Data Protection
- **Encryption:** [Data encryption approach]
- **PII Handling:** [PII protection]
- **Data Transmission:** [HTTPS, secure channels]

---

## Security Testing

### Vulnerability Scans
- ✅ [Scan type] - [Result]
- ✅ [Scan type] - [Result]

### Penetration Testing
- ✅ [Test scenario] - [Result]

### Code Review
- ✅ Security review completed
- **Issues Found:** [List]
- **Issues Resolved:** [List]

---

## Compliance

### GDPR Compliance
- **Data Collection:** [What data is collected]
- **Consent:** [How consent is obtained]
- **Right to Deletion:** [How deletion is handled]

### Other Regulations
[Other compliance requirements]

---

## Security Risks

### Identified Risks
| Risk | Severity | Mitigation | Status |
|------|----------|------------|--------|
| [Risk 1] | [High/Medium/Low] | [Mitigation] | [Resolved/Pending] |

---

## Recommendations

### Immediate Actions
[Actions to take immediately]

### Future Improvements
[Security improvements for future]

---

## Approval
- **Security Review:** ✅ Passed
- **Approved for Production:** ✅ Yes
- **Reviewer:** [Name]
- **Date:** [Date]

---

## Status
- **Assessment:** ✅ Complete
- **Testing:** ✅ Complete
- **Approval:** ✅ Granted

