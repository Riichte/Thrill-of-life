'use client'

import Link from 'next/link'
import { notFound } from 'next/navigation'
import { useState } from 'react'
import RatingComponent from '@/components/RatingComponent'
import { SteamMediaCarousel } from '@/components/SteamMediaCarousel'
import { SteamInfoPanel } from '@/components/SteamInfoPanel'

// Mock data (same as park page)
const mockParks = [
  {
    id: 'disneyland-paris',
    name: 'Disneyland Paris',
    logo_url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=200&h=200&fit=crop&crop=center'
  },
  {
    id: 'universal-florida',
    name: 'Universal Studios Florida',
    logo_url: 'https://images.unsplash.com/photo-1551632436-cbf8dd35adfa?w=200&h=200&fit=crop&crop=center'
  },
  {
    id: 'six-flags-magic-mountain',
    name: 'Six Flags Magic Mountain',
    logo_url: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=200&h=200&fit=crop&crop=center'
  },
  {
    id: 'alton-towers',
    name: 'Alton Towers',
    logo_url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=200&h=200&fit=crop&crop=center'
  },
  {
    id: 'port-adventure',
    name: 'PortAventura World',
    logo_url: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=200&h=200&fit=crop&crop=center'
  },
  {
    id: 'europa-park',
    name: 'Europa Park',
    logo_url: '/parks/europa-park/logo.png'
  }
]

const mockCategories = [
  { id: 'rides', name: 'Rides' },
  { id: 'roller-coasters', name: 'Roller Coasters' },
  { id: 'dark-rides', name: 'Dark Rides' },
  { id: 'flat-rides', name: 'Flat Rides' },
  { id: 'water-rides', name: 'Water Rides' },
  { id: 'transport', name: 'Transport' },
  { id: 'restaurants', name: 'Restaurants' },
  { id: 'shows', name: 'Shows & Entertainment' },
  { id: 'hotels', name: 'Hotels & Resorts' },
  { id: 'shops', name: 'Shops & Merchandise' }
]

