'use client'

import Link from 'next/link'
import { notFound } from 'next/navigation'
import { useState } from 'react'
import { SteamMediaCarousel } from '@/components/SteamMediaCarousel'
import { SteamInfoPanel } from '@/components/SteamInfoPanel'
import { mockParks, mockCategories, mockItems, mockItemImages, mockItemVideos } from '@/lib/items-data'

interface ItemPageProps {
  params: Promise<{
    parkId: string
    itemId: string
  }>
}

const ratingDimensions: Record<string, { id: string; label: string; communityAverage: number }[]> = {
  rides: [
    { id: 'thrill', label: 'Thrill Level', communityAverage: 82 },
    { id: 'queue', label: 'Queue Experience', communityAverage: 65 },
    { id: 'comfort', label: 'Ride Comfort', communityAverage: 71 },
    { id: 'overall', label: 'Overall Experience', communityAverage: 78 }
  ],
  restaurants: [
    { id: 'food', label: 'Food Quality', communityAverage: 79 },
    { id: 'service', label: 'Service', communityAverage: 75 },
    { id: 'value', label: 'Value for Money', communityAverage: 68 },
    { id: 'atmosphere', label: 'Atmosphere', communityAverage: 81 }
  ],
  shows: [
    { id: 'performance', label: 'Performance Quality', communityAverage: 84 },
    { id: 'entertainment', label: 'Entertainment Value', communityAverage: 86 },
    { id: 'audience', label: 'Audience Experience', communityAverage: 80 }
  ],
  hotels: [
    { id: 'room', label: 'Room Quality', communityAverage: 77 },
    { id: 'service', label: 'Service', communityAverage: 74 },
    { id: 'value', label: 'Value for Money', communityAverage: 70 },
    { id: 'location', label: 'Location', communityAverage: 85 }
  ],
  shops: [
    { id: 'quality', label: 'Product Quality', communityAverage: 76 },
    { id: 'value', label: 'Value for Money', communityAverage: 69 },
    { id: 'selection', label: 'Selection', communityAverage: 80 }
  ]
}

const COMMUNITY_OVERALL = 82
const COMMUNITY_BREAKDOWN = { positive: 68, mixed: 22, negative: 10 }

