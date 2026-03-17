import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Café com Propósito',
    short_name: 'Café com Propósito',
    description: 'Encontros mensais para mulheres que buscam crescimento pessoal, fé e autocuidado',
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
