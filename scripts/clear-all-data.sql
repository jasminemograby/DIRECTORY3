-- Script to Clear All Companies and Employees Data
-- WARNING: This will delete ALL data from the database
-- Use only for testing/development purposes
-- Run this in Supabase SQL Editor

-- Disable foreign key checks temporarily (PostgreSQL doesn't support this, so we delete in order)
-- Delete in reverse order of dependencies

-- 1. Delete employee-related data (most dependent tables first)
DELETE FROM employee_profile_approvals;
DELETE FROM employee_project_summaries;
DELETE FROM trainer_settings;
DELETE FROM employee_roles;
DELETE FROM employee_teams;
DELETE FROM employee_managers;

-- 2. Delete employees
DELETE FROM employees;

-- 3. Delete teams (depends on departments and companies)
DELETE FROM teams;

-- 4. Delete departments (depends on companies)
DELETE FROM departments;

-- 5. Delete companies
DELETE FROM companies;

-- 6. Delete company registration requests (optional - for clean slate)
DELETE FROM company_registration_requests;

-- 7. Delete audit logs (optional - for clean slate)
DELETE FROM audit_logs;

-- Verify deletion
SELECT 
  (SELECT COUNT(*) FROM companies) as companies_count,
  (SELECT COUNT(*) FROM employees) as employees_count,
  (SELECT COUNT(*) FROM departments) as departments_count,
  (SELECT COUNT(*) FROM teams) as teams_count,
  (SELECT COUNT(*) FROM employee_roles) as employee_roles_count,
  (SELECT COUNT(*) FROM employee_teams) as employee_teams_count,
  (SELECT COUNT(*) FROM employee_managers) as employee_managers_count,
  (SELECT COUNT(*) FROM employee_profile_approvals) as approvals_count,
  (SELECT COUNT(*) FROM employee_project_summaries) as project_summaries_count,
  (SELECT COUNT(*) FROM trainer_settings) as trainer_settings_count,
  (SELECT COUNT(*) FROM company_registration_requests) as registration_requests_count,
  (SELECT COUNT(*) FROM audit_logs) as audit_logs_count;

-- All counts should be 0 if deletion was successful

