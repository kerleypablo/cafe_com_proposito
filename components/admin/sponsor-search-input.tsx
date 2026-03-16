'use client'

import { useEffect, useState } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'

interface SponsorSearchInputProps {
  defaultValue?: string
}

export function SponsorSearchInput({ defaultValue = '' }: SponsorSearchInputProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [value, setValue] = useState(defaultValue)

  useEffect(() => {
    const timeout = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString())

      if (value.trim()) {
        params.set('nome', value.trim())
      } else {
        params.delete('nome')
      }

      const query = params.toString()
      router.replace(query ? `${pathname}?${query}` : pathname)
    }, 250)

    return () => clearTimeout(timeout)
  }, [value, pathname, router, searchParams])

  return (
    <div className="relative">
      <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        type="text"
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder="Buscar patrocinador por nome"
        className="h-10 pl-9"
      />
    </div>
  )
}
