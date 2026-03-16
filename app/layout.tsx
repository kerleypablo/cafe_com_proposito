import type { Metadata, Viewport } from 'next'
import { Playfair_Display, Lato } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import '@splidejs/react-splide/css'
import './globals.css'

const playfair = Playfair_Display({ 
  subsets: ["latin"],
  variable: '--font-playfair',
  display: 'swap',
})

const lato = Lato({ 
  subsets: ["latin"],
  weight: ['300', '400', '700'],
  variable: '--font-lato',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Café com Propósito',
  description: 'Encontros mensais para mulheres que buscam crescimento pessoal, fé e autocuidado',
  generator: 'v0.app',
  manifest: '/manifest.webmanifest',
  icons: {
    icon: '/icone_sfundo.png',
    shortcut: '/icone_sfundo.png',
    apple: '/icone_sfundo.png',
  },
}

export const viewport: Viewport = {
  themeColor: '#D4A574',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR" className={`${playfair.variable} ${lato.variable}`}>
      <body className="min-h-screen overflow-x-hidden font-sans antialiased">
        {children}
        <Analytics />
      </body>
    </html>
  )
}
