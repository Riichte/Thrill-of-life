'use client'

import Link from 'next/link'
import { notFound } from 'next/navigation'
import { useState, useEffect } from 'react'
import RatingComponent from '@/components/RatingComponent'
import { ChevronLeft, ChevronRight, Star } from 'lucide-react'

// Mock data (same as park page)
const mockParks = [
  {
    id: 'disneyland-paris',
    name: 'Disneyland Paris',
    logo_url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=200&h=200&fit=crop&crop=center'
  },
  {
    id: 'universal-florida',
    name: 'Universal Studios Florida',
    logo_url: 'https://images.unsplash.com/photo-1551632436-cbf8dd35adfa?w=200&h=200&fit=crop&crop=center'
  },
  {
    id: 'six-flags-magic-mountain',
    name: 'Six Flags Magic Mountain',
    logo_url: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=200&h=200&fit=crop&crop=center'
  },
  {
    id: 'alton-towers',
    name: 'Alton Towers',
    logo_url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=200&h=200&fit=crop&crop=center'
  },
  {
    id: 'port-adventure',
    name: 'PortAventura World',
    logo_url: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=200&h=200&fit=crop&crop=center'
  }
]

const mockCategories = [
  { id: 'rides', name: 'Rides' },
  { id: 'restaurants', name: 'Restaurants' },
  { id: 'shows', name: 'Shows & Entertainment' },
  { id: 'hotels', name: 'Hotels & Resorts' },
  { id: 'shops', name: 'Shops & Merchandise' }
]

const mockItems = {
  'disneyland-paris': [
    {
      id: 'space-mountain',
      category_id: 'rides',
      name: 'Space Mountain',
      description: 'A thrilling indoor roller coaster through the darkness of space. Experience weightlessness and high-speed turns as you journey through the cosmos in this classic Disney attraction.',
      location_in_park: 'Discoveryland',
      specs: {
        height: '42m',
        speed: '65 km/h',
        length: '900m',
        drop: '35m',
        manufacturer: 'Arrow Dynamics',
        type: 'Indoor Roller Coaster'
      }
    },
    {
      id: 'ratatouille-restaurant',
      category_id: 'restaurants',
      name: 'Bistrot Chez Rémy',
      description: 'Experience fine French dining inspired by Ratatouille. Enjoy gourmet meals in a charming Parisian bistro setting with views of the park.',
      location_in_park: 'Main Street, U.S.A.'
    },
    {
      id: 'disney-stars-on-parade',
      category_id: 'shows',
      name: 'Disney Stars on Parade',
      description: 'A spectacular parade featuring Disney characters from classic and modern films. Watch as your favorite characters dance and perform down Main Street.',
      location_in_park: 'Main Street, U.S.A.'
    }
  ],
  'universal-florida': [
    {
      id: 'harry-potter-ride',
      category_id: 'rides',
      name: 'Harry Potter and the Forbidden Journey',
      description: 'An immersive ride through the Wizarding World of Harry Potter. Fly alongside Harry on a broomstick and experience magical adventures.',
      location_in_park: 'The Wizarding World of Harry Potter',
      specs: {
        height: '42m',
        speed: '60 km/h',
        length: '1000m',
        drop: '28m',
        manufacturer: 'Bolliger & Mabillard',
        type: 'Roller Coaster'
      }
    },
    {
      id: 'hogwarts-express',
      category_id: 'restaurants',
      name: 'The Three Broomsticks',
      description: 'Authentic British pub fare in Hogsmeade. Enjoy shepherd\'s pie, fish and chips, and butterbeer in a magical setting.',
      location_in_park: 'The Wizarding World of Harry Potter'
    }
  ],
  'six-flags-magic-mountain': [
    {
      id: 'goliath-ride',
      category_id: 'rides',
      name: 'Goliath',
      description: 'One of the tallest, fastest roller coasters in the world. Experience weightlessness and breathtaking drops on this legendary coaster.',
      location_in_park: 'Colossus County Fair',
      specs: {
        height: '127m',
        speed: '147 km/h',
        length: '1645m',
        drop: '127m',
        manufacturer: 'Bolliger & Mabillard',
        type: 'Hypercoaster'
      }
    },
    {
      id: 'revolution-ride',
      category_id: 'rides',
      name: 'Revolution',
      description: 'The world\'s first modern roller coaster loop. A historic and thrilling experience since 1976.',
      location_in_park: 'Frontier Town',
      specs: {
        height: '32m',
        speed: '85 km/h',
        length: '900m',
        drop: '29m',
        manufacturer: 'Arrow Dynamics',
        type: 'Looping Coaster'
      }
    },
    {
      id: 'magic-mountain-grill',
      category_id: 'restaurants',
      name: 'Magic Mountain Grill',
      description: 'Premium dining with spectacular park views.',
      location_in_park: 'Main Plaza'
    }
  ],
  'alton-towers': [
    {
      id: 'smiler-ride',
      category_id: 'rides',
      name: 'The Smiler',
      description: 'The world\'s most looped roller coaster with 14 inversions. A record-breaking wonder of engineering.',
      location_in_park: 'The Smiler Area',
      specs: {
        height: '37m',
        speed: '117 km/h',
        length: '1426m',
        drop: '37m',
        manufacturer: 'Bolliger & Mabillard',
        type: 'Inversion Coaster'
      }
    },
    {
      id: 'nemesis-ride',
      category_id: 'rides',
      name: 'Nemesis',
      description: 'An iconic inverted roller coaster that has thrilled guests for decades.',
      location_in_park: 'X-Sector',
      specs: {
        height: '35m',
        speed: '80 km/h',
        length: '650m',
        drop: '35m',
        manufacturer: 'Bolliger & Mabillard',
        type: 'Inverted Coaster'
      }
    },
    {
      id: 'alton-towers-hotel',
      category_id: 'hotels',
      name: 'Alton Towers Hotel',
      description: 'Luxury accommodation in the historic grounds of Alton Towers.',
      location_in_park: 'Hotel Area'
    }
  ],
  'port-adventure': [
    {
      id: 'shambhala-ride',
      category_id: 'rides',
      name: 'Shambhala',
      description: 'Europe\'s highest and steepest hypercoaster. An extremely thrilling experience.',
      location_in_park: 'Far West',
      specs: {
        height: '78m',
        speed: '135 km/h',
        length: '1715m',
        drop: '74m',
        manufacturer: 'Bolliger & Mabillard',
        type: 'Hypercoaster'
      }
    },
    {
      id: 'furius-baco-ride',
      category_id: 'rides',
      name: 'Furius Baco',
      description: 'A high-speed roller coaster that launches you at incredible velocity.',
      location_in_park: 'Mediterranean',
      specs: {
        height: '33m',
        speed: '140 km/h',
        length: '1650m',
        drop: '33m',
        manufacturer: 'Intamin',
        type: 'Launch Coaster'
      }
    },
    {
      id: 'ferrari-land',
      category_id: 'shops',
      name: 'Ferrari Land Shop',
      description: 'Exclusive Ferrari merchandise and memorabilia for collectors.',
      location_in_park: 'Ferrari Land'
    }
  ]
}

