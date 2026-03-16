import Link from 'next/link'
import { CalendarDays, Clock3, MapPin, ArrowDown, ArrowRight } from 'lucide-react'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import { NextEventCountdown } from '@/components/next-event-countdown'
import { PastHighlightsCarousel } from '@/components/past-highlights-carousel'
import { SuggestionForm } from '@/components/suggestion-form'
import { SponsorsCarousel } from '@/components/sponsors-carousel'
import { getActiveSponsors, getNextPublicEvent, getPublishedHighlights } from '@/lib/public-data'

export default async function HomePage() {
  const [normalizedNextEvent, highlights, sponsors] = await Promise.all([
    getNextPublicEvent(),
    getPublishedHighlights(8),
    getActiveSponsors(),
  ])
  const formattedDate = normalizedNextEvent
    ? new Date(`${normalizedNextEvent.date}T00:00:00`).toLocaleDateString('pt-BR', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : null

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />

      <main className="flex-1">
        <section
          className="relative overflow-hidden"
          style={{
            minHeight: 'calc(100vh - 6rem)',
            backgroundImage:
              "linear-gradient(120deg, rgba(21, 15, 14, 0.68), rgba(46, 28, 23, 0.38)), url('/background.png')",
            backgroundPosition: 'center 30%',
            backgroundSize: 'cover',
          }}
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.18),transparent_36%)]" />
          <div className="relative mx-auto flex min-h-[calc(100vh-6rem)] max-w-7xl items-end px-4 py-10 md:px-8 md:py-14">
            <div className="grid w-full gap-8 lg:grid-cols-[0.9fr_0.72fr] lg:items-end lg:justify-between">
              <div className="max-w-2xl space-y-5 text-white">
                <p className="text-sm uppercase tracking-[0.45em] text-white/70">
                  Cafe com Proposito
                </p>
                <h1 className="font-serif text-4xl leading-[0.98] md:text-6xl">
                  Encontros com beleza, profundidade e presença real.
                </h1>
                <p className="max-w-xl text-sm leading-7 text-white/82 md:text-base">
                  Um espaço para mulheres que desejam viver conversas significativas, momentos
                  de cuidado e encontros que continuam ecoando depois do café.
                </p>

                <div className="flex flex-wrap gap-3">
                  <Button asChild size="lg" className="rounded-full bg-white text-foreground hover:bg-white/90">
                    <Link href={normalizedNextEvent ? `/eventos/${normalizedNextEvent.id}` : '/eventos'}>
                      {normalizedNextEvent ? 'Quero me inscrever' : 'Ver eventos'}
                      <ArrowRight className="size-4" />
                    </Link>
                  </Button>
                  <Button asChild size="lg" variant="outline" className="rounded-full border-white/35 bg-white/10 text-white hover:bg-white/15">
                    <Link href="/sobre">Conhecer a historia</Link>
                  </Button>
                </div>

                <div className="inline-flex items-center gap-2 pt-6 text-sm uppercase tracking-[0.35em] text-white/60">
                  Role para baixo
                  <ArrowDown className="size-4" />
                </div>
              </div>

              <div className="max-w-md justify-self-end rounded-[2rem] border border-white/15 bg-black/25 p-5 shadow-[0_30px_90px_-40px_rgba(0,0,0,0.45)] backdrop-blur-md">
                {normalizedNextEvent ? (
                  <div className="space-y-5 text-white">
                    <div className="space-y-2">
                      <p className="text-sm uppercase tracking-[0.35em] text-white/60">Proximo encontro</p>
                      <h2 className="font-serif text-2xl md:text-3xl">{normalizedNextEvent.title}</h2>
                      {normalizedNextEvent.description && (
                        <p className="line-clamp-3 text-sm leading-6 text-white/78">
                          {normalizedNextEvent.description}
                        </p>
                      )}
                    </div>

                    <div className="space-y-3 text-sm text-white/82">
                      {formattedDate && (
                        <div className="flex items-center gap-3">
                          <CalendarDays className="size-4 text-white" />
                          <span className="capitalize">{formattedDate}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-3">
                        <Clock3 className="size-4 text-white" />
                        <span>{normalizedNextEvent.time}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <MapPin className="size-4 text-white" />
                        <span>{normalizedNextEvent.location}</span>
                      </div>
                    </div>

                    <NextEventCountdown date={normalizedNextEvent.date} time={normalizedNextEvent.time} />

                    <Button asChild className="w-full rounded-full bg-primary text-primary-foreground hover:bg-primary/90">
                      <Link href={`/eventos/${normalizedNextEvent.id}`}>
                        Inscrever-se no proximo evento
                        <ArrowRight className="size-4" />
                      </Link>
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4 text-white">
                    <p className="text-sm uppercase tracking-[0.35em] text-white/60">Proximo encontro</p>
                    <h2 className="font-serif text-3xl">Em breve teremos uma nova data</h2>
                    <p className="text-sm leading-7 text-white/78">
                      Assim que o próximo encontro for publicado, ele aparecerá aqui com data, contagem regressiva e botão de inscrição.
                    </p>
                    <Button asChild className="rounded-full bg-white text-foreground hover:bg-white/90">
                      <Link href="/eventos">Ver eventos</Link>
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        <section className="bg-[linear-gradient(180deg,#fffaf5_0%,#f5eee5_100%)] px-4 py-16 md:px-8 md:py-24">
          <div className="mx-auto max-w-7xl space-y-16">
            <PastHighlightsCarousel highlights={highlights || []} />

            <div className="grid gap-8 rounded-[2.4rem] bg-[linear-gradient(135deg,#f5eadc_0%,#fffaf5_58%,#f2e5d7_100%)] p-6 shadow-[0_24px_80px_-48px_rgba(0,0,0,0.18)] lg:grid-cols-[1fr_1.15fr] lg:items-start lg:p-8">
              <div className="space-y-4">
                <p className="text-sm uppercase tracking-[0.35em] text-primary/70">Mensagens</p>
                <h2 className="font-serif text-3xl text-foreground md:text-4xl">
                  Sugestoes, oracoes e agradecimentos
                </h2>
                <p className="max-w-lg leading-8 text-muted-foreground">
                  Se quiser compartilhar algo com a nossa comunidade, este espaco esta aberto para sua mensagem.
                </p>
              </div>

              <div className="rounded-[2rem] border border-white/50 bg-white/80 p-6 shadow-[0_24px_80px_-48px_rgba(0,0,0,0.25)] backdrop-blur-sm">
                <SuggestionForm />
              </div>
            </div>

            <div className="rounded-[2.4rem] bg-[linear-gradient(135deg,#eadbcc_0%,#f6eee4_48%,#efe4d6_100%)] px-4 py-10 shadow-[0_24px_80px_-48px_rgba(0,0,0,0.18)] md:px-8">
              <SponsorsCarousel sponsors={sponsors || []} />
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
