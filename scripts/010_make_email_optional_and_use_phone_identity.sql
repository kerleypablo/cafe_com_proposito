ALTER TABLE participants
  ALTER COLUMN email DROP NOT NULL;

ALTER TABLE registrations
  ALTER COLUMN email DROP NOT NULL;

DROP INDEX IF EXISTS idx_participants_phone;
CREATE UNIQUE INDEX IF NOT EXISTS idx_participants_phone_unique
  ON participants(phone)
  WHERE phone IS NOT NULL;

DROP INDEX IF EXISTS idx_registrations_unique_event_email;
CREATE UNIQUE INDEX IF NOT EXISTS idx_registrations_unique_event_email
  ON registrations(event_id, email)
  WHERE email IS NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS idx_registrations_unique_event_phone
  ON registrations(event_id, phone)
  WHERE phone IS NOT NULL;
