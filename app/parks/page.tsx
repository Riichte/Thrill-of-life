'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'

// Mock data
const mockParks = [
  {
    id: 'disneyland-paris',
    name: 'Disneyland Paris',
    description: 'The most magical place on Earth in Europe, featuring two theme parks, seven Disney hotels, and a shopping and entertainment district.',
    logo_url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=200&h=200&fit=crop&crop=center',
    cover_image_url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=400&fit=crop&crop=center',
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
    cover_image_url: 'https://images.unsplash.com/photo-1551632436-cbf8dd35adfa?w=800&h=400&fit=crop&crop=center',
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
    cover_image_url: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&h=400&fit=crop&crop=center',
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
    cover_image_url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=400&fit=crop&crop=center',
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
    cover_image_url: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&h=400&fit=crop&crop=center',
    country: 'Spain',
    region: 'Europe',
    company: 'PortAventura',
    park_type: 'Theme Park',
    location: 'Salou, Catalonia, Spain'
  }
]

const countries = [...new Set(mockParks.map(p => p.country))]
const regions = [...new Set(mockParks.map(p => p.region))]
const companies = [...new Set(mockParks.map(p => p.company))]
const parkTypes = [...new Set(mockParks.map(p => p.park_type))]

export default function ParksPage() {
  const [filters, setFilters] = useState({
    country: '',
    region: '',
    company: '',
    park_type: ''
  })

  const filteredParks = useMemo(() => {
    return mockParks.filter(park => {
      return (
        (!filters.country || park.country === filters.country) &&
        (!filters.region || park.region === filters.region) &&
        (!filters.company || park.company === filters.company) &&
        (!filters.park_type || park.park_type === filters.park_type)
      )
    })
  }, [filters])

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8 text-center">Theme Parks</h1>

        {/* Filters */}
        <div className="bg-gray-800 p-6 rounded-lg mb-8">
          <h2 className="text-xl font-semibold mb-4">Filters</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <select
              value={filters.country}
              onChange={(e) => setFilters({...filters, country: e.target.value})}
              className="bg-gray-700 text-white p-2 rounded"
            >
              <option value="">All Countries</option>
              {countries.map(country => (
                <option key={country} value={country}>{country}</option>
              ))}
            </select>

            <select
              value={filters.region}
              onChange={(e) => setFilters({...filters, region: e.target.value})}
              className="bg-gray-700 text-white p-2 rounded"
            >
              <option value="">All Regions</option>
              {regions.map(region => (
                <option key={region} value={region}>{region}</option>
              ))}
            </select>

            <select
              value={filters.company}
              onChange={(e) => setFilters({...filters, company: e.target.value})}
              className="bg-gray-700 text-white p-2 rounded"
            >
              <option value="">All Companies</option>
              {companies.map(company => (
                <option key={company} value={company}>{company}</option>
              ))}
            </select>

            <select
              value={filters.park_type}
              onChange={(e) => setFilters({...filters, park_type: e.target.value})}
              className="bg-gray-700 text-white p-2 rounded"
            >
              <option value="">All Park Types</option>
              {parkTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Parks Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredParks.map(park => (
            <Link key={park.id} href={`/parks/${park.id}`} className="block">
              <div className="bg-gray-800 rounded-lg overflow-hidden hover:bg-gray-700 transition-colors">
                <img
                  src={park.cover_image_url}
                  alt={park.name}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <div className="flex items-center mb-2">
                    <img
                      src={park.logo_url}
                      alt={`${park.name} logo`}
                      className="w-8 h-8 rounded mr-2"
                    />
                    <h3 className="text-xl font-semibold">{park.name}</h3>
                  </div>
                  <p className="text-gray-300 text-sm mb-2">{park.description}</p>
                  <div className="flex flex-wrap gap-2 text-xs">
                    <span className="bg-blue-600 px-2 py-1 rounded">{park.country}</span>
                    <span className="bg-green-600 px-2 py-1 rounded">{park.company}</span>
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