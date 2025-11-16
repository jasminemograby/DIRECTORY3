# Implementation Template

**Purpose:** This template guides the implementation of an approved feature, following TDD practices and architecture decisions.

**Expected Outputs:**
- Implemented feature code (frontend, backend, database)
- Test files (unit, integration)
- Implementation documentation
- Updated feature logs

---

## Pre-Implementation Scan

Before implementation, I will:
1. Read the feature design document from `docs/feature-docs/FXXX/feature-design.md`
2. Check `features-map.json` for file list
3. Verify test skeletons exist (TDD-first)
4. Review architecture and database design decisions

---

## Step 1: Feature Identification

**Question 1:** What is the Feature ID to implement? (e.g., F004, F005)

**Your Answer:** [FXXX]

---

**Question 2:** Has the feature design been approved? (Yes/No)

**Your Answer:** [Yes/No]

**If No:** Please complete Feature-Design-Template.md first.

**If Yes:** Proceeding to implementation.

---

## Step 2: Implementation Approach

**Question 3:** What is the implementation priority? (High/Medium/Low)

**Your Answer:** [Priority]

---

**Question 4:** Are there any implementation constraints or special requirements? (Yes/No)

**Your Answer:** [Yes/No]

**Instructions for AI:** If the user answers "Yes" to Question 4, dynamically generate follow-up questions about what the constraints are (performance, security, compatibility, etc.) and how they should be addressed. Generate these questions on the fly based on the specific constraints mentioned.

---

## Step 3: Code Structure Decisions

**Question 5:** Will this feature require new shared utilities or components? (Yes/No)

**Your Answer:** [Yes/No]

**Instructions for AI:** If the user answers "Yes" to Question 5, dynamically generate follow-up questions about what utilities/components are needed, whether they should be in `/core` or `/shared`, whether other features will use these utilities, and if yes, which features. Generate these questions on the fly based on the specific utilities/components mentioned.

---

## Step 4: External Dependencies

**Question 6:** Are there new npm packages needed? (Yes/No)

**Your Answer:** [Yes/No]

**Instructions for AI:** If the user answers "Yes" to Question 6, dynamically generate follow-up questions. First, ask which packages (with versions if known). Then, for each package mentioned, generate questions about the purpose of that package, whether there are security concerns, and if yes or unknown, whether security should be reviewed before adding. Generate these questions on the fly based on the specific packages mentioned.

---

## Step 5: Testing Strategy

**Question 7:** Are test skeletons already created? (Yes/No)

**Your Answer:** [Yes/No]

**If No:**
- **Question 7a:** Should I create test skeletons now? (Yes/No)
- **Your Answer:** [Yes/No]

**Question 8:** What test coverage is expected? (High >80%, Medium 50-80%, Low <50%)

**Your Answer:** [Coverage level]

**Instructions for AI:** Based on the user's answer to Question 8, dynamically generate follow-up questions about which parts need highest coverage (critical paths, user-facing features, data operations), whether there are edge cases that must be tested, and if yes, what those edge cases are. Generate these questions on the fly based on the coverage level and priorities mentioned.

---

## Step 6: Error Handling

**Question 9:** What error scenarios need handling? (List key scenarios)

**Your Answer:** [Error scenarios]

**Instructions for AI:** Based on the user's answer to Question 9, dynamically generate follow-up questions for each error scenario mentioned. For each scenario, generate questions about how it should be handled (show error message, retry, fallback, log) and what user-facing message should be shown (if applicable). Generate these questions on the fly based on the specific error scenarios mentioned.

---

## Step 7: Performance Considerations

**Question 10:** Are there performance requirements? (Yes/No)

**Your Answer:** [Yes/No]

**Instructions for AI:** If the user answers "Yes" to Question 10, dynamically generate follow-up questions about what the performance targets are (response time, throughput, etc.), what optimization strategies are needed (caching, pagination, lazy loading, etc.), and for each strategy mentioned, how it should be implemented. Generate these questions on the fly based on the specific performance requirements and strategies mentioned.

