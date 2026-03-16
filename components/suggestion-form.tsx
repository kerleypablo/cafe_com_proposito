'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { CheckCircle } from 'lucide-react'

export function SuggestionForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    const formData = new FormData(e.currentTarget)
    const suggestion = formData.get('suggestion') as string
    const name = formData.get('name') as string || null

    const supabase = createClient()
    
    const { error: submitError } = await supabase
      .from('suggestions')
      .insert({
        suggestion,
        name,
      })

    if (submitError) {
      setError('Ocorreu um erro ao enviar sua sugestao. Tente novamente.')
      setIsSubmitting(false)
      return
    }

    setIsSuccess(true)
    setIsSubmitting(false)
  }

  if (isSuccess) {
    return (
      <div className="text-center py-8">
        <div className="inline-flex items-center justify-center size-16 rounded-full bg-primary/10 mb-4">
          <CheckCircle className="size-8 text-primary" />
        </div>
        <h3 className="font-serif text-xl font-semibold text-foreground mb-2">
          Obrigada pela sua sugestao!
        </h3>
        <p className="text-muted-foreground mb-6">
          Sua contribuicao e muito importante para nossa comunidade.
        </p>
        <Button 
          variant="outline" 
          onClick={() => setIsSuccess(false)}
          className="rounded-full"
        >
          Enviar outra sugestao
        </Button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="suggestion" className="text-foreground">
          Sua sugestao *
        </Label>
        <Textarea
          id="suggestion"
          name="suggestion"
          placeholder="Compartilhe sua ideia de tema, atividade ou qualquer sugestao..."
          required
          rows={5}
          className="resize-none rounded-xl"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="name" className="text-foreground">
          Seu nome (opcional)
        </Label>
        <Input
          id="name"
          name="name"
          placeholder="Como gostaria de ser chamada?"
          className="rounded-xl"
        />
        <p className="text-xs text-muted-foreground">
          Deixe em branco se preferir enviar anonimamente.
        </p>
      </div>

      {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}

      <Button 
        type="submit" 
        disabled={isSubmitting}
        className="w-full rounded-full"
      >
        {isSubmitting ? 'Enviando...' : 'Enviar Sugestao'}
      </Button>
    </form>
  )
}
