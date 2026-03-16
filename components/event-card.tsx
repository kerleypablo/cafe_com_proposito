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

  return (
    <Card className="overflow-hidden border-0 shadow-md hover:shadow-lg transition-shadow duration-300">
      <div className="relative h-48 overflow-hidden">
        <img
          src={imageUrl}
          alt={event.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/20 to-transparent" />
      </div>
      <CardHeader className="pb-2">
        <CardTitle className="font-serif text-xl text-foreground">
          {event.title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {event.description && (
          <p className="text-muted-foreground text-sm line-clamp-2">
            {event.description}
          </p>
        )}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="size-4 text-primary" />
            <span className="capitalize">{formattedDate}</span>
            <span className="text-primary">|</span>
            <span>{event.time}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="size-4 text-primary" />
            <span>{event.location}</span>
          </div>
          {event.max_participants && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Users className="size-4 text-primary" />
              <span>
                {isFull 
                  ? 'Vagas esgotadas' 
                  : `${spotsLeft} vagas restantes`}
              </span>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          asChild 
          className="w-full rounded-full"
          disabled={isFull}
        >
          <Link href={`/eventos/${event.id}`}>
            {isFull ? 'Lista de espera' : 'Ver detalhes'}
          </Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
