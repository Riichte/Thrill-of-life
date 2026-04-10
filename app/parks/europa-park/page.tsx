'use client'

import Link from 'next/link'
import { useState } from 'react'
import RatingComponent from '@/components/RatingComponent'
import { SteamMediaCarousel } from '@/components/SteamMediaCarousel'
import { SteamInfoPanel } from '@/components/SteamInfoPanel'

// Mock data for Europa Park
const europaPark = {
  id: 'europa-park',
  name: 'Europa Park',
  logo_url: '/parks/europa park/logo.png',
  banner_url: '/parks/europa park/main.jpg',
  description: 'Europa-Park is a theme park in Rust, Germany. It is Europe\'s second most popular theme park resort according to the TEA/AECOM 2018 Global Attractions Attendance Report with 5.8 million visitors per year.',
  location: 'Rust, Germany'
}

const categories = [
  { id: 'roller-coasters', name: 'Roller Coasters', image: '/parks/europa park/roller coasters/Wodan/main.jpg' },
  { id: 'dark-rides', name: 'Dark Rides', image: '/parks/europa park/Dark Rides/Abenteuer Atlantis/main.jpg' },
  { id: 'flat-rides', name: 'Flat Rides', image: '/parks/europa park/Flat Rides/Vindjammer/main.jpg' },
  { id: 'water-rides', name: 'Water Rides', image: '/parks/europa park/Water Rides/Tiroler Wildwasserbahn/main.jpg' },
  { id: 'shows', name: 'Shows', image: '/parks/europa park/main.jpg' }, // placeholder
  { id: 'restaurants', name: 'Restaurants', image: '/parks/europa park/main.jpg' }, // placeholder
  { id: 'hotels', name: 'Hotels', image: '/parks/europa park/main.jpg' } // placeholder
]

const featuredRides = [
  {
    id: 'wodan',
    name: 'Wodan',
    category: 'roller-coasters',
    description: 'A thrilling wooden roller coaster with breathtaking drops and high speeds.',
    image: '/parks/europa park/roller coasters/wodan/main.jpg',
    logo: '/parks/europa park/roller coasters/wodan/logo.jpg',
    specs: {
      height: '40m',
      speed: '100 km/h',
      length: '1050m'
    }
  },
  {
    id: 'euromir',
    name: 'Euromir',
    category: 'roller-coasters',
    description: 'A looping roller coaster that simulates a journey to space.',
    image: '/parks/europa park/roller coasters/euromir/main.jpg',
    logo: '/parks/europa park/roller coasters/euromir/logo.png',
    specs: {
      height: '35m',
      speed: '80 km/h',
      length: '850m'
    }
  }
] 

// Carousel images for Europa Park
const carouselImages = [
  '/parks/europa park/main.jpg',
  '/parks/europa park/01.jpg',
  '/parks/europa park/02.jpg',
  '/parks/europa park/03.jpg',
  '/parks/europa park/04.jpg',
  '/parks/europa park/05.jpg',
  '/parks/europa park/06.jpg',
  '/parks/europa park/07.jpg',

  
]

export default function EuropaParkPage() {
  const [reviewFilter, setReviewFilter] = useState('all')

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
          <h2 className="text-2xl font-semibold mb-6">Rate This Park</h2>
          <RatingComponent item={{ id: europaPark.id, name: europaPark.name, category_id: 'parks' }} category={{ id: 'parks', name: 'Parks' }} />
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
                className={`px-4 py-2 whitespace-nowrap font-medium transition-colors ${
                  reviewFilter === filter.id
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
                author: 'Anna S.',
                score: 90,
                title: 'Amazing European experience!',
                text: 'Europa-Park is a fantastic theme park with so much variety. The attention to detail in each themed area is incredible!'
              },
              {
                author: 'Michael R.',
                score: 75,
                title: 'Great but crowded',
                text: 'Loved the rides and shows, but it was very crowded during peak hours. Still worth the visit.'
              },
              {
                author: 'Lisa K.',
                score: 88,
                title: 'Perfect family destination',
                text: 'From roller coasters to gentle rides, there\'s something for everyone. The hotels are also excellent.'
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
        <div className="flex justify-center">
          <Link
            href="/parks"
            className="bg-blue-600 hover:bg-blue-700 px-8 py-3 rounded-lg font-semibold transition-colors"
          >
            Back to All Parks
          </Link>
        </div>
      </div>
    </div>
  )
}