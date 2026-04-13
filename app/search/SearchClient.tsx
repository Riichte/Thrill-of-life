'use client'

import Link from 'next/link'

interface Park {
  id: string
  name: string
  description: string
  country: string
  cover_image_url: string
  logo_url: string
}

interface Item {
  id: string
  name: string
  description: string
  category_id: string
  park_id: string
  item_images: { url: string }[]
}

interface SearchResults {
  parks: Park[]
  items: Item[]
}

export default function SearchClient({ query, results }: { query: string; results: SearchResults }) {
  const { parks, items } = results
  const total = parks.length + items.length

  // Group items by category
  const itemsByCategory = items.reduce((acc, item) => {
    const cat = item.category_id
    if (!acc[cat]) acc[cat] = []
    acc[cat].push(item)
    return acc
  }, {} as Record<string, Item[]>)

  const categoryLabels: Record<string, string> = {
    roller_coasters: 'Roller Coasters',
    flat_rides: 'Flat Rides',
    dark_rides: 'Dark Rides',
    water_rides: 'Water Rides',
    restaurants: 'Restaurants',
    hotels: 'Hotels',
    shops: 'Shops',
    shows: 'Shows',
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#c6d4df] mb-1">
            Search results for <span className="text-[#66c0f4]">"{query}"</span>
          </h1>
          <p className="text-[#8f98a0] text-sm">{total} result{total !== 1 ? 's' : ''} found</p>
        </div>

        {total === 0 && (
          <div className="text-center py-16">
            <p className="text-[#8f98a0] text-lg">No results found for "{query}"</p>
            <p className="text-[#4a6a82] text-sm mt-2">Try a different search term</p>
          </div>
        )}

        {/* Parks */}
        {parks.length > 0 && (
          <div className="mb-10">
            <h2 className="text-lg font-semibold text-[#8f98a0] uppercase tracking-wider mb-4 border-b border-[#2a475e] pb-2">
              Parks ({parks.length})
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {parks.map(park => (
                <Link
                  key={park.id}
                  href={`/parks/${park.id}`}
                  className="flex gap-4 items-center bg-[#1b2838] border border-[#2a475e] rounded-sm p-4 hover:border-[#66c0f4] transition-colors group"
                >
                  {park.cover_image_url && (
                    <img
                      src={park.cover_image_url}
                      alt={park.name}
                      className="w-20 h-14 object-cover rounded-sm flex-shrink-0"
                    />
                  )}
                  <div className="min-w-0">
                    <p className="font-semibold text-[#c6d4df] group-hover:text-[#66c0f4] transition-colors">{park.name}</p>
                    <p className="text-xs text-[#8f98a0] mt-0.5">{park.country}</p>
                    {park.description && (
                      <p className="text-xs text-[#acb2b8] mt-1 line-clamp-2">{park.description}</p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Items by category */}
        {Object.entries(itemsByCategory).map(([categoryId, categoryItems]) => (
          <div key={categoryId} className="mb-10">
            <h2 className="text-lg font-semibold text-[#8f98a0] uppercase tracking-wider mb-4 border-b border-[#2a475e] pb-2">
              {categoryLabels[categoryId] ?? categoryId} ({categoryItems.length})
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {categoryItems.map(item => {
                const image = item.item_images?.[0]?.url
                return (
                  <Link
                    key={item.id}
                    href={`/parks/${item.park_id}/${item.category_id}/${item.id}`}
                    className="flex gap-4 items-center bg-[#1b2838] border border-[#2a475e] rounded-sm p-4 hover:border-[#66c0f4] transition-colors group"
                  >
                    {image && (
                      <img
                        src={image}
                        alt={item.name}
                        className="w-20 h-14 object-cover rounded-sm flex-shrink-0"
                      />
                    )}
                    <div className="min-w-0">
                      <p className="font-semibold text-[#c6d4df] group-hover:text-[#66c0f4] transition-colors">{item.name}</p>
                      <p className="text-xs text-[#8f98a0] mt-0.5 capitalize">{categoryLabels[categoryId] ?? categoryId}</p>
                      {item.description && (
                        <p className="text-xs text-[#acb2b8] mt-1 line-clamp-2">{item.description}</p>
                      )}
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}