-- Script to clear all data from the database (Safe Version)
-- Only deletes from tables that exist
-- This will delete all companies, employees, and related data
-- Use with caution - this is irreversible!

-- Delete employee profile approvals (if exists)
DO $$ 
BEGIN
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'employee_profile_approvals') THEN
        DELETE FROM employee_profile_approvals;
        RAISE NOTICE 'Deleted from employee_profile_approvals';
    END IF;
END $$;

-- Delete employee requests (if exists)
DO $$ 
BEGIN
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'employee_requests') THEN
        DELETE FROM employee_requests;
        RAISE NOTICE 'Deleted from employee_requests';
    END IF;
END $$;

-- Delete trainer settings (if exists)
DO $$ 
BEGIN
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'trainer_settings') THEN
        DELETE FROM trainer_settings;
        RAISE NOTICE 'Deleted from trainer_settings';
    END IF;
END $$;

-- Delete employee project summaries (if exists)
DO $$ 
BEGIN
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'employee_project_summaries') THEN
        DELETE FROM employee_project_summaries;
        RAISE NOTICE 'Deleted from employee_project_summaries';
    END IF;
END $$;

-- Delete employee roles (if exists)
DO $$ 
BEGIN
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'employee_roles') THEN
        DELETE FROM employee_roles;
        RAISE NOTICE 'Deleted from employee_roles';
    END IF;
END $$;

-- Delete employee teams (if exists)
DO $$ 
BEGIN
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'employee_teams') THEN
        DELETE FROM employee_teams;
        RAISE NOTICE 'Deleted from employee_teams';
    END IF;
END $$;

-- Delete employee managers (if exists)
DO $$ 
BEGIN
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'employee_managers') THEN
        DELETE FROM employee_managers;
        RAISE NOTICE 'Deleted from employee_managers';
    END IF;
END $$;

-- Delete audit logs (if exists)
DO $$ 
BEGIN
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'audit_logs') THEN
        DELETE FROM audit_logs;
        RAISE NOTICE 'Deleted from audit_logs';
    END IF;
END $$;

-- Delete employees (if exists)
DO $$ 
BEGIN
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'employees') THEN
        DELETE FROM employees;
        RAISE NOTICE 'Deleted from employees';
    END IF;
END $$;

-- Delete teams (if exists)
DO $$ 
BEGIN
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'teams') THEN
        DELETE FROM teams;
        RAISE NOTICE 'Deleted from teams';
    END IF;
END $$;

-- Delete departments (if exists)
DO $$ 
BEGIN
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'departments') THEN
        DELETE FROM departments;
        RAISE NOTICE 'Deleted from departments';
    END IF;
END $$;

-- Delete company registration requests (if exists)
DO $$ 
BEGIN
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'company_registration_requests') THEN
        DELETE FROM company_registration_requests;
        RAISE NOTICE 'Deleted from company_registration_requests';
    END IF;
END $$;

-- Delete companies (if exists)
DO $$ 
BEGIN
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'companies') THEN
        DELETE FROM companies;
        RAISE NOTICE 'Deleted from companies';
    END IF;
END $$;

-- Verify deletion (only check tables that exist)
SELECT 
    table_name,
    CASE 
        WHEN table_name = 'companies' THEN (SELECT COUNT(*) FROM companies)
        WHEN table_name = 'employees' THEN (SELECT COUNT(*) FROM employees)
        WHEN table_name = 'departments' THEN (SELECT COUNT(*) FROM departments)
        WHEN table_name = 'teams' THEN (SELECT COUNT(*) FROM teams)
        WHEN table_name = 'employee_roles' THEN (SELECT COUNT(*) FROM employee_roles)
        WHEN table_name = 'employee_requests' THEN (SELECT COUNT(*) FROM employee_requests WHERE EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'employee_requests'))
        WHEN table_name = 'employee_profile_approvals' THEN (SELECT COUNT(*) FROM employee_profile_approvals WHERE EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'employee_profile_approvals'))
        ELSE 0
    END as remaining_rows
FROM (
    SELECT 'companies' as table_name
    UNION ALL SELECT 'employees'
    UNION ALL SELECT 'departments'
    UNION ALL SELECT 'teams'
    UNION ALL SELECT 'employee_roles'
) t
WHERE EXISTS (
    SELECT FROM information_schema.tables 
    WHERE table_name = t.table_name
);

