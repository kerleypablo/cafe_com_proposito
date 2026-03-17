import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { SponsorForm } from '@/components/admin/sponsor-form'

interface AdminSponsorPageProps {
  params: Promise<{ id: string }>
}

export const metadata = {
  title: 'Editar Patrocinador | Admin Café com Propósito',
}

export default async function AdminSponsorPage({ params }: AdminSponsorPageProps) {
  const { id } = await params
  const supabase = await createClient()
  const { data: sponsor } = await supabase
    .from('sponsors')
    .select('*')
    .eq('id', id)
    .single()

  if (!sponsor) {
    notFound()
  }

  return (
    <div className="space-y-6">
      <div>
        <Button asChild variant="ghost" className="mb-4">
          <Link href="/admin/patrocinadores">
            <ArrowLeft className="size-4" />
            Voltar
          </Link>
        </Button>
        <h1 className="font-serif text-3xl font-bold text-primary">Editar patrocinador</h1>
        <p className="text-muted-foreground">{sponsor.title}</p>
      </div>

      <div className="rounded-2xl border border-border bg-card p-6">
        <SponsorForm sponsor={sponsor} />
      </div>
    </div>
  )
}