const mockItems = {
  'disneyland-paris': [
    {
      id: 'space-mountain',
      category_id: 'rides',
      name: 'Space Mountain',
      description: 'A thrilling indoor roller coaster through the darkness of space. Experience weightlessness and high-speed turns as you journey through the cosmos in this classic Disney attraction.',
      location_in_park: 'Discoveryland',
      specs: {
        height: '42m',
        speed: '65 km/h',
        length: '900m',
        drop: '35m',
        manufacturer: 'Arrow Dynamics',
        type: 'Indoor Roller Coaster'
      }
    },
    {
      id: 'ratatouille-restaurant',
      category_id: 'restaurants',
      name: 'Bistrot Chez Rémy',
      description: 'Experience fine French dining inspired by Ratatouille. Enjoy gourmet meals in a charming Parisian bistro setting with views of the park.',
      location_in_park: 'Main Street, U.S.A.'
    },
    {
      id: 'disney-stars-on-parade',
      category_id: 'shows',
      name: 'Disney Stars on Parade',
      description: 'A spectacular parade featuring Disney characters from classic and modern films. Watch as your favorite characters dance and perform down Main Street.',
      location_in_park: 'Main Street, U.S.A.'
    }
  ],
  'universal-florida': [
    {
      id: 'harry-potter-ride',
      category_id: 'rides',
      name: 'Harry Potter and the Forbidden Journey',
      description: 'An immersive ride through the Wizarding World of Harry Potter. Fly alongside Harry on a broomstick and experience magical adventures.',
      location_in_park: 'The Wizarding World of Harry Potter',
      specs: {
        height: '42m',
        speed: '60 km/h',
        length: '1000m',
        drop: '28m',
        manufacturer: 'Bolliger & Mabillard',
        type: 'Roller Coaster'
      }
    },
    {
      id: 'hogwarts-express',
      category_id: 'restaurants',
      name: 'The Three Broomsticks',
      description: 'Authentic British pub fare in Hogsmeade. Enjoy shepherd\'s pie, fish and chips, and butterbeer in a magical setting.',
      location_in_park: 'The Wizarding World of Harry Potter'
    }
  ],
  'six-flags-magic-mountain': [
    {
      id: 'goliath-ride',
      category_id: 'rides',
      name: 'Goliath',
      description: 'One of the tallest, fastest roller coasters in the world. Experience weightlessness and breathtaking drops on this legendary coaster.',
      location_in_park: 'Colossus County Fair',
      specs: {
        height: '127m',
        speed: '147 km/h',
        length: '1645m',
        drop: '127m',
        manufacturer: 'Bolliger & Mabillard',
        type: 'Hypercoaster'
      }
    },
    {
      id: 'revolution-ride',
      category_id: 'rides',
      name: 'Revolution',
      description: 'The world\'s first modern roller coaster loop. A historic and thrilling experience since 1976.',
      location_in_park: 'Frontier Town',
      specs: {
        height: '32m',
        speed: '85 km/h',
        length: '900m',
        drop: '29m',
        manufacturer: 'Arrow Dynamics',
        type: 'Looping Coaster'
      }
    },
    {
      id: 'magic-mountain-grill',
      category_id: 'restaurants',
      name: 'Magic Mountain Grill',
      description: 'Premium dining with spectacular park views.',
      location_in_park: 'Main Plaza'
    }
  ],
  'alton-towers': [
    {
      id: 'smiler-ride',
      category_id: 'rides',
      name: 'The Smiler',
      description: 'The world\'s most looped roller coaster with 14 inversions. A record-breaking wonder of engineering.',
      location_in_park: 'The Smiler Area',
      specs: {
        height: '37m',
        speed: '117 km/h',
        length: '1426m',
        drop: '37m',
        manufacturer: 'Bolliger & Mabillard',
        type: 'Inversion Coaster'
      }
    },
    {
      id: 'nemesis-ride',
      category_id: 'rides',
      name: 'Nemesis',
      description: 'An iconic inverted roller coaster that has thrilled guests for decades.',
      location_in_park: 'X-Sector',
      specs: {
        height: '35m',
        speed: '80 km/h',
        length: '650m',
        drop: '35m',
        manufacturer: 'Bolliger & Mabillard',
        type: 'Inverted Coaster'
      }
    },
    {
      id: 'alton-towers-hotel',
      category_id: 'hotels',
      name: 'Alton Towers Hotel',
      description: 'Luxury accommodation in the historic grounds of Alton Towers.',
      location_in_park: 'Hotel Area'
    }
  ],
  'port-adventure': [
    {
      id: 'shambhala-ride',
      category_id: 'rides',
      name: 'Shambhala',
      description: 'Europe\'s highest and steepest hypercoaster. An extremely thrilling experience.',
      location_in_park: 'Far West',
      specs: {
        height: '78m',
        speed: '135 km/h',
        length: '1715m',
        drop: '74m',
        manufacturer: 'Bolliger & Mabillard',
        type: 'Hypercoaster'
      }
    },
    {
      id: 'furius-baco-ride',
      category_id: 'rides',
      name: 'Furius Baco',
      description: 'A high-speed roller coaster that launches you at incredible velocity.',
      location_in_park: 'Mediterranean',
      specs: {
        height: '33m',
        speed: '140 km/h',
        length: '1650m',
        drop: '33m',
        manufacturer: 'Intamin',
        type: 'Launch Coaster'
      }
    },
    {
      id: 'ferrari-land',
      category_id: 'shops',
      name: 'Ferrari Land Shop',
      description: 'Exclusive Ferrari merchandise and memorabilia for collectors.',
      location_in_park: 'Ferrari Land'
    }
  ],
  'europa-park': [
    {
      id: 'wodan',
      category_id: 'roller-coasters',
      name: 'Wodan',
      description: 'A thrilling wooden roller coaster with breathtaking drops and high speeds. Experience the power of the Norse god on this legendary coaster.',
      location_in_park: 'Europa Park',
      specs: {
        height: '40m',
        speed: '100 km/h',
        length: '1050m',
        drop: '35m',
        manufacturer: 'Bolliger & Mabillard',
        type: 'Wooden Roller Coaster'
      }
    },
    {
      id: 'euromir',
      category_id: 'roller-coasters',
      name: 'Euromir',
      description: 'A looping roller coaster that simulates a journey to space. Experience weightlessness and cosmic thrills on this inverted coaster.',
      location_in_park: 'Europa Park',
      specs: {
        height: '35m',
        speed: '80 km/h',
        length: '850m',
        drop: '30m',
        manufacturer: 'Bolliger & Mabillard',
        type: 'Inverted Roller Coaster'
      }
    },
    {
      id: 'blue-fire',
      category_id: 'roller-coasters',
      name: 'Blue Fire',
      description: 'A high-speed launched coaster that propels riders through intense inversions and thrilling drops at incredible speeds.',
      location_in_park: 'Europa Park',
      specs: {
        height: '38m',
        speed: '100 km/h',
        length: '1056m',
        drop: '30m',
        manufacturer: 'Mack Rides',
        type: 'Launched Roller Coaster'
      }
    },
    {
      id: 'silver-star',
      category_id: 'roller-coasters',
      name: 'silver-star',
      description: 'A towering hypercoaster with breathtaking views and heart-pounding drops from its impressive height.',
      location_in_park: 'Europa Park',
      specs: {
        height: '73m',
        speed: '127 km/h',
        length: '1620m',
        drop: '73m',
        manufacturer: 'Bolliger & Mabillard',
        type: 'Hypercoaster'
      }
    },
    {
      id: 'matterhorn-blitz',
      category_id: 'roller-coasters',
      name: 'matterhorn-blitz',
      description: 'A wild bobsled coaster that twists and turns through alpine scenery with sudden drops and sharp curves.',
      location_in_park: 'Europa Park',
      specs: {
        height: '12m',
        speed: '50 km/h',
        length: '320m',
        drop: '10m',
        manufacturer: 'Mack Rides',
        type: 'Bobsled Coaster'
      }
    },
    {
      id: 'pegasus',
      category_id: 'roller-coasters',
      name: 'Pegasus',
      description: 'A family-friendly coaster with gentle drops and smooth curves, perfect for younger riders and families.',
      location_in_park: 'Europa Park',
      specs: {
        height: '8m',
        speed: '40 km/h',
        length: '200m',
        drop: '6m',
        manufacturer: 'Mack Rides',
        type: 'Family Coaster'
      }
    },
    {
      id: 'tiroler-wildwasserbahn',
      category_id: 'water-rides',
      name: 'Tiroler Wildwasserbahn',
      description: 'An exciting log flume ride through alpine scenery with thrilling drops and splash landings.',
      location_in_park: 'Europa Park',
      specs: {
        height: '15m',
        speed: 'Variable',
        length: '450m',
        drop: '12m',
        manufacturer: 'Mack Rides',
        type: 'Log Flume'
      }
    },
    {
      id: 'fjord-rafting',
      category_id: 'water-rides',
      name: 'Fjord Rafting',
      description: 'A rapid river adventure ride through Norwegian fjord scenery with exciting rapids and waterfalls.',
      location_in_park: 'Europa Park',
      specs: {
        height: '8m',
        speed: 'Variable',
        length: '360m',
        drop: '5m',
        manufacturer: 'Intamin',
        type: 'River Rapids Ride'
      }
    },
    {
      id: 'dschungel-flossfahrt',
      category_id: 'dark-rides',
      name: 'Dschungel-Floßfahrt',
      description: 'A relaxing boat ride through lush jungle scenery with gentle rapids and tropical atmosphere.',
      location_in_park: 'Europa Park',
      specs: {
        height: '3m',
        speed: 'Variable',
        length: '300m',
        drop: '2m',
        manufacturer: 'Mack Rides',
        type: 'Boat Ride'
      }
    },
    {
      id: 'poseidon',
      category_id: 'roller-coasters',
      name: 'Poseidon',
      description: 'A thrilling water coaster that combines roller coaster elements with water ride excitement.',
      location_in_park: 'Europa Park',
      specs: {
        height: '28m',
        speed: '70 km/h',
        length: '430m',
        drop: '23m',
        manufacturer: 'Mack Rides',
        type: 'Water Coaster'
      }
    },
    {
      id: 'eurosat',
      category_id: 'roller-coasters',
      name: 'Eurosat',
      description: 'A high-speed roller coaster with multiple inversions and thrilling maneuvers.',
      location_in_park: 'Europa Park',
      specs: {
        height: '32m',
        speed: '90 km/h',
        length: '380m',
        drop: '28m',
        manufacturer: 'Bolliger & Mabillard',
        type: 'Inverted Coaster'
      }
    },
    {
      id: 'vindjammer',
      category_id: 'flat-rides',
      name: 'Vindjammer',
      description: 'A swinging ship ride that provides a thrilling rocking motion with increasing intensity.',
      location_in_park: 'Europa Park',
      specs: {
        height: '15m',
        speed: 'Variable',
        length: 'N/A',
        drop: 'N/A',
        manufacturer: 'HUSS Park Attractions',
        type: 'Swinging Ship'
      }
    },
    {
      id: 'kronasar',
      category_id: 'hotels',
      name: 'Hotel Kronasar',
      description: 'A luxurious hotel inspired by Scandinavian design, offering comfortable rooms and modern amenities.',
      location_in_park: 'Europa Park',
      specs: {
        rooms: '120',
        theme: 'Scandinavian',
        facilities: 'Restaurant, Bar, Spa',
        rating: '4-star'
      }
    },
    {
      id: 'monorail-bahn',
      category_id: 'transport',
      name: 'Monorail Bahn',
      description: 'A convenient monorail system that transports guests between different areas of the park.',
      location_in_park: 'Europa Park',
      specs: {
        type: 'Monorail',
        capacity: '60 passengers',
        speed: '20 km/h',
        length: '2.8 km'
      }
    },
    {
      id: 'atlantica-super-splash',
      category_id: 'roller-coasters',
      name: 'atlantica-super-splash',
      description: 'A thrilling water coaster with high-speed drops and splash landings.',
      location_in_park: 'Europa Park',
      specs: {
        height: '25m',
        speed: '70 km/h',
        length: '400m',
        drop: '20m',
        manufacturer: 'Mack Rides',
        type: 'Water Coaster'
      }
    },
    {
      id: 'bobsleigh',
      category_id: 'roller-coasters',
      name: 'Bobsleigh',
      description: 'A bobsled coaster that simulates the thrill of Olympic bobsledding with twists and turns.',
      location_in_park: 'Europa Park',
      specs: {
        height: '10m',
        speed: '45 km/h',
        length: '280m',
        drop: '8m',
        manufacturer: 'Mack Rides',
        type: 'Bobsled Coaster'
      }
    },
    {
      id: 'alpenexpress',
      category_id: 'roller-coasters',
      name: 'Alpenexpress',
      description: 'A mountain train ride that takes passengers through scenic alpine landscapes.',
      location_in_park: 'Europa Park',
      specs: {
        height: '5m',
        speed: 'Variable',
        length: '350m',
        drop: '3m',
        manufacturer: 'Mack Rides',
        type: 'Train Ride'
      }
    },
    {
      id: 'arthur',
      category_id: 'roller-coasters',
      name: 'Arthur',
      description: 'A family-friendly roller coaster with gentle curves and exciting drops.',
      location_in_park: 'Europa Park',
      specs: {
        height: '12m',
        speed: '50 km/h',
        length: '250m',
        drop: '9m',
        manufacturer: 'Mack Rides',
        type: 'Family Coaster'
      }
    }
]

}

