'use client'

import Link from 'next/link'
import Image from 'next/image'
import { ChevronDown, Menu, X, Settings } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isAboutOpen, setIsAboutOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex h-20 items-center justify-between sm:h-24">
          <Link href="/" className="flex items-center">
            <Image
              src="/icone_sfundo.png"
              alt="Cafe com Proposito"
              width={104}
              height={104}
              priority
              className="h-14 w-auto sm:h-55"
              style={{ marginLeft: '-30px' }}
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <Link 
              href="/eventos" 
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Eventos
            </Link>
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsAboutOpen((open) => !open)}
                className="flex items-center gap-1 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                Sobre
                <ChevronDown className={`size-4 transition-transform ${isAboutOpen ? 'rotate-180' : ''}`} />
              </button>
              {isAboutOpen && (
                <div className="absolute right-0 top-full mt-3 w-60 rounded-2xl border border-border bg-background/95 p-2 shadow-lg backdrop-blur">
                  <Link
                    href="/sobre"
                    className="block rounded-xl px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                    onClick={() => setIsAboutOpen(false)}
                  >
                    Sobre Cafe com Proposito
                  </Link>
                  <Link
                    href="/sobre/cibele-barsante"
                    className="block rounded-xl px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                    onClick={() => setIsAboutOpen(false)}
                  >
                    Cibele Barsante
                  </Link>
                </div>
              )}
            </div>
            <Link 
              href="/contato" 
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Contato
            </Link>
            <Link href="/admin/login">
              <Button variant="outline" size="sm" className="gap-2">
                <Settings className="size-4" />
                Admin
              </Button>
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
            <span className="sr-only">Toggle menu</span>
          </Button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden py-4 border-t border-border">
            <div className="flex flex-col gap-4">
              <Link 
                href="/eventos" 
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Eventos
              </Link>
              <Link 
                href="#"
                className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                onClick={(event) => {
                  event.preventDefault()
                  setIsAboutOpen((open) => !open)
                }}
              >
                Sobre
                <ChevronDown className={`size-4 transition-transform ${isAboutOpen ? 'rotate-180' : ''}`} />
              </Link>
              {isAboutOpen && (
                <div className="ml-3 flex flex-col gap-3 border-l border-border pl-4">
                  <Link
                    href="/sobre"
                    className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                    onClick={() => {
                      setIsAboutOpen(false)
                      setIsMenuOpen(false)
                    }}
                  >
                    Sobre Cafe com Proposito
                  </Link>
                  <Link
                    href="/sobre/cibele-barsante"
                    className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                    onClick={() => {
                      setIsAboutOpen(false)
                      setIsMenuOpen(false)
                    }}
                  >
                    Cibele Barsante
                  </Link>
                </div>
              )}
              <Link 
                href="/contato" 
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Contato
              </Link>
              <Link 
                href="/admin/login" 
                className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                <Settings className="size-4" />
                Admin
              </Link>
            </div>
          </nav>
        )}
      </div>
    </header>
  )
}
