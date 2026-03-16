'use client'

import { useState } from 'react'
import { Copy, Link as LinkIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface CopyEventLinkButtonProps {
  eventId: string
  disabled?: boolean
}

export function CopyEventLinkButton({
  eventId,
  disabled = false,
}: CopyEventLinkButtonProps) {
  const [copied, setCopied] = useState(false)

  async function handleCopy() {
    if (disabled) return

    const url = `${window.location.origin}/eventos/${eventId}`
    await navigator.clipboard.writeText(url)
    setCopied(true)

    window.setTimeout(() => setCopied(false), 1800)
  }

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      className="rounded-full"
      onClick={handleCopy}
      disabled={disabled}
      title={disabled ? 'Publique o evento para copiar o link publico' : 'Copiar link publico do evento'}
    >
      {copied ? <LinkIcon className="size-4" /> : <Copy className="size-4" />}
      <span className="sr-only sm:not-sr-only sm:ml-1">
        {copied ? 'Copiado' : 'Copiar link'}
      </span>
    </Button>
  )
}
