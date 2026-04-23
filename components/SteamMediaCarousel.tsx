'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { ChevronLeft, ChevronRight, Play } from 'lucide-react'

export type SteamSlide = {
  src: string
  alt?: string
  isVideo?: boolean
  attribution?: {
    author: string
    url: string
    license: string
  } | null
}

type SteamMediaCarouselProps = {
  slides: SteamSlide[]
  autoAdvanceMs?: number
  className?: string
}

export function SteamMediaCarousel({ slides, autoAdvanceMs, className = '' }: SteamMediaCarouselProps) {
  const [index, setIndex] = useState(0)
  const stripRef = useRef<HTMLDivElement>(null)

  const n = slides.length
  const safeIndex = n ? index % n : 0
  const current = slides[safeIndex]

  // Preload next image
  useEffect(() => {
    if (n <= 1) return
    const nextIndex = (safeIndex + 1) % n
    const next = slides[nextIndex]
    if (next?.src) {
      const img = new window.Image()
      img.src = next.src
    }
  }, [safeIndex, slides, n])

  useEffect(() => {
    setIndex((i) => (n ? i % n : 0))
  }, [n])

  const [resetTimer, setResetTimer] = useState(0)

  useEffect(() => {
    if (!autoAdvanceMs || n <= 1) return
    const t = setInterval(() => {
      setIndex((prev) => (prev + 1) % n)
    }, autoAdvanceMs)
    return () => clearInterval(t)
  }, [autoAdvanceMs, n, resetTimer])

  const go = useCallback(
    (delta: number) => {
      if (!n) return
      setIndex((prev) => (prev + delta + n) % n)
      setResetTimer(prev => prev + 1)
    },
    [n]
  )

  const scrollStrip = (dir: -1 | 1) => {
    stripRef.current?.scrollBy({ left: dir * 220, behavior: 'smooth' })
  }

  if (!n || !current) {
    return (
      <div
        className={`flex aspect-video items-center justify-center bg-[#0e1621] text-[#8f98a0] ${className}`}
      >
        No media
      </div>
    )
  }

  return (
    <div className={`overflow-hidden rounded-sm bg-[#0e1621] ${className}`}>
      <div className="relative aspect-video w-full bg-black">
        <Image
          src={current.src}
          alt={current.alt ?? 'Media'}
          fill
          className="object-cover animate-fade-slide"
          priority={safeIndex === 0}
          quality={75}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 85vw"
        />

        {n > 1 && (
          <>
            <button
              type="button"
              onClick={() => go(-1)}
              className="absolute left-2 top-1/2 z-10 -translate-y-1/2 rounded-full bg-black/45 p-2.5 text-white transition hover:bg-black/70"
              aria-label="Previous image"
            >
              <ChevronLeft className="h-8 w-8" strokeWidth={2} />
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              className="absolute right-2 top-1/2 z-10 -translate-y-1/2 rounded-full bg-black/45 p-2.5 text-white transition hover:bg-black/70"
              aria-label="Next image"
            >
              <ChevronRight className="h-8 w-8" strokeWidth={2} />
            </button>
          </>
        )}

        {/* Dots */}
        {n > 1 && (
          <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5">
            {slides.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => { setIndex(i); setResetTimer(prev => prev + 1) }}
                className={`rounded-full transition-all duration-300 ${i === safeIndex
                  ? 'bg-white w-4 h-2'
                  : 'bg-white/40 hover:bg-white/70 w-2 h-2'
                  }`}
              />
            ))}
          </div>
        )}
      </div>

      {n > 1 && (
        <div className="relative bg-[#0e1621] px-1 py-2">
          <button
            type="button"
            onClick={() => scrollStrip(-1)}
            className="absolute left-0 top-1/2 z-10 -translate-y-1/2 rounded-sm bg-[#16202d] p-1.5 text-[#66c0f4] shadow hover:bg-[#1b2838]"
            aria-label="Scroll thumbnails left"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={() => scrollStrip(1)}
            className="absolute right-0 top-1/2 z-10 -translate-y-1/2 rounded-sm bg-[#16202d] p-1.5 text-[#66c0f4] shadow hover:bg-[#1b2838]"
            aria-label="Scroll thumbnails right"
          >
            <ChevronRight className="h-5 w-5" />
          </button>

          <div
            ref={stripRef}
            className="mx-9 flex gap-2 overflow-x-auto pb-1 scrollbar-hide"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {slides.map((slide, i) => (
              <button
                key={`${slide.src}-${i}`}
                type="button"
                onClick={() => { setIndex(i); setResetTimer(prev => prev + 1) }}
                className={`relative h-[65px] w-[116px] flex-shrink-0 overflow-hidden rounded-sm transition-all ${i === safeIndex
                  ? 'ring-2 ring-white ring-offset-2 ring-offset-[#0e1621]'
                  : 'opacity-80 hover:opacity-100'
                  }`}
              >
                <Image
                  src={slide.src}
                  alt={slide.alt ?? ''}
                  fill
                  className="object-cover animate-fade-slide"
                  quality={60}
                  sizes="116px"
                  loading="lazy"
                />
                {slide.isVideo && (
                  <span className="absolute inset-0 flex items-center justify-center bg-black/35">
                    <Play className="h-8 w-8 text-white drop-shadow-md" fill="currentColor" />
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}