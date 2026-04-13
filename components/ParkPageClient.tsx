'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { SteamMediaCarousel } from '@/components/SteamMediaCarousel'
import { SteamInfoPanel } from '@/components/SteamInfoPanel'
import { createClient } from '@/lib/supabase/client'
import PhotoCredits, { PhotoCredit } from '@/components/PhotoCredits'

interface Park {
  id: string
  name: string
  description: string
  logo_url: string
  cover_image_url: string
  country: string
  company: string
  park_type: string
  location: string
}

interface Category {
  id: string
  name: string
  itemCount: number
  firstItemId: string | null
}

interface ParkPageClientProps {
  park: Park
  slides: string[]
  categoriesWithImages: Category[]
  categoryImages: Record<string, string>
  userId: string | null
  isFavorited: boolean
  credits: PhotoCredit[]
  reviews: any[]
  communityScore: { score: number; positive: number; mixed: number; negative: number } | null
}

const parkDimensions = [
    { id: 'theming', label: 'Theming' },
    { id: 'value', label: 'Value' },
    { id: 'cleanliness', label: 'Cleanliness' },
    { id: 'operation', label: 'Staff operation' },
    { id: 'line_up', label: 'Ride Line Up' },
]

type Reaction = 'yes' | 'no' | 'funny' | 'award'
type ReviewReactions = { yes: number; no: number; funny: number; award: number }
type UserReactions = { yes: boolean; no: boolean; funny: boolean; award: boolean }
const initialReactions: ReviewReactions = { yes: 0, no: 0, funny: 0, award: 0 }
const initialUserReactions: UserReactions = { yes: false, no: false, funny: false, award: false }

function getScoreColor(s: number) {
  return s >= 80 ? '#10b981' : s >= 60 ? '#f59e0b' : s >= 40 ? '#f97316' : '#ef4444'
}

