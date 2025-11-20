-- Create employee_requests table if it doesn't exist
-- This script ensures the employee_requests table exists in the database

CREATE TABLE IF NOT EXISTS employee_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    employee_id UUID NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    request_type VARCHAR(50) NOT NULL CHECK (request_type IN ('learn-new-skills', 'apply-trainer', 'self-learning', 'other')),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'in_progress', 'completed')),
    requested_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    reviewed_at TIMESTAMP,
    reviewed_by UUID REFERENCES employees(id) ON DELETE SET NULL,
    rejection_reason TEXT,
    response_notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes if they don't exist
CREATE INDEX IF NOT EXISTS idx_employee_requests_employee ON employee_requests(employee_id);
CREATE INDEX IF NOT EXISTS idx_employee_requests_company_status ON employee_requests(company_id, status);
CREATE INDEX IF NOT EXISTS idx_employee_requests_type ON employee_requests(request_type);

