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

  useEffect(() => {
    if (n <= 1) return
    const next = slides[(safeIndex + 1) % n]
    if (next?.src) { const img = new window.Image(); img.src = next.src }
  }, [safeIndex, slides, n])

  useEffect(() => { setIndex(i => (n ? i % n : 0)) }, [n])

  const [resetTimer, setResetTimer] = useState(0)

  useEffect(() => {
    if (!autoAdvanceMs || n <= 1) return
    const t = setInterval(() => {
      setTimeout(() => setIndex(prev => (prev + 1) % n), 300)
    }, autoAdvanceMs)
    return () => clearInterval(t)
  }, [autoAdvanceMs, n, resetTimer])

  const go = useCallback((delta: number) => {
    if (!n) return
    setIndex(prev => (prev + delta + n) % n)
    setResetTimer(prev => prev + 1)
  }, [n])

  const scrollStrip = (dir: -1 | 1) => {
    stripRef.current?.scrollBy({ left: dir * 220, behavior: 'smooth' })
  }

  if (!n || !slides[safeIndex]) {
    return (
      <div className={`flex aspect-video items-center justify-center ${className}`}
        style={{ background: 'var(--bg-tertiary)', color: 'var(--text-muted)' }}>
        No media
      </div>
    )
  }

  return (
    <div className={`overflow-hidden rounded-sm ${className}`} style={{ background: 'var(--bg-tertiary)' }}>
      {/* Main image */}
      <div className="relative aspect-video w-full overflow-hidden" style={{ background: 'var(--bg-secondary)' }}>
        {slides.map((slide, i) => (
          <div key={slide.src} className="absolute inset-0"
            style={{ opacity: i === safeIndex ? 1 : 0, transition: 'opacity 0.6s ease', zIndex: i === safeIndex ? 1 : 0 }}>
            <Image src={slide.src} alt={slide.alt ?? 'Media'} fill
              className="object-cover" priority={i === 0} quality={75}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 85vw"
            />
          </div>
        ))}

        {n > 1 && (
          <>
            <button type="button" onClick={() => go(-1)}
              className="absolute left-2 top-1/2 z-10 -translate-y-1/2 rounded-full p-2.5 text-white transition"
              style={{ background: 'rgba(0,0,0,0.45)' }}
              onMouseEnter={e => (e.currentTarget.style.background = 'rgba(0,0,0,0.7)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'rgba(0,0,0,0.45)')}
              aria-label="Previous image">
              <ChevronLeft className="h-8 w-8" strokeWidth={2} />
            </button>
            <button type="button" onClick={() => go(1)}
              className="absolute right-2 top-1/2 z-10 -translate-y-1/2 rounded-full p-2.5 text-white transition"
              style={{ background: 'rgba(0,0,0,0.45)' }}
              onMouseEnter={e => (e.currentTarget.style.background = 'rgba(0,0,0,0.7)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'rgba(0,0,0,0.45)')}
              aria-label="Next image">
              <ChevronRight className="h-8 w-8" strokeWidth={2} />
            </button>
          </>
        )}

        {/* Dots */}
        {n > 1 && (
          <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5">
            {slides.map((_, i) => (
              <button key={i} type="button"
                onClick={() => { setIndex(i); setResetTimer(p => p + 1) }}
                className="rounded-full transition-all duration-300"
                style={{
                  background: i === safeIndex ? 'white' : 'rgba(255,255,255,0.4)',
                  width: i === safeIndex ? '16px' : '8px',
                  height: '8px',
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Thumbnail strip */}
      {n > 1 && (
        <div className="relative px-1 py-2" style={{ background: 'var(--bg-tertiary)' }}>
          <button type="button" onClick={() => scrollStrip(-1)}
            className="absolute left-0 top-1/2 z-10 -translate-y-1/2 rounded-sm p-1.5 shadow transition-colors"
            style={{ background: 'var(--card-bg)', color: 'var(--accent)' }}
            onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg-elevated)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'var(--card-bg)')}
            aria-label="Scroll thumbnails left">
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button type="button" onClick={() => scrollStrip(1)}
            className="absolute right-0 top-1/2 z-10 -translate-y-1/2 rounded-sm p-1.5 shadow transition-colors"
            style={{ background: 'var(--card-bg)', color: 'var(--accent)' }}
            onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg-elevated)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'var(--card-bg)')}
            aria-label="Scroll thumbnails right">
            <ChevronRight className="h-5 w-5" />
          </button>

          <div ref={stripRef} className="mx-9 flex gap-2 overflow-x-auto pb-1"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            {slides.map((slide, i) => (
              <button key={`${slide.src}-${i}`} type="button"
                onClick={() => { setIndex(i); setResetTimer(p => p + 1) }}
                className="relative h-[65px] w-[116px] flex-shrink-0 overflow-hidden rounded-sm transition-all"
                style={{
                  outline: i === safeIndex ? '2px solid var(--accent)' : 'none',
                  outlineOffset: '2px',
                  opacity: i === safeIndex ? 1 : 0.8,
                }}>
                <Image src={slide.src} alt={slide.alt ?? ''} fill
                  className="object-cover animate-fade-slide"
                  quality={60} sizes="116px" loading="lazy"
                />
                {slide.isVideo && (
                  <span className="absolute inset-0 flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.35)' }}>
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