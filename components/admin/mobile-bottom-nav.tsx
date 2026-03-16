'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Calendar,
  Handshake,
  Images,
  LayoutDashboard,
  Lightbulb,
  Users,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const items = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/eventos', label: 'Eventos', icon: Calendar },
  { href: '/admin/memorias', label: 'Memorias', icon: Images },
  { href: '/admin/participantes', label: 'Particip.', icon: Users },
  { href: '/admin/sugestoes', label: 'Mensagens', icon: Lightbulb },
  { href: '/admin/patrocinadores', label: 'Patroc.', icon: Handshake },
]

export function AdminMobileBottomNav() {
  const pathname = usePathname()

  const isActive = (href: string) => {
    if (href === '/admin') return pathname === '/admin'
    return pathname.startsWith(href)
  }

  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-border/70 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 lg:hidden">
      <div className="grid grid-cols-6">
        {items.map((item) => {
          const Icon = item.icon
          const active = isActive(item.href)

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex flex-col items-center justify-center gap-1 px-1 py-3 text-[10px] transition-colors',
                active ? 'text-primary' : 'text-muted-foreground'
              )}
            >
              <Icon className={cn('size-4', active && 'text-primary')} />
              <span>{item.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
