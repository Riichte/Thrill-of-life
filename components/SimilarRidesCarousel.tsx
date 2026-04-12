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

export function SimilarRidesCarousel({
  title = "Similar Rides",
  subtitle,
  items,
  currentRideId,
}: SimilarRidesCarouselProps) {
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

  return (
    <section className="mt-16 mb-12">
      <div className="mb-6 flex items-end justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-white">{title}</h2>
          {subtitle && <p className="mt-1 text-lg text-zinc-400">{subtitle}</p>}
        </div>
      </div>

      <div className="relative rounded-3xl border border-white/10 bg-zinc-950 shadow-2xl">
        <div ref={containerRef} className="overflow-hidden px-6 py-8">
          {cardWidth > 0 && (
            <div
              className="flex transition-transform duration-500 ease-out"
              style={{
                gap: `${GAP}px`,
                transform: `translateX(-${getOffset(currentPage)}px)`
              }}
            >
              {items.map((ride) => (
                <Link
                  key={ride.id}
                  href={`/parks/${ride.parkId}/${ride.id}`}
                  className="group flex-none overflow-hidden bg-[#1b2838] border border-[#2a475e] rounded-2xl hover:border-[#66c0f4] hover:-translate-y-1 transition-all duration-300"
                  style={{ width: `${cardWidth}px` }}
                >
                  {/* Image */}
                  <div className="relative aspect-[16/9] overflow-hidden bg-black">
                    {ride.image ? (
                      <Image
                        src={ride.image}
                        alt={ride.name}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[#4a6a82]">
                        No image
                      </div>
                    )}
                    {ride.specs?.type && (
                      <div className="absolute top-3 right-3 bg-black/80 px-3 py-1 text-[10px] font-mono tracking-widest border border-white/20 rounded">
                        {ride.specs.type}
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    <h3 className="font-semibold text-lg leading-tight text-white line-clamp-2 group-hover:text-[#66c0f4] transition-colors">
                      {ride.name}
                    </h3>
                    <p className="text-sm text-zinc-400 mt-1">{ride.parkName}</p>
                    <div className="mt-4 flex gap-4 text-xs text-[#acb2b8] border-t border-[#2a475e] pt-4">
                      {ride.specs?.height && <span>↑ {ride.specs.height}</span>}
                      {ride.specs?.speed && <span>→ {ride.specs.speed}</span>}
                      {ride.averageRating && (
                        <span className="ml-auto">★ {ride.averageRating}</span>
                      )}
                    </div>
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
              className="absolute left-3 top-1/2 -translate-y-1/2 z-20 bg-black/70 hover:bg-black/90 text-white rounded-full w-10 h-10 flex items-center justify-center transition-all border border-white/20 hover:border-white/40 disabled:opacity-40"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>
            <button
              onClick={() => goToPage((currentPage + 1) % totalPages)}
              disabled={isAnimating}
              className="absolute right-3 top-1/2 -translate-y-1/2 z-20 bg-black/70 hover:bg-black/90 text-white rounded-full w-10 h-10 flex items-center justify-center transition-all border border-white/20 hover:border-white/40 disabled:opacity-40"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 18l6-6-6-6" />
              </svg>
            </button>

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