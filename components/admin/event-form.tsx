'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Trash2 } from 'lucide-react'

interface EventFormProps {
  event?: {
    id: string
    title: string
    description: string | null
    date: string
    time: string
    location: string
    max_participants: number | null
    image_url: string | null
    status: string
    is_published?: boolean
  }
}

export function EventForm({ event }: EventFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    const formData = new FormData(e.currentTarget)
    const isPublished = (formData.get('status') as string) === 'published'
    const data = {
      title: formData.get('title') as string,
      description: formData.get('description') as string || null,
      date: formData.get('date') as string,
      time: formData.get('time') as string,
      location: formData.get('location') as string,
      max_participants: formData.get('max_participants') 
        ? parseInt(formData.get('max_participants') as string) 
        : null,
      image_url: formData.get('image_url') as string || null,
      is_published: isPublished,
    }

    const supabase = createClient()

    if (event) {
      // Update existing event
      const { error: updateError } = await supabase
        .from('events')
        .update(data)
        .eq('id', event.id)

      if (updateError) {
        setError('Erro ao atualizar evento. Tente novamente.')
        setIsSubmitting(false)
        return
      }
    } else {
      // Create new event
      const { error: insertError } = await supabase
        .from('events')
        .insert(data)

      if (insertError) {
        setError('Erro ao criar evento. Tente novamente.')
        setIsSubmitting(false)
        return
      }
    }

    router.push('/admin/eventos')
    router.refresh()
  }

  async function handleDelete() {
    if (!event) return
    if (!confirm('Tem certeza que deseja excluir este evento? Esta acao nao pode ser desfeita.')) return

    setIsDeleting(true)
    const supabase = createClient()

    const { error: deleteError } = await supabase
      .from('events')
      .delete()
      .eq('id', event.id)

    if (deleteError) {
      setError('Erro ao excluir evento. Tente novamente.')
      setIsDeleting(false)
      return
    }

    router.push('/admin/eventos')
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="title">Titulo do Evento *</Label>
          <Input
            id="title"
            name="title"
            defaultValue={event?.title}
            placeholder="Ex: Cafe com Proposito - Setembro"
            required
            className="rounded-xl"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="status">Status *</Label>
          <select
            id="status"
            name="status"
            defaultValue={event?.status || 'draft'}
            required
            className="w-full h-9 px-3 rounded-xl border border-input bg-background text-sm"
          >
            <option value="draft">Rascunho</option>
            <option value="published">Publicado</option>
          </select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Descricao</Label>
        <Textarea
          id="description"
          name="description"
          defaultValue={event?.description || ''}
          placeholder="Descreva o evento, tema, o que as participantes podem esperar..."
          rows={5}
          className="resize-none rounded-xl"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-2">
          <Label htmlFor="date">Data *</Label>
          <Input
            id="date"
            name="date"
            type="date"
            defaultValue={event?.date}
            required
            className="rounded-xl"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="time">Horario *</Label>
          <Input
            id="time"
            name="time"
            type="time"
            defaultValue={event?.time}
            required
            className="rounded-xl"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="max_participants">Limite de Vagas</Label>
          <Input
            id="max_participants"
            name="max_participants"
            type="number"
            min="1"
            defaultValue={event?.max_participants || ''}
            placeholder="Deixe vazio para ilimitado"
            className="rounded-xl"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="location">Local *</Label>
        <Input
          id="location"
          name="location"
          defaultValue={event?.location}
          placeholder="Ex: Cafeteria Aroma - Rua das Flores, 123"
          required
          className="rounded-xl"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="image_url">URL da Imagem</Label>
        <Input
          id="image_url"
          name="image_url"
          type="url"
          defaultValue={event?.image_url || ''}
          placeholder="https://exemplo.com/imagem.jpg"
          className="rounded-xl"
        />
        <p className="text-xs text-muted-foreground">
          Cole o link de uma imagem para ilustrar o evento
        </p>
      </div>

      {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}

      <div className="flex flex-col sm:flex-row gap-4 pt-4">
        <Button 
          type="submit" 
          disabled={isSubmitting}
          className="rounded-full flex-1 sm:flex-none"
        >
          {isSubmitting 
            ? 'Salvando...' 
            : event 
              ? 'Salvar Alteracoes' 
              : 'Criar Evento'}
        </Button>
        
        <Button 
          type="button"
          variant="outline"
          onClick={() => router.back()}
          className="rounded-full"
        >
          Cancelar
        </Button>

        {event && (
          <Button 
            type="button"
            variant="destructive"
            onClick={handleDelete}
            disabled={isDeleting}
            className="rounded-full sm:ml-auto"
          >
            <Trash2 className="size-4" />
            {isDeleting ? 'Excluindo...' : 'Excluir Evento'}
          </Button>
        )}
      </div>
    </form>
  )
}
