# Code Review Template

**Purpose:** This template runs AI-assisted code review, linters, static analysis, dependency checks, and produces a checklist for the developer.

**Expected Outputs:**
- Code review report
- Linter results
- Static analysis findings
- Dependency vulnerability report
- Developer checklist

---

## Step 1: Review Scope

**Question 1:** What should be reviewed? (Select one)
- Specific feature (provide Feature ID)
- Specific file(s) (provide file paths)
- All code changes in current branch
- Full codebase
- Other: [Specify]

**Your Answer:** [Scope]

**Dynamic Follow-ups:**
- **If Specific feature:**
  - **Question 1a:** What is the Feature ID?
  - **Your Answer:** [FXXX]
  - **Question 1b:** Should I review all files in features-map.json for this feature? (Yes/No)
  - **Your Answer:** [Yes/No]

- **If Specific file(s):**
  - **Question 1c:** What are the file paths? (List)
  - **Your Answer:** [File paths]

- **If All code changes:**
  - **Question 1d:** What is the base branch? (main, develop, etc.)
  - **Your Answer:** [Base branch]

---

## Step 2: Review Types

**Question 2:** What types of review should be performed? (Select all that apply)
- Linting (ESLint, style checks)
- Static code analysis
- Dependency vulnerability scan
- Security review
- Performance review
- Code quality review
- Best practices check
- All of the above
- Other: [Specify]

**Your Answer:** [Review types]

**Dynamic Follow-ups:**
- **If Linting:**
  - **Question 2a:** Which linters? (ESLint, Prettier, Stylelint, Other)
  - **Your Answer:** [Linters]
  - **Question 2b:** What severity level to report? (Errors only, Warnings and errors, All)
  - **Your Answer:** [Severity]

- **If Static code analysis:**
  - **Question 2c:** What should be analyzed? (Code complexity, unused code, potential bugs, etc.)
  - **Your Answer:** [Analysis focus]

- **If Dependency vulnerability scan:**
  - **Question 2d:** Which package managers? (npm, yarn, pnpm)
  - **Your Answer:** [Package managers]
  - **Question 2e:** What severity to report? (Critical, High, Medium, Low, All)
  - **Your Answer:** [Severity]

- **If Security review:**
  - **Question 2f:** What security aspects? (Injection risks, secrets, authentication, authorization, etc.)
  - **Your Answer:** [Security aspects]

- **If Performance review:**
  - **Question 2g:** What performance aspects? (Query optimization, API response times, bundle size, etc.)
  - **Your Answer:** [Performance aspects]

---

## Step 3: Code Quality Checks

**Question 3:** What code quality standards should be checked? (Select all that apply)
- Code style consistency
- Naming conventions
- Function complexity
- Code duplication
- Documentation coverage
- Error handling
- Test coverage
- All of the above
- Other: [Specify]

**Your Answer:** [Quality checks]

**Dynamic Follow-ups:**
- **If Function complexity:**
  - **Question 3a:** What is the maximum cyclomatic complexity allowed? (Default: 10)
  - **Your Answer:** [Complexity limit]

- **If Code duplication:**
  - **Question 3b:** What is the minimum lines threshold for duplication? (Default: 5)
  - **Your Answer:** [Threshold]

- **If Documentation coverage:**
  - **Question 3c:** What documentation is required? (JSDoc comments, README, inline comments)
  - **Your Answer:** [Documentation types]

- **If Test coverage:**
  - **Question 3d:** What is the minimum coverage percentage? (Default: 80%)
  - **Your Answer:** [Coverage %]

---

## Step 4: Specific Concerns

**Question 4:** Are there specific concerns to check? (Yes/No)

**Your Answer:** [Yes/No]

**Instructions for AI:** If the user answers "Yes" to Question 4, dynamically generate follow-up questions. First, ask what concerns. Then, for each concern mentioned, ask about how the concern should be checked, what specific checks are needed, and any concern-specific requirements. **Important:** If the user mentions something not yet asked but related to code review (e.g., specific code patterns, security concerns, performance issues, architectural decisions), dynamically generate follow-up questions until all related information is captured.

---

## Step 5: Review Execution

I will now:

1. **Run Linters** - Execute selected linters
2. **Run Static Analysis** - Perform code analysis
3. **Scan Dependencies** - Check for vulnerabilities
4. **Review Code Quality** - Check standards
5. **Generate Report** - Compile findings

---

## Generation Phase

Based on the review, I will generate:

1. **Code Review Report** - Complete findings
2. **Developer Checklist** - Action items
3. **Priority Classification** - Critical, High, Medium, Low
4. **Fix Suggestions** - Recommended solutions

**Files to be created/updated:**
- `docs/code_review_[timestamp].md`
- `docs/feature-docs/FXXX/code-review.md` (if feature-specific)

---

## Review Results

### Critical Issues
[List critical issues that must be fixed]

### High Priority Issues
[List high priority issues]

### Medium Priority Issues
[List medium priority issues]

### Low Priority Issues
[List low priority issues]

### Recommendations
[List improvement recommendations]

---

## Developer Checklist

**Must Fix Before Merge:**
- [ ] [Critical issue 1]
- [ ] [Critical issue 2]

**Should Fix:**
- [ ] [High priority issue 1]
- [ ] [High priority issue 2]

**Consider Fixing:**
- [ ] [Medium priority issue 1]

---

## Important: Complete Information Collection

**Instructions for AI:** Before proceeding to review execution, you must ensure ALL required information has been collected. Continue asking dynamic follow-up questions based on the user's answers until you have:

**CRITICAL:** If the user mentions something not yet asked but related to code review (review scope, code quality standards, specific concerns, security checks, performance checks, etc.), dynamically generate follow-up questions until all related information is captured. Do not guess or assume - continue asking until all review requirements are fully specified.

- Complete review scope identified
- All review types specified
- All code quality standards specified
- All specific concerns identified (if applicable)

**Do NOT proceed to review execution until:**
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

**If Yes:** I will verify that no assumptions are needed and proceed to review execution.

---

## Verification Before Review

**Before executing review, verify:**
- ✅ Review scope is clearly defined
- ✅ All review types are specified
- ✅ Code quality standards are defined
- ✅ Specific concerns are identified (if applicable)
- ✅ No information is missing or assumed

**If any item above is not verified, continue asking questions.**

---

## Review Execution

**Only proceed if all information above is verified.**

Review complete. Developer should address issues before proceeding.

---

## Next Steps

After issues are addressed:
- Re-run code review to verify fixes
- Proceed to testing (Testing-and-TDD-Template.md)
- Proceed to deployment (Deployment-Template.md)

