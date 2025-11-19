-- Basic Clear Script - Only deletes from tables that definitely exist
-- Use this if you're getting "relation does not exist" errors

-- Delete from core tables (these should exist after migration)
DELETE FROM employee_profile_approvals;
DELETE FROM trainer_settings;
DELETE FROM employee_project_summaries;
DELETE FROM employee_roles;
DELETE FROM employee_teams;
DELETE FROM employee_managers;
DELETE FROM audit_logs;
DELETE FROM employees;
DELETE FROM teams;
DELETE FROM departments;
DELETE FROM company_registration_requests;
DELETE FROM companies;

-- Verify deletion
SELECT 
    'companies' as table_name, COUNT(*) as remaining_rows FROM companies
UNION ALL
SELECT 'employees', COUNT(*) FROM employees
UNION ALL
SELECT 'departments', COUNT(*) FROM departments
UNION ALL
SELECT 'teams', COUNT(*) FROM teams
UNION ALL
SELECT 'employee_roles', COUNT(*) FROM employee_roles
UNION ALL
SELECT 'employee_profile_approvals', COUNT(*) FROM employee_profile_approvals;

