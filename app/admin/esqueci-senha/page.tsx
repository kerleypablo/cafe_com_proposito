'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Coffee, Lock } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function ForgotPasswordPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsSubmitting(true)
    setError(null)
    setSuccess(null)

    const formData = new FormData(event.currentTarget)
    const email = String(formData.get('email') || '').trim()

    const supabase = createClient()
    const redirectTo = `${window.location.origin}/admin/atualizar-senha`
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo,
    })

    if (resetError) {
      setError(resetError.message || 'Nao foi possivel enviar o email de recuperacao.')
      setIsSubmitting(false)
      return
    }

    setSuccess('Se o email existir, voce recebera um link para redefinir a senha.')
    setIsSubmitting(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <div className="flex items-center justify-center size-12 rounded-full bg-primary">
              <Coffee className="size-6 text-primary-foreground" />
            </div>
          </Link>
          <h1 className="font-serif text-2xl font-bold text-foreground mb-2">
            Recuperar senha
          </h1>
          <p className="text-sm text-muted-foreground">
            Informe seu email para receber o link de redefinicao
          </p>
        </div>

        <div className="bg-card rounded-2xl p-6 shadow-md border border-border">
          <div className="flex items-center justify-center size-12 rounded-full bg-secondary mx-auto mb-6">
            <Lock className="size-5 text-muted-foreground" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="seu@email.com"
                required
                className="rounded-xl"
              />
            </div>

            {error && <p className="text-sm text-destructive">{error}</p>}
            {success && <p className="text-sm text-primary">{success}</p>}

            <Button type="submit" disabled={isSubmitting} className="w-full rounded-full">
              {isSubmitting ? 'Enviando...' : 'Enviar link de recuperacao'}
            </Button>
          </form>
        </div>

        <p className="text-center text-sm text-muted-foreground mt-6">
          <Link href="/admin/login" className="hover:text-foreground transition-colors">
            Voltar para o login
          </Link>
        </p>
      </div>
    </div>
  )
}
