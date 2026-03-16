import { notFound } from 'next/navigation'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { RegistrationForm } from '@/components/registration-form'
import { Calendar, MapPin, Users, Clock, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { getPublicEventById, getPublicEventMetaById } from '@/lib/public-data'

interface EventPageProps {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: EventPageProps) {
  const { id } = await params
  const event = await getPublicEventMetaById(id)

  if (!event) {
    return { title: 'Evento nao encontrado | Cafe com Proposito' }
  }

  return {
    title: `${event.title} | Cafe com Proposito`,
    description: event.description || 'Participe deste encontro especial.',
  }
}

export default async function EventPage({ params }: EventPageProps) {
  const { id } = await params
  const event = await getPublicEventById(id)

  if (!event) {
    notFound()
  }

  const registrationCount = event.registrations?.[0]?.count || 0
  const spotsLeft = event.max_participants 
    ? event.max_participants - registrationCount
    : null
  const isFull = spotsLeft !== null && spotsLeft <= 0

  const eventDate = new Date(event.date)
  const imageUrl = event.image_url || '/background.png'
  const formattedDate = eventDate.toLocaleDateString('pt-BR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  const isPastEvent = eventDate < new Date(new Date().setHours(0, 0, 0, 0))

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-1 py-8 md:py-12">
        <div className="container mx-auto px-4">
          {/* Back Button */}
          <Button 
            asChild 
            variant="ghost" 
            className="mb-6"
          >
            <Link href="/eventos">
              <ArrowLeft className="size-4" />
              Voltar para eventos
            </Link>
          </Button>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Event Details */}
            <div className="lg:col-span-2 space-y-6">
              <div className="relative h-64 overflow-hidden rounded-2xl md:h-80">
                <img
                  src={imageUrl}
                  alt={event.title}
                  className="h-full w-full object-cover"
                />
              </div>

              <div>
                <h1 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4">
                  {event.title}
                </h1>
                
                <div className="flex flex-wrap gap-4 mb-6">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="size-5 text-primary" />
                    <span className="capitalize">{formattedDate}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Clock className="size-5 text-primary" />
                    <span>{event.time}</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 text-muted-foreground mb-6">
                  <MapPin className="size-5 text-primary" />
                  <span>{event.location}</span>
                </div>

                {event.description && (
                  <div className="prose prose-neutral max-w-none">
                    <p className="text-foreground leading-relaxed whitespace-pre-wrap">
                      {event.description}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Registration Card */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 bg-card rounded-2xl p-6 shadow-md border border-border">
                {/* Spots Info */}
                {event.max_participants && (
                  <div className="flex items-center gap-2 text-sm mb-4 pb-4 border-b border-border">
                    <Users className="size-4 text-primary" />
                    <span className="text-muted-foreground">
                      {isFull 
                        ? 'Vagas esgotadas' 
                        : `${spotsLeft} de ${event.max_participants} vagas disponiveis`}
                    </span>
                  </div>
                )}

                {isPastEvent ? (
                  <div className="text-center py-4">
                    <p className="text-muted-foreground">
                      Este evento ja aconteceu.
                    </p>
                  </div>
                ) : (
                  <>
                    <h2 className="font-serif text-xl font-semibold text-foreground mb-4">
                      {isFull ? 'Lista de Espera' : 'Inscreva-se'}
                    </h2>
                    <RegistrationForm 
                      eventId={event.id} 
                      isFull={isFull}
                    />
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
