'use client'

import Link from 'next/link'
import { Splide, SplideSlide } from '@splidejs/react-splide'
import { ArrowUpRight, Download, CalendarDays } from 'lucide-react'
import { PastHighlight } from '@/lib/past-highlights'

interface PastHighlightsCarouselProps {
  highlights: PastHighlight[]
}

export function PastHighlightsCarousel({ highlights }: PastHighlightsCarouselProps) {
  if (highlights.length === 0) return null
  const shouldLoop = highlights.length >= 4

  const renderCard = (highlight: PastHighlight) => {
    const formattedDate = highlight.event_date
      ? new Date(`${highlight.event_date}T00:00:00`).toLocaleDateString('pt-BR', {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        })
      : null

    return (
      <article className="group flex h-full flex-col overflow-hidden rounded-[1.6rem] border border-border/60 bg-card shadow-[0_24px_80px_-48px_rgba(0,0,0,0.35)]">
        <Link href={`/memorias/${highlight.id}`} className="block">
          <div className="relative h-48 overflow-hidden">
            <img
              src={highlight.image_url}
              alt={highlight.title}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/5 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
              {formattedDate && (
                <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-white/15 px-2.5 py-1 text-[10px] uppercase tracking-[0.2em] text-white/80 backdrop-blur-sm">
                  <CalendarDays className="size-3" />
                  {formattedDate}
                </div>
              )}
              <h3 className="break-words font-serif text-xl leading-tight">{highlight.title}</h3>
              {highlight.subtitle && (
                <p className="mt-1 break-words text-xs text-white/80">{highlight.subtitle}</p>
              )}
            </div>
          </div>
        </Link>

        <div className="flex flex-1 flex-col gap-3 p-4">
          <p className="line-clamp-3 min-h-[4.5rem] break-words text-sm leading-6 text-muted-foreground">
            {highlight.description}
          </p>
          <div className="mt-auto flex flex-wrap items-center gap-2">
            <Link
              href={`/memorias/${highlight.id}`}
              className="inline-flex items-center gap-2 rounded-full bg-primary px-3 py-2 text-xs font-medium text-primary-foreground transition-transform hover:-translate-y-0.5"
            >
              Ver detalhes
              <ArrowUpRight className="size-3.5" />
            </Link>
            {highlight.photos_link && (
              <Link
                href={highlight.photos_link}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-border px-3 py-2 text-xs font-medium text-foreground transition-colors hover:bg-secondary"
              >
                Baixar fotos
                <Download className="size-3.5" />
              </Link>
            )}
          </div>
        </div>
      </article>
    )
  }

  return (
    <div className="space-y-6">
      <div className="space-y-3 text-center">
        <p className="text-sm uppercase tracking-[0.35em] text-primary/70">Memórias</p>
        <h2 className="font-serif text-3xl text-foreground md:text-4xl">
          Encontros que já marcaram nossa história
        </h2>
      </div>

      {highlights.length === 1 ? (
        <div className="mx-auto w-full max-w-sm px-1 py-2">{renderCard(highlights[0])}</div>
      ) : (
      <Splide
        options={{
          type: shouldLoop ? 'loop' : 'slide',
          perPage: Math.min(4, highlights.length),
          focus: shouldLoop ? 0 : 0,
          gap: '1rem',
          pagination: false,
          arrows: highlights.length > 1,
          drag: true,
          rewind: !shouldLoop,
          clones: shouldLoop ? undefined : 0,
          trimSpace: shouldLoop ? false : true,
          breakpoints: {
            1100: { perPage: Math.min(3, highlights.length) },
            820: { perPage: Math.min(2, highlights.length) },
            560: { perPage: 1 },
          },
        }}
        aria-label="Memórias dos encontros anteriores"
      >
        {highlights.map((highlight) => (
          <SplideSlide key={highlight.id} className="px-1 py-2">
            {renderCard(highlight)}
          </SplideSlide>
        ))}
      </Splide>
      )}
    </div>
  )
}
