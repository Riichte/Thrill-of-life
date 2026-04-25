import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'

export default async function ManufacturerRidesPage({ params }: { params: Promise<{ manufacturerSlug: string }> }) {
  const { manufacturerSlug } = await params
  const supabase = await createClient()

  const { data: items } = await supabase
    .from('items')
    .select('*, item_images(url), parks(name)')

  const allManufacturers = [...new Set((items ?? []).map(i => i.specs?.manufacturer).filter(Boolean))]
  const manufacturerName = allManufacturers.find(
    m => m.toLowerCase().replace(/\s+/g, '-') === manufacturerSlug
  )
  if (!manufacturerName) notFound()

  const rides = (items ?? [])
    .filter(i => i.specs?.manufacturer === manufacturerName)
    .sort((a, b) => a.name.localeCompare(b.name))

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-8">
        <nav className="mb-6">
          <Link href="/manufacturers" className="text-blue-400 hover:text-blue-300 text-sm">Manufacturers</Link>
          <span className="mx-2 text-gray-500">/</span>
          <Link href={`/manufacturers/${manufacturerSlug}`} className="text-blue-400 hover:text-blue-300 text-sm">{manufacturerName}</Link>
          <span className="mx-2 text-gray-500">/</span>
          <span className="text-gray-300 text-sm">All Rides</span>
        </nav>

        <h1 className="text-4xl font-bold mb-2">All {manufacturerName} Rides</h1>
        <p className="text-[#8f98a0] mb-8">{rides.length} rides found</p>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {rides.map(item => {
            const image = (item.item_images as any)?.[0]?.url
            return (
              <Link key={item.id} href={`/parks/${item.park_id}/${item.category_id}/${item.id}`}
                className="group bg-[#1b2838] border border-[#2a475e] rounded-sm overflow-hidden hover:border-[#66c0f4] transition-colors">
                <div className="aspect-square overflow-hidden bg-[#0e1621]">
                  {image ? (
                    <img src={image} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[#4a6a82] text-xs">No image</div>
                  )}
                </div>
                <div className="p-3">
                  <p className="text-sm font-semibold text-[#c6d4df] group-hover:text-[#66c0f4] transition-colors truncate">{item.name}</p>
                  <p className="text-xs text-[#8f98a0] mt-0.5 truncate">{(item.parks as any)?.name ?? ''}</p>
                  {item.specs?.type && <p className="text-xs text-[#4a6a82] mt-0.5 truncate">{item.specs.type}</p>}
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}