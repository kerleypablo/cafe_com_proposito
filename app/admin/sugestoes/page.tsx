import { createClient } from '@/lib/supabase/server'
import { Card, CardContent } from '@/components/ui/card'
import { SuggestionActions } from '@/components/admin/suggestion-actions'
import { User, Clock } from 'lucide-react'

export const metadata = {
  title: 'Mensagens | Admin Café com Propósito',
}

export default async function AdminSugestoesPage() {
  const supabase = await createClient()

  const { data: suggestions } = await supabase
    .from('suggestions')
    .select('*')
    .order('created_at', { ascending: false })

  const pendingSuggestions = suggestions?.filter(s => s.status === 'pending') || []
  const reviewedSuggestions = suggestions?.filter(s => s.status !== 'pending') || []

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-serif text-3xl font-bold text-primary">Mensagens</h1>
        <p className="text-muted-foreground">
          Sugestões, pedidos de oração e agradecimentos enviados pela comunidade
        </p>
      </div>

      {/* Pending Suggestions */}
      <section>
        <h2 className="font-serif text-xl font-semibold text-foreground mb-4">
          Pendentes ({pendingSuggestions.length})
        </h2>
        {pendingSuggestions.length > 0 ? (
          <div className="grid gap-4">
            {pendingSuggestions.map((suggestion) => {
              const createdAt = new Date(suggestion.created_at)
              const formattedDate = createdAt.toLocaleDateString('pt-BR', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
              })

              return (
                <Card key={suggestion.id}>
                  <CardContent className="p-4">
                    <div className="flex flex-col sm:flex-row gap-4">
                      <div className="flex-1 min-w-0">
                        <p className="text-foreground whitespace-pre-wrap">
                          {suggestion.suggestion}
                        </p>
                        <div className="flex flex-wrap gap-x-4 gap-y-1 mt-3 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <User className="size-4" />
                            <span>{suggestion.name || 'Anônimo'}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="size-4" />
                            <span>{formattedDate}</span>
                          </div>
                        </div>
                      </div>
                      <SuggestionActions suggestionId={suggestion.id} />
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        ) : (
          <Card>
            <CardContent className="py-8 text-center">
              <p className="text-muted-foreground">
                Nenhuma sugestão pendente
              </p>
            </CardContent>
          </Card>
        )}
      </section>

      {/* Reviewed Suggestions */}
      {reviewedSuggestions.length > 0 && (
        <section>
          <h2 className="font-serif text-xl font-semibold text-foreground mb-4">
            Revisadas ({reviewedSuggestions.length})
          </h2>
          <div className="grid gap-4 opacity-60">
            {reviewedSuggestions.map((suggestion) => {
              const createdAt = new Date(suggestion.created_at)
              const formattedDate = createdAt.toLocaleDateString('pt-BR', {
                day: 'numeric',
                month: 'short',
              })
              const statusLabel = suggestion.status === 'archived' ? 'Arquivada' : 'Lida'
              const statusColor = suggestion.status === 'archived' 
                ? 'bg-muted text-muted-foreground'
                : 'bg-primary/10 text-primary'

              return (
                <Card key={suggestion.id}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <p className="text-foreground line-clamp-2">
                          {suggestion.suggestion}
                        </p>
                        <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                          <span>{suggestion.name || 'Anônimo'}</span>
                          <span>-</span>
                          <span>{formattedDate}</span>
                        </div>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full shrink-0 ${statusColor}`}>
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
