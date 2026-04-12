'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect, useRef, useCallback } from 'react'

type HomeMarqueeCard = {
  id: string
  title: string
  subtitle?: string
  image: string
  href: string
}

type HomeMarqueeRowProps = {
  title: string
  subtitle?: string
  items: HomeMarqueeCard[]
  durationSec?: number
  viewAllHref: string
  viewAllLabel?: string
}

export function HomeMarqueeRow({
  title,
  subtitle,
  items,
  durationSec = 5,
  viewAllHref,
  viewAllLabel = 'View all'
}: HomeMarqueeRowProps) {
  if (items.length === 0) return null

  const [visibleCount, setVisibleCount] = useState(5)

  // Responsive visible items
  useEffect(() => {
    const updateVisibleCount = () => {
      const width = window.innerWidth
      if (width >= 1280) setVisibleCount(5)      // Large desktop
      else if (width >= 1024) setVisibleCount(4) // Desktop / large tablet
      else if (width >= 768) setVisibleCount(3)  // Tablet
      else if (width >= 480) setVisibleCount(2)  // Large mobile
      else setVisibleCount(1)                    // Small mobile
    }

    updateVisibleCount()
    window.addEventListener('resize', updateVisibleCount)
    return () => window.removeEventListener('resize', updateVisibleCount)
  }, [])

  const totalPages = Math.ceil(items.length / visibleCount)
  const [currentPage, setCurrentPage] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)

  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  const goToPage = useCallback((page: number) => {
    if (isAnimating || page === currentPage) return
    setIsAnimating(true)
    setCurrentPage(page)
    setTimeout(() => setIsAnimating(false), 520)
  }, [isAnimating, currentPage])

  const startAutoAdvance = useCallback(() => {
    if (timeoutRef.current) clearInterval(timeoutRef.current)
    timeoutRef.current = setInterval(() => {
      const nextPage = (currentPage + 1) % totalPages
      goToPage(nextPage)
    }, durationSec * 1000)
  }, [currentPage, totalPages, durationSec, goToPage])

  const stopAutoAdvance = useCallback(() => {
    if (timeoutRef.current) {
      clearInterval(timeoutRef.current)
      timeoutRef.current = null
    }
  }, [])

  useEffect(() => {
    if (totalPages <= 1) return
    startAutoAdvance()
    return () => stopAutoAdvance()
  }, [startAutoAdvance, stopAutoAdvance, totalPages])

  const handleMouseEnter = () => stopAutoAdvance()
  const handleMouseLeave = () => {
    if (totalPages > 1) startAutoAdvance()
  }

  // Responsive card width
  const cardWidth = visibleCount === 5 ? 280 :
                    visibleCount === 4 ? 265 :
                    visibleCount === 3 ? 280 : 260

  const gap = 24
  const pageWidth = cardWidth + gap

  return (
    <section className="mb-16">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4 px-1">
        <div>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-white">{title}</h2>
          {subtitle && <p className="mt-2 text-lg text-zinc-400">{subtitle}</p>}
        </div>
        <Link 
          href={viewAllHref} 
          className="shrink-0 text-sm font-medium text-[#66c0f4] hover:text-[#8fcefa] transition-colors flex items-center gap-1"
        >
          {viewAllLabel} →
        </Link>
      </div>

      <div 
        className="relative overflow-hidden rounded-3xl border border-white/10 bg-zinc-950 shadow-2xl"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div
          className="flex transition-transform duration-500 ease-out"
          style={{
            transform: `translateX(-${currentPage * pageWidth}px)`,
            gap: `${gap}px`,
            padding: '32px 40px',
          }}
        >
          {items.map((item) => (
            <Link
              key={item.id}
              href={item.href}
              className="group flex-none overflow-hidden bg-[#1b2838] border border-[#2a475e] rounded-2xl hover:border-[#66c0f4] hover:-translate-y-1 transition-all duration-300"
              style={{ width: `${cardWidth}px` }}
            >
              <div className="relative aspect-[16/9] overflow-hidden bg-black">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="p-5 space-y-2">
                <h3 className="font-semibold text-base md:text-lg leading-tight text-white line-clamp-2 group-hover:text-[#66c0f4] transition-colors">
                  {item.title}
                </h3>
                {item.subtitle && (
                  <p className="text-sm text-zinc-400 line-clamp-1">{item.subtitle}</p>
                )}
              </div>
            </Link>
          ))}
        </div>

        {/* Navigation Buttons - hide on very small screens if only 1 card visible */}
        {totalPages > 1 && (
          <>
            <button
              onClick={() => goToPage(currentPage === 0 ? totalPages - 1 : currentPage - 1)}
              disabled={isAnimating}
              className="absolute left-4 md:left-6 top-1/2 -translate-y-1/2 z-20 bg-black/70 hover:bg-black/90 text-white rounded-full w-10 h-10 md:w-12 md:h-12 flex items-center justify-center transition-all border border-white/20 hover:border-white/40 disabled:opacity-40"
            >
              ←
            </button>
            <button
              onClick={() => goToPage((currentPage + 1) % totalPages)}
              disabled={isAnimating}
              className="absolute right-4 md:right-6 top-1/2 -translate-y-1/2 z-20 bg-black/70 hover:bg-black/90 text-white rounded-full w-10 h-10 md:w-12 md:h-12 flex items-center justify-center transition-all border border-white/20 hover:border-white/40 disabled:opacity-40"
            >
              →
            </button>
          </>
        )}
      </div>
    </section>
  )
}