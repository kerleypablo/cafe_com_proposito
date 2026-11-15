'use client'

import { useEffect, useMemo, useState, type CSSProperties } from 'react'
import { ChevronDown, Gift, History, Shuffle, Sparkles, Trophy, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { createClient } from '@/lib/supabase/client'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'

interface EventOption {
  id: string
  title: string
  date: string
}

interface RegistrationOption {
  id: string
  name: string
  email: string | null
  event_id: string
  participant_id: string | null
}

interface RaffleResult {
  id: string
  registration_id: string
  event_id: string
  participant_id: string | null
  outcome: 'won' | 'absent'
  active: boolean
  name: string
  created_at: string
}

interface RafflePanelProps {
  events: EventOption[]
  registrations: RegistrationOption[]
  results: RaffleResult[]
  historyError: boolean
}

type Mode = 'participant' | 'number'

const CONFETTI_COLORS = ['#d9895b', '#e6b865', '#c86e7d', '#92aa8c', '#f5d9b3', '#fff5e8']

export function RafflePanel({ events, registrations, results: initialResults, historyError }: RafflePanelProps) {
  const [mode, setMode] = useState<Mode>('participant')
  const [selectedEventId, setSelectedEventId] = useState(events[0]?.id ?? '')
  const [maxNumber, setMaxNumber] = useState('100')
  const [rollingLabel, setRollingLabel] = useState('Pronto para sortear')
  const [winner, setWinner] = useState<{ title: string; subtitle: string } | null>(null)
  const [isRolling, setIsRolling] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)
  const [celebration, setCelebration] = useState(0)
  const [wheelRotation, setWheelRotation] = useState(0)
  const [results, setResults] = useState(initialResults)
  const [pending, setPending] = useState<RegistrationOption | null>(null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const registrationsForEvent = useMemo(
    () => registrations.filter((registration) => registration.event_id === selectedEventId),
    [registrations, selectedEventId],
  )
  const eligible = useMemo(() => registrationsForEvent.filter((registration) =>
    !results.some((result) => result.active && result.event_id === selectedEventId &&
      (result.registration_id === registration.id ||
        (registration.participant_id && result.participant_id === registration.participant_id)))
  ), [registrationsForEvent, results, selectedEventId])
  const eventHistory = useMemo(() => results
    .filter((result) => result.event_id === selectedEventId)
    .sort((a, b) => b.created_at.localeCompare(a.created_at)), [results, selectedEventId])

  useEffect(() => {
    if (!showConfetti) return

    const timeout = setTimeout(() => setShowConfetti(false), 5200)
    return () => clearTimeout(timeout)
  }, [showConfetti, celebration])

  function celebrate() {
    setCelebration((count) => count + 1)
    setShowConfetti(true)
  }

  async function runRollingAnimation(values: string[], finalValue: string, onFinish: () => void) {
    setIsRolling(true)
    setWinner(null)
    setShowConfetti(false)

    const duration = 8000
    const interval = 120
    const steps = Math.floor(duration / interval)
    const extraTurns = 8 + Math.floor(Math.random() * 4)
    const finalRotation = wheelRotation + extraTurns * 360 + Math.floor(Math.random() * 360)

    setWheelRotation(finalRotation)

    for (let index = 0; index < steps; index += 1) {
      const randomValue = values[Math.floor(Math.random() * values.length)]
      setRollingLabel(randomValue)
      await new Promise((resolve) => setTimeout(resolve, interval))
    }

    setRollingLabel(finalValue)
    onFinish()
    celebrate()
    setIsRolling(false)
  }

  function randomFraction() {
    const value = new Uint32Array(1)
    crypto.getRandomValues(value)
    return value[0] / 0x100000000
  }

  async function handleParticipantRaffle() {
    if (!eligible.length || pending || historyError) return
    const weighted = eligible.map((registration) => {
      const wins = registration.participant_id
        ? results.filter((result) => result.outcome === 'won' && result.participant_id === registration.participant_id).length
        : results.filter((result) => result.outcome === 'won' && result.registration_id === registration.id).length
      return { registration, weight: Math.max(0.5, 1 - wins * 0.1) }
    })
    let ticket = randomFraction() * weighted.reduce((sum, item) => sum + item.weight, 0)
    const selected = weighted.find((item) => (ticket -= item.weight) < 0)?.registration ?? weighted[weighted.length - 1].registration
    await runRollingAnimation(eligible.map((registration) => registration.name), selected.name, () => {
      setPending(selected)
      setWinner({ title: selected.name, subtitle: selected.email || 'Participante sorteada' })
    })
  }

  async function recordOutcome(outcome: 'won' | 'absent') {
    if (!pending || saving) return
    setSaving(true)
    setError('')
    const result = { registration_id: pending.id, event_id: pending.event_id, participant_id: pending.participant_id, outcome }
    const { data: saved, error: saveError } = await createClient().from('raffle_results').insert(result).select('id, created_at').single()
    if (saveError) {
      setError('Não foi possível salvar o resultado. Confira a conexão e tente novamente.')
    } else {
      setResults((current) => [...current, { ...result, id: saved.id, active: true, name: pending.name, created_at: saved.created_at }])
      setPending(null)
      setWinner({ title: pending.name, subtitle: outcome === 'won' ? 'Vitória registrada. Fora das próximas rodadas deste evento.' : 'Ausência registrada. Fora das próximas rodadas deste evento.' })
      if (outcome === 'won') celebrate()
    }
    setSaving(false)
  }

  async function resetRaffle() {
    if (!selectedEventId || saving || isRolling || pending) return
    setSaving(true)
    setError('')
    const { error: resetError } = await createClient().from('raffle_results')
      .update({ active: false }).eq('event_id', selectedEventId).eq('active', true)
    if (resetError) {
      setError('Não foi possível liberar os nomes. Confira a conexão e tente novamente.')
    } else {
      setResults((current) => current.map((result) => result.event_id === selectedEventId ? { ...result, active: false } : result))
      setWinner(null)
      setRollingLabel('Pronto para sortear')
    }
    setSaving(false)
  }

  async function handleNumberRaffle() {
    const max = Number(maxNumber)
    if (!Number.isSafeInteger(max) || max < 1 || max > 1000000) return

    const finalNumber = String(Math.floor(randomFraction() * max) + 1)
    const values = Array.from({ length: Math.min(max, 100) }, () => String(Math.floor(randomFraction() * max) + 1))
    await runRollingAnimation(values, finalNumber, () => {
      setWinner({
        title: `Número ${finalNumber}`,
        subtitle: `Sorteado entre 1 e ${max}`,
      })
    })
  }

  const selectedEvent = events.find((event) => event.id === selectedEventId)
  const primaryAction =
    mode === 'participant'
      ? {
          label: 'Sortear participante',
          onClick: handleParticipantRaffle,
          disabled: isRolling || !!pending || historyError || eligible.length === 0,
          icon: Gift,
        }
      : {
          label: 'Sortear número',
          onClick: handleNumberRaffle,
          disabled: isRolling || !Number.isSafeInteger(Number(maxNumber)) || Number(maxNumber) < 1 || Number(maxNumber) > 1000000,
          icon: Shuffle,
        }
  const PrimaryActionIcon = primaryAction.icon

  return (
    <div className="space-y-6">
      <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <Card className="overflow-hidden">
          <CardHeader className="border-b border-border/70 pb-5">
            <CardTitle className="font-serif text-2xl">Configurar sorteio</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 pt-6">
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setMode('participant')}
                disabled={isRolling || !!pending || saving}
                className={cn(
                  'rounded-2xl border px-4 py-4 text-left transition-colors',
                  mode === 'participant'
                    ? 'border-primary bg-primary/10 text-foreground'
                    : 'border-border bg-background text-muted-foreground'
                )}
              >
                <Users className="mb-3 size-5" />
                <p className="font-medium">Participante</p>
                <p className="mt-1 text-sm">Escolhe alguém inscrito em um evento.</p>
              </button>

              <button
                type="button"
                onClick={() => setMode('number')}
                disabled={isRolling || !!pending || saving}
                className={cn(
                  'rounded-2xl border px-4 py-4 text-left transition-colors',
                  mode === 'number'
                    ? 'border-primary bg-primary/10 text-foreground'
                    : 'border-border bg-background text-muted-foreground'
                )}
              >
                <HashIcon />
                <p className="mt-3 font-medium">Número</p>
                <p className="mt-1 text-sm">Sorteia um número até o limite informado.</p>
              </button>
            </div>

            {mode === 'participant' ? (
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Selecionar evento</label>
                  <Select value={selectedEventId} onValueChange={setSelectedEventId} disabled={isRolling || !!pending || saving}>
                    <SelectTrigger className="w-full rounded-xl">
                      <SelectValue placeholder="Escolha um evento" />
                    </SelectTrigger>
                    <SelectContent>
                      {events.map((event) => (
                        <SelectItem key={event.id} value={event.id}>
                          {event.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="rounded-2xl border border-border/70 bg-secondary/30 p-4">
                  <p className="text-sm font-medium text-foreground">
                    {selectedEvent ? selectedEvent.title : 'Nenhum evento selecionado'}
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {eligible.length} disponível(is) de {registrationsForEvent.length} inscrita(s) confirmada(s).
                  </p>
                </div>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button type="button" variant="outline" className="w-full rounded-xl" disabled={isRolling || !!pending || saving || historyError || !eventHistory.some((result) => result.active)}>
                      Liberar nomes para sortear novamente
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Liberar os nomes deste evento?</AlertDialogTitle>
                      <AlertDialogDescription>As pessoas sorteadas voltarão a participar das próximas rodadas. O histórico será mantido.</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                      <AlertDialogAction onClick={resetRaffle}>Liberar nomes</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
                {error && !pending && <p role="alert" className="text-sm text-destructive">{error}</p>}
                {historyError && <p className="text-sm text-destructive">Não foi possível carregar o histórico de sorteios. Verifique a configuração do banco e atualize a página.</p>}

              </div>
            ) : (
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Número máximo</label>
                  <Input
                    type="number"
                    min="1"
                    max="1000000"
                    step="1"
                    value={maxNumber}
                    onChange={(event) => setMaxNumber(event.target.value)}
                    className="rounded-xl"
                  />
                </div>

                <div className="rounded-2xl border border-border/70 bg-secondary/30 p-4">
                  <p className="text-sm font-medium text-foreground">Faixa do sorteio</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Será sorteado um número aleatório entre 1 e {maxNumber || '0'}.
                  </p>
                </div>

              </div>
            )}
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden border-primary/20 bg-[radial-gradient(circle_at_top,_rgba(217,139,88,0.18),_transparent_48%),linear-gradient(180deg,#fffaf5_0%,#f6ede2_100%)]">
          <CardHeader className="border-b border-border/50 pb-5">
            <CardTitle className="flex items-center gap-2 font-serif text-2xl">
              <Trophy className="size-5 text-primary" />
              Resultado do sorteio
            </CardTitle>
          </CardHeader>
          <CardContent className="relative min-h-[26rem] px-6 py-8">
            {showConfetti && (
              <div key={celebration} aria-hidden="true" className="pointer-events-none absolute inset-0 z-30 overflow-hidden">
                <div className="raffle-glow absolute inset-0" />
                {Array.from({ length: 56 }).map((_, index) => (
                  <span
                    key={index}
                    className="raffle-confetti"
                    style={{
                      left: `${(index * 37 + 5) % 100}%`,
                      '--confetti-delay': `${(index % 14) * 0.11}s`,
                      '--confetti-duration': `${3.2 + (index % 7) * 0.19}s`,
                      '--confetti-drift': `${(index % 2 ? 1 : -1) * (18 + (index % 5) * 9)}px`,
                      '--confetti-color': CONFETTI_COLORS[index % CONFETTI_COLORS.length],
                      '--confetti-width': `${5 + (index % 3) * 2}px`,
                      '--confetti-height': `${8 + (index % 4) * 3}px`,
                      '--confetti-radius': index % 4 === 0 ? '50%' : '2px',
                      '--confetti-spin': `${0.65 + (index % 5) * 0.14}s`,
                    } as CSSProperties}
                  ><span /></span>
                ))}
              </div>
            )}

            <div className="flex min-h-[20rem] flex-col items-center justify-center text-center">
              <div className="mb-8 flex flex-col items-center">
                <div className="relative">
                  <div className="absolute left-1/2 top-[-14px] z-20 h-0 w-0 -translate-x-1/2 border-l-[12px] border-r-[12px] border-t-0 border-b-[20px] border-l-transparent border-r-transparent border-b-[#6e3f29]" />
                  <div
                    className="relative size-52 rounded-full border-[10px] border-[#f5dfc8] shadow-[0_26px_70px_-40px_rgba(0,0,0,0.45)] md:size-64"
                    style={{
                      background:
                        'conic-gradient(#d98b58 0deg 45deg, #f2c38d 45deg 90deg, #d46f7d 90deg 135deg, #f0d5bb 135deg 180deg, #b87443 180deg 225deg, #f2c38d 225deg 270deg, #d98b58 270deg 315deg, #e8b37e 315deg 360deg)',
                      transform: `rotate(${wheelRotation}deg)`,
                      transition: isRolling ? 'transform 8s cubic-bezier(0.12, 0.82, 0.18, 1)' : 'transform 0.8s ease',
                    }}
                  >
                    <div className="absolute inset-[18%] rounded-full border border-white/50 bg-white/20 backdrop-blur-sm" />
                    <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_center,transparent_0_36%,rgba(255,255,255,0.12)_36%_38%,transparent_38%)]" />
                  </div>
                  <div className="absolute left-1/2 top-1/2 z-20 flex size-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-4 border-[#f5dfc8] bg-[#6e3f29] text-white shadow-lg">
                    <Sparkles className={cn('size-7', isRolling && 'animate-pulse')} />
                  </div>
                </div>
              </div>

              <div className={cn(
                'w-full max-w-xl rounded-[2rem] border border-white/60 bg-white/80 px-6 py-10 shadow-[0_24px_80px_-50px_rgba(0,0,0,0.28)] transition-all duration-500',
                showConfetti && 'raffle-winner-card'
              )}>
                <p className="text-sm uppercase tracking-[0.35em] text-primary/70">
                  {isRolling ? 'Sorteando...' : winner ? 'Resultado' : 'Pronto'}
                </p>

                <div className="mt-5 min-h-[5.5rem]">
                  <h2
                    className={cn(
                      'font-serif text-4xl leading-tight text-foreground md:text-5xl',
                      isRolling && 'animate-pulse'
                    )}
                  >
                    {rollingLabel}
                  </h2>
                </div>

                <p className="mt-4 min-h-6 text-sm text-muted-foreground">
                  {winner?.subtitle ||
                    (mode === 'participant'
                      ? 'Escolha um evento e inicie o sorteio.'
                      : 'Defina o limite máximo e inicie o sorteio.')}
                </p>

                {pending && (
                  <div className="mt-6 space-y-3">
                    <p className="text-sm">Confirme o resultado antes de sortear novamente.</p>
                    <div className="flex gap-3">
                      <Button type="button" className="flex-1" disabled={saving} onClick={() => recordOutcome('won')}>Ganhou</Button>
                      <Button type="button" variant="outline" className="flex-1" disabled={saving} onClick={() => recordOutcome('absent')}>Ausente</Button>
                    </div>
                    {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
                  </div>
                )}
                <Button
                  type="button"
                  onClick={primaryAction.onClick}
                  disabled={primaryAction.disabled}
                  className="mt-8 w-full rounded-full"
                >
                  <PrimaryActionIcon className="size-4" />
                  {primaryAction.label}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {mode === 'participant' && (
        <Collapsible asChild>
          <Card>
            <CollapsibleTrigger className="group flex w-full items-center justify-between gap-4 rounded-xl px-6 py-5 text-left hover:bg-secondary/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
              <span className="flex items-center gap-3">
                <History className="size-5 text-primary" />
                <span>
                  <span className="block font-serif text-xl font-semibold">Histórico do sorteio</span>
                  <span className="block text-sm text-muted-foreground">{selectedEvent?.title || 'Selecione um evento'} · {eventHistory.length} resultado(s)</span>
                </span>
              </span>
              <ChevronDown className="size-5 shrink-0 text-muted-foreground transition-transform group-data-[state=open]:rotate-180" />
            </CollapsibleTrigger>
            <CollapsibleContent>
              <CardContent className="border-t border-border/70 pt-4">
                {historyError ? (
                  <p className="text-sm text-destructive">Não foi possível carregar o histórico.</p>
                ) : eventHistory.length === 0 ? (
                  <p className="text-sm text-muted-foreground">Nenhum resultado registrado neste evento.</p>
                ) : (
                  <ul className="divide-y divide-border/70">
                    {eventHistory.map((result) => (
                      <li key={result.id} className="flex items-center justify-between gap-4 py-3 first:pt-0 last:pb-0">
                        <span className="font-medium">{result.name}</span>
                        <span className={cn('shrink-0 rounded-full px-3 py-1 text-xs font-medium', result.outcome === 'won' ? 'bg-emerald-100 text-emerald-800' : 'bg-muted text-muted-foreground')}>
                          {result.outcome === 'won' ? 'Ganhou' : 'Ausente'}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </CardContent>
            </CollapsibleContent>
          </Card>
        </Collapsible>
      )}
    </div>
  )
}

function HashIcon() {
  return (
    <div className="flex size-5 items-center justify-center rounded-md border border-current/20 text-current">
      <span className="text-xs font-bold">#</span>
    </div>
  )
}
