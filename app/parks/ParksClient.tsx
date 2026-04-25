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

export default function ParksClient({ parks }: { parks: Park[] }) {
  const [filters, setFilters] = useState({ country: '', park_type: '' })

  const countries = [...new Set(parks.map(p => p.country))].sort()
  const parkTypes = [...new Set(parks.map(p => p.park_type))].sort()

  const filteredParks = useMemo(() => parks.filter(park =>
    (!filters.country || park.country === filters.country) &&
    (!filters.park_type || park.park_type === filters.park_type)
  ), [filters, parks])

  const selectClass = 'bg-gray-700 text-white p-2 rounded w-full'
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8 text-center">Theme Parks</h1>

        {/* Filters */}
        <div className="bg-gray-800 p-6 rounded-lg mb-8">
          <h2 className="text-xl font-semibold mb-4">Filters</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <select value={filters.country} onChange={e => setFilters(f => ({ ...f, country: e.target.value }))} className={selectClass}>
              <option value="">All Countries</option>
              {countries.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <select value={filters.park_type} onChange={e => setFilters(f => ({ ...f, park_type: e.target.value }))} className={selectClass}>
              <option value="">All Park Types</option>
              {parkTypes.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
        </div>

        {/* Parks Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredParks.map(park => (
            <Link key={park.id} href={`/parks/${park.id}`} className="block">
              <div className="bg-gray-800 rounded-lg overflow-hidden hover:bg-gray-700 transition-colors">
                <div className="relative w-full h-48 overflow-hidden">
                  <img
                    src={park.cover_image_url}
                    alt={park.name}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-4">
                  <div className="flex items-center mb-2">
                    <h3 className="text-xl font-semibold">{park.name}</h3>
                  </div>
                  <p className="text-gray-300 text-sm mb-2">{park.description}</p>
                  <div className="flex flex-wrap gap-2 text-xs">
                    <span className="bg-blue-600 px-2 py-1 rounded">{park.country}</span>
                    <span className="bg-purple-600 px-2 py-1 rounded">{park.park_type}</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {filteredParks.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400">No parks match your filters.</p>
          </div>
        )}
      </div>
    </div>
  )
}