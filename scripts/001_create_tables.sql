-- Café com Propósito Database Schema
-- Events table
CREATE TABLE IF NOT EXISTS events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  date DATE NOT NULL,
  time TIME NOT NULL,
  location TEXT NOT NULL,
  max_participants INTEGER,
  status TEXT NOT NULL DEFAULT 'draft',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Participants table (for saved contact info)
CREATE TABLE IF NOT EXISTS participants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  phone TEXT,
  email TEXT NOT NULL UNIQUE,
  birthday DATE,
  save_data BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Registrations table (links participants to events)
CREATE TABLE IF NOT EXISTS registrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  participant_id UUID REFERENCES participants(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  phone TEXT,
  email TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'confirmed',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Suggestions/messages table
CREATE TABLE IF NOT EXISTS suggestions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT,
  suggestion TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_events_date ON events(date);
CREATE INDEX IF NOT EXISTS idx_registrations_event ON registrations(event_id);
CREATE INDEX IF NOT EXISTS idx_participants_email ON participants(email);
CREATE UNIQUE INDEX IF NOT EXISTS idx_registrations_unique_event_email ON registrations(event_id, email);

-- Enable RLS on all tables
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE suggestions ENABLE ROW LEVEL SECURITY;

-- Public read policy for published events (anyone can view)
CREATE POLICY "Anyone can view published events" ON events
  FOR SELECT USING (status = 'published');

-- Public insert policy for registrations (anyone can register)
CREATE POLICY "Anyone can create registrations" ON registrations
  FOR INSERT WITH CHECK (true);

-- Public read policy for registrations (for counting)
CREATE POLICY "Anyone can view registrations" ON registrations
  FOR SELECT USING (true);

-- Public insert policy for participants (anyone can save their data)
CREATE POLICY "Anyone can create participants" ON participants
  FOR INSERT WITH CHECK (true);

-- Public update policy for participants (used to avoid duplicate contacts and enrich profile)
CREATE POLICY "Anyone can update participants" ON participants
  FOR UPDATE USING (true) WITH CHECK (true);

-- Public read policy for participants lookup
CREATE POLICY "Anyone can view participants" ON participants
  FOR SELECT USING (true);

-- Public insert policy for suggestions (anyone can send)
CREATE POLICY "Anyone can create suggestions" ON suggestions
  FOR INSERT WITH CHECK (true);

-- Admin policies (authenticated users)
CREATE POLICY "Admins can do everything on events" ON events
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Admins can do everything on participants" ON participants
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Admins can do everything on registrations" ON registrations
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Admins can do everything on suggestions" ON suggestions
  FOR ALL USING (auth.role() = 'authenticated');
