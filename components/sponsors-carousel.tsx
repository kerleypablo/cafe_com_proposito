'use client'

import { Splide, SplideSlide } from '@splidejs/react-splide'
import { Sponsor } from '@/lib/sponsors'

interface SponsorsCarouselProps {
  sponsors: Sponsor[]
}

export function SponsorsCarousel({ sponsors }: SponsorsCarouselProps) {
  if (sponsors.length === 0) return null

  return (
    <div className="space-y-8">
      <div className="space-y-3 text-center">
        <p className="text-sm uppercase tracking-[0.35em] text-primary/70">Patrocinadores</p>
        <h2 className="font-serif text-3xl text-foreground md:text-4xl">
          Quem caminha com esse projeto
        </h2>
      </div>

      <Splide
        options={{
          type: sponsors.length > 1 ? 'loop' : 'slide',
          perPage: 5,
          gap: '1rem',
          pagination: false,
          arrows: sponsors.length > 1,
          drag: sponsors.length > 1,
          autoplay: sponsors.length > 1,
          interval: 2200,
          pauseOnHover: false,
          pauseOnFocus: false,
          breakpoints: {
            1100: { perPage: 4 },
            820: { perPage: 3 },
            560: { perPage: 2 },
          },
        }}
        aria-label="Patrocinadores"
      >
        {sponsors.map((sponsor) => (
          <SplideSlide key={sponsor.id} className="px-2">
            <div className="flex h-24 items-center justify-center">
              <img
                src={sponsor.image_url}
                alt={sponsor.title}
                className="max-h-16 w-auto object-contain opacity-90 transition-opacity duration-300 hover:opacity-100"
                onError={(event) => {
                  const target = event.currentTarget
                  target.style.display = 'none'
                  const fallback = target.nextElementSibling as HTMLElement | null
                  if (fallback) fallback.style.display = 'block'
                }}
              />
              <span className="hidden text-center text-sm text-muted-foreground">
                {sponsor.title}
              </span>
            </div>
          </SplideSlide>
        ))}
      </Splide>
    </div>
  )
}
