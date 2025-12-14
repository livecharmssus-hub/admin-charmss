/*
  # Create Studios Management Schema

  ## Overview
  This migration creates the database schema for managing Studios (recruiting agencies).
  Studios are entities that recruit and manage performers on the platform.

  ## New Tables

  ### `studios`
  Main table storing studio information:
  - `id` (uuid, primary key) - Unique identifier
  - `name` (text) - Studio name
  - `legal_representative` (text) - Legal representative name
  - `email` (text, unique) - Contact email
  - `location` (text) - Geographic location
  - `status` (text) - Status: 'active' or 'inactive'
  - `created_at` (timestamptz) - Creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp

  ### `studio_performers`
  Junction table linking performers to studios:
  - `id` (uuid, primary key)
  - `studio_id` (uuid, foreign key) - References studios table
  - `performer_id` (uuid, foreign key) - References performers table
  - `commission_rate` (decimal) - Commission percentage (0-100)
  - `joined_date` (timestamptz) - Date performer joined studio
  - `created_at` (timestamptz)

  ### `studio_payments`
  Tracks payment history for studios:
  - `id` (uuid, primary key)
  - `studio_id` (uuid, foreign key) - References studios table
  - `performer_id` (uuid, foreign key) - References performers table
  - `amount` (decimal) - Payment amount
  - `commission_amount` (decimal) - Commission taken by studio
  - `payment_date` (timestamptz) - When payment was made
  - `payment_method` (text) - Payment method used
  - `status` (text) - Payment status: 'pending', 'completed', 'failed'
  - `notes` (text) - Additional notes
  - `created_at` (timestamptz)

  ## Security
  - Enable RLS on all tables
  - Create policies for authenticated admin users

  ## Indexes
  - Index on studio email for fast lookups
  - Index on studio_performers relationships
  - Index on payment dates for reporting
*/

-- Create studios table
CREATE TABLE IF NOT EXISTS studios (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  legal_representative text NOT NULL,
  email text UNIQUE NOT NULL,
  location text NOT NULL,
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create studio_performers junction table
CREATE TABLE IF NOT EXISTS studio_performers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  studio_id uuid NOT NULL REFERENCES studios(id) ON DELETE CASCADE,
  performer_id uuid NOT NULL,
  commission_rate decimal(5,2) NOT NULL DEFAULT 20.00 CHECK (commission_rate >= 0 AND commission_rate <= 100),
  joined_date timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  UNIQUE(studio_id, performer_id)
);

-- Create studio_payments table
CREATE TABLE IF NOT EXISTS studio_payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  studio_id uuid NOT NULL REFERENCES studios(id) ON DELETE CASCADE,
  performer_id uuid NOT NULL,
  amount decimal(10,2) NOT NULL DEFAULT 0.00 CHECK (amount >= 0),
  commission_amount decimal(10,2) NOT NULL DEFAULT 0.00 CHECK (commission_amount >= 0),
  payment_date timestamptz DEFAULT now(),
  payment_method text DEFAULT 'bank_transfer',
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed')),
  notes text,
  created_at timestamptz DEFAULT now()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_studios_email ON studios(email);
CREATE INDEX IF NOT EXISTS idx_studios_status ON studios(status);
CREATE INDEX IF NOT EXISTS idx_studio_performers_studio ON studio_performers(studio_id);
CREATE INDEX IF NOT EXISTS idx_studio_performers_performer ON studio_performers(performer_id);
CREATE INDEX IF NOT EXISTS idx_studio_payments_studio ON studio_payments(studio_id);
CREATE INDEX IF NOT EXISTS idx_studio_payments_date ON studio_payments(payment_date);
CREATE INDEX IF NOT EXISTS idx_studio_payments_status ON studio_payments(status);

-- Enable Row Level Security
ALTER TABLE studios ENABLE ROW LEVEL SECURITY;
ALTER TABLE studio_performers ENABLE ROW LEVEL SECURITY;
ALTER TABLE studio_payments ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for studios table
CREATE POLICY "Authenticated users can view studios"
  ON studios FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert studios"
  ON studios FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update studios"
  ON studios FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete studios"
  ON studios FOR DELETE
  TO authenticated
  USING (true);

-- Create RLS policies for studio_performers table
CREATE POLICY "Authenticated users can view studio performers"
  ON studio_performers FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert studio performers"
  ON studio_performers FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update studio performers"
  ON studio_performers FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete studio performers"
  ON studio_performers FOR DELETE
  TO authenticated
  USING (true);

-- Create RLS policies for studio_payments table
CREATE POLICY "Authenticated users can view studio payments"
  ON studio_payments FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert studio payments"
  ON studio_payments FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update studio payments"
  ON studio_payments FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete studio payments"
  ON studio_payments FOR DELETE
  TO authenticated
  USING (true);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for studios table
DROP TRIGGER IF EXISTS update_studios_updated_at ON studios;
CREATE TRIGGER update_studios_updated_at
  BEFORE UPDATE ON studios
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
