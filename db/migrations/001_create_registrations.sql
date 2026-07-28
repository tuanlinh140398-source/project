-- Create registrations table
CREATE TABLE IF NOT EXISTS registrations (
  id TEXT PRIMARY KEY,
  full_name TEXT NOT NULL,
  employee_code TEXT NOT NULL UNIQUE,
  department TEXT NOT NULL,
  phone_number TEXT NOT NULL,
  created_at TEXT NOT NULL,
  created_at_formatted TEXT NOT NULL
);

-- Create index on employee_code for fast lookup
CREATE INDEX IF NOT EXISTS idx_registrations_employee_code ON registrations(employee_code);

-- Create index on created_at for sorting
CREATE INDEX IF NOT EXISTS idx_registrations_created_at ON registrations(created_at DESC);
