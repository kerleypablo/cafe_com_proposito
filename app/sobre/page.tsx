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
                  Um encontro pensado para acolher, fortalecer e inspirar mulheres.
                </h1>
                <p className="text-lg leading-8 text-muted-foreground">
                  O Café com Propósito nasceu do desejo de criar um espaço de encontro,
                  acolhimento e crescimento entre mulheres. Um momento simples, como um café
                  compartilhado, pode se transformar em algo muito maior quando existe
                  propósito por trás dele.
                </p>
                <p className="leading-8 text-foreground/80">
                  Em cada encontro, mulheres se reúnem para conversar sobre a vida real:
                  desafios, emoções, fé, escolhas e caminhos. São momentos de reflexão,
                  aprendizado e troca de experiências, onde cada história tem valor e cada
                  voz é importante.
                </p>
              </div>
            </div>

            <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
              <div className="space-y-6 order-2 lg:order-1">
                <p className="text-sm uppercase tracking-[0.4em] text-primary/70">Nossa essência</p>
                <h2 className="font-serif text-3xl text-foreground md:text-4xl">
                  Uma comunidade que cresce a cada reunião.
                </h2>
                <p className="leading-8 text-foreground/80">
                  O projeto busca fortalecer mulheres em sua caminhada pessoal e espiritual,
                  incentivando o autoconhecimento, o cuidado emocional e a confiança em Deus
                  como fonte de direção e esperança.
                </p>
                <p className="leading-8 text-foreground/80">
                  Mais do que palestras ou encontros mensais, o Café com Propósito é uma
                  comunidade que cresce a cada reunião. Um ambiente seguro onde é possível
                  compartilhar, ouvir, aprender e encontrar apoio.
                </p>
                <div className="rounded-[2rem] border border-border/70 bg-card p-6 shadow-[0_24px_70px_-45px_rgba(0,0,0,0.28)]">
                  <p className="text-lg leading-8 text-muted-foreground">
                    Aqui acreditamos que pequenas conversas podem gerar grandes
                    transformações. Porque às vezes tudo o que precisamos é de um momento
                    de pausa, um café e um propósito.
                  </p>
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
