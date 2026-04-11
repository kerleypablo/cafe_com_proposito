'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { MessageCircle } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { buildWhatsappLink } from '@/lib/whatsapp'
import { AttendanceToggleButton } from '@/components/admin/attendance-toggle-button'
import { RegistrationActions } from '@/components/admin/registration-actions'

type AttendanceStatus = 'pending' | 'present' | 'absent'

interface EventRegistration {
  id: string
  event_id: string
  participant_id: string | null
  name: string
  email: string | null
  phone: string | null
  status: string
  attended: boolean
  attendance_status: AttendanceStatus
  created_at: string | null
}

interface EventRegistrationsListProps {
  registrations: EventRegistration[]
  attendanceColumnsAvailable: boolean
  absenceCounts: Record<string, number>
}

function normalizeSearchValue(value: string) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
}

export function EventRegistrationsList({
  registrations,
  attendanceColumnsAvailable,
  absenceCounts,
}: EventRegistrationsListProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const normalizedSearchTerm = normalizeSearchValue(searchTerm)
  const filteredRegistrations = useMemo(
    () =>
      normalizedSearchTerm
        ? registrations.filter((registration) =>
            normalizeSearchValue(registration.name).includes(normalizedSearchTerm),
          )
        : registrations,
    [normalizedSearchTerm, registrations],
  )

  return (
    <div className="space-y-3">
      <Input
        type="search"
        placeholder="Buscar por nome"
        value={searchTerm}
        onChange={(event) => setSearchTerm(event.target.value)}
        className="h-9"
      />

      {!attendanceColumnsAvailable && (
        <p className="rounded-xl bg-muted px-3 py-2 text-xs text-muted-foreground">
          Rode o SQL 014 para habilitar a marcacao de ausentes.
        </p>
      )}

      {filteredRegistrations.length > 0 ? (
        <div className="max-h-96 space-y-3 overflow-y-auto">
          {filteredRegistrations.map((registration) => {
            const statusColor = registration.status === 'confirmed'
              ? 'bg-primary/10 text-primary'
              : registration.status === 'waitlist'
                ? 'bg-accent/20 text-accent'
                : 'bg-muted text-muted-foreground'
            const statusLabel = registration.status === 'confirmed'
              ? 'Confirmado'
              : registration.status === 'waitlist'
                ? 'Lista de espera'
                : 'Cancelado'
            const whatsappLink = buildWhatsappLink(registration.phone)
            const absenceCount = registration.participant_id
              ? absenceCounts[registration.participant_id] || 0
              : 0
            const isAbsent = registration.attendance_status === 'absent'

            return (
              <div
                key={registration.id}
                className="relative min-h-40 rounded-xl bg-secondary/50 p-3 pb-14"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="truncate font-medium text-foreground">
                      {registration.name}
                    </p>
                    {registration.email && (
                      <p className="truncate text-sm text-muted-foreground">
                        {registration.email}
                      </p>
                    )}
                    {registration.phone && (
                      <p className="text-sm text-muted-foreground">
                        {registration.phone}
                      </p>
                    )}
                    <div className="mt-2 flex flex-wrap gap-2 text-[11px]">
                      <span className={`rounded-full px-2 py-1 ${
                        !attendanceColumnsAvailable
                          ? 'bg-muted text-muted-foreground'
                          : isAbsent
                            ? 'bg-destructive/10 text-destructive'
                            : 'bg-primary/10 text-primary'
                      }`}>
                        {!attendanceColumnsAvailable
                          ? 'Ausencia nao habilitada'
                          : isAbsent
                            ? 'Ausente'
                            : 'Presenca confirmada'}
                      </span>
                      {attendanceColumnsAvailable && (
                        <span className="rounded-full bg-muted px-2 py-1 text-muted-foreground">
                          {absenceCount} falta{absenceCount === 1 ? '' : 's'}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    {whatsappLink && (
                      <Link
                        href={whatsappLink}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex size-9 items-center justify-center rounded-full bg-[#25D366]/10 text-[#25D366] transition-colors hover:bg-[#25D366]/20"
                        aria-label={`Conversar com ${registration.name} no WhatsApp`}
                      >
                        <MessageCircle className="size-4" />
                      </Link>
                    )}
                    <span className={`shrink-0 rounded-full px-2 py-1 text-xs ${statusColor}`}>
                      {statusLabel}
                    </span>
                    <RegistrationActions
                      registrationId={registration.id}
                      participantName={registration.name}
                    />
                  </div>
                </div>

                {attendanceColumnsAvailable && registration.status === 'confirmed' && (
                  <div className="absolute bottom-3 right-3">
                    <AttendanceToggleButton
                      registrationId={registration.id}
                      participantName={registration.name}
                      attendanceStatus={registration.attendance_status}
                    />
                  </div>
                )}
              </div>
            )
          })}
        </div>
      ) : (
        <p className="py-4 text-center text-muted-foreground">
          {searchTerm ? 'Nenhuma inscricao encontrada com esse nome.' : 'Nenhuma inscricao ainda'}
        </p>
      )}
    </div>
  )
}
