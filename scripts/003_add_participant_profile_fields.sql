ALTER TABLE participants
  ADD COLUMN IF NOT EXISTS birthday DATE,
  ADD COLUMN IF NOT EXISTS save_data BOOLEAN NOT NULL DEFAULT false;

ALTER TABLE participants
  ALTER COLUMN phone DROP NOT NULL;

DROP POLICY IF EXISTS "Anyone can update participants" ON participants;
CREATE POLICY "Anyone can update participants" ON participants
  FOR UPDATE USING (true) WITH CHECK (true);

CREATE UNIQUE INDEX IF NOT EXISTS idx_registrations_unique_event_email
  ON registrations(event_id, email);
