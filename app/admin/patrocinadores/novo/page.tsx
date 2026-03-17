import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { SponsorForm } from '@/components/admin/sponsor-form'

export const metadata = {
  title: 'Novo Patrocinador | Admin Café com Propósito',
}

export default async function NovoPatrocinadorPage() {
  await createClient()

  return (
    <div className="space-y-6">
      <div>
        <Button asChild variant="ghost" className="mb-4">
          <Link href="/admin/patrocinadores">
            <ArrowLeft className="size-4" />
            Voltar
          </Link>
        </Button>
        <h1 className="font-serif text-3xl font-bold text-primary">Novo patrocinador</h1>
        <p className="text-muted-foreground">Adicione uma logo para o carrossel público.</p>
      </div>

      <div className="rounded-2xl border border-border bg-card p-6">
        <SponsorForm />
      </div>
    </div>
  )
}
