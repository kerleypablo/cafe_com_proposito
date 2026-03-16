'use client'

import { useEffect, useState } from 'react'

interface MemoryGalleryProps {
  title: string
  images: string[]
}

export function MemoryGallery({ title, images }: MemoryGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const safeImages = images.length > 0 ? images : ['/background.png']

  useEffect(() => {
    if (safeImages.length <= 1) return

    const interval = window.setInterval(() => {
      setCurrentIndex((current) => (current + 1) % safeImages.length)
    }, 3500)

    return () => window.clearInterval(interval)
  }, [safeImages.length])

  return (
    <div className="min-w-0 space-y-4 overflow-hidden">
      <div className="relative h-[16rem] overflow-hidden rounded-[2.2rem] shadow-[0_30px_90px_-45px_rgba(0,0,0,0.4)] sm:h-[19rem] md:h-[28rem]">
        {safeImages.map((image, index) => (
          <img
            key={`${image}-${index}`}
            src={image}
            alt={`${title} - imagem ${index + 1}`}
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ease-in-out ${index === currentIndex ? 'opacity-100' : 'opacity-0'}`}
          />
        ))}
      </div>

      {safeImages.length > 1 && (
        <div className="flex justify-center gap-2">
          {safeImages.map((image, index) => (
            <button
              key={`${image}-${index}`}
              type="button"
              onClick={() => setCurrentIndex(index)}
              className={`h-2.5 rounded-full transition-all ${index === currentIndex ? 'w-8 bg-primary' : 'w-2.5 bg-border'}`}
              aria-label={`Ver imagem ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}
