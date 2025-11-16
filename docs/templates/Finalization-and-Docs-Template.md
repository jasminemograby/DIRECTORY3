# Finalization and Docs Template

**Purpose:** This template assembles the final plan, executive summary, Roadmap JSON, AI integration notes, and TDD/testing strategy.

**Expected Outputs:**
- final_plan.md document
- Executive summary
- Complete Roadmap JSON
- AI integration documentation
- TDD/testing strategy document
- Release checklist

---

## Step 1: Project Status

**Question 1:** What is the current project status? (Select one)
- All milestones DONE
- Most milestones DONE (specify what's remaining)
- In progress (specify completion percentage)
- Other: [Specify]

**Your Answer:** [Status]

**Dynamic Follow-ups:**
- **If Most milestones DONE:**
  - **Question 1a:** What milestones are remaining? (List)
  - **Your Answer:** [Remaining milestones]
  - **Question 1b:** Are remaining milestones critical for release? (Yes/No)
  - **Your Answer:** [Yes/No]

- **If In progress:**
  - **Question 1c:** What is the completion percentage? (e.g., 75%)
  - **Your Answer:** [Percentage]
  - **Question 1d:** What features are complete? (List)
  - **Your Answer:** [Complete features]
  - **Question 1e:** What features are in progress? (List)
  - **Your Answer:** [In progress features]

---

## Step 2: Feature Completion

**Question 2:** Which features are complete? (List all Feature IDs)

**Your Answer:** [Feature IDs]

**Instructions for AI:** Based on the user's answer to Question 2, dynamically generate follow-up questions for each feature mentioned. For each feature, ask about: whether the feature is fully tested, whether it is documented, whether it is deployed, and any feature-specific status requirements. **Important:** If the user mentions something not yet asked but related to feature status (e.g., specific testing gaps, documentation needs, deployment issues), dynamically generate follow-up questions until all related information is captured.

---

## Step 3: AI Integration Summary

**Question 3:** Which features use AI/LLM integration? (List Feature IDs or "None")

**Your Answer:** [Features or "None"]

**Instructions for AI:** If the user's answer is not "None", dynamically generate follow-up questions for each AI feature mentioned. For each feature, ask about: which AI service is used (Gemini, OpenAI, Claude, Other), what the AI use case is, what guardrails are implemented, whether AI usage is logged/monitored, and any AI-specific requirements. **Important:** If the user mentions something not yet asked but related to AI integration (e.g., specific AI services, prompt structures, guardrail implementations), dynamically generate follow-up questions until all related information is captured.

---

## Step 4: Testing Strategy Summary

**Question 4:** What is the testing strategy? (Select all that apply)
- Unit tests (coverage %)
- Integration tests
- E2E tests
- Performance tests
- Security tests
- Regression tests
- Other: [Specify]

**Your Answer:** [Test types]

**Dynamic Follow-ups:**
- **If Unit tests:**
  - **Question 4a:** What is the overall test coverage? (Percentage)
  - **Your Answer:** [Coverage %]
  - **Question 4b:** Are there coverage targets per feature? (Yes/No)
  - **Your Answer:** [Yes/No]

- **Question 4c:** Where are test results documented? (List locations)
- **Your Answer:** [Locations]

---

## Step 5: Security Summary

**Question 5:** What security measures are in place? (Select all that apply)
- Input validation
- SQL injection prevention
- XSS prevention
- Authentication/Authorization
- Encryption (data at rest)
- Encryption (data in transit - HTTPS)
- Secrets management
- Security scanning
- Compliance (GDPR, HIPAA, etc.)
- Other: [Specify]

**Your Answer:** [Security measures]

**Dynamic Follow-ups:**
- **If Compliance:**
  - **Question 5a:** Which compliance requirements? (List)
  - **Your Answer:** [Compliance]
  - **Question 5b:** Are compliance measures documented? (Yes/No)
  - **Your Answer:** [Yes/No]

---

## Step 6: Deployment Summary

**Question 6:** What is deployed and where? (List deployments)

**Your Answer:**
- Frontend: [Platform] - [URL]
- Backend: [Platform] - [URL]
- Database: [Platform]

**Dynamic Follow-ups:**
- **Question 6a:** Are all services healthy? (Yes/No)
- **Your Answer:** [Yes/No]
- **If No:**
  - **Question 6a-1:** What issues exist? (List)
  - **Your Answer:** [Issues]

---

## Step 7: Documentation Status

**Question 7:** What documentation exists? (Select all that apply)
- requirements.md
- flow.md
- architecture.md
- roadmap.json
- Feature documentation (feature-docs/)
- API documentation
- Deployment guides
- User guides
- Other: [Specify]

**Your Answer:** [Documentation]

**Dynamic Follow-ups:**
- **Question 7a:** Is documentation complete and up-to-date? (Yes/No)
- **Your Answer:** [Yes/No]
- **If No:**
  - **Question 7a-1:** What documentation needs updating? (List)
  - **Your Answer:** [Documentation to update]

---

## Step 8: Roadmap Finalization

**Question 8:** Is the Roadmap JSON complete and accurate? (Yes/No)

**Your Answer:** [Yes/No]

**Dynamic Follow-ups (if No):**
- **Question 8a:** What needs to be updated in roadmap.json? (List)
- **Your Answer:** [Updates needed]

**Question 9:** Are all completed features marked as DONE in roadmap.json? (Yes/No)

**Your Answer:** [Yes/No]

**If No:**
- **Question 9a:** Should I update roadmap.json to mark features as DONE? (Yes/No)
- **Your Answer:** [Yes/No]

---

## Important: Complete Information Collection

**Instructions for AI:** Before proceeding to the Generation Phase, you must ensure ALL required information has been collected. Continue asking dynamic follow-up questions based on the user's answers until you have:

**CRITICAL:** If the user mentions something not yet asked but related to finalization and documentation (project status, feature completion, AI integration, testing, security, deployment, documentation needs, etc.), dynamically generate follow-up questions until all related information is captured. Do not guess or assume - continue asking until all finalization requirements are fully specified.

- Complete project status and milestone completion
- All feature completion status verified
- Complete AI integration summary (if applicable)
- Complete testing strategy summary
- Complete security summary
- Complete deployment summary
- Complete documentation status
- Roadmap finalization confirmed

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

**Before generating final documentation, verify:**
- ✅ Project status is complete
- ✅ All features are accounted for
- ✅ AI integration is documented (if applicable)
- ✅ Testing strategy is complete
- ✅ Security summary is complete
- ✅ Deployment summary is complete
- ✅ Documentation status is verified
- ✅ Roadmap is finalized
- ✅ No information is missing or assumed

**If any item above is not verified, continue asking questions.**

---

## Generation Phase

**Only proceed if all information above is verified.**

Based on your complete answers, I will now generate:

1. **final_plan.md** - Complete final plan document
2. **Executive Summary** - High-level project overview
3. **Roadmap Summary** - Human-readable roadmap summary
4. **AI Integration Notes** - All AI/LLM usage documented
5. **TDD/Testing Strategy** - Complete testing documentation
6. **Security Summary** - Security measures and compliance
7. **Deployment Summary** - Deployment status and URLs
8. **Release Checklist** - Final release checklist

**Files to be created:**
- `docs/final_plan.md`
- `docs/executive_summary.md`
- `docs/ai_integration_notes.md`
- `docs/tdd_testing_strategy.md`
- `docs/release_checklist.md`

---

## Release Checklist

**Pre-Release:**
- [ ] All features complete
- [ ] All tests passing
- [ ] Code review completed
- [ ] Security scan passed
- [ ] Documentation complete
- [ ] Deployment successful
- [ ] Health checks passing
- [ ] Monitoring configured

**Release:**
- [ ] Final plan.md created
- [ ] Executive summary created
- [ ] Roadmap finalized
- [ ] Release notes prepared
- [ ] User documentation ready

---

## Next Steps

After finalization:
- Project is ready for release
- Documentation is complete
- All artifacts are in place
- Ready for production use

---

## Project Completion

**Status:** ✅ Complete

All templates executed, all features implemented, all documentation complete.

**Ready for production!** 🚀

