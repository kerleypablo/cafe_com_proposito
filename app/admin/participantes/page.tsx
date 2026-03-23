import { createClient } from '@/lib/supabase/server'
import { Card, CardContent } from '@/components/ui/card'
import { Cake, ChevronRight, MessageCircle } from 'lucide-react'
import Link from 'next/link'
import { buildWhatsappLink } from '@/lib/whatsapp'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { ParticipantActions } from '@/components/admin/participant-actions'

export const metadata = {
  title: 'Participantes | Admin Café com Propósito',
}

export default async function AdminParticipantesPage({
  searchParams,
}: {
  searchParams?: Promise<{ nome?: string; evento?: string }>
}) {
  const supabase = await createClient()
  const params = (await searchParams) || {}
  const nameFilter = params.nome?.trim() || ''
  const eventFilter = params.evento?.trim() || ''

  const { data: eventOptions } = await supabase
    .from('events')
    .select('id, title, date')
    .order('date', { ascending: false })

  let query = supabase
    .from('participants')
    .select(`
      *,
      registrations:registrations(
        id,
        event_id,
        status,
        events:event_id(title, date)
      )
    `)
    .order('created_at', { ascending: false })

  if (nameFilter) {
    query = query.ilike('name', `%${nameFilter}%`)
  }

  const { data: participants } = await query
  const today = new Date().toISOString().split('T')[0]
  const filteredParticipants = (participants || []).filter((participant) => {
    if (!eventFilter) return true

    return participant.registrations?.some(
      (registration: { event_id: string; status: string }) =>
        registration.event_id === eventFilter && registration.status === 'confirmed'
    )
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-3xl font-bold text-primary">Participantes</h1>
        <p className="text-muted-foreground">
          Todas as pessoas que já se inscreveram em eventos
        </p>
      </div>

      <Card>
        <CardContent className="p-4">
          <form className="flex flex-col gap-3 sm:flex-row">
            <Input
              type="text"
              name="nome"
              placeholder="Filtrar por nome"
              defaultValue={nameFilter}
              className="h-10"
            />
            <select
              name="evento"
              defaultValue={eventFilter}
              className="h-10 rounded-md border border-input bg-background px-3 text-sm text-foreground"
            >
              <option value="">Filtrar por evento</option>
              {(eventOptions || []).map((event) => (
                <option key={event.id} value={event.id}>
                  {event.title}
                </option>
              ))}
            </select>
            <div className="flex gap-2">
              <Button type="submit" className="rounded-full">
                Filtrar
              </Button>
              {(nameFilter || eventFilter) && (
                <Button asChild type="button" variant="outline" className="rounded-full">
                  <Link href="/admin/participantes">Limpar</Link>
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>

      {filteredParticipants.length > 0 ? (
        <div className="grid gap-3">
          {filteredParticipants.map((participant) => {
            const whatsappLink = buildWhatsappLink(participant.phone)
            const activeRegistrations = participant.registrations?.filter(
              (registration: {
                status: string
                events: { title: string; date: string } | null
              }) => registration.status === 'confirmed' && registration.events?.date >= today
            ) || []

            return (
              <Card key={participant.id}>
                <CardContent className="p-3 sm:p-4">
                  <div className="flex items-start gap-3">
                    <div className="min-w-0 flex-1 space-y-3">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <Link
                            href={`/admin/participantes/${participant.id}`}
                            className="block truncate font-semibold text-foreground transition-colors hover:text-primary"
                          >
                            {participant.name}
                          </Link>
                          {participant.birthday && (
                            <div className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
                              <Cake className="size-4 shrink-0" />
                              <span>
                                {new Date(`${participant.birthday}T00:00:00`).toLocaleDateString('pt-BR', {
                                  day: '2-digit',
                                  month: '2-digit',
                                })}
                              </span>
                            </div>
                          )}
                        </div>

                        <div className="flex items-center gap-2">
                          {whatsappLink && (
                            <Link
                              href={whatsappLink}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex size-9 shrink-0 items-center justify-center rounded-full bg-[#25D366]/10 text-[#25D366] transition-colors hover:bg-[#25D366]/20"
                              aria-label={`Conversar com ${participant.name} no WhatsApp`}
                            >
                              <MessageCircle className="size-4" />
                            </Link>
                          )}
                          <ParticipantActions
                            participantId={participant.id}
                            participantName={participant.name}
                          />
                          <Link
                            href={`/admin/participantes/${participant.id}`}
                            className="inline-flex size-9 shrink-0 items-center justify-center rounded-full bg-secondary text-secondary-foreground transition-colors hover:bg-secondary/80"
                            aria-label={`Ver detalhes de ${participant.name}`}
                          >
                            <ChevronRight className="size-4" />
                          </Link>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {activeRegistrations.length > 0 ? (
                          activeRegistrations.slice(0, 3).map((reg: {
                            id: string
                            status: string
                            event_id: string
                            events: { title: string; date: string } | null
                          }) => (
                            <span
                              key={reg.id}
                              className="rounded-full bg-secondary px-2 py-1 text-[11px] text-secondary-foreground"
                            >
                              {reg.events?.title}
                            </span>
                          ))
                        ) : (
                          <span className="rounded-full bg-muted px-2 py-1 text-[11px] text-muted-foreground">
                            Sem evento futuro
                          </span>
                        )}
                      </div>
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
              {nameFilter || eventFilter
                ? 'Nenhum participante encontrado com esses filtros.'
                : 'Nenhum participante cadastrado ainda.'}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
