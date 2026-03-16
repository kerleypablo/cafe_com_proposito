import { createClient } from '@/lib/supabase/server'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { EventCard } from '@/components/event-card'
import { Button } from '@/components/ui/button'
import { Coffee, Users, Heart, Sparkles, ArrowRight } from 'lucide-react'
import Link from 'next/link'

export default async function HomePage() {
  const supabase = await createClient()
  
  // Get upcoming published events
  const today = new Date().toISOString().split('T')[0]
  const { data: events } = await supabase
    .from('events')
    .select(`
      *,
      registrations:registrations(count)
    `)
    .eq('status', 'published')
    .gte('date', today)
    .order('date', { ascending: true })
    .limit(3)

  const eventsWithCount = events?.map(event => ({
    ...event,
    registration_count: event.registrations?.[0]?.count || 0
  })) || []

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-b from-secondary/50 to-background py-16 md:py-24">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-1/2 -right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
            <div className="absolute -bottom-1/2 -left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
          </div>
          
          <div className="container mx-auto px-4 relative">
            <div className="max-w-2xl mx-auto text-center">
              <div className="inline-flex items-center justify-center size-20 rounded-full bg-primary/10 mb-6">
                <Coffee className="size-10 text-primary" />
              </div>
              <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 text-balance">
                Cafe com Proposito
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground mb-8 leading-relaxed text-pretty">
                Um espaco acolhedor para mulheres que buscam crescimento pessoal, 
                fe e autocuidado. Junte-se a nos em encontros mensais 
                cheios de significado.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg" className="rounded-full">
                  <Link href="/eventos">
                    Ver Proximos Eventos
                    <ArrowRight className="size-4" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="rounded-full">
                  <Link href="/sugestoes">
                    Enviar Sugestao
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 md:py-20">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="flex flex-col items-center text-center p-6">
                <div className="flex items-center justify-center size-14 rounded-full bg-primary/10 mb-4">
                  <Users className="size-7 text-primary" />
                </div>
                <h3 className="font-serif text-xl font-semibold text-foreground mb-2">
                  Comunidade
                </h3>
                <p className="text-muted-foreground">
                  Conecte-se com mulheres que compartilham dos mesmos valores e propositos.
                </p>
              </div>
              <div className="flex flex-col items-center text-center p-6">
                <div className="flex items-center justify-center size-14 rounded-full bg-accent/20 mb-4">
                  <Heart className="size-7 text-accent" />
                </div>
                <h3 className="font-serif text-xl font-semibold text-foreground mb-2">
                  Autocuidado
                </h3>
                <p className="text-muted-foreground">
                  Momentos dedicados ao seu bem-estar fisico, emocional e espiritual.
                </p>
              </div>
              <div className="flex flex-col items-center text-center p-6">
                <div className="flex items-center justify-center size-14 rounded-full bg-primary/10 mb-4">
                  <Sparkles className="size-7 text-primary" />
                </div>
                <h3 className="font-serif text-xl font-semibold text-foreground mb-2">
                  Crescimento
                </h3>
                <p className="text-muted-foreground">
                  Temas inspiradores que promovem reflexao e transformacao pessoal.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Upcoming Events Section */}
        {eventsWithCount.length > 0 && (
          <section className="py-16 md:py-20 bg-secondary/30">
            <div className="container mx-auto px-4">
              <div className="text-center mb-12">
                <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4">
                  Proximos Encontros
                </h2>
                <p className="text-muted-foreground max-w-md mx-auto">
                  Confira nossos proximos eventos e reserve seu lugar.
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
                {eventsWithCount.map((event) => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
              <div className="text-center mt-10">
                <Button asChild variant="outline" size="lg" className="rounded-full">
                  <Link href="/eventos">
                    Ver todos os eventos
                    <ArrowRight className="size-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </section>
        )}

        {/* CTA Section */}
        <section className="py-16 md:py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto text-center bg-card rounded-3xl p-8 md:p-12 shadow-lg border border-border">
              <h2 className="font-serif text-2xl md:text-3xl font-bold text-foreground mb-4">
                Tem uma sugestao de tema?
              </h2>
              <p className="text-muted-foreground mb-6">
                Adorariamos ouvir suas ideias para nossos proximos encontros. 
                Sua voz e importante para nossa comunidade!
              </p>
              <Button asChild size="lg" className="rounded-full">
                <Link href="/sugestoes">
                  Enviar Sugestao
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
