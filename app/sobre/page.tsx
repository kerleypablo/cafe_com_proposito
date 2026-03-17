import { Header } from '@/components/header'
import { Footer } from '@/components/footer'

export const metadata = {
  title: 'Sobre | Café com Propósito',
  description: 'Conheça a história por trás do Café com Propósito.',
}

export default function SobrePage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />

      <main className="flex-1">
        <section className="px-4 py-12 md:px-8 md:py-16">
          <div className="mx-auto max-w-6xl space-y-16">
            <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
              <div className="overflow-hidden rounded-[2.2rem] shadow-[0_30px_80px_-44px_rgba(0,0,0,0.38)]">
                <img
                  src="/background.png"
                  alt="Café com Propósito"
                  className="h-full min-h-[28rem] w-full object-cover"
                />
              </div>

              <div className="space-y-6">
                <p className="text-sm uppercase tracking-[0.4em] text-primary/70">Sobre</p>
                <h1 className="font-serif text-4xl text-foreground md:text-5xl">
                  O que é o Café com Propósito?
                </h1>
                <p className="text-lg leading-8 text-muted-foreground">
                  O Café com Propósito nasceu de algo simples, mas poderoso: encontros.
                  Começou dentro de casa, com mulheres da família, e se tornou um movimento
                  de fé, conexão e transformação.
                </p>
                <p className="leading-8 text-foreground/80">
                  É um espaço onde vidas são tocadas, corações são fortalecidos e a confiança
                  é restaurada, não apenas nas pessoas, mas principalmente em Deus.
                </p>
              </div>
            </div>

            <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
              <div className="space-y-6 order-2 lg:order-1">
                <p className="text-sm uppercase tracking-[0.4em] text-primary/70">Propósito</p>
                <h2 className="font-serif text-3xl text-foreground md:text-4xl">
                  Um movimento de fé, conexão e transformação.
                </h2>
                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="rounded-[1.8rem] border border-border/70 bg-card p-5 shadow-[0_22px_60px_-42px_rgba(0,0,0,0.25)]">
                    <p className="text-xs uppercase tracking-[0.28em] text-primary/70">Objetivo</p>
                    <p className="mt-3 text-sm leading-7 text-foreground/80">
                      Despertar pessoas para viverem com propósito, fortalecendo sua fé e
                      restaurando sua confiança em Deus e em si mesmas.
                    </p>
                  </div>
                  <div className="rounded-[1.8rem] border border-border/70 bg-card p-5 shadow-[0_22px_60px_-42px_rgba(0,0,0,0.25)]">
                    <p className="text-xs uppercase tracking-[0.28em] text-primary/70">Missão</p>
                    <p className="mt-3 text-sm leading-7 text-foreground/80">
                      Levar transformação através de encontros intencionais, criando ambientes
                      de acolhimento, profundidade e presença, onde cada pessoa possa
                      experimentar o amor de Deus de forma real.
                    </p>
                  </div>
                  <div className="rounded-[1.8rem] border border-border/70 bg-card p-5 shadow-[0_22px_60px_-42px_rgba(0,0,0,0.25)]">
                    <p className="text-xs uppercase tracking-[0.28em] text-primary/70">Visão</p>
                    <p className="mt-3 text-sm leading-7 text-foreground/80">
                      Ser um movimento que impacta vidas além de um ambiente físico,
                      alcançando corações, formando pessoas firmes na fé e conscientes do
                      seu propósito, gerando transformação que se multiplica.
                    </p>
                  </div>
                </div>
                <div className="rounded-[2rem] border border-border/70 bg-card p-6 shadow-[0_24px_70px_-45px_rgba(0,0,0,0.28)]">
                  <p className="text-sm uppercase tracking-[0.28em] text-primary/70">Valores</p>
                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    <p className="text-sm leading-7 text-muted-foreground">Fé acima de tudo</p>
                    <p className="text-sm leading-7 text-muted-foreground">Presença e intimidade com Deus</p>
                    <p className="text-sm leading-7 text-muted-foreground">Conexões verdadeiras</p>
                    <p className="text-sm leading-7 text-muted-foreground">Acolhimento sem julgamentos</p>
                    <p className="text-sm leading-7 text-muted-foreground">Processo e transformação</p>
                    <p className="text-sm leading-7 text-muted-foreground">Amor, cuidado e propósito</p>
                    <p className="text-sm leading-7 text-muted-foreground">Confiança restaurada</p>
                  </div>
                </div>
              </div>

              <div className="order-1 overflow-hidden rounded-[2.2rem] shadow-[0_30px_80px_-44px_rgba(0,0,0,0.38)] lg:order-2">
                <img
                  src="/logo_fundo.png"
                  alt="Atmosfera do Café com Propósito"
                  className="h-full min-h-[28rem] w-full object-cover"
                />
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
