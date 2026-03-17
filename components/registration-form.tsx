'use client'

import { useEffect, useRef, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { CheckCircle } from 'lucide-react'

interface RegistrationFormProps {
  eventId: string
  isFull: boolean
}

interface ParticipantLookup {
  id: string
  name: string
  email: string
  phone: string | null
  birthday?: string | null
  save_data?: boolean | null
}

const STORAGE_KEY = 'cafe_com_proposito_participant'

function normalizeEmail(value: string) {
  return value.trim().toLowerCase()
}

function normalizePhone(value: string) {
  const digits = value.replace(/\D/g, '')
  return digits || ''
}

export function RegistrationForm({ eventId, isFull }: RegistrationFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [birthday, setBirthday] = useState('')
  const [saveData, setSaveData] = useState(false)
  const [isLoadingExistingData, setIsLoadingExistingData] = useState(false)
  const hydratedRef = useRef(false)

  useEffect(() => {
    if (hydratedRef.current) return
    hydratedRef.current = true

    const stored = window.localStorage.getItem(STORAGE_KEY)
    if (!stored) return

    try {
      const parsed = JSON.parse(stored)
      setName(parsed.name || '')
      setEmail(parsed.email || '')
      setPhone(parsed.phone || '')
      setBirthday(parsed.birthday || '')
      setSaveData(Boolean(parsed.saveData))
    } catch {
      window.localStorage.removeItem(STORAGE_KEY)
    }
  }, [])

  async function prefillParticipant(source: 'email' | 'phone', rawValue: string) {
    const supabase = createClient()
    const cleanEmail = normalizeEmail(source === 'email' ? rawValue : email)
    const cleanPhone = normalizePhone(source === 'phone' ? rawValue : phone)

    if (source === 'email' && !cleanEmail) return
    if (source === 'phone' && !cleanPhone) return

    setIsLoadingExistingData(true)

    let query = supabase
      .from('participants')
      .select('id, name, email, phone, birthday, save_data')
      .limit(1)

    query =
      source === 'email'
        ? query.eq('email', cleanEmail)
        : query.eq('phone', cleanPhone)

    const { data, error: lookupError } = await query.maybeSingle()

    setIsLoadingExistingData(false)

    if (lookupError || !data) return

    setName(current => current || data.name || '')
    setEmail(current => current || data.email || '')
    setPhone(current => current || data.phone || '')
    setBirthday(current => current || data.birthday || '')
    setSaveData(Boolean(data.save_data))
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    const supabase = createClient()
    const normalizedEmail = normalizeEmail(email)
    const normalizedPhone = normalizePhone(phone)
    const participantPayload = {
      name: name.trim(),
      email: normalizedEmail,
      phone: normalizedPhone || null,
      birthday: birthday || null,
      save_data: saveData,
    }

    let participantId: string
    let existingParticipant: ParticipantLookup | null = null

    const { data: participantByEmail } = await supabase
      .from('participants')
      .select('id, name, email, phone, birthday, save_data')
      .eq('email', normalizedEmail)
      .maybeSingle()

    if (participantByEmail) {
      existingParticipant = participantByEmail
    } else if (normalizedPhone) {
      const { data: participantByPhone } = await supabase
        .from('participants')
        .select('id, name, email, phone, birthday, save_data')
        .eq('phone', normalizedPhone)
        .maybeSingle()

      existingParticipant = participantByPhone || null
    }

    if (existingParticipant) {
      if (
        existingParticipant.email &&
        existingParticipant.email !== normalizedEmail &&
        normalizedPhone &&
        existingParticipant.phone === normalizedPhone
      ) {
        setError('Esse telefone já está vinculado a outro cadastro. Use o email já cadastrado ou informe outro número.')
        setIsSubmitting(false)
        return
      }

      participantId = existingParticipant.id
      const { error: updateParticipantError } = await supabase
        .from('participants')
        .update(participantPayload)
        .eq('id', participantId)

      if (updateParticipantError) {
        setError('Não foi possível atualizar seus dados. Tente novamente.')
        setIsSubmitting(false)
        return
      }
    } else {
      const { data: newParticipant, error: participantError } = await supabase
        .from('participants')
        .insert(participantPayload)
        .select('id')
        .single()

      if (participantError || !newParticipant) {
        setError('Erro ao processar inscrição. Tente novamente.')
        setIsSubmitting(false)
        return
      }
      participantId = newParticipant.id
    }

    const { data: existingRegistration } = await supabase
      .from('registrations')
      .select('id')
      .eq('event_id', eventId)
      .eq('participant_id', participantId)
      .maybeSingle()

    const { data: existingRegistrationByEmail } = await supabase
      .from('registrations')
      .select('id')
      .eq('event_id', eventId)
      .eq('email', normalizedEmail)
      .maybeSingle()

    if (existingRegistration || existingRegistrationByEmail) {
      setError('Você já está inscrita neste evento com esse cadastro.')
      setIsSubmitting(false)
      return
    }

    // Create registration
    const { error: registrationError } = await supabase
      .from('registrations')
      .insert({
        event_id: eventId,
        participant_id: participantId,
        name: participantPayload.name,
        email: participantPayload.email,
        phone: participantPayload.phone,
        status: isFull ? 'waitlist' : 'confirmed',
      })

    if (registrationError) {
      setError('Erro ao processar inscrição. Tente novamente.')
      setIsSubmitting(false)
      return
    }

    if (saveData) {
      window.localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          name: participantPayload.name,
          email: participantPayload.email,
          phone: participantPayload.phone || '',
          birthday: participantPayload.birthday || '',
          saveData,
        }),
      )
    } else {
      window.localStorage.removeItem(STORAGE_KEY)
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
          {isFull ? 'Você está na lista de espera!' : 'Inscrição confirmada!'}
        </h3>
        <p className="text-sm text-muted-foreground">
          {isFull
            ? 'Entraremos em contato se uma vaga for liberada.'
            : 'Inscrição realizada com sucesso!'}
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
          value={name}
          onChange={(e) => setName(e.target.value)}
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
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onBlur={() => void prefillParticipant('email', email)}
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
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          onBlur={() => void prefillParticipant('phone', phone)}
          className="rounded-xl"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="birthday" className="text-foreground">
          Data de aniversário (opcional)
        </Label>
        <Input
          id="birthday"
          name="birthday"
          type="date"
          value={birthday}
          onChange={(e) => setBirthday(e.target.value)}
          className="rounded-xl"
        />
        <p className="text-xs text-muted-foreground">
          Se você quiser, podemos usar essa informação para mensagens especiais, como aniversário.
        </p>
      </div>

      <div className="space-y-3 rounded-2xl border border-border bg-secondary/20 p-4">
        <div className="flex items-start gap-3">
          <Checkbox
            id="save_data"
            checked={saveData}
            onCheckedChange={(checked) => setSaveData(checked === true)}
          />
          <div className="space-y-1">
            <Label htmlFor="save_data" className="text-foreground">
              Salvar meus dados para próximas inscrições
            </Label>
            <p className="text-xs text-muted-foreground">
              Assim você não precisa preencher tudo de novo quando participar de outros encontros.
            </p>
          </div>
        </div>
      </div>

      {isLoadingExistingData && (
        <p className="text-xs text-muted-foreground">
          Verificando se já existe um cadastro com esses dados...
        </p>
      )}

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
            : 'Confirmar inscrição'}
      </Button>

      <p className="text-xs text-muted-foreground text-center">
        Ao se inscrever, você concorda em receber comunicações sobre este evento.
      </p>
    </form>
  )
}
