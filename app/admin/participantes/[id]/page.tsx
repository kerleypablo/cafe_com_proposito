import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Cake, Mail, MessageCircle, Phone, UserCheck, UserX } from 'lucide-react'
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
      attended,
      attended_at,
      attendance_status,
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
  const today = new Date().toISOString().split('T')[0]
  const attendanceStats = (registrations || []).reduce(
    (
      stats: { presences: number; absences: number },
      registration: {
        status: string
        attended?: boolean | null
        attendance_status?: 'pending' | 'present' | 'absent' | null
        events: { date?: string } | Array<{ date?: string }> | null
      },
    ) => {
      const event = Array.isArray(registration.events)
        ? registration.events[0]
        : registration.events
      const eventDate = event?.date

      if (registration.status !== 'confirmed' || !eventDate || eventDate >= today) {
        return stats
      }

      if (registration.attendance_status === 'present' || registration.attended) {
        stats.presences += 1
      } else if (registration.attendance_status === 'absent') {
        stats.absences += 1
      }

      return stats
    },
    { presences: 0, absences: 0 },
  )

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
          {participant.email && (
            <div className="flex items-center gap-2">
              <Mail className="size-4 shrink-0" />
              <span className="truncate">{participant.email}</span>
            </div>
          )}
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
          <div className="mb-4 flex flex-wrap gap-2">
            <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-xs text-primary">
              <UserCheck className="size-3.5" />
              {attendanceStats.presences} presenca{attendanceStats.presences === 1 ? '' : 's'}
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-destructive/10 px-3 py-1 text-xs text-destructive">
              <UserX className="size-3.5" />
              {attendanceStats.absences} falta{attendanceStats.absences === 1 ? '' : 's'}
            </span>
          </div>

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
                const attendanceStatus = registration.attendance_status || (registration.attended ? 'present' : 'pending')
                const attendanceLabel = attendanceStatus === 'present'
                  ? 'Compareceu'
                  : attendanceStatus === 'absent'
                    ? 'Ausente'
                    : 'Presenca pendente'
                const attendanceClass = attendanceStatus === 'present'
                  ? 'bg-primary/10 text-primary'
                  : attendanceStatus === 'absent'
                    ? 'bg-destructive/10 text-destructive'
                    : 'bg-muted text-muted-foreground'

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
                    <div className="flex flex-wrap gap-2">
                      <span className="inline-flex rounded-full bg-primary/10 px-3 py-1 text-xs text-primary">
                        {registration.status === 'confirmed' ? 'Confirmada' : registration.status}
                      </span>
                      {registration.status === 'confirmed' && (
                        <span className={`inline-flex rounded-full px-3 py-1 text-xs ${attendanceClass}`}>
                          {attendanceLabel}
                        </span>
                      )}
                    </div>
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
