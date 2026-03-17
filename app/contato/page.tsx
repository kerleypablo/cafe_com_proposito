import { Footer } from '@/components/footer'
import { Header } from '@/components/header'
import { Instagram, Mail, MessageCircle } from 'lucide-react'

export const metadata = {
  title: 'Contato | Café com Propósito',
  description: 'Entre em contato com o Café com Propósito.',
}

const instagramUrl = 'https://instagram.com/cafecompropositobarssante'
const whatsappUrl = 'https://wa.me/5500000000000'
const emailAddress = 'contato@cafecomproposito.com'

export default function ContatoPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />

      <main className="flex-1">
        <section className="px-4 py-12 md:px-8 md:py-16">
          <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div className="overflow-hidden rounded-[2.2rem] shadow-[0_30px_80px_-44px_rgba(0,0,0,0.38)]">
              <img
                src="/background.png"
                alt="Contato Cafe com Proposito"
                className="h-full min-h-[28rem] w-full object-cover"
              />
            </div>

            <div className="space-y-8">
              <div className="space-y-4">
                <p className="text-sm uppercase tracking-[0.4em] text-primary/70">Contato</p>
                <h1 className="font-serif text-4xl text-foreground md:text-5xl">
                  Fale com o Café com Propósito
                </h1>
                <p className="text-lg leading-8 text-muted-foreground">
                  Este espaço já está pronto para receber sua foto e os contatos oficiais.
                  Quando você me mandar o WhatsApp e o email corretos, eu troco aqui.
                </p>
              </div>

              <div className="grid gap-4">
                <a
                  href={instagramUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-between rounded-[1.6rem] border border-border/70 bg-card px-5 py-4 shadow-[0_24px_70px_-45px_rgba(0,0,0,0.28)] transition-transform hover:-translate-y-0.5"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <Instagram className="size-5" />
                    </div>
                    <div>
                      <p className="text-sm uppercase tracking-[0.22em] text-primary/70">Instagram</p>
                      <p className="font-medium text-foreground">@cafecompropositobarssante</p>
                    </div>
                  </div>
                  <span className="text-sm text-muted-foreground">Abrir</span>
                </a>

                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-between rounded-[1.6rem] border border-border/70 bg-card px-5 py-4 shadow-[0_24px_70px_-45px_rgba(0,0,0,0.28)] transition-transform hover:-translate-y-0.5"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <MessageCircle className="size-5" />
                    </div>
                    <div>
                      <p className="text-sm uppercase tracking-[0.22em] text-primary/70">WhatsApp</p>
                      <p className="font-medium text-foreground">(00) 00000-0000</p>
                    </div>
                  </div>
                  <span className="text-sm text-muted-foreground">Abrir</span>
                </a>

                <a
                  href={`mailto:${emailAddress}`}
                  className="flex items-center justify-between rounded-[1.6rem] border border-border/70 bg-card px-5 py-4 shadow-[0_24px_70px_-45px_rgba(0,0,0,0.28)] transition-transform hover:-translate-y-0.5"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <Mail className="size-5" />
                    </div>
                    <div>
                      <p className="text-sm uppercase tracking-[0.22em] text-primary/70">Email</p>
                      <p className="font-medium text-foreground">{emailAddress}</p>
                    </div>
                  </div>
                  <span className="text-sm text-muted-foreground">Enviar</span>
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
