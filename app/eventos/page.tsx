import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { EventCard } from '@/components/event-card'
import { getPublicEvents } from '@/lib/public-data'

export const metadata = {
  title: 'Eventos | Cafe com Proposito',
  description: 'Confira nossos proximos eventos e encontros mensais.',
}

export default async function EventosPage() {
  const { upcoming: upcomingWithCount, past: pastWithCount } = await getPublicEvents()

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-1 py-8 md:py-12">
        <div className="container mx-auto px-4">
          {/* Page Header */}
          <div className="text-center mb-12">
            <h1 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4">
              Nossos Eventos
            </h1>
            <p className="text-muted-foreground max-w-md mx-auto">
              Encontros mensais pensados para nutrir sua alma e fortalecer conexoes.
            </p>
          </div>

          {/* Upcoming Events */}
          <section className="mb-16">
            <h2 className="font-serif text-2xl font-semibold text-foreground mb-6">
              Proximos Encontros
            </h2>
            {upcomingWithCount.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {upcomingWithCount.map((event) => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-secondary/30 rounded-2xl">
                <p className="text-muted-foreground">
                  Nenhum evento programado no momento. Volte em breve!
                </p>
              </div>
            )}
          </section>

          {/* Past Events */}
          {pastWithCount.length > 0 && (
            <section>
              <h2 className="font-serif text-2xl font-semibold text-foreground mb-6">
                Eventos Anteriores
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 opacity-75">
                {pastWithCount.map((event) => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
            </section>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}
