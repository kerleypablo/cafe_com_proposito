'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Check, X } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'

type AttendanceStatus = 'pending' | 'present' | 'absent'

interface AttendanceToggleButtonProps {
  registrationId: string
  participantName: string
  attendanceStatus: AttendanceStatus
}

export function AttendanceToggleButton({
  registrationId,
  participantName,
  attendanceStatus,
}: AttendanceToggleButtonProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  async function handleSetAttendance(nextStatus: AttendanceStatus) {
    setIsLoading(true)
    const supabase = createClient()

    await supabase
      .from('registrations')
      .update({
        attended: nextStatus === 'present',
        attended_at: nextStatus === 'present' ? new Date().toISOString() : null,
        attendance_status: nextStatus,
      })
      .eq('id', registrationId)

    router.refresh()
    setIsLoading(false)
  }

  const isAbsent = attendanceStatus === 'absent'

  return (
    <Button
      type="button"
      variant={isAbsent ? 'default' : 'outline'}
      size="sm"
      disabled={isLoading}
      onClick={() => handleSetAttendance(isAbsent ? 'present' : 'absent')}
      className="h-8 rounded-full px-3 text-xs"
      aria-label={isAbsent ? `Confirmar presenca de ${participantName}` : `Marcar ${participantName} como ausente`}
      title={isAbsent ? 'Confirmar presenca' : 'Ausente'}
    >
      {isAbsent ? (
        <>
          <Check className="size-3.5" />
          Confirmar presenca
        </>
      ) : (
        <>
          <X className="size-3.5" />
          Ausente
        </>
      )}
    </Button>
  )
}
