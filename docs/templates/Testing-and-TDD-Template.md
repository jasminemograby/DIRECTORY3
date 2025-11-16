# Testing and TDD Template

**Purpose:** This template guides the creation and execution of unit, integration, and regression tests following TDD practices.

**Expected Outputs:**
- Test files (unit, integration, E2E)
- Test execution results
- Coverage reports
- Test documentation

---

## Step 1: Testing Scope

**Question 1:** What should be tested? (Select one)
- Specific feature (provide Feature ID)
- Specific file(s) (provide file paths)
- All features
- Test suite (regression)
- Other: [Specify]

**Your Answer:** [Scope]

**Dynamic Follow-ups:**
- **If Specific feature:**
  - **Question 1a:** What is the Feature ID?
  - **Your Answer:** [FXXX]
  - **Question 1b:** Should I test all files in features-map.json for this feature? (Yes/No)
  - **Your Answer:** [Yes/No]

- **If Specific file(s):**
  - **Question 1c:** What are the file paths? (List)
  - **Your Answer:** [File paths]

---

## Step 2: Test Types

**Question 2:** What types of tests should be created/run? (Select all that apply)
- Unit tests
- Integration tests
- End-to-end (E2E) tests
- Regression tests
- Performance tests
- Security tests
- All of the above
- Other: [Specify]

**Your Answer:** [Test types]

**Dynamic Follow-ups:**
- **If Unit tests:**
  - **Question 2a:** What testing framework? (Jest, Mocha, Vitest, Other)
  - **Your Answer:** [Framework]
  - **Question 2b:** What should be tested? (Functions, components, utilities, etc.)
  - **Your Answer:** [Test targets]
  - **Question 2c:** What is the expected coverage? (Percentage)
  - **Your Answer:** [Coverage %]

- **If Integration tests:**
  - **Question 2d:** What integrations should be tested? (API endpoints, database, external services)
  - **Your Answer:** [Integrations]
  - **Question 2e:** Should external services be mocked? (Yes/No)
  - **Your Answer:** [Yes/No]
  - **If Yes:**
    - **Question 2e-1:** Which services? (List)
    - **Your Answer:** [Services]

- **If E2E tests:**
  - **Question 2f:** What E2E framework? (Cypress, Playwright, Selenium, Other)
  - **Your Answer:** [Framework]
  - **Question 2g:** What user flows should be tested? (List)
  - **Your Answer:** [User flows]

- **If Performance tests:**
  - **Question 2h:** What performance metrics? (Response time, throughput, load capacity)
  - **Your Answer:** [Metrics]
  - **Question 2i:** What are the performance targets? (e.g., <2s response time)
  - **Your Answer:** [Targets]

---

## Step 3: TDD Approach

**Question 3:** Are test skeletons already created? (Yes/No)

**Your Answer:** [Yes/No]

**If No:**
- **Question 3a:** Should I create test skeletons first? (Yes/No - TDD approach)
- **Your Answer:** [Yes/No]

**Question 4:** What is the TDD workflow? (Select approach)
- Red-Green-Refactor (write failing test, make it pass, refactor)
- Test-first (write tests before implementation)
- Test-after (write tests after implementation)
- Hybrid (some test-first, some test-after)

**Your Answer:** [Approach]

**Dynamic Follow-ups:**
- **If Red-Green-Refactor:**
  - **Question 4a:** Should I create failing tests first? (Yes/No)
  - **Your Answer:** [Yes/No]

---

## Step 4: Test Scenarios

**Question 5:** What are the key test scenarios? (List 5-10 scenarios)

**Your Answer:**
1. [Scenario 1]
2. [Scenario 2]
3. [Scenario 3]

**Instructions for AI:** Based on the user's answer to Question 5, dynamically generate follow-up questions for each test scenario mentioned. For each scenario, ask about: test case in Given-When-Then format, expected result, edge cases (and if yes, what edge cases), and any scenario-specific requirements. **Important:** If the user mentions something not yet asked but related to testing (e.g., specific test cases, edge cases, integration points, performance tests), dynamically generate follow-up questions until all related information is captured.

---

## Step 5: Mock Data & Fixtures

**Question 6:** Are mock data or test fixtures needed? (Yes/No)

**Your Answer:** [Yes/No]

