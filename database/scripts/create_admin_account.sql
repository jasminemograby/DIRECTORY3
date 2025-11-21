-- Script to create a directory admin account
-- Usage: Run this in your PostgreSQL database (Supabase/Railway)

-- Admin Account Credentials:
-- Email: admin@educore.io
-- Password: SecurePass123

-- Check if admin already exists before inserting
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM directory_admins WHERE email = 'admin@educore.io') THEN
    INSERT INTO directory_admins (email, password_hash, full_name, role, is_active)
    VALUES (
      'admin@educore.io',
      '$2b$10$Z/ppcYfmXab7LdOubzN5Y.9sLfczLUaqJiLODVqs6ulMSZmSJzfxK',  -- Hash for "SecurePass123"
      'Directory Admin',
      'DIRECTORY_ADMIN',
      TRUE
    );
    RAISE NOTICE 'Admin account created successfully!';
  ELSE
    RAISE NOTICE 'Admin account already exists with email: admin@educore.io';
  END IF;
END $$;

-- To verify the admin was created:
-- SELECT id, email, full_name, is_active, created_at FROM directory_admins WHERE email = 'admin@educore.io';

