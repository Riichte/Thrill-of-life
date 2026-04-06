import Link from 'next/link'
import { notFound } from 'next/navigation'

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
      location_in_park: 'Discoveryland'
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
      location_in_park: 'The Wizarding World of Harry Potter'
    },
    {
      id: 'hogwarts-express',
      category_id: 'restaurants',
      name: 'The Three Broomsticks',
      description: 'Authentic British pub fare in Hogsmeade. Enjoy shepherd\'s pie, fish and chips, and butterbeer in a magical setting.',
      location_in_park: 'The Wizarding World of Harry Potter'
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
  ]
}

interface ItemPageProps {
  params: {
    parkId: string
    itemId: string
  }
}

export default function ItemPage({ params }: ItemPageProps) {
  const park = mockParks.find(p => p.id === params.parkId)
  const items = mockItems[params.parkId as keyof typeof mockItems] || []
  const item = items.find(i => i.id === params.itemId)
  const category = mockCategories.find(c => c.id === item?.category_id)
  const images = mockItemImages[params.itemId as keyof typeof mockItemImages] || []
  const videos = mockItemVideos[params.itemId as keyof typeof mockItemVideos] || []

  if (!park || !item || !category) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="mb-6">
          <Link href="/parks" className="text-blue-400 hover:text-blue-300">Parks</Link>
          <span className="mx-2 text-gray-500">/</span>
          <Link href={`/parks/${park.id}`} className="text-blue-400 hover:text-blue-300">{park.name}</Link>
          <span className="mx-2 text-gray-500">/</span>
          <span className="text-gray-300">{item.name}</span>
        </nav>

        {/* Item Header */}
        <div className="bg-gray-800 p-6 rounded-lg mb-8">
          <div className="flex items-center mb-4">
            <img
              src={park.logo_url}
              alt={`${park.name} logo`}
              className="w-12 h-12 rounded mr-4"
            />
            <div>
              <h1 className="text-3xl font-bold">{item.name}</h1>
              <p className="text-gray-300">{category.name} • {park.name}</p>
            </div>
          </div>
          <p className="text-gray-300 mb-4">{item.description}</p>
          <div className="bg-blue-600 px-3 py-1 rounded text-sm inline-block">
            Location: {item.location_in_park}
          </div>
        </div>

        {/* Images */}
        {images.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Photos</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {images.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`${item.name} photo ${index + 1}`}
                  className="w-full h-48 object-cover rounded-lg"
                />
              ))}
            </div>
          </div>
        )}

        {/* Videos */}
        {videos.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Videos</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {videos.map((video, index) => (
                <div key={index} className="aspect-video">
                  <iframe
                    src={video}
                    title={`${item.name} video ${index + 1}`}
                    className="w-full h-full rounded-lg"
                    allowFullScreen
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Back to Park */}
        <div className="text-center">
          <Link
            href={`/parks/${park.id}`}
            className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            Back to {park.name}
          </Link>
        </div>
      </div>
    </div>
  )
}