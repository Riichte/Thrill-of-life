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
  },
  {
    id: 'europa-park',
    name: 'Europa Park',
    description: 'Europe\'s second most popular theme park resort with thrilling rides, shows, and European-themed areas.',
    logo_url: '/Parks/Europa Park/Logo.png',
    cover_image_url: '/Parks/Europa Park/Main.jpg',
    country: 'Germany',
    region: 'Europe',
    company: 'Europa Park',
    park_type: 'Theme Park',
    location: 'Rust, Germany'
  }
]

const mockCategories = [
  { id: 'rides', name: 'Rides' },
  { id: 'roller-coasters', name: 'Roller Coasters' },
  { id: 'dark-rides', name: 'Dark Rides' },
  { id: 'flat-rides', name: 'Flat Rides' },
  { id: 'water-rides', name: 'Water Rides' },
  { id: 'transport', name: 'Transport' },
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
  ],
  'europa-park': [
    { id: 'wodan', category_id: 'roller-coasters', name: 'Wodan', description: 'A thrilling wooden roller coaster with breathtaking drops and high speeds.', location_in_park: 'Iceland' },
    { id: 'euromir', category_id: 'roller-coasters', name: 'Euromir', description: 'A looping coaster themed as a journey into space.', location_in_park: 'France' },
    { id: 'blue-fire', category_id: 'roller-coasters', name: 'Blue Fire', description: 'A launched coaster with inversions and smooth transitions.', location_in_park: 'Iceland' },
    { id: 'silver-star', category_id: 'roller-coasters', name: 'Silver Star', description: 'A towering B&M hypercoaster with massive drops.', location_in_park: 'France' },
    { id: 'matterhorn-blitz', category_id: 'roller-coasters', name: 'Matterhorn Blitz', description: 'A wild bobsled coaster through alpine scenery.', location_in_park: 'Switzerland' },
    { id: 'pegasus', category_id: 'roller-coasters', name: 'Pegasus', description: 'A family-friendly coaster for younger riders.', location_in_park: 'Greece' },
    { id: 'poseidon', category_id: 'roller-coasters', name: 'Poseidon', description: 'A water coaster blending coaster thrills with a splash finale.', location_in_park: 'Greece' },
    { id: 'eurosat', category_id: 'roller-coasters', name: 'Eurosat', description: 'An indoor coaster through a futuristic space station.', location_in_park: 'France' },
    { id: 'atlantica-super-splash', category_id: 'roller-coasters', name: 'Atlantica Super Splash', description: 'A water coaster with a steep drop into the splash zone.', location_in_park: 'Portugal' },
    { id: 'bobsleigh', category_id: 'roller-coasters', name: 'Bobsleigh', description: 'A bobsled-style coaster with tight twists.', location_in_park: 'Switzerland' },
    { id: 'alpenexpress', category_id: 'roller-coasters', name: 'Alpenexpress', description: 'A mine train coaster through the Alpine landscape.', location_in_park: 'Austria' },
    { id: 'arthur', category_id: 'roller-coasters', name: 'Arthur', description: 'A family inverted dark ride coaster experience.', location_in_park: 'Kingdom of the Minimoys' },
    { id: 'tiroler-wildwasserbahn', category_id: 'water-rides', name: 'Tiroler Wildwasserbahn', description: 'A classic log flume with alpine theming.', location_in_park: 'Austria' },
    { id: 'fjord-rafting', category_id: 'water-rides', name: 'Fjord Rafting', description: 'River rapids through Norwegian fjord scenery.', location_in_park: 'Scandinavia' },
    { id: 'dschungel-flossfahrt', category_id: 'dark-rides', name: 'Dschungel-Floßfahrt', description: 'A gentle jungle boat voyage with surprises along the way.', location_in_park: 'Adventureland' },
    { id: 'vindjammer', category_id: 'flat-rides', name: 'Vindjammer', description: 'A swinging ship ride with sweeping views.', location_in_park: 'Scandinavia' },
    { id: 'kronasar', category_id: 'hotels', name: 'Hotel Kronasar', description: 'A luxury hotel with Scandinavian theming.', location_in_park: 'Resort' },
    { id: 'monorail-bahn', category_id: 'transport', name: 'Monorail Bahn', description: 'Park monorail connecting themed areas.', location_in_park: 'Parkwide' }
  ]
}

/**
 * Hero / “main” image per Europa attraction: prefers Main.jpg / main.jpg where used in the repo,
 * otherwise the primary gallery image for that ride.
 */
