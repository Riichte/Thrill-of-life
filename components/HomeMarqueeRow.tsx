'use client'

import Link from 'next/link'
import type { HomeMarqueeCard } from '@/lib/homeCarouselData'
import { useState, useEffect } from 'react'

type HomeMarqueeRowProps = {
  title: string
  subtitle?: string
  items: HomeMarqueeCard[]
  /** Full loop duration (two copies of items); higher = slower */
  durationSec?: number
  viewAllHref: string
  viewAllLabel?: string
}

export function HomeMarqueeRow({
  title,
  subtitle,
  items,
  durationSec = 110,
  viewAllHref,
  viewAllLabel = 'View all'
}: HomeMarqueeRowProps) {
  if (items.length === 0) return null

  const visibleItemsCount = 5
  const totalItems = items.length
  const totalPages = Math.ceil(totalItems / visibleItemsCount)
  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null

    if (totalPages > 1) {
      interval = setInterval(() => {
        setCurrentPage((prevPage) => (prevPage === totalPages ? 1 : prevPage + 1))
      }, 5000)
    }

    return () => {
      clearInterval(interval || undefined)
    }
  }, [currentPage, totalPages])

  const handlePrevClick = () => {
    if (currentPage > 1) {
      setCurrentPage((prevPage) => prevPage - 1)
    }
  }

  const handleNextClick = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prevPage) => prevPage + 1)
    }
  }

  const startIndex = (currentPage - 1) * visibleItemsCount
  const endIndex = Math.min(startIndex + visibleItemsCount, totalItems)

  return (
    <section className="mb-16">
      <div className="mb-5 flex flex-wrap items-end justify-between gap-3 px-1">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-white md:text-3xl">{title}</h2>
          {subtitle ? <p className="mt-1 text-sm text-gray-400">{subtitle}</p> : null}
        </div>
        <Link
          href={viewAllHref}
          className="shrink-0 text-sm font-medium text-[#66c0f4] transition hover:text-[#8fcefa]"
        >
          {viewAllLabel} →
        </Link>
      </div>

      <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#0e1621]/90 shadow-xl">
        <div className="flex w-full gap-4 px-4 py-5">
          {items.slice(startIndex, endIndex).map((item, i) => (
            <Link
              key={`${item.id}-${i}`}
              href={item.href}
              className="w-[260px] overflow-hidden rounded-xl bg-gray-800/90 ring-1 ring-white/10 transition hover:bg-gray-800 hover:ring-[#66c0f4]/40 sm:w-[260px]"
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

        <div className="flex justify-center gap-3 py-2">
          <button
            onClick={handlePrevClick}
            disabled={currentPage === 1}
            className="shrink-0 text-sm font-medium text-gray-400 hover:text-[#66c0f4]"
          >
            Previous
          </button>
          <button
            onClick={handleNextClick}
            disabled={currentPage === totalPages}
            className="shrink-0 text-sm font-medium text-gray-400 hover:text-[#66c0f4]"
          >
            Next
          </button>
        </div>
      </div>
    </section>
  )
}

