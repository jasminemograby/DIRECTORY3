# Maintenance and Monitoring Template

**Purpose:** This template sets up logs, health checks, alerts, and monitoring for all services.

**Expected Outputs:**
- Monitoring configuration
- Logging setup
- Alert configuration
- Health check endpoints
- Monitoring dashboard setup

---

## Step 1: Monitoring Scope

**Question 1:** What should be monitored? (Select all that apply)
- Frontend application
- Backend API
- Database
- External service integrations
- All of the above
- Other: [Specify]

**Your Answer:** [Monitoring scope]

**Instructions for AI:** Based on the user's answer to Question 1, dynamically generate follow-up questions for each service mentioned. For each service, ask about: what metrics should be tracked (response time, error rate, uptime, etc.), service-specific monitoring requirements, and any service-specific considerations. **Important:** If the user mentions something not yet asked but related to monitoring (e.g., specific metrics, monitoring tools, alert thresholds), dynamically generate follow-up questions until all related information is captured.

---

## Step 2: Logging Setup

**Question 2:** What logging is needed? (Select all that apply)
- Application logs
- Error logs
- Access logs
- Audit logs
- Performance logs
- Security logs
- All of the above
- Other: [Specify]

**Your Answer:** [Log types]

**Dynamic Follow-ups:**
- **If Application logs:**
  - **Question 2a:** What log levels? (Error, Warn, Info, Debug, All)
  - **Your Answer:** [Levels]
  - **Question 2b:** Where should logs be stored? (Console, file, cloud service, database)
  - **Your Answer:** [Storage]
  - **If cloud service:**
    - **Question 2b-1:** Which service? (CloudWatch, Loggly, Datadog, Other)
    - **Your Answer:** [Service]

- **If Error logs:**
  - **Question 2c:** Should errors be sent to error tracking service? (Yes/No)
  - **Your Answer:** [Yes/No]
  - **If Yes:**
    - **Question 2c-1:** Which service? (Sentry, Rollbar, Bugsnag, Other)
    - **Your Answer:** [Service]

- **If Audit logs:**
  - **Question 2d:** What should be audited? (User actions, admin actions, data changes, etc.)
  - **Your Answer:** [Audit scope]
  - **Question 2e:** How long should audit logs be retained? (e.g., 1 year, 5 years)
  - **Your Answer:** [Retention]

---

## Step 3: Health Checks

**Question 3:** What health checks are needed? (Select all that apply)
- API health endpoint
- Database connection check
- External service availability
- Disk space check
- Memory usage check
- All of the above
- Other: [Specify]

**Your Answer:** [Health checks]

**Dynamic Follow-ups:**
- **If API health endpoint:**
  - **Question 3a:** What should the endpoint return? (Simple OK, detailed status, service dependencies)
  - **Your Answer:** [Response type]
  - **Question 3b:** What is the endpoint path? (e.g., /health, /api/health)
  - **Your Answer:** [Path]

- **If Database connection check:**
  - **Question 3c:** How should connection be checked? (Simple query, connection pool status, etc.)
  - **Your Answer:** [Check method]

- **If External service availability:**
  - **Question 3d:** Which external services? (List)
  - **Your Answer:** [Services]
  - **For each service:**
    - **Question 3e-[Service]:** How should [Service] be checked? (Ping, API call, status endpoint)
    - **Your Answer:** [Check method]

---

## Step 4: Alerts & Notifications

**Question 4:** What alerts are needed? (Select all that apply)
- Error rate threshold exceeded
- Response time threshold exceeded
- Service down
- Database connection failure
- Disk space low
- Memory usage high
- Custom alerts
- Other: [Specify]

**Your Answer:** [Alert types]

