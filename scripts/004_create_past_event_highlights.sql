CREATE TABLE IF NOT EXISTS past_event_highlights (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  subtitle TEXT,
  event_date DATE,
  image_url TEXT NOT NULL,
  image_urls TEXT[] NOT NULL DEFAULT '{}',
  description TEXT NOT NULL,
  photos_link TEXT,
  is_published BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_past_event_highlights_date
  ON past_event_highlights(event_date DESC);

ALTER TABLE past_event_highlights ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view published past highlights" ON past_event_highlights;
CREATE POLICY "Anyone can view published past highlights" ON past_event_highlights
  FOR SELECT USING (is_published = true);

DROP POLICY IF EXISTS "Admins can do everything on past highlights" ON past_event_highlights;
CREATE POLICY "Admins can do everything on past highlights" ON past_event_highlights
  FOR ALL USING (auth.role() = 'authenticated');

UPDATE past_event_highlights
SET image_urls = ARRAY[image_url]
WHERE image_url IS NOT NULL
  AND (image_urls IS NULL OR array_length(image_urls, 1) IS NULL);
