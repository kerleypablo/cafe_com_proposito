ALTER TABLE events
  ADD COLUMN IF NOT EXISTS is_paid BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS payment_amount NUMERIC(10,2),
  ADD COLUMN IF NOT EXISTS payment_pix_key TEXT,
  ADD COLUMN IF NOT EXISTS payment_instructions TEXT,
  ADD COLUMN IF NOT EXISTS payment_qr_code_url TEXT,
  ADD COLUMN IF NOT EXISTS payment_whatsapp TEXT;

ALTER TABLE registrations
  ADD COLUMN IF NOT EXISTS payment_confirmed BOOLEAN,
  ADD COLUMN IF NOT EXISTS payment_confirmed_at TIMESTAMPTZ;

UPDATE registrations
SET
  payment_confirmed = false,
  payment_confirmed_at = NULL
WHERE payment_confirmed IS NULL
  AND event_id IN (
    SELECT id
    FROM events
    WHERE is_paid = true
  );

ALTER TABLE events
  DROP CONSTRAINT IF EXISTS events_payment_amount_non_negative;

ALTER TABLE events
  ADD CONSTRAINT events_payment_amount_non_negative
  CHECK (payment_amount IS NULL OR payment_amount >= 0);