**Dynamic Follow-ups:**
- **For each alert type:**
  - **Question 4a-[Alert]:** What is the threshold for [Alert]? (e.g., error rate >5%, response time >2s)
  - **Your Answer:** [Threshold]
  - **Question 4b-[Alert]:** How should [Alert] be notified? (Email, Slack, SMS, Dashboard, Other)
  - **Your Answer:** [Notification method]
  - **If Email:**
    - **Question 4b-1-[Alert]:** Who should receive [Alert] emails? (List emails)
    - **Your Answer:** [Recipients]
  - **If Slack:**
    - **Question 4b-2-[Alert]:** What is the Slack webhook URL? (Or confirm it's configured)
    - **Your Answer:** [Webhook or "Configured"]

---

## Step 5: Performance Monitoring

**Question 5:** What performance metrics should be monitored? (Select all that apply)
- API response times
- Database query performance
- Frontend page load times
- API throughput (requests/second)
- Error rates
- Resource usage (CPU, memory, disk)
- All of the above
- Other: [Specify]

**Your Answer:** [Metrics]

**Dynamic Follow-ups:**
- **If API response times:**
  - **Question 5a:** What is the target response time? (e.g., <2s for most endpoints)
  - **Your Answer:** [Target]
  - **Question 5b:** Which endpoints are critical? (List)
  - **Your Answer:** [Endpoints]

- **If Database query performance:**
  - **Question 5c:** What is the target query time? (e.g., <100ms for simple queries)
  - **Your Answer:** [Target]
  - **Question 5d:** Should slow queries be logged? (Yes/No)
  - **Your Answer:** [Yes/No]
  - **If Yes:**
    - **Question 5d-1:** What is the slow query threshold? (e.g., >1s)
    - **Your Answer:** [Threshold]

---

## Step 6: Monitoring Tools

**Question 6:** What monitoring tools/services will be used? (Select all that apply)
- Application Performance Monitoring (APM) - New Relic, Datadog, etc.
- Log aggregation - ELK Stack, Splunk, etc.
- Error tracking - Sentry, Rollbar, etc.
- Uptime monitoring - Pingdom, UptimeRobot, etc.
- Custom dashboard
- Platform-native monitoring (Vercel, Railway, Supabase)
- Other: [Specify]

**Your Answer:** [Tools]

**Dynamic Follow-ups:**
- **For each tool:**
  - **Question 6a-[Tool]:** Is [Tool] already configured? (Yes/No)
  - **Your Answer:** [Yes/No]
  - **If No:**
    - **Question 6a-1-[Tool]:** Should I help set up [Tool]? (Yes/No)
    - **Your Answer:** [Yes/No]

---

## Step 7: Dashboard & Reporting

**Question 7:** What dashboards are needed? (Select all that apply)
- Real-time monitoring dashboard
- Performance metrics dashboard
- Error tracking dashboard
- User activity dashboard
- Custom dashboard
- Other: [Specify]

**Your Answer:** [Dashboards]

**Dynamic Follow-ups:**
- **For each dashboard:**
  - **Question 7a-[Dashboard]:** What should [Dashboard] display? (List metrics/charts)
  - **Your Answer:** [Display items]
  - **Question 7b-[Dashboard]:** Who should have access? (Admins, developers, all users)
  - **Your Answer:** [Access level]

---

## Important: Complete Information Collection

**Instructions for AI:** Before proceeding to setup, you must ensure ALL required information has been collected. Continue asking dynamic follow-up questions based on the user's answers until you have:

**CRITICAL:** If the user mentions something not yet asked but related to monitoring and maintenance (monitoring services, logging requirements, health checks, alerts, dashboards, etc.), dynamically generate follow-up questions until all related information is captured. Do not guess or assume - continue asking until all monitoring requirements are fully specified.

- Complete monitoring scope identified
- All logging requirements specified
- All health check requirements specified
- All alert requirements specified with thresholds and notifications
- All performance monitoring requirements specified
- All monitoring tools specified
- All dashboard requirements specified

**Do NOT proceed to setup until:**
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

**If Yes:** I will verify that no assumptions are needed and proceed to setup.

---

## Verification Before Setup

**Before setting up monitoring, verify:**
- ✅ Monitoring scope is defined
- ✅ Logging requirements are specified
- ✅ Health check requirements are complete
- ✅ Alert requirements are specified
- ✅ Performance monitoring is defined
- ✅ Monitoring tools are selected
- ✅ Dashboard requirements are specified
- ✅ No information is missing or assumed

**If any item above is not verified, continue asking questions.**

---

## Generation Phase

**Only proceed if all information above is verified.**

Based on your complete answers, I will now:

1. **Configure Logging** - Set up log collection and storage
2. **Set Up Health Checks** - Create health check endpoints
3. **Configure Alerts** - Set up alert rules and notifications
4. **Set Up Monitoring** - Configure monitoring tools
5. **Create Dashboards** - Set up monitoring dashboards

**Files to be created/updated:**
- `backend/config/logging.js` (if needed)
- `backend/routes/health.js` (if needed)
- `docs/monitoring_setup.md`

---

## Post-Setup

After setup:
- ✅ Logging configured
- ✅ Health checks active
- ✅ Alerts configured
- ✅ Monitoring dashboards available
- ✅ Ready for production monitoring

---

## Next Steps

After monitoring is set up:
- Monitor services for issues
- Review logs regularly
- Adjust alerts based on actual usage
- **Finalization-and-Docs-Template.md** - Finalize project documentation

