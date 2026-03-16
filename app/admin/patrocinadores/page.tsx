import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Plus, Edit } from 'lucide-react'
import { SponsorVisibilityToggle } from '@/components/admin/sponsor-visibility-toggle'
import { SponsorSearchInput } from '@/components/admin/sponsor-search-input'

export const metadata = {
  title: 'Patrocinadores | Admin Cafe com Proposito',
}

export default async function AdminPatrocinadoresPage({
  searchParams,
}: {
  searchParams?: Promise<{ nome?: string }>
}) {
  const supabase = await createClient()
  const params = (await searchParams) || {}
  const nameFilter = params.nome?.trim() || ''
  let query = supabase
    .from('sponsors')
    .select('*')
    .order('created_at', { ascending: false })

  if (nameFilter) {
    query = query.ilike('title', `%${nameFilter}%`)
  }

  const { data: sponsors } = await query

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-serif text-3xl font-bold text-foreground">Patrocinadores</h1>
          <p className="text-muted-foreground">
            Gerencie as logos cadastradas e marque com clareza quais devem aparecer no carrossel publico.
          </p>
        </div>
        <Button asChild className="rounded-full">
          <Link href="/admin/patrocinadores/novo">
            <Plus className="size-4" />
            Novo patrocinador
          </Link>
        </Button>
      </div>

      <Card>
        <CardContent className="p-4">
          <SponsorSearchInput defaultValue={nameFilter} />
        </CardContent>
      </Card>

      {sponsors && sponsors.length > 0 ? (
        <div className="grid gap-4">
          {sponsors.map((sponsor) => (
            <Card key={sponsor.id}>
              <CardContent className="p-4">
                <div className="flex flex-col gap-4 md:flex-row md:items-center">
                  <div className="flex h-24 w-full items-center justify-center overflow-hidden rounded-2xl border border-border bg-background md:w-40">
                    <img
                      src={sponsor.image_url}
                      alt={sponsor.title}
                      className="max-h-16 w-auto object-contain"
                    />
                  </div>

                  <div className="flex-1 space-y-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="font-serif text-xl text-foreground">{sponsor.title}</h2>
                      <span className={`rounded-full px-2 py-1 text-xs ${sponsor.is_active ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'}`}>
                        {sponsor.is_active ? 'Selecionado para exibir' : 'Cadastrado, mas oculto'}
                      </span>
                    </div>
                    <SponsorVisibilityToggle sponsorId={sponsor.id} initialValue={sponsor.is_active} />
                  </div>

                  <Button asChild variant="outline" size="sm" className="rounded-full">
                    <Link href={`/admin/patrocinadores/${sponsor.id}`}>
                      <Edit className="size-4" />
                      Editar
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">
              {nameFilter ? 'Nenhum patrocinador encontrado para esse nome.' : 'Nenhum patrocinador cadastrado ainda.'}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
