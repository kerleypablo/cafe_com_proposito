import Image from 'next/image'
import { Heart, Instagram } from 'lucide-react'
import { MobileBottomNav } from '@/components/mobile-bottom-nav'

export function Footer() {
  return (
    <>
      <footer className="w-full border-t border-border bg-secondary/30 pb-24 md:pb-0">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col items-center gap-4">
            <div className="flex items-center gap-2">
              <Image
                src="/icone_sfundo.png"
                alt="Cafe com Proposito"
                width={40}
                height={40}
                className="h-10 w-auto"
              />
              <span className="font-serif text-lg font-semibold text-foreground">
                Cafe com Proposito
              </span>
            </div>
            <p className="max-w-md text-center text-sm text-muted-foreground">
              Encontros mensais para mulheres que buscam crescimento pessoal, fe e autocuidado.
            </p>
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <span>Feito com</span>
              <Heart className="size-4 text-accent fill-accent" />
              <span>para nossa comunidade</span>
            </div>
            <a
              href="https://instagram.com/cafecompropositobarssante"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              <Instagram className="size-4" />
              <span>@cafecompropositobarssante</span>
            </a>
          </div>
        </div>
      </footer>

      <MobileBottomNav />
    </>
  )
}
