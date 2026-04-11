import Link from 'next/link'
import { notFound } from 'next/navigation'
import { mockCategories, mockItems } from '@/lib/items-data'
import { parksData } from '@/lib/parks-data'



/**
 * Hero / “main” image per Europa attraction: prefers Main.jpg / main.jpg where used in the repo,
 * otherwise the primary gallery image for that ride.
 */
const EUROPA_ITEM_MAIN_IMAGE: Record<string, string> = {
  'wodan': '/parks/europa-park/roller-coasters/wodan/main.jpg',
  'euromir': '/parks/europa-park/roller-coasters/euromir/main.jpg',
  'blue-fire': '/parks/europa-park/roller-coasters/blue-fire/main.jpg',
  'silver-star': '/parks/europa-park/roller-coasters/silver-star/main.jpg',
  'matterhorn-blitz': '/parks/europa-park/roller-coasters/matterhorn-blitz/main.jpg',
  'pegasus': '/parks/europa-park/roller-coasters/pegasus/main.jpg',
  'poseidon': '/parks/europa-park/roller-coasters/poseidon/main.jpg',
  'eurosat': '/parks/europa-park/roller-coasters/eurosat/main.jpg',
  'atlantica-super-splash': '/parks/europa-park/roller-coasters/atlantica-super-splash/main.jpg',
  'bobsleigh': '/parks/europa-park/roller-coasters/bobsleigh/main.jpg',
  'alpenexpress': '/parks/europa-park/roller-coasters/alpenexpress/main.jpg',
  'arthur': '/parks/europa-park/roller-coasters/arthur/main.jpg',
  'tiroler-wildwasserbahn': '/parks/europa-park/water-rides/tiroler wildwasserbahn/main.jpg',
  'fjord-rafting': '/parks/europa-park/water-rides/fjord rafting/main.jpg',
  'dschungel-flossfahrt': '/parks/europa-park/dark-rides/dschungel-flossfahrt/main.jpg',
  'vindjammer': '/parks/europa-park/flat-rides/vindjammer/main.jpg',
  'kronasar': '/parks/europa-park/hotels/kronasar/main.jpg',
  'monorail-bahn': '/parks/europa-park/transport/monorail bahn/main.jpg'
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
  const park = parksData.find(p => p.id === parkId)
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