const EUROPA_ITEM_MAIN_IMAGE: Record<string, string> = {
  wodan: '/Parks/Europa Park/Roller Coasters/Wodan/Main.jpg',
  euromir: '/Parks/Europa Park/Roller Coasters/Euromir/Main.jpg',
  'blue-fire': '/Parks/Europa Park/Roller Coasters/Blue Fire/Main.jpg',
  'silver-star': '/Parks/Europa Park/Roller Coasters/Silver Star/main.jpg',
  'matterhorn-blitz': '/Parks/Europa Park/Roller Coasters/Matterhorn Blitz/Main.jpg',
  pegasus: '/Parks/Europa Park/Roller Coasters/Pegasus/Main.jpg',
  poseidon: '/Parks/Europa Park/Roller Coasters/Poseidon/Main.jpg',
  eurosat: '/Parks/Europa Park/Roller Coasters/Eurosat/Main.jpg',
  'atlantica-super-splash': '/Parks/Europa Park/Roller Coasters/Atlantica Super Splash/main.jpg',
  bobsleigh: '/Parks/Europa Park/Roller Coasters/Bobsleigh/main.jpg',
  alpenexpress: '/Parks/Europa Park/Roller Coasters/AlpenExpress/Main.jpg',
  arthur: '/Parks/Europa Park/Roller Coasters/Arthur/Main.jpg',
  'tiroler-wildwasserbahn': '/Parks/Europa Park/Water Rides/Tiroler Wildwasserbahn/Main.jpg',
  'fjord-rafting': '/Parks/Europa Park/Water Rides/Fjord Rafting/Main.jpg',
  'dschungel-flossfahrt': '/Parks/Europa Park/Dark Rides/Dschungel-Floßfahrt/main.jpg',
  vindjammer: '/Parks/Europa Park/Flat Rides/Vindjammer/Main.jpg',
  kronasar: '/Parks/Europa Park/Hotels/Kronasar/Main.jpg',
  'monorail-bahn': '/Parks/Europa Park/Transport/Monorail Bahn/main.jpg'
}

/** First / main image for non-Europa items (aligned with detail page galleries). */
const ITEM_MAIN_THUMB: Partial<Record<string, string>> = {
  'space-mountain': 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=600&h=600&fit=crop&crop=center',
  'ratatouille-restaurant': 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=600&fit=crop&crop=center',
  'disney-stars-on-parade': 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&h=600&fit=crop&crop=center',
  'harry-potter-ride': 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=600&h=600&fit=crop&crop=center',
  'hogwarts-express': 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=600&fit=crop&crop=center',
  'goliath-ride': 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=600&h=600&fit=crop&crop=center',
  'revolution-ride': 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&h=600&fit=crop&crop=center',
  'magic-mountain-grill': 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=600&fit=crop&crop=center',
  'smiler-ride': 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=600&h=600&fit=crop&crop=center',
  'nemesis-ride': 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&h=600&fit=crop&crop=center',
  'alton-towers-hotel': 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=600&fit=crop&crop=center',
  'shambhala-ride': 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=600&h=600&fit=crop&crop=center',
  'furius-baco-ride': 'https://images.unsplash.com/photo-1551632436-cbf8dd35adfa?w=600&h=600&fit=crop&crop=center',
  'ferrari-land': 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=600&fit=crop&crop=center'
}

function categoryItemThumbnail(parkId: string, itemId: string, coverFallback: string): string {
  if (parkId === 'europa-park') {
    return EUROPA_ITEM_MAIN_IMAGE[itemId] ?? coverFallback
  }
  return ITEM_MAIN_THUMB[itemId] ?? coverFallback
}

export default async function CategoryPage({
  params
}: {
  params: Promise<{ parkId: string; categoryId: string }>
}) {
  const { parkId, categoryId } = await params
  const park = mockParks.find(p => p.id === parkId)
  const category = mockCategories.find(c => c.id === categoryId)
  const parkItems = mockItems[parkId as keyof typeof mockItems] || []
  const categoryItems = parkItems.filter(item => item.category_id === categoryId)

  if (!park || !category) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-4">
            <Link
              href={`/parks/${park.id}`}
              className="inline-flex items-center px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
            >
              ← Back to {park.name}
            </Link>
          </div>
          <h1 className="text-4xl font-bold mb-2">{category.name}</h1>
          <p className="text-gray-300">{park.name}</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {categoryItems.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {categoryItems.map((item) => {
              const thumb = categoryItemThumbnail(parkId, item.id, park.cover_image_url)
              return (
                <Link
                  key={item.id}
                  href={`/parks/${park.id}/${item.id}`}
                  className="group block outline-none focus-visible:ring-2 focus-visible:ring-[#66c0f4] focus-visible:ring-offset-2 focus-visible:ring-offset-gray-900"
                >
                  <div className="flex h-full flex-col overflow-hidden rounded-2xl bg-gray-800 shadow-lg ring-1 ring-white/10 transition hover:bg-[#2a3340] hover:ring-white/20">
                    <div className="aspect-square w-full shrink-0 overflow-hidden bg-[#0e1621]">
                      <img
                        src={thumb}
                        alt={item.name}
                        className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.03]"
                      />
                    </div>
                    <div className="flex flex-1 flex-col p-4">
                      <h2 className="line-clamp-2 text-lg font-semibold leading-snug text-white">
                        {item.name}
                      </h2>
                      <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-gray-400">
                        {item.description}
                      </p>
                      <div className="mt-auto flex items-center justify-between gap-2 border-t border-white/10 pt-3 text-sm">
                        <span className="min-w-0 truncate text-[#66c0f4]">{item.location_in_park}</span>
                        <span className="shrink-0 text-gray-500" aria-hidden>
                          →
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-gray-400 text-lg">No items found in {category.name} for {park.name}.</p>
          </div>
        )}
      </div>
    </div>
  )
}