const mockItemImages = {
  'space-mountain': [
    'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&h=600&fit=crop&crop=center',
    'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop&crop=center',
    'https://images.unsplash.com/photo-1551632436-cbf8dd35adfa?w=800&h=600&fit=crop&crop=center'
  ],
  'ratatouille-restaurant': [
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop&crop=center',
    'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&h=600&fit=crop&crop=center'
  ],
  'disney-stars-on-parade': [
    'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop&crop=center',
    'https://images.unsplash.com/photo-1551632436-cbf8dd35adfa?w=800&h=600&fit=crop&crop=center'
  ],
  'harry-potter-ride': [
    'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&h=600&fit=crop&crop=center',
    'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop&crop=center'
  ],
  'hogwarts-express': [
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop&crop=center'
  ],
  'goliath-ride': [
    'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&h=600&fit=crop&crop=center',
    'https://images.unsplash.com/photo-1551632436-cbf8dd35adfa?w=800&h=600&fit=crop&crop=center'
  ],
  'revolution-ride': [
    'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop&crop=center'
  ],
  'magic-mountain-grill': [
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop&crop=center'
  ],
  'smiler-ride': [
    'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&h=600&fit=crop&crop=center',
    'https://images.unsplash.com/photo-1551632436-cbf8dd35adfa?w=800&h=600&fit=crop&crop=center'
  ],
  'nemesis-ride': [
    'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop&crop=center'
  ],
  'alton-towers-hotel': [
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop&crop=center'
  ],
  'shambhala-ride': [
    'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&h=600&fit=crop&crop=center',
    'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop&crop=center'
  ],
  'furius-baco-ride': [
    'https://images.unsplash.com/photo-1551632436-cbf8dd35adfa?w=800&h=600&fit=crop&crop=center'
  ],
  'ferrari-land': [
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop&crop=center'
  ]
}