---

## Generation Phase

Based on your answers and the feature design, I will now:

1. **Implement Frontend Components** - Create React components/pages
2. **Implement Backend Services** - Create controllers, services, routes
3. **Implement Database Changes** - Create migrations if needed
4. **Write Tests** - Unit and integration tests (TDD)
5. **Update Documentation** - Implementation notes
6. **Update Logs** - Feature log, change log

**Files to be created/updated:**
- [List all files with diffs]

---

## Important: Complete Information Collection

**Instructions for AI:** Before proceeding to implementation, you must ensure ALL required information has been collected. Continue asking dynamic follow-up questions based on the user's answers until you have:

**CRITICAL:** If the user mentions something not yet asked but related to implementation (constraints, shared utilities, npm packages, testing strategy, error handling, performance requirements, etc.), dynamically generate follow-up questions until all related information is captured. Do not guess or assume - continue asking until all implementation requirements are fully specified.

- Complete feature identification and design approval
- All implementation constraints and requirements specified (if applicable)
- All shared utilities/components requirements specified (if applicable)
- All npm package requirements specified (if applicable)
- Complete testing strategy with all scenarios
- All error handling scenarios specified
- All performance requirements specified (if applicable)

**Do NOT proceed to implementation until:**
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

**If Yes:** I will verify that no assumptions are needed and proceed to implementation.

---

## Verification Before Implementation

**Before implementing, verify:**
- ✅ Feature design is approved
- ✅ All constraints are specified (if applicable)
- ✅ All dependencies are identified
- ✅ Testing strategy is complete
- ✅ All error scenarios are handled
- ✅ Performance requirements are specified (if applicable)
- ✅ No information is missing or assumed

**If any item above is not verified, continue asking questions.**

---

## Implementation

**Only proceed if all information above is verified.**

I will proceed to implement the feature code, following TDD practices.

---

## Post-Implementation

After implementation:
- ✅ Run unit tests
- ✅ Run integration tests
- ✅ Update feature documentation
- ✅ Update logs
- ✅ Code review (if applicable)

---

## Implementation Summary

### What Was Built
[Brief summary of what was implemented]

### Key Components
- **Frontend:** [List of components/pages]
- **Backend:** [List of services/controllers/routes]
- **Database:** [Schema changes, migrations]

---

## Code Structure

### Frontend
```
[File structure]
- Component1.js - [Purpose]
- Component2.js - [Purpose]
```

### Backend
```
[File structure]
- service.js - [Purpose]
- controller.js - [Purpose]
- route.js - [Purpose]
```

### Database
```
[Migrations/Schema]
- migration.sql - [Changes]
```

---

## Implementation Details

### Key Functions/Methods
- **Function 1:** [Purpose and implementation approach]
- **Function 2:** [Purpose and implementation approach]

### Algorithms/Logic
[Any complex logic or algorithms implemented]

### Error Handling
[How errors are handled]

### Performance Considerations
[Performance optimizations, if any]

---

## Testing

### Unit Tests
- ✅ [Test 1] - [Result]
- ✅ [Test 2] - [Result]

### Integration Tests
- ✅ [Test 1] - [Result]
- ✅ [Test 2] - [Result]

### Manual Testing
- ✅ [Test scenario 1]
- ✅ [Test scenario 2]

---

## Dependencies

### New Packages
- `package-name` - [Version] - [Purpose]

### External Services
- [Service name] - [Purpose]

---

## Known Issues
[Any known issues or limitations]

---

## Future Improvements
[Potential improvements or enhancements]

---

## Deployment Notes
[Any special deployment considerations]

---

## Status
- **Implementation:** ✅ Complete
- **Testing:** ✅ Complete
- **Documentation:** ✅ Complete
- **Ready for Production:** ✅ Yes

