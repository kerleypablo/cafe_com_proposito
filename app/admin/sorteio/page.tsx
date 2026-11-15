import { createClient } from '@/lib/supabase/server'
import { RafflePanel } from '@/components/admin/raffle-panel'

export const metadata = {
  title: 'Sorteio | Admin Café com Propósito',
}

export default async function AdminSorteioPage() {
  const supabase = await createClient()

  async function loadAll(table: 'registrations' | 'raffle_results') {
    const rows: Record<string, any>[] = []
    const pageSize = 500
    for (let offset = 0; ; offset += pageSize) {
      const query = table === 'registrations'
        ? supabase.from(table).select('id, name, email, event_id, participant_id, status').eq('status', 'confirmed')
        : supabase.from(table).select('id, registration_id, event_id, participant_id, outcome, active, created_at, registrations(name)')
      const { data, error } = await query.order('id').range(offset, offset + pageSize - 1)
      if (error) return { data: [], error }
      rows.push(...(data || []))
      if (!data || data.length < pageSize) return { data: rows, error: null }
    }
  }

  const [{ data: events }, { data: registrations, error: registrationsError }, { data: results, error: resultsError }] = await Promise.all([
    supabase
      .from('events')
      .select('id, title, date')
      .order('date', { ascending: false }),
    loadAll('registrations'),
    loadAll('raffle_results'),
  ])

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="font-serif text-3xl font-bold text-primary">Sorteio</h1>
        <p className="max-w-2xl text-muted-foreground">
          Escolha entre sortear uma participante inscrita em um evento ou gerar um número aleatório com animação.
        </p>
      </div>

      <RafflePanel
        events={events || []}
        registrations={(registrations || []).map((registration) => ({
          id: registration.id,
          name: registration.name,
          email: registration.email || null,
          event_id: registration.event_id,
          participant_id: registration.participant_id,
        }))}
        results={results.map((result) => ({
          id: result.id,
          registration_id: result.registration_id,
          event_id: result.event_id,
          participant_id: result.participant_id,
          outcome: result.outcome,
          active: result.active,
          name: (Array.isArray(result.registrations) ? result.registrations[0] : result.registrations)?.name || 'Participante',
          created_at: result.created_at,
        }))}
        historyError={!!resultsError || !!registrationsError}
      />
    </div>
  )
}