function ItemPageContent({ park, item, category, images, videos }: {
  park: any
  item: any
  category: any
  images: string[]
  videos: string[]
}) {
  const [reviewFilter, setReviewFilter] = useState('all')
  const [isRatingOpen, setIsRatingOpen] = useState(false)
  const [hasRated, setHasRated] = useState(false)
  const [myScore, setMyScore] = useState<number | null>(null)
  const [reviewTitle, setReviewTitle] = useState('')
  const [reviewText, setReviewText] = useState('')
  const [userReview, setUserReview] = useState<{ title: string; text: string } | null>(null)

  const dimensions = ratingDimensions[item.category_id] || ratingDimensions.rides
  const [userRatings, setUserRatings] = useState<Record<string, number>>(
    dimensions.reduce((acc, dim) => ({ ...acc, [dim.id]: 50 }), {})
  )

  const calculateMyScore = () =>
    Math.round(dimensions.reduce((sum, dim) => sum + (userRatings[dim.id] || 0), 0) / dimensions.length)

  const handleSubmitRating = () => {
    const score = calculateMyScore()
    setMyScore(score)
    setHasRated(true)
    setIsRatingOpen(false)
    if (reviewTitle.trim() || reviewText.trim()) {
      setUserReview({ title: reviewTitle, text: reviewText })
    }
  }

  // Blend community 60% + user 40% when rated
  const overallScore = hasRated && myScore !== null
    ? Math.round(COMMUNITY_OVERALL * 0.6 + myScore * 0.4)
    : COMMUNITY_OVERALL

  const mediaSlides = images.map((src, i) => ({
    src,
    alt: item.name,
    isVideo: Boolean(videos[i])
  }))

  const specs = item.specs || {}
  const hasSpecs = Object.keys(specs).length > 0

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="mb-6">
          <Link href="/parks" className="text-blue-400 hover:text-blue-300 text-sm">Parks</Link>
          <span className="mx-2 text-gray-500">/</span>
          <Link href={`/parks/${park.id}`} className="text-blue-400 hover:text-blue-300 text-sm">{park.name}</Link>
          <span className="mx-2 text-gray-500">/</span>
          <span className="text-gray-300 text-sm">{item.name}</span>
        </nav>

        {/* Item Title */}
        <div className="mb-8">
          <h1 className="text-5xl font-bold mb-2">{item.name}</h1>
        </div>

        <div className="mb-12 grid grid-cols-1 gap-6 lg:grid-cols-3 lg:gap-8">
          <div className="lg:col-span-2">
            <SteamMediaCarousel
              key={item.id}
              slides={mediaSlides}
              autoAdvanceMs={images.length > 1 ? 5000 : undefined}
            />
          </div>
          <div className="lg:col-span-1">
            <SteamInfoPanel
              headerImage={`/parks/${park.id}/roller-coasters/${item.id}/logo.png`}
              headerImageAlt={item.name}
              score={overallScore}
              scoreLabel="Overall score"
              myScore={myScore}
              hasRated={hasRated}
              onRateClick={() => setIsRatingOpen(true)}
              ratingBreakdown={COMMUNITY_BREAKDOWN}
              tags={[specs.type, specs.manufacturer, category.name].filter(Boolean) as string[]}
            >
              {hasSpecs && (
                <div className="border-t border-[#2a475e] pt-4">
                  <div className="space-y-2 text-sm">
                    {specs.type && (
                      <div className="flex justify-between gap-4 text-[#acb2b8]">
                        <span>Roller Coaster Type</span>
                        <span className="text-[#c6d4df]">{specs.type}</span>
                      </div>
                    )}
                    {specs.status && (
                      <div className="flex justify-between gap-4 text-[#acb2b8]">
                        <span>Status</span>
                        <span className="text-[#c6d4df]">{specs.status}</span>
                      </div>
                    )}
                    {specs.manufacturer && (
                      <div className="flex justify-between gap-4 text-[#acb2b8]">
                        <span>Manufacturer</span>
                        <span className="text-[#c6d4df]">{specs.manufacturer}</span>
                      </div>
                    )}
                    {specs.height && (
                      <div className="flex justify-between gap-4 text-[#acb2b8]">
                        <span>Height</span>
                        <span className="text-[#c6d4df]">{specs.height}</span>
                      </div>
                    )}
                    {specs.drop && (
                      <div className="flex justify-between gap-4 text-[#acb2b8]">
                        <span>Drop</span>
                        <span className="text-[#c6d4df]">{specs.drop}</span>
                      </div>
                    )}
                    {specs.speed && (
                      <div className="flex justify-between gap-4 text-[#acb2b8]">
                        <span>Speed</span>
                        <span className="text-[#c6d4df]">{specs.speed}</span>
                      </div>
                    )}
                    {specs.length && (
                      <div className="flex justify-between gap-4 text-[#acb2b8]">
                        <span>Length</span>
                        <span className="text-[#c6d4df]">{specs.length}</span>
                      </div>
                    )}
                    {specs.inversions !== undefined && (
                      <div className="flex justify-between gap-4 text-[#acb2b8]">
                        <span>Inversions</span>
                        <span className="text-[#c6d4df]">{specs.inversions}</span>
                      </div>
                    )}
                    {specs.gForce && (
                      <div className="flex justify-between gap-4 text-[#acb2b8]">
                        <span>G-Forces</span>
                        <span className="text-[#c6d4df]">{specs.gForce}</span>
                      </div>
                    )}
                    {specs.duration && (
                      <div className="flex justify-between gap-4 text-[#acb2b8]">
                        <span>Duration</span>
                        <span className="text-[#c6d4df]">{specs.duration}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </SteamInfoPanel>
          </div>
        </div>

        {/* Rating Modal */}
        {isRatingOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/70" onClick={() => setIsRatingOpen(false)} />
            <div className="relative z-10 w-full max-w-lg bg-[#1b2838] border border-[#2a475e] rounded-sm shadow-2xl">
              {/* Header */}
              <div className="flex items-center justify-between border-b border-[#2a475e] px-6 py-4">
                <h2 className="text-lg font-semibold text-[#c6d4df]">Rate {item.name}</h2>
                <button onClick={() => setIsRatingOpen(false)} className="text-[#8f98a0] hover:text-white text-xl leading-none">✕</button>
              </div>
              {/* Sliders */}
              <div className="px-6 py-5 space-y-6 max-h-[60vh] overflow-y-auto">
                {dimensions.map(dimension => {
                  const userScore = userRatings[dimension.id] || 0
                  return (
                    <div key={dimension.id} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <label className="text-sm font-medium text-[#c6d4df]">{dimension.label}</label>
                        <span className="text-lg font-bold text-[#66c0f4] w-10 text-right">{userScore}</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={userScore}
                        onChange={e => setUserRatings(prev => ({ ...prev, [dimension.id]: parseInt(e.target.value) }))}
                        className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
                        style={{
                          background: `linear-gradient(to right, #66c0f4 0%, #66c0f4 ${userScore}%, #2a475e ${userScore}%, #2a475e 100%)`
                        }}
                      />
                      <p className="text-[10px] text-[#8f98a0]">Community average: {dimension.communityAverage}</p>
                    </div>
                  )
                })}
              </div>
              {/* Comment */}
              <div className="px-6 pb-5 space-y-3 border-t border-[#2a475e] pt-5">
                <p className="text-xs font-medium uppercase tracking-wider text-[#8f98a0]">Leave a review (optional)</p>
                <input
                  type="text"
                  placeholder="Review title"
                  value={reviewTitle}
                  onChange={e => setReviewTitle(e.target.value)}
                  className="w-full bg-[#2a475e] border border-[#3d6a8a] rounded-sm px-3 py-2 text-sm text-[#c6d4df] placeholder-[#6a8a9a] focus:outline-none focus:border-[#66c0f4]"
                />
                <textarea
                  placeholder="Share your experience..."
                  value={reviewText}
                  onChange={e => setReviewText(e.target.value)}
                  rows={3}
                  className="w-full bg-[#2a475e] border border-[#3d6a8a] rounded-sm px-3 py-2 text-sm text-[#c6d4df] placeholder-[#6a8a9a] focus:outline-none focus:border-[#66c0f4] resize-none"
                />
              </div>
              {/* Footer */}
              <div className="flex items-center justify-between border-t border-[#2a475e] px-6 py-4">
                <div className="text-sm text-[#8f98a0]">
                  Your score: <span className="text-[#66c0f4] font-bold">{calculateMyScore()}</span>
                </div>
                <div className="flex gap-3">
                  <button onClick={() => setIsRatingOpen(false)} className="px-4 py-2 text-sm text-[#8f98a0] hover:text-white transition-colors">
                    Cancel
                  </button>
                  <button onClick={handleSubmitRating} className="px-5 py-2 bg-[#4c6b22] hover:bg-[#5a7a28] text-white text-sm font-medium rounded-sm transition-colors">
                    Submit rating
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
            {[
              { id: 'all', label: 'All Reviews' },
              { id: 'positive', label: 'Positive Reviews' },
              { id: 'mixed', label: 'Mixed Reviews' },
              { id: 'negative', label: 'Negative Reviews' },
              { id: 'funny', label: 'Funny Reviews' }
            ].map((filter) => (
              <button
                key={filter.id}
                onClick={() => setReviewFilter(filter.id)}
                className={`px-4 py-2 whitespace-nowrap font-medium transition-colors ${reviewFilter === filter.id
                  ? 'text-blue-400 border-b-2 border-blue-400'
                  : 'text-gray-400 hover:text-gray-300'
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
          <div className="space-y-6">
            {userReview && myScore !== null && (
              <div className="bg-[#1b2838] border border-[#2a475e] rounded-lg p-6 flex gap-6 items-start">
                <div className="flex-shrink-0">
                  <svg className="w-20 h-20" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="45" fill="none" stroke="#2a475e" strokeWidth="2" />
                    <circle cx="50" cy="50" r="45" fill="none" stroke={myScore >= 75 ? '#10b981' : myScore >= 50 ? '#f59e0b' : '#ef4444'} strokeWidth="2"
                      strokeDasharray={`${(myScore / 100) * 282.7}`} strokeDashoffset="0" strokeLinecap="round"
                      style={{ transform: 'rotate(-90deg)', transformOrigin: '50% 50%' }} />
                    <text x="50" y="50" textAnchor="middle" dy="0.3em" fill="#c6d4df" fontWeight="bold" fontSize="28">
                      {myScore}
                    </text>
                  </svg>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="font-semibold text-[#66c0f4] text-lg">You</span>
                    <span className="text-xs text-[#8f98a0] bg-[#2a475e] px-2 py-0.5 rounded-sm">Your review</span>
                  </div>
                  {userReview.title && <p className="text-base font-medium text-[#c6d4df] mb-2">{userReview.title}</p>}
                  {userReview.text && <p className="text-sm text-[#acb2b8] leading-relaxed">{userReview.text}</p>}
                </div>
              </div>
            )}
            {[
              { author: 'Sarah M.', score: 92, title: 'Absolutely thrilling!', text: "One of the best rides I've ever experienced. The speed and intensity are incredible!" },
              { author: 'John D.', score: 68, title: 'Great but queue was long', text: 'The ride itself is fantastic, but I waited 90 minutes. Worth it, but plan accordingly.' },
              { author: 'Emma K.', score: 88, title: 'Perfect for thrill seekers', text: "Exceeded all my expectations. The engineering is impressive and it's smooth despite the intensity." }
            ].map((review, idx) => {
              const getScoreColor = (score: number) => score >= 75 ? '#10b981' : score >= 50 ? '#f59e0b' : '#ef4444'
              return (
                <div key={idx} className="bg-gray-800 rounded-lg p-6 flex gap-6 items-start">
                  <div className="flex-shrink-0">
                    <svg className="w-20 h-20" viewBox="0 0 100 100">
                      <circle cx="50" cy="50" r="45" fill="none" stroke="#374151" strokeWidth="2" />
                      <circle cx="50" cy="50" r="45" fill="none" stroke={getScoreColor(review.score)} strokeWidth="2"
                        strokeDasharray={`${(review.score / 100) * 282.7}`} strokeDashoffset="0" strokeLinecap="round"
                        style={{ transform: 'rotate(-90deg)', transformOrigin: '50% 50%' }} />
                      <text x="50" y="50" textAnchor="middle" dy="0.3em" className="fill-gray-200 font-bold" style={{ fontSize: '28px' }}>
                        {review.score}
                      </text>
                    </svg>
                  </div>
                  <div className="flex-1">
                    <div className="mb-3"><span className="font-semibold text-gray-200 text-lg">{review.author}</span></div>
                    <p className="text-base font-medium text-gray-300 mb-2">{review.title}</p>
                    <p className="text-sm text-gray-400 leading-relaxed">{review.text}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Back Button */}
        <div className="flex justify-center mb-8">
          <Link href={`/parks/${park.id}`} className="bg-blue-600 hover:bg-blue-700 px-8 py-3 rounded-lg font-semibold transition-colors">
            Back to {park.name}
          </Link>
        </div>
      </div>
    </div>
  )
}

export default async function ItemPage({ params }: ItemPageProps) {
  const { parkId, itemId } = await params
  const park = mockParks.find(p => p.id === parkId)
  const items = mockItems[parkId as keyof typeof mockItems] || []
  const item = items.find(i => i.id === itemId)
  const category = mockCategories.find(c => c.id === item?.category_id)
  const images = mockItemImages[itemId as keyof typeof mockItemImages] || []
  const videos = mockItemVideos[itemId as keyof typeof mockItemVideos] || []

  if (!park || !item || !category) notFound()

  return <ItemPageContent park={park} item={item} category={category} images={images} videos={videos} />
}