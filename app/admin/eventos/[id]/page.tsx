import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { EventForm } from '@/components/admin/event-form'
import { ArrowLeft, Users, MessageCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import { EVENT_SELECT, normalizeEvent } from '@/lib/events'
import { buildWhatsappLink } from '@/lib/whatsapp'

interface EditEventPageProps {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: EditEventPageProps) {
  const { id } = await params
  const supabase = await createClient()
  const { data: event } = await supabase
    .from('events')
    .select('title')
    .eq('id', id)
    .single()

  return {
    title: event ? `Editar ${event.title} | Admin` : 'Evento não encontrado',
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

  // Get registrations for this event
  const { data: registrations } = await supabase
    .from('registrations')
    .select('*')
    .eq('event_id', id)
    .order('created_at', { ascending: false })

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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Event Form */}
        <div className="lg:col-span-2">
          <div className="bg-card rounded-2xl p-6 border border-border">
            <EventForm event={event} />
          </div>
        </div>

        {/* Registrations */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="font-serif flex items-center gap-2">
                <Users className="size-5" />
                Inscrições ({registrations?.length || 0})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {registrations && registrations.length > 0 ? (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {registrations.map((registration) => {
                    const statusColor = registration.status === 'confirmed' 
                      ? 'bg-primary/10 text-primary' 
                      : registration.status === 'waitlist'
                        ? 'bg-accent/20 text-accent'
                        : 'bg-muted text-muted-foreground'
                    const statusLabel = registration.status === 'confirmed' 
                      ? 'Confirmado' 
                      : registration.status === 'waitlist'
                        ? 'Lista de espera'
                        : 'Cancelado'
                    const whatsappLink = buildWhatsappLink(registration.phone)

                    return (
                      <div 
                        key={registration.id}
                        className="p-3 rounded-xl bg-secondary/50"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <p className="font-medium text-foreground truncate">
                              {registration.name}
                            </p>
                            <p className="text-sm text-muted-foreground truncate">
                              {registration.email}
                            </p>
                            {registration.phone && (
                              <p className="text-sm text-muted-foreground">
                                {registration.phone}
                              </p>
                            )}
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            {whatsappLink && (
                              <Link
                                href={whatsappLink}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex size-9 items-center justify-center rounded-full bg-[#25D366]/10 text-[#25D366] transition-colors hover:bg-[#25D366]/20"
                                aria-label={`Conversar com ${registration.name} no WhatsApp`}
                              >
                                <MessageCircle className="size-4" />
                              </Link>
                            )}
                            <span className={`text-xs px-2 py-1 rounded-full shrink-0 ${statusColor}`}>
                              {statusLabel}
                            </span>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-4">
                  Nenhuma inscrição ainda
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
