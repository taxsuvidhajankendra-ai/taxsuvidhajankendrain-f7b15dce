
-- Add booking_date and status columns to submissions table
ALTER TABLE public.submissions 
ADD COLUMN IF NOT EXISTS booking_date date,
ADD COLUMN IF NOT EXISTS status text NOT NULL DEFAULT 'New';
