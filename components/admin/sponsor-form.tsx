'use client'

import { useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ImagePlus, Trash2 } from 'lucide-react'
import { revalidatePaths } from '@/lib/revalidate-client'

interface SponsorFormProps {
  sponsor?: {
    id: string
    title: string
    image_url: string
    is_active: boolean
  }
}

async function resizeImage(file: File) {
  const imageBitmap = await createImageBitmap(file)
  const maxWidth = 420
  const scale = Math.min(1, maxWidth / imageBitmap.width)
  const width = Math.round(imageBitmap.width * scale)
  const height = Math.round(imageBitmap.height * scale)

  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const context = canvas.getContext('2d')

  if (!context) {
    throw new Error('Canvas indisponivel')
  }

  context.drawImage(imageBitmap, 0, 0, width, height)

  const blob = await new Promise<Blob | null>((resolve) => {
    canvas.toBlob((result) => resolve(result), 'image/webp', 0.86)
  })

  if (!blob) {
    throw new Error('Falha ao reduzir imagem')
  }

  return new File([blob], `${file.name.split('.').slice(0, -1).join('.') || 'sponsor'}.webp`, {
    type: 'image/webp',
  })
}

export function SponsorForm({ sponsor }: SponsorFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(sponsor?.image_url || null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const inputRef = useRef<HTMLInputElement | null>(null)

  async function uploadImage(file: File) {
    const supabase = createClient()
    const resizedFile = await resizeImage(file)
    const path = `logos/${crypto.randomUUID()}.webp`

    const { error: uploadError } = await supabase.storage
      .from('sponsors')
      .upload(path, resizedFile, {
        cacheControl: '3600',
        upsert: false,
      })

    if (uploadError) throw uploadError

    const { data } = supabase.storage.from('sponsors').getPublicUrl(path)
    return data.publicUrl
  }

  function getStoragePathFromUrl(url: string) {
    const marker = '/storage/v1/object/public/sponsors/'
    const index = url.indexOf(marker)
    if (index === -1) return null
    return url.slice(index + marker.length)
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    const formData = new FormData(e.currentTarget)
    let imageUrl = sponsor?.image_url || ''

    if (selectedFile) {
      try {
        imageUrl = await uploadImage(selectedFile)
      } catch {
        setError('Nao foi possivel enviar a imagem do patrocinador.')
        setIsSubmitting(false)
        return
      }
    }

    if (!imageUrl) {
      setError('Selecione uma imagem para o patrocinador.')
      setIsSubmitting(false)
      return
    }

    const payload = {
      title: formData.get('title') as string,
      image_url: imageUrl,
      is_active: formData.get('is_active') === 'on',
    }

    const supabase = createClient()
    const query = sponsor
      ? supabase.from('sponsors').update(payload).eq('id', sponsor.id)
      : supabase.from('sponsors').insert(payload)

    const { error: saveError } = await query

    if (saveError) {
      setError('Nao foi possivel salvar esse patrocinador.')
      setIsSubmitting(false)
      return
    }

    await revalidatePaths(['/'])

    router.push('/admin/patrocinadores')
    router.refresh()
  }

  async function handleDelete() {
    if (!sponsor) return
    if (!confirm('Deseja excluir este patrocinador?')) return

    setIsDeleting(true)
    const supabase = createClient()

    const storagePath = getStoragePathFromUrl(sponsor.image_url)
    if (storagePath) {
      await supabase.storage.from('sponsors').remove([storagePath])
    }

    await supabase.from('sponsors').delete().eq('id', sponsor.id)

    await revalidatePaths(['/'])

    router.push('/admin/patrocinadores')
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="title">Nome do patrocinador *</Label>
        <Input id="title" name="title" required defaultValue={sponsor?.title} className="rounded-xl" />
      </div>

      <div className="space-y-3">
        <Label htmlFor="image_file">Imagem do patrocinador *</Label>
        <label
          htmlFor="image_file"
          className="flex cursor-pointer items-center justify-between rounded-2xl border border-dashed border-border bg-secondary/20 px-4 py-4 transition-colors hover:bg-secondary/35"
        >
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm font-medium text-foreground">
              <ImagePlus className="size-4" />
              {selectedFile ? selectedFile.name : sponsor?.image_url ? 'Trocar imagem atual' : 'Selecionar imagem'}
            </div>
            <p className="text-xs text-muted-foreground">
              A imagem sera reduzida automaticamente para ficar leve no carrossel.
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
          onChange={(e) => {
            const file = e.target.files?.[0] || null
            setSelectedFile(file)
            setPreviewUrl(file ? URL.createObjectURL(file) : sponsor?.image_url || null)
            if (inputRef.current) inputRef.current.value = ''
          }}
        />
        {previewUrl && (
          <div className="overflow-hidden rounded-2xl border border-border bg-card p-4">
            <img src={previewUrl} alt={sponsor?.title || 'Preview do patrocinador'} className="h-24 w-full object-contain" />
          </div>
        )}
      </div>

      <label className="flex items-center gap-3 rounded-2xl border border-border bg-secondary/20 px-4 py-3">
        <input
          type="checkbox"
          name="is_active"
          defaultChecked={sponsor?.is_active ?? true}
          className="size-4"
        />
        <span className="text-sm text-foreground">Exibir no carrossel publico</span>
      </label>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <div className="flex flex-col gap-4 sm:flex-row">
        <Button type="submit" disabled={isSubmitting} className="rounded-full">
          {isSubmitting ? 'Salvando...' : sponsor ? 'Salvar alteracoes' : 'Criar patrocinador'}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.back()} className="rounded-full">
          Cancelar
        </Button>
        {sponsor && (
          <Button
            type="button"
            variant="destructive"
            onClick={handleDelete}
            disabled={isDeleting}
            className="rounded-full sm:ml-auto"
          >
            <Trash2 className="size-4" />
            {isDeleting ? 'Excluindo...' : 'Excluir'}
          </Button>
        )}
      </div>
    </form>
  )
}
