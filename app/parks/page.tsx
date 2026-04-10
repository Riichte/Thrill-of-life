'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'

// Park data based on public/parks/ folder structure
const mockParks = [
  {
    id: 'alton-towers',
    name: 'Alton Towers',
    description: 'Britain\'s most visited theme park with over 40 rides and attractions, plus a water park and hotel resort.',
    logo_url: '/parks/alton towers/logo.png',
    cover_image_url: '/parks/alton towers/main.jpg',
    country: 'United Kingdom',
    region: 'Europe',
    company: 'Alton Towers',
    park_type: 'Theme Park',
    location: 'Alton, Staffordshire, UK'
  },
  {
    id: 'bellewaerde',
    name: 'Bellewaerde',
    description: 'A family-friendly theme park in Belgium featuring rides, shows, and animal encounters.',
    logo_url: '/parks/bellewaerde/logo.png',
    cover_image_url: '/parks/bellewaerde/main.jpg',
    country: 'Belgium',
    region: 'Europe',
    company: 'Bellewaerde',
    park_type: 'Theme Park',
    location: 'Ypres, Belgium'
  },
  {
    id: 'blackpool-pleasure-beach',
    name: 'Blackpool Pleasure Beach',
    description: 'One of the oldest amusement parks in the world, featuring classic rides and modern attractions.',
    logo_url: '/parks/blackpool pleasure beach/logo.png',
    cover_image_url: '/parks/blackpool pleasure beach/main.jpg',
    country: 'United Kingdom',
    region: 'Europe',
    company: 'Blackpool Pleasure Beach',
    park_type: 'Amusement Park',
    location: 'Blackpool, Lancashire, UK'
  },
  {
    id: 'bobbejaanland',
    name: 'Bobbejaanland',
    description: 'A Belgian theme park known for its diverse attractions and family-friendly environment.',
    logo_url: '/parks/bobbejaanland/logo.png',
    cover_image_url: '/parks/bobbejaanland/main.jpg',
    country: 'Belgium',
    region: 'Europe',
    company: 'Bobbejaanland',
    park_type: 'Theme Park',
    location: 'Kasterlee, Belgium'
  },
  {
    id: 'disneyland-paris',
    name: 'Disneyland Paris',
    description: 'The most magical place on Earth in Europe, featuring two theme parks, seven Disney hotels, and a shopping and entertainment district.',
    logo_url: '/parks/disneyland paris/logo.png',
    cover_image_url: '/parks/disneyland paris/main.jpg',
    country: 'France',
    region: 'Europe',
    company: 'Disney',
    park_type: 'Theme Park',
    location: 'Marne-la-Vallée, France'
  },
  {
    id: 'europa-park',
    name: 'Europa Park',
    description: 'Europe\'s second most popular theme park resort with thrilling rides, shows, and European-themed areas.',
    logo_url: '/parks/europa park/logo.png',
    cover_image_url: '/parks/europa park/main.jpg',
    country: 'Germany',
    region: 'Europe',
    company: 'Europa Park',
    park_type: 'Theme Park',
    location: 'Rust, Germany'
  },
  {
    id: 'six-flags-great-escape',
    name: 'Six Flags Great Escape',
    description: 'A Six Flags park featuring roller coasters, water rides, and family attractions.',
    logo_url: '/parks/six flags great escape/logo.png',
    cover_image_url: '/parks/six flags great escape/main.jpg',
    country: 'United States',
    region: 'North America',
    company: 'Six Flags',
    park_type: 'Theme Park',
    location: 'Queensbury, New York, USA'
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