import Link from 'next/link'
import { notFound } from 'next/navigation'

// Mock data - same as parks list page
const mockParks = [
  {
    id: 'disneyland-paris',
    name: 'Disneyland Paris',
    description: 'The most magical place on Earth in Europe, featuring two theme parks, seven Disney hotels, and a shopping and entertainment district.',
    logo_url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=200&h=200&fit=crop&crop=center',
    cover_image_url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=1200&h=400&fit=crop&crop=center',
    country: 'France',
    region: 'Europe',
    company: 'Disney',
    park_type: 'Theme Park',
    location: 'Marne-la-Vallée, France'
  },
  {
    id: 'universal-florida',
    name: 'Universal Studios Florida',
    description: 'Experience the magic of movies at Universal Orlando Resort, featuring thrilling rides, shows, and character meet-and-greets.',
    logo_url: 'https://images.unsplash.com/photo-1551632436-cbf8dd35adfa?w=200&h=200&fit=crop&crop=center',
    cover_image_url: 'https://images.unsplash.com/photo-1551632436-cbf8dd35adfa?w=1200&h=400&fit=crop&crop=center',
    country: 'United States',
    region: 'North America',
    company: 'Universal',
    park_type: 'Theme Park',
    location: 'Orlando, Florida, USA'
  },
  {
    id: 'six-flags-magic-mountain',
    name: 'Six Flags Magic Mountain',
    description: 'California\'s premier theme park featuring over 100 rides and attractions, including the world\'s tallest roller coaster.',
    logo_url: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=200&h=200&fit=crop&crop=center',
    cover_image_url: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=1200&h=400&fit=crop&crop=center',
    country: 'United States',
    region: 'North America',
    company: 'Six Flags',
    park_type: 'Theme Park',
    location: 'Valencia, California, USA'
  },
  {
    id: 'alton-towers',
    name: 'Alton Towers',
    description: 'Britain\'s most visited theme park with over 40 rides and attractions, plus a water park and hotel resort.',
    logo_url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=200&h=200&fit=crop&crop=center',
    cover_image_url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=400&fit=crop&crop=center',
    country: 'United Kingdom',
    region: 'Europe',
    company: 'Alton Towers',
    park_type: 'Theme Park',
    location: 'Alton, Staffordshire, UK'
  },
  {
    id: 'port-adventure',
    name: 'PortAventura World',
    description: 'Spain\'s largest theme park resort featuring Mediterranean-themed areas, thrilling rides, and a Ferrari Land.',
    logo_url: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=200&h=200&fit=crop&crop=center',
    cover_image_url: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=1200&h=400&fit=crop&crop=center',
    country: 'Spain',
    region: 'Europe',
    company: 'PortAventura',
    park_type: 'Theme Park',
    location: 'Salou, Catalonia, Spain'
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
      description: 'A thrilling indoor roller coaster through the darkness of space.',
      location_in_park: 'Discoveryland'
    },
    {
      id: 'ratatouille-restaurant',
      category_id: 'restaurants',
      name: 'Bistrot Chez Rémy',
      description: 'Experience fine French dining inspired by Ratatouille.',
      location_in_park: 'Main Street, U.S.A.'
    },
    {
      id: 'disney-stars-on-parade',
      category_id: 'shows',
      name: 'Disney Stars on Parade',
      description: 'A spectacular parade featuring Disney characters.',
      location_in_park: 'Main Street, U.S.A.'
    },
    {
      id: 'disneyland-hotel',
      category_id: 'hotels',
      name: 'Disneyland Hotel',
      description: 'Luxury hotel with views of Sleeping Beauty Castle.',
      location_in_park: 'Hotel Area'
    },
    {
      id: 'emporium',
      category_id: 'shops',
      name: 'Emporium',
      description: 'Disney merchandise and souvenirs.',
      location_in_park: 'Main Street, U.S.A.'
    }
  ],
  'universal-florida': [
    {
      id: 'harry-potter-ride',
      category_id: 'rides',
      name: 'Harry Potter and the Forbidden Journey',
      description: 'An immersive ride through the Wizarding World of Harry Potter.',
      location_in_park: 'The Wizarding World of Harry Potter'
    },
    {
      id: 'hogwarts-express',
      category_id: 'restaurants',
      name: 'The Three Broomsticks',
      description: 'Authentic British pub fare in Hogsmeade.',
      location_in_park: 'The Wizarding World of Harry Potter'
    },
    {
      id: 'universal-superstar-parade',
      category_id: 'shows',
      name: 'Universal Superstar Parade',
      description: 'A parade featuring Universal characters.',
      location_in_park: 'Main Street'
    },
    {
      id: 'universal-orlando-resort',
      category_id: 'hotels',
      name: 'Universal Orlando Resort Hotels',
      description: 'Themed hotels with Universal experiences.',
      location_in_park: 'Resort Area'
    },
    {
      id: 'universal-studios-store',
      category_id: 'shops',
      name: 'Universal Studios Store',
      description: 'Official Universal merchandise.',
      location_in_park: 'Main Street'
    }
  ],
  'six-flags-magic-mountain': [
    {
      id: 'goliath-ride',
      category_id: 'rides',
      name: 'Goliath',
      description: 'One of the tallest, fastest roller coasters in the world.',
      location_in_park: 'Colossus County Fair'
    },
    {
      id: 'revolution-ride',
      category_id: 'rides',
      name: 'Revolution',
      description: 'The world\'s first modern roller coaster loop.',
      location_in_park: 'Frontier Town'
    },
    {
      id: 'magic-mountain-grill',
      category_id: 'restaurants',
      name: 'Magic Mountain Grill',
      description: 'Premium dining with park views.',
      location_in_park: 'Main Plaza'
    },
    {
      id: 'magic-mountain-circus',
      category_id: 'shows',
      name: 'Circus Spectacular',
      description: 'Acrobatic performances and entertainment.',
      location_in_park: 'Colossus County Fair'
    }
  ],
  'alton-towers': [
    {
      id: 'smiler-ride',
      category_id: 'rides',
      name: 'The Smiler',
      description: 'The world\'s most looped roller coaster with 14 inversions.',
      location_in_park: 'The Smiler Area'
    },
    {
      id: 'nemesis-ride',
      category_id: 'rides',
      name: 'Nemesis',
      description: 'An iconic inverted roller coaster.',
      location_in_park: 'X-Sector'
    },
    {
      id: 'alton-towers-hotel',
      category_id: 'hotels',
      name: 'Alton Towers Hotel',
      description: 'Stay overnight in the heart of the park.',
      location_in_park: 'Hotel Area'
    },
    {
      id: 'woodland-restaurant',
      category_id: 'restaurants',
      name: 'Woodland Restaurant',
      description: 'Casual dining surrounded by nature.',
      location_in_park: 'Woodland Path'
    }
  ],
  'port-adventure': [
    {
      id: 'shambhala-ride',
      category_id: 'rides',
      name: 'Shambhala',
      description: 'Europe\'s highest and steepest hypercoaster.',
      location_in_park: 'Far West'
    },
    {
      id: 'furius-baco-ride',
      category_id: 'rides',
      name: 'Furius Baco',
      description: 'A high-speed roller coaster experience.',
      location_in_park: 'Mediterranean'
    },
    {
      id: 'ferrari-land',
      category_id: 'shops',
      name: 'Ferrari Land Shop',
      description: 'Exclusive Ferrari merchandise and memorabilia.',
      location_in_park: 'Ferrari Land'
    },
    {
      id: 'mediterranean-restaurant',
      category_id: 'restaurants',
      name: 'Mediterranean Grill',
      description: 'Authentic Mediterranean cuisine.',
      location_in_park: 'Mediterranean Area'
    }
  ]
}

