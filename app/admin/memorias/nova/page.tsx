import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { ArrowLeft, CalendarDays } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { PastHighlightForm } from '@/components/admin/past-highlight-form'

export const metadata = {
  title: 'Nova Memoria | Admin Cafe com Proposito',
}

interface NovaMemoriaPageProps {
  searchParams?: Promise<{ eventId?: string }>
}

export default async function NovaMemoriaPage({ searchParams }: NovaMemoriaPageProps) {
  const supabase = await createClient()
  const resolvedSearchParams = searchParams ? await searchParams : undefined
  const selectedEventId = resolvedSearchParams?.eventId
  const today = new Date().toISOString().split('T')[0]

  const { data: pastEvents } = await supabase
    .from('events')
    .select('id, title, description, date, image_url')
    .lt('date', today)
    .order('date', { ascending: false })
    .limit(12)

  const initialEvent = selectedEventId
    ? pastEvents?.find((event) => event.id === selectedEventId) || null
    : null

  return (
    <div className="space-y-6">
      <div>
        <Button asChild variant="ghost" className="mb-4">
          <Link href="/admin/memorias">
            <ArrowLeft className="size-4" />
            Voltar
          </Link>
        </Button>
        <h1 className="font-serif text-3xl font-bold text-primary">Nova memoria</h1>
        <p className="text-muted-foreground">Crie um conteudo para a secao de eventos anteriores.</p>
      </div>

      {pastEvents && pastEvents.length > 0 && (
        <div className="rounded-2xl border border-border bg-card p-6">
          <div className="mb-4 space-y-1">
            <h2 className="font-serif text-2xl text-primary">Criar a partir de um evento encerrado</h2>
            <p className="text-sm text-muted-foreground">
              Escolha um evento passado para puxar titulo, data, descricao e imagem inicial.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            {pastEvents.map((event) => (
              <Link
                key={event.id}
                href={`/admin/memorias/nova?eventId=${event.id}`}
                className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm transition-colors ${selectedEventId === event.id ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'}`}
              >
                <CalendarDays className="size-4" />
                {event.title}
              </Link>
            ))}
          </div>
        </div>
      )}

      <div className="rounded-2xl border border-border bg-card p-6">
        <PastHighlightForm initialEvent={initialEvent} />
      </div>
    </div>
  )
}
