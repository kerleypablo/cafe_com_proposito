'use client'

import { useEffect, useMemo, useState } from 'react'
import { Gift, Shuffle, Sparkles, Trophy, Users } from 'lucide-react'
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
}

interface RafflePanelProps {
  events: EventOption[]
  registrations: RegistrationOption[]
}

type Mode = 'participant' | 'number'

const CONFETTI_COLORS = ['#d98b58', '#d46f7d', '#d1a84e', '#7ea28d', '#b87443']

export function RafflePanel({ events, registrations }: RafflePanelProps) {
  const [mode, setMode] = useState<Mode>('participant')
  const [selectedEventId, setSelectedEventId] = useState(events[0]?.id ?? '')
  const [maxNumber, setMaxNumber] = useState('100')
  const [rollingLabel, setRollingLabel] = useState('Pronto para sortear')
  const [winner, setWinner] = useState<{ title: string; subtitle: string } | null>(null)
  const [isRolling, setIsRolling] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)
  const [wheelRotation, setWheelRotation] = useState(0)

  const registrationsForEvent = useMemo(
    () => registrations.filter((registration) => registration.event_id === selectedEventId),
    [registrations, selectedEventId],
  )

  useEffect(() => {
    if (!showConfetti) return

    const timeout = setTimeout(() => setShowConfetti(false), 3400)
    return () => clearTimeout(timeout)
  }, [showConfetti])

  async function runRollingAnimation(values: string[], onFinish: (finalValue: string) => void) {
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

    const finalValue = values[Math.floor(Math.random() * values.length)]
    setRollingLabel(finalValue)
    onFinish(finalValue)
    setShowConfetti(true)
    setIsRolling(false)
  }

  async function handleParticipantRaffle() {
    if (registrationsForEvent.length === 0) return

    const labels = registrationsForEvent.map((registration) => registration.name)
    await runRollingAnimation(labels, (finalName) => {
      const selected = registrationsForEvent.find((registration) => registration.name === finalName)
      setWinner({
        title: finalName,
        subtitle: selected?.email || 'Participante sorteada',
      })
    })
  }

  async function handleNumberRaffle() {
    const max = Number(maxNumber)
    if (!Number.isFinite(max) || max < 1) return

    const values = Array.from({ length: max }, (_, index) => String(index + 1))
    await runRollingAnimation(values, (finalNumber) => {
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
          disabled: isRolling || registrationsForEvent.length === 0,
          icon: Gift,
        }
      : {
          label: 'Sortear número',
          onClick: handleNumberRaffle,
          disabled: isRolling || !Number(maxNumber),
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
                  <Select value={selectedEventId} onValueChange={setSelectedEventId}>
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
                    {registrationsForEvent.length} inscrita(s) confirmada(s) para este sorteio.
                  </p>
                </div>

              </div>
            ) : (
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Número máximo</label>
                  <Input
                    type="number"
                    min="1"
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
              <div className="pointer-events-none absolute inset-0 overflow-hidden">
                <div className="raffle-glow absolute inset-0" />
                {Array.from({ length: 28 }).map((_, index) => (
                  <span
                    key={index}
                    className="raffle-confetti"
                    style={{
                      left: `${3 + index * 3.4}%`,
                      animationDelay: `${(index % 7) * 0.07}s`,
                      backgroundColor: CONFETTI_COLORS[index % CONFETTI_COLORS.length],
                    }}
                  />
                ))}
                {Array.from({ length: 10 }).map((_, index) => (
                  <span
                    key={`spark-${index}`}
                    className="raffle-spark"
                    style={{
                      left: `${12 + index * 8}%`,
                      top: `${18 + (index % 3) * 14}%`,
                      animationDelay: `${index * 0.08}s`,
                    }}
                  />
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
