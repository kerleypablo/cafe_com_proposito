'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Archive, Check, Trash2 } from 'lucide-react'

interface PartnershipRequestActionsProps {
  requestId: string
}

export function PartnershipRequestActions({ requestId }: PartnershipRequestActionsProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  async function updateStatus(status: 'read' | 'archived') {
    setIsLoading(true)
    const supabase = createClient()

    await supabase.from('partnership_requests').update({ status }).eq('id', requestId)

    router.refresh()
    setIsLoading(false)
  }

  async function handleDelete() {
    setIsLoading(true)
    const supabase = createClient()

    await supabase.from('partnership_requests').delete().eq('id', requestId)

    router.refresh()
    setIsLoading(false)
  }

  return (
    <div className="flex shrink-0 items-center gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={() => updateStatus('read')}
        disabled={isLoading}
        className="rounded-full"
      >
        <Check className="size-4" />
        <span className="sr-only sm:not-sr-only sm:ml-1">Marcar lida</span>
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => updateStatus('archived')}
        disabled={isLoading}
        className="rounded-full"
      >
        <Archive className="size-4" />
        <span className="sr-only sm:not-sr-only sm:ml-1">Arquivar</span>
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={handleDelete}
        disabled={isLoading}
        className="rounded-full text-destructive hover:text-destructive"
      >
        <Trash2 className="size-4" />
        <span className="sr-only sm:not-sr-only sm:ml-1">Excluir</span>
      </Button>
    </div>
  )
}
