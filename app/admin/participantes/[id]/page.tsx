import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Cake, Mail, MessageCircle, Phone } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { buildWhatsappLink } from '@/lib/whatsapp'

export const metadata = {
  title: 'Detalhes do Participante | Admin Café com Propósito',
}

export default async function AdminParticipanteDetalhePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const supabase = await createClient()
  const { id } = await params
  const { data: participant } = await supabase
    .from('participants')
    .select('id, name, email, phone, birthday, save_data')
    .eq('id', id)
    .maybeSingle()

  if (!participant) {
    notFound()
  }

  const { data: registrations } = await supabase
    .from('registrations')
    .select(`
      id,
      status,
      created_at,
      events:event_id(
        id,
        title,
        date,
        time,
        location
      )
    `)
    .eq('participant_id', id)
    .order('created_at', { ascending: false })

  const whatsappLink = buildWhatsappLink(participant.phone)

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-3">
        <Button asChild variant="outline" className="rounded-full">
          <Link href="/admin/participantes">
            <ArrowLeft className="size-4" />
            Voltar
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="font-serif text-2xl">{participant.name}</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 text-sm text-muted-foreground sm:grid-cols-2 xl:grid-cols-4">
          <div className="flex items-center gap-2">
            <Mail className="size-4 shrink-0" />
            <span className="truncate">{participant.email}</span>
          </div>
          {participant.phone && (
            <div className="flex items-center gap-2">
              <Phone className="size-4 shrink-0" />
              <span>{participant.phone}</span>
            </div>
          )}
          {participant.birthday && (
            <div className="flex items-center gap-2">
              <Cake className="size-4 shrink-0" />
              <span>
                {new Date(`${participant.birthday}T00:00:00`).toLocaleDateString('pt-BR', {
                  day: '2-digit',
                  month: '2-digit',
                })}
              </span>
            </div>
          )}
          {whatsappLink && (
            <Link
              href={whatsappLink}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 text-[#25D366] transition-colors hover:opacity-80"
            >
              <MessageCircle className="size-4" />
              WhatsApp
            </Link>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="font-serif">Histórico de participação</CardTitle>
        </CardHeader>
        <CardContent>
          {registrations && registrations.length > 0 ? (
            <div className="space-y-3">
              {registrations.map((registration) => {
                const event = Array.isArray(registration.events)
                  ? registration.events[0]
                  : registration.events

                const formattedDate = event?.date
                  ? new Date(`${event.date}T00:00:00`).toLocaleDateString('pt-BR', {
                      day: '2-digit',
                      month: 'long',
                      year: 'numeric',
                    })
                  : 'Sem data'

                return (
                  <div
                    key={registration.id}
                    className="flex flex-col gap-2 rounded-2xl border border-border/70 bg-secondary/30 p-4 md:flex-row md:items-center md:justify-between"
                  >
                    <div>
                      <p className="font-medium text-foreground">{event?.title || 'Evento removido'}</p>
                      <p className="text-sm text-muted-foreground">
                        {formattedDate}
                        {event?.time ? ` • ${event.time}` : ''}
                        {event?.location ? ` • ${event.location}` : ''}
                      </p>
                    </div>
                    <span className="inline-flex rounded-full bg-primary/10 px-3 py-1 text-xs text-primary">
                      {registration.status === 'confirmed' ? 'Confirmada' : registration.status}
                    </span>
                  </div>
                )
              })}
            </div>
          ) : (
            <p className="text-muted-foreground">Nenhum histórico encontrado.</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