const mockItemImages = {
  'space-mountain': [
    'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&h=600&fit=crop&crop=center',
    'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop&crop=center',
    'https://images.unsplash.com/photo-1551632436-cbf8dd35adfa?w=800&h=600&fit=crop&crop=center'
  ],
  'ratatouille-restaurant': [
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop&crop=center',
    'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&h=600&fit=crop&crop=center'
  ],
  'disney-stars-on-parade': [
    'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop&crop=center',
    'https://images.unsplash.com/photo-1551632436-cbf8dd35adfa?w=800&h=600&fit=crop&crop=center'
  ],
  'harry-potter-ride': [
    'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&h=600&fit=crop&crop=center',
    'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop&crop=center'
  ],
  'hogwarts-express': [
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop&crop=center'
  ],
  'goliath-ride': [
    'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&h=600&fit=crop&crop=center',
    'https://images.unsplash.com/photo-1551632436-cbf8dd35adfa?w=800&h=600&fit=crop&crop=center'
  ],
  'revolution-ride': [
    'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop&crop=center'
  ],
  'magic-mountain-grill': [
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop&crop=center'
  ],
  'smiler-ride': [
    'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&h=600&fit=crop&crop=center',
    'https://images.unsplash.com/photo-1551632436-cbf8dd35adfa?w=800&h=600&fit=crop&crop=center'
  ],
  'nemesis-ride': [
    'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop&crop=center'
  ],
  'alton-towers-hotel': [
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop&crop=center'
  ],
  'shambhala-ride': [
    'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&h=600&fit=crop&crop=center',
    'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop&crop=center'
  ],
  'furius-baco-ride': [
    'https://images.unsplash.com/photo-1551632436-cbf8dd35adfa?w=800&h=600&fit=crop&crop=center'
  ],
  'ferrari-land': [
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop&crop=center'
  ],
  'wodan': [
    '/parks/europa-park/roller-coasters/wodan/01.jpg',
    '/parks/europa-park/roller-coasters/wodan/02.jpg',
    '/parks/europa-park/roller-coasters/wodan/03.jpg',
    '/parks/europa-park/roller-coasters/wodan/04.jpg',
    '/parks/europa-park/roller-coasters/wodan/05.jpg',
    '/parks/europa-park/roller-coasters/wodan/06.jpg',
    '/parks/europa-park/roller-coasters/wodan/07.jpg',
  ],
  'euromir': [
    '/parks/europa-park/roller-coasters/euromir/01.jpg',
    '/parks/europa-park/roller-coasters/euromir/02.jpg',
    '/parks/europa-park/roller-coasters/euromir/03.jpg',
    '/parks/europa-park/roller-coasters/euromir/04.jpg',
    '/parks/europa-park/roller-coasters/euromir/05.jpg',
    '/parks/europa-park/roller-coasters/euromir/06.jpg',
    '/parks/europa-park/roller-coasters/euromir/07.jpg'
  ],
  'blue-fire': [
    '/parks/europa-park/roller-coasters/blue-fire/01.jpg',
    '/parks/europa-park/roller-coasters/blue-fire/02.jpg',
    '/parks/europa-park/roller-coasters/blue-fire/03.jpg',
    '/parks/europa-park/roller-coasters/blue-fire/04.jpg',
    '/parks/europa-park/roller-coasters/blue-fire/05.jpg',
    '/parks/europa-park/roller-coasters/blue-fire/06.jpg',
    '/parks/europa-park/roller-coasters/blue-fire/07.jpg'
  ],
  'silver-star': [
    '/parks/europa-park/roller-coasters/silver-star/01.jpg',
    '/parks/europa-park/roller-coasters/silver-star/02.jpg',
    '/parks/europa-park/roller-coasters/silver-star/03.jpg',
    '/parks/europa-park/roller-coasters/silver-star/04.jpg',
    '/parks/europa-park/roller-coasters/silver-star/05.jpg',
    '/parks/europa-park/roller-coasters/silver-star/06.jpg',
    '/parks/europa-park/roller-coasters/silver-star/07.jpg',
  ],
  'matterhorn-blitz': [
    '/parks/europa-park/roller-coasters/matterhorn-blitz/01.jpg',
    '/parks/europa-park/roller-coasters/matterhorn-blitz/02.jpg',
    '/parks/europa-park/roller-coasters/matterhorn-blitz/03.jpg',
    '/parks/europa-park/roller-coasters/matterhorn-blitz/04.jpg',
    '/parks/europa-park/roller-coasters/matterhorn-blitz/05.jpg',
    '/parks/europa-park/roller-coasters/matterhorn-blitz/06.jpg',
    '/parks/europa-park/roller-coasters/matterhorn-blitz/07.jpg'
  ],
  'pegasus': [
    '/parks/europa-park/roller-coasters/pegasus/01.jpg',
    '/parks/europa-park/roller-coasters/pegasus/02.jpg',
    '/parks/europa-park/roller-coasters/pegasus/03.jpg',
    '/parks/europa-park/roller-coasters/pegasus/04.jpg',
    '/parks/europa-park/roller-coasters/pegasus/05.jpg',
    '/parks/europa-park/roller-coasters/pegasus/06.jpg',
    '/parks/europa-park/roller-coasters/pegasus/07.jpg'
  ],
  'tiroler-wildwasserbahn': [
    '/parks/europa-park/water-rides/tiroler wildwasserbahn/01.jpg',
    '/parks/europa-park/water-rides/tiroler wildwasserbahn/02.jpg',
    '/parks/europa-park/water-rides/tiroler wildwasserbahn/03.jpg',
    '/parks/europa-park/water-rides/tiroler wildwasserbahn/04.jpg',
    '/parks/europa-park/water-rides/tiroler wildwasserbahn/05.jpg',
    '/parks/europa-park/water-rides/tiroler wildwasserbahn/06.jpg',
    '/parks/europa-park/water-rides/tiroler wildwasserbahn/07.jpg'
  ],
  'fjord-rafting': [
    '/parks/europa-park/water-rides/fjord rafting/01.jpg',
    '/parks/europa-park/water-rides/fjord rafting/02.jpg',
    '/parks/europa-park/water-rides/fjord rafting/03.jpg',
    '/parks/europa-park/water-rides/fjord rafting/04.jpg',
    '/parks/europa-park/water-rides/fjord rafting/05.jpg',
    '/parks/europa-park/water-rides/fjord rafting/06.jpg',
    '/parks/europa-park/water-rides/fjord rafting/07.jpg'
  ],
  'dschungel-flossfahrt': [
    '/parks/europa-park/dark-rides/dschungel-floßfahrt/01.jpg',
    '/parks/europa-park/dark-rides/dschungel-floßfahrt/02.jpg',
    '/parks/europa-park/dark-rides/dschungel-floßfahrt/03.jpg',
    '/parks/europa-park/dark-rides/dschungel-floßfahrt/04.jpg',
    '/parks/europa-park/dark-rides/dschungel-floßfahrt/05.jpg',
    '/parks/europa-park/dark-rides/dschungel-floßfahrt/06.jpg',
    '/parks/europa-park/dark-rides/dschungel-floßfahrt/07.jpg'
  ],
  'poseidon': [
    '/parks/europa-park/roller-coasters/poseidon/01.jpg',
    '/parks/europa-park/roller-coasters/poseidon/02.jpg',
    '/parks/europa-park/roller-coasters/poseidon/03.jpg',
    '/parks/europa-park/roller-coasters/poseidon/04.jpg',
    '/parks/europa-park/roller-coasters/poseidon/05.jpg',
    '/parks/europa-park/roller-coasters/poseidon/06.jpg',
    '/parks/europa-park/roller-coasters/poseidon/07.jpg'
  ],
  'eurosat': [
    '/parks/europa-park/roller-coasters/eurosat/01.jpg',
    '/parks/europa-park/roller-coasters/eurosat/02.jpg',
    '/parks/europa-park/roller-coasters/eurosat/03.jpg',
    '/parks/europa-park/roller-coasters/eurosat/04.jpg',
    '/parks/europa-park/roller-coasters/eurosat/05.jpg',
    '/parks/europa-park/roller-coasters/eurosat/06.jpg',
    '/parks/europa-park/roller-coasters/eurosat/07.jpg'
  ],
  'vindjammer': [
    '/parks/europa-park/flat-rides/vindjammer/01.jpg',
    '/parks/europa-park/flat-rides/vindjammer/02.jpg',
    '/parks/europa-park/flat-rides/vindjammer/03.jpg',
    '/parks/europa-park/flat-rides/vindjammer/04.jpg',
    '/parks/europa-park/flat-rides/vindjammer/05.jpg',
    '/parks/europa-park/flat-rides/vindjammer/06.jpg',
    '/parks/europa-park/flat-rides/vindjammer/07.jpg'
  ],
  'kronasar': [
    '/parks/europa-park/Hotels/kronasar/01.jpg',
    '/parks/europa-park/Hotels/kronasar/02.jpg',
    '/parks/europa-park/Hotels/kronasar/03.jpg',
    '/parks/europa-park/Hotels/kronasar/04.jpg',
    '/parks/europa-park/Hotels/kronasar/05.jpg',
    '/parks/europa-park/Hotels/kronasar/06.jpg',
    '/parks/europa-park/Hotels/kronasar/07.jpg'
  ],
  'monorail-bahn': [
    '/parks/europa-park/Transport/monorail bahn/01.jpg',
    '/parks/europa-park/Transport/monorail bahn/02.jpg',
    '/parks/europa-park/Transport/monorail bahn/03.jpg',
    '/parks/europa-park/Transport/monorail bahn/04.jpg',
    '/parks/europa-park/Transport/monorail bahn/05.jpg',
    '/parks/europa-park/Transport/monorail bahn/06.jpg',
    '/parks/europa-park/Transport/monorail bahn/07.jpg'
  ],
  'atlantica-super-splash': [
    '/parks/europa-park/roller-coasters/atlantica-super-splash/01.jpg',
    '/parks/europa-park/roller-coasters/atlantica-super-splash/02.jpg',
    '/parks/europa-park/roller-coasters/atlantica-super-splash/03.jpg',
    '/parks/europa-park/roller-coasters/atlantica-super-splash/04.jpg',
    '/parks/europa-park/roller-coasters/atlantica-super-splash/05.jpg',
    '/parks/europa-park/roller-coasters/atlantica-super-splash/06.jpg',
    '/parks/europa-park/roller-coasters/atlantica-super-splash/07.jpg'
  ],
  'bobsleigh': [
    '/parks/europa-park/roller-coasters/bobsleigh/01.jpg',
    '/parks/europa-park/roller-coasters/bobsleigh/02.jpg',
    '/parks/europa-park/roller-coasters/bobsleigh/03.jpg',
    '/parks/europa-park/roller-coasters/bobsleigh/04.jpg',
    '/parks/europa-park/roller-coasters/bobsleigh/05.jpg',
    '/parks/europa-park/roller-coasters/bobsleigh/06.jpg',
    '/parks/europa-park/roller-coasters/bobsleigh/07.jpg'
  ],
  'alpenexpress': [
    '/parks/europa-park/roller-coasters/alpenexpress/01.jpg',
    '/parks/europa-park/roller-coasters/alpenexpress/02.jpg',
    '/parks/europa-park/roller-coasters/alpenexpress/03.jpg',
    '/parks/europa-park/roller-coasters/alpenexpress/04.jpg',
    '/parks/europa-park/roller-coasters/alpenexpress/05.jpg',
    '/parks/europa-park/roller-coasters/alpenexpress/06.jpg',
    '/parks/europa-park/roller-coasters/alpenexpress/07.jpg'
  ],
  'arthur': [
    '/parks/europa-park/roller-coasters/arthur/01.jpg',
    '/parks/europa-park/roller-coasters/arthur/02.jpg',
    '/parks/europa-park/roller-coasters/arthur/03.jpg',
    '/parks/europa-park/roller-coasters/arthur/04.jpg',
    '/parks/europa-park/roller-coasters/arthur/05.jpg',
    '/parks/europa-park/roller-coasters/arthur/06.jpg',
    '/parks/europa-park/roller-coasters/arthur/07.jpg'
  ]

}

