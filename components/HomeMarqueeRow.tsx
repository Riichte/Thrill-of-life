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

const GAP = 24

function getVisibleCount(w: number) {
  if (w >= 1280) return 5
  if (w >= 1024) return 4
  if (w >= 768) return 3
  if (w >= 520) return 2
  return 1
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

  const containerRef = useRef<HTMLDivElement>(null)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  const [currentPage, setCurrentPage] = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  const [visibleCount, setVisibleCount] = useState(5)
  const [cardWidth, setCardWidth] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)

  const calcLayout = useCallback(() => {
    const container = containerRef.current
    if (!container) return
    const PADDING = 48
    const w = container.clientWidth - PADDING
    const visible = getVisibleCount(w)
    const cw = (w - GAP * (visible - 1)) / visible
    const pages = Math.ceil(items.length / visible)
    setVisibleCount(visible)
    setCardWidth(cw)
    setTotalPages(pages)
    setCurrentPage(p => Math.min(p, pages - 1))
  }, [items.length])

  useEffect(() => {
    calcLayout()
    const ro = new ResizeObserver(calcLayout)
    if (containerRef.current) ro.observe(containerRef.current)
    return () => ro.disconnect()
  }, [calcLayout])

  const getOffset = useCallback((page: number) => {
    return page * visibleCount * (cardWidth + GAP)
  }, [visibleCount, cardWidth])

  const goToPage = useCallback((page: number) => {
    if (isAnimating) return
    setIsAnimating(true)
    setCurrentPage(page)
    setTimeout(() => setIsAnimating(false), 520)
  }, [isAnimating])

  const startTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current)
    if (totalPages <= 1) return
    timerRef.current = setInterval(() => {
      setCurrentPage(p => (p + 1) % totalPages)
    }, durationSec * 1000)
  }, [totalPages, durationSec])

  const stopTimer = useCallback(() => {
    if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null }
  }, [])

  useEffect(() => {
    startTimer()
    return stopTimer
  }, [startTimer, stopTimer])

  return (
    <section className="mb-16">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4 px-1">
        <div>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>{title}</h2>
          {subtitle && <p className="mt-2 text-lg" style={{ color: 'var(--text-muted)' }}>{subtitle}</p>}
        </div>
        <Link
          href={viewAllHref}
          className="shrink-0 text-sm font-medium transition-colors flex items-center gap-1"
          style={{ color: 'var(--accent)' }}
          onMouseEnter={e => (e.currentTarget.style.color = 'var(--accent-hover)')}
          onMouseLeave={e => (e.currentTarget.style.color = 'var(--accent)')}>
          {viewAllLabel} →
        </Link>
      </div>

      <div
        className="relative rounded-3xl shadow-2xl"
        style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)' }}
        onMouseEnter={stopTimer}
        onMouseLeave={startTimer}
      >
        <div ref={containerRef} className="overflow-hidden px-6 py-8">
          {cardWidth > 0 && (
            <div
              className="flex transition-transform duration-500 ease-out"
              style={{ gap: `${GAP}px`, transform: `translateX(-${getOffset(currentPage)}px)` }}
            >
              {items.map((item) => (
                <Link
                  key={item.id}
                  href={item.href}
                  className="group flex-none overflow-hidden rounded-2xl transition-all duration-300 hover:-translate-y-1"
                  style={{
                    width: `${cardWidth}px`,
                    background: 'var(--card-bg)',
                    border: '1px solid var(--border)',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--accent)')}
                  onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--border)')}>
                  <div className="relative aspect-[16/9] overflow-hidden" style={{ background: 'var(--bg-tertiary)' }}>
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-5 space-y-2">
                    <h3 className="font-semibold text-base md:text-lg leading-tight line-clamp-2 transition-colors"
                      style={{ color: 'var(--text-primary)' }}
                      onMouseEnter={e => (e.currentTarget.style.color = 'var(--accent)')}
                      onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-primary)')}>
                      {item.title}
                    </h3>
                    {item.subtitle && (
                      <p className="text-sm line-clamp-1" style={{ color: 'var(--text-muted)' }}>{item.subtitle}</p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {totalPages > 1 && (
          <>
            <button
              onClick={() => goToPage(currentPage === 0 ? totalPages - 1 : currentPage - 1)}
              disabled={isAnimating}
              className="absolute left-3 top-1/2 -translate-y-1/2 z-20 text-white rounded-full w-10 h-10 flex items-center justify-center transition-all disabled:opacity-40"
              style={{ background: 'rgba(0,0,0,0.7)', border: '1px solid rgba(255,255,255,0.2)' }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>
            <button
              onClick={() => goToPage((currentPage + 1) % totalPages)}
              disabled={isAnimating}
              className="absolute right-3 top-1/2 -translate-y-1/2 z-20 text-white rounded-full w-10 h-10 flex items-center justify-center transition-all disabled:opacity-40"
              style={{ background: 'rgba(0,0,0,0.7)', border: '1px solid rgba(255,255,255,0.2)' }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 18l6-6-6-6" />
              </svg>
            </button>

            <div className="flex justify-center gap-2 pb-4">
              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => goToPage(i)}
                  className="w-2 h-2 rounded-full transition-colors"
                  style={{ background: i === currentPage ? 'var(--accent)' : 'rgba(255,255,255,0.2)' }}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  )
}