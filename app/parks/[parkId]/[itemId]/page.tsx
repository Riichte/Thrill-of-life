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
  ],
  'six-flags-magic-mountain': [
    {
      id: 'goliath-ride',
      category_id: 'rides',
      name: 'Goliath',
      description: 'One of the tallest, fastest roller coasters in the world. Experience weightlessness and breathtaking drops on this legendary coaster.',
      location_in_park: 'Colossus County Fair'
    },
    {
      id: 'revolution-ride',
      category_id: 'rides',
      name: 'Revolution',
      description: 'The world\'s first modern roller coaster loop. A historic and thrilling experience since 1976.',
      location_in_park: 'Frontier Town'
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
      location_in_park: 'The Smiler Area'
    },
    {
      id: 'nemesis-ride',
      category_id: 'rides',
      name: 'Nemesis',
      description: 'An iconic inverted roller coaster that has thrilled guests for decades.',
      location_in_park: 'X-Sector'
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
      location_in_park: 'Far West'
    },
    {
      id: 'furius-baco-ride',
      category_id: 'rides',
      name: 'Furius Baco',
      description: 'A high-speed roller coaster that launches you at incredible velocity.',
      location_in_park: 'Mediterranean'
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