import { EVENT_SELECT, normalizeEvent, type AppEvent } from '@/lib/events'
import { PAST_HIGHLIGHTS_SELECT, type PastHighlight } from '@/lib/past-highlights'
import { SPONSOR_SELECT, type Sponsor } from '@/lib/sponsors'
import { createClient } from '@/lib/supabase/server'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const REST_BASE = `${SUPABASE_URL}/rest/v1`

function getHeaders() {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    throw new Error('Supabase public env vars are missing.')
  }

  return {
    apikey: SUPABASE_ANON_KEY,
    Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
  }
}

async function restFetch<T>(path: string): Promise<T> {
  const response = await fetch(`${REST_BASE}${path}`, {
    headers: getHeaders(),
    cache: 'no-store',
  })

  if (!response.ok) {
    throw new Error(`Supabase REST error: ${response.status} ${response.statusText}`)
  }

  return response.json()
}

function buildQuery(params: Record<string, string | number | undefined>) {
  const search = new URLSearchParams()

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined) {
      search.set(key, String(value))
    }
  })

  return search.toString()
}

type RawEvent = Parameters<typeof normalizeEvent>[0]

async function attachRegistrationCounts(events: RawEvent[]) {
  const supabase = await createClient()

  const withCounts = await Promise.all(
    events.map(async (event) => {
      const { count } = await supabase
        .from('registrations')
        .select('*', { count: 'exact', head: true })
        .eq('event_id', event.id)
        .eq('status', 'confirmed')

      return normalizeEvent({
        ...event,
        registrations: [{ count: count || 0 }],
      })
    }),
  )

  return withCounts
}

export async function getNextPublicEvent() {
  const today = new Date().toISOString().split('T')[0]
  const query = buildQuery({
    select: EVENT_SELECT,
    is_published: 'eq.true',
    date: `gte.${today}`,
    order: 'date.asc',
    limit: 1,
  })

  const data = await restFetch<RawEvent[]>(`/events?${query}`)
  if (!data[0]) return null

  const [eventWithCount] = await attachRegistrationCounts([data[0]])
  return eventWithCount || null
}

export async function getPublicEvents() {
  const today = new Date().toISOString().split('T')[0]

  const [upcoming, past] = await Promise.all([
    restFetch<RawEvent[]>(
      `/events?${buildQuery({
        select: EVENT_SELECT,
        is_published: 'eq.true',
        date: `gte.${today}`,
        order: 'date.asc',
      })}`
    ),
    restFetch<RawEvent[]>(
      `/events?${buildQuery({
        select: EVENT_SELECT,
        is_published: 'eq.true',
        date: `lt.${today}`,
        order: 'date.desc',
        limit: 6,
      })}`
    ),
  ])

  return {
    upcoming: await attachRegistrationCounts(upcoming),
    past: await attachRegistrationCounts(past),
  }
}

export async function getPublicEventById(id: string): Promise<AppEvent | null> {
  const query = buildQuery({
    select: EVENT_SELECT,
    id: `eq.${id}`,
    is_published: 'eq.true',
    limit: 1,
  })

  const data = await restFetch<RawEvent[]>(`/events?${query}`)
  if (!data[0]) return null

  const [eventWithCount] = await attachRegistrationCounts([data[0]])
  return eventWithCount || null
}

export async function getPublicEventMetaById(id: string) {
  const query = buildQuery({
    select: 'title,description',
    id: `eq.${id}`,
    limit: 1,
  })

  const data = await restFetch<Array<{ title: string; description: string | null }>>(`/events?${query}`)
  return data[0] || null
}

export async function getPublishedHighlights(limit = 8) {
  const query = buildQuery({
    select: PAST_HIGHLIGHTS_SELECT,
    is_published: 'eq.true',
    order: 'event_date.desc.nullslast',
    limit,
  })

  return restFetch<PastHighlight[]>(`/past_event_highlights?${query}`)
}

export async function getPublicMemoryById(id: string) {
  const query = buildQuery({
    select: PAST_HIGHLIGHTS_SELECT,
    id: `eq.${id}`,
    is_published: 'eq.true',
    limit: 1,
  })

  const data = await restFetch<PastHighlight[]>(`/past_event_highlights?${query}`)
  return data[0] || null
}

export async function getActiveSponsors() {
  const query = buildQuery({
    select: SPONSOR_SELECT,
    is_active: 'eq.true',
    order: 'created_at.desc',
  })

  return restFetch<Sponsor[]>(`/sponsors?${query}`)
}
