-- Create challenge_completions table
CREATE TABLE IF NOT EXISTS challenge_completions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  company TEXT NOT NULL,
  score INTEGER NOT NULL,
  questions_completed INTEGER NOT NULL,
  time_taken INTEGER NOT NULL, -- in seconds
  hints_used INTEGER NOT NULL DEFAULT 0,
  lives_remaining INTEGER NOT NULL DEFAULT 0,
  failed BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, company, created_at)
);

-- Enable RLS
ALTER TABLE challenge_completions ENABLE ROW LEVEL SECURITY;

-- Policy: Users can read their own challenge completions
CREATE POLICY "Users can view their own challenge completions"
  ON challenge_completions
  FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: Users can insert their own challenge completions
CREATE POLICY "Users can insert their own challenge completions"
  ON challenge_completions
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_challenge_completions_user_id ON challenge_completions(user_id);
CREATE INDEX IF NOT EXISTS idx_challenge_completions_company ON challenge_completions(company);
