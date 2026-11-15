-- Each outcome excludes this registration from further draws for the same event.
CREATE TABLE IF NOT EXISTS public.raffle_results (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  registration_id uuid NOT NULL REFERENCES public.registrations(id) ON DELETE CASCADE,
  event_id uuid NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  participant_id uuid REFERENCES public.participants(id) ON DELETE SET NULL,
  outcome text NOT NULL CHECK (outcome IN ('won', 'absent')),
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (registration_id)
);

CREATE UNIQUE INDEX IF NOT EXISTS raffle_results_event_participant_unique
  ON public.raffle_results(event_id, participant_id) WHERE participant_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS raffle_results_participant_idx ON public.raffle_results(participant_id);

ALTER TABLE public.raffle_results ENABLE ROW LEVEL SECURITY;
GRANT SELECT, INSERT ON public.raffle_results TO authenticated;
CREATE POLICY "Authenticated admins can read raffle results" ON public.raffle_results
  FOR SELECT TO authenticated USING (coalesce((auth.jwt()->>'is_anonymous')::boolean, false) = false);
CREATE POLICY "Authenticated admins can insert raffle results" ON public.raffle_results
  FOR INSERT TO authenticated WITH CHECK (
    coalesce((auth.jwt()->>'is_anonymous')::boolean, false) = false
    AND EXISTS (SELECT 1 FROM public.registrations r WHERE r.id = raffle_results.registration_id
      AND r.event_id = raffle_results.event_id AND r.participant_id IS NOT DISTINCT FROM raffle_results.participant_id
      AND r.status = 'confirmed')
  );
