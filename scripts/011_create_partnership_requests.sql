CREATE TABLE IF NOT EXISTS partnership_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  company_name TEXT NOT NULL,
  contact_phone TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE partnership_requests ENABLE ROW LEVEL SECURITY;

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

DROP POLICY IF EXISTS "Admins can do everything on partnership requests" ON partnership_requests;
CREATE POLICY "Admins can do everything on partnership requests" ON partnership_requests
  FOR ALL USING (auth.role() = 'authenticated');
