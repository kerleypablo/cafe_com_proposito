import { createClient } from '@/lib/supabase/server'
import { Card, CardContent } from '@/components/ui/card'
import { PartnershipRequestActions } from '@/components/admin/partnership-request-actions'
import { Building2, Clock, Phone, User } from 'lucide-react'

export const metadata = {
  title: 'Parcerias | Admin Café com Propósito',
}

export default async function AdminParceriasPage() {
  const supabase = await createClient()

  const { data: requests } = await supabase
    .from('partnership_requests')
    .select('*')
    .order('created_at', { ascending: false })

  const pendingRequests = requests?.filter((request) => request.status === 'pending') || []
  const reviewedRequests = requests?.filter((request) => request.status !== 'pending') || []

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-serif text-3xl font-bold text-primary">Solicitações de parceria</h1>
        <p className="text-muted-foreground">
          Empresas e marcas interessadas em apoiar o projeto e divulgar sua presença na comunidade.
        </p>
      </div>

      <section>
        <h2 className="mb-4 font-serif text-xl font-semibold text-foreground">
          Pendentes ({pendingRequests.length})
        </h2>
        {pendingRequests.length > 0 ? (
          <div className="grid gap-4">
            {pendingRequests.map((request) => {
              const formattedDate = new Date(request.created_at).toLocaleDateString('pt-BR', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
              })

              return (
                <Card key={request.id}>
                  <CardContent className="p-4">
                    <div className="flex flex-col gap-4 sm:flex-row">
                      <div className="min-w-0 flex-1">
                        <div className="grid gap-2 text-sm text-foreground">
                          <div className="flex items-center gap-2">
                            <User className="size-4 text-muted-foreground" />
                            <span>{request.name}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Building2 className="size-4 text-muted-foreground" />
                            <span>{request.company_name}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Phone className="size-4 text-muted-foreground" />
                            <span>{request.contact_phone}</span>
                          </div>
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Clock className="size-4" />
                            <span>{formattedDate}</span>
                          </div>
                        </div>
                      </div>
                      <PartnershipRequestActions requestId={request.id} />
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        ) : (
          <Card>
            <CardContent className="py-8 text-center">
              <p className="text-muted-foreground">Nenhuma solicitação pendente</p>
            </CardContent>
          </Card>
        )}
      </section>

      {reviewedRequests.length > 0 && (
        <section>
          <h2 className="mb-4 font-serif text-xl font-semibold text-foreground">
            Revisadas ({reviewedRequests.length})
          </h2>
          <div className="grid gap-4 opacity-60">
            {reviewedRequests.map((request) => {
              const formattedDate = new Date(request.created_at).toLocaleDateString('pt-BR', {
                day: 'numeric',
                month: 'short',
              })
              const statusLabel = request.status === 'archived' ? 'Arquivada' : 'Lida'
              const statusColor = request.status === 'archived'
                ? 'bg-muted text-muted-foreground'
                : 'bg-primary/10 text-primary'

              return (
                <Card key={request.id}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <p className="font-medium text-foreground">{request.company_name}</p>
                        <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                          <span>{request.name}</span>
                          <span>-</span>
                          <span>{request.contact_phone}</span>
                          <span>-</span>
                          <span>{formattedDate}</span>
                        </div>
                      </div>
                      <span className={`shrink-0 rounded-full px-2 py-1 text-xs ${statusColor}`}>
                        {statusLabel}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </section>
      )}
    </div>
  )
}
