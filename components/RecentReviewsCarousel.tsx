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
  if (score >= 75) return 'var(--score-high)'
  if (score >= 50) return 'var(--score-mid)'
  if (score >= 25) return '#f97316'
  return 'var(--score-low)'
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
  const scroll = (dir: -1 | 1) => stripRef.current?.scrollBy({ left: dir * 300, behavior: 'smooth' })

  if (!reviews.length) return null

  return (
    <section className="mb-14">
      <div className="mb-4 flex items-end gap-4">
        <div>
          <h2 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>Recently Reviewed</h2>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Latest community reviews</p>
        </div>
        <div className="flex gap-2">
          {([-1, 1] as const).map(dir => (
            <button key={dir} onClick={() => scroll(dir)}
              className="rounded-sm p-1.5 transition-colors"
              style={{ background: 'var(--card-bg)', color: 'var(--accent)' }}
              onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg-elevated)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'var(--card-bg)')}
              aria-label={dir === -1 ? 'Scroll left' : 'Scroll right'}>
              {dir === -1 ? <ChevronLeft className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
            </button>
          ))}
        </div>
      </div>

      <div ref={stripRef} className="flex gap-3 overflow-x-auto pb-2"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
        {reviews.map(r => (
          <Link key={r.id} href={`/parks/${r.parkId}/${r.itemId}`}
            className="flex-shrink-0 w-56 rounded-lg p-4 transition-colors group"
            style={{
              background: 'var(--card-bg)',
              border: `1px solid ${r.score !== null ? scoreColor(r.score) + '40' : 'var(--border)'}`,
            }}
            onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg-elevated)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'var(--card-bg)')}>

            {/* Score + time */}
            <div className="mb-3 flex items-center justify-between">
              {r.score !== null ? (
                <span className="text-2xl font-bold" style={{ color: scoreColor(r.score) }}>
                  {r.score}
                  <span className="text-sm font-normal" style={{ color: 'var(--text-muted)' }}>/100</span>
                </span>
              ) : (
                <span className="text-sm" style={{ color: 'var(--text-muted)' }}>No score</span>
              )}
              <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{timeAgo(r.createdAt)}</span>
            </div>

            {/* Item name */}
            <p className="text-sm font-semibold leading-tight line-clamp-2 transition-colors"
              style={{ color: 'var(--text-primary)' }}>
              {r.itemName}
            </p>

            {/* Park name */}
            <p className="mt-1 text-xs line-clamp-1" style={{ color: 'var(--text-muted)' }}>{r.parkName}</p>

            {/* Reviewer */}
            <div className="mt-3 pt-2" style={{ borderTop: '1px solid var(--border)' }} suppressHydrationWarning>
              <span
                onClick={e => { e.preventDefault(); e.stopPropagation(); window.location.href = `/users/${r.userId}` }}
                className="text-xs cursor-pointer hover:underline"
                style={{ color: 'var(--accent)' }}>
                {r.username}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}