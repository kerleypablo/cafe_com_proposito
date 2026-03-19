'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { 
  LayoutDashboard, 
  Calendar, 
  Users, 
  Lightbulb, 
  Images,
  Handshake,
  BriefcaseBusiness,
  Gift,
  Settings,
  LogOut,
  Menu,
  X
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useState } from 'react'

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/eventos', label: 'Eventos', icon: Calendar },
  { href: '/admin/memorias', label: 'Memorias', icon: Images },
  { href: '/admin/sorteio', label: 'Sorteio', icon: Gift },
  { href: '/admin/participantes', label: 'Participantes', icon: Users },
  { href: '/admin/sugestoes', label: 'Sugestoes', icon: Lightbulb },
  { href: '/admin/parcerias', label: 'Parcerias', icon: BriefcaseBusiness },
  { href: '/admin/patrocinadores', label: 'Patrocinadores', icon: Handshake },
  { href: '/admin/conta', label: 'Conta', icon: Settings },
]

export function AdminSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)

  async function handleLogout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/admin/login')
    router.refresh()
  }

  const isActive = (href: string) => {
    if (href === '/admin') {
      return pathname === '/admin'
    }
    return pathname.startsWith(href)
  }

  return (
    <>
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-card border-b border-border px-4 py-3">
        <div className="flex items-center justify-between">
          <Link href="/admin" className="flex items-center gap-2">
            <Image
              src="/icone_sfundo.png"
              alt="Café com Propósito"
              width={44}
              height={44}
              className="h-11 w-auto"
            />
            <span className="font-serif font-semibold text-foreground">Café com Propósito</span>
          </Link>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      {isOpen && (
        <div 
          className="lg:hidden fixed inset-0 z-40 bg-foreground/20"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "fixed lg:sticky top-0 left-0 z-40 h-screen w-64 bg-card border-r border-border flex flex-col transition-transform duration-200",
        "lg:translate-x-0",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        {/* Logo */}
        <div className="p-6 border-b border-border hidden lg:block">
          <Link href="/admin" className="flex items-center gap-2">
            <Image
              src="/icone_sfundo.png"
              alt="Café com Propósito"
              width={64}
              height={64}
              className="h-14 w-auto"
            />
            <div>
              <span className="font-serif font-semibold text-foreground block">
                Café com Propósito
              </span>
              <span className="text-xs text-muted-foreground">Admin</span>
            </div>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-4 pb-28 pt-20 lg:pb-4 lg:pt-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon
            const active = isActive(item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors",
                  active 
                    ? "bg-primary text-primary-foreground" 
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                )}
              >
                <Icon className="size-5" />
                {item.label}
              </Link>
            )
          })}
        </nav>

        {/* Footer */}
        <div className="border-t border-border p-4 pb-24 lg:pb-4">
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 text-muted-foreground hover:text-foreground"
            onClick={handleLogout}
          >
            <LogOut className="size-5" />
            Sair
          </Button>
          <Link 
            href="/"
            className="flex items-center gap-3 px-3 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Ver site
          </Link>
        </div>
      </aside>
    </>
  )
}
