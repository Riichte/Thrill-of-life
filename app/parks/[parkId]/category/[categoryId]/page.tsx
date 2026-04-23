import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { getParkById, getCategoryById, getItemsByCategory } from '@/lib/queries'

interface CategoryPageProps {
  params: Promise<{
    parkId: string
    categoryId: string
  }>
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { parkId, categoryId } = await params

  const park = await getParkById(parkId)
  const category = await getCategoryById(categoryId)
  const items = await getItemsByCategory(parkId, categoryId)

  if (!park || !category) notFound()

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0e27] to-[#1a1f3a]">
      {/* Breadcrumb */}
      <div className="border-b border-white/10 bg-[#0e1621]/50 backdrop-blur-sm sticky top-16 z-40">
        <div className="container mx-auto px-4 py-4">
          <nav className="flex items-center gap-2 text-sm">
            <Link href="/parks" className="text-[#66c0f4] hover:text-white transition">Parks</Link>
            <span className="text-white/40">/</span>
            <Link href={`/parks/${parkId}`} className="text-[#66c0f4] hover:text-white transition">{park.name}</Link>
            <span className="text-white/40">/</span>
            <span className="text-white">{category.name}</span>
          </nav>
        </div>
      </div>

      {/* Header */}
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">{category.name}</h1>
        <p className="text-lg text-zinc-400">{items.length} {items.length === 1 ? 'item' : 'items'} in {park.name}</p>
      </div>

      {/* Items Grid */}
      {items.length > 0 ? (
        <div className="container mx-auto px-4 pb-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((item) => (
              <Link
                key={item.id}
                href={`/parks/${parkId}/${categoryId}/${item.id}`}
                className="group"
              >
                <div className="bg-[#1b2838] border border-[#2a475e] rounded-lg overflow-hidden hover:border-[#66c0f4] transition-all duration-300 hover:-translate-y-1 h-full flex flex-col">
                  {/* Image */}
                  <div className="relative w-full aspect-[16/9] bg-black overflow-hidden">
                    {item.item_images?.[0]?.url ? (
                      <>
                        <Image
                          src={item.item_images[0].url}
                          alt={item.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                          quality={75}
                          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        />
                        {item.item_images[0].attribution_author && (
                          <div className="absolute bottom-0 left-0 right-0 bg-black/60 px-2 py-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                            <p className="text-[10px] text-white/70 truncate">📷 {item.item_images[0].attribution_author}</p>
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#2a475e] to-[#1a2332]">
                        <span className="text-[#8f98a0]">No image</span>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-5 flex flex-col flex-grow">
                    <h3 className="text-lg font-semibold text-white group-hover:text-[#66c0f4] transition-colors mb-2">
                      {item.name}
                    </h3>

                    {item.description && (
                      <p className="text-sm text-zinc-400 line-clamp-2 mb-3">
                        {item.description}
                      </p>
                    )}

                    {/* Type badge if available */}
                    {item.specs?.type && (
                      <div className="mt-auto">
                        <span className="inline-block text-xs px-2.5 py-1 rounded bg-[#66c0f4]/10 text-[#66c0f4] border border-[#66c0f4]/20">
                          {item.specs.type}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      ) : (
        <div className="container mx-auto px-4 py-16 text-center">
          <p className="text-zinc-400 text-lg">No items found in this category.</p>
          <Link href={`/parks/${parkId}`} className="mt-4 inline-block text-[#66c0f4] hover:text-white transition">
            ← Back to {park.name}
          </Link>
        </div>
      )}
    </div>
  )
}