const mockItemVideos = {
  'space-mountain': [
    'https://www.youtube.com/embed/watch?v=dQw4w9WgXcQ',
    'https://www.youtube.com/embed/watch?v=dQw4w9WgXcQ'
  ],
  'ratatouille-restaurant': [
    'https://www.youtube.com/embed/watch?v=dQw4w9WgXcQ'
  ],
  'disney-stars-on-parade': [
    'https://www.youtube.com/embed/watch?v=dQw4w9WgXcQ'
  ],
  'harry-potter-ride': [
    'https://www.youtube.com/embed/watch?v=dQw4w9WgXcQ'
  ],
  'hogwarts-express': [
    'https://www.youtube.com/embed/watch?v=dQw4w9WgXcQ'
  ],
  'goliath-ride': [
    'https://www.youtube.com/embed/watch?v=dQw4w9WgXcQ'
  ],
  'revolution-ride': [
    'https://www.youtube.com/embed/watch?v=dQw4w9WgXcQ'
  ],
  'magic-mountain-grill': [
    'https://www.youtube.com/embed/watch?v=dQw4w9WgXcQ'
  ],
  'smiler-ride': [
    'https://www.youtube.com/embed/watch?v=dQw4w9WgXcQ'
  ],
  'nemesis-ride': [
    'https://www.youtube.com/embed/watch?v=dQw4w9WgXcQ'
  ],
  'alton-towers-hotel': [
    'https://www.youtube.com/embed/watch?v=dQw4w9WgXcQ'
  ],
  'shambhala-ride': [
    'https://www.youtube.com/embed/watch?v=dQw4w9WgXcQ'
  ],
  'furius-baco-ride': [
    'https://www.youtube.com/embed/watch?v=dQw4w9WgXcQ'
  ],
  'ferrari-land': [
    'https://www.youtube.com/embed/watch?v=dQw4w9WgXcQ'
  ]
}

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
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % images.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [images.length])

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length)
  }

  const handleNextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length)
  }

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
        <nav className="mb-8">
          <Link href="/parks" className="text-blue-400 hover:text-blue-300 text-sm">Parks</Link>
          <span className="mx-2 text-gray-500">/</span>
          <Link href={`/parks/${park.id}`} className="text-blue-400 hover:text-blue-300 text-sm">{park.name}</Link>
          <span className="mx-2 text-gray-500">/</span>
          <span className="text-gray-300 text-sm">{item.name}</span>
        </nav>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Left Column - Image Carousel (60% on desktop) */}
          <div className="lg:col-span-2">
            <div className="relative bg-gray-800 rounded-lg overflow-hidden">
              {/* Main Image */}
              <div className="relative w-full h-80 md:h-96">
                <img
                  src={images[currentImageIndex]}
                  alt={`${item.name} ${currentImageIndex + 1}`}
                  className="w-full h-full object-cover"
                />

                {/* Navigation Arrows */}
                {images.length > 1 && (
                  <>
                    <button
                      onClick={handlePrevImage}
                      className="absolute left-4 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-75 rounded-full p-2 transition-all"
                    >
                      <ChevronLeft className="w-6 h-6 text-white" />
                    </button>
                    <button
                      onClick={handleNextImage}
                      className="absolute right-4 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-75 rounded-full p-2 transition-all"
                    >
                      <ChevronRight className="w-6 h-6 text-white" />
                    </button>

                    {/* Image Counter */}
                    <div className="absolute bottom-4 right-4 bg-black bg-opacity-70 px-3 py-1 rounded text-sm">
                      {currentImageIndex + 1} / {images.length}
                    </div>
                  </>
                )}
              </div>

              {/* Thumbnail Strip */}
              {images.length > 1 && (
                <div className="flex gap-2 p-4 bg-gray-900 overflow-x-auto">
                  {images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`flex-shrink-0 w-16 h-16 rounded overflow-hidden border-2 transition-all ${
                        index === currentImageIndex
                          ? 'border-blue-500'
                          : 'border-gray-700 hover:border-gray-600'
                      }`}
                    >
                      <img
                        src={image}
                        alt={`Thumbnail ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Info Panel (40% on desktop) */}
          <div className="lg:col-span-1">
            <div className="bg-gray-800 rounded-lg p-6 sticky top-24">
              {/* Category Badge */}
              <div className="inline-block bg-blue-600 px-3 py-1 rounded-full text-sm font-semibold mb-4">
                {category.name}
              </div>

              {/* Item Name */}
              <h1 className="text-3xl font-bold mb-2">{item.name}</h1>

              {/* Park Info */}
              <p className="text-gray-400 mb-6">
                <span className="font-semibold text-gray-300">{park.name}</span> • {item.location_in_park}
              </p>

              {/* Description */}
              <p className="text-gray-300 mb-6 text-sm leading-relaxed">{item.description}</p>

              {/* Technical Specs */}
              {hasSpecs && (
                <div className="border-t border-gray-700 pt-6">
                  <h3 className="text-lg font-semibold mb-4">Technical Details</h3>
                  <div className="space-y-3 text-sm">
                    {specs.type && (
                      <div className="flex justify-between">
                        <span className="text-gray-400">Type</span>
                        <span className="font-semibold text-gray-200">{specs.type}</span>
                      </div>
                    )}
                    {specs.height && (
                      <div className="flex justify-between">
                        <span className="text-gray-400">Height</span>
                        <span className="font-semibold text-gray-200">{specs.height}</span>
                      </div>
                    )}
                    {specs.speed && (
                      <div className="flex justify-between">
                        <span className="text-gray-400">Max Speed</span>
                        <span className="font-semibold text-gray-200">{specs.speed}</span>
                      </div>
                    )}
                    {specs.length && (
                      <div className="flex justify-between">
                        <span className="text-gray-400">Length</span>
                        <span className="font-semibold text-gray-200">{specs.length}</span>
                      </div>
                    )}
                    {specs.drop && (
                      <div className="flex justify-between">
                        <span className="text-gray-400">Drop</span>
                        <span className="font-semibold text-gray-200">{specs.drop}</span>
                      </div>
                    )}
                    {specs.manufacturer && (
                      <div className="flex justify-between">
                        <span className="text-gray-400">Manufacturer</span>
                        <span className="font-semibold text-gray-200">{specs.manufacturer}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Score and Rating Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Score Circle */}
          <div className="flex flex-col items-center justify-center bg-gray-800 rounded-lg p-8">
            <div className="relative w-32 h-32 mb-4">
              <svg className="w-full h-full" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="45" fill="none" stroke="#374151" strokeWidth="2" />
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke="#3b82f6"
                  strokeWidth="2"
                  strokeDasharray={`${(overallScore / 100) * 282.7}`}
                  strokeDashoffset="0"
                  strokeLinecap="round"
                  style={{ transform: 'rotate(-90deg)', transformOrigin: '50% 50%' }}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-4xl font-bold text-blue-400">{overallScore}</div>
                  <div className="text-xs text-gray-400">out of 100</div>
                </div>
              </div>
            </div>
            <p className="text-gray-300 text-sm text-center">Based on community ratings</p>
          </div>

          {/* Rating Breakdown */}
          <div className="lg:col-span-2 bg-gray-800 rounded-lg p-8">
            <h3 className="text-lg font-semibold mb-6">Community Ratings</h3>
            <div className="space-y-4">
              {/* Positive */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-green-400 font-semibold">Positive</span>
                  <span className="text-gray-400 text-sm">{ratingBreakdown.positive}%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-green-500 h-full"
                    style={{ width: `${ratingBreakdown.positive}%` }}
                  ></div>
                </div>
              </div>

              {/* Mixed */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-yellow-400 font-semibold">Mixed</span>
                  <span className="text-gray-400 text-sm">{ratingBreakdown.mixed}%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-yellow-500 h-full"
                    style={{ width: `${ratingBreakdown.mixed}%` }}
                  ></div>
                </div>
              </div>

              {/* Negative */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-red-400 font-semibold">Negative</span>
                  <span className="text-gray-400 text-sm">{ratingBreakdown.negative}%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-red-500 h-full"
                    style={{ width: `${ratingBreakdown.negative}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Rating System */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold mb-6">Rate This Experience</h2>
          <RatingComponent item={item} category={category} />
        </div>

        {/* Reviews Section */}
        <div className="mb-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold">Guest Reviews</h2>
            <button className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg font-medium transition-colors">
              Write Review
            </button>
          </div>

          {/* Mock Reviews */}
          <div className="space-y-4">
            {[
              {
                author: 'Sarah M.',
                rating: 5,
                title: 'Absolutely thrilling!',
                text: 'One of the best rides I\'ve ever experienced. The speed and intensity are incredible!'
              },
              {
                author: 'John D.',
                rating: 4,
                title: 'Great but queue was long',
                text: 'The ride itself is fantastic, but I waited 90 minutes. Worth it, but plan accordingly.'
              },
              {
                author: 'Emma K.',
                rating: 5,
                title: 'Perfect for thrill seekers',
                text: 'Exceeded all my expectations. The engineering is impressive and it\'s smooth despite the intensity.'
              }
            ].map((review, idx) => (
              <div key={idx} className="bg-gray-800 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-gray-200">{review.author}</span>
                  <div className="flex gap-1">
                    {Array(review.rating)
                      .fill(0)
                      .map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      ))}
                  </div>
                </div>
                <p className="text-sm font-medium text-gray-300 mb-1">{review.title}</p>
                <p className="text-sm text-gray-400">{review.text}</p>
              </div>
            ))}
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