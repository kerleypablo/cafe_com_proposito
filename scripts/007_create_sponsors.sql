CREATE TABLE IF NOT EXISTS sponsors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  image_url TEXT NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE sponsors ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view active sponsors" ON sponsors;
CREATE POLICY "Anyone can view active sponsors" ON sponsors
  FOR SELECT USING (is_active = true);

DROP POLICY IF EXISTS "Admins can do everything on sponsors" ON sponsors;
CREATE POLICY "Admins can do everything on sponsors" ON sponsors
  FOR ALL USING (auth.role() = 'authenticated');
