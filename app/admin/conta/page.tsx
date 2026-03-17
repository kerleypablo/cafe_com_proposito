import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { AccountForm } from '@/components/admin/account-form'

export const metadata = {
  title: 'Conta | Admin Café com Propósito',
}

export default async function AdminContaPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-3xl font-bold text-primary">Conta</h1>
        <p className="text-muted-foreground">
          Atualize a senha da sua conta administrativa.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="font-serif">Segurança de acesso</CardTitle>
        </CardHeader>
        <CardContent>
          <AccountForm email={user?.email} />
        </CardContent>
      </Card>
    </div>
  )
}
