// app/parks/europa-park/page.tsx

'use client'

import { useState } from 'react'
import Link from 'next/link'
import RatingComponent from '@/components/RatingComponent'
import { SteamMediaCarousel } from '@/components/SteamMediaCarousel'
import { SteamInfoPanel } from '@/components/SteamInfoPanel'
import { europaPark, categories, featuredRides, carouselImages } from '@/lib/europa-park-data'

// Carousel images for Europa Park
const mediaSlides = carouselImages.map((src) => ({
  src,
  alt: europaPark.name
}))

// Mock ratings data
const overallScore = 85
const ratingBreakdown = {
  positive: 72,
  mixed: 18,
  negative: 10
}

export default function EuropaParkPage() {
  const [reviewFilter, setReviewFilter] = useState('all')

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="mb-6">
          <Link href="/parks" className="text-blue-400 hover:text-blue-300 text-sm">Parks</Link>
          <span className="mx-2 text-gray-500">/</span>
          <span className="text-gray-300 text-sm">{europaPark.name}</span>
        </nav>

        {/* Item Title */}
        <div className="mb-8">
          <h1 className="text-5xl font-bold mb-2">{europaPark.name}</h1>
          <p className="text-gray-400 text-lg">{europaPark.location}</p>
        </div>

        {/* Steam-style hero: media + sidebar */}
        <div className="mb-12 grid grid-cols-1 gap-6 lg:grid-cols-3 lg:gap-8">
          <div className="lg:col-span-2">
            <SteamMediaCarousel slides={mediaSlides} autoAdvanceMs={5000} />
          </div>
          <div className="lg:col-span-1">
            <SteamInfoPanel
              headerImage={europaPark.banner_url}
              headerImageAlt={europaPark.name}
              logoUrl={europaPark.logo_url}
              logoAlt={`${europaPark.name} logo`}
              title={europaPark.name}
              description={europaPark.description}
              score={overallScore}
              scoreLabel="Overall score"
              metadata={[
                {
                  label: 'Recent reviews',
                  value: `Mostly positive (${ratingBreakdown.positive}%)`
                },
                {
                  label: 'All reviews',
                  value: 'Very positive (1,240)'
                },
                { label: 'Location', value: europaPark.location },
                {
                  label: 'Resort',
                  value: 'Europa-Park Rust'
                }
              ]}
              tags={['Theme park', 'Germany', 'Family', 'Roller coasters', 'Hotels']}
            />
          </div>
        </div>

        {/* Categories */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold mb-8">Explore by Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/parks/${europaPark.id}/category/${category.id}`}
                className="bg-gray-800 hover:bg-gray-700 rounded-lg overflow-hidden transition-colors"
              >
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-24 object-cover"
                />
                <div className="p-3 text-center">
                  <h3 className="font-semibold text-sm">{category.name}</h3>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Featured Roller Coasters */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold mb-8">Featured Roller Coasters</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {featuredRides.map((ride) => (
              <Link
                key={ride.id}
                href={`/parks/${europaPark.id}/${ride.id}`}
                className="bg-gray-800 hover:bg-gray-700 rounded-lg overflow-hidden transition-colors"
              >
                <div className="relative h-48">
                  <img
                    src={ride.image}
                    alt={ride.name}
                    className="w-full h-full object-cover"
                  />
                  {ride.logo && (
                    <img
                      src={ride.logo}
                      alt={`${ride.name} Logo`}
                      className="absolute top-4 right-4 w-12 h-12 bg-white bg-opacity-90 rounded-full p-1"
                    />
                  )}
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2">{ride.name}</h3>
                  <p className="text-gray-300 mb-4">{ride.description}</p>
                  <div className="flex justify-between text-sm text-gray-400">
                    <span>Height: {ride.specs.height}</span>
                    <span>Speed: {ride.specs.speed}</span>
                    <span>Length: {ride.specs.length}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Rating Breakdown */}
        <div className="bg-gray-800 rounded-lg p-8 mb-12">
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
