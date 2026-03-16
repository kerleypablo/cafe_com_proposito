'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { CalendarDays, Info, Mail, Settings } from 'lucide-react'
import { cn } from '@/lib/utils'

const items = [
  { href: '/eventos', label: 'Eventos', icon: CalendarDays },
  { href: '/sobre', label: 'Sobre', icon: Info },
  { href: '/contato', label: 'Contato', icon: Mail },
  { href: '/admin', label: 'Admin', icon: Settings },
]

export function MobileBottomNav() {
  const pathname = usePathname()

  const isActive = (href: string) => {
    if (href === '/sobre') {
      return pathname === '/sobre' || pathname.startsWith('/sobre/')
    }

    if (href === '/admin') {
      return pathname.startsWith('/admin')
    }

    return pathname === href || pathname.startsWith(`${href}/`)
  }

  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-border/70 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 md:hidden">
      <div className="grid grid-cols-4">
        {items.map((item) => {
          const Icon = item.icon
          const active = isActive(item.href)

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex flex-col items-center justify-center gap-1 px-2 py-3 text-[11px] transition-colors',
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
