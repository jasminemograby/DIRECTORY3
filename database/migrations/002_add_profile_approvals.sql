-- Migration: Add Employee Profile Approvals Table and Profile Status Column
-- Run this in Supabase SQL Editor if employee_profile_approvals table doesn't exist

-- Add profile_status column to employees table (if not exists)
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'employees' AND column_name = 'profile_status'
    ) THEN
        ALTER TABLE employees 
        ADD COLUMN profile_status VARCHAR(50) DEFAULT 'basic' 
        CHECK (profile_status IN ('basic', 'enriched', 'approved', 'rejected'));
        
        RAISE NOTICE 'Added profile_status column to employees table';
    ELSE
        RAISE NOTICE 'profile_status column already exists';
    END IF;
END $$;

-- Create employee_profile_approvals table (if not exists)
CREATE TABLE IF NOT EXISTS employee_profile_approvals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    employee_id UUID NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    enriched_at TIMESTAMP,
    requested_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    reviewed_at TIMESTAMP,
    reviewed_by UUID REFERENCES employees(id) ON DELETE SET NULL,
    rejection_reason TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(employee_id)
);

-- Create indexes (if not exists)
CREATE INDEX IF NOT EXISTS idx_employees_profile_status ON employees(profile_status);
CREATE INDEX IF NOT EXISTS idx_employee_profile_approvals_company_status ON employee_profile_approvals(company_id, status);
CREATE INDEX IF NOT EXISTS idx_employee_profile_approvals_employee ON employee_profile_approvals(employee_id);

-- Verify tables were created
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'employee_profile_approvals') THEN
        RAISE NOTICE '✅ employee_profile_approvals table created successfully';
    ELSE
        RAISE EXCEPTION '❌ employee_profile_approvals table was not created';
    END IF;
    
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'employees' AND column_name = 'profile_status'
    ) THEN
        RAISE NOTICE '✅ profile_status column added to employees table';
    ELSE
        RAISE EXCEPTION '❌ profile_status column was not added';
    END IF;
END $$;

