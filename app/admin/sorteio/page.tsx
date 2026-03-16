import { createClient } from '@/lib/supabase/server'
import { RafflePanel } from '@/components/admin/raffle-panel'

export const metadata = {
  title: 'Sorteio | Admin Cafe com Proposito',
}

export default async function AdminSorteioPage() {
  const supabase = await createClient()

  const [{ data: events }, { data: registrations }] = await Promise.all([
    supabase
      .from('events')
      .select('id, title, date')
      .order('date', { ascending: false }),
    supabase
      .from('registrations')
      .select('id, name, email, event_id, status')
      .eq('status', 'confirmed')
      .order('created_at', { ascending: false }),
  ])

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="font-serif text-3xl font-bold text-foreground">Sorteio</h1>
        <p className="max-w-2xl text-muted-foreground">
          Escolha entre sortear uma participante inscrita em um evento ou gerar um numero aleatorio com animacao.
        </p>
      </div>

      <RafflePanel
        events={events || []}
        registrations={(registrations || []).map((registration) => ({
          id: registration.id,
          name: registration.name,
          email: registration.email,
          event_id: registration.event_id,
        }))}
      />
    </div>
  )
}
