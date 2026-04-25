'use client'

import Link from 'next/link'
import { useState } from 'react'

type Manufacturer = { name: string; slug: string; count: number; image: string | null }

export default function ManufacturersClient({ manufacturers }: { manufacturers: Manufacturer[] }) {
  const [search, setSearch] = useState('')
  const filtered = manufacturers.filter(m => m.name.toLowerCase().includes(search.toLowerCase()))

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8 text-center">Manufacturers</h1>

        <div className="bg-[#1b2838] border border-[#2a475e] rounded-sm p-6 mb-8">
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search manufacturers..."
            className="w-full bg-[#2a475e] border border-[#3d6a8a] rounded-sm px-3 py-2 text-sm text-[#c6d4df] placeholder-[#6a8a9a] focus:outline-none focus:border-[#66c0f4]"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(m => (
            <Link key={m.slug} href={`/manufacturers/${m.slug}`} className="block">
              <div className="bg-[#1b2838] rounded-lg overflow-hidden border border-[#2a475e] hover:border-[#66c0f4] transition-colors group">
                <div className="relative w-full h-40 overflow-hidden bg-[#0e1621]">
                  {m.image ? (
                    <img src={m.image} alt={m.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[#4a6a82] text-4xl">🎢</div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="text-xl font-semibold text-white group-hover:text-[#66c0f4] transition-colors">{m.name}</h3>
                  <p className="text-sm text-[#8f98a0] mt-1">{m.count} ride{m.count !== 1 ? 's' : ''}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400">No manufacturers found.</p>
          </div>
        )}
      </div>
    </div>
  )
}