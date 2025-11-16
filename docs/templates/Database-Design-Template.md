# Database Design Template

**Purpose:** This template guides database design decisions, asking about tables, fields, relations, migration files, and data types.

**Expected Outputs:**
- Database schema design
- Migration files
- Index strategy
- Data integrity constraints
- Performance optimization plan

---

## Step 1: Feature Identification

**Question 1:** What is the Feature ID? (e.g., F004, F005)

**Your Answer:** [FXXX]

---

**Question 2:** What is the feature title?

**Your Answer:** [Title]

---

## Step 2: Database Changes Needed

**Question 3:** What database changes are needed? (Select all that apply)
- New tables
- Modified existing tables
- New indexes
- New constraints
- Data migration
- Other: [Specify]

**Your Answer:** [Selected changes]

**Instructions for AI:** Based on the user's answer to Question 3, dynamically generate follow-up questions for each selected change type. For New tables: ask how many, and for each table mentioned, ask about table name, purpose, columns with data types, primary key type, foreign keys (if any), relationship types, on-delete actions, unique constraints, check constraints, and indexes needed. For Modified existing tables: ask which tables, what changes (add columns, modify columns, add indexes, add constraints), and for each change, ask specific questions about the modifications and how existing data will be handled. For Data migration: ask what data needs to be migrated, whether transformation is needed, and whether migration is reversible. For New indexes/constraints: ask which tables/columns are involved and the specific requirements. If "Other" is mentioned, ask about the change type, purpose, and requirements. Generate these questions on the fly based on the specific changes mentioned.

---

## Step 3: Performance Considerations

**Question 4:** Are there performance requirements? (Yes/No)

**Your Answer:** [Yes/No]

**Instructions for AI:** If the user answers "Yes" to Question 4, dynamically generate follow-up questions about: expected query patterns (frequent reads, writes, complex joins), expected data volume, specific queries that need optimization, indexes that would help, caching requirements, and any performance-specific requirements. Generate these questions on the fly based on the specific performance needs mentioned.

---

## Step 4: Data Integrity

**Question 5:** What data integrity requirements are needed? (Select all that apply)
- Foreign key constraints
- Unique constraints
- Check constraints
- Not null constraints
- Default values
- Triggers
- Other: [Specify]

**Your Answer:** [Requirements]

**Instructions for AI:** Based on the user's answer to Question 5, dynamically generate follow-up questions for each requirement selected. For each constraint type, ask about which tables/columns are involved and the specific constraint requirements. For Triggers: ask what triggers are needed, and for each trigger mentioned, ask about when it should fire (before insert, after update, etc.) and what it should do. If "Other" is mentioned, ask about the requirement type, purpose, and implementation needs. Generate these questions on the fly based on the specific requirements mentioned.

---

## Step 5: Security & Access Control

**Question 6:** What security requirements are needed? (Select all that apply)
- Row-level security
- Column-level encryption
- Audit logging
- Data masking
- Other: [Specify]

**Your Answer:** [Requirements]

**Instructions for AI:** Based on the user's answer to Question 6, dynamically generate follow-up questions for each security requirement selected. For Row-level security: ask about the security policy (user-based, role-based, company-based), which tables need RLS, and policy implementation details. For Column-level encryption: ask about which columns need encryption, encryption method, and key management. For Audit logging: ask about which operations should be logged (INSERT, UPDATE, DELETE, SELECT), what information should be logged (user, timestamp, old values, new values), and log retention. For Data masking: ask about which data needs masking and masking strategy. If "Other" is mentioned, ask about the requirement type, purpose, and implementation needs. Generate these questions on the fly based on the specific security requirements mentioned.

---

## Step 6: Data Retention

**Question 7:** Are there data retention requirements? (Yes/No)

**Your Answer:** [Yes/No]

**Instructions for AI:** If the user answers "Yes" to Question 7, dynamically generate follow-up questions about: how long data should be retained, which tables/data types have retention requirements, whether old data should be archived or deleted, and if archived, where archived data should be stored (separate table, external storage, etc.). Generate these questions on the fly based on the specific retention requirements mentioned.

---

## Important: Complete Information Collection

**Instructions for AI:** Before proceeding to the Generation Phase, you must ensure ALL required information has been collected. Continue asking dynamic follow-up questions based on the user's answers until you have:

- All database changes fully specified (new tables, modified tables, indexes, constraints)
- Complete table definitions with all columns, data types, primary keys, foreign keys
- All relationships between tables specified
- All data migration requirements specified (if applicable)
- All performance requirements and optimization strategies specified
- All data integrity requirements specified
- All security and access control requirements specified
- All data retention requirements specified (if applicable)

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
- ✅ All database changes are fully specified
- ✅ All table definitions are complete
- ✅ All relationships are defined
- ✅ All migrations are planned (if applicable)
- ✅ Performance requirements are specified
- ✅ Data integrity requirements are complete
- ✅ Security requirements are specified
- ✅ No information is missing or assumed

**If any item above is not verified, continue asking questions.**

---

## Generation Phase

**Only proceed if all information above is verified.**

Based on your complete answers, I will now generate:

1. **Database Schema Design** - Complete table definitions
2. **Migration Files** - SQL migration scripts
3. **Index Strategy** - Performance optimization plan
4. **Data Integrity Plan** - Constraints and validations
5. **Security Plan** - Access control and encryption

**Files to be created/updated:**
- `database/migrations/XXX_[description].sql`
- `docs/feature-docs/FXXX/database-design.md`
- `database/schema.sql` (if new tables)

---

## Database Changes Summary

---

## Schema Design

### Entity Relationship
[Description of relationships]

### Foreign Keys
- `[table1].[column]` → `[table2].[column]` - [Relationship type]

### Constraints
- **Primary Keys:** [List]
- **Unique Constraints:** [List]
- **Check Constraints:** [List]

---

## Data Model

### Tables Overview
| Table | Purpose | Key Columns |
|-------|---------|-------------|
| [table1] | [Purpose] | [Columns] |

### Relationships Diagram
[Text description or diagram reference]

---

## Data Flow

### Write Operations
1. [Operation 1] - [Table(s) affected]
2. [Operation 2] - [Table(s) affected]

### Read Operations
1. [Query 1] - [Tables accessed]
2. [Query 2] - [Tables accessed]

---

## Performance Considerations

### Indexes
- **Purpose:** [Why this index]
- **Columns:** [Indexed columns]
- **Query Performance:** [Expected improvement]

### Query Optimization
[Optimization strategies]

---

## Data Integrity

### Validation Rules
[Database-level validation]

### Constraints
[Constraints ensuring data integrity]

---

## Migration Strategy

### Migration Steps
1. [Step 1]
2. [Step 2]
3. [Step 3]

### Rollback Plan
[How to rollback if needed]

---

## Security

### Access Control
[Who can access what data]

### Data Protection
[PII handling, encryption, etc.]

---

## Status
- **Design:** ✅ Complete
- **Migration Created:** ✅ Yes
- **Tested:** ✅ Yes
- **Deployed:** ✅ Yes

