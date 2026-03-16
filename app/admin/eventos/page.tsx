import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Plus, Calendar, MapPin, Users, Edit, Eye } from 'lucide-react'
import Link from 'next/link'

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
    .select(`
      *,
      registrations:registrations(count)
    `)
    .order('date', { ascending: false })

  const eventsWithCount = events?.map(event => ({
    ...event,
    registration_count: event.registrations?.[0]?.count || 0
  })) || []

  const today = new Date().toISOString().split('T')[0]

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
        <div className="grid gap-4">
          {eventsWithCount.map((event) => {
            const eventDate = new Date(event.date)
            const formattedDate = eventDate.toLocaleDateString('pt-BR', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            })
            const isPast = event.date < today
            const statusLabel = event.status === 'published' ? 'Publicado' : 'Rascunho'
            const statusColor = event.status === 'published' 
              ? 'bg-primary/10 text-primary' 
              : 'bg-muted text-muted-foreground'

            return (
              <Card key={event.id} className={isPast ? 'opacity-60' : ''}>
                <CardContent className="p-4">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                    {/* Event Image */}
                    {event.image_url && (
                      <div className="w-full sm:w-24 h-24 rounded-xl overflow-hidden shrink-0">
                        <img
                          src={event.image_url}
                          alt={event.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    
                    {/* Event Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h3 className="font-serif text-lg font-semibold text-foreground truncate">
                          {event.title}
                        </h3>
                        <span className={`text-xs px-2 py-1 rounded-full shrink-0 ${statusColor}`}>
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

                    {/* Actions */}
                    <div className="flex items-center gap-2 shrink-0">
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
          })}
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
