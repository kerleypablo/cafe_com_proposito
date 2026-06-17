import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { EventForm } from '@/components/admin/event-form'
import { ArrowLeft, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import { EVENT_SELECT, normalizeEvent } from '@/lib/events'
import { EventRegistrationsList } from '@/components/admin/event-registrations-list'

interface EditEventPageProps {
  params: Promise<{ id: string }>
}

type AttendanceStatus = 'pending' | 'present' | 'absent'

export async function generateMetadata({ params }: EditEventPageProps) {
  const { id } = await params
  const supabase = await createClient()
  const { data: event } = await supabase
    .from('events')
    .select('title')
    .eq('id', id)
    .single()

  return {
    title: event ? `Editar ${event.title} | Admin` : 'Evento nao encontrado',
  }
}

export default async function EditEventPage({ params }: EditEventPageProps) {
  const { id } = await params
  const supabase = await createClient()

  const { data: rawEvent } = await supabase
    .from('events')
    .select(EVENT_SELECT)
    .eq('id', id)
    .single()

  if (!rawEvent) {
    notFound()
  }

  const event = normalizeEvent(rawEvent)

  const registrationResult = await supabase
    .from('registrations')
    .select('id, event_id, participant_id, name, email, phone, status, attended, attended_at, attendance_status, created_at')
    .eq('event_id', id)
    .order('created_at', { ascending: false })

  const attendanceColumnsAvailable = !registrationResult.error
  const fallbackRegistrationResult = registrationResult.error
    ? await supabase
        .from('registrations')
        .select('id, event_id, participant_id, name, email, phone, status, created_at')
        .eq('event_id', id)
        .order('created_at', { ascending: false })
    : { data: null }

  const registrations = (registrationResult.data || fallbackRegistrationResult.data || []).map((registration) => ({
    id: registration.id,
    event_id: registration.event_id,
    participant_id: registration.participant_id || null,
    name: registration.name,
    email: registration.email || null,
    phone: registration.phone || null,
    status: registration.status,
    attended: 'attended' in registration ? Boolean(registration.attended) : true,
    attendance_status: 'attendance_status' in registration
      ? (registration.attendance_status as AttendanceStatus)
      : 'present',
    created_at: registration.created_at || null,
  }))

  const today = new Date().toISOString().split('T')[0]
  const participantIds = Array.from(
    new Set(registrations.map((registration) => registration.participant_id).filter(Boolean)),
  )
  const { data: participantHistory } = participantIds.length > 0 && attendanceColumnsAvailable
    ? await supabase
        .from('registrations')
        .select('id, participant_id, status, attended, attendance_status, events:event_id(date)')
        .in('participant_id', participantIds)
        .eq('status', 'confirmed')
    : { data: [] }

  const absenceCountByParticipant = new Map<string, number>()
  ;(participantHistory || []).forEach((registration) => {
    const eventRecord = Array.isArray(registration.events)
      ? registration.events[0]
      : registration.events
    const participantId = registration.participant_id

    if (
      participantId &&
      eventRecord?.date &&
      eventRecord.date < today &&
      registration.attendance_status === 'absent'
    ) {
      absenceCountByParticipant.set(
        participantId,
        (absenceCountByParticipant.get(participantId) || 0) + 1,
      )
    }
  })

  return (
    <div className="space-y-6">
      <div>
        <Button asChild variant="ghost" className="mb-4">
          <Link href="/admin/eventos">
            <ArrowLeft className="size-4" />
            Voltar
          </Link>
        </Button>
        <h1 className="font-serif text-3xl font-bold text-primary">Editar Evento</h1>
        <p className="text-muted-foreground">{event.title}</p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="rounded-2xl border border-border bg-card p-6">
            <EventForm event={event} />
          </div>
        </div>

        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-serif">
                <Users className="size-5" />
                Inscricoes ({registrations.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <EventRegistrationsList
                registrations={registrations}
                attendanceColumnsAvailable={attendanceColumnsAvailable}
                absenceCounts={Object.fromEntries(absenceCountByParticipant)}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

