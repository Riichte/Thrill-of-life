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

export function SimilarRidesCarousel({
  title = "Similar Rides",
  subtitle,
  items,
  currentRideId,
}: SimilarRidesCarouselProps) {
  if (items.length === 0) return null

  const trackRef = useRef<HTMLDivElement>(null)
  const [currentPage, setCurrentPage] = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  const [isAnimating, setIsAnimating] = useState(false)

  // Calculate how many cards fit and total pages
  const calcPages = useCallback(() => {
    const track = trackRef.current
    if (!track) return
    const container = track.parentElement
    if (!container) return

    const containerWidth = container.clientWidth
    const firstCard = track.querySelector('[data-card]') as HTMLElement
    if (!firstCard) return

    const cardWidth = firstCard.offsetWidth
    const gap = 24 // gap-6
    const visible = Math.max(1, Math.floor(containerWidth / (cardWidth + gap)))
    
    setTotalPages(Math.ceil(items.length / visible))
    setCurrentPage(p => Math.min(p, Math.ceil(items.length / visible) - 1))
  }, [items.length])

  useEffect(() => {
    calcPages()
    const ro = new ResizeObserver(calcPages)
    if (trackRef.current?.parentElement) {
      ro.observe(trackRef.current.parentElement)
    }
    return () => ro.disconnect()
  }, [calcPages])

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

      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-zinc-950 shadow-2xl">
        <div className="overflow-hidden px-8 py-8">
          <div
            ref={trackRef}
            className="flex gap-6 transition-transform duration-500 ease-out"
            style={{ 
              transform: `translateX(calc(-${currentPage * 100}%))` 
            }}
          >
            {items.map((ride) => (
              <Link
                key={ride.id}
                href={`/parks/${ride.parkId}/${ride.id}`}
                data-card
                className="group flex-none w-[calc(20%-19.2px)] xl:w-[calc(20%-19.2px)] lg:w-[calc(25%-18px)] md:w-[calc(33.333%-16px)] sm:w-[calc(50%-12px)] w-full overflow-hidden bg-[#1b2838] border border-[#2a475e] rounded-2xl hover:border-[#66c0f4] hover:-translate-y-1 transition-all duration-300"
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

                  {/* Type badge */}
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

                  {/* Stats */}
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
        </div>

        {/* Navigation Buttons */}
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
            <div className="flex justify-center gap-2 pb-6">
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