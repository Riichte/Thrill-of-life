'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState, useMemo, useEffect } from 'react'
import LoadingSpinner from '@/components/LoadingSpinner'

type Park = {
  id: string
  name: string
  description: string
  logo_url: string
  cover_image_url: string
  country: string
  company: string
  park_type: string
  location: string
}

export default function ParksClient({ parks, soundtrackMode = false, ostCountByPark = {} }: {
  parks: Park[]
  soundtrackMode?: boolean
  ostCountByPark?: Record<string, number>
}) {
  const [filters, setFilters] = useState({ country: '', park_type: '' })
  const [isLoading, setIsLoading] = useState(true)

  const countries = [...new Set(parks.map(p => p.country))].sort()
  const parkTypes = [...new Set(parks.map(p => p.park_type))].sort()

  const filteredParks = useMemo(() => parks.filter(park =>
    (!filters.country || park.country === filters.country) &&
    (!filters.park_type || park.park_type === filters.park_type)
  ), [filters, parks])

  useEffect(() => { setIsLoading(false) }, [])

  if (isLoading) return <LoadingSpinner />

  const selectStyle = {
    background: 'var(--input-bg)',
    border: '1px solid var(--input-border)',
    color: 'var(--text-primary)',
  }

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-tertiary)', color: 'var(--text-primary)' }}>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8 text-center" style={{ color: 'var(--text-primary)' }}>
          {soundtrackMode ? 'Park Soundtracks' : 'Theme Parks'}
        </h1>
        {soundtrackMode && (
          <p className="text-center mb-6 text-sm" style={{ color: 'var(--text-muted)' }}>
            Browsing parks with soundtracks — <a href="/parks" style={{ color: 'var(--accent)' }}>exit soundtrack mode</a>
          </p>
        )}

        {/* Filters */}
        <div className="p-6 rounded-lg mb-8" style={{ background: 'var(--card-bg)', border: '1px solid var(--border)' }}>
          <h2 className="text-xl font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>Filters</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <select
              value={filters.country}
              onChange={e => setFilters(f => ({ ...f, country: e.target.value }))}
              className="p-2 rounded w-full focus:outline-none"
              style={selectStyle}
            >
              <option value="">All Countries</option>
              {countries.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <select
              value={filters.park_type}
              onChange={e => setFilters(f => ({ ...f, park_type: e.target.value }))}
              className="p-2 rounded w-full focus:outline-none"
              style={selectStyle}
            >
              <option value="">All Park Types</option>
              {parkTypes.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
        </div>

        {/* Parks Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {filteredParks.map(park => (
            <Link key={park.id} href={soundtrackMode ? `/parks/${park.id}?mode=soundtrack` : `/parks/${park.id}`} className="block group">
              <div className="rounded-lg overflow-hidden transition-colors aspect-square flex flex-col"
                style={{ background: 'var(--card-bg)', border: '1px solid var(--border)' }}
                onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg-elevated)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'var(--card-bg)')}>
                <div className="relative flex-1 overflow-hidden">
                  {park.cover_image_url ? (
                    <Image
                      src={park.cover_image_url}
                      alt={park.name}
                      fill
                      className="object-cover object-top group-hover:scale-105 transition-transform duration-300 animate-fade-slide"
                      loading="lazy"
                      quality={100}
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-4xl" style={{ background: 'var(--bg-elevated)' }}>🏟️</div>
                  )}
                </div>
                <div className="p-4" style={{ background: 'var(--card-bg)', borderTop: '1px solid var(--border)' }}>
                  <h3 className="text-xs font-semibold mb-1 truncate" style={{ color: 'var(--text-primary)' }}>
                    {park.name}
                  </h3>
                  <div className="flex flex-wrap gap-2 text-xs">
                    {soundtrackMode ? (
                      <span className="px-2 py-1 rounded" style={{ background: 'var(--accent-bg)', color: 'var(--accent)' }}>
                        🎵 {ostCountByPark[park.id] ?? 0} tracks
                      </span>
                    ) : (
                      <span className="px-2 py-1 rounded" style={{ background: 'var(--accent-bg)', color: 'var(--accent)' }}>
                        {park.country}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {filteredParks.length === 0 && (
          <div className="text-center py-12">
            <p style={{ color: 'var(--text-muted)' }}>No parks match your filters.</p>
          </div>
        )}
      </div>
    </div>
  )
}