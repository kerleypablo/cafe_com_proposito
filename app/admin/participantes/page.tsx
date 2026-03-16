import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Card, CardContent } from '@/components/ui/card'
import { Mail, Phone, Calendar } from 'lucide-react'

export const metadata = {
  title: 'Participantes | Admin Cafe com Proposito',
}

export default async function AdminParticipantesPage() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect('/admin/login')
  }
  
  const { data: participants } = await supabase
    .from('participants')
    .select(`
      *,
      registrations:registrations(
        id,
        status,
        events:event_id(title, date)
      )
    `)
    .order('created_at', { ascending: false })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-3xl font-bold text-foreground">Participantes</h1>
        <p className="text-muted-foreground">
          Todas as pessoas que ja se inscreveram em eventos
        </p>
      </div>

      {participants && participants.length > 0 ? (
        <div className="grid gap-4">
          {participants.map((participant) => {
            const confirmedEvents = participant.registrations?.filter(
              (r: { status: string }) => r.status === 'confirmed'
            ).length || 0

            return (
              <Card key={participant.id}>
                <CardContent className="p-4">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                    {/* Participant Info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-foreground truncate">
                        {participant.name}
                      </h3>
                      
                      <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Mail className="size-4" />
                          <span className="truncate">{participant.email}</span>
                        </div>
                        {participant.phone && (
                          <div className="flex items-center gap-1">
                            <Phone className="size-4" />
                            <span>{participant.phone}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-1">
                          <Calendar className="size-4" />
                          <span>{confirmedEvents} eventos confirmados</span>
                        </div>
                      </div>
                    </div>

                    {/* Event Tags */}
                    {participant.registrations && participant.registrations.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {participant.registrations.slice(0, 3).map((reg: { 
                          id: string
                          status: string
                          events: { title: string; date: string } | null 
                        }) => (
                          <span 
                            key={reg.id}
                            className="text-xs px-2 py-1 rounded-full bg-secondary text-secondary-foreground"
                          >
                            {reg.events?.title}
                          </span>
                        ))}
                        {participant.registrations.length > 3 && (
                          <span className="text-xs px-2 py-1 rounded-full bg-muted text-muted-foreground">
                            +{participant.registrations.length - 3}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      ) : (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">
              Nenhum participante cadastrado ainda.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
