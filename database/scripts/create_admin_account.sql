-- Script to create a directory admin account
-- ⚠️ IMPORTANT: This script assumes the directory_admins table already exists
-- If you get an error "relation directory_admins does not exist", use create_admin_account_standalone.sql instead
-- Usage: Run this in your PostgreSQL database (Supabase/Railway)

-- Admin Account Credentials:
-- Email: admin@educore.io
-- Password: SecurePass123

-- Create admin account (only if it doesn't exist)
INSERT INTO directory_admins (email, password_hash, full_name, role, is_active)
SELECT 
  'admin@educore.io',
  '$2b$10$Z/ppcYfmXab7LdOubzN5Y.9sLfczLUaqJiLODVqs6ulMSZmSJzfxK',  -- Hash for "SecurePass123"
  'Directory Admin',
  'DIRECTORY_ADMIN',
  TRUE
WHERE NOT EXISTS (
  SELECT 1 FROM directory_admins WHERE email = 'admin@educore.io'
);

-- To verify the admin was created:
SELECT id, email, full_name, is_active, created_at FROM directory_admins WHERE email = 'admin@educore.io';

