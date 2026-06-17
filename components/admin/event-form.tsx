'use client'

import { useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { ImagePlus, Trash2 } from 'lucide-react'
import { revalidatePaths } from '@/lib/revalidate-client'

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
  const [previewUrl, setPreviewUrl] = useState<string | null>(event?.image_url || null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const inputRef = useRef<HTMLInputElement | null>(null)
  const bucketName = 'event-images'
  const allowedImageTypes = ['image/png', 'image/jpeg', 'image/webp']
  const extensionByMimeType: Record<string, string> = {
    'image/png': 'png',
    'image/jpeg': 'jpg',
    'image/webp': 'webp',
  }

  function getStoragePathFromUrl(url: string) {
    const marker = `/storage/v1/object/public/${bucketName}/`
    const index = url.indexOf(marker)
    if (index === -1) return null
    return url.slice(index + marker.length)
  }

  async function uploadImage(file: File) {
    const supabase = createClient()
    if (!allowedImageTypes.includes(file.type)) {
      throw new Error('Formato de imagem invalido. Use PNG, JPG ou WEBP.')
    }

    const extension = extensionByMimeType[file.type] || 'jpg'
    const path = `eventos/${crypto.randomUUID()}.${extension}`

    const { error: uploadError } = await supabase.storage
      .from(bucketName)
      .upload(path, file, {
        cacheControl: '3600',
        contentType: file.type,
        upsert: false,
      })

    if (uploadError) {
      throw uploadError
    }

    const { data } = supabase.storage.from(bucketName).getPublicUrl(path)
    return {
      path,
      publicUrl: data.publicUrl,
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    const formData = new FormData(e.currentTarget)
    const isPublished = (formData.get('status') as string) === 'published'
    let imageUrl = event?.image_url || null
    let uploadedImagePath: string | null = null

    if (selectedFile) {
      try {
        const uploadedImage = await uploadImage(selectedFile)
        imageUrl = uploadedImage.publicUrl
        uploadedImagePath = uploadedImage.path
      } catch (uploadError) {
        const message = uploadError instanceof Error ? uploadError.message : 'Erro desconhecido'
        console.error('Erro ao enviar imagem do evento:', uploadError)
        setError(
          message === 'Bucket not found'
            ? 'Bucket event-images nao encontrado no Supabase. Crie o bucket antes de enviar imagens.'
            : `Nao foi possivel enviar a imagem do evento. ${message}`,
        )
        setIsSubmitting(false)
        return
      }
    }

    const data = {
      title: formData.get('title') as string,
      description: formData.get('description') as string || null,
      date: formData.get('date') as string,
      time: formData.get('time') as string,
      location: formData.get('location') as string,
      max_participants: formData.get('max_participants') 
        ? parseInt(formData.get('max_participants') as string) 
        : null,
      image_url: imageUrl,
      status: isPublished ? 'published' : 'draft',
      is_published: isPublished,
    }

    const supabase = createClient()
    let saveError = null

    if (event) {
      // Update existing event
      const { error: updateError } = await supabase
        .from('events')
        .update(data)
        .eq('id', event.id)

      saveError = updateError
    } else {
      // Create new event
      const { error: insertError } = await supabase
        .from('events')
        .insert(data)

      saveError = insertError
    }

    if (saveError) {
      if (uploadedImagePath) {
        await supabase.storage.from(bucketName).remove([uploadedImagePath])
      }

      setError(event ? 'Erro ao atualizar evento. Tente novamente.' : 'Erro ao criar evento. Tente novamente.')
      setIsSubmitting(false)
      return
    }

    if (event && selectedFile && event.image_url) {
      const previousImagePath = getStoragePathFromUrl(event.image_url)
      if (previousImagePath && previousImagePath !== uploadedImagePath) {
        await supabase.storage.from(bucketName).remove([previousImagePath])
      }
    }

    await revalidatePaths([
      '/',
      '/eventos',
      ...(event ? [`/eventos/${event.id}`] : []),
    ])

    router.push('/admin/eventos')
    router.refresh()
  }

  async function handleDelete() {
    if (!event) return
    if (!confirm('Tem certeza que deseja excluir este evento? Esta acao nao pode ser desfeita.')) return

    setIsDeleting(true)
    const supabase = createClient()

    const storagePath = event.image_url ? getStoragePathFromUrl(event.image_url) : null
    if (storagePath) {
      await supabase.storage.from(bucketName).remove([storagePath])
    }

    const { error: deleteError } = await supabase
      .from('events')
      .delete()
      .eq('id', event.id)

    if (deleteError) {
      setError('Erro ao excluir evento. Tente novamente.')
      setIsDeleting(false)
      return
    }

    await revalidatePaths([
      '/',
      '/eventos',
      `/eventos/${event.id}`,
    ])

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
            placeholder="Ex: Café com Propósito - Setembro"
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

      <div className="space-y-3">
        <Label htmlFor="image_file">Imagem do evento</Label>
        <label
          htmlFor="image_file"
          className="flex cursor-pointer items-center justify-between rounded-2xl border border-dashed border-border bg-secondary/20 px-4 py-4 transition-colors hover:bg-secondary/35"
        >
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm font-medium text-foreground">
              <ImagePlus className="size-4" />
              {selectedFile ? selectedFile.name : event?.image_url ? 'Trocar imagem atual' : 'Selecionar imagem'}
            </div>
            <p className="text-xs text-muted-foreground">
              PNG, JPG ou WEBP. A imagem sera enviada direto para o Supabase Storage.
            </p>
          </div>
          <span className="rounded-full bg-card px-3 py-1 text-xs text-muted-foreground shadow-sm">
            Procurar
          </span>
        </label>
        <Input
          id="image_file"
          ref={inputRef}
          type="file"
          accept="image/png,image/jpeg,image/jpg,image/webp"
          className="hidden"
          onChange={(inputEvent) => {
            const file = inputEvent.target.files?.[0] || null
            setSelectedFile(file)
            setPreviewUrl(file ? URL.createObjectURL(file) : event?.image_url || null)
            if (inputRef.current) inputRef.current.value = ''
          }}
        />
        {previewUrl && (
          <div className="overflow-hidden rounded-2xl border border-border bg-card p-4">
            <img src={previewUrl} alt={event?.title || 'Preview do evento'} className="h-40 w-full object-cover" />
          </div>
        )}
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
