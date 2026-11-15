-- Keep every result for history, but only active results exclude a participant.
ALTER TABLE public.raffle_results
  ADD COLUMN IF NOT EXISTS active boolean NOT NULL DEFAULT true;

ALTER TABLE public.raffle_results DROP CONSTRAINT IF EXISTS raffle_results_registration_id_key;
DROP INDEX IF EXISTS public.raffle_results_event_participant_unique;

CREATE UNIQUE INDEX IF NOT EXISTS raffle_results_active_registration_unique
  ON public.raffle_results(registration_id) WHERE active;
CREATE UNIQUE INDEX IF NOT EXISTS raffle_results_active_event_participant_unique
  ON public.raffle_results(event_id, participant_id) WHERE active AND participant_id IS NOT NULL;

GRANT UPDATE (active) ON public.raffle_results TO authenticated;
CREATE POLICY "Authenticated admins can reset raffle results" ON public.raffle_results
  FOR UPDATE TO authenticated
  USING (coalesce((auth.jwt()->>'is_anonymous')::boolean, false) = false)
  WITH CHECK (coalesce((auth.jwt()->>'is_anonymous')::boolean, false) = false);
