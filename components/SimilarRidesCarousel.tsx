'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect, useRef, useCallback } from 'react'

interface SimilarRide {
  id: string
  name: string
  parkName: string
  parkId: string
  image: string | null
  specs?: {
    type?: string
    height?: string | number
    speed?: string | number
  }
  averageRating?: number
}

type SimilarRidesCarouselProps = {
  title?: string
  subtitle?: string
  items: SimilarRide[]
  currentRideId: string
}

const GAP = 24

function getVisibleCount(w: number) {
  if (w >= 1280) return 5
  if (w >= 1024) return 4
  if (w >= 768) return 3
  if (w >= 520) return 2
  return 1
}

export function SimilarRidesCarousel({ title = 'Similar Rides', subtitle, items, currentRideId }: SimilarRidesCarouselProps) {
  if (items.length === 0) return null

  const containerRef = useRef<HTMLDivElement>(null)
  const [currentPage, setCurrentPage] = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  const [visibleCount, setVisibleCount] = useState(5)
  const [cardWidth, setCardWidth] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)

  const calcLayout = useCallback(() => {
    const container = containerRef.current
    if (!container) return
    const w = container.clientWidth - 48
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

  const getOffset = useCallback((page: number) => page * visibleCount * (cardWidth + GAP), [visibleCount, cardWidth])

  const goToPage = useCallback((page: number) => {
    if (isAnimating) return
    setIsAnimating(true)
    setCurrentPage(page)
    setTimeout(() => setIsAnimating(false), 520)
  }, [isAnimating])

  return (
    <section className="mt-16 mb-12">
      <div className="mb-6 flex items-end justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>{title}</h2>
          {subtitle && <p className="mt-1 text-lg" style={{ color: 'var(--text-muted)' }}>{subtitle}</p>}
        </div>
      </div>

      <div className="relative rounded-3xl shadow-2xl" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)' }}>
        <div ref={containerRef} className="overflow-hidden px-6 py-8">
          {cardWidth > 0 && (
            <div className="flex transition-transform duration-500 ease-out"
              style={{ gap: `${GAP}px`, transform: `translateX(-${getOffset(currentPage)}px)` }}>
              {items.map(ride => (
                <Link key={ride.id} href={`/parks/${ride.parkId}/${ride.id}`}
                  className="group flex-none overflow-hidden rounded-2xl transition-all duration-300 hover:-translate-y-1"
                  style={{ width: `${cardWidth}px`, background: 'var(--card-bg)', border: '1px solid var(--border)' }}
                  onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--accent)')}
                  onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--border)')}>

                  {/* Image */}
                  <div className="relative aspect-[16/9] overflow-hidden" style={{ background: 'var(--bg-tertiary)' }}>
                    {ride.image ? (
                      <Image src={ride.image} alt={ride.name} fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-sm"
                        style={{ color: 'var(--text-faint)' }}>No image</div>
                    )}
                    {ride.specs?.type && (
                      <div className="absolute top-3 right-3 px-3 py-1 text-[10px] font-mono tracking-widest rounded"
                        style={{ background: 'rgba(0,0,0,0.8)', color: 'var(--text-primary)', border: '1px solid rgba(255,255,255,0.2)' }}>
                        {ride.specs.type}
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    <h3 className="font-semibold text-lg leading-tight line-clamp-2 transition-colors"
                      style={{ color: 'var(--text-primary)' }}
                      onMouseEnter={e => (e.currentTarget.style.color = 'var(--accent)')}
                      onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-primary)')}>
                      {ride.name}
                    </h3>
                    <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>{ride.parkName}</p>
                    <div className="mt-4 flex gap-4 text-xs pt-4" style={{ color: 'var(--text-secondary)', borderTop: '1px solid var(--border)' }}>
                      {ride.specs?.height && <span>↑ {ride.specs.height}</span>}
                      {ride.specs?.speed && <span>→ {ride.specs.speed}</span>}
                      {ride.averageRating && <span className="ml-auto">★ {ride.averageRating}</span>}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {totalPages > 1 && (
          <>
            {[
              { dir: -1, pos: 'left-3', label: 'Previous', path: 'M15 18l-6-6 6-6' },
              { dir: 1, pos: 'right-3', label: 'Next', path: 'M9 18l6-6-6-6' },
            ].map(({ dir, pos, label, path }) => (
              <button key={dir}
                onClick={() => goToPage(dir === -1 ? (currentPage === 0 ? totalPages - 1 : currentPage - 1) : (currentPage + 1) % totalPages)}
                disabled={isAnimating}
                className={`absolute ${pos} top-1/2 -translate-y-1/2 z-20 text-white rounded-full w-10 h-10 flex items-center justify-center transition-all disabled:opacity-40`}
                style={{ background: 'rgba(0,0,0,0.7)', border: '1px solid rgba(255,255,255,0.2)' }}
                aria-label={label}>
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d={path} />
                </svg>
              </button>
            ))}

            <div className="flex justify-center gap-2 pb-4">
              {Array.from({ length: totalPages }).map((_, i) => (
                <button key={i} onClick={() => goToPage(i)}
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