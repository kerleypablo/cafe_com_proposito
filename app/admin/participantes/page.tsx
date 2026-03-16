import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Card, CardContent } from '@/components/ui/card'
import { Mail, Phone, Calendar, Cake, BadgeCheck, MessageCircle } from 'lucide-react'
import Link from 'next/link'
import { buildWhatsappLink } from '@/lib/whatsapp'

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
            const whatsappLink = buildWhatsappLink(participant.phone)

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
                        {participant.birthday && (
                          <div className="flex items-center gap-1">
                            <Cake className="size-4" />
                            <span>
                              {new Date(`${participant.birthday}T00:00:00`).toLocaleDateString('pt-BR', {
                                day: '2-digit',
                                month: '2-digit',
                              })}
                            </span>
                          </div>
                        )}
                        <div className="flex items-center gap-1">
                          <Calendar className="size-4" />
                          <span>{confirmedEvents} eventos confirmados</span>
                        </div>
                      </div>

                      {participant.save_data && (
                        <div className="mt-3 flex flex-wrap gap-2">
                          <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-1 text-xs text-primary">
                            <BadgeCheck className="size-3" />
                            Dados salvos
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Event Tags */}
                    <div className="flex items-center gap-3">
                      {whatsappLink && (
                        <Link
                          href={whatsappLink}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex size-10 items-center justify-center rounded-full bg-[#25D366]/10 text-[#25D366] transition-colors hover:bg-[#25D366]/20"
                          aria-label={`Conversar com ${participant.name} no WhatsApp`}
                        >
                          <MessageCircle className="size-5" />
                        </Link>
                      )}

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
