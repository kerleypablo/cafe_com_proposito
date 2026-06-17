ALTER TABLE registrations
  ADD COLUMN IF NOT EXISTS attended BOOLEAN NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS attended_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS attendance_status TEXT NOT NULL DEFAULT 'present';

UPDATE registrations
SET
  attendance_status = 'present',
  attended = true
WHERE attendance_status IS NULL
   OR attendance_status NOT IN ('present', 'absent')
   OR attendance_status = 'pending';

ALTER TABLE registrations
  DROP CONSTRAINT IF EXISTS registrations_attendance_status_check;

ALTER TABLE registrations
  ADD CONSTRAINT registrations_attendance_status_check
  CHECK (attendance_status IN ('pending', 'present', 'absent'));

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
