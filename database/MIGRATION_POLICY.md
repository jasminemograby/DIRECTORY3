# Migration Policy

## Single Migration File Policy

This project uses a **single migration file** approach. All database schema changes must be added to the existing migration file rather than creating new migration files.

### Current Migration File
- **Location**: `database/migrations/001_initial_schema.sql`
- **Purpose**: Contains all database schema definitions for the entire project

### Guidelines

1. **Do NOT create new migration files** - Always update `001_initial_schema.sql`
2. **Use `CREATE TABLE IF NOT EXISTS`** - This ensures migrations are idempotent
3. **Add new tables/columns to the existing file** - Append new schema changes to the end of the file
4. **Maintain order** - Keep related tables together (e.g., all employee-related tables grouped)
5. **Document changes** - Add comments explaining new tables/columns when added

### Example: Adding a New Table

Instead of creating `002_add_new_table.sql`, add to `001_initial_schema.sql`:

```sql
-- New feature: Learning Paths
-- Added: 2024-XX-XX
CREATE TABLE IF NOT EXISTS learning_paths (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    -- ... rest of schema
);
```

### Why Single Migration File?

- Simpler deployment process
- Easier to track all schema changes in one place
- Reduces complexity in migration management
- All schema is visible in a single file for reference