function ReviewCard({ reviewId, author, authorId, score, title, text, isOwn, reactions, userReactions, userPoints, onReact, onEdit }: {
  reviewId: string
  author: string
  authorId?: string
  score: number
  title?: string
  text?: string
  isOwn: boolean
  reactions: ReviewReactions
  userReactions: UserReactions
  userPoints: number
  onReact: (reviewId: string, reaction: Reaction) => void
  onEdit?: () => void
}) {
  const reactionButtons: { key: Reaction; label: string; activeClass: string }[] = [
    { key: 'yes', label: '👍 Yes', activeClass: 'text-green-400 border-green-500 bg-green-500/10' },
    { key: 'no', label: '👎 No', activeClass: 'text-red-400 border-red-500 bg-red-500/10' },
    { key: 'funny', label: '😄 Funny', activeClass: 'text-yellow-400 border-yellow-500 bg-yellow-500/10' },
    { key: 'award', label: '🏆 Award', activeClass: 'text-amber-400 border-amber-500 bg-amber-500/10' },
  ]

  return (
    <div className="bg-[#1b2838] border border-[#2a475e] rounded-sm p-6 flex gap-6 items-start">
      <div className="flex-shrink-0">
        <svg className="w-20 h-20" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="45" fill="none" stroke="#2a475e" strokeWidth="2" />
          <circle cx="50" cy="50" r="45" fill="none" stroke={getScoreColor(score)} strokeWidth="2"
            strokeDasharray={`${(score / 100) * 282.7}`} strokeDashoffset="0" strokeLinecap="round"
            style={{ transform: 'rotate(-90deg)', transformOrigin: '50% 50%' }} />
          <text x="50" y="50" textAnchor="middle" dy="0.3em" fill="#c6d4df" fontWeight="bold" fontSize="28">
            {score}
          </text>
        </svg>
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            {authorId && !isOwn ? (
              <Link href={`/users/${authorId}`} className="font-bold text-lg text-[#f59e0b] hover:underline">{author}</Link>
            ) : (
              <span className={`font-bold text-lg ${isOwn ? 'text-[#66c0f4]' : 'text-[#f59e0b]'}`}>{author}</span>
            )}
            {isOwn && <span className="text-xs text-[#8f98a0] bg-[#2a475e] px-2 py-0.5 rounded-sm">Your review</span>}
          </div>
          {isOwn && onEdit && (
            <button onClick={onEdit} className="text-xs text-[#8f98a0] hover:text-[#66c0f4] border border-[#2a475e] hover:border-[#66c0f4] px-2 py-1 rounded-sm transition-colors">
              Edit
            </button>
          )}
        </div>
        <div className="border-t border-[#2a475e] pt-3 mb-3">
          {title && <p className="text-lg font-bold text-[#c6d4df] mb-1">{title}</p>}
          {text && <p className="text-sm text-[#acb2b8] leading-relaxed">{text}</p>}
        </div>
        {!isOwn && (
          <div className="border-t border-[#2a475e] pt-3 mt-2">
            <p className="text-xs text-[#8f98a0] mb-2">Helpful?</p>
            <div className="flex flex-wrap gap-2">
              {reactionButtons.map(({ key, label, activeClass }) => {
                const isActive = userReactions[key]
                const cantAfford = key === 'award' && !isActive && userPoints < 100
                return (
                  <button key={key} onClick={() => !cantAfford && onReact(reviewId, key)}
                    title={cantAfford ? 'You need 100 points to give an award' : undefined}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-sm border text-xs font-medium transition-colors
                      ${isActive ? activeClass : cantAfford
                        ? 'text-[#4a6a82] border-[#2a475e] bg-transparent cursor-not-allowed opacity-50'
                        : 'text-[#8f98a0] border-[#2a475e] bg-transparent hover:border-[#66c0f4] hover:text-[#66c0f4]'}`}
                  >
                    {label}
                    {reactions[key] > 0 && <span className="ml-1 text-[10px] opacity-75">({reactions[key]})</span>}
                    {key === 'award' && <span className="ml-1 text-[10px] opacity-60">100pts</span>}
                  </button>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default function ParkPageClient({
  park, slides, categoriesWithImages, categoryImages,
  userId, isFavorited: initialFavorited, credits = [],
  reviews = [], communityScore,
}: ParkPageClientProps) {
  const supabase = createClient()
  const [isFavorited, setIsFavorited] = useState(initialFavorited)
  const [isRatingOpen, setIsRatingOpen] = useState(false)
  const [hasRated, setHasRated] = useState(false)
  const [myScore, setMyScore] = useState<number | null>(null)
  const [reviewTitle, setReviewTitle] = useState('')
  const [reviewText, setReviewText] = useState('')
  const [userReview, setUserReview] = useState<{ title: string; text: string } | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [userPoints, setUserPoints] = useState(0)
  const [reactions, setReactions] = useState<Record<string, ReviewReactions>>({})
  const [myReactions, setMyReactions] = useState<Record<string, UserReactions>>({})
  const [userRatings, setUserRatings] = useState<Record<string, number>>(
    parkDimensions.reduce((acc, dim) => ({ ...acc, [dim.id]: 50 }), {})
  )

  useEffect(() => {
    const load = async () => {
      if (!userId) return
      const { data: existingReview } = await supabase
        .from('reviews')
        .select('*, review_ratings(*)')
        .eq('item_id', park.id)
        .eq('user_id', userId)
        .single()

      if (existingReview) {
        setHasRated(true)
        setUserReview({ title: existingReview.title || '', text: existingReview.body || '' })
        const restored: Record<string, number> = parkDimensions.reduce((acc: Record<string, number>, dim) => ({ ...acc, [dim.id]: 50 }), {})
        existingReview.review_ratings?.forEach((r: any) => { restored[r.category] = r.score })
        setUserRatings(restored)
        const avg = Math.round(existingReview.review_ratings.reduce((s: number, r: any) => s + r.score, 0) / existingReview.review_ratings.length)
        setMyScore(avg)
      }

      const { data: pointsRow } = await supabase.from('user_points').select('points').eq('user_id', userId).single()
      if (pointsRow) setUserPoints(pointsRow.points)
    }
    load()
  }, [park.id, userId])

  const handleFavoriteToggle = async () => {
    if (!userId) {
      window.location.href = `/auth/login?redirect=/parks/${park.id}`
      return
    }
    if (isFavorited) {
      await supabase.from('favorites').delete().eq('item_id', park.id).eq('user_id', userId)
      setIsFavorited(false)
    } else {
      await supabase.from('favorites').insert({ item_id: park.id, user_id: userId })
      setIsFavorited(true)
    }
  }

  const calculateMyScore = () =>
    Math.round(parkDimensions.reduce((sum, dim) => sum + (userRatings[dim.id] || 0), 0) / parkDimensions.length)

  const handleSubmitRating = async () => {
    if (!userId) return
    setSubmitting(true)
    setSubmitError('')
    const score = calculateMyScore()
    try {
      const { data: review, error: reviewError } = await supabase
        .from('reviews')
        .upsert({
          item_id: park.id,
          user_id: userId,
          title: reviewTitle.trim() || null,
          body: reviewText.trim() || null,
        }, { onConflict: 'item_id,user_id' })
        .select().single()
      if (reviewError) throw reviewError

      await supabase.from('review_ratings').delete().eq('review_id', review.id)
      const ratingsToInsert = parkDimensions.map(dim => ({
        review_id: review.id,
        category: dim.id,
        score: userRatings[dim.id] || 50,
      }))
      const { error: ratingsError } = await supabase.from('review_ratings').insert(ratingsToInsert)
      if (ratingsError) throw ratingsError

      setMyScore(score)
      setHasRated(true)
      setIsRatingOpen(false)

      if (!hasRated) {
        const newPoints = userPoints + 100
        setUserPoints(newPoints)
        await supabase.from('user_points').upsert({ user_id: userId, points: newPoints }, { onConflict: 'user_id' })
      }

      if (reviewTitle.trim() || reviewText.trim()) {
        setUserReview({ title: reviewTitle, text: reviewText })
      }
    } catch (err: any) {
      setSubmitError(err.message || 'Something went wrong.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleReact = (reviewId: string, reaction: Reaction) => {
    const current = myReactions[reviewId]?.[reaction] ?? false
    if (reaction === 'award' && !current && userPoints < 100) return
    setReactions(prev => ({
      ...prev,
      [reviewId]: { ...(prev[reviewId] ?? initialReactions), [reaction]: (prev[reviewId]?.[reaction] ?? 0) + (current ? -1 : 1) }
    }))
    setMyReactions(prev => ({
      ...prev,
      [reviewId]: { ...(prev[reviewId] ?? initialUserReactions), [reaction]: !current }
    }))
    if (reaction === 'award') setUserPoints(prev => current ? prev + 100 : prev - 100)
  }

  const baseScore = communityScore?.score ?? 0
  const overallScore = hasRated && myScore !== null
    ? Math.round(baseScore * 0.6 + myScore * 0.4)
    : baseScore

  const ratingBreakdown = communityScore
    ? { positive: communityScore.positive, mixed: communityScore.mixed, negative: communityScore.negative }
    : { positive: 0, mixed: 0, negative: 0 }

  const mediaSlides = slides.map(src => ({ src, alt: park.name }))

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-8">
        <nav className="mb-6">
          <Link href="/parks" className="text-blue-400 hover:text-blue-300 text-sm">Parks</Link>
          <span className="mx-2 text-gray-500">/</span>
          <span className="text-gray-300 text-sm">{park.name}</span>
        </nav>

        <div className="mb-8">
          <h1 className="text-5xl font-bold mb-2">{park.name}</h1>
          <p className="text-gray-400 text-lg">{park.location}</p>
        </div>

        <div className="mb-12 grid grid-cols-1 gap-6 lg:grid-cols-3 lg:gap-8">
          <div className="lg:col-span-2">
            <SteamMediaCarousel slides={mediaSlides} autoAdvanceMs={slides.length > 1 ? 5000 : undefined} />
          </div>
          <div className="lg:col-span-1">
            <SteamInfoPanel
              headerImage={park.logo_url}
              headerImageAlt={park.name}
              score={overallScore || undefined}
              scoreLabel="Overall score"
              myScore={myScore}
              hasRated={hasRated}
              onRateClick={() => {
                if (!userId) {
                  window.location.href = `/auth/login?redirect=/parks/${park.id}`
                  return
                }
                setIsRatingOpen(true)
              }}
              ratingBreakdown={communityScore ? ratingBreakdown : undefined}
              tags={[park.country, park.company, park.park_type].filter(Boolean)}
              showFavorite={true}
              isFavorited={isFavorited}
              onFavoriteToggle={handleFavoriteToggle}
            >
              <div className="border-t border-[#2a475e] pt-4">
                <p className="text-sm text-[#acb2b8] leading-relaxed">{park.description}</p>
              </div>
              <div className="border-t border-[#2a475e] pt-4 space-y-2 text-sm">
                {park.location && <div className="flex justify-between gap-4 text-[#acb2b8]"><span>Location</span><span className="text-[#c6d4df]">{park.location}</span></div>}
                {park.country && <div className="flex justify-between gap-4 text-[#acb2b8]"><span>Country</span><span className="text-[#c6d4df]">{park.country}</span></div>}
                {park.company && <div className="flex justify-between gap-4 text-[#acb2b8]"><span>Operated by</span><span className="text-[#c6d4df]">{park.company}</span></div>}
                {park.park_type && <div className="flex justify-between gap-4 text-[#acb2b8]"><span>Type</span><span className="text-[#c6d4df]">{park.park_type}</span></div>}
              </div>
            </SteamInfoPanel>
          </div>
        </div>

        {/* Rating Modal */}
        {isRatingOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/70" onClick={() => setIsRatingOpen(false)} />
            <div className="relative z-10 w-full max-w-lg bg-[#1b2838] border border-[#2a475e] rounded-sm shadow-2xl">
              <div className="flex items-center justify-between border-b border-[#2a475e] px-6 py-4">
                <h2 className="text-lg font-semibold text-[#c6d4df]">Rate {park.name}</h2>
                <button onClick={() => setIsRatingOpen(false)} className="text-[#8f98a0] hover:text-white text-xl leading-none">✕</button>
              </div>
              <div className="px-6 py-5 space-y-6 max-h-[40vh] overflow-y-auto">
                {parkDimensions.map(dimension => {
                  const userScore = userRatings[dimension.id] || 0
                  return (
                    <div key={dimension.id} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <label className="text-sm font-medium text-[#c6d4df]">{dimension.label}</label>
                        <span className="text-lg font-bold text-[#66c0f4] w-10 text-right">{userScore}</span>
                      </div>
                      <input type="range" min="0" max="100" value={userScore}
                        onChange={e => setUserRatings(prev => ({ ...prev, [dimension.id]: parseInt(e.target.value) }))}
                        className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
                        style={{ background: `linear-gradient(to right, #66c0f4 0%, #66c0f4 ${userScore}%, #2a475e ${userScore}%, #2a475e 100%)` }}
                      />
                    </div>
                  )
                })}
              </div>
              <div className="px-6 pb-5 space-y-3 border-t border-[#2a475e] pt-5">
                <p className="text-xs font-medium uppercase tracking-wider text-[#8f98a0]">Leave a review (optional)</p>
                <input type="text" placeholder="Review title" value={reviewTitle}
                  onChange={e => setReviewTitle(e.target.value)}
                  className="w-full bg-[#2a475e] border border-[#3d6a8a] rounded-sm px-3 py-2 text-sm text-[#c6d4df] placeholder-[#6a8a9a] focus:outline-none focus:border-[#66c0f4]"
                />
                <textarea placeholder="Share your experience..." value={reviewText}
                  onChange={e => setReviewText(e.target.value)} rows={3}
                  className="w-full bg-[#2a475e] border border-[#3d6a8a] rounded-sm px-3 py-2 text-sm text-[#c6d4df] placeholder-[#6a8a9a] focus:outline-none focus:border-[#66c0f4] resize-none"
                />
                {submitError && <p className="text-sm text-red-400">{submitError}</p>}
              </div>
              <div className="flex items-center justify-between border-t border-[#2a475e] px-6 py-4">
                <div className="text-sm text-[#8f98a0]">
                  Your score: <span className="text-[#66c0f4] font-bold">{calculateMyScore()}</span>
                </div>
                <div className="flex gap-3">
                  <button onClick={() => setIsRatingOpen(false)} className="px-4 py-2 text-sm text-[#8f98a0] hover:text-white transition-colors">Cancel</button>
                  <button onClick={handleSubmitRating} disabled={submitting}
                    className="px-5 py-2 bg-[#4c6b22] hover:bg-[#5a7a28] disabled:opacity-50 text-white text-sm font-medium rounded-sm transition-colors">
                    {submitting ? 'Saving...' : hasRated ? 'Update rating' : 'Submit rating'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Categories Grid */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold mb-8">Explore by Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {categoriesWithImages.map(category => {
              const image = categoryImages[category.id]
              return (
                <Link key={category.id} href={`/parks/${park.id}/category/${category.id}`}
                  className="group relative h-48 rounded-sm overflow-hidden border border-[#2a475e] hover:border-[#66c0f4] transition-colors">
                  {image ? (
                    <img src={image} alt={category.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  ) : (
                    <div className="w-full h-full bg-[#1b2838]" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                  <div className="absolute inset-0 flex items-end p-3">
                    <div>
                      <h3 className="text-sm font-bold text-white">{category.name}</h3>
                      <p className="text-xs text-[#8f98a0]">{category.itemCount} items</p>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold mb-6">All Reviews</h2>
          <div className="flex gap-2 mb-8 overflow-x-auto pb-2 border-b border-gray-700">
            {['all', 'positive', 'mixed', 'negative'].map(f => (
              <button key={f} className="px-4 py-2 whitespace-nowrap font-medium capitalize text-gray-400 hover:text-gray-300 transition-colors">
                {f} Reviews
              </button>
            ))}
          </div>
          <div className="space-y-6">
            {userReview && myScore !== null && (
              <ReviewCard
                reviewId="user"
                author="You"
                score={myScore}
                title={userReview.title}
                text={userReview.text}
                isOwn={true}
                reactions={initialReactions}
                userReactions={initialUserReactions}
                userPoints={userPoints}
                onReact={() => {}}
                onEdit={() => setIsRatingOpen(true)}
              />
            )}
            {reviews
              .filter(r => !userId || r.user_id !== userId)
              .map(review => {
                const avg = review.review_ratings?.length > 0
                  ? Math.round(review.review_ratings.reduce((s: number, r: any) => s + r.score, 0) / review.review_ratings.length)
                  : 0
                return (
                  <ReviewCard
                    key={review.id}
                    reviewId={review.id}
                    author={review.profiles?.username ?? 'Anonymous'}
                    authorId={review.user_id}
                    score={avg}
                    title={review.title}
                    text={review.body}
                    isOwn={false}
                    reactions={reactions[review.id] ?? initialReactions}
                    userReactions={myReactions[review.id] ?? initialUserReactions}
                    userPoints={userPoints}
                    onReact={handleReact}
                  />
                )
              })}
            {reviews.length === 0 && (
              <p className="text-[#8f98a0] text-sm">No reviews yet. Be the first to rate this park!</p>
            )}
          </div>
        </div>

        <div className="flex justify-center mb-8">
          <Link href="/parks" className="bg-blue-600 hover:bg-blue-700 px-8 py-3 rounded-lg font-semibold transition-colors">
            Back to All Parks
          </Link>
        </div>

        <PhotoCredits credits={credits} />
      </div>
    </div>
  )
}