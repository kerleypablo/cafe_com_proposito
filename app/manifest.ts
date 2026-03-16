import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Cafe com Proposito',
    short_name: 'Cafe com Proposito',
    description: 'Encontros mensais para mulheres que buscam crescimento pessoal, fe e autocuidado',
    start_url: '/',
    display: 'standalone',
    background_color: '#faf6f1',
    theme_color: '#D4A574',
    icons: [
      {
        src: '/icone_sfundo.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icone_sfundo.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  }
}
