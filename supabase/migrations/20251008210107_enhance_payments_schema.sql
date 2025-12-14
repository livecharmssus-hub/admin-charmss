/*
  # Enhance Payment Tracking Schema

  ## Overview
  This migration enhances the payment tracking system to support:
  - Detailed commission tracking (minimum 50%)
  - Studio-level and model-level payment management
  - Payment transfer history
  - Payment method configurations

  ## New Tables

  ### `payment_transfers`
  Tracks all payment transfers to studios and models:
  - `id` (uuid, primary key)
  - `transfer_type` (text) - 'studio' or 'model'
  - `studio_id` (uuid, nullable) - Reference to studio if studio payment
  - `performer_id` (uuid) - Reference to performer
  - `amount` (decimal) - Total transfer amount
  - `commission_amount` (decimal) - Commission portion
  - `net_amount` (decimal) - Net amount to recipient
  - `payment_method` (text) - Transfer method used
  - `status` (text) - 'pending', 'processing', 'completed', 'failed'
  - `initiated_by` (uuid) - Admin who initiated transfer
  - `transfer_date` (timestamptz) - When transfer was made
  - `completed_date` (timestamptz) - When transfer completed
  - `notes` (text) - Additional notes
  - `created_at` (timestamptz)

  ### `pending_payments`
  Tracks payments that need to be processed:
  - `id` (uuid, primary key)
  - `payment_type` (text) - 'studio' or 'model'
  - `studio_id` (uuid, nullable)
  - `performer_id` (uuid)
  - `amount_due` (decimal) - Amount pending payment
  - `commission_rate` (decimal) - Commission percentage (50-100)
  - `due_date` (timestamptz) - When payment is due
  - `priority` (text) - 'low', 'medium', 'high', 'urgent'
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ## Table Updates

  ### Update `studio_performers` commission validation
  - Ensure commission_rate minimum is 50%

  ## Security
  - Enable RLS on all new tables
  - Create policies for authenticated admin users

  ## Indexes
  - Index on transfer status and dates
  - Index on pending payment due dates
*/

-- Create payment_transfers table
CREATE TABLE IF NOT EXISTS payment_transfers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  transfer_type text NOT NULL CHECK (transfer_type IN ('studio', 'model')),
  studio_id uuid REFERENCES studios(id) ON DELETE SET NULL,
  performer_id uuid NOT NULL,
  amount decimal(10,2) NOT NULL DEFAULT 0.00 CHECK (amount >= 0),
  commission_amount decimal(10,2) NOT NULL DEFAULT 0.00 CHECK (commission_amount >= 0),
  net_amount decimal(10,2) NOT NULL DEFAULT 0.00 CHECK (net_amount >= 0),
  payment_method text NOT NULL DEFAULT 'bank_transfer',
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
  initiated_by uuid,
  transfer_date timestamptz DEFAULT now(),
  completed_date timestamptz,
  notes text,
  created_at timestamptz DEFAULT now()
);

-- Create pending_payments table
CREATE TABLE IF NOT EXISTS pending_payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  payment_type text NOT NULL CHECK (payment_type IN ('studio', 'model')),
  studio_id uuid REFERENCES studios(id) ON DELETE CASCADE,
  performer_id uuid NOT NULL,
  amount_due decimal(10,2) NOT NULL DEFAULT 0.00 CHECK (amount_due >= 0),
  commission_rate decimal(5,2) NOT NULL DEFAULT 50.00 CHECK (commission_rate >= 50.00 AND commission_rate <= 100.00),
  due_date timestamptz DEFAULT (now() + interval '30 days'),
  priority text NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Update studio_performers commission constraint to minimum 50%
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'studio_performers_commission_rate_check'
  ) THEN
    ALTER TABLE studio_performers DROP CONSTRAINT studio_performers_commission_rate_check;
  END IF;
END $$;

ALTER TABLE studio_performers 
ADD CONSTRAINT studio_performers_commission_rate_check 
CHECK (commission_rate >= 50.00 AND commission_rate <= 100.00);

-- Update existing commission rates to minimum 50% if below
UPDATE studio_performers 
SET commission_rate = 50.00 
WHERE commission_rate < 50.00;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_payment_transfers_status ON payment_transfers(status);
CREATE INDEX IF NOT EXISTS idx_payment_transfers_type ON payment_transfers(transfer_type);
CREATE INDEX IF NOT EXISTS idx_payment_transfers_date ON payment_transfers(transfer_date);
CREATE INDEX IF NOT EXISTS idx_payment_transfers_studio ON payment_transfers(studio_id);
CREATE INDEX IF NOT EXISTS idx_payment_transfers_performer ON payment_transfers(performer_id);

CREATE INDEX IF NOT EXISTS idx_pending_payments_type ON pending_payments(payment_type);
CREATE INDEX IF NOT EXISTS idx_pending_payments_due_date ON pending_payments(due_date);
CREATE INDEX IF NOT EXISTS idx_pending_payments_studio ON pending_payments(studio_id);
CREATE INDEX IF NOT EXISTS idx_pending_payments_performer ON pending_payments(performer_id);
CREATE INDEX IF NOT EXISTS idx_pending_payments_priority ON pending_payments(priority);

-- Enable Row Level Security
ALTER TABLE payment_transfers ENABLE ROW LEVEL SECURITY;
ALTER TABLE pending_payments ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for payment_transfers
CREATE POLICY "Authenticated users can view payment transfers"
  ON payment_transfers FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert payment transfers"
  ON payment_transfers FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update payment transfers"
  ON payment_transfers FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create RLS policies for pending_payments
CREATE POLICY "Authenticated users can view pending payments"
  ON pending_payments FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert pending payments"
  ON pending_payments FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update pending payments"
  ON pending_payments FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete pending payments"
  ON pending_payments FOR DELETE
  TO authenticated
  USING (true);

-- Create trigger for pending_payments updated_at
DROP TRIGGER IF EXISTS update_pending_payments_updated_at ON pending_payments;
CREATE TRIGGER update_pending_payments_updated_at
  BEFORE UPDATE ON pending_payments
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
