export interface Sponsor {
  id: string
  title: string
  image_url: string
  is_active: boolean
  created_at?: string
}

export const SPONSOR_SELECT = `
  id,
  title,
  image_url,
  is_active,
  created_at
`
