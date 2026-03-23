'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Trash2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'

interface ParticipantActionsProps {
  participantId: string
  participantName: string
}

export function ParticipantActions({ participantId, participantName }: ParticipantActionsProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  async function handleDelete() {
    setIsLoading(true)
    const supabase = createClient()

    await supabase
      .from('registrations')
      .delete()
      .eq('participant_id', participantId)

    await supabase
      .from('participants')
      .delete()
      .eq('id', participantId)

    setIsOpen(false)
    router.refresh()
    setIsLoading(false)
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          disabled={isLoading}
          className="size-9 shrink-0 rounded-full text-destructive hover:text-destructive"
          aria-label={`Excluir participante ${participantName}`}
          title="Excluir participante"
        >
          <Trash2 className="size-4" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Excluir participante?</AlertDialogTitle>
          <AlertDialogDescription>
            O cadastro de {participantName} e as inscrições vinculadas serão removidos.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isLoading}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isLoading ? 'Excluindo...' : 'Excluir participante'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