const mockItemVideos = {
  'space-mountain': [
    'https://www.youtube.com/embed/watch?v=dQw4w9WgXcQ',
    'https://www.youtube.com/embed/watch?v=dQw4w9WgXcQ'
  ],
  'ratatouille-restaurant': [
    'https://www.youtube.com/embed/watch?v=dQw4w9WgXcQ'
  ],
  'disney-stars-on-parade': [
    'https://www.youtube.com/embed/watch?v=dQw4w9WgXcQ'
  ],
  'harry-potter-ride': [
    'https://www.youtube.com/embed/watch?v=dQw4w9WgXcQ'
  ],
  'hogwarts-express': [
    'https://www.youtube.com/embed/watch?v=dQw4w9WgXcQ'
  ],
  'goliath-ride': [
    'https://www.youtube.com/embed/watch?v=dQw4w9WgXcQ'
  ],
  'revolution-ride': [
    'https://www.youtube.com/embed/watch?v=dQw4w9WgXcQ'
  ],
  'magic-mountain-grill': [
    'https://www.youtube.com/embed/watch?v=dQw4w9WgXcQ'
  ],
  'smiler-ride': [
    'https://www.youtube.com/embed/watch?v=dQw4w9WgXcQ'
  ],
  'nemesis-ride': [
    'https://www.youtube.com/embed/watch?v=dQw4w9WgXcQ'
  ],
  'alton-towers-hotel': [
    'https://www.youtube.com/embed/watch?v=dQw4w9WgXcQ'
  ],
  'shambhala-ride': [
    'https://www.youtube.com/embed/watch?v=dQw4w9WgXcQ'
  ],
  'furius-baco-ride': [
    'https://www.youtube.com/embed/watch?v=dQw4w9WgXcQ'
  ],
  'ferrari-land': [
    'https://www.youtube.com/embed/watch?v=dQw4w9WgXcQ'
  ],
  'wodan': [
    'https://www.youtube.com/embed/watch?v=dQw4w9WgXcQ'
  ],
  'euromir': [
    'https://www.youtube.com/embed/watch?v=dQw4w9WgXcQ'
  ],
  'blue-fire': [
    'https://www.youtube.com/embed/watch?v=dQw4w9WgXcQ'
  ],
  'silver-star': [
    'https://www.youtube.com/embed/watch?v=dQw4w9WgXcQ'
  ],
  'matterhorn-blitz': [
    'https://www.youtube.com/embed/watch?v=dQw4w9WgXcQ'
  ],
  'pegasus': [
    'https://www.youtube.com/embed/watch?v=dQw4w9WgXcQ'
  ],
  'tiroler-wildwasserbahn': [
    'https://www.youtube.com/embed/watch?v=dQw4w9WgXcQ'
  ],
  'fjord-rafting': [
    'https://www.youtube.com/embed/watch?v=dQw4w9WgXcQ'
  ],
  'dschungel-flossfahrt': [
    'https://www.youtube.com/embed/watch?v=dQw4w9WgXcQ'
  ],
  'poseidon': [
    'https://www.youtube.com/embed/watch?v=dQw4w9WgXcQ'
  ],
  'vindjammer': [
    'https://www.youtube.com/embed/watch?v=dQw4w9WgXcQ'
  ],
  'kronasar': [
    'https://www.youtube.com/embed/watch?v=dQw4w9WgXcQ'
  ],
  'monorail-bahn': [
    'https://www.youtube.com/embed/watch?v=dQw4w9WgXcQ'
  ],
  'atlantica-super-splash': [
    'https://www.youtube.com/embed/watch?v=dQw4w9WgXcQ'
  ],
  'bobsleigh': [
    'https://www.youtube.com/embed/watch?v=dQw4w9WgXcQ'
  ],
  'alpenexpress': [
    'https://www.youtube.com/embed/watch?v=dQw4w9WgXcQ'
  ],
  'arthur': [
    'https://www.youtube.com/embed/watch?v=dQw4w9WgXcQ'
  ],
  'eurosat': [
    'https://www.youtube.com/embed/watch?v=dQw4w9WgXcQ'
  ]

}

