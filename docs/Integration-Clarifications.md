# Integration Clarifications - Final Answers

This document contains the final clarifications for all unclear points after receiving all three descriptions.

**Last Updated**: Based on user clarifications

---

## 1. Employee Profile Enrichment Timing ✅ ANSWERED

### Answer:
**Enrichment happens on first employee login, not during CSV upload. After enrichment, HR approval is required before employee can use the system.**

### Flow:
1. **Company uploads CSV** → Directory creates company profile
2. **Directory creates basic employee profiles** for each employee in the company
3. **Employee logs in for first time** → Sees basic profile with:
   - Name, email, team, department, role in company, etc.
   - **Message asking to connect LinkedIn and GitHub** (mandatory step)
4. **Employee connects LinkedIn + GitHub** (OAuth) → Directory fetches raw data
5. **Directory enriches profile** → Updates with:
   - Basic data + Bio + Value Proposition + Skills Section + Course Section + Relevant tabs
6. **Directory updates profile status to "enriched"** (but not yet approved)
7. **Directory sends approval request to Company Profile**
8. **HR sees approval requests** in Company Profile (pending enriched profiles)
9. **HR reviews and approves/rejects** the enriched profile
10. **If approved**: Employee profile status changes to "approved" → **Employee can now use the system** (learning, requests, etc.)
11. **If rejected**: Employee profile remains "enriched" but not approved → Employee cannot use the system until approved

### Key Points:
- Enrichment is **mandatory** - employee cannot use system until profile is enriched
- **HR approval is required** - enriched profile must be approved by company before employee can use system
- Employee must connect LinkedIn and GitHub themselves (OAuth on first login)
- Basic profile is created from CSV data
- Full profile is created after OAuth and enrichment
- Approval ensures enriched profile (with external data) is suitable/appropriate for the company

### Implementation Impact:
- **Backend**: Create endpoint for OAuth callbacks (LinkedIn, GitHub)
- **Backend**: Create enrichment flow that calls Gemini AI + Skills Engine
- **Backend**: Create approval request system (new table, repository, controller)
- **Backend**: Add profile status field to employees table (`profile_status`: 'basic', 'enriched', 'approved', 'rejected')
- **Backend**: Create `employee_profile_approvals` table
- **Frontend**: Create "Enrich Your Profile" page (shown on first login)
- **Frontend**: OAuth connection UI for LinkedIn and GitHub
- **Frontend**: Profile enrichment status indicator
- **Frontend**: "Pending Profile Approvals" section in Company Profile
- **Frontend**: Approval/rejection UI for HR
- **Frontend**: Access control - disable employee actions until approved

---

## 2. LinkedIn/GitHub OAuth Flow ✅ ANSWERED

### Answer:
**Employee initiates OAuth on first login only.**

### Flow:
- Employee logs in for first time
- Sees basic profile with message to connect LinkedIn and GitHub
- Employee clicks "Connect LinkedIn" → OAuth flow
- Employee clicks "Connect GitHub" → OAuth flow
- Directory fetches raw data from both sources
- Directory uses raw data for enrichment (Gemini AI + Skills Engine)

### Key Points:
- **NOT** HR during company registration
- **ONLY** Employee on first login
- Employee must authenticate with their own accounts
- This is a **one-time only** process (cannot reconnect later)

### Implementation Impact:
- **Backend**: OAuth endpoints for LinkedIn and GitHub
- **Backend**: Store OAuth tokens securely
- **Frontend**: OAuth connection buttons in "Enrich Your Profile" page
- **Frontend**: Handle OAuth callbacks and redirects

---

## 3. Skill Verification Button ✅ ANSWERED

### Answer:
**Button is one-time only for initial skill verification. Hidden after first use.**

### Clarification:
- Button is **only for first skill verification in system**
- **NOT** for skill verification of learned skills in courses
- After first verification, button is **permanently hidden**
- Skills Engine can still update verified skills after course completion (automatic, no button needed)

### Flow:
1. Employee clicks "Verify Your Skills" button (one-time)
2. Directory triggers Skills Engine verification
3. Skills Engine sends assessment request to Assessment
4. Employee completes assessment
5. Skills Engine returns verified skills
6. **Button is hidden** (never reappears)
7. Future skill updates happen automatically after course completion (no button)

### Implementation Impact:
- **Backend**: Track if employee has completed initial verification
- **Frontend**: Show button only if `initial_verification_completed = false`
- **Frontend**: Hide button permanently after first verification

---

## 4. Daily Jobs Timing ✅ ANSWERED

### Answer:
**For now, just implement endpoints. Use mock data. Timing doesn't matter yet.**

### Clarification:
- Learning Analytics and Management & Reporting microservices are not done yet
- Directory just needs to implement the endpoints
- When these microservices call Directory, Directory responds
- For now, API calls will fail → use mock data
- Actual timing/triggering will be handled by the other microservices later

### Implementation Impact:
- **Backend**: Implement endpoints that can respond to Learning Analytics requests
- **Backend**: Implement endpoints that can respond to Management & Reporting requests
- **Backend**: Use mock data for now (fallback mechanism)
- **No need for**: Cron jobs, scheduled tasks, or timing logic yet

