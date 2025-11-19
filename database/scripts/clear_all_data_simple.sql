-- Simple script to clear all data (only existing tables)
-- Copy and paste this into Supabase SQL Editor

-- Delete from tables that exist (ignore errors for missing tables)
DELETE FROM employee_profile_approvals WHERE EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'employee_profile_approvals');
DELETE FROM trainer_settings WHERE EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'trainer_settings');
DELETE FROM employee_project_summaries WHERE EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'employee_project_summaries');
DELETE FROM employee_roles WHERE EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'employee_roles');
DELETE FROM employee_teams WHERE EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'employee_teams');
DELETE FROM employee_managers WHERE EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'employee_managers');
DELETE FROM audit_logs WHERE EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'audit_logs');
DELETE FROM employees WHERE EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'employees');
DELETE FROM teams WHERE EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'teams');
DELETE FROM departments WHERE EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'departments');
DELETE FROM company_registration_requests WHERE EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'company_registration_requests');
DELETE FROM companies WHERE EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'companies');

-- Verify (check only existing tables)
SELECT 'companies' as table_name, COUNT(*) as remaining_rows FROM companies
UNION ALL SELECT 'employees', COUNT(*) FROM employees
UNION ALL SELECT 'departments', COUNT(*) FROM departments
UNION ALL SELECT 'teams', COUNT(*) FROM teams
UNION ALL SELECT 'employee_roles', COUNT(*) FROM employee_roles;

