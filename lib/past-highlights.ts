export interface PastHighlight {
  id: string
  title: string
  subtitle: string | null
  event_date: string | null
  image_url: string
  image_urls: string[]
  description: string
  photos_link: string | null
  is_published: boolean
  created_at?: string
}

export const PAST_HIGHLIGHTS_SELECT = `
  id,
  title,
  subtitle,
  event_date,
  image_url,
  image_urls,
  description,
  photos_link,
  is_published,
  created_at
`
