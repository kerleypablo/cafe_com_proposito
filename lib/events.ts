interface EventRecord {
  id: string
  title: string
  description: string | null
  image_url: string | null
  date: string
  time: string
  location: string
  max_participants: number | null
  is_published: boolean
  created_at?: string
  updated_at?: string
  registrations?: Array<{ count: number | null }>
}

export interface AppEvent {
  id: string
  title: string
  description: string | null
  image_url: string | null
  date: string
  time: string
  location: string
  max_participants: number | null
  status: 'published' | 'draft'
  is_published: boolean
  created_at?: string
  updated_at?: string
  registrations?: Array<{ count: number | null }>
  registration_count?: number
}

export const EVENT_SELECT = `
  id,
  title,
  description,
  image_url,
  date,
  time,
  location,
  max_participants,
  is_published,
  created_at,
  updated_at,
  registrations:registrations(count)
`

export function normalizeEvent(event: EventRecord): AppEvent {
  return {
    ...event,
    status: event.is_published ? 'published' : 'draft',
    registration_count: event.registrations?.[0]?.count || 0,
  }
}
