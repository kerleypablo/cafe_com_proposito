import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { PastHighlightForm } from '@/components/admin/past-highlight-form'

interface AdminMemoryPageProps {
  params: Promise<{ id: string }>
}

export const metadata = {
  title: 'Editar Memoria | Admin Cafe com Proposito',
}

export default async function AdminMemoryPage({ params }: AdminMemoryPageProps) {
  const { id } = await params
  const supabase = await createClient()
  const { data: highlight } = await supabase
    .from('past_event_highlights')
    .select('*')
    .eq('id', id)
    .single()

  if (!highlight) {
    notFound()
  }

  return (
    <div className="space-y-6">
      <div>
        <Button asChild variant="ghost" className="mb-4">
          <Link href="/admin/memorias">
            <ArrowLeft className="size-4" />
            Voltar
          </Link>
        </Button>
        <h1 className="font-serif text-3xl font-bold text-primary">Editar memoria</h1>
        <p className="text-muted-foreground">{highlight.title}</p>
      </div>

      <div className="rounded-2xl border border-border bg-card p-6">
        <PastHighlightForm highlight={highlight} />
      </div>
    </div>
  )
}
