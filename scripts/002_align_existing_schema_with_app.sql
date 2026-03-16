-- Align an existing Supabase schema with what the Next.js app currently expects.

-- EVENTS
ALTER TABLE events RENAME COLUMN event_date TO date;
ALTER TABLE events RENAME COLUMN event_time TO time;

ALTER TABLE events
  ADD COLUMN IF NOT EXISTS status TEXT;

UPDATE events
SET status = CASE
  WHEN is_published = true THEN 'published'
  ELSE 'draft'
END
WHERE status IS NULL;

ALTER TABLE events
  ALTER COLUMN status SET DEFAULT 'draft',
  ALTER COLUMN status SET NOT NULL;

DROP INDEX IF EXISTS idx_events_date;
CREATE INDEX IF NOT EXISTS idx_events_date ON events(date);

-- PARTICIPANTS
ALTER TABLE participants
  ALTER COLUMN phone DROP NOT NULL;

ALTER TABLE participants
  ALTER COLUMN email SET NOT NULL;

ALTER TABLE participants
  ADD COLUMN IF NOT EXISTS birthday DATE,
  ADD COLUMN IF NOT EXISTS save_data BOOLEAN NOT NULL DEFAULT false;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'participants_email_key'
  ) THEN
    ALTER TABLE participants
      ADD CONSTRAINT participants_email_key UNIQUE (email);
  END IF;
END $$;

DROP INDEX IF EXISTS idx_participants_phone;
CREATE INDEX IF NOT EXISTS idx_participants_email ON participants(email);

-- REGISTRATIONS
ALTER TABLE registrations
  ALTER COLUMN phone DROP NOT NULL;

ALTER TABLE registrations
  ALTER COLUMN email SET NOT NULL;

ALTER TABLE registrations
  ADD COLUMN IF NOT EXISTS status TEXT;

UPDATE registrations
SET status = 'confirmed'
WHERE status IS NULL;

ALTER TABLE registrations
  ALTER COLUMN status SET DEFAULT 'confirmed',
  ALTER COLUMN status SET NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS idx_registrations_unique_event_email
  ON registrations(event_id, email);

-- SUGGESTIONS
ALTER TABLE suggestions
  ALTER COLUMN name DROP NOT NULL;

ALTER TABLE suggestions RENAME COLUMN message TO suggestion;

ALTER TABLE suggestions
  ADD COLUMN IF NOT EXISTS status TEXT;

UPDATE suggestions
SET status = CASE
  WHEN is_read = true THEN 'approved'
  ELSE 'pending'
END
WHERE status IS NULL;

ALTER TABLE suggestions
  ALTER COLUMN status SET DEFAULT 'pending',
  ALTER COLUMN status SET NOT NULL;

-- Replace the old public-read policy with the app's current published-status model.
DROP POLICY IF EXISTS "Anyone can view published events" ON events;
CREATE POLICY "Anyone can view published events" ON events
  FOR SELECT USING (status = 'published');

DROP POLICY IF EXISTS "Anyone can update participants" ON participants;
CREATE POLICY "Anyone can update participants" ON participants
  FOR UPDATE USING (true) WITH CHECK (true);
