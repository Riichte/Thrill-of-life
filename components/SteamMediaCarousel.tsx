'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { ChevronLeft, ChevronRight, Play } from 'lucide-react'

export type SteamSlide = {
  src: string
  alt?: string
  /** Show play icon on thumbnail (e.g. linked trailer / video) */
  isVideo?: boolean
}

type SteamMediaCarouselProps = {
  slides: SteamSlide[]
  /** Auto-advance interval in ms; omit to disable */
  autoAdvanceMs?: number
  className?: string
}

export function SteamMediaCarousel({ slides, autoAdvanceMs, className = '' }: SteamMediaCarouselProps) {
  const [index, setIndex] = useState(0)
  const stripRef = useRef<HTMLDivElement>(null)

  const n = slides.length
  const safeIndex = n ? index % n : 0
  const current = slides[safeIndex]

  useEffect(() => {
    setIndex((i) => (n ? i % n : 0))
  }, [n])

  useEffect(() => {
    if (!autoAdvanceMs || n <= 1) return
    const t = setInterval(() => {
      setIndex((prev) => (prev + 1) % n)
    }, autoAdvanceMs)
    return () => clearInterval(t)
  }, [autoAdvanceMs, n])

  const go = useCallback(
    (delta: number) => {
      if (!n) return
      setIndex((prev) => (prev + delta + n) % n)
    },
    [n]
  )

  const scrollStrip = (dir: -1 | 1) => {
    stripRef.current?.scrollBy({ left: dir * 220, behavior: 'smooth' })
  }

  const progressPct = n ? ((safeIndex + 1) / n) * 100 : 100

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
        <img
          src={current.src}
          alt={current.alt ?? 'Media'}
          className="h-full w-full object-cover"
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

        {/* Gallery position / progress bar (Steam-style) */}
        <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#1b2838]">
          <div
            className="h-full bg-[#66c0f4] transition-[width] duration-300 ease-out"
            style={{ width: `${progressPct}%` }}
          />
        </div>
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
            className="mx-9 flex gap-2 overflow-x-auto pb-1"
          >
            {slides.map((slide, i) => (
              <button
                key={`${slide.src}-${i}`}
                type="button"
                onClick={() => setIndex(i)}
                className={`relative h-[65px] w-[116px] flex-shrink-0 overflow-hidden rounded-sm transition-all ${
                  i === safeIndex
                    ? 'ring-2 ring-white ring-offset-2 ring-offset-[#0e1621]'
                    : 'opacity-80 hover:opacity-100'
                }`}
              >
                <img src={slide.src} alt={slide.alt ?? ''} className="h-full w-full object-cover" />
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
