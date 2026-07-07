'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Banknote, BadgeCheck } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'

interface PaymentToggleButtonProps {
  registrationId: string
  participantName: string
  paymentConfirmed: boolean
}

export function PaymentToggleButton({
  registrationId,
  participantName,
  paymentConfirmed,
}: PaymentToggleButtonProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  async function handleTogglePayment() {
    setIsLoading(true)
    const supabase = createClient()

    await supabase
      .from('registrations')
      .update({
        payment_confirmed: !paymentConfirmed,
        payment_confirmed_at: !paymentConfirmed ? new Date().toISOString() : null,
      })
      .eq('id', registrationId)

    router.refresh()
    setIsLoading(false)
  }

  return (
    <Button
      type="button"
      variant={paymentConfirmed ? 'default' : 'outline'}
      size="sm"
      disabled={isLoading}
      onClick={handleTogglePayment}
      className="h-8 rounded-full px-3 text-xs"
      aria-label={paymentConfirmed ? `Desmarcar pagamento de ${participantName}` : `Marcar pagamento de ${participantName}`}
      title={paymentConfirmed ? 'Pagamento confirmado' : 'Marcar como pago'}
    >
      {paymentConfirmed ? (
        <>
          <BadgeCheck className="size-3.5" />
          Pago
        </>
      ) : (
        <>
          <Banknote className="size-3.5" />
          Marcar pago
        </>
      )}
    </Button>
  )
}
