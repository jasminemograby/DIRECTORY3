-- =====================================================
-- CLEAR ALL DATA - Safe Version (Only deletes existing tables)
-- =====================================================
-- This script deletes data from tables that exist
-- It won't fail if some tables don't exist
-- =====================================================

-- Delete in reverse order of dependencies

-- Delete from tables that may or may not exist (using DO block for error handling)
DO $$
BEGIN
    -- Try to delete from each table, ignore if it doesn't exist
    BEGIN
        DELETE FROM employee_requests;
    EXCEPTION WHEN undefined_table THEN
        RAISE NOTICE 'Table employee_requests does not exist, skipping...';
    END;

    BEGIN
        DELETE FROM employee_profile_approvals;
    EXCEPTION WHEN undefined_table THEN
        RAISE NOTICE 'Table employee_profile_approvals does not exist, skipping...';
    END;

    BEGIN
        DELETE FROM trainer_settings;
    EXCEPTION WHEN undefined_table THEN
        RAISE NOTICE 'Table trainer_settings does not exist, skipping...';
    END;

    BEGIN
        DELETE FROM employee_project_summaries;
    EXCEPTION WHEN undefined_table THEN
        RAISE NOTICE 'Table employee_project_summaries does not exist, skipping...';
    END;

    BEGIN
        DELETE FROM employee_managers;
    EXCEPTION WHEN undefined_table THEN
        RAISE NOTICE 'Table employee_managers does not exist, skipping...';
    END;

    BEGIN
        DELETE FROM employee_teams;
    EXCEPTION WHEN undefined_table THEN
        RAISE NOTICE 'Table employee_teams does not exist, skipping...';
    END;

    BEGIN
        DELETE FROM employee_roles;
    EXCEPTION WHEN undefined_table THEN
        RAISE NOTICE 'Table employee_roles does not exist, skipping...';
    END;

    BEGIN
        DELETE FROM audit_logs;
    EXCEPTION WHEN undefined_table THEN
        RAISE NOTICE 'Table audit_logs does not exist, skipping...';
    END;

    BEGIN
        DELETE FROM employees;
    EXCEPTION WHEN undefined_table THEN
        RAISE NOTICE 'Table employees does not exist, skipping...';
    END;

    BEGIN
        DELETE FROM teams;
    EXCEPTION WHEN undefined_table THEN
        RAISE NOTICE 'Table teams does not exist, skipping...';
    END;

    BEGIN
        DELETE FROM departments;
    EXCEPTION WHEN undefined_table THEN
        RAISE NOTICE 'Table departments does not exist, skipping...';
    END;

    BEGIN
        DELETE FROM company_registration_requests;
    EXCEPTION WHEN undefined_table THEN
        RAISE NOTICE 'Table company_registration_requests does not exist, skipping...';
    END;

    BEGIN
        DELETE FROM companies;
    EXCEPTION WHEN undefined_table THEN
        RAISE NOTICE 'Table companies does not exist, skipping...';
    END;
END $$;

-- Verify deletion (only check tables that exist)
SELECT 
    'companies' as table_name, 
    (SELECT COUNT(*) FROM companies) as remaining_rows
WHERE EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'companies')
UNION ALL
SELECT 'employees', (SELECT COUNT(*) FROM employees)
WHERE EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'employees')
UNION ALL
SELECT 'departments', (SELECT COUNT(*) FROM departments)
WHERE EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'departments')
UNION ALL
SELECT 'teams', (SELECT COUNT(*) FROM teams)
WHERE EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'teams')
UNION ALL
SELECT 'employee_roles', (SELECT COUNT(*) FROM employee_roles)
WHERE EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'employee_roles')
UNION ALL
SELECT 'employee_teams', (SELECT COUNT(*) FROM employee_teams)
WHERE EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'employee_teams')
UNION ALL
SELECT 'employee_managers', (SELECT COUNT(*) FROM employee_managers)
WHERE EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'employee_managers')
UNION ALL
SELECT 'employee_project_summaries', (SELECT COUNT(*) FROM employee_project_summaries)
WHERE EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'employee_project_summaries')
UNION ALL
SELECT 'trainer_settings', (SELECT COUNT(*) FROM trainer_settings)
WHERE EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'trainer_settings')
UNION ALL
SELECT 'employee_profile_approvals', (SELECT COUNT(*) FROM employee_profile_approvals)
WHERE EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'employee_profile_approvals')
UNION ALL
SELECT 'employee_requests', (SELECT COUNT(*) FROM employee_requests)
WHERE EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'employee_requests')
UNION ALL
SELECT 'audit_logs', (SELECT COUNT(*) FROM audit_logs)
WHERE EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'audit_logs')
UNION ALL
SELECT 'company_registration_requests', (SELECT COUNT(*) FROM company_registration_requests)
WHERE EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'company_registration_requests')
ORDER BY table_name;
