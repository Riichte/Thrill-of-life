'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { SteamInfoPanel } from '@/components/SteamInfoPanel'
import { SimilarRidesCarousel } from '@/components/SimilarRidesCarousel'

const dimensions = [
  { id: 'innovation', label: 'Innovation' },
  { id: 'reliability', label: 'Reliability' },
  { id: 'ride_quality', label: 'Ride Quality' },
  { id: 'safety', label: 'Safety' },
  { id: 'comfort', label: 'Comfort' },
]

function getScoreColor(s: number) {
  return s >= 80 ? '#10b981' : s >= 60 ? '#f59e0b' : s >= 40 ? '#f97316' : '#ef4444'
}

export default function ManufacturerPageClient({ manufacturerName, manufacturerSlug, top20, allRides, reviews, communityScore }: {
  manufacturerName: string
  manufacturerSlug: string
  top20: any[]
  allRides: any[]
  reviews: any[]
  communityScore: number | null
}) {
  const supabase = createClient()
  const [user, setUser] = useState<any>(null)
  const [isRatingOpen, setIsRatingOpen] = useState(false)
  const [hasRated, setHasRated] = useState(false)
  const [myScore, setMyScore] = useState<number | null>(null)
  const [userRatings, setUserRatings] = useState<Record<string, number>>(
    dimensions.reduce((acc, d) => ({ ...acc, [d.id]: 50 }), {})
  )
  const [reviewTitle, setReviewTitle] = useState('')
  const [reviewText, setReviewText] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      if (!user) return

      const { data: existing } = await supabase
        .from('reviews')
        .select('*, review_ratings(*)')
        .eq('item_id', manufacturerSlug)
        .eq('user_id', user.id)
        .single()

      if (existing) {
        setHasRated(true)
        setReviewTitle(existing.title || '')
        setReviewText(existing.body || '')
        const restored: Record<string, number> = dimensions.reduce((acc, d) => ({ ...acc, [d.id]: 50 }), {})
        existing.review_ratings?.forEach((r: any) => { restored[r.category] = r.score })
        setUserRatings(restored)
        const avg = Math.round(existing.review_ratings.reduce((s: number, r: any) => s + r.score, 0) / existing.review_ratings.length)
        setMyScore(avg)
      }
    }
    load()
  }, [manufacturerSlug])

  const calculateMyScore = () =>
    Math.round(dimensions.reduce((sum, d) => sum + (userRatings[d.id] || 0), 0) / dimensions.length)

  const handleSubmit = async () => {
    if (!user) return
    setSubmitting(true)
    setSubmitError('')
    try {
      const { data: review, error } = await supabase
        .from('reviews')
        .upsert({ item_id: manufacturerSlug, user_id: user.id, title: reviewTitle.trim() || null, body: reviewText.trim() || null }, { onConflict: 'item_id,user_id' })
        .select().single()
      if (error) throw error

      await supabase.from('review_ratings').delete().eq('review_id', review.id)
      await supabase.from('review_ratings').insert(
        dimensions.map(d => ({ review_id: review.id, category: d.id, score: userRatings[d.id] || 50 }))
      )

      setMyScore(calculateMyScore())
      setHasRated(true)
      setIsRatingOpen(false)
    } catch (err: any) {
      setSubmitError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  const overallScore = communityScore ?? 0

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-8">
        <nav className="mb-6">
          <Link href="/manufacturers" className="text-blue-400 hover:text-blue-300 text-sm">Manufacturers</Link>
          <span className="mx-2 text-gray-500">/</span>
          <span className="text-gray-300 text-sm">{manufacturerName}</span>
        </nav>

        <div className="mb-8">
          <h1 className="text-5xl font-bold mb-2">{manufacturerName}</h1>
          <p className="text-gray-400">{allRides.length} rides in database</p>
        </div>

        <div className="mb-12 grid grid-cols-1 gap-6 lg:grid-cols-3 lg:gap-8">
          <div className="lg:col-span-2">
            {/* Top stats */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
              <div className="bg-[#1b2838] border border-[#2a475e] rounded-sm p-4 text-center">
                <p className="text-2xl font-bold text-[#66c0f4]">{allRides.length}</p>
                <p className="text-xs text-[#8f98a0] mt-0.5 uppercase tracking-wider">Total Rides</p>
              </div>
              <div className="bg-[#1b2838] border border-[#2a475e] rounded-sm p-4 text-center">
                <p className="text-2xl font-bold text-emerald-400">{allRides.filter(r => r.avgScore !== null).length}</p>
                <p className="text-xs text-[#8f98a0] mt-0.5 uppercase tracking-wider">Rated Rides</p>
              </div>
              <div className="bg-[#1b2838] border border-[#2a475e] rounded-sm p-4 text-center">
                <p className="text-2xl font-bold text-[#f59e0b]">{reviews.length}</p>
                <p className="text-xs text-[#8f98a0] mt-0.5 uppercase tracking-wider">Reviews</p>
              </div>
            </div>

            {/* Reviews */}
            <h2 className="text-2xl font-semibold mb-4">Reviews</h2>
            <div className="space-y-4">
              {reviews.filter(r => !user || r.user_id !== user?.id).map(review => {
                const avg = review.review_ratings?.length > 0
                  ? Math.round(review.review_ratings.reduce((s: number, r: any) => s + r.score, 0) / review.review_ratings.length)
                  : 0
                return (
                  <div key={review.id} className="bg-[#1b2838] border border-[#2a475e] rounded-sm p-4 flex gap-4">
                    <svg className="w-16 h-16 flex-shrink-0" viewBox="0 0 100 100">
                      <circle cx="50" cy="50" r="45" fill="none" stroke="#2a475e" strokeWidth="4" />
                      <circle cx="50" cy="50" r="45" fill="none" stroke={getScoreColor(avg)} strokeWidth="4"
                        strokeDasharray={`${(avg / 100) * 282.7}`} strokeDashoffset="0" strokeLinecap="round"
                        style={{ transform: 'rotate(-90deg)', transformOrigin: '50% 50%' }} />
                      <text x="50" y="50" textAnchor="middle" dy="0.3em" fill="#c6d4df" fontWeight="bold" fontSize="28">{avg}</text>
                    </svg>
                    <div>
                      <p className="font-bold text-[#f59e0b]">{review.profiles?.username ?? 'Anonymous'}</p>
                      {review.title && <p className="text-[#c6d4df] font-medium mt-1">{review.title}</p>}
                      {review.body && <p className="text-sm text-[#acb2b8] mt-1">{review.body}</p>}
                    </div>
                  </div>
                )
              })}
              {reviews.length === 0 && <p className="text-[#8f98a0] text-sm">No reviews yet. Be the first!</p>}
            </div>
          </div>

          <div className="lg:col-span-1">
            <SteamInfoPanel
              score={overallScore || undefined}
              scoreLabel="Overall score"
              myScore={myScore}
              hasRated={hasRated}
              onRateClick={() => {
                if (!user) { window.location.href = `/auth/login?redirect=/manufacturers/${manufacturerSlug}`; return }
                setIsRatingOpen(true)
              }}
              tags={[`${allRides.length} rides`]}
            />
          </div>
        </div>

        {/* Rating Modal */}
        {isRatingOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/70" onClick={() => setIsRatingOpen(false)} />
            <div className="relative z-10 w-full max-w-lg bg-[#1b2838] border border-[#2a475e] rounded-sm shadow-2xl">
              <div className="flex items-center justify-between border-b border-[#2a475e] px-6 py-4">
                <h2 className="text-lg font-semibold text-[#c6d4df]">Rate {manufacturerName}</h2>
                <button onClick={() => setIsRatingOpen(false)} className="text-[#8f98a0] hover:text-white text-xl">✕</button>
              </div>
              <div className="px-6 py-5 space-y-6 max-h-[40vh] overflow-y-auto">
                {dimensions.map(d => {
                  const val = userRatings[d.id] || 0
                  return (
                    <div key={d.id} className="space-y-2">
                      <div className="flex justify-between">
                        <label className="text-sm font-medium text-[#c6d4df]">{d.label}</label>
                        <span className="text-lg font-bold text-[#66c0f4]">{val}</span>
                      </div>
                      <input type="range" min="0" max="100" value={val}
                        onChange={e => setUserRatings(prev => ({ ...prev, [d.id]: parseInt(e.target.value) }))}
                        className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
                        style={{ background: `linear-gradient(to right, #66c0f4 0%, #66c0f4 ${val}%, #2a475e ${val}%, #2a475e 100%)` }}
                      />
                    </div>
                  )
                })}
              </div>
              <div className="px-6 pb-5 space-y-3 border-t border-[#2a475e] pt-5">
                <input type="text" placeholder="Review title" value={reviewTitle} onChange={e => setReviewTitle(e.target.value)}
                  className="w-full bg-[#2a475e] border border-[#3d6a8a] rounded-sm px-3 py-2 text-sm text-[#c6d4df] placeholder-[#6a8a9a] focus:outline-none focus:border-[#66c0f4]" />
                <textarea placeholder="Share your thoughts..." value={reviewText} onChange={e => setReviewText(e.target.value)} rows={3}
                  className="w-full bg-[#2a475e] border border-[#3d6a8a] rounded-sm px-3 py-2 text-sm text-[#c6d4df] placeholder-[#6a8a9a] focus:outline-none focus:border-[#66c0f4] resize-none" />
                {submitError && <p className="text-sm text-red-400">{submitError}</p>}
              </div>
              <div className="flex items-center justify-between border-t border-[#2a475e] px-6 py-4">
                <div className="text-sm text-[#8f98a0]">Your score: <span className="text-[#66c0f4] font-bold">{calculateMyScore()}</span></div>
                <div className="flex gap-3">
                  <button onClick={() => setIsRatingOpen(false)} className="px-4 py-2 text-sm text-[#8f98a0] hover:text-white">Cancel</button>
                  <button onClick={handleSubmit} disabled={submitting}
                    className="px-5 py-2 bg-[#4c6b22] hover:bg-[#5a7a28] disabled:opacity-50 text-white text-sm font-medium rounded-sm">
                    {submitting ? 'Saving...' : hasRated ? 'Update' : 'Submit'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Top 20 Carousel */}
        {top20.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-semibold">Top Rated Rides</h2>
              <Link href={`/manufacturers/${manufacturerSlug}/rides`} className="text-sm text-[#66c0f4] hover:text-[#8fcefa]">
                View all {allRides.length} rides →
              </Link>
            </div>
            <SimilarRidesCarousel title="" items={top20.map(r => ({ id: r.id, name: r.name, parkName: r.parkName, parkId: r.park_id, image: r.image, specs: r.specs, averageRating: r.avgScore }))} currentRideId="" />
          </div>
        )}
      </div>
    </div>
  )
}