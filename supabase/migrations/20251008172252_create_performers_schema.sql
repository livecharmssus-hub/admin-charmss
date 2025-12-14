/*
  # Performers Management Schema

  ## Overview
  This migration creates the database schema for managing performers in the platform.
  
  ## New Tables
  
  ### 1. `performers` - Main table for performer data
    - `id` (uuid, primary key) - Unique identifier
    - `full_name` (text) - Performer's full name
    - `stage_name` (text) - Performer's stage/display name
    - `email` (text, unique) - Contact email
    - `phone` (text) - Contact phone number
    - `avatar_url` (text) - Profile picture URL
    - `bio` (text) - Performer biography
    - `status` (text) - Active/inactive status
    - `rating` (numeric) - Performance rating (0-5)
    - `total_shows` (integer) - Total number of shows performed
    - `joined_date` (timestamptz) - Date performer joined platform
    - `last_active` (timestamptz) - Last activity timestamp
    - `country` (text) - Performer's country
    - `languages` (text[]) - Languages spoken
    - `categories` (text[]) - Performance categories/specialties
    - `hourly_rate` (numeric) - Hourly rate for services
    - `created_at` (timestamptz) - Record creation timestamp
    - `updated_at` (timestamptz) - Record update timestamp

  ### 2. `performer_assets` - Media assets for performers
    - `id` (uuid, primary key) - Unique identifier
    - `performer_id` (uuid, foreign key) - Reference to performer
    - `asset_type` (text) - Type: 'photo' or 'video'
    - `asset_url` (text) - URL to the asset file
    - `thumbnail_url` (text) - Thumbnail for videos
    - `title` (text) - Asset title/description
    - `is_featured` (boolean) - Featured asset flag
    - `upload_date` (timestamptz) - Upload timestamp
    - `file_size` (bigint) - File size in bytes
    - `created_at` (timestamptz) - Record creation timestamp

  ## Security
  
  ### Row Level Security (RLS)
  - Enable RLS on all tables
  - Authenticated users (admins) can read all performer data
  - Authenticated users (admins) can create, update, and delete performers
  - Authenticated users (admins) can manage performer assets
  
  ## Notes
  - All timestamps use timezone-aware format
  - Status can be 'active', 'inactive', 'pending', 'suspended'
  - Asset types are limited to 'photo' and 'video'
  - Indexes added for performance on frequently queried fields
*/

-- Create performers table
CREATE TABLE IF NOT EXISTS performers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text NOT NULL,
  stage_name text NOT NULL,
  email text UNIQUE NOT NULL,
  phone text,
  avatar_url text,
  bio text,
  status text DEFAULT 'pending' CHECK (status IN ('active', 'inactive', 'pending', 'suspended')),
  rating numeric DEFAULT 0 CHECK (rating >= 0 AND rating <= 5),
  total_shows integer DEFAULT 0,
  joined_date timestamptz DEFAULT now(),
  last_active timestamptz DEFAULT now(),
  country text,
  languages text[] DEFAULT ARRAY[]::text[],
  categories text[] DEFAULT ARRAY[]::text[],
  hourly_rate numeric DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create performer_assets table
CREATE TABLE IF NOT EXISTS performer_assets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  performer_id uuid NOT NULL REFERENCES performers(id) ON DELETE CASCADE,
  asset_type text NOT NULL CHECK (asset_type IN ('photo', 'video')),
  asset_url text NOT NULL,
  thumbnail_url text,
  title text,
  is_featured boolean DEFAULT false,
  upload_date timestamptz DEFAULT now(),
  file_size bigint,
  created_at timestamptz DEFAULT now()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_performers_status ON performers(status);
CREATE INDEX IF NOT EXISTS idx_performers_email ON performers(email);
CREATE INDEX IF NOT EXISTS idx_performers_joined_date ON performers(joined_date DESC);
CREATE INDEX IF NOT EXISTS idx_performer_assets_performer_id ON performer_assets(performer_id);
CREATE INDEX IF NOT EXISTS idx_performer_assets_type ON performer_assets(asset_type);

-- Enable Row Level Security
ALTER TABLE performers ENABLE ROW LEVEL SECURITY;
ALTER TABLE performer_assets ENABLE ROW LEVEL SECURITY;

-- Performers policies
CREATE POLICY "Admins can view all performers"
  ON performers FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can insert performers"
  ON performers FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Admins can update performers"
  ON performers FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Admins can delete performers"
  ON performers FOR DELETE
  TO authenticated
  USING (true);

-- Performer assets policies
CREATE POLICY "Admins can view all performer assets"
  ON performer_assets FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can insert performer assets"
  ON performer_assets FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Admins can update performer assets"
  ON performer_assets FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Admins can delete performer assets"
  ON performer_assets FOR DELETE
  TO authenticated
  USING (true);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update updated_at
CREATE TRIGGER update_performers_updated_at
  BEFORE UPDATE ON performers
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Insert sample data for testing
INSERT INTO performers (full_name, stage_name, email, phone, avatar_url, bio, status, rating, total_shows, country, languages, categories, hourly_rate)
VALUES 
  ('María González', 'Maria Star', 'maria@example.com', '+1234567890', 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=200', 'Experienced performer with 5 years in the industry', 'active', 4.8, 250, 'Spain', ARRAY['Spanish', 'English'], ARRAY['Dance', 'Music'], 50),
  ('Sofia Rodriguez', 'Sofia Dreams', 'sofia@example.com', '+1234567891', 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=200', 'Creative artist specializing in visual performances', 'active', 4.6, 180, 'Mexico', ARRAY['Spanish', 'English'], ARRAY['Art', 'Performance'], 45),
  ('Isabella Martinez', 'Bella Charm', 'isabella@example.com', '+1234567892', 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=200', 'Versatile performer with international experience', 'active', 4.9, 320, 'Colombia', ARRAY['Spanish', 'English', 'Portuguese'], ARRAY['Dance', 'Music', 'Theater'], 60),
  ('Ana Silva', 'Ana Luz', 'ana@example.com', '+1234567893', 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=200', 'New talent with fresh perspectives', 'pending', 4.2, 45, 'Argentina', ARRAY['Spanish'], ARRAY['Dance'], 35),
  ('Lucia Fernandez', 'Lucia Fire', 'lucia@example.com', '+1234567894', 'https://images.pexels.com/photos/1181690/pexels-photo-1181690.jpeg?auto=compress&cs=tinysrgb&w=200', 'Premium performer with exclusive content', 'inactive', 4.7, 210, 'Chile', ARRAY['Spanish', 'English'], ARRAY['Music', 'Art'], 55);
