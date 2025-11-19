-- Script to clear all data from the database
-- This will delete all companies, employees, and related data
-- Use with caution - this is irreversible!

-- Disable foreign key checks temporarily (PostgreSQL doesn't support this, so we delete in order)
-- Delete in reverse order of dependencies to avoid foreign key violations

-- Delete employee requests (depends on employees)
DELETE FROM employee_requests;

-- Delete employee profile approvals (depends on employees and companies)
DELETE FROM employee_profile_approvals;

-- Delete trainer settings (depends on employees)
DELETE FROM trainer_settings;

-- Delete employee project summaries (depends on employees)
DELETE FROM employee_project_summaries;

-- Delete employee roles (depends on employees)
DELETE FROM employee_roles;

-- Delete employee teams (depends on employees and teams)
DELETE FROM employee_teams;

-- Delete employee managers (depends on employees)
DELETE FROM employee_managers;

-- Delete audit logs (depends on companies and employees)
DELETE FROM audit_logs;

-- Delete employees (depends on companies)
DELETE FROM employees;

-- Delete teams (depends on departments and companies)
DELETE FROM teams;

-- Delete departments (depends on companies)
DELETE FROM departments;

-- Delete company registration requests
DELETE FROM company_registration_requests;

-- Delete companies (this will cascade delete remaining dependencies)
DELETE FROM companies;

-- Reset sequences if any (PostgreSQL uses UUIDs, so no sequences needed)
-- But we can verify the tables are empty

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
SELECT 'employee_requests', COUNT(*) FROM employee_requests
UNION ALL
SELECT 'employee_profile_approvals', COUNT(*) FROM employee_profile_approvals;

