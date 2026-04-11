'use client'

import Link from 'next/link'
import { notFound } from 'next/navigation'
import { useState } from 'react'
import RatingComponent from '@/components/RatingComponent'
import { SteamMediaCarousel } from '@/components/SteamMediaCarousel'
import { SteamInfoPanel } from '@/components/SteamInfoPanel'
import { mockParks, mockCategories, mockItems, mockItemImages, mockItemVideos } from '@/lib/items-data'

interface ItemPageProps {
  params: Promise<{
    parkId: string
    itemId: string
  }>
}

function ItemPageContent({ park, item, category, images, videos }: {
  park: any
  item: any
  category: any
  images: string[]
  videos: string[]
}) {
  const [reviewFilter, setReviewFilter] = useState('all')

  const mediaSlides = images.map((src, i) => ({
    src,
    alt: item.name,
    isVideo: Boolean(videos[i])
  }))

  const specs = item.specs || {}
  const hasSpecs = Object.keys(specs).length > 0

  // Mock ratings data
  const overallScore = 82
  const ratingBreakdown = {
    positive: 68,
    mixed: 22,
    negative: 10
  }

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
          <p className="text-gray-400 text-lg">{park.name} • {item.location_in_park}</p>
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
              headerImage={images[0]}
              headerImageAlt={item.name}
              title={item.name}
              description={item.description}
              score={overallScore}
              scoreLabel="Overall score"
              metadata={[
                {
                  label: 'Recent reviews',
                  value: `Mostly positive (${ratingBreakdown.positive}%)`
                },
                { label: 'Category', value: category.name },
                { label: 'Area in park', value: item.location_in_park },
                ...(specs.type ? [{ label: 'Ride type', value: specs.type }] : [])
              ]}
              tags={[specs.type, specs.manufacturer, category.name].filter(Boolean) as string[]}
            >
              {hasSpecs && (
                <div className="border-t border-[#2a475e] pt-4">
                  <h3 className="mb-3 text-xs font-medium uppercase tracking-wider text-[#8f98a0]">
                    Quick facts
                  </h3>
                  <div className="space-y-2 text-sm">
                    {specs.height && (
                      <div className="flex justify-between gap-4 text-[#acb2b8]">
                        <span>Height</span>
                        <span className="text-[#c6d4df]">{specs.height}</span>
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
                    {specs.drop && (
                      <div className="flex justify-between gap-4 text-[#acb2b8]">
                        <span>Drop</span>
                        <span className="text-[#c6d4df]">{specs.drop}</span>
                      </div>
                    )}
                    {specs.manufacturer && (
                      <div className="flex justify-between gap-4 text-[#acb2b8]">
                        <span>Manufacturer</span>
                        <span className="text-[#c6d4df]">{specs.manufacturer}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </SteamInfoPanel>
          </div>
        </div>

        {/* Rating breakdown */}
        <div className="mb-12 rounded-lg bg-gray-800 p-8">
          <h3 className="text-lg font-semibold mb-6">Recent Reviews</h3>
          <div className="space-y-6">
            {/* Positive */}
            <div>
              <div className="flex justify-between items-center mb-3">
                <span className="text-green-400 font-semibold">Overwhelmingly Positive</span>
                <span className="text-gray-400 text-sm">({ratingBreakdown.positive}%)</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden">
                <div
                  className="bg-green-500 h-full rounded-full"
                  style={{ width: `${ratingBreakdown.positive}%` }}
                ></div>
              </div>
            </div>

            {/* Mixed */}
            <div>
              <div className="flex justify-between items-center mb-3">
                <span className="text-yellow-400 font-semibold">Mixed</span>
                <span className="text-gray-400 text-sm">({ratingBreakdown.mixed}%)</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden">
                <div
                  className="bg-yellow-500 h-full rounded-full"
                  style={{ width: `${ratingBreakdown.mixed}%` }}
                ></div>
              </div>
            </div>

            {/* Negative */}
            <div>
              <div className="flex justify-between items-center mb-3">
                <span className="text-red-400 font-semibold">Overwhelmingly Negative</span>
                <span className="text-gray-400 text-sm">({ratingBreakdown.negative}%)</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden">
                <div
                  className="bg-red-500 h-full rounded-full"
                  style={{ width: `${ratingBreakdown.negative}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Rating System */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold mb-6">Rate This Experience</h2>
          <RatingComponent item={item} category={category} />
        </div>

        {/* Reviews Section with Filter Tabs */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold mb-6">All Reviews</h2>

          {/* Filter Tabs */}
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

          {/* Mock Reviews */}
          <div className="space-y-6">
            {[
              {
                author: 'Sarah M.',
                score: 92,
                title: 'Absolutely thrilling!',
                text: 'One of the best rides I\'ve ever experienced. The speed and intensity are incredible!'
              },
              {
                author: 'John D.',
                score: 68,
                title: 'Great but queue was long',
                text: 'The ride itself is fantastic, but I waited 90 minutes. Worth it, but plan accordingly.'
              },
              {
                author: 'Emma K.',
                score: 88,
                title: 'Perfect for thrill seekers',
                text: 'Exceeded all my expectations. The engineering is impressive and it\'s smooth despite the intensity.'
              }
            ].map((review, idx) => {
              const getScoreColor = (score: number) => {
                if (score >= 75) return '#10b981' // green
                if (score >= 50) return '#f59e0b' // yellow/orange
                return '#ef4444' // red
              }

              return (
                <div key={idx} className="bg-gray-800 rounded-lg p-6 flex gap-6 items-start">
                  {/* Score Circle */}
                  <div className="flex-shrink-0">
                    <svg className="w-20 h-20" viewBox="0 0 100 100">
                      <circle cx="50" cy="50" r="45" fill="none" stroke="#374151" strokeWidth="2" />
                      <circle
                        cx="50"
                        cy="50"
                        r="45"
                        fill="none"
                        stroke={getScoreColor(review.score)}
                        strokeWidth="2"
                        strokeDasharray={`${(review.score / 100) * 282.7}`}
                        strokeDashoffset="0"
                        strokeLinecap="round"
                        style={{ transform: 'rotate(-90deg)', transformOrigin: '50% 50%' }}
                      />
                      <text
                        x="50"
                        y="50"
                        textAnchor="middle"
                        dy="0.3em"
                        className="fill-gray-200 font-bold"
                        style={{ fontSize: '28px' }}
                      >
                        {review.score}
                      </text>
                    </svg>
                  </div>

                  {/* Review Content */}
                  <div className="flex-1">
                    <div className="mb-3">
                      <span className="font-semibold text-gray-200 text-lg">{review.author}</span>
                    </div>
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
          <Link
            href={`/parks/${park.id}`}
            className="bg-blue-600 hover:bg-blue-700 px-8 py-3 rounded-lg font-semibold transition-colors"
          >
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

  if (!park || !item || !category) {
    notFound()
  }

  return <ItemPageContent park={park} item={item} category={category} images={images} videos={videos} />
}