export default async function ParkPage({
  params
}: {
  params: Promise<{ parkId: string }>
}) {
  const { parkId } = await params
  const park = mockParks.find(p => p.id === parkId)
  const items = mockItems[parkId as keyof typeof mockItems] || []

  if (!park) {
    notFound()
  }

  // Group items by category
  const itemsByCategory = items.reduce((acc, item) => {
    const category = mockCategories.find(c => c.id === item.category_id)
    if (category) {
      if (!acc[category.name]) {
        acc[category.name] = []
      }
      acc[category.name].push(item)
    }
    return acc
  }, {} as Record<string, typeof items>)

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Hero Section */}
      <div className="relative">
        <img
          src={park.cover_image_url}
          alt={park.name}
          className="w-full h-64 md:h-96 object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center">
          <div className="container mx-auto px-4">
            <div className="flex items-center mb-4 gap-4 flex-wrap">
              <img
                src={park.logo_url}
                alt={`${park.name} logo`}
                className="w-16 h-16 rounded"
              />
              <div>
                <h1 className="text-4xl font-bold">{park.name}</h1>
                <p className="text-xl text-gray-300">{park.location}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <div className="mb-6">
          <Link
            href="/parks"
            className="inline-flex items-center px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
          >
            ← Back to Parks
          </Link>
        </div>

        {/* Park Info */}
        <div className="bg-gray-800 p-6 rounded-lg mb-8">
          <h2 className="text-2xl font-semibold mb-4">About</h2>
          <p className="text-gray-300 mb-4">{park.description}</p>
          <div className="flex flex-wrap gap-4">
            <div className="bg-blue-600 px-3 py-1 rounded text-sm">
              <strong>Country:</strong> {park.country}
            </div>
            <div className="bg-green-600 px-3 py-1 rounded text-sm">
              <strong>Company:</strong> {park.company}
            </div>
            <div className="bg-purple-600 px-3 py-1 rounded text-sm">
              <strong>Type:</strong> {park.park_type}
            </div>
          </div>
        </div>

        {/* Categories and Items */}
        {Object.entries(itemsByCategory).map(([categoryName, categoryItems]) => (
          <div key={categoryName} className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">{categoryName}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {categoryItems.map(item => (
                <Link key={item.id} href={`/parks/${park.id}/${item.id}`}>
                  <div className="bg-gray-800 p-4 rounded-lg hover:bg-gray-700 transition-colors">
                    <h3 className="text-lg font-semibold mb-2">{item.name}</h3>
                    <p className="text-gray-300 text-sm mb-2">{item.description}</p>
                    <p className="text-blue-400 text-sm">{item.location_in_park}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ))}

        {Object.keys(itemsByCategory).length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400">No items found for this park.</p>
          </div>
        )}
      </div>
    </div>
  )
}