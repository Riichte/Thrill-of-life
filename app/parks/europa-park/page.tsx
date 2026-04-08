import Link from 'next/link'
import { notFound } from 'next/navigation'

// Mock data for Europa Park
const europaPark = {
  id: 'europa-park',
  name: 'Europa Park',
  logo_url: '/Parks/Europa Park/Logo.png',
  banner_url: '/Parks/Europa Park/Main.jpg',
  description: 'Europa-Park is a theme park in Rust, Germany. It is Europe\'s second most popular theme park resort according to the TEA/AECOM 2018 Global Attractions Attendance Report with 5.8 million visitors per year.',
  location: 'Rust, Germany'
}

const categories = [
  { id: 'roller-coasters', name: 'Roller Coasters', icon: '🎢' },
  { id: 'dark-rides', name: 'Dark Rides', icon: '🏰' },
  { id: 'flat-rides', name: 'Flat Rides', icon: '🎡' },
  { id: 'water-rides', name: 'Water Rides', icon: '💦' },
  { id: 'shows', name: 'Shows', icon: '🎭' },
  { id: 'restaurants', name: 'Restaurants', icon: '🍽️' },
  { id: 'hotels', name: 'Hotels', icon: '🏨' }
]

const featuredRides = [
  {
    id: 'wodan',
    name: 'Wodan',
    category: 'roller-coasters',
    description: 'A thrilling wooden roller coaster with breathtaking drops and high speeds.',
    image: '/Parks/Europa Park/Roller Coasters/Wodan/Main.jpg',
    logo: '/Parks/Europa Park/Roller Coasters/Wodan/Logo.jpg',
    specs: {
      height: '40m',
      speed: '100 km/h',
      length: '1050m'
    }
  },
  {
    id: 'euromir',
    name: 'Euromir',
    category: 'roller-coasters',
    description: 'A looping roller coaster that simulates a journey to space.',
    image: '/Parks/Europa Park/Roller Coasters/Euromir/Main.jpg',
    logo: '/Parks/Europa Park/Roller Coasters/Euromir/Logo.png',
    specs: {
      height: '35m',
      speed: '80 km/h',
      length: '850m'
    }
  }
]

export default function EuropaParkPage() {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Banner */}
      <div className="relative h-96 overflow-hidden">
        <img
          src={europaPark.banner_url}
          alt={europaPark.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="text-center">
            <img
              src={europaPark.logo_url}
              alt={`${europaPark.name} Logo`}
              className="w-32 h-32 mx-auto mb-4"
            />
            <h1 className="text-6xl font-bold mb-2">{europaPark.name}</h1>
            <p className="text-xl text-gray-300">{europaPark.location}</p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="mb-6">
          <Link href="/parks" className="text-blue-400 hover:text-blue-300 text-sm">Parks</Link>
          <span className="mx-2 text-gray-500">/</span>
          <span className="text-gray-300 text-sm">{europaPark.name}</span>
        </nav>

        {/* Description */}
        <div className="mb-12">
          <p className="text-gray-300 text-lg leading-relaxed max-w-4xl">
            {europaPark.description}
          </p>
        </div>

        {/* Categories */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold mb-8">Explore by Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/parks/${europaPark.id}/${category.id}`}
                className="bg-gray-800 hover:bg-gray-700 rounded-lg p-6 text-center transition-colors"
              >
                <div className="text-4xl mb-3">{category.icon}</div>
                <h3 className="font-semibold text-sm">{category.name}</h3>
              </Link>
            ))}
          </div>
        </div>

        {/* Featured Roller Coasters */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold mb-8">Featured Roller Coasters</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {featuredRides.map((ride) => (
              <Link
                key={ride.id}
                href={`/parks/${europaPark.id}/roller-coasters/${ride.id}`}
                className="bg-gray-800 hover:bg-gray-700 rounded-lg overflow-hidden transition-colors"
              >
                <div className="relative h-48">
                  <img
                    src={ride.image}
                    alt={ride.name}
                    className="w-full h-full object-cover"
                  />
                  {ride.logo && (
                    <img
                      src={ride.logo}
                      alt={`${ride.name} Logo`}
                      className="absolute top-4 right-4 w-12 h-12 bg-white bg-opacity-90 rounded-full p-1"
                    />
                  )}
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2">{ride.name}</h3>
                  <p className="text-gray-300 mb-4">{ride.description}</p>
                  <div className="flex justify-between text-sm text-gray-400">
                    <span>Height: {ride.specs.height}</span>
                    <span>Speed: {ride.specs.speed}</span>
                    <span>Length: {ride.specs.length}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Back Button */}
        <div className="flex justify-center">
          <Link
            href="/parks"
            className="bg-blue-600 hover:bg-blue-700 px-8 py-3 rounded-lg font-semibold transition-colors"
          >
            Back to All Parks
          </Link>
        </div>
      </div>
    </div>
  )
}