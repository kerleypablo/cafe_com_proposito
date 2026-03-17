import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { SuggestionForm } from '@/components/suggestion-form'
import { Lightbulb } from 'lucide-react'

export const metadata = {
  title: 'Sugestões | Café com Propósito',
  description: 'Envie suas sugestões de temas para nossos próximos encontros.',
}

export default function SugestoesPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-1 py-8 md:py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-lg mx-auto">
            {/* Page Header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center size-16 rounded-full bg-primary/10 mb-4">
                <Lightbulb className="size-8 text-primary" />
              </div>
              <h1 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4">
                Envie sua Sugestão
              </h1>
              <p className="text-muted-foreground">
                Suas ideias são muito importantes para nós! Sugira temas,
                atividades ou qualquer coisa que gostaria de ver em nossos encontros.
              </p>
            </div>

            {/* Suggestion Form */}
            <div className="bg-card rounded-2xl p-6 md:p-8 shadow-md border border-border">
              <SuggestionForm />
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
