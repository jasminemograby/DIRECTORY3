-- Standalone script to create directory_admins table and admin account
-- This script can be run even if the migration hasn't been executed
-- Usage: Run this in your PostgreSQL database (Supabase/Railway)

-- Step 1: Create directory_admins table if it doesn't exist
CREATE TABLE IF NOT EXISTS directory_admins (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'DIRECTORY_ADMIN' CHECK (role = 'DIRECTORY_ADMIN'),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Step 2: Create index on email if it doesn't exist
CREATE INDEX IF NOT EXISTS idx_directory_admins_email ON directory_admins(email);

-- Step 3: Create admin account (only if it doesn't exist)
-- Admin Account Credentials:
-- Email: admin@educore.io
-- Password: SecurePass123

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

-- Step 4: Verify the admin was created
SELECT 
  id, 
  email, 
  full_name, 
  role,
  is_active, 
  created_at 
FROM directory_admins 
WHERE email = 'admin@educore.io';

