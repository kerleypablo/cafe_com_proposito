import { createClient } from '@/lib/supabase/server'
import { EventForm } from '@/components/admin/event-form'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export const metadata = {
  title: 'Novo Evento | Admin Café com Propósito',
}

export default async function NovoEventoPage() {
  await createClient()
  return (
    <div className="space-y-6">
      <div>
        <Button asChild variant="ghost" className="mb-4">
          <Link href="/admin/eventos">
            <ArrowLeft className="size-4" />
            Voltar
          </Link>
        </Button>
        <h1 className="font-serif text-3xl font-bold text-primary">Novo Evento</h1>
        <p className="text-muted-foreground">Crie um novo encontro para o Café com Propósito</p>
      </div>

      <div className="bg-card rounded-2xl p-6 border border-border">
        <EventForm />
      </div>
    </div>
  )
}
