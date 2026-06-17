'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Coffee, Lock } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function UpdatePasswordPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isReady, setIsReady] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  useEffect(() => {
    const supabase = createClient()

    let mounted = true

    async function loadSession() {
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (mounted && session) {
        setIsReady(true)
      }
    }

    void loadSession()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (!mounted) {
        return
      }

      if (event === 'PASSWORD_RECOVERY' || !!session) {
        setIsReady(true)
      }
    })

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [])

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsSubmitting(true)
    setError(null)
    setSuccess(null)

    const formData = new FormData(event.currentTarget)
    const password = String(formData.get('password') || '')
    const confirmPassword = String(formData.get('confirm_password') || '')

    if (password.length < 6) {
      setError('A senha precisa ter pelo menos 6 caracteres.')
      setIsSubmitting(false)
      return
    }

    if (password !== confirmPassword) {
      setError('As senhas nao conferem.')
      setIsSubmitting(false)
      return
    }

    const supabase = createClient()
    const { error: updateError } = await supabase.auth.updateUser({ password })

    if (updateError) {
      setError(updateError.message || 'Nao foi possivel atualizar a senha.')
      setIsSubmitting(false)
      return
    }

    event.currentTarget.reset()
    setSuccess('Senha atualizada com sucesso. Voce ja pode entrar com a nova senha.')
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
            Atualizar senha
          </h1>
          <p className="text-sm text-muted-foreground">
            Defina uma nova senha para continuar no painel
          </p>
        </div>

        <div className="bg-card rounded-2xl p-6 shadow-md border border-border">
          <div className="flex items-center justify-center size-12 rounded-full bg-secondary mx-auto mb-6">
            <Lock className="size-5 text-muted-foreground" />
          </div>

          {!isReady && (
            <p className="text-sm text-muted-foreground">
              Abra esta pagina pelo link enviado no email de recuperacao.
            </p>
          )}

          {isReady && (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password">Nova senha</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  required
                  minLength={6}
                  className="rounded-xl"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirm_password">Confirmar nova senha</Label>
                <Input
                  id="confirm_password"
                  name="confirm_password"
                  type="password"
                  required
                  minLength={6}
                  className="rounded-xl"
                />
              </div>

              {error && <p className="text-sm text-destructive">{error}</p>}
              {success && <p className="text-sm text-primary">{success}</p>}

              <Button type="submit" disabled={isSubmitting} className="w-full rounded-full">
                {isSubmitting ? 'Atualizando...' : 'Salvar nova senha'}
              </Button>
            </form>
          )}
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
