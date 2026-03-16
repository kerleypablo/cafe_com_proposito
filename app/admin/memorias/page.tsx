import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Plus, Image as ImageIcon, Download, Edit } from 'lucide-react'

export const metadata = {
  title: 'Memorias | Admin Cafe com Proposito',
}

export default async function AdminMemoriasPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/admin/login')
  }

  const { data: highlights } = await supabase
    .from('past_event_highlights')
    .select('*')
    .order('event_date', { ascending: false, nullsFirst: false })

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-serif text-3xl font-bold text-foreground">Eventos anteriores</h1>
          <p className="text-muted-foreground">
            Gerencie os conteudos que aparecem no carrossel publico de memorias.
          </p>
        </div>
        <Button asChild className="rounded-full">
          <Link href="/admin/memorias/nova">
            <Plus className="size-4" />
            Nova memoria
          </Link>
        </Button>
      </div>

      {highlights && highlights.length > 0 ? (
        <div className="grid gap-4">
          {highlights.map((highlight) => {
            const formattedDate = highlight.event_date
              ? new Date(`${highlight.event_date}T00:00:00`).toLocaleDateString('pt-BR', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })
              : 'Sem data'

            return (
              <Card key={highlight.id}>
                <CardContent className="p-4">
                  <div className="flex flex-col gap-4 md:flex-row md:items-center">
                    <div className="h-24 w-full overflow-hidden rounded-2xl md:w-32">
                      <img
                        src={highlight.image_urls?.[0] || highlight.image_url}
                        alt={highlight.title}
                        className="h-full w-full object-cover"
                      />
                    </div>

                    <div className="flex-1 space-y-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <h2 className="font-serif text-xl text-foreground">{highlight.title}</h2>
                        <span className={`rounded-full px-2 py-1 text-xs ${highlight.is_published ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'}`}>
                          {highlight.is_published ? 'Publicado' : 'Oculto'}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">{formattedDate}</p>
                      {highlight.subtitle && (
                        <p className="text-sm text-muted-foreground">{highlight.subtitle}</p>
                      )}
                      <p className="text-xs text-muted-foreground">
                        {(highlight.image_urls?.length || 1)} imagem(ns)
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      {highlight.photos_link && (
                        <Link
                          href={highlight.photos_link}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex size-10 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                        >
                          <Download className="size-4" />
                        </Link>
                      )}
                      <Button asChild variant="outline" size="sm" className="rounded-full">
                        <Link href={`/admin/memorias/${highlight.id}`}>
                          <Edit className="size-4" />
                          Editar
                        </Link>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      ) : (
        <Card>
          <CardContent className="py-12 text-center">
            <ImageIcon className="mx-auto mb-4 size-8 text-muted-foreground" />
            <p className="text-muted-foreground">Nenhuma memoria cadastrada ainda.</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
