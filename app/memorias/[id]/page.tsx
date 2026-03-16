import { notFound } from 'next/navigation'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import { CalendarDays, Download, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { MemoryGallery } from '@/components/memory-gallery'
import { getPublicMemoryById } from '@/lib/public-data'

interface MemoryPageProps {
  params: Promise<{ id: string }>
}

export default async function MemoryPage({ params }: MemoryPageProps) {
  const { id } = await params
  const memory = await getPublicMemoryById(id)

  if (!memory) {
    notFound()
  }

  const formattedDate = memory.event_date
    ? new Date(`${memory.event_date}T00:00:00`).toLocaleDateString('pt-BR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : null
  const galleryImages = memory.image_urls?.length
    ? memory.image_urls
    : [memory.image_url || '/background.png']

  return (
    <div className="flex min-h-screen flex-col overflow-x-hidden bg-background">
      <Header />

      <main className="flex-1 overflow-x-hidden">
        <section className="overflow-x-hidden px-4 pb-20 pt-10 md:px-8">
          <div className="mx-auto max-w-6xl overflow-x-hidden">
            <Button asChild variant="ghost" className="mb-8 rounded-full">
              <Link href="/">
                <ArrowLeft className="size-4" />
                Voltar
              </Link>
            </Button>

            <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
              <MemoryGallery title={memory.title} images={galleryImages} />

              <div className="min-w-0 space-y-6">
                <div className="space-y-3">
                  <p className="text-sm uppercase tracking-[0.35em] text-primary/70">Evento anterior</p>
                  <h1 className="break-words font-serif text-4xl text-foreground md:text-5xl">{memory.title}</h1>
                  {memory.subtitle && (
                    <p className="break-words text-lg leading-8 text-muted-foreground">{memory.subtitle}</p>
                  )}
                </div>

                {formattedDate && (
                  <div className="inline-flex items-center gap-2 rounded-full bg-secondary px-4 py-2 text-sm text-secondary-foreground">
                    <CalendarDays className="size-4" />
                    {formattedDate}
                  </div>
                )}

                <div className="rounded-[2rem] border border-border/70 bg-card p-6 shadow-[0_24px_80px_-48px_rgba(0,0,0,0.35)]">
                  <p className="break-words whitespace-pre-wrap leading-8 text-foreground/85">
                    {memory.description}
                  </p>
                </div>

                {memory.photos_link && (
                  <Button asChild className="rounded-full">
                    <Link href={memory.photos_link} target="_blank" rel="noreferrer">
                      Baixar fotos
                      <Download className="size-4" />
                    </Link>
                  </Button>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
