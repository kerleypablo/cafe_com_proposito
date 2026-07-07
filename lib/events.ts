interface EventRecord {
  id: string
  title: string
  description: string | null
  image_url: string | null
  is_paid: boolean | null
  payment_amount: number | null
  payment_pix_key: string | null
  payment_instructions: string | null
  payment_qr_code_url: string | null
  payment_whatsapp: string | null
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
  is_paid: boolean
  payment_amount: number | null
  payment_pix_key: string | null
  payment_instructions: string | null
  payment_qr_code_url: string | null
  payment_whatsapp: string | null
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
  is_paid,
  payment_amount,
  payment_pix_key,
  payment_instructions,
  payment_qr_code_url,
  payment_whatsapp,
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
    is_paid: Boolean(event.is_paid),
    status: event.is_published ? 'published' : 'draft',
    registration_count: event.registrations?.[0]?.count || 0,
  }
}