**Instructions for AI:** If the user answers "Yes" to Question 6, dynamically generate follow-up questions. First, ask what types of mock data (API responses, database records, file contents, etc.). Then, for each type mentioned, ask about: where mock data should be stored (__mocks__/, fixtures/, test-data/), what the mock data structure should include, and any type-specific requirements. **Important:** If the user mentions something not yet asked but related to mock data (e.g., specific mock scenarios, data variations, mock service configurations), dynamically generate follow-up questions until all related information is captured.

---

## Step 6: Test Environment

**Question 7:** What test environment setup is needed? (Select all that apply)
- Test database
- Mock external services
- Test API server
- Test data seeding
- Environment variables
- Other: [Specify]

**Your Answer:** [Setup needs]

**Dynamic Follow-ups:**
- **If Test database:**
  - **Question 7a:** Should I use an in-memory database or separate test DB? (In-memory/Separate DB)
  - **Your Answer:** [Approach]
  - **Question 7b:** Should test data be seeded? (Yes/No)
  - **Your Answer:** [Yes/No]

- **If Mock external services:**
  - **Question 7c:** Which services need mocking? (List)
  - **Your Answer:** [Services]
  - **For each service:**
    - **Question 7d-[Service]:** What mock responses are needed for [Service]?
    - **Your Answer:** [Mock responses]

---

## Step 7: Test Execution

**Question 8:** When should tests run? (Select all that apply)
- Before commit (pre-commit hook)
- On PR (CI/CD)
- Before deployment
- Manually
- All of the above
- Other: [Specify]

**Your Answer:** [Execution triggers]

**Dynamic Follow-ups:**
- **If Before commit:**
  - **Question 8a:** Should I set up pre-commit hooks? (Yes/No)
  - **Your Answer:** [Yes/No]

- **If On PR:**
  - **Question 8b:** Should tests block PR merge if they fail? (Yes/No)
  - **Your Answer:** [Yes/No]

---

## Important: Complete Information Collection

**Instructions for AI:** Before proceeding to test creation and execution, you must ensure ALL required information has been collected. Continue asking dynamic follow-up questions based on the user's answers until you have:

**CRITICAL:** If the user mentions something not yet asked but related to testing (test scenarios, mock data, test environment, test frameworks, coverage requirements, etc.), dynamically generate follow-up questions until all related information is captured. Do not guess or assume - continue asking until all testing requirements are fully specified.

- Complete testing scope identified
- All test types specified with frameworks
- Complete TDD approach defined
- All test scenarios fully specified
- All mock data and fixtures requirements specified (if applicable)
- Complete test environment setup requirements
- All test execution triggers specified

**Do NOT proceed to test creation until:**
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

**If Yes:** I will verify that no assumptions are needed and proceed to test creation.

---

## Verification Before Test Creation

**Before creating tests, verify:**
- ✅ Testing scope is defined
- ✅ All test types are specified
- ✅ TDD approach is defined
- ✅ All test scenarios are specified
- ✅ Mock data requirements are defined (if applicable)
- ✅ Test environment is specified
- ✅ No information is missing or assumed

**If any item above is not verified, continue asking questions.**

---

## Generation Phase

**Only proceed if all information above is verified.**

Based on your complete answers, I will now:

1. **Create Test Files** - Unit, integration, E2E tests
2. **Create Test Utilities** - Mocks, fixtures, helpers
3. **Set Up Test Environment** - Configuration, setup files
4. **Run Tests** - Execute test suite
5. **Generate Coverage Report** - Code coverage analysis

**Files to be created:**
- [List test files to be created]
- `docs/feature-docs/FXXX/testing.md` (if feature-specific)

---

## Test Execution Results

### Unit Tests
- Total: [Count]
- Passed: [Count]
- Failed: [Count]
- Coverage: [Percentage]

### Integration Tests
- Total: [Count]
- Passed: [Count]
- Failed: [Count]

### E2E Tests
- Total: [Count]
- Passed: [Count]
- Failed: [Count]

### Failed Tests
[List failed tests with reasons]

---

## Final Checklist

**Have you made all decisions and is this step fully planned?** (Yes/No)

**Your Answer:** [Yes/No]

**If No:** Please specify what needs clarification.

**If Yes:** I will proceed to create and run tests.

---

## Post-Testing

After tests are created and run:
- ✅ Test files created
- ✅ Tests executed
- ✅ Coverage report generated
- ✅ Failed tests documented
- ✅ Ready for code review or deployment

---

## Next Steps

After tests pass:
- **Code-Review-Template.md** - Code review
- **Deployment-Template.md** - Deploy to production