---

## 5. Skills Engine Push Updates ✅ ANSWERED

### Answer:
**Skills Engine calls Directory's `/api/fill-content-metrics` with updated skills.**

### Flow:
1. Employee completes course and passes exam
2. Skills Engine processes the completion
3. Skills Engine identifies new verified skills
4. **Skills Engine calls Directory**: `POST /api/fill-content-metrics`
5. Directory receives updated skills in the envelope
6. Directory updates employee profile with new verified skills

### Implementation Impact:
- **Backend**: Universal endpoint must handle Skills Engine requests
- **Backend**: Parse envelope from Skills Engine
- **Backend**: Update employee competencies and verified skills
- **Backend**: Update relevance_score if provided

---

## 6. CSV Field Updates After Registration ✅ ANSWERED

### Answer:
**Company can update `passing_grade`, `max_attempts`, etc. in Company Profile edit. No re-sync needed.**

### Clarification:
- Company **CAN** update these fields after registration
- Update happens in **Company Profile edit UI**
- Updates do **NOT** trigger re-sync to Assessment
- Assessment will ask for these fields when needed (via universal endpoint)
- Assessment initiates the request, Directory responds with current values

### Implementation Impact:
- **Frontend**: Add edit functionality to Company Profile
- **Frontend**: Allow editing: passing_grade, max_attempts, exercises_limited, num_of_exercises
- **Backend**: Update company settings in database
- **Backend**: No need to proactively sync to Assessment (they ask when needed)

---

## 7. Decision Maker Updates ✅ ANSWERED

### Answer:
**For now, Decision Maker cannot be changed. This is a "nice to have" for future.**

### Clarification:
- Decision Maker is set during CSV upload (`decision_maker_id` field)
- **Cannot be changed** after registration (for now)
- This feature is marked as **"nice to have"** for future implementation
- If implemented in future:
  - Add UI in Company Profile to change Decision Maker
  - Trigger re-sync to Learner AI when changed

### Implementation Impact:
- **Frontend**: Do NOT add UI to change Decision Maker (for now)
- **Backend**: Decision Maker is set once during registration
- **Documentation**: Feature saved in `/docs/NICE_TO_HAVE.md`

---

## Additional Clarifications

### Website URL
- `website_url` = domain of the company
- Already stored in `companies.domain` field
- No new field needed

### CSV Field Handling
- If fields are missing in CSV, ask company to fill them (like current error handling)
- Fields: `passing_grade`, `max_attempts`, `exercises_limited`, `num_of_exercises`, `decision_maker_id`
- Use existing CSV error correction flow

### Decision Maker
- Decision Maker is just an employee with a specific employee_id
- They have the same employee_id as any other employee
- They just have additional permission to approve learning paths
- No separate role type needed (they're still REGULAR_EMPLOYEE, TRAINER, etc.)

### Migration Files
- **ONLY ONE migration file** for the whole project
- Do NOT split into multiple migration files
- All schema changes go into `001_initial_schema.sql`

---

## Updated Implementation Checklist

### Phase 1: Schema Updates
- [ ] Update `001_initial_schema.sql` with:
  - New tables: employee_competencies, exam_results, courses, employee_courses, course_completions
  - New fields in companies: passing_grade, max_attempts, exercises_limited, num_of_exercises, decision_maker_id
  - New fields in employees: relevance_score
  - New fields in trainer_settings: status

### Phase 2: CSV Updates
- [ ] Update CSV parser to handle new fields
- [ ] Update CSV validator to validate new fields
- [ ] Update CSV documentation
- [ ] Update CSV sample files

### Phase 3: Universal Endpoint
- [ ] Implement `/api/fill-content-metrics` endpoint
- [ ] Implement AI query generation
- [ ] Implement schema matching
- [ ] Handle requests from all microservices

### Phase 4: OAuth & Enrichment
- [ ] Implement LinkedIn OAuth
- [ ] Implement GitHub OAuth
- [ ] Create "Enrich Your Profile" page
- [ ] Implement enrichment flow (Gemini AI + Skills Engine)

### Phase 5: Microservice Integrations
- [ ] Skills Engine integration
- [ ] Assessment integration
- [ ] Content Studio integration
- [ ] Course Builder integration
- [ ] Learner AI integration (note different endpoint)
- [ ] Learning Analytics integration (endpoint only, mock data)
- [ ] Management & Reporting integration (endpoint only, mock data)

### Phase 6: UI Updates
- [ ] Employee Profile page with all sections
- [ ] Company Profile edit functionality
- [ ] Learning Analytics tabs
- [ ] Decision Maker approvals tab (mock for now)

---

## Files Created/Updated

1. `/docs/NICE_TO_HAVE.md` - Future features list
2. `/docs/Integration-Clarifications.md` - This document
3. `/docs/API-Interaction-Rules.md` - Updated with Learner AI endpoint
4. `/docs/Microservice-Integration-Spec.md` - Updated with clarifications

