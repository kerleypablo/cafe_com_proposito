'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

interface AccountFormProps {
  email?: string
}

export function AccountForm({ email }: AccountFormProps) {
  const [isOwnPasswordSubmitting, setIsOwnPasswordSubmitting] = useState(false)
  const [ownPasswordError, setOwnPasswordError] = useState<string | null>(null)
  const [ownPasswordSuccess, setOwnPasswordSuccess] = useState<string | null>(null)
  const [isAdminResetSubmitting, setIsAdminResetSubmitting] = useState(false)
  const [adminResetError, setAdminResetError] = useState<string | null>(null)
  const [adminResetSuccess, setAdminResetSuccess] = useState<string | null>(null)

  async function handleOwnPasswordSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = event.currentTarget
    setIsOwnPasswordSubmitting(true)
    setOwnPasswordError(null)
    setOwnPasswordSuccess(null)

    const formData = new FormData(form)
    const password = String(formData.get('password') || '')
    const confirmPassword = String(formData.get('confirm_password') || '')

    if (password.length < 6) {
      setOwnPasswordError('A senha precisa ter pelo menos 6 caracteres.')
      setIsOwnPasswordSubmitting(false)
      return
    }

    if (password !== confirmPassword) {
      setOwnPasswordError('As senhas não conferem.')
      setIsOwnPasswordSubmitting(false)
      return
    }

    const supabase = createClient()
    const { error: updateError } = await supabase.auth.updateUser({ password })

    if (updateError) {
      if (updateError.message) {
        setOwnPasswordError(updateError.message)
      } else {
        setOwnPasswordError('Não foi possível atualizar a senha.')
      }
      setIsOwnPasswordSubmitting(false)
      return
    }

    form.reset()
    setOwnPasswordSuccess('Senha atualizada com sucesso.')
    setIsOwnPasswordSubmitting(false)
  }

  async function handleAdminResetSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = event.currentTarget
    setIsAdminResetSubmitting(true)
    setAdminResetError(null)
    setAdminResetSuccess(null)

    const formData = new FormData(form)
    const targetEmail = String(formData.get('target_email') || '').trim().toLowerCase()
    const password = String(formData.get('target_password') || '')
    const confirmPassword = String(formData.get('target_confirm_password') || '')

    if (!targetEmail) {
      setAdminResetError('Informe o email do usuario.')
      setIsAdminResetSubmitting(false)
      return
    }

    if (password.length < 6) {
      setAdminResetError('A senha precisa ter pelo menos 6 caracteres.')
      setIsAdminResetSubmitting(false)
      return
    }

    if (password !== confirmPassword) {
      setAdminResetError('As senhas não conferem.')
      setIsAdminResetSubmitting(false)
      return
    }

    const response = await fetch('/api/admin/users/reset-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: targetEmail,
        password,
      }),
    })

    const result = await response.json().catch(() => ({}))

    if (!response.ok) {
      setAdminResetError(
        typeof result?.error === 'string' ? result.error : 'Nao foi possivel atualizar a senha.',
      )
      setIsAdminResetSubmitting(false)
      return
    }

    form.reset()
    setAdminResetSuccess(`Senha atualizada para ${targetEmail}.`)
    setIsAdminResetSubmitting(false)
  }

  return (
    <div className="space-y-6">
      <Card className="border-border/60 shadow-none">
        <CardHeader>
          <CardTitle className="font-serif text-xl">Minha senha</CardTitle>
          <CardDescription>Atualize a senha da conta que esta logada agora.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleOwnPasswordSubmit} className="space-y-6">
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

            {ownPasswordError && <p className="text-sm text-destructive">{ownPasswordError}</p>}
            {ownPasswordSuccess && <p className="text-sm text-primary">{ownPasswordSuccess}</p>}

            <Button type="submit" disabled={isOwnPasswordSubmitting} className="rounded-full">
              {isOwnPasswordSubmitting ? 'Atualizando...' : 'Atualizar minha senha'}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card className="border-border/60 shadow-none">
        <CardHeader>
          <CardTitle className="font-serif text-xl">Alterar senha de outro usuario</CardTitle>
          <CardDescription>
            Informe o email do usuario e defina uma nova senha manualmente.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAdminResetSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="target_email">Email do usuario</Label>
              <Input
                id="target_email"
                name="target_email"
                type="email"
                placeholder="usuario@email.com"
                required
                className="rounded-xl"
              />
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="target_password">Nova senha</Label>
                <Input
                  id="target_password"
                  name="target_password"
                  type="password"
                  required
                  minLength={6}
                  className="rounded-xl"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="target_confirm_password">Confirmar nova senha</Label>
                <Input
                  id="target_confirm_password"
                  name="target_confirm_password"
                  type="password"
                  required
                  minLength={6}
                  className="rounded-xl"
                />
              </div>
            </div>

            {adminResetError && <p className="text-sm text-destructive">{adminResetError}</p>}
            {adminResetSuccess && <p className="text-sm text-primary">{adminResetSuccess}</p>}

            <Button type="submit" disabled={isAdminResetSubmitting} className="rounded-full">
              {isAdminResetSubmitting ? 'Atualizando...' : 'Atualizar senha do usuario'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
