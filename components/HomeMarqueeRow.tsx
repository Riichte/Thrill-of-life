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
  const totalPages = Math.ceil(items.length / visibleItemsCount)
  const [currentPage, setCurrentPage] = useState(0)
  const [animating, setAnimating] = useState(false)
  const [direction, setDirection] = useState<'left' | 'right'>('left')
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  const goToPage = (page: number, dir: 'left' | 'right') => {
    if (animating || page === currentPage) return

    setDirection(dir)
    setAnimating(true)

    // Smoother timing: fade out → change page → fade in
    setTimeout(() => {
      setCurrentPage(page)
      setTimeout(() => {
        setAnimating(false)
      }, 180)
    }, 180)
  }

  // Auto-advance
  useEffect(() => {
    if (totalPages <= 1) return

    timeoutRef.current = setInterval(() => {
      const nextPage = (currentPage + 1) % totalPages
      goToPage(nextPage, 'left')
    }, durationSec * 1000)

    return () => {
      if (timeoutRef.current) clearInterval(timeoutRef.current)
    }
  }, [currentPage, totalPages, durationSec])

  const startIndex = currentPage * visibleItemsCount
  const visibleItems = items.slice(startIndex, startIndex + visibleItemsCount)

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

      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-zinc-950 shadow-2xl">
        {/* Main carousel track */}
        <div
          className="flex gap-6 px-8 py-8 transition-all duration-300 ease-out"
          style={{
            opacity: animating ? 0.4 : 1,
            transform: animating 
              ? `translateX(${direction === 'left' ? '-35px' : '35px'})` 
              : 'translateX(0)'
          }}
        >
          {visibleItems.map((item, i) => (
            <Link
              key={`${item.id}-${currentPage}-${i}`}
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
              onClick={() => goToPage(currentPage === 0 ? totalPages - 1 : currentPage - 1, 'right')}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-black/70 hover:bg-black/90 text-white rounded-full w-12 h-12 flex items-center justify-center transition-all border border-white/20 hover:border-white/40 disabled:opacity-40"
              disabled={animating}
            >
              ←
            </button>
            <button
              onClick={() => goToPage((currentPage + 1) % totalPages, 'left')}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-black/70 hover:bg-black/90 text-white rounded-full w-12 h-12 flex items-center justify-center transition-all border border-white/20 hover:border-white/40 disabled:opacity-40"
              disabled={animating}
            >
              →
            </button>
          </>
        )}
      </div>
    </section>
  )
}