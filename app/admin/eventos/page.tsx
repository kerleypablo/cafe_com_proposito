import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Plus, Calendar, MapPin, Users, Edit, Eye } from 'lucide-react'
import Link from 'next/link'
import { EVENT_SELECT, normalizeEvent } from '@/lib/events'

export const metadata = {
  title: 'Eventos | Admin Cafe com Proposito',
}

export default async function AdminEventosPage() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect('/admin/login')
  }
  
  const { data: events } = await supabase
    .from('events')
    .select(EVENT_SELECT)
    .order('date', { ascending: false })

  const eventsWithCount = events?.map(normalizeEvent) || []

  const today = new Date().toISOString().split('T')[0]
  const upcomingEvents = eventsWithCount.filter((event) => event.date >= today)
  const pastEvents = eventsWithCount.filter((event) => event.date < today)

  const renderEventCard = (event: (typeof eventsWithCount)[number]) => {
    const eventDate = new Date(event.date)
    const formattedDate = eventDate.toLocaleDateString('pt-BR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })
    const statusLabel = event.status === 'published' ? 'Publicado' : 'Rascunho'
    const statusColor = event.status === 'published'
      ? 'bg-primary/10 text-primary'
      : 'bg-muted text-muted-foreground'

    return (
      <Card key={event.id}>
        <CardContent className="p-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            {event.image_url && (
              <div className="h-24 w-full shrink-0 overflow-hidden rounded-xl sm:w-24">
                <img
                  src={event.image_url}
                  alt={event.title}
                  className="h-full w-full object-cover"
                />
              </div>
            )}

            <div className="min-w-0 flex-1">
              <div className="mb-2 flex items-start justify-between gap-2">
                <h3 className="truncate font-serif text-lg font-semibold text-foreground">
                  {event.title}
                </h3>
                <span className={`shrink-0 rounded-full px-2 py-1 text-xs ${statusColor}`}>
                  {statusLabel}
                </span>
              </div>

              <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Calendar className="size-4" />
                  <span>{formattedDate} - {event.time}</span>
                </div>
                <div className="flex items-center gap-1">
                  <MapPin className="size-4" />
                  <span>{event.location}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="size-4" />
                  <span>
                    {event.registration_count}
                    {event.max_participants && ` / ${event.max_participants}`} inscricoes
                  </span>
                </div>
              </div>
            </div>

            <div className="flex shrink-0 items-center gap-2">
              <Button asChild variant="outline" size="sm" className="rounded-full">
                <Link href={`/eventos/${event.id}`}>
                  <Eye className="size-4" />
                  <span className="sr-only sm:not-sr-only sm:ml-1">Ver</span>
                </Link>
              </Button>
              <Button asChild variant="outline" size="sm" className="rounded-full">
                <Link href={`/admin/eventos/${event.id}`}>
                  <Edit className="size-4" />
                  <span className="sr-only sm:not-sr-only sm:ml-1">Editar</span>
                </Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-foreground">Eventos</h1>
          <p className="text-muted-foreground">Gerencie os encontros do Cafe com Proposito</p>
        </div>
        <Button asChild className="rounded-full">
          <Link href="/admin/eventos/novo">
            <Plus className="size-4" />
            Novo Evento
          </Link>
        </Button>
      </div>

      {eventsWithCount.length > 0 ? (
        <div className="space-y-8">
          <section className="space-y-4">
            <div className="border-b border-border pb-3">
              <h2 className="font-serif text-xl text-foreground">Proximos eventos</h2>
              <p className="text-sm text-muted-foreground">Encontros agendados e abertos para acompanhamento.</p>
            </div>
            {upcomingEvents.length > 0 ? (
              <div className="grid gap-4">
                {upcomingEvents.map(renderEventCard)}
              </div>
            ) : (
              <Card>
                <CardContent className="py-8 text-center text-muted-foreground">
                  Nenhum proximo evento cadastrado.
                </CardContent>
              </Card>
            )}
          </section>

          <section className="space-y-4">
            <div className="border-b border-border pb-3">
              <h2 className="font-serif text-xl text-foreground">Eventos que ja passaram</h2>
              <p className="text-sm text-muted-foreground">Historico dos encontros anteriores.</p>
            </div>
            {pastEvents.length > 0 ? (
              <div className="grid gap-4">
                {pastEvents.map(renderEventCard)}
              </div>
            ) : (
              <Card>
                <CardContent className="py-8 text-center text-muted-foreground">
                  Nenhum evento encerrado ainda.
                </CardContent>
              </Card>
            )}
          </section>
        </div>
      ) : (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground mb-4">Nenhum evento cadastrado ainda.</p>
            <Button asChild className="rounded-full">
              <Link href="/admin/eventos/novo">
                <Plus className="size-4" />
                Criar primeiro evento
              </Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
