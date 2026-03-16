'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { revalidatePaths } from '@/lib/revalidate-client'

interface SponsorVisibilityToggleProps {
  sponsorId: string
  initialValue: boolean
}

export function SponsorVisibilityToggle({ sponsorId, initialValue }: SponsorVisibilityToggleProps) {
  const [checked, setChecked] = useState(initialValue)
  const [isLoading, setIsLoading] = useState(false)

  async function handleChange(nextValue: boolean) {
    setChecked(nextValue)
    setIsLoading(true)

    const supabase = createClient()
    const { error } = await supabase
      .from('sponsors')
      .update({ is_active: nextValue })
      .eq('id', sponsorId)

    if (error) {
      setChecked(!nextValue)
    }

    if (!error) {
      await revalidatePaths(['/'])
    }

    setIsLoading(false)
  }

  return (
    <label className="inline-flex items-center gap-3 text-sm text-foreground">
      <input
        type="checkbox"
        checked={checked}
        disabled={isLoading}
        onChange={(event) => handleChange(event.target.checked)}
        className="size-4"
      />
      <span>{checked ? 'Exibindo no carrossel' : 'Oculto no carrossel'}</span>
    </label>
  )
}
