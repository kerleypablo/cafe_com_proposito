'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { CheckCircle } from 'lucide-react'

interface RegistrationFormProps {
  eventId: string
  isFull: boolean
}

export function RegistrationForm({ eventId, isFull }: RegistrationFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    const formData = new FormData(e.currentTarget)
    const name = formData.get('name') as string
    const email = formData.get('email') as string
    const phone = formData.get('phone') as string || null

    const supabase = createClient()

    // Check if already registered
    const { data: existing } = await supabase
      .from('registrations')
      .select('id')
      .eq('event_id', eventId)
      .eq('email', email)
      .single()

    if (existing) {
      setError('Este email ja esta inscrito neste evento.')
      setIsSubmitting(false)
      return
    }

    // Get or create participant
    let participantId: string

    const { data: existingParticipant } = await supabase
      .from('participants')
      .select('id')
      .eq('email', email)
      .single()

    if (existingParticipant) {
      participantId = existingParticipant.id
      // Update participant info
      await supabase
        .from('participants')
        .update({ name, phone })
        .eq('id', participantId)
    } else {
      const { data: newParticipant, error: participantError } = await supabase
        .from('participants')
        .insert({ name, email, phone })
        .select('id')
        .single()

      if (participantError || !newParticipant) {
        setError('Erro ao processar inscricao. Tente novamente.')
        setIsSubmitting(false)
        return
      }
      participantId = newParticipant.id
    }

    // Create registration
    const { error: registrationError } = await supabase
      .from('registrations')
      .insert({
        event_id: eventId,
        participant_id: participantId,
        name,
        email,
        phone,
        status: isFull ? 'waitlist' : 'confirmed',
      })

    if (registrationError) {
      setError('Erro ao processar inscricao. Tente novamente.')
      setIsSubmitting(false)
      return
    }

    setIsSuccess(true)
    setIsSubmitting(false)
  }

  if (isSuccess) {
    return (
      <div className="text-center py-4">
        <div className="inline-flex items-center justify-center size-12 rounded-full bg-primary/10 mb-3">
          <CheckCircle className="size-6 text-primary" />
        </div>
        <h3 className="font-serif text-lg font-semibold text-foreground mb-2">
          {isFull ? 'Voce esta na lista de espera!' : 'Inscricao confirmada!'}
        </h3>
        <p className="text-sm text-muted-foreground">
          {isFull 
            ? 'Entraremos em contato se uma vaga for liberada.'
            : 'Nos vemos no encontro! Voce recebera mais informacoes por email.'}
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name" className="text-foreground">
          Nome completo *
        </Label>
        <Input
          id="name"
          name="name"
          placeholder="Seu nome"
          required
          className="rounded-xl"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="email" className="text-foreground">
          Email *
        </Label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="seu@email.com"
          required
          className="rounded-xl"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone" className="text-foreground">
          WhatsApp (opcional)
        </Label>
        <Input
          id="phone"
          name="phone"
          type="tel"
          placeholder="(00) 00000-0000"
          className="rounded-xl"
        />
      </div>

      {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}

      <Button 
        type="submit" 
        disabled={isSubmitting}
        className="w-full rounded-full"
      >
        {isSubmitting 
          ? 'Processando...' 
          : isFull 
            ? 'Entrar na lista de espera' 
            : 'Confirmar inscricao'}
      </Button>

      <p className="text-xs text-muted-foreground text-center">
        Ao se inscrever, voce concorda em receber comunicacoes sobre este evento.
      </p>
    </form>
  )
}
