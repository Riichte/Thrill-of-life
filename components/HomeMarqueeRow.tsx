'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect, useRef } from 'react'

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

  const visibleItemsCount = 5
  const cardWidth = 280          // same as your card
  const gap = 24                 // gap-6 = 1.5rem = 24px
  const pageWidth = cardWidth + gap

  const totalPages = Math.ceil(items.length / visibleItemsCount)
  const [currentPage, setCurrentPage] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const goToPage = (page: number) => {
    if (isAnimating || page === currentPage) return
    setIsAnimating(true)
    setCurrentPage(page)

    // Reset animation flag after transition ends
    setTimeout(() => setIsAnimating(false), 500)
  }

  // Auto-advance + pause on hover
  useEffect(() => {
    if (totalPages <= 1) return

    const startAuto = () => {
      timeoutRef.current = setInterval(() => {
        const nextPage = (currentPage + 1) % totalPages
        goToPage(nextPage)
      }, durationSec * 1000)
    }

    startAuto()

    return () => {
      if (timeoutRef.current) clearInterval(timeoutRef.current)
    }
  }, [currentPage, totalPages, durationSec])

  // Pause on hover
  const handleMouseEnter = () => {
    if (timeoutRef.current) clearInterval(timeoutRef.current)
  }
  const handleMouseLeave = () => {
    // Restart auto-advance
    if (totalPages > 1) {
      const nextPage = (currentPage + 1) % totalPages
      goToPage(nextPage)
    }
  }

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
        ref={containerRef}
        className="relative overflow-hidden rounded-3xl border border-white/10 bg-zinc-950 shadow-2xl"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* FULL TRACK - all cards in one row */}
        <div
          className="flex transition-transform duration-500 ease-out"
          style={{
            transform: `translateX(-${currentPage * pageWidth}px)`,
            gap: `${gap}px`,
            padding: '32px 32px', // generous padding so last card never cuts
          }}
        >
          {items.map((item) => (
            <Link
              key={item.id}
              href={item.href}
              className="group flex-none w-[280px] bg-[#1b2838] border border-[#2a475e] rounded-2xl overflow-hidden hover:border-[#66c0f4] hover:-translate-y-1 transition-all duration-300"
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
                <h3 className="font-semibold text-lg leading-tight text-white line-clamp-2 group-hover:text-[#66c0f4] transition-colors">
                  {item.title}
                </h3>
                {item.subtitle && (
                  <p className="text-sm text-zinc-400 line-clamp-1">{item.subtitle}</p>
                )}
              </div>
            </Link>
          ))}
        </div>

        {/* Navigation Buttons */}
        {totalPages > 1 && (
          <>
            <button
              onClick={() => goToPage(currentPage === 0 ? totalPages - 1 : currentPage - 1)}
              disabled={isAnimating}
              className="absolute left-6 top-1/2 -translate-y-1/2 z-20 bg-black/70 hover:bg-black/90 text-white rounded-full w-12 h-12 flex items-center justify-center transition-all border border-white/20 hover:border-white/40 disabled:opacity-40"
            >
              ←
            </button>
            <button
              onClick={() => goToPage((currentPage + 1) % totalPages)}
              disabled={isAnimating}
              className="absolute right-6 top-1/2 -translate-y-1/2 z-20 bg-black/70 hover:bg-black/90 text-white rounded-full w-12 h-12 flex items-center justify-center transition-all border border-white/20 hover:border-white/40 disabled:opacity-40"
            >
              →
            </button>
          </>
        )}
      </div>
    </section>
  )
}