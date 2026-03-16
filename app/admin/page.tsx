import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Calendar, Users, UserCheck, Lightbulb } from 'lucide-react'
import Link from 'next/link'

export const metadata = {
  title: 'Dashboard | Admin Cafe com Proposito',
}

export default async function AdminDashboardPage() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect('/admin/login')
  }
  
  const today = new Date().toISOString().split('T')[0]

  // Get stats
  const [
    { count: totalEvents },
    { count: upcomingEvents },
    { count: totalParticipants },
    { count: totalRegistrations },
    { count: pendingSuggestions },
  ] = await Promise.all([
    supabase.from('events').select('*', { count: 'exact', head: true }),
    supabase.from('events').select('*', { count: 'exact', head: true }).gte('date', today),
    supabase.from('participants').select('*', { count: 'exact', head: true }),
    supabase.from('registrations').select('*', { count: 'exact', head: true }).eq('status', 'confirmed'),
    supabase.from('suggestions').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
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
    .select(`
      *,
      registrations:registrations(count)
    `)
    .gte('date', today)
    .order('date', { ascending: true })
    .limit(3)

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
      label: 'Sugestoes Pendentes', 
      value: pendingSuggestions || 0, 
      icon: Lightbulb,
      href: '/admin/sugestoes'
    },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-serif text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground">Visao geral do Cafe com Proposito</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Link key={stat.label} href={stat.href}>
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center justify-center size-12 rounded-full bg-primary/10">
                      <Icon className="size-6 text-primary" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                      <p className="text-sm text-muted-foreground">{stat.label}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Events */}
        <Card>
          <CardHeader>
            <CardTitle className="font-serif">Proximos Eventos</CardTitle>
          </CardHeader>
          <CardContent>
            {nextEvents && nextEvents.length > 0 ? (
              <div className="space-y-4">
                {nextEvents.map((event) => {
                  const eventDate = new Date(event.date)
                  const formattedDate = eventDate.toLocaleDateString('pt-BR', {
                    day: 'numeric',
                    month: 'short',
                  })
                  const registrationCount = event.registrations?.[0]?.count || 0
                  
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
