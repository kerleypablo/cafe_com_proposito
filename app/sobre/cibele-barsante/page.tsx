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
                  Quem é Sibeli?
                  <span className="block text-[#e8c9b0]">Uma mulher movida pela fé e guiada por Deus.</span>
                </h1>
                <p className="max-w-2xl text-lg leading-8 text-white/78">
                  Sibeli é uma mulher movida pela fé, guiada por Deus e apaixonada por
                  transformar vidas através de conexões verdadeiras. Ela carrega no coração
                  o desejo de ver pessoas restauradas, confiantes e alinhadas com o propósito
                  que o Senhor tem para cada uma.
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <div className="rounded-[1.8rem] border border-white/12 bg-white/8 p-5 backdrop-blur">
                  <p className="text-xs uppercase tracking-[0.28em] text-white/60">Fé</p>
                  <p className="mt-3 text-sm leading-7 text-white/82">
                    Uma vida guiada por Deus, sustentada pela presença e pela confiança nEle.
                  </p>
                </div>
                <div className="rounded-[1.8rem] border border-white/12 bg-white/8 p-5 backdrop-blur">
                  <p className="text-xs uppercase tracking-[0.28em] text-white/60">Propósito</p>
                  <p className="mt-3 text-sm leading-7 text-white/82">
                    O desejo de ver vidas restauradas e alinhadas com o chamado do Senhor.
                  </p>
                </div>
                <div className="rounded-[1.8rem] border border-white/12 bg-white/8 p-5 backdrop-blur">
                  <p className="text-xs uppercase tracking-[0.28em] text-white/60">Conexões</p>
                  <p className="mt-3 text-sm leading-7 text-white/82">
                    Relações verdadeiras que fortalecem, acolhem e transformam.
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
              <p className="text-sm uppercase tracking-[0.4em] text-primary/70">Essência</p>
              <h2 className="font-serif text-3xl leading-tight text-foreground md:text-5xl">
                Mais do que palavras, Sibeli vive aquilo que acredita.
              </h2>
              <p className="text-lg leading-8 text-muted-foreground">
                Processos, entrega, crescimento e dependência de Deus fazem parte da sua
                caminhada e da forma como ela conduz sua vida.
              </p>
              <p className="leading-8 text-foreground/80">
                Sua vida é um testemunho de que, mesmo quando tudo parece incerto, é na
                presença que encontramos direção, força e recomeço.
              </p>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-[1.8rem] border border-border/70 bg-white/70 p-5 shadow-[0_22px_60px_-42px_rgba(0,0,0,0.25)]">
                  <p className="text-xs uppercase tracking-[0.28em] text-primary/70">Direção</p>
                  <p className="mt-3 text-sm leading-7 text-foreground/80">
                    Na presença de Deus, até os caminhos incertos encontram sentido.
                  </p>
                </div>
                <div className="rounded-[1.8rem] border border-border/70 bg-white/70 p-5 shadow-[0_22px_60px_-42px_rgba(0,0,0,0.25)]">
                  <p className="text-xs uppercase tracking-[0.28em] text-primary/70">Recomeço</p>
                  <p className="mt-3 text-sm leading-7 text-foreground/80">
                    Quando Deus conduz, sempre existe força para continuar e começar de novo.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="px-4 pb-14 md:px-8 md:pb-20">
          <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
            <div className="space-y-6 rounded-[2.4rem] border border-border/60 bg-white p-8 shadow-[0_30px_90px_-50px_rgba(0,0,0,0.28)] md:p-10">
              <p className="text-sm uppercase tracking-[0.4em] text-primary/70">Convicção</p>
              <h2 className="font-serif text-3xl leading-tight text-foreground md:text-4xl">
                Uma história marcada pela presença de Deus.
              </h2>
              <p className="leading-8 text-foreground/80">
                Sibeli carrega no coração a certeza de que vidas podem ser restauradas,
                fortalecidas e reposicionadas quando encontram direção no Senhor.
              </p>
              <p className="leading-8 text-foreground/80">
                É essa verdade que sustenta sua jornada e inspira cada passo, cada encontro
                e cada conexão construída com propósito.
              </p>
              <div className="space-y-4 rounded-[1.8rem] border border-border/70 bg-[#f8f1ea] p-6">
                <p className="font-serif text-2xl text-foreground">
                  Hoje meu coração é só gratidão a Deus.
                </p>
                <p className="leading-8 text-foreground/80">
                  Gratidão por tudo que Ele tem feito, por cada porta aberta, por cada mulher
                  que chegou e por cada história que tem sido tocada através do Café com
                  Propósito.
                </p>
                <p className="leading-8 text-foreground/80">
                  O que começou como um pequeno desejo no meu coração se tornou algo muito
                  maior do que eu imaginei. E eu sei que tudo isso vem das mãos de Deus.
                </p>
                <p className="leading-8 text-foreground/80">
                  Que Ele continue abençoando cada encontro, cada vida e cada propósito que
                  nasce aqui.
                </p>
              </div>
              <div className="rounded-[1.8rem] bg-[#2a1e1a] px-6 py-7 text-white shadow-[0_24px_70px_-40px_rgba(0,0,0,0.55)]">
                <p className="text-lg leading-8 text-white/88">
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
