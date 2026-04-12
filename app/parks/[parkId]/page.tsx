import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getParkById, getItemsByPark, getAllCategories } from '@/lib/queries'

// Category background images
const categoryBackgroundImages: Record<string, string> = {
  'rides': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400',
  'restaurants': 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400',
  'shows': 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=400',
  'hotels': 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400',
  'shops': 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400'
}

export default async function ParkPage({
  params
}: {
  params: Promise<{ parkId: string }>
}) {
  const { parkId } = await params
  const park = getParkById(parkId)
  const items = getItemsByPark(parkId)

  if (!park) {
    notFound()
  }

  // Group items by category
  const allCategories = getAllCategories()
  const itemsByCategory = items.reduce((acc, item) => {
    const category = allCategories.find(c => c.id === item.category_id)
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

        {/* Categories Grid */}
        <div className="mb-12">
          <h2 className="text-3xl font-semibold mb-8">Explore by Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {allCategories.map(category => {
              const categoryItems = items.filter(item => item.category_id === category.id)
              const imageUrl = categoryBackgroundImages[category.id]
              
              return (
                <Link
                  key={category.id}
                  href={`/parks/${park.id}/category/${category.id}`}
                  className="group relative h-64 rounded-lg overflow-hidden"
                >
                  <img
                    src={imageUrl}
                    alt={category.name}
                    className="w-full h-full object-cover group-hover:brightness-110 transition-all duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-70 group-hover:opacity-75 transition-opacity"></div>
                  <div className="absolute inset-0 flex items-end justify-center pb-4">
                    <div className="text-center">
                      <h3 className="text-lg font-bold text-white">{category.name}</h3>
                      <p className="text-gray-200 text-sm">{categoryItems.length} items</p>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>

        {/* Empty state */}
        {items.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400">No items found for this park.</p>
          </div>
        )}
      </div>
    </div>
  )
}