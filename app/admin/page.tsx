import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Calendar, Users, UserCheck, Lightbulb, Cake, MessageCircle, BriefcaseBusiness, Phone } from 'lucide-react'
import Link from 'next/link'
import { EVENT_SELECT, normalizeEvent } from '@/lib/events'
import { buildWhatsappLink } from '@/lib/whatsapp'
import { EventsLineChart } from '@/components/admin/events-line-chart'

export const metadata = {
  title: 'Dashboard | Admin Café com Propósito',
}

export default async function AdminDashboardPage() {
  const supabase = await createClient()

  const today = new Date().toISOString().split('T')[0]

  // Get stats
  const [
    { count: totalEvents },
    { count: upcomingEvents },
    { count: totalParticipants },
    { count: totalRegistrations },
    { count: pendingSuggestions },
    { count: pendingPartnershipRequests },
  ] = await Promise.all([
    supabase.from('events').select('*', { count: 'exact', head: true }),
    supabase.from('events').select('*', { count: 'exact', head: true }).gte('date', today),
    supabase.from('participants').select('*', { count: 'exact', head: true }),
    supabase.from('registrations').select('*', { count: 'exact', head: true }).eq('status', 'confirmed'),
    supabase.from('suggestions').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
    supabase.from('partnership_requests').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
  ])

  // Get recent registrations
  const { data: recentRegistrations } = await supabase
    .from('registrations')
    .select(`
      *,
      events:event_id(title)
    `)
    .order('created_at', { ascending: false })
    .limit(5)

  // Get upcoming events
  const { data: nextEvents } = await supabase
    .from('events')
    .select(EVENT_SELECT)
    .order('date', { ascending: true })
    .limit(8)

  const { data: participantsWithBirthday } = await supabase
    .from('participants')
    .select('id, name, phone, birthday')
    .not('birthday', 'is', null)

  const { data: pendingPartnershipLeads } = await supabase
    .from('partnership_requests')
    .select('id, name, company_name, contact_phone, created_at')
    .eq('status', 'pending')
    .order('created_at', { ascending: false })
    .limit(4)

  const normalizedNextEvents = nextEvents?.map(normalizeEvent) || []
  const chartData = normalizedNextEvents.map((event) => ({
    id: event.id,
    title: event.title,
    shortTitle: event.title.length > 18 ? `${event.title.slice(0, 18)}...` : event.title,
    registrations: event.registration_count || 0,
  }))
  const currentMonth = new Date().getMonth()
  const birthdayPeople = (participantsWithBirthday || [])
    .filter((participant) => {
      if (!participant.birthday) return false
      const birthday = new Date(`${participant.birthday}T00:00:00`)
      return birthday.getMonth() === currentMonth
    })
    .sort((a, b) => {
      const dayA = new Date(`${a.birthday}T00:00:00`).getDate()
      const dayB = new Date(`${b.birthday}T00:00:00`).getDate()
      return dayA - dayB
    })

  const stats = [
    { 
      label: 'Total de Eventos', 
      value: totalEvents || 0, 
      icon: Calendar,
      href: '/admin/eventos'
    },
    { 
      label: 'Eventos Futuros', 
      value: upcomingEvents || 0, 
      icon: Calendar,
      href: '/admin/eventos'
    },
    { 
      label: 'Participantes', 
      value: totalParticipants || 0, 
      icon: Users,
      href: '/admin/participantes'
    },
    { 
      label: 'Inscricoes Confirmadas', 
      value: totalRegistrations || 0, 
      icon: UserCheck,
      href: '/admin/participantes'
    },
    { 
      label: 'Novas Mensagens', 
      value: pendingSuggestions || 0, 
      icon: Lightbulb,
      href: '/admin/sugestoes'
    },
    {
      label: 'Novas Parcerias',
      value: pendingPartnershipRequests || 0,
      icon: BriefcaseBusiness,
      href: '/admin/parcerias'
    },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-serif text-3xl font-bold text-primary">Dashboard</h1>
        <p className="text-muted-foreground">Visão geral do Café com Propósito</p>
      </div>

      <Card className="overflow-hidden border-primary/20 bg-[linear-gradient(135deg,#f8efe6_0%,#fffaf5_60%,#f3e6d7_100%)]">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 font-serif text-xl">
            <Cake className="size-5 text-primary" />
            Aniversariantes do mês
          </CardTitle>
        </CardHeader>
        <CardContent>
          {birthdayPeople.length > 0 ? (
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {birthdayPeople.map((participant) => {
                const birthdayDate = new Date(`${participant.birthday}T00:00:00`)
                const formattedBirthday = birthdayDate.toLocaleDateString('pt-BR', {
                  day: '2-digit',
                  month: '2-digit',
                })
                const whatsappLink = buildWhatsappLink(participant.phone)

                return (
                  <div
                    key={participant.id}
                    className="flex items-center justify-between rounded-2xl border border-white/60 bg-white/80 p-4 shadow-[0_16px_40px_-28px_rgba(0,0,0,0.25)]"
                  >
                    <div className="min-w-0">
                      <p className="truncate font-medium text-foreground">{participant.name}</p>
                      <p className="text-sm text-muted-foreground">{formattedBirthday}</p>
                    </div>
                    {whatsappLink ? (
                      <Link
                        href={whatsappLink}
                        target="_blank"
                        rel="noreferrer"
                        className="ml-3 inline-flex size-10 shrink-0 items-center justify-center rounded-full bg-[#25D366]/10 text-[#25D366] transition-colors hover:bg-[#25D366]/20"
                        aria-label={`Conversar com ${participant.name} no WhatsApp`}
                      >
                        <MessageCircle className="size-4" />
                      </Link>
                    ) : (
                      <span className="ml-3 shrink-0 text-xs text-muted-foreground">Sem WhatsApp</span>
                    )}
                  </div>
                )
              })}
            </div>
          ) : (
            <p className="py-2 text-center text-muted-foreground">
              Nenhum aniversariante cadastrado neste mes
            </p>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 gap-3 xl:grid-cols-6 lg:gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Link key={stat.label} href={stat.href}>
              <Card className="h-full cursor-pointer transition-shadow hover:shadow-md">
                <CardContent className="p-4">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                    <div className="flex size-11 items-center justify-center rounded-2xl bg-primary/10">
                      <Icon className="size-5 text-primary" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-2xl font-bold leading-none text-foreground">{stat.value}</p>
                      <p className="mt-1 text-xs leading-5 text-muted-foreground sm:text-sm">
                        {stat.label}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          )
        })}
      </div>

      <Card className="overflow-hidden border-primary/20 bg-[linear-gradient(135deg,#fffaf5_0%,#f8efe6_55%,#fffdf9_100%)]">
        <CardHeader>
          <CardTitle className="font-serif text-primary">Participantes por evento</CardTitle>
          <p className="text-sm text-muted-foreground">
            Evolucao de inscritas confirmadas em cada encontro cadastrado.
          </p>
        </CardHeader>
        <CardContent>
          {chartData.length > 0 ? (
            <EventsLineChart data={chartData} />
          ) : (
            <p className="py-8 text-center text-muted-foreground">
              Ainda nao ha eventos suficientes para montar o grafico.
            </p>
          )}
        </CardContent>
      </Card>

      <Card className="overflow-hidden border-primary/20 bg-[linear-gradient(135deg,#f6ecdf_0%,#fffaf5_62%,#f4e8d8_100%)]">
        <CardHeader className="flex flex-row items-center justify-between gap-3">
          <div>
            <CardTitle className="font-serif text-primary">Novas solicitações de parceria</CardTitle>
            <p className="text-sm text-muted-foreground">
              Leads recentes de marcas interessadas em apoiar o projeto.
            </p>
          </div>
          <Link href="/admin/parcerias" className="text-sm text-primary hover:underline">
            Ver todas
          </Link>
        </CardHeader>
        <CardContent>
          {pendingPartnershipLeads && pendingPartnershipLeads.length > 0 ? (
            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
              {pendingPartnershipLeads.map((request) => (
                <div
                  key={request.id}
                  className="rounded-2xl border border-white/60 bg-white/80 p-4 shadow-[0_16px_40px_-28px_rgba(0,0,0,0.25)]"
                >
                  <p className="truncate font-medium text-foreground">{request.company_name}</p>
                  <p className="mt-1 truncate text-sm text-muted-foreground">{request.name}</p>
                  <div className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
                    <Phone className="size-4" />
                    <span>{request.contact_phone}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="py-2 text-center text-muted-foreground">
              Nenhuma solicitação de parceria pendente no momento
            </p>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        {/* Upcoming Events */}
        <Card>
          <CardHeader>
            <CardTitle className="font-serif">Próximos Eventos</CardTitle>
          </CardHeader>
          <CardContent>
            {normalizedNextEvents.length > 0 ? (
              <div className="space-y-4">
                {normalizedNextEvents.map((event) => {
                  const eventDate = new Date(event.date)
                  const formattedDate = eventDate.toLocaleDateString('pt-BR', {
                    day: 'numeric',
                    month: 'short',
                  })
                  const registrationCount = event.registration_count || 0
                  
                  return (
                    <Link 
                      key={event.id} 
                      href={`/admin/eventos/${event.id}`}
                      className="flex items-center justify-between p-3 rounded-xl bg-secondary/50 hover:bg-secondary transition-colors"
                    >
                      <div>
                        <p className="font-medium text-foreground">{event.title}</p>
                        <p className="text-sm text-muted-foreground">
                          {formattedDate} - {event.time}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-foreground">{registrationCount}</p>
                        <p className="text-xs text-muted-foreground">inscricoes</p>
                      </div>
                    </Link>
                  )
                })}
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-4">
                Nenhum evento programado
              </p>
            )}
          </CardContent>
        </Card>

        {/* Recent Registrations */}
        <Card>
          <CardHeader>
            <CardTitle className="font-serif">Inscricoes Recentes</CardTitle>
          </CardHeader>
          <CardContent>
            {recentRegistrations && recentRegistrations.length > 0 ? (
              <div className="space-y-3">
                {recentRegistrations.map((registration) => {
                  const createdAt = new Date(registration.created_at)
                  const timeAgo = getTimeAgo(createdAt)
                  
                  return (
                    <div 
                      key={registration.id} 
                      className="flex items-center justify-between p-3 rounded-xl bg-secondary/50"
                    >
                      <div>
                        <p className="font-medium text-foreground">{registration.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {registration.events?.title}
                        </p>
                      </div>
                      <span className="text-xs text-muted-foreground">{timeAgo}</span>
                    </div>
                  )
                })}
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-4">
                Nenhuma inscricao recente
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function getTimeAgo(date: Date): string {
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)
  
  if (diffInSeconds < 60) return 'agora'
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}min`
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h`
  return `${Math.floor(diffInSeconds / 86400)}d`
}
