-- analyses table stores all SEO analysis results
CREATE TABLE analyses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title VARCHAR(500) NOT NULL,
  keyword VARCHAR(200) NOT NULL,
  content_length INT NOT NULL,
  total_score INT NOT NULL,
  grade VARCHAR(1) NOT NULL,
  result JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for user's history sorted by date
CREATE INDEX idx_analyses_user ON analyses(user_id, created_at DESC);

-- Enable Row Level Security
ALTER TABLE analyses ENABLE ROW LEVEL SECURITY;

-- Users can only see their own analyses
CREATE POLICY "Users can view own analyses"
  ON analyses FOR SELECT
  USING (auth.uid() = user_id);

-- Users can only insert their own analyses
CREATE POLICY "Users can insert own analyses"
  ON analyses FOR INSERT
  WITH CHECK (auth.uid() = user_id);
