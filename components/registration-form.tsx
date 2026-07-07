'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { buildWhatsappLink } from '@/lib/whatsapp'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { CheckCircle, CircleAlert, MessageCircle } from 'lucide-react'

interface RegistrationFormProps {
  eventId: string
  eventTitle: string
  isFull: boolean
  isPaid: boolean
  paymentAmount: number | null
  paymentInstructions: string | null
  paymentQrCodeUrl: string | null
  paymentWhatsapp: string | null
}

interface ParticipantLookup {
  id: string
  name: string
  email: string | null
  phone: string | null
  birthday?: string | null
  save_data?: boolean | null
}

type RegistrationStep = 'form' | 'payment'

const STORAGE_KEY = 'cafe_com_proposito_participant'

function normalizeEmail(value: string) {
  return value.trim().toLowerCase()
}

function normalizePhone(value: string) {
  const digits = value.replace(/\D/g, '')
  return digits || ''
}

function formatCurrency(value: number | null) {
  if (typeof value !== 'number' || Number.isNaN(value)) return null
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value)
}

export function RegistrationForm({
  eventId,
  eventTitle,
  isFull,
  isPaid,
  paymentAmount,
  paymentInstructions,
  paymentQrCodeUrl,
  paymentWhatsapp,
}: RegistrationFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [currentStep, setCurrentStep] = useState<RegistrationStep>('form')
  const [error, setError] = useState<string | null>(null)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [birthday, setBirthday] = useState('')
  const [saveData, setSaveData] = useState(false)
  const [isLoadingExistingData, setIsLoadingExistingData] = useState(false)
  const hydratedRef = useRef(false)
  const submitLockRef = useRef(false)

  const formattedPaymentAmount = formatCurrency(paymentAmount)
  const paymentWhatsappLink = buildWhatsappLink(paymentWhatsapp)

  useEffect(() => {
    if (hydratedRef.current) return
    hydratedRef.current = true

    try {
      const stored = window.localStorage.getItem(STORAGE_KEY)
      if (!stored) return

      const parsed = JSON.parse(stored)
      setName(parsed.name || '')
      setEmail(parsed.email || '')
      setPhone(parsed.phone || '')
      setBirthday(parsed.birthday || '')
      setSaveData(Boolean(parsed.saveData))
    } catch {
      try {
        window.localStorage.removeItem(STORAGE_KEY)
      } catch {
        // Some mobile in-app browsers block localStorage. Registration still works without it.
      }
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

    setName((current) => current || data.name || '')
    setEmail((current) => current || data.email || '')
    setPhone((current) => current || data.phone || '')
    setBirthday((current) => current || data.birthday || '')
    setSaveData(Boolean(data.save_data))
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    if (submitLockRef.current) return

    submitLockRef.current = true
    setIsSubmitting(true)
    setError(null)

    const supabase = createClient()
    const normalizedEmail = normalizeEmail(email)
    const normalizedPhone = normalizePhone(phone)

    const finishWithError = (message: string) => {
      setError(message)
      setIsSubmitting(false)
      submitLockRef.current = false
    }

    const [{ data: eventData, error: eventError }, { count: registrationCount, error: countError }] =
      await Promise.all([
        supabase
          .from('events')
          .select('max_participants, is_paid')
          .eq('id', eventId)
          .maybeSingle(),
        supabase
          .from('registrations')
          .select('*', { count: 'exact', head: true })
          .eq('event_id', eventId),
      ])

    const maxParticipants = eventData?.max_participants ?? null
    const registrationsReachedLimit =
      typeof maxParticipants === 'number' &&
      maxParticipants > 0 &&
      (registrationCount || 0) >= maxParticipants

    if (eventError || countError || !eventData) {
      finishWithError('Não foi possível validar as vagas disponíveis. Tente novamente.')
      return
    }

    if (registrationsReachedLimit || isFull) {
      finishWithError('As inscrições para este evento já foram encerradas.')
      return
    }

    if (!normalizedPhone) {
      finishWithError('Informe seu WhatsApp para continuar.')
      return
    }

    const participantPayload = {
      name: name.trim(),
      email: normalizedEmail || null,
      phone: normalizedPhone,
      birthday: birthday || null,
      save_data: saveData,
    }

    let participantId: string
    let existingParticipant: ParticipantLookup | null = null

    const { data: participantByPhone } = await supabase
      .from('participants')
      .select('id, name, email, phone, birthday, save_data')
      .eq('phone', normalizedPhone)
      .maybeSingle()

    if (participantByPhone) {
      existingParticipant = participantByPhone
    } else if (normalizedEmail) {
      const { data: participantByEmail } = await supabase
        .from('participants')
        .select('id, name, email, phone, birthday, save_data')
        .eq('email', normalizedEmail)
        .maybeSingle()

      existingParticipant = participantByEmail || null
    }

    if (existingParticipant) {
      if (
        existingParticipant.email &&
        normalizedEmail &&
        existingParticipant.email !== normalizedEmail &&
        existingParticipant.phone === normalizedPhone
      ) {
        finishWithError('Esse telefone já está vinculado a outro cadastro. Use o email já cadastrado ou informe outro número.')
        return
      }

      if (normalizedEmail && existingParticipant.email !== normalizedEmail) {
        const { data: participantWithEmail } = await supabase
          .from('participants')
          .select('id')
          .eq('email', normalizedEmail)
          .neq('id', existingParticipant.id)
          .maybeSingle()

        if (participantWithEmail) {
          finishWithError('Esse email já está vinculado a outro cadastro. Informe outro email ou deixe esse campo em branco.')
          return
        }
      }

      participantId = existingParticipant.id
      const { error: updateParticipantError } = await supabase
        .from('participants')
        .update(participantPayload)
        .eq('id', participantId)

      if (updateParticipantError) {
        finishWithError('Não foi possível atualizar seus dados. Tente novamente.')
        return
      }
    } else {
      const { data: newParticipant, error: participantError } = await supabase
        .from('participants')
        .insert(participantPayload)
        .select('id')
        .single()

      if (participantError || !newParticipant) {
        const { data: participantCreatedInParallel } = await supabase
          .from('participants')
          .select('id')
          .eq('phone', normalizedPhone)
          .maybeSingle()

        if (!participantCreatedInParallel) {
          finishWithError('Erro ao processar inscrição. Tente novamente.')
          return
        }

        participantId = participantCreatedInParallel.id
      } else {
        participantId = newParticipant.id
      }
    }

    const { data: existingRegistration } = await supabase
      .from('registrations')
      .select('id')
      .eq('event_id', eventId)
      .eq('participant_id', participantId)
      .maybeSingle()

    const existingRegistrationByEmail = normalizedEmail
      ? (
        await supabase
          .from('registrations')
          .select('id')
          .eq('event_id', eventId)
          .eq('email', normalizedEmail)
          .maybeSingle()
      ).data
      : null

    const { data: existingRegistrationByPhone } = await supabase
      .from('registrations')
      .select('id')
      .eq('event_id', eventId)
      .eq('phone', normalizedPhone)
      .maybeSingle()

    if (
      existingRegistration ||
      existingRegistrationByEmail ||
      existingRegistrationByPhone
    ) {
      finishWithError('Você já está inscrita neste evento com esse cadastro.')
      return
    }

    const eventIsPaid = Boolean(eventData.is_paid)

    const { error: registrationError } = await supabase
      .from('registrations')
      .insert({
        event_id: eventId,
        participant_id: participantId,
        name: participantPayload.name,
        email: participantPayload.email,
        phone: participantPayload.phone,
        status: 'confirmed',
        attended: true,
        attendance_status: 'present',
        payment_confirmed: eventIsPaid ? false : null,
      })

    if (registrationError) {
      if (registrationError.code === '23505') {
        finishWithError('Você já está inscrita neste evento com esse cadastro.')
      } else {
        finishWithError('Erro ao processar inscrição. Tente novamente.')
      }
      return
    }

    try {
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
    } catch {
      // Ignore storage failures in private or embedded mobile browsers.
    }

    if (eventIsPaid) {
      setCurrentStep('payment')
    } else {
      setIsSuccess(true)
    }

    setIsSubmitting(false)
    submitLockRef.current = false
  }

  if (isSuccess) {
    return (
      <div className="py-4 text-center">
        <div className="mb-3 inline-flex size-12 items-center justify-center rounded-full bg-primary/10">
          <CheckCircle className="size-6 text-primary" />
        </div>
        <h3 className="mb-2 font-serif text-lg font-semibold text-foreground">
          Inscrição confirmada!
        </h3>
        <p className="text-sm text-muted-foreground">
          Inscrição realizada com sucesso!
        </p>
      </div>
    )
  }

  if (isFull) {
    return (
      <div className="rounded-2xl border border-border bg-secondary/30 p-5 text-center">
        <div className="mb-3 inline-flex size-12 items-center justify-center rounded-full bg-primary/10">
          <CircleAlert className="size-6 text-primary" />
        </div>
        <p className="font-medium text-foreground">Inscrições encerradas.</p>
        <p className="mt-2 text-sm text-muted-foreground">
          Este evento continua visível, mas não aceita novas inscrições.
        </p>
      </div>
    )
  }

  if (currentStep === 'payment') {
    return (
      <div className="space-y-4">
        <div className="rounded-2xl border border-primary/20 bg-primary/5 p-4">
          <h3 className="font-serif text-lg font-semibold text-foreground">
            Inscrição recebida
          </h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Sua vaga em {eventTitle} foi registrada. Agora finalize o pagamento e envie o comprovante para concluir a confirmação.
          </p>
        </div>

        {formattedPaymentAmount && (
          <div className="rounded-2xl border border-border bg-secondary/20 p-4 text-center">
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Valor</p>
            <p className="mt-2 font-serif text-3xl text-primary">{formattedPaymentAmount}</p>
          </div>
        )}

        {paymentInstructions && (
          <div className="rounded-2xl border border-border bg-card p-4">
            <p className="text-sm whitespace-pre-wrap text-foreground">{paymentInstructions}</p>
          </div>
        )}

        {paymentQrCodeUrl && (
          <div className="overflow-hidden rounded-2xl border border-border bg-card p-4">
            <img src={paymentQrCodeUrl} alt="QR code para pagamento do evento" className="mx-auto h-auto w-full max-w-xs object-contain" />
          </div>
        )}

        {formattedPaymentAmount && (
          <div className="rounded-2xl border border-border bg-card p-4">
            <p className="text-sm font-medium text-foreground">Valor a pagar</p>
            <p className="mt-1 text-sm text-muted-foreground">{formattedPaymentAmount}</p>
          </div>
        )}

        {paymentWhatsappLink && (
          <Button asChild className="w-full rounded-full">
            <Link href={paymentWhatsappLink} target="_blank" rel="noreferrer">
              <MessageCircle className="size-4" />
              Enviar comprovante pelo WhatsApp
            </Link>
          </Button>
        )}

        <p className="text-center text-xs text-muted-foreground">
          Assim que o comprovante for conferido, a administradora marcará seu pagamento como confirmado.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {isPaid && (
        <div className="rounded-2xl border border-primary/20 bg-primary/5 p-4">
          <p className="text-sm font-medium text-foreground">Este é um evento pago.</p>
          <p className="mt-2 text-sm text-muted-foreground">
            {paymentInstructions || 'Depois de preencher seus dados, você verá as instruções de pagamento e o QR code para enviar o comprovante.'}
          </p>
          {formattedPaymentAmount && (
            <p className="mt-3 text-sm font-semibold text-primary">
              Valor da inscrição: {formattedPaymentAmount}
            </p>
          )}
        </div>
      )}

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
            Email (opcional)
          </Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="seu@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onBlur={() => void prefillParticipant('email', email)}
            className="rounded-xl"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone" className="text-foreground">
            Celular *
          </Label>
          <Input
            id="phone"
            name="phone"
            type="tel"
            placeholder="(00) 00000-0000"
            required
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
            : isPaid
              ? 'Continuar para pagamento'
              : 'Confirmar inscrição'}
        </Button>

        <p className="text-center text-xs text-muted-foreground">
          Ao se inscrever, você concorda em receber comunicações sobre este evento.
        </p>
      </form>
    </div>
  )
}
