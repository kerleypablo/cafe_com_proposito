'use client'

import { useEffect, useState } from 'react'

interface NextEventCountdownProps {
  date: string
  time: string
}

interface CountdownParts {
  days: number
  hours: number
  minutes: number
}

function getCountdownParts(date: string, time: string): CountdownParts {
  const target = new Date(`${date}T${time}`)
  const now = new Date()
  const diff = Math.max(target.getTime() - now.getTime(), 0)

  const totalMinutes = Math.floor(diff / (1000 * 60))
  const days = Math.floor(totalMinutes / (60 * 24))
  const hours = Math.floor((totalMinutes % (60 * 24)) / 60)
  const minutes = totalMinutes % 60

  return { days, hours, minutes }
}

export function NextEventCountdown({ date, time }: NextEventCountdownProps) {
  const [countdown, setCountdown] = useState(() => getCountdownParts(date, time))

  useEffect(() => {
    const timer = window.setInterval(() => {
      setCountdown(getCountdownParts(date, time))
    }, 60_000)

    return () => window.clearInterval(timer)
  }, [date, time])

  return (
    <div className="grid grid-cols-3 gap-3">
      <div className="rounded-2xl border border-white/20 bg-white/10 p-4 text-center backdrop-blur-sm">
        <p className="text-3xl font-bold text-white md:text-4xl">{countdown.days}</p>
        <p className="text-xs uppercase tracking-[0.3em] text-white/70">dias</p>
      </div>
      <div className="rounded-2xl border border-white/20 bg-white/10 p-4 text-center backdrop-blur-sm">
        <p className="text-3xl font-bold text-white md:text-4xl">{countdown.hours}</p>
        <p className="text-xs uppercase tracking-[0.3em] text-white/70">horas</p>
      </div>
      <div className="rounded-2xl border border-white/20 bg-white/10 p-4 text-center backdrop-blur-sm">
        <p className="text-3xl font-bold text-white md:text-4xl">{countdown.minutes}</p>
        <p className="text-xs uppercase tracking-[0.3em] text-white/70">min</p>
      </div>
    </div>
  )
}
