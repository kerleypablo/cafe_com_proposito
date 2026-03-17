import { Footer } from '@/components/footer'
import { Header } from '@/components/header'

export const metadata = {
  title: 'Cibele Barsante | Café com Propósito',
  description: 'Conheça a história de Cibele Barsante e a visão por trás do Café com Propósito.',
}

export default function CibeleBarsantePage() {
  return (
    <div className="flex min-h-screen flex-col bg-[#f7f1ec]">
      <Header />

      <main className="flex-1">
        <section className="relative overflow-hidden border-b border-border/50 bg-[radial-gradient(circle_at_top,_rgba(118,74,52,0.18),_transparent_45%),linear-gradient(180deg,_#1d1512_0%,_#2a1e1a_42%,_#f7f1ec_100%)] px-4 pb-16 pt-10 text-white md:px-8 md:pb-24 md:pt-16">
          <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
            <div className="space-y-8 rounded-[2.2rem] border border-white/10 bg-[rgba(20,14,12,0.58)] p-6 shadow-[0_24px_80px_-50px_rgba(0,0,0,0.7)] backdrop-blur md:p-8">
              <div className="space-y-4">
                <p className="text-sm uppercase tracking-[0.4em] text-white/70">Cibele Barsante</p>
                <h1 className="max-w-3xl font-serif text-4xl leading-tight md:text-6xl">
                  O Café com Propósito é mais que um evento.
                  <span className="block text-[#e8c9b0]">É um movimento de cura, acolhimento e fé.</span>
                </h1>
                <p className="max-w-2xl text-lg leading-8 text-white/78">
                  Permita-se viver essa experiência. Uma caminhada que nasce do cuidado,
                  da escuta e da coragem de reunir mulheres para viverem um dia de cada vez,
                  com profundidade, direção e esperança.
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <div className="rounded-[1.8rem] border border-white/12 bg-white/8 p-5 backdrop-blur">
                  <p className="text-xs uppercase tracking-[0.28em] text-white/60">Acolhimento</p>
                  <p className="mt-3 text-sm leading-7 text-white/82">
                    Um ambiente seguro, feminino e intencional para compartilhar a vida real.
                  </p>
                </div>
                <div className="rounded-[1.8rem] border border-white/12 bg-white/8 p-5 backdrop-blur">
                  <p className="text-xs uppercase tracking-[0.28em] text-white/60">Fé</p>
                  <p className="mt-3 text-sm leading-7 text-white/82">
                    Confiança em Deus como fonte de direção, cura e sustento em cada fase.
                  </p>
                </div>
                <div className="rounded-[1.8rem] border border-white/12 bg-white/8 p-5 backdrop-blur">
                  <p className="text-xs uppercase tracking-[0.28em] text-white/60">Crescimento</p>
                  <p className="mt-3 text-sm leading-7 text-white/82">
                    Encorajamento para que mulheres avancem em seus objetivos com maturidade e verdade.
                  </p>
                </div>
              </div>
            </div>

            <div className="relative mx-auto w-full max-w-md lg:max-w-none">
              <div className="absolute -left-6 -top-6 h-32 w-32 rounded-full bg-[#e0b28d]/25 blur-3xl" />
              <div className="overflow-hidden rounded-[2.4rem] border border-white/10 bg-white/5 shadow-[0_36px_110px_-48px_rgba(0,0,0,0.8)] backdrop-blur">
                <img
                  src="/foto1.jpeg"
                  alt="Cibele Barsante"
                  className="h-[34rem] w-full object-cover object-center md:h-[40rem]"
                />
              </div>
            </div>
          </div>
        </section>

        <section className="px-4 py-14 md:px-8 md:py-20">
          <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div className="overflow-hidden rounded-[2.2rem] bg-[#2d211d] shadow-[0_30px_90px_-48px_rgba(0,0,0,0.45)]">
              <img
                src="/foto2.jpeg"
                alt="Cibele Barsante em um retrato editorial"
                className="h-full min-h-[30rem] w-full object-cover object-top"
              />
            </div>

            <div className="space-y-6">
              <p className="text-sm uppercase tracking-[0.4em] text-primary/70">Visão</p>
              <h2 className="font-serif text-3xl leading-tight text-foreground md:text-5xl">
                Proporcionar às mulheres um ambiente de acolhimento, fé e crescimento espiritual.
              </h2>
              <p className="text-lg leading-8 text-muted-foreground">
                Encorajar mulheres a alcançarem os objetivos de suas vidas e tornar cada encontro
                uma referência por seu impacto emocional e espiritual.
              </p>
              <p className="leading-8 text-foreground/80">
                A mensagem que conduz esse movimento é simples, mas firme: nós, mulheres, podemos
                chegar no topo vivendo um dia de cada vez, respeitando nossas fases, nossas
                estações e o processo que Deus construiu para cada história.
              </p>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-[1.8rem] border border-border/70 bg-white/70 p-5 shadow-[0_22px_60px_-42px_rgba(0,0,0,0.25)]">
                  <p className="text-xs uppercase tracking-[0.28em] text-primary/70">Impacto</p>
                  <p className="mt-3 text-sm leading-7 text-foreground/80">
                    Um encontro pensado para tocar a emoção, fortalecer a fé e abrir novos caminhos.
                  </p>
                </div>
                <div className="rounded-[1.8rem] border border-border/70 bg-white/70 p-5 shadow-[0_22px_60px_-42px_rgba(0,0,0,0.25)]">
                  <p className="text-xs uppercase tracking-[0.28em] text-primary/70">Direção</p>
                  <p className="mt-3 text-sm leading-7 text-foreground/80">
                    Uma jornada onde propósito e constância caminham juntos, sem pressa e sem comparação.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="px-4 pb-14 md:px-8 md:pb-20">
          <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
            <div className="space-y-6 rounded-[2.4rem] border border-border/60 bg-white p-8 shadow-[0_30px_90px_-50px_rgba(0,0,0,0.28)] md:p-10">
              <p className="text-sm uppercase tracking-[0.4em] text-primary/70">Gratidão</p>
              <h2 className="font-serif text-3xl leading-tight text-foreground md:text-4xl">
                Hoje meu coração é só gratidão a Deus.
              </h2>
              <p className="leading-8 text-foreground/80">
                Gratidão por tudo que Ele tem feito, por cada porta aberta, por cada mulher que
                chegou e por cada história que tem sido tocada através do Café com Propósito.
              </p>
              <p className="leading-8 text-foreground/80">
                O que começou como um pequeno desejo no meu coração se tornou algo muito maior
                do que eu imaginei. E eu sei que tudo isso vem das mãos de Deus.
              </p>
              <div className="rounded-[1.8rem] bg-[#2a1e1a] px-6 py-7 text-white shadow-[0_24px_70px_-40px_rgba(0,0,0,0.55)]">
                <p className="text-lg leading-8 text-white/88">
                  Que Ele continue abençoando cada encontro, cada vida e cada propósito que nasce aqui.
                  Toda honra e toda glória sejam dadas a Ele.
                </p>
              </div>
            </div>

            <div className="overflow-hidden rounded-[2.4rem] bg-[#ddd0c3] shadow-[0_30px_90px_-48px_rgba(0,0,0,0.4)]">
              <img
                src="/foto 3.jpeg"
                alt="Cibele Barsante convidando mulheres para viverem essa experiência"
                className="h-full min-h-[32rem] w-full object-cover object-top"
              />
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