interface ItemPageProps {
  params: Promise<{
    parkId: string
    itemId: string
  }>
}

function ItemPageContent({ park, item, category, images, videos }: { 
  park: any
  item: any
  category: any
  images: string[]
  videos: string[]
}) {
  const [reviewFilter, setReviewFilter] = useState('all')

  const mediaSlides = images.map((src, i) => ({
    src,
    alt: item.name,
    isVideo: Boolean(videos[i])
  }))

  const specs = item.specs || {}
  const hasSpecs = Object.keys(specs).length > 0

  // Mock ratings data
  const overallScore = 82
  const ratingBreakdown = {
    positive: 68,
    mixed: 22,
    negative: 10
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="mb-6">
          <Link href="/parks" className="text-blue-400 hover:text-blue-300 text-sm">Parks</Link>
          <span className="mx-2 text-gray-500">/</span>
          <Link href={`/parks/${park.id}`} className="text-blue-400 hover:text-blue-300 text-sm">{park.name}</Link>
          <span className="mx-2 text-gray-500">/</span>
          <span className="text-gray-300 text-sm">{item.name}</span>
        </nav>

        {/* Item Title */}
        <div className="mb-8">
          <h1 className="text-5xl font-bold mb-2">{item.name}</h1>
          <p className="text-gray-400 text-lg">{park.name} • {item.location_in_park}</p>
        </div>

        <div className="mb-12 grid grid-cols-1 gap-6 lg:grid-cols-3 lg:gap-8">
          <div className="lg:col-span-2">
            <SteamMediaCarousel
              key={item.id}
              slides={mediaSlides}
              autoAdvanceMs={images.length > 1 ? 5000 : undefined}
            />
          </div>
          <div className="lg:col-span-1">
            <SteamInfoPanel
              headerImage={images[0]}
              headerImageAlt={item.name}
              title={item.name}
              description={item.description}
              score={overallScore}
              scoreLabel="Overall score"
              metadata={[
                {
                  label: 'Recent reviews',
                  value: `Mostly positive (${ratingBreakdown.positive}%)`
                },
                { label: 'Category', value: category.name },
                { label: 'Area in park', value: item.location_in_park },
                ...(specs.type ? [{ label: 'Ride type', value: specs.type }] : [])
              ]}
              tags={[specs.type, specs.manufacturer, category.name].filter(Boolean) as string[]}
            >
              {hasSpecs && (
                <div className="border-t border-[#2a475e] pt-4">
                  <h3 className="mb-3 text-xs font-medium uppercase tracking-wider text-[#8f98a0]">
                    Quick facts
                  </h3>
                  <div className="space-y-2 text-sm">
                    {specs.height && (
                      <div className="flex justify-between gap-4 text-[#acb2b8]">
                        <span>Height</span>
                        <span className="text-[#c6d4df]">{specs.height}</span>
                      </div>
                    )}
                    {specs.speed && (
                      <div className="flex justify-between gap-4 text-[#acb2b8]">
                        <span>Speed</span>
                        <span className="text-[#c6d4df]">{specs.speed}</span>
                      </div>
                    )}
                    {specs.length && (
                      <div className="flex justify-between gap-4 text-[#acb2b8]">
                        <span>Length</span>
                        <span className="text-[#c6d4df]">{specs.length}</span>
                      </div>
                    )}
                    {specs.drop && (
                      <div className="flex justify-between gap-4 text-[#acb2b8]">
                        <span>Drop</span>
                        <span className="text-[#c6d4df]">{specs.drop}</span>
                      </div>
                    )}
                    {specs.manufacturer && (
                      <div className="flex justify-between gap-4 text-[#acb2b8]">
                        <span>Manufacturer</span>
                        <span className="text-[#c6d4df]">{specs.manufacturer}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </SteamInfoPanel>
          </div>
        </div>

        {/* Rating breakdown */}
        <div className="mb-12 rounded-lg bg-gray-800 p-8">
            <h3 className="text-lg font-semibold mb-6">Recent Reviews</h3>
            <div className="space-y-6">
              {/* Positive */}
              <div>
                <div className="flex justify-between items-center mb-3">
                  <span className="text-green-400 font-semibold">Overwhelmingly Positive</span>
                  <span className="text-gray-400 text-sm">({ratingBreakdown.positive}%)</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden">
                  <div
                    className="bg-green-500 h-full rounded-full"
                    style={{ width: `${ratingBreakdown.positive}%` }}
                  ></div>
                </div>
              </div>

              {/* Mixed */}
              <div>
                <div className="flex justify-between items-center mb-3">
                  <span className="text-yellow-400 font-semibold">Mixed</span>
                  <span className="text-gray-400 text-sm">({ratingBreakdown.mixed}%)</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden">
                  <div
                    className="bg-yellow-500 h-full rounded-full"
                    style={{ width: `${ratingBreakdown.mixed}%` }}
                  ></div>
                </div>
              </div>

              {/* Negative */}
              <div>
                <div className="flex justify-between items-center mb-3">
                  <span className="text-red-400 font-semibold">Overwhelmingly Negative</span>
                  <span className="text-gray-400 text-sm">({ratingBreakdown.negative}%)</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden">
                  <div
                    className="bg-red-500 h-full rounded-full"
                    style={{ width: `${ratingBreakdown.negative}%` }}
                  ></div>
                </div>
              </div>
            </div>
        </div>

        {/* Rating System */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold mb-6">Rate This Experience</h2>
          <RatingComponent item={item} category={category} />
        </div>

        {/* Reviews Section with Filter Tabs */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold mb-6">All Reviews</h2>

          {/* Filter Tabs */}
          <div className="flex gap-2 mb-8 overflow-x-auto pb-2 border-b border-gray-700">
            {[
              { id: 'all', label: 'All Reviews' },
              { id: 'positive', label: 'Positive Reviews' },
              { id: 'mixed', label: 'Mixed Reviews' },
              { id: 'negative', label: 'Negative Reviews' },
              { id: 'funny', label: 'Funny Reviews' }
            ].map((filter) => (
              <button
                key={filter.id}
                onClick={() => setReviewFilter(filter.id)}
                className={`px-4 py-2 whitespace-nowrap font-medium transition-colors ${
                  reviewFilter === filter.id
                    ? 'text-blue-400 border-b-2 border-blue-400'
                    : 'text-gray-400 hover:text-gray-300'
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>

          {/* Mock Reviews */}
          <div className="space-y-6">
            {[
              {
                author: 'Sarah M.',
                score: 92,
                title: 'Absolutely thrilling!',
                text: 'One of the best rides I\'ve ever experienced. The speed and intensity are incredible!'
              },
              {
                author: 'John D.',
                score: 68,
                title: 'Great but queue was long',
                text: 'The ride itself is fantastic, but I waited 90 minutes. Worth it, but plan accordingly.'
              },
              {
                author: 'Emma K.',
                score: 88,
                title: 'Perfect for thrill seekers',
                text: 'Exceeded all my expectations. The engineering is impressive and it\'s smooth despite the intensity.'
              }
            ].map((review, idx) => {
              const getScoreColor = (score: number) => {
                if (score >= 75) return '#10b981' // green
                if (score >= 50) return '#f59e0b' // yellow/orange
                return '#ef4444' // red
              }

              return (
                <div key={idx} className="bg-gray-800 rounded-lg p-6 flex gap-6 items-start">
                  {/* Score Circle */}
                  <div className="flex-shrink-0">
                    <svg className="w-20 h-20" viewBox="0 0 100 100">
                      <circle cx="50" cy="50" r="45" fill="none" stroke="#374151" strokeWidth="2" />
                      <circle
                        cx="50"
                        cy="50"
                        r="45"
                        fill="none"
                        stroke={getScoreColor(review.score)}
                        strokeWidth="2"
                        strokeDasharray={`${(review.score / 100) * 282.7}`}
                        strokeDashoffset="0"
                        strokeLinecap="round"
                        style={{ transform: 'rotate(-90deg)', transformOrigin: '50% 50%' }}
                      />
                      <text
                        x="50"
                        y="50"
                        textAnchor="middle"
                        dy="0.3em"
                        className="fill-gray-200 font-bold"
                        style={{ fontSize: '28px' }}
                      >
                        {review.score}
                      </text>
                    </svg>
                  </div>

                  {/* Review Content */}
                  <div className="flex-1">
                    <div className="mb-3">
                      <span className="font-semibold text-gray-200 text-lg">{review.author}</span>
                    </div>
                    <p className="text-base font-medium text-gray-300 mb-2">{review.title}</p>
                    <p className="text-sm text-gray-400 leading-relaxed">{review.text}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Back Button */}
        <div className="flex justify-center mb-8">
          <Link
            href={`/parks/${park.id}`}
            className="bg-blue-600 hover:bg-blue-700 px-8 py-3 rounded-lg font-semibold transition-colors"
          >
            Back to {park.name}
          </Link>
        </div>
      </div>
    </div>
  )
}

export default async function ItemPage({ params }: ItemPageProps) {
  const { parkId, itemId } = await params
  const park = mockParks.find(p => p.id === parkId)
  const items = mockItems[parkId as keyof typeof mockItems] || []
  const item = items.find(i => i.id === itemId)
  const category = mockCategories.find(c => c.id === item?.category_id)
  const images = mockItemImages[itemId as keyof typeof mockItemImages] || []
  const videos = mockItemVideos[itemId as keyof typeof mockItemVideos] || []

  if (!park || !item || !category) {
    notFound()
  }

  return <ItemPageContent park={park} item={item} category={category} images={images} videos={videos} />
}