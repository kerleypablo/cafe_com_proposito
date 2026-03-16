'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface AccountFormProps {
  email?: string
}

export function AccountForm({ email }: AccountFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = event.currentTarget
    setIsSubmitting(true)
    setError(null)
    setSuccess(null)

    const formData = new FormData(form)
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
      if (updateError.message) {
        setError(updateError.message)
      } else {
        setError('Nao foi possivel atualizar a senha.')
      }
      setIsSubmitting(false)
      return
    }

    form.reset()
    setSuccess('Senha atualizada com sucesso.')
    setIsSubmitting(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="email">Email da conta</Label>
        <Input id="email" value={email || ''} readOnly className="rounded-xl bg-secondary/30" />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
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
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}
      {success && <p className="text-sm text-primary">{success}</p>}

      <Button type="submit" disabled={isSubmitting} className="rounded-full">
        {isSubmitting ? 'Atualizando...' : 'Atualizar senha'}
      </Button>
    </form>
  )
}
