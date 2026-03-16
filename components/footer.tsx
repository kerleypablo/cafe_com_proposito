import { Coffee, Heart } from 'lucide-react'

export function Footer() {
  return (
    <footer className="w-full border-t border-border bg-secondary/30">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center size-8 rounded-full bg-primary">
              <Coffee className="size-4 text-primary-foreground" />
            </div>
            <span className="font-serif text-lg font-semibold text-foreground">
              Cafe com Proposito
            </span>
          </div>
          <p className="text-sm text-muted-foreground text-center max-w-md">
            Encontros mensais para mulheres que buscam crescimento pessoal, fe e autocuidado.
          </p>
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <span>Feito com</span>
            <Heart className="size-4 text-accent fill-accent" />
            <span>para nossa comunidade</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
