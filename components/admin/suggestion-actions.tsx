'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Check, Archive, Trash2 } from 'lucide-react'

interface SuggestionActionsProps {
  suggestionId: string
}

export function SuggestionActions({ suggestionId }: SuggestionActionsProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  async function updateStatus(status: 'read' | 'archived') {
    setIsLoading(true)
    const supabase = createClient()

    await supabase
      .from('suggestions')
      .update({ status })
      .eq('id', suggestionId)

    router.refresh()
    setIsLoading(false)
  }

  async function handleDelete() {
    setIsLoading(true)
    const supabase = createClient()

    await supabase
      .from('suggestions')
      .delete()
      .eq('id', suggestionId)

    router.refresh()
    setIsLoading(false)
  }

  return (
    <div className="flex items-center gap-2 shrink-0">
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
