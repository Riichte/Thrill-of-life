'use client'

import { useState } from 'react'
import Link from 'next/link'
import { SteamMediaCarousel } from '@/components/SteamMediaCarousel'
import { SteamInfoPanel } from '@/components/SteamInfoPanel'
import { createClient } from '@/lib/supabase/client'

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

import PhotoCredits, { PhotoCredit } from '@/components/PhotoCredits'

interface ParkPageClientProps {
  park: Park
  slides: string[]
  categoriesWithImages: Category[]
  categoryImages: Record<string, string>
  userId: string | null
  isFavorited: boolean
  credits: PhotoCredit[]
}

export default function ParkPageClient({
  park, slides, categoriesWithImages, categoryImages,
  userId, isFavorited: initialFavorited, credits = [],
}: ParkPageClientProps) {


const COMMUNITY_OVERALL = 85
const COMMUNITY_BREAKDOWN = { positive: 72, mixed: 18, negative: 10 }

export default function ParkPageClient({
  park,
  slides,
  categoriesWithImages,
  categoryImages,
  userId,
  isFavorited: initialFavorited,
}: ParkPageClientProps) {
  const supabase = createClient()
  const [isFavorited, setIsFavorited] = useState(initialFavorited)

  const handleFavoriteToggle = async () => {
    if (!userId) {
      window.location.href = `/auth/login?redirect=/parks/${park.id}`
      return
    }
    if (isFavorited) {
      await supabase.from('favorites').delete()
        .eq('item_id', park.id).eq('user_id', userId)
      setIsFavorited(false)
    } else {
      await supabase.from('favorites').insert({ item_id: park.id, user_id: userId })
      setIsFavorited(true)
    }
  }

  const mediaSlides = slides.map(src => ({ src, alt: park.name }))

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-8">

        {/* Breadcrumb */}
        <nav className="mb-6">
          <Link href="/parks" className="text-blue-400 hover:text-blue-300 text-sm">Parks</Link>
          <span className="mx-2 text-gray-500">/</span>
          <span className="text-gray-300 text-sm">{park.name}</span>
        </nav>

        {/* Title */}
        <div className="mb-8">
          <h1 className="text-5xl font-bold mb-2">{park.name}</h1>
          <p className="text-gray-400 text-lg">{park.location}</p>
        </div>

        {/* Steam-style hero: media + sidebar */}
        <div className="mb-12 grid grid-cols-1 gap-6 lg:grid-cols-3 lg:gap-8">
          <div className="lg:col-span-2">
            <SteamMediaCarousel
              slides={mediaSlides}
              autoAdvanceMs={slides.length > 1 ? 5000 : undefined}
            />
          </div>
          <div className="lg:col-span-1">
            <SteamInfoPanel
              headerImage={park.logo_url}
              headerImageAlt={park.name}
              score={COMMUNITY_OVERALL}
              scoreLabel="Overall score"
              ratingBreakdown={COMMUNITY_BREAKDOWN}
              tags={[park.country, park.company, park.park_type].filter(Boolean)}
              showFavorite={true}
              isFavorited={isFavorited}
              onFavoriteToggle={handleFavoriteToggle}
            >
              {/* Description */}
              <div className="border-t border-[#2a475e] pt-4">
                <p className="text-sm text-[#acb2b8] leading-relaxed">{park.description}</p>
              </div>

              {/* Park details */}
              <div className="border-t border-[#2a475e] pt-4 space-y-2 text-sm">
                {park.location && (
                  <div className="flex justify-between gap-4 text-[#acb2b8]">
                    <span>Location</span>
                    <span className="text-[#c6d4df]">{park.location}</span>
                  </div>
                )}
                {park.country && (
                  <div className="flex justify-between gap-4 text-[#acb2b8]">
                    <span>Country</span>
                    <span className="text-[#c6d4df]">{park.country}</span>
                  </div>
                )}
                {park.company && (
                  <div className="flex justify-between gap-4 text-[#acb2b8]">
                    <span>Operated by</span>
                    <span className="text-[#c6d4df]">{park.company}</span>
                  </div>
                )}
                {park.park_type && (
                  <div className="flex justify-between gap-4 text-[#acb2b8]">
                    <span>Type</span>
                    <span className="text-[#c6d4df]">{park.park_type}</span>
                  </div>
                )}
              </div>
            </SteamInfoPanel>
          </div>
        </div>

        {/* Categories Grid */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold mb-8">Explore by Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {categoriesWithImages.map(category => {
              const image = categoryImages[category.id]
              return (
                <Link
                  key={category.id}
                  href={`/parks/${park.id}/category/${category.id}`}
                  className="group relative h-48 rounded-sm overflow-hidden border border-[#2a475e] hover:border-[#66c0f4] transition-colors"
                >
                  {image ? (
                    <img
                      src={image}
                      alt={category.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
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

        {/* Back Button */}
        <div className="flex justify-center mb-8">
          <Link href="/parks" className="bg-blue-600 hover:bg-blue-700 px-8 py-3 rounded-lg font-semibold transition-colors">
            Back to All Parks
          </Link>
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