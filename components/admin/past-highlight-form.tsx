'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { ImagePlus, Trash2, X } from 'lucide-react'
import { revalidatePaths } from '@/lib/revalidate-client'

interface PastHighlightFormProps {
  highlight?: {
    id: string
    title: string
    subtitle: string | null
    event_date: string | null
    image_url: string
    image_urls?: string[]
    description: string
    photos_link: string | null
    is_published: boolean
  }
  initialEvent?: {
    id: string
    title: string
    description: string | null
    date: string
    image_url: string | null
  } | null
}

export function PastHighlightForm({ highlight, initialEvent }: PastHighlightFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const inputRef = useRef<HTMLInputElement | null>(null)

  const bucketName = 'past-highlights'
  const existingImages = useMemo(
    () =>
      highlight?.image_urls?.length
        ? highlight.image_urls
        : highlight?.image_url
          ? [highlight.image_url]
          : initialEvent?.image_url
            ? [initialEvent.image_url]
            : [],
    [highlight, initialEvent],
  )
  const selectedPreviews = useMemo(
    () => selectedFiles.map((file) => ({ name: file.name, url: URL.createObjectURL(file) })),
    [selectedFiles],
  )

  useEffect(() => {
    return () => {
      selectedPreviews.forEach((preview) => URL.revokeObjectURL(preview.url))
    }
  }, [selectedPreviews])

  function getStoragePathFromUrl(url: string) {
    const marker = `/storage/v1/object/public/${bucketName}/`
    const index = url.indexOf(marker)
    if (index === -1) return null
    return url.slice(index + marker.length)
  }

  async function uploadImage(file: File) {
    const supabase = createClient()
    const fileExtension = file.name.split('.').pop() || 'jpg'
    const filePath = `memorias/${crypto.randomUUID()}.${fileExtension}`

    const { error: uploadError } = await supabase.storage
      .from(bucketName)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
      })

    if (uploadError) {
      throw uploadError
    }

    const { data } = supabase.storage.from(bucketName).getPublicUrl(filePath)
    return data.publicUrl
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    const formData = new FormData(e.currentTarget)
    const imageFiles = selectedFiles.slice(0, 3)
    let imageUrls = highlight?.image_urls?.length
      ? highlight.image_urls
      : highlight?.image_url
        ? [highlight.image_url]
        : initialEvent?.image_url
          ? [initialEvent.image_url]
          : []

    if (imageFiles.length > 0) {
      try {
        imageUrls = await Promise.all(imageFiles.map(uploadImage))
      } catch {
        setError('Nao foi possivel enviar a imagem para o Supabase Storage.')
        setIsSubmitting(false)
        return
      }
    }

    if (imageUrls.length === 0) {
      setError('Selecione entre 1 e 3 imagens para essa memoria.')
      setIsSubmitting(false)
      return
    }

    const payload = {
      title: formData.get('title') as string,
      subtitle: (formData.get('subtitle') as string) || null,
      event_date: (formData.get('event_date') as string) || null,
      image_url: imageUrls[0],
      image_urls: imageUrls,
      description: formData.get('description') as string,
      photos_link: (formData.get('photos_link') as string) || null,
      is_published: formData.get('is_published') === 'on',
    }

    const supabase = createClient()

    const query = highlight
      ? supabase.from('past_event_highlights').update(payload).eq('id', highlight.id)
      : supabase.from('past_event_highlights').insert(payload)

    const { error: saveError } = await query

    if (saveError) {
      setError('Nao foi possivel salvar esse conteudo.')
      setIsSubmitting(false)
      return
    }

    await revalidatePaths([
      '/',
      ...(highlight ? [`/memorias/${highlight.id}`] : []),
    ])

    router.push('/admin/memorias')
    router.refresh()
  }

  async function handleDelete() {
    if (!highlight) return
    if (!confirm('Deseja remover esse evento anterior?')) return

    setIsDeleting(true)
    const supabase = createClient()

    const imagesToDelete = highlight.image_urls?.length ? highlight.image_urls : [highlight.image_url]
    const storagePaths = imagesToDelete
      .map((url) => getStoragePathFromUrl(url))
      .filter((value): value is string => Boolean(value))

    if (storagePaths.length > 0) {
      await supabase.storage.from(bucketName).remove(storagePaths)
    }

    const { error: deleteError } = await supabase
      .from('past_event_highlights')
      .delete()
      .eq('id', highlight.id)

    if (deleteError) {
      setError('Nao foi possivel remover esse conteudo.')
      setIsDeleting(false)
      return
    }

    await revalidatePaths([
      '/',
      `/memorias/${highlight.id}`,
    ])

    router.push('/admin/memorias')
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="title">Titulo *</Label>
          <Input id="title" name="title" required defaultValue={highlight?.title || initialEvent?.title || ''} className="rounded-xl" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="event_date">Data</Label>
          <Input
            id="event_date"
            name="event_date"
            type="date"
            defaultValue={highlight?.event_date || initialEvent?.date || ''}
            className="rounded-xl"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="subtitle">Subtitulo</Label>
        <Input
          id="subtitle"
          name="subtitle"
          defaultValue={highlight?.subtitle || ''}
          className="rounded-xl"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Texto *</Label>
        <Textarea
          id="description"
          name="description"
          required
          rows={7}
          defaultValue={highlight?.description || initialEvent?.description || ''}
          className="resize-none rounded-xl"
        />
      </div>

      <div className="space-y-3">
        <Label htmlFor="image_files">Imagens da memoria *</Label>
        <label
          htmlFor="image_files"
          className="flex cursor-pointer items-center justify-between rounded-2xl border border-dashed border-border bg-secondary/20 px-4 py-4 transition-colors hover:bg-secondary/35"
        >
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm font-medium text-foreground">
              <ImagePlus className="size-4" />
              {selectedFiles.length > 0
                ? `${selectedFiles.length} imagem(ns) selecionada(s)`
                : ((highlight?.image_urls?.length || highlight?.image_url || initialEvent?.image_url)
                    ? 'Trocar imagens atuais'
                    : 'Selecionar imagens')}
            </div>
            <p className="text-xs text-muted-foreground">
              PNG, JPG ou WEBP. Maximo de 3 imagens. Voce pode selecionar mais de uma vez ate completar as 3.
            </p>
          </div>
          <span className="rounded-full bg-card px-3 py-1 text-xs text-muted-foreground shadow-sm">
            Procurar
          </span>
        </label>
        <Input
          id="image_files"
          name="image_files"
          type="file"
          accept="image/png,image/jpeg,image/jpg,image/webp"
          multiple
          ref={inputRef}
          onChange={(e) => {
            const incomingFiles = Array.from(e.target.files || [])
            setSelectedFiles((currentFiles) => [...currentFiles, ...incomingFiles].slice(0, 3))
            if (inputRef.current) {
              inputRef.current.value = ''
            }
          }}
          className="hidden"
        />
        {selectedFiles.length > 0 && (
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {selectedPreviews.map((preview, index) => (
              <div key={`${preview.name}-${index}`} className="relative overflow-hidden rounded-xl border border-border">
                <button
                  type="button"
                  onClick={() => setSelectedFiles((currentFiles) => currentFiles.filter((_, fileIndex) => fileIndex !== index))}
                  className="absolute right-2 top-2 z-10 inline-flex size-7 items-center justify-center rounded-full bg-black/55 text-white"
                  aria-label={`Remover ${preview.name}`}
                >
                  <X className="size-3.5" />
                </button>
                <img
                  src={preview.url}
                  alt={preview.name}
                  className="h-24 w-full object-cover"
                />
                <div className="bg-card px-2 py-1.5 text-[11px] text-muted-foreground">
                  {preview.name}
                </div>
              </div>
            ))}
          </div>
        )}
        {selectedFiles.length === 0 && existingImages.length > 0 && (
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {existingImages.map((imageUrl, index) => (
              <div key={`${imageUrl}-${index}`} className="overflow-hidden rounded-xl border border-border">
                <img
                  src={imageUrl}
                  alt={`${highlight?.title || initialEvent?.title || 'Memoria'} ${index + 1}`}
                  className="h-24 w-full object-cover"
                />
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="photos_link">Link para baixar fotos</Label>
        <Input
          id="photos_link"
          name="photos_link"
          type="url"
          defaultValue={highlight?.photos_link || ''}
          className="rounded-xl"
        />
        <p className="text-xs text-muted-foreground">
          Se ficar vazio, o botao nao aparece no site.
        </p>
      </div>

      <label className="flex items-center gap-3 rounded-2xl border border-border bg-secondary/20 px-4 py-3">
        <input
          type="checkbox"
          name="is_published"
          defaultChecked={highlight?.is_published ?? true}
          className="size-4"
        />
        <span className="text-sm text-foreground">Publicar no site</span>
      </label>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <div className="flex flex-col gap-4 sm:flex-row">
        <Button type="submit" disabled={isSubmitting} className="rounded-full">
          {isSubmitting ? 'Salvando...' : highlight ? 'Salvar alteracoes' : 'Criar memoria'}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.back()} className="rounded-full">
          Cancelar
        </Button>
        {highlight && (
          <Button
            type="button"
            variant="destructive"
            onClick={handleDelete}
            disabled={isDeleting}
            className="rounded-full sm:ml-auto"
          >
            <Trash2 className="size-4" />
            {isDeleting ? 'Removendo...' : 'Excluir'}
          </Button>
        )}
      </div>
    </form>
  )
}
