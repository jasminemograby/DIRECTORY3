-- =====================================================
-- CLEAR ALL DATA - Simple Version (Core Tables Only)
-- =====================================================
-- This deletes from the core tables that should exist
-- Skip tables that don't exist
-- =====================================================

-- Core tables (delete in dependency order)

-- Delete employee-related data first
DELETE FROM employee_profile_approvals;
DELETE FROM trainer_settings;
DELETE FROM employee_project_summaries;
DELETE FROM employee_managers;
DELETE FROM employee_teams;
DELETE FROM employee_roles;
DELETE FROM employees;

-- Delete company structure
DELETE FROM teams;
DELETE FROM departments;
DELETE FROM companies;

-- Verify core tables are empty
SELECT 
    'companies' as table_name, COUNT(*) as remaining_rows FROM companies
UNION ALL
SELECT 'employees', COUNT(*) FROM employees
UNION ALL
SELECT 'departments', COUNT(*) FROM departments
UNION ALL
SELECT 'teams', COUNT(*) FROM teams
UNION ALL
SELECT 'employee_roles', COUNT(*) FROM employee_roles;
