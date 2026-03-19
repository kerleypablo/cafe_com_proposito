'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { CheckCircle, Handshake } from 'lucide-react'

export function PartnershipForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    const formData = new FormData(e.currentTarget)
    const payload = {
      name: String(formData.get('name') || '').trim(),
      company_name: String(formData.get('company_name') || '').trim(),
      contact_phone: String(formData.get('contact_phone') || '').trim(),
    }

    const supabase = createClient()
    const { error: submitError } = await supabase.from('partnership_requests').insert(payload)

    if (submitError) {
      setError('Não foi possível enviar sua solicitação agora. Tente novamente.')
      setIsSubmitting(false)
      return
    }

    setIsSuccess(true)
    setIsSubmitting(false)
  }

  if (isSuccess) {
    return (
      <div className="py-8 text-center">
        <div className="mb-4 inline-flex size-16 items-center justify-center rounded-full bg-primary/10">
          <CheckCircle className="size-8 text-primary" />
        </div>
        <h3 className="mb-2 font-serif text-xl font-semibold text-foreground">
          Solicitação recebida
        </h3>
        <p className="mb-6 text-muted-foreground">
          Obrigada pelo interesse em caminhar com esse projeto. Vamos entrar em contato.
        </p>
        <Button variant="outline" onClick={() => setIsSuccess(false)} className="rounded-full">
          Enviar outra solicitação
        </Button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="name">Seu nome *</Label>
        <Input id="name" name="name" required placeholder="Como podemos te chamar?" className="rounded-xl" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="company_name">Nome da empresa *</Label>
        <Input
          id="company_name"
          name="company_name"
          required
          placeholder="Qual marca ou empresa você representa?"
          className="rounded-xl"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="contact_phone">Telefone para contato *</Label>
        <Input
          id="contact_phone"
          name="contact_phone"
          type="tel"
          required
          placeholder="(00) 00000-0000"
          className="rounded-xl"
        />
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <div className="rounded-2xl border border-border bg-secondary/25 p-4 text-sm text-muted-foreground">
        Se a sua marca deseja apoiar o Café com Propósito e ter visibilidade junto à nossa comunidade,
        envie seus dados que retornaremos com as próximas informações.
      </div>

      <Button type="submit" disabled={isSubmitting} className="w-full rounded-full">
        <Handshake className="size-4" />
        {isSubmitting ? 'Enviando...' : 'Quero ser parceiro'}
      </Button>
    </form>
  )
}
