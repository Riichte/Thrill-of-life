'use client'

import { useRef } from 'react'
import Link from 'next/link'
import { ChevronLeft, ChevronRight } from 'lucide-react'

type RecentReview = {
  id: string
  username: string
  userId: string
  itemId: string
  itemName: string
  parkId: string
  parkName: string
  score: number | null
  createdAt: string
}

function scoreColor(score: number) {
  if (score >= 75) return 'text-emerald-400'
  if (score >= 50) return 'text-yellow-400'
  if (score >= 25) return 'text-orange-400'
  return 'text-red-400'
}

function scoreBorder(score: number) {
  if (score >= 75) return 'border-emerald-500/40'
  if (score >= 50) return 'border-yellow-500/40'
  if (score >= 25) return 'border-orange-500/40'
  return 'border-red-500/40'
}

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime()
  const days = Math.floor(diff / 86400000)
  if (days === 0) return 'Today'
  if (days === 1) return 'Yesterday'
  if (days < 7) return `${days}d ago`
  if (days < 30) return `${Math.floor(days / 7)}w ago`
  return `${Math.floor(days / 30)}mo ago`
}

export function RecentReviewsCarousel({ reviews }: { reviews: RecentReview[] }) {
  const stripRef = useRef<HTMLDivElement>(null)

  const scroll = (dir: -1 | 1) => {
    stripRef.current?.scrollBy({ left: dir * 300, behavior: 'smooth' })
  }

  if (!reviews.length) return null

  return (
    <section className="mb-14">
      <div className="mb-4 flex items-end gap-4">
        <div>
          <h2 className="text-xl font-bold text-white">Recently Reviewed</h2>
          <p className="text-sm text-gray-400">Latest community reviews</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => scroll(-1)}
            className="rounded-sm bg-[#16202d] p-1.5 text-[#66c0f4] hover:bg-[#1b2838] transition"
            aria-label="Scroll left"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={() => scroll(1)}
            className="rounded-sm bg-[#16202d] p-1.5 text-[#66c0f4] hover:bg-[#1b2838] transition"
            aria-label="Scroll right"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div
        ref={stripRef}
        className="flex gap-3 overflow-x-auto pb-2"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {reviews.map(r => (
          <Link
            key={r.id}
            href={`/parks/${r.parkId}/${r.itemId}`}
            className={`flex-shrink-0 w-56 rounded-lg border bg-[#16202d] p-4 hover:bg-[#1b2838] transition group ${r.score !== null ? scoreBorder(r.score) : 'border-white/10'
              }`}
          >
            {/* Score */}
            <div className="mb-3 flex items-center justify-between">
              {r.score !== null ? (
                <span className={`text-2xl font-bold ${scoreColor(r.score)}`}>
                  {r.score}
                  <span className="text-sm font-normal text-gray-500">/100</span>
                </span>
              ) : (
                <span className="text-sm text-gray-500">No score</span>
              )}
              <span className="text-xs text-gray-500">{timeAgo(r.createdAt)}</span>
            </div>

            {/* Item name */}
            <p className="text-sm font-semibold text-white leading-tight group-hover:text-[#66c0f4] transition line-clamp-2">
              {r.itemName}
            </p>

            {/* Park name */}
            <p className="mt-1 text-xs text-gray-400 line-clamp-1">{r.parkName}</p>

            {/* Reviewer */}
            <div className="mt-3 border-t border-white/10 pt-2" suppressHydrationWarning>
              <span
                onClick={e => { e.preventDefault(); e.stopPropagation(); window.location.href = `/users/${r.userId}` }}
                className="text-xs text-[#66c0f4] hover:underline cursor-pointer"
              >
                {r.username}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}