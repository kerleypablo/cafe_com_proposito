'use client'

import Link from 'next/link'
import { Calendar, MapPin, Users } from 'lucide-react'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

interface EventCardProps {
  event: {
    id: string
    title: string
    description: string | null
    date: string
    time: string
    location: string
    max_participants: number | null
    image_url: string | null
    status: string
    registration_count?: number
  }
}

export function EventCard({ event }: EventCardProps) {
  const eventDate = new Date(event.date)
  const imageUrl = event.image_url || '/background.png'
  const formattedDate = eventDate.toLocaleDateString('pt-BR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  })
  
  const spotsLeft = event.max_participants
    ? event.max_participants - (event.registration_count || 0)
    : null

  const isFull = spotsLeft !== null && spotsLeft <= 0
  const isPast = eventDate < new Date(new Date().setHours(0, 0, 0, 0))

  return (
    <Card
      className={`overflow-hidden border-0 transition-all duration-300 ${
        isPast
          ? 'bg-card/85 shadow-sm hover:shadow-md'
          : 'shadow-md hover:shadow-lg'
      }`}
    >
      <div className="relative h-48 overflow-hidden">
        <img
          src={imageUrl}
          alt={event.title}
          className={`h-full w-full object-cover ${isPast ? 'opacity-70 saturate-50' : ''}`}
        />
        <div className={`absolute inset-0 ${isPast ? 'bg-gradient-to-t from-background/35 via-background/10 to-transparent' : 'bg-gradient-to-t from-foreground/20 to-transparent'}`} />
      </div>
      <CardHeader className="pb-2">
        <CardTitle className={`font-serif text-xl ${isPast ? 'text-primary/85' : 'text-primary'}`}>
          {event.title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {event.description && (
          <p className={`text-sm line-clamp-2 ${isPast ? 'text-muted-foreground/80' : 'text-muted-foreground'}`}>
            {event.description}
          </p>
        )}
        <div className="space-y-2">
          <div className={`flex items-center gap-2 text-sm ${isPast ? 'text-muted-foreground/80' : 'text-muted-foreground'}`}>
            <Calendar className="size-4 text-primary" />
            <span className="capitalize">{formattedDate}</span>
            <span className="text-primary">|</span>
            <span>{event.time}</span>
          </div>
          <div className={`flex items-center gap-2 text-sm ${isPast ? 'text-muted-foreground/80' : 'text-muted-foreground'}`}>
            <MapPin className="size-4 text-primary" />
            <span>{event.location}</span>
          </div>
          {event.max_participants && (
            <div className={`flex items-center gap-2 text-sm ${isPast ? 'text-muted-foreground/80' : 'text-muted-foreground'}`}>
              <Users className="size-4 text-primary" />
              <span>
                {isFull
                  ? 'Vagas esgotadas'
                  : 'Vagas limitadas'}
              </span>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          asChild 
          variant={isPast ? 'outline' : 'default'}
          className="w-full rounded-full"
        >
          <Link href={`/eventos/${event.id}`}>
            {isFull ? 'Esgotado' : 'Ver detalhes'}
          </Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
