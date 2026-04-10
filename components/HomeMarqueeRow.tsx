'use client'

import Link from 'next/link'
import type { HomeMarqueeCard } from '@/lib/homeCarouselData'
import { useState, useEffect, useRef } from 'react'

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
    if (animating) return
    setDirection(dir)
    setAnimating(true)
    setTimeout(() => {
      setCurrentPage(page)
      setAnimating(false)
    }, 300)
  }

  useEffect(() => {
    if (totalPages <= 1) return
    timeoutRef.current = setInterval(() => {
      setDirection('left')
      setAnimating(true)
      setTimeout(() => {
        setCurrentPage(prev => (prev + 1) % totalPages)
        setAnimating(false)
      }, 300)
    }, 5000)
    return () => { if (timeoutRef.current) clearInterval(timeoutRef.current) }
  }, [totalPages])

  const startIndex = currentPage * visibleItemsCount
  const visibleItems = items.slice(startIndex, startIndex + visibleItemsCount)

  return (
    <section className="mb-16">
      <div className="mb-5 flex flex-wrap items-end justify-between gap-3 px-1">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-white md:text-3xl">{title}</h2>
          {subtitle ? <p className="mt-1 text-sm text-gray-400">{subtitle}</p> : null}
        </div>
        <Link href={viewAllHref} className="shrink-0 text-sm font-medium text-[#66c0f4] transition hover:text-[#8fcefa]">
          {viewAllLabel} →
        </Link>
      </div>

      <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#0e1621]/90 shadow-xl">
        <div
          className="flex w-full gap-4 px-12 py-5 justify-center"
          style={{
            transition: 'opacity 0.3s ease, transform 0.3s ease',
            opacity: animating ? 0 : 1,
            transform: animating
              ? `translateX(${direction === 'left' ? '-40px' : '40px'})`
              : 'translateX(0)'
          }}
        >
          {visibleItems.map((item, i) => (
            <Link
              key={`${item.id}-${i}`}
              href={item.href}
              className="w-[260px] max-w-[260px] shrink-0 group/card overflow-hidden rounded-xl bg-gray-800/90 ring-1 ring-white/10 transition hover:bg-gray-800 hover:ring-[#66c0f4]/40"
            >
              <div className="aspect-[4/3] overflow-hidden bg-black/80">
                <img
                  src={item.image}
                  alt={item.title}
                  className="h-full w-full object-cover transition duration-300 group-hover/card:scale-[1.04]"
                />
              </div>
              <div className="space-y-0.5 p-3.5">
                <p className="line-clamp-2 font-semibold leading-snug text-white">{item.title}</p>
                {item.subtitle ? (
                  <p className="line-clamp-1 text-xs text-gray-400">{item.subtitle}</p>
                ) : null}
              </div>
            </Link>
          ))}
        </div>

        <button
          onClick={() => goToPage(currentPage === 0 ? totalPages - 1 : currentPage - 1, 'right')}
          className="absolute left-3 top-1/2 -translate-y-1/2 z-10 bg-black/50 hover:bg-black/80 text-white rounded-full w-10 h-10 flex items-center justify-center transition backdrop-blur-sm border border-white/20"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
        <button
          onClick={() => goToPage((currentPage + 1) % totalPages, 'left')}
          className="absolute right-3 top-1/2 -translate-y-1/2 z-10 bg-black/50 hover:bg-black/80 text-white rounded-full w-10 h-10 flex items-center justify-center transition backdrop-blur-sm border border-white/20"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      </div>
    </section>
  )
}