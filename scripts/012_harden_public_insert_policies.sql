-- Harden public form insert policies without blocking anonymous visitors.
-- These policies keep the public forms usable, but prevent clients from
-- inserting arbitrary statuses or obviously malformed payloads.

ALTER TABLE registrations
  ADD COLUMN IF NOT EXISTS attended BOOLEAN NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS attended_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS attendance_status TEXT NOT NULL DEFAULT 'present';

DROP POLICY IF EXISTS "Anyone can create registrations" ON registrations;
CREATE POLICY "Anyone can create registrations" ON registrations
  FOR INSERT
  WITH CHECK (
    status = 'confirmed'
    AND attended = true
    AND attendance_status = 'present'
    AND event_id IS NOT NULL
    AND name IS NOT NULL
    AND length(btrim(name)) BETWEEN 2 AND 160
    AND phone IS NOT NULL
    AND length(regexp_replace(phone, '\D', '', 'g')) BETWEEN 10 AND 15
    AND (
      email IS NULL
      OR email ~* '^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$'
    )
    AND EXISTS (
      SELECT 1
      FROM events
      WHERE events.id = registrations.event_id
        AND events.is_published = true
    )
  );

DROP POLICY IF EXISTS "Anyone can create suggestions" ON suggestions;
CREATE POLICY "Anyone can create suggestions" ON suggestions
  FOR INSERT
  WITH CHECK (
    status = 'pending'
    AND suggestion IS NOT NULL
    AND length(btrim(suggestion)) BETWEEN 2 AND 3000
    AND (
      name IS NULL
      OR length(btrim(name)) BETWEEN 1 AND 120
    )
  );

DROP POLICY IF EXISTS "Anyone can create partnership requests" ON partnership_requests;
CREATE POLICY "Anyone can create partnership requests" ON partnership_requests
  FOR INSERT
  WITH CHECK (
    status = 'pending'
    AND name IS NOT NULL
    AND length(btrim(name)) BETWEEN 2 AND 160
    AND company_name IS NOT NULL
    AND length(btrim(company_name)) BETWEEN 2 AND 180
    AND contact_phone IS NOT NULL
    AND length(regexp_replace(contact_phone, '\D', '', 'g')) BETWEEN 10 AND 15
  );
