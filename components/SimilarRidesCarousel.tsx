'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'

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

  const visibleItemsCount = 4 // Slightly fewer than homepage for better card size on ride pages
  const totalPages = Math.ceil(items.length / visibleItemsCount)
  const [currentPage, setCurrentPage] = useState(0)
  const [animating, setAnimating] = useState(false)
  const [direction, setDirection] = useState<'left' | 'right'>('left')

  const goToPage = (page: number, dir: 'left' | 'right') => {
    if (animating || page === currentPage) return
    setDirection(dir)
    setAnimating(true)
    setTimeout(() => {
      setCurrentPage(page)
      setAnimating(false)
    }, 280)
  }

  const startIndex = currentPage * visibleItemsCount
  const visibleItems = items.slice(startIndex, startIndex + visibleItemsCount)

  return (
    <section className="mt-16 mb-12">
      <div className="mb-6 flex items-end justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-white">{title}</h2>
          {subtitle && <p className="mt-1 text-zinc-400 text-lg">{subtitle}</p>}
        </div>

        {totalPages > 1 && (
          <div className="text-sm text-zinc-500 font-mono">
            {currentPage + 1} / {totalPages}
          </div>
        )}
      </div>

      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-zinc-950 shadow-2xl">
        <div
          className="flex gap-6 px-8 py-8 transition-all duration-300 ease-out"
          style={{
            opacity: animating ? 0.75 : 1,
            transform: animating
              ? `translateX(${direction === 'left' ? '-25px' : '25px'})`
              : 'translateX(0)'
          }}
        >
          {visibleItems.map((ride) => (
            <Link
              key={ride.id}
              href={`/parks/${ride.parkId}/${ride.id}`}
              className="group flex-none w-[290px] bg-[#1b2838] border border-[#2a475e] rounded-xl overflow-hidden hover:border-[#66c0f4] hover:-translate-y-1 transition-all duration-300"
            >
              {/* Image */}
              <div className="relative h-44 bg-black overflow-hidden">
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

              {/* Info */}
              <div className="p-5">
                <h3 className="font-semibold text-lg leading-tight text-white line-clamp-2 group-hover:text-[#66c0f4] transition-colors">
                  {ride.name}
                </h3>
                <p className="text-sm text-[#8f98a0] mt-1">{ride.parkName}</p>

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

        {/* Navigation Arrows */}
        {totalPages > 1 && (
          <>
            <button
              onClick={() => goToPage(currentPage === 0 ? totalPages - 1 : currentPage - 1, 'right')}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-black/70 hover:bg-black/90 text-white rounded-full w-12 h-12 flex items-center justify-center transition-all border border-white/20 hover:border-white/40"
            >
              ←
            </button>
            <button
              onClick={() => goToPage((currentPage + 1) % totalPages, 'left')}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-black/70 hover:bg-black/90 text-white rounded-full w-12 h-12 flex items-center justify-center transition-all border border-white/20 hover:border-white/40"
            >
              →
            </button>
          </>
        )}
      </div>
    </section>
  )
}