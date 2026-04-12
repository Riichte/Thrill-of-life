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

  const trackRef = useRef<HTMLDivElement>(null)
  const [currentPage, setCurrentPage] = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  const [isAnimating, setIsAnimating] = useState(false)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  // Calculate total pages based on actual rendered widths
  const calcPages = useCallback(() => {
    const track = trackRef.current
    if (!track) return
    const container = track.parentElement
    if (!container) return
    const containerWidth = container.clientWidth
    const firstCard = track.querySelector('[data-card]') as HTMLElement
    if (!firstCard) return
    const cardWidth = firstCard.offsetWidth + parseInt(getComputedStyle(track).gap || '0')
    const visible = Math.max(1, Math.round(containerWidth / cardWidth))
    setTotalPages(Math.ceil(items.length / visible))
    setCurrentPage(p => Math.min(p, Math.ceil(items.length / visible) - 1))
  }, [items.length])

  useEffect(() => {
    calcPages()
    const ro = new ResizeObserver(calcPages)
    if (trackRef.current?.parentElement) ro.observe(trackRef.current.parentElement)
    return () => ro.disconnect()
  }, [calcPages])

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
        onMouseEnter={stopTimer}
        onMouseLeave={startTimer}
      >
        {/* Track */}
        <div className="overflow-hidden px-6 py-8">
          <div
            ref={trackRef}
            className="flex gap-6 transition-transform duration-500 ease-out"
            style={{ transform: `translateX(calc(-${currentPage * 100}% - ${currentPage * 0}px))` }}
          >
            {items.map((item) => (
              <Link
                key={item.id}
                href={item.href}
                data-card
                className="group flex-none w-[calc(20%-19.2px)] xl:w-[calc(20%-19.2px)] lg:w-[calc(25%-18px)] md:w-[calc(33.333%-16px)] sm:w-[calc(50%-12px)] w-full overflow-hidden bg-[#1b2838] border border-[#2a475e] rounded-2xl hover:border-[#66c0f4] hover:-translate-y-1 transition-all duration-300"
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
        </div>

        {totalPages > 1 && (
          <>
            <button
              onClick={() => goToPage(currentPage === 0 ? totalPages - 1 : currentPage - 1)}
              disabled={isAnimating}
              className="absolute left-6 top-1/2 -translate-y-1/2 z-20 bg-black/70 hover:bg-black/90 text-white rounded-full w-11 h-11 flex items-center justify-center transition-all border border-white/20 hover:border-white/40 disabled:opacity-40"
            >
              ←
            </button>
            <button
              onClick={() => goToPage((currentPage + 1) % totalPages)}
              disabled={isAnimating}
              className="absolute right-6 top-1/2 -translate-y-1/2 z-20 bg-black/70 hover:bg-black/90 text-white rounded-full w-11 h-11 flex items-center justify-center transition-all border border-white/20 hover:border-white/40 disabled:opacity-40"
            >
              →
            </button>

            {/* Dots */}
            <div className="flex justify-center gap-2 pb-4">
              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => goToPage(i)}
                  className={`w-2 h-2 rounded-full transition-colors ${i === currentPage ? 'bg-[#66c0f4]' : 'bg-white/20 hover:bg-white/40'}`}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  )
}