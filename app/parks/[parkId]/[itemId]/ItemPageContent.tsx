'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { SteamMediaCarousel } from '@/components/SteamMediaCarousel'
import { SteamInfoPanel } from '@/components/SteamInfoPanel'
import { SimilarRidesCarousel } from '@/components/SimilarRidesCarousel'
import { createClient } from '@/lib/supabase/client'
import PhotoCredits, { PhotoCredit } from '@/components/PhotoCredits'
import { useUnit } from '@/lib/unitContext'

const ratingDimensions: Record<string, { id: string; label: string }[]> = {
  rides: [
    { id: 'intensity', label: 'Intensity' },
    { id: 'comfort', label: 'Comfort' },
    { id: 'theming', label: 'Theming' },
    { id: 'fun_factor', label: 'Fun Factor' },
    { id: 'capacity', label: 'Capacity' },
  ],
  roller_coasters: [
    { id: 'intensity', label: 'Intensity' },
    { id: 'comfort', label: 'Comfort' },
    { id: 'theming', label: 'Theming' },
    { id: 'fun_factor', label: 'Fun Factor' },
    { id: 'capacity', label: 'Capacity' },
  ],
  flat_rides: [
    { id: 'intensity', label: 'Intensity' },
    { id: 'comfort', label: 'Comfort' },
    { id: 'theming', label: 'Theming' },
    { id: 'fun_factor', label: 'Fun Factor' },
    { id: 'capacity', label: 'Capacity' },
  ],
  water_rides: [
    { id: 'intensity', label: 'Intensity' },
    { id: 'comfort', label: 'Comfort' },
    { id: 'theming', label: 'Theming' },
    { id: 'fun_factor', label: 'Fun Factor' },
    { id: 'capacity', label: 'Capacity' },
  ],
  dark_rides: [
    { id: 'theming', label: 'Theming' },
    { id: 'fun_factor', label: 'Fun Factor' },
    { id: 'capacity', label: 'Capacity' },
    { id: 'technology', label: 'Technology / Effects' },
    { id: 'story', label: 'Story / Immersion' },
  ],
  shows: [
    { id: 'theming', label: 'Theming' },
    { id: 'fun_factor', label: 'Fun Factor' },
    { id: 'capacity', label: 'Capacity' },
    { id: 'story', label: 'Story / Immersion' },
    { id: 'technology', label: 'Technology / Effects' },
  ],
  restaurants: [
    { id: 'food_quality', label: 'Food Quality' },
    { id: 'value', label: 'Value' },
    { id: 'wait_time', label: 'Speed / Wait Time' },
    { id: 'atmosphere', label: 'Atmosphere' },
    { id: 'service', label: 'Service' },
  ],
  hotels: [
    { id: 'comfort', label: 'Comfort' },
    { id: 'value', label: 'Value' },
    { id: 'atmosphere', label: 'Atmosphere' },
    { id: 'service', label: 'Service' },
    { id: 'cleanliness', label: 'Cleanliness' },
  ],
  shops: [
    { id: 'value', label: 'Value' },
    { id: 'atmosphere', label: 'Atmosphere' },
    { id: 'service', label: 'Service' },
    { id: 'product_quality', label: 'Product Quality' },
  ],
  parks: [
    { id: 'theming', label: 'Theming' },
    { id: 'value', label: 'Value' },
    { id: 'cleanliness', label: 'Cleanliness' },
    { id: 'operation', label: 'Staff operation' },
    { id: 'line_up', label: 'Ride Line Up' },
  ],
}



type Reaction = 'yes' | 'no' | 'funny' | 'award'
type ReviewReactions = { yes: number; no: number; funny: number; award: number }
type UserReactions = { yes: boolean; no: boolean; funny: boolean; award: boolean }

const initialReactions: ReviewReactions = { yes: 0, no: 0, funny: 0, award: 0 }
const initialUserReactions: UserReactions = { yes: false, no: false, funny: false, award: false }


function ReviewCard({
  reviewId, author, score, title, text, isOwn,
  reactions, userReactions, userPoints, onReact, onEdit, authorId,
}: {
  reviewId: string
  author: string
  score: number
  title?: string
  text?: string
  isOwn: boolean
  reactions: ReviewReactions
  userReactions: UserReactions
  userPoints: number
  onReact: (reviewId: string, reaction: Reaction) => void
  onEdit?: () => void
  authorId?: string
}) {
  const scoreColor = (s: number) =>
    s >= 80 ? 'var(--score-high)' : s >= 60 ? 'var(--score-mid)' : s >= 40 ? '#f97316' : 'var(--score-low)'

  const reactionButtons: { key: Reaction; label: string }[] = [
    { key: 'yes', label: '👍 Yes' },
    { key: 'no', label: '👎 No' },
    { key: 'funny', label: '😄 Funny' },
    { key: 'award', label: '🏆 Award' },
  ]

  return (
    <div className="flex gap-6 items-start p-6 rounded-sm"
      style={{ background: 'var(--card-bg)', border: '1px solid var(--border)' }}>
      <div className="flex-shrink-0">
        <svg className="w-20 h-20" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="45" fill="none" stroke="var(--border)" strokeWidth="2" />
          <circle cx="50" cy="50" r="45" fill="none" stroke={scoreColor(score)} strokeWidth="2"
            strokeDasharray={`${(score / 100) * 282.7}`} strokeDashoffset="0" strokeLinecap="round"
            style={{ transform: 'rotate(-90deg)', transformOrigin: '50% 50%' }} />
          <text x="50" y="50" textAnchor="middle" dy="0.3em" fill="var(--text-primary)" fontWeight="bold" fontSize="28">
            {score}
          </text>
        </svg>
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            {authorId && !isOwn ? (
              <a href={`/users/${authorId}`} className="font-bold text-lg hover:underline"
                style={{ color: 'var(--score-mid)' }}>{author}</a>
            ) : (
              <span className="font-bold text-lg"
                style={{ color: isOwn ? 'var(--accent)' : 'var(--text-secondary)' }}>{author}</span>
            )}
            {isOwn && (
              <span className="text-xs px-2 py-0.5 rounded-sm"
                style={{ color: 'var(--text-muted)', background: 'var(--bg-elevated)' }}>
                Your review
              </span>
            )}
          </div>
          {isOwn && onEdit && (
            <button onClick={onEdit}
              className="text-xs px-2 py-1 rounded-sm transition-colors"
              style={{ color: 'var(--text-muted)', border: '1px solid var(--border)' }}
              onMouseEnter={e => { e.currentTarget.style.color = 'var(--accent)'; e.currentTarget.style.borderColor = 'var(--accent)' }}
              onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.borderColor = 'var(--border)' }}>
              Edit
            </button>
          )}
        </div>
        <div className="pt-3 mb-3" style={{ borderTop: '1px solid var(--border)' }}>
          {title && <p className="text-lg font-bold mb-1" style={{ color: 'var(--text-primary)' }}>{title}</p>}
          {text && <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{text}</p>}
        </div>
        {!isOwn && (
          <div className="pt-3 mt-2" style={{ borderTop: '1px solid var(--border)' }}>
            <p className="text-xs mb-2" style={{ color: 'var(--text-muted)' }}>Helpful?</p>
            <div className="flex flex-wrap gap-2">
              {reactionButtons.map(({ key, label }) => {
                const isActive = userReactions[key]
                const cantAfford = key === 'award' && !isActive && (userPoints < 100 || userReactions.no)
                return (
                  <button key={key}
                    onClick={() => !cantAfford && onReact(reviewId, key)}
                    title={cantAfford ? 'You need 100 points to give an award' : undefined}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-sm text-xs font-medium transition-colors"
                    style={{
                      border: `1px solid ${isActive ? 'var(--accent)' : 'var(--border)'}`,
                      color: isActive ? 'var(--accent)' : cantAfford ? 'var(--text-faint)' : 'var(--text-muted)',
                      background: isActive ? 'var(--accent-bg)' : 'transparent',
                      cursor: cantAfford ? 'not-allowed' : 'pointer',
                      opacity: cantAfford ? 0.5 : 1,
                    }}>
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



export default function ItemPageContent({ park, item, category, images, videos, similarRides, credits = [], reviews = [], communityScore }: {
  park: any
  item: any
  category: any
  images: any[]
  videos: string[]
  similarRides: any[]
  credits: PhotoCredit[]
  reviews: any[]
  communityScore: { score: number; positive: number; mixed: number; negative: number } | null
}) {
  const supabase = createClient()
  const { unit, convert, convertHeight, convertSpeed, convertMinHeight } = useUnit()
  const [reviewFilter, setReviewFilter] = useState('all')
  const [isRatingOpen, setIsRatingOpen] = useState(false)
  const [hasRated, setHasRated] = useState(false)
  const [myScore, setMyScore] = useState<number | null>(null)
  const [reviewTitle, setReviewTitle] = useState('')
  const [reviewText, setReviewText] = useState('')
  const [userReview, setUserReview] = useState<{ title: string; text: string } | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [user, setUser] = useState<any>(null)
  const [userPoints, setUserPoints] = useState(0)
  const [osts, setOsts] = useState<{ id: string; title: string }[]>([])
  const [reactions, setReactions] = useState<Record<string, ReviewReactions>>({})
  const [myReactions, setMyReactions] = useState<Record<string, UserReactions>>({})
  const dimensions = ratingDimensions[item.category_id] || ratingDimensions.rides
  const [userRatings, setUserRatings] = useState<Record<string, number>>(
    dimensions.reduce((acc, dim) => ({ ...acc, [dim.id]: 50 }), {})
  )
  const [isFavorited, setIsFavorited] = useState(false)
  const [userReviewId, setUserReviewId] = useState<string | null>(null)

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)

      useEffect(() => {
        const loadOsts = async () => {
          const { data } = await supabase.from('osts').select('id, title').eq('item_id', item.id)
          setOsts(data ?? [])
        }
        loadOsts()
      }, [item.id])

      // Load reactions for all reviews (works for logged out too)
      const reviewIds = reviews.map(r => r.id)
      if (reviewIds.length > 0) {
        const { data: existingReactions } = await supabase
          .from('reactions')
          .select('review_id, type, user_id')
          .in('review_id', reviewIds)

        if (existingReactions) {
          const reactionCounts: Record<string, ReviewReactions> = {}
          const userReactionMap: Record<string, UserReactions> = {}

          existingReactions.forEach(r => {
            if (!reactionCounts[r.review_id]) reactionCounts[r.review_id] = { ...initialReactions }
            if (!userReactionMap[r.review_id]) userReactionMap[r.review_id] = { ...initialUserReactions }
            reactionCounts[r.review_id][r.type as Reaction]++
            if (user && r.user_id === user.id) userReactionMap[r.review_id][r.type as Reaction] = true
          })

          setReactions(reactionCounts)
          setMyReactions(userReactionMap)
        }
      }

      if (!user) return

      // Check for existing review
      const { data: existingReview } = await supabase
        .from('reviews')
        .select('*, review_ratings(*)')
        .eq('item_id', item.id)
        .eq('user_id', user.id)
        .single()

      if (existingReview) {
        setUserReviewId(existingReview.id)
        setHasRated(true)
        setUserReview({
          title: existingReview.title || '',
          text: existingReview.body || ''
        })
        const restored: Record<string, number> = {
          ...dimensions.reduce((acc: Record<string, number>, dim) => ({ ...acc, [dim.id]: 50 }), {})
        }
        existingReview.review_ratings?.forEach((r: any) => {
          restored[r.category] = r.score
        })
        setUserRatings(restored)
        const avg = Math.round(
          existingReview.review_ratings.reduce((sum: number, r: any) => sum + r.score, 0) /
          existingReview.review_ratings.length
        )
        setMyScore(avg)
        setReviewTitle(existingReview.title || '')
        setReviewText(existingReview.body || '')
      }

      // Check for existing favorite
      const { data: existingFav } = await supabase
        .from('favorites')
        .select('id')
        .eq('item_id', item.id)
        .eq('user_id', user.id)
        .single()
      setIsFavorited(!!existingFav)


      // Load points
      const { data: pointsRow } = await supabase
        .from('user_points')
        .select('points')
        .eq('user_id', user.id)
        .single()
      if (pointsRow) setUserPoints(pointsRow.points)
    }
    load()
  }, [item.id])

  const handleReact = async (reviewId: string, reaction: Reaction) => {
    if (!user) {
      window.location.href = `/auth/login?redirect=${encodeURIComponent(window.location.pathname)}`
      return
    }
    const current = myReactions[reviewId]?.[reaction] ?? false
    if (reaction === 'award' && !current && userPoints < 100) return

    // Enforce mutual exclusivity rules
    const opposite = reaction === 'yes' ? 'no' : reaction === 'no' ? 'yes' : null
    const hasNo = myReactions[reviewId]?.no ?? false

    // Block award if user has 'no' reaction active
    if (reaction === 'award' && !current && hasNo) return

    // If selecting yes/no, remove the opposite if active
    if (opposite && !current) {
      const oppositeActive = myReactions[reviewId]?.[opposite] ?? false
      if (oppositeActive) {
        setReactions(prev => ({
          ...prev,
          [reviewId]: { ...prev[reviewId], [opposite]: Math.max(0, (prev[reviewId]?.[opposite] ?? 1) - 1) }
        }))
        setMyReactions(prev => ({
          ...prev,
          [reviewId]: { ...prev[reviewId], [opposite]: false }
        }))
        await supabase.from('reactions')
          .delete()
          .eq('review_id', reviewId)
          .eq('user_id', user.id)
          .eq('type', opposite)
      }
    }

    // Update UI immediately
    setReactions(prev => ({
      ...prev,
      [reviewId]: { ...prev[reviewId], [reaction]: (prev[reviewId]?.[reaction] ?? 0) + (current ? -1 : 1) }
    }))
    setMyReactions(prev => ({
      ...prev,
      [reviewId]: { ...prev[reviewId], [reaction]: !current }
    }))
    if (reaction === 'award') {
      const newPoints = current ? userPoints + 100 : userPoints - 100
      setUserPoints(newPoints)
      await supabase.from('user_points').upsert(
        { user_id: user.id, points: newPoints },
        { onConflict: 'user_id' }
      )
    }

    // Save to Supabase
    if (current) {
      await supabase.from('reactions')
        .delete()
        .eq('review_id', reviewId)
        .eq('user_id', user.id)
        .eq('type', reaction)
    } else {
      await supabase.from('reactions')
        .insert({ review_id: reviewId, user_id: user.id, type: reaction })
    }
  }

  const handleFavoriteToggle = async () => {
    if (!user) {
      window.location.href = `/auth/login?redirect=${encodeURIComponent(window.location.pathname)}`
      return
    }
    if (isFavorited) {
      await supabase.from('favorites').delete()
        .eq('item_id', item.id).eq('user_id', user.id)
      setIsFavorited(false)
    } else {
      await supabase.from('favorites').insert({ item_id: item.id, user_id: user.id })
      setIsFavorited(true)
    }
  }

  const calculateMyScore = () =>
    Math.round(dimensions.reduce((sum, dim) => sum + (userRatings[dim.id] || 0), 0) / dimensions.length)

  const handleSubmitRating = async () => {
    if (!user) return
    setSubmitting(true)
    setSubmitError('')
    const score = calculateMyScore()

    try {
      const { data: review, error: reviewError } = await supabase
        .from('reviews')
        .upsert({
          item_id: item.id,
          user_id: user.id,
          title: reviewTitle.trim() || null,
          body: reviewText.trim() || null,
        }, { onConflict: 'item_id,user_id' })
        .select()
        .single()

      if (reviewError) throw reviewError

      await supabase.from('review_ratings').delete().eq('review_id', review.id)

      const ratingsToInsert = dimensions.map(dim => ({
        review_id: review.id,
        category: dim.id,
        score: userRatings[dim.id] || 50,
      }))

      const { error: ratingsError } = await supabase
        .from('review_ratings')
        .insert(ratingsToInsert)

      if (ratingsError) throw ratingsError

      setMyScore(score)
      setHasRated(true)
      setIsRatingOpen(false)

      if (!hasRated) {
        const newPoints = userPoints + 100
        setUserPoints(newPoints)
        await supabase.from('user_points').upsert(
          { user_id: user.id, points: newPoints },
          { onConflict: 'user_id' }
        )
      }

      if (reviewTitle.trim() || reviewText.trim()) {
        setUserReview({ title: reviewTitle, text: reviewText })
      }
    } catch (err: any) {
      setSubmitError(err.message || 'Something went wrong. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const baseScore = communityScore?.score ?? 75
  const overallScore = hasRated && myScore !== null
    ? Math.round(baseScore * 0.6 + myScore * 0.4)
    : baseScore

  const ratingBreakdown = communityScore
    ? { positive: communityScore.positive, mixed: communityScore.mixed, negative: communityScore.negative }
    : { positive: 0, mixed: 0, negative: 0 }

  const mediaSlides = images
    ?.filter(img => img.sort_order !== -1)
    .map((img, i) => ({
      src: img.url,
      alt: item.name,
      isVideo: Boolean(videos[i])
    })) || []

  console.log('Images data:', images)

  const specs = item.specs || {}
  const hasSpecs = Object.keys(specs).length > 0
  const currentType = item.specs?.type


  console.log('current unit:', unit)

  return (
    <div className="min-h-screen style={{ background: 'var(--bg-tertiary)' }} style={{ color: 'var(--text-primary)' }}">
      <div className="container mx-auto px-4 py-8">
        <nav className="mb-6">
          <Link href="/parks" className="text-blue-400 hover:text-blue-300 text-sm">Parks</Link>
          <span className="mx-2 text-gray-500">/</span>
          <Link href={`/parks/${park.id}`} className="text-blue-400 hover:text-blue-300 text-sm">{park.name}</Link>
          <span className="mx-2 text-gray-500">/</span>
          <Link href={`/parks/${park.id}/category/${category.id}`} className="text-blue-400 hover:text-blue-300 text-sm">{category.name}</Link>
          <span className="mx-2 text-gray-500">/</span>
          <span className="text-gray-300 text-sm">{item.name}</span>
        </nav>

        <div className="mb-8">
          <h1 className="text-5xl font-bold mb-2">{item.name}</h1>
          {item.status && item.status !== 'operating' && (
            <span className={`inline-block text-xs font-semibold px-3 py-1 rounded-sm uppercase tracking-wider ${item.status === 'defunct' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
              item.status === 'sbno' ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30' :
                item.status === 'seasonal' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' :
                  item.status === 'under_construction' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' :
                    item.status === 'coming_soon' ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30' :
                      'bg-gray-500/20 text-gray-400 border border-gray-500/30'
              }`}>
              {item.status === 'sbno' ? 'SBNO' : item.status.replace(/_/g, ' ')}
            </span>
          )}
        </div>

        <div className="mb-12 grid grid-cols-1 gap-6 lg:grid-cols-3 lg:gap-8">
          <div className="lg:col-span-2">
            <SteamMediaCarousel
              key={item.id}
              slides={mediaSlides}
              autoAdvanceMs={mediaSlides.length > 1 ? 8000 : undefined}
            />

            {/* YouTube Videos */}
            {videos && videos.length > 0 && videos.map((videoId, idx) => {
              const videoUrl = `https://www.youtube.com/embed/${videoId}`
              return (
                <div key={idx} className="mt-6 style={{ background: 'var(--card-bg)' }} border style={{ borderColor: 'var(--border)' }} rounded-sm overflow-hidden">
                  <div className="aspect-video">
                    <iframe
                      width="100%"
                      height="100%"
                      src={videoUrl}
                      title={`${item.name} Video ${idx + 1}`}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                  <div className="p-4 text-sm style={{ color: 'var(--text-secondary)' }}">
                    <p className="font-medium style={{ color: 'var(--text-primary)' }} mb-1">{item.name} Experience</p>
                    <p>Official ride footage</p>
                  </div>
                </div>
              )
            })}
          </div>
          <div className="lg:col-span-1">
            <SteamInfoPanel
              headerImage={images?.find(img => img.sort_order === -1)?.url || null}
              headerImageAlt={item.name}
              score={overallScore}
              scoreLabel="Overall score"
              myScore={myScore}
              hasRated={hasRated}
              onRateClick={() => {
                if (!user) {
                  window.location.href = `/auth/login?redirect=${encodeURIComponent(window.location.pathname)}`
                  return
                }
                setIsRatingOpen(true)
              }}
              ratingBreakdown={ratingBreakdown}
              tags={[specs.type, specs.manufacturer, category.name].filter(Boolean) as string[]}
              showFavorite={true}
              isFavorited={isFavorited}
              onFavoriteToggle={handleFavoriteToggle}
            >
              {hasSpecs && (
                <div className="border-t style={{ borderColor: 'var(--border)' }} pt-4">
                  <div className="space-y-2 text-sm">
                    {specs.type && <div className="flex justify-between gap-4 style={{ color: 'var(--text-secondary)' }}"><span>Roller Coaster Type</span><span className="style={{ color: 'var(--text-primary)' }}">{specs.type}</span></div>}
                    {specs.status && <div className="flex justify-between gap-4 style={{ color: 'var(--text-secondary)' }}"><span>Status</span><span className="style={{ color: 'var(--text-primary)' }}">{specs.status}</span></div>}
                    {specs.manufacturer && <div className="flex justify-between gap-4 style={{ color: 'var(--text-secondary)' }}"><span>Manufacturer</span><span className="style={{ color: 'var(--text-primary)' }}">{specs.manufacturer}</span></div>}
                    {specs.height && <div className="flex justify-between gap-4 style={{ color: 'var(--text-secondary)' }}"><span>Height</span><span className="style={{ color: 'var(--text-primary)' }}">{convertHeight(String(specs.height))}</span></div>}
                    {specs.drop && <div className="flex justify-between gap-4 style={{ color: 'var(--text-secondary)' }}"><span>Drop</span><span className="style={{ color: 'var(--text-primary)' }}">{convertHeight(String(specs.drop))}</span></div>}
                    {specs.speed && <div className="flex justify-between gap-4 style={{ color: 'var(--text-secondary)' }}"><span>Speed</span><span className="style={{ color: 'var(--text-primary)' }}">{convertSpeed(String(specs.speed))}</span></div>}
                    {specs.length && <div className="flex justify-between gap-4 style={{ color: 'var(--text-secondary)' }}"><span>Length</span><span className="style={{ color: 'var(--text-primary)' }}">{convertHeight(String(specs.length))}</span></div>}
                    {specs.inversions !== undefined && <div className="flex justify-between gap-4 style={{ color: 'var(--text-secondary)' }}"><span>Inversions</span><span className="style={{ color: 'var(--text-primary)' }}">{specs.inversions}</span></div>}
                    {specs.gForce && <div className="flex justify-between gap-4 style={{ color: 'var(--text-secondary)' }}"><span>G-Forces</span><span className="style={{ color: 'var(--text-primary)' }}">{specs.gForce}</span></div>}
                    {specs.duration && <div className="flex justify-between gap-4 style={{ color: 'var(--text-secondary)' }}"><span>Duration</span><span className="style={{ color: 'var(--text-primary)' }}">{specs.duration}</span></div>}
                    {specs.min_height && <div className="flex justify-between gap-4 style={{ color: 'var(--text-secondary)' }}"><span>Min Height</span><span className="style={{ color: 'var(--text-primary)' }}">📏 {convertMinHeight(String(specs.min_height))}</span></div>}
                    {item.former_name && <div className="flex justify-between gap-4 style={{ color: 'var(--text-secondary)' }}"><span>Former Name</span><span className="style={{ color: 'var(--text-primary)' }}">{item.former_name}</span></div>}
                  </div>
                </div>
              )}
            </SteamInfoPanel>
          </div>
        </div>

        {/* Link to OST page - only show if OSTs exist */}
        {osts && osts.length > 0 && (
          <Link href={`/parks/${park.id}/${item.id}/osts`}
            className="mt-8 inline-block px-6 py-3 rounded-sm text-white font-medium transition-colors"
            style={{ background: 'var(--cta)' }}>
            🎵 View Soundtrack ({osts.length})
          </Link>
        )}

        {/* Rating Modal */}
        {isRatingOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/70" onClick={() => setIsRatingOpen(false)} />
            <div className="relative z-10 w-full max-w-lg rounded-sm shadow-2xl"
              style={{ background: 'var(--card-bg)', border: '1px solid var(--border)' }}>

              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4"
                style={{ borderBottom: '1px solid var(--border)' }}>
                <h2 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>Rate {item.name}</h2>
                <button onClick={() => setIsRatingOpen(false)}
                  className="text-xl leading-none" style={{ color: 'var(--text-muted)' }}>✕</button>
              </div>

              {/* Sliders */}
              <div className="px-6 py-5 space-y-6 max-h-[40vh] overflow-y-auto">
                {dimensions.map(dimension => {
                  const userScore = userRatings[dimension.id] || 0
                  return (
                    <div key={dimension.id} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <label className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                          {dimension.label}
                        </label>
                        <span className="text-lg font-bold w-10 text-right" style={{ color: 'var(--accent)' }}>
                          {userScore}
                        </span>
                      </div>
                      <input type="range" min="0" max="100" value={userScore}
                        onChange={e => setUserRatings(prev => ({ ...prev, [dimension.id]: parseInt(e.target.value) }))}
                        className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
                        style={{ background: `linear-gradient(to right, var(--accent) 0%, var(--accent) ${userScore}%, var(--border) ${userScore}%, var(--border) 100%)` }}
                      />
                    </div>
                  )
                })}
              </div>

              {/* Review text */}
              <div className="px-6 pb-5 space-y-3 pt-5" style={{ borderTop: '1px solid var(--border)' }}>
                <p className="text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
                  Leave a review (optional)
                </p>
                <input type="text" placeholder="Review title" value={reviewTitle}
                  onChange={e => setReviewTitle(e.target.value)}
                  className="w-full rounded-sm px-3 py-2 text-sm focus:outline-none"
                  style={{ background: 'var(--input-bg)', border: '1px solid var(--input-border)', color: 'var(--text-primary)' }}
                />
                <textarea placeholder="Share your experience..." value={reviewText}
                  onChange={e => setReviewText(e.target.value)} rows={3}
                  className="w-full rounded-sm px-3 py-2 text-sm focus:outline-none resize-none"
                  style={{ background: 'var(--input-bg)', border: '1px solid var(--input-border)', color: 'var(--text-primary)' }}
                />
                {submitError && <p className="text-sm" style={{ color: 'var(--score-low)' }}>{submitError}</p>}
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between px-6 py-4"
                style={{ borderTop: '1px solid var(--border)' }}>
                <div className="text-sm" style={{ color: 'var(--text-muted)' }}>
                  Your score: <span className="font-bold" style={{ color: 'var(--accent)' }}>{calculateMyScore()}</span>
                </div>
                <div className="flex gap-3">
                  <button onClick={() => setIsRatingOpen(false)}
                    className="px-4 py-2 text-sm transition-colors"
                    style={{ color: 'var(--text-muted)' }}>
                    Cancel
                  </button>
                  <button onClick={handleSubmitRating} disabled={submitting}
                    className="px-5 py-2 text-sm font-medium rounded-sm transition-colors disabled:opacity-50"
                    style={{ background: 'var(--cta)', color: 'var(--cta-text)' }}
                    onMouseEnter={e => (e.currentTarget.style.background = 'var(--cta-hover)')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'var(--cta)')}>
                    {submitting ? 'Saving...' : hasRated ? 'Update rating' : 'Submit rating'}
                  </button>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* Reviews Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold mb-6">All Reviews</h2>

          <div className="flex gap-2 mb-8 overflow-x-auto pb-2 border-b border-gray-700">
            {['all', 'positive', 'mixed', 'negative', 'funny'].map((f) => (
              <button
                key={f}
                onClick={() => setReviewFilter(f)}
                className={`px-4 py-2 whitespace-nowrap font-medium capitalize transition-colors ${reviewFilter === f ? 'text-blue-400 border-b-2 border-blue-400' : 'text-gray-400 hover:text-gray-300'}`}
              >
                {f} Reviews
              </button>
            ))}
          </div>
          <div className="space-y-6">
            {userReview && myScore !== null && (
              <ReviewCard
                reviewId={userReviewId ?? 'user'}
                author="You"
                score={myScore}
                title={userReview.title}
                text={userReview.text}
                isOwn={true}
                reactions={reactions[userReviewId ?? 'user'] ?? initialReactions}
                userReactions={initialUserReactions}
                userPoints={userPoints}
                onReact={() => { }}
                onEdit={() => setIsRatingOpen(true)}
              />
            )}
            {reviews
              .filter(r => !user || r.user_id !== user.id)
              .map(review => {
                const avg = review.review_ratings?.length > 0
                  ? Math.round(review.review_ratings.reduce((s: number, r: any) => s + r.score, 0) / review.review_ratings.length)
                  : 0
                const reviewReactions = reactions[review.id] ?? initialReactions
                const reviewUserReactions = myReactions[review.id] ?? initialUserReactions
                if (!reviewReactions || !reviewUserReactions) return null
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
                    reactions={reviewReactions}
                    userReactions={reviewUserReactions}
                    userPoints={userPoints}
                    onReact={handleReact}
                  />
                )
              })
            }
          </div>
        </div>

        {similarRides.length > 0 && (
          <SimilarRidesCarousel
            title="Similar Rides"
            subtitle={`Other ${currentType} coasters you might enjoy`}
            items={similarRides}
            currentRideId={item.id}
          />
        )}

        <div className="flex justify-center mb-8">
          <Link href={`/parks/${park.id}`} className="bg-blue-600 hover:bg-blue-700 px-8 py-3 rounded-lg font-semibold transition-colors">
            Back to {park.name}
          </Link>
        </div>

        <PhotoCredits credits={credits} />
      </div>
    </div>
  )
}