import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { EventForm } from '@/components/admin/event-form'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export const metadata = {
  title: 'Novo Evento | Admin Cafe com Proposito',
}

export default async function NovoEventoPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect('/admin/login')
  }
  return (
    <div className="space-y-6">
      <div>
        <Button asChild variant="ghost" className="mb-4">
          <Link href="/admin/eventos">
            <ArrowLeft className="size-4" />
            Voltar
          </Link>
        </Button>
        <h1 className="font-serif text-3xl font-bold text-foreground">Novo Evento</h1>
        <p className="text-muted-foreground">Crie um novo encontro para o Cafe com Proposito</p>
      </div>

      <div className="bg-card rounded-2xl p-6 border border-border">
        <EventForm />
      </div>
    </div>
  )
}
