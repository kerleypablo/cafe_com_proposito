import { Header } from '@/components/header'
import { Footer } from '@/components/footer'

export const metadata = {
  title: 'Sobre | Cafe com Proposito',
  description: 'Conheca a historia por tras do Cafe com Proposito.',
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
                  alt="Cafe com Proposito"
                  className="h-full min-h-[28rem] w-full object-cover"
                />
              </div>

              <div className="space-y-6">
                <p className="text-sm uppercase tracking-[0.4em] text-primary/70">Sobre</p>
                <h1 className="font-serif text-4xl text-foreground md:text-5xl">
                  Um encontro pensado para acolher, fortalecer e inspirar mulheres.
                </h1>
                <p className="text-lg leading-8 text-muted-foreground">
                  O Cafe com Proposito nasceu do desejo de criar um espaco de encontro,
                  acolhimento e crescimento entre mulheres. Um momento simples, como um cafe
                  compartilhado, pode se transformar em algo muito maior quando existe
                  proposito por tras dele.
                </p>
                <p className="leading-8 text-foreground/80">
                  Em cada encontro, mulheres se reunem para conversar sobre a vida real:
                  desafios, emocoes, fe, escolhas e caminhos. Sao momentos de reflexao,
                  aprendizado e troca de experiencias, onde cada historia tem valor e cada
                  voz e importante.
                </p>
              </div>
            </div>

            <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
              <div className="space-y-6 order-2 lg:order-1">
                <p className="text-sm uppercase tracking-[0.4em] text-primary/70">Nossa essencia</p>
                <h2 className="font-serif text-3xl text-foreground md:text-4xl">
                  Uma comunidade que cresce a cada reuniao.
                </h2>
                <p className="leading-8 text-foreground/80">
                  O projeto busca fortalecer mulheres em sua caminhada pessoal e espiritual,
                  incentivando o autoconhecimento, o cuidado emocional e a confianca em Deus
                  como fonte de direcao e esperanca.
                </p>
                <p className="leading-8 text-foreground/80">
                  Mais do que palestras ou encontros mensais, o Cafe com Proposito e uma
                  comunidade que cresce a cada reuniao. Um ambiente seguro onde e possivel
                  compartilhar, ouvir, aprender e encontrar apoio.
                </p>
                <div className="rounded-[2rem] border border-border/70 bg-card p-6 shadow-[0_24px_70px_-45px_rgba(0,0,0,0.28)]">
                  <p className="text-lg leading-8 text-muted-foreground">
                    Aqui acreditamos que pequenas conversas podem gerar grandes
                    transformacoes. Porque as vezes tudo o que precisamos e de um momento
                    de pausa, um cafe e um proposito.
                  </p>
                </div>
              </div>

              <div className="order-1 overflow-hidden rounded-[2.2rem] shadow-[0_30px_80px_-44px_rgba(0,0,0,0.38)] lg:order-2">
                <img
                  src="/logo_fundo.png"
                  alt="Atmosfera do Cafe com Proposito"
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
