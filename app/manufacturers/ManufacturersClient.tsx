'use client'

import Link from 'next/link'
import { useState } from 'react'

type Manufacturer = { name: string; slug: string; count: number; image: string | null }

export default function ManufacturersClient({ manufacturers }: { manufacturers: Manufacturer[] }) {
  const [search, setSearch] = useState('')
  const filtered = manufacturers.filter(m => m.name.toLowerCase().includes(search.toLowerCase()))

  return (
    <div className="min-h-screen style={{ background: 'var(--bg-tertiary)' }} style={{ color: 'var(--text-primary)' }}">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8 text-center">Manufacturers</h1>

        <div className="style={{ background: 'var(--card-bg)' }} border style={{ borderColor: 'var(--border)' }} rounded-sm p-6 mb-8">
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search manufacturers..."
            className="w-full style={{ background: 'var(--bg-elevated)' }} border style={{ borderColor: 'var(--input-border)' }} rounded-sm px-3 py-2 text-sm style={{ color: 'var(--text-primary)' }} placeholder-[#6a8a9a] focus:outline-none style={{ outlineColor: 'var(--input-focus)' }}"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(m => (
            <Link key={m.slug} href={`/manufacturers/${m.slug}`} className="block">
              <div className="style={{ background: 'var(--card-bg)' }} rounded-lg overflow-hidden border style={{ borderColor: 'var(--border)' }} hover:border-[#66c0f4] transition-colors group">
                <div className="relative w-full h-40 overflow-hidden bg-[#0e1621]">
                  {m.image ? (
                    <img src={m.image} alt={m.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[#4a6a82] text-4xl">🎢</div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="text-xl font-semibold style={{ color: 'var(--text-primary)' }} group-hover:style={{ color: 'var(--accent)' }} transition-colors">{m.name}</h3>
                  <p className="text-sm style={{ color: 'var(--text-muted)' }} mt-1">{m.count} ride{m.count !== 1 ? 's' : ''}</p>
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