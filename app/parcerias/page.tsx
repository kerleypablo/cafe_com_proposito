import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { PartnershipForm } from '@/components/partnership-form'
import { Handshake, Megaphone, Sparkles } from 'lucide-react'

export const metadata = {
  title: 'Parcerias | Café com Propósito',
  description: 'Envie sua solicitação para apoiar o projeto e divulgar sua marca junto à nossa comunidade.',
}

export default function ParceriasPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />

      <main className="flex-1 bg-[linear-gradient(180deg,#fffaf5_0%,#f5eee5_100%)] px-4 py-10 md:px-8 md:py-14">
        <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
          <section className="space-y-6 rounded-[2.4rem] bg-[linear-gradient(135deg,#f3e4d4_0%,#fffaf5_62%,#eedfce_100%)] p-6 shadow-[0_24px_80px_-48px_rgba(0,0,0,0.18)] md:p-8">
            <div className="inline-flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <Handshake className="size-7" />
            </div>
            <div className="space-y-4">
              <p className="text-sm uppercase tracking-[0.35em] text-primary/70">Parcerias</p>
              <h1 className="font-serif text-4xl leading-tight text-foreground">
                Sua marca também pode caminhar com esse projeto.
              </h1>
              <p className="max-w-xl leading-8 text-muted-foreground">
                Se você deseja apoiar o Café com Propósito, divulgar sua empresa e construir uma
                presença relevante junto à nossa comunidade, deixe seus dados aqui.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl border border-white/60 bg-white/80 p-5">
                <Megaphone className="mb-3 size-5 text-primary" />
                <h2 className="font-medium text-foreground">Visibilidade para sua marca</h2>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  Espaço para divulgar sua empresa em uma comunidade real, acolhedora e engajada.
                </p>
              </div>
              <div className="rounded-2xl border border-white/60 bg-white/80 p-5">
                <Sparkles className="mb-3 size-5 text-primary" />
                <h2 className="font-medium text-foreground">Conexão com propósito</h2>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  Uma parceria que vai além da exposição e se conecta com encontros, cuidado e presença.
                </p>
              </div>
            </div>
          </section>

          <section className="rounded-[2.2rem] border border-white/50 bg-white/85 p-6 shadow-[0_24px_80px_-48px_rgba(0,0,0,0.22)] backdrop-blur-sm md:p-8">
            <PartnershipForm />
          </section>
        </div>
      </main>

      <Footer />
    </div>
  )
}
