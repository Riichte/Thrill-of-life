export const mockParks = [
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

export const mockCategories = [
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

export const mockItems: Record<string, any[]> = {
  'disneyland-paris': [
    { id: 'space-mountain', category_id: 'rides', name: 'Space Mountain', description: 'A thrilling indoor roller coaster through the darkness of space.', location_in_park: 'Discoveryland', specs: { height: '42m', speed: '65 km/h', length: '900m', drop: '35m', manufacturer: 'Vekoma', type: 'Indoor Roller Coaster' } },
    { id: 'ratatouille-restaurant', category_id: 'restaurants', name: 'Bistrot Chez Rémy', description: 'Experience fine French dining inspired by Ratatouille.', location_in_park: 'Main Street, U.S.A.' },
    { id: 'disney-stars-on-parade', category_id: 'shows', name: 'Disney Stars on Parade', description: 'A spectacular parade featuring Disney characters.', location_in_park: 'Main Street, U.S.A.' }
  ],
  'universal-florida': [
    { id: 'harry-potter-ride', category_id: 'rides', name: 'Harry Potter and the Forbidden Journey', description: 'An immersive ride through the Wizarding World of Harry Potter.', location_in_park: 'The Wizarding World of Harry Potter', specs: { height: '42m', speed: '60 km/h', length: '1000m', drop: '28m', manufacturer: 'Bolliger & Mabillard', type: 'Roller Coaster' } },
    { id: 'hogwarts-express', category_id: 'restaurants', name: 'The Three Broomsticks', description: 'Authentic British pub fare in Hogsmeade.', location_in_park: 'The Wizarding World of Harry Potter' }
  ],
  'six-flags-magic-mountain': [
    { id: 'goliath-ride', category_id: 'rides', name: 'Goliath', description: 'One of the tallest, fastest roller coasters in the world.', location_in_park: 'Colossus County Fair', specs: { height: '127m', speed: '147 km/h', length: '1645m', drop: '127m', manufacturer: 'Bolliger & Mabillard', type: 'Hypercoaster' } },
    { id: 'revolution-ride', category_id: 'rides', name: 'Revolution', description: "The world's first modern roller coaster loop.", location_in_park: 'Frontier Town', specs: { height: '32m', speed: '85 km/h', length: '900m', drop: '29m', manufacturer: 'Arrow Dynamics', type: 'Looping Coaster' } },
    { id: 'magic-mountain-grill', category_id: 'restaurants', name: 'Magic Mountain Grill', description: 'Premium dining with spectacular park views.', location_in_park: 'Main Plaza' }
  ],
  'alton-towers': [
    { id: 'smiler-ride', category_id: 'rides', name: 'The Smiler', description: "The world's most looped roller coaster with 14 inversions.", location_in_park: 'The Smiler Area', specs: { height: '37m', speed: '117 km/h', length: '1426m', drop: '37m', manufacturer: 'Bolliger & Mabillard', type: 'Inversion Coaster' } },
    { id: 'nemesis-ride', category_id: 'rides', name: 'Nemesis', description: 'An iconic inverted roller coaster that has thrilled guests for decades.', location_in_park: 'X-Sector', specs: { height: '35m', speed: '80 km/h', length: '650m', drop: '35m', manufacturer: 'Bolliger & Mabillard', type: 'Inverted Coaster' } },
    { id: 'alton-towers-hotel', category_id: 'hotels', name: 'Alton Towers Hotel', description: 'Luxury accommodation in the historic grounds of Alton Towers.', location_in_park: 'Hotel Area' }
  ],
  'port-adventure': [
    { id: 'shambhala-ride', category_id: 'rides', name: 'Shambhala', description: "Europe's highest and steepest hypercoaster.", location_in_park: 'Far West', specs: { height: '78m', speed: '135 km/h', length: '1715m', drop: '74m', manufacturer: 'Bolliger & Mabillard', type: 'Hypercoaster' } },
    { id: 'furius-baco-ride', category_id: 'rides', name: 'Furius Baco', description: 'A high-speed roller coaster that launches you at incredible velocity.', location_in_park: 'Mediterranean', specs: { height: '33m', speed: '140 km/h', length: '1650m', drop: '33m', manufacturer: 'Intamin', type: 'Launch Coaster' } },
    { id: 'ferrari-land', category_id: 'shops', name: 'Ferrari Land Shop', description: 'Exclusive Ferrari merchandise and memorabilia for collectors.', location_in_park: 'Ferrari Land', specs: { height: '33m', speed: '140 km/h', length: '1650m', drop: '33m', manufacturer: 'Intamin', type: 'Giga Coaster' } }
  ],
  'europa-park': [
    { id: 'wodan', category_id: 'roller-coasters', name: 'Wodan', description: 'A thrilling wooden roller coaster with breathtaking drops and high speeds.', location_in_park: 'Iceland', specs: { height: '40m', speed: '100 km/h', length: '1050m', drop: '35m', manufacturer: 'Bolliger & Mabillard', type: 'Wooden Coaster' } },
    { id: 'euromir', category_id: 'roller-coasters', name: 'Euromir', description: 'A looping roller coaster that simulates a journey to space.', location_in_park: 'France', specs: { height: '35m', speed: '80 km/h', length: '850m', drop: '30m', manufacturer: 'Bolliger & Mabillard', type: 'Spinning Coaster' } },
    { id: 'blue-fire', category_id: 'roller-coasters', name: 'Blue Fire', description: 'A high-speed launched coaster that propels riders through intense inversions.', location_in_park: 'Iceland', specs: { height: '38m', speed: '100 km/h', length: '1056m', drop: '30m', manufacturer: 'Mack Rides', type: 'Launched Coaster' } },
    { id: 'silver-star', category_id: 'roller-coasters', name: 'Silver Star', description: 'A towering hypercoaster with breathtaking views and heart-pounding drops.', location_in_park: 'France', specs: { height: '73m', speed: '127 km/h', length: '1620m', drop: '73m', manufacturer: 'Bolliger & Mabillard', type: 'Hypercoaster' } },
    { id: 'matterhorn-blitz', category_id: 'roller-coasters', name: 'Matterhorn Blitz', description: 'A wild bobsled coaster through alpine scenery.', location_in_park: 'Switzerland', specs: { height: '12m', speed: '50 km/h', length: '320m', drop: '10m', manufacturer: 'Mack Rides', type: 'Wild Mouse Coaster' } },
    { id: 'pegasus', category_id: 'roller-coasters', name: 'Pegasus', description: 'A family-friendly coaster with gentle drops and smooth curves.', location_in_park: 'Greece', specs: { height: '8m', speed: '40 km/h', length: '200m', drop: '6m', manufacturer: 'Mack Rides', type: 'Family Coaster' } },
    { id: 'tiroler-wildwasserbahn', category_id: 'water-rides', name: 'Tiroler Wildwasserbahn', description: 'An exciting log flume ride through alpine scenery.', location_in_park: 'Austria', specs: { height: '15m', speed: 'Variable', length: '450m', drop: '12m', manufacturer: 'Mack Rides', type: 'Log Flume' } },
    { id: 'fjord-rafting', category_id: 'water-rides', name: 'Fjord Rafting', description: 'A rapid river adventure ride through Norwegian fjord scenery.', location_in_park: 'Scandinavia', specs: { height: '8m', speed: 'Variable', length: '360m', drop: '5m', manufacturer: 'Intamin', type: 'Rafting Ride' } },
    { id: 'dschungel-flossfahrt', category_id: 'dark-rides', name: 'Dschungel-Floßfahrt', description: 'A relaxing boat ride through lush jungle scenery.', location_in_park: 'Adventureland', specs: { height: '3m', speed: 'Variable', length: '300m', drop: '2m', manufacturer: 'Mack Rides', type: 'Water Coaster' } },
    { id: 'poseidon', category_id: 'roller-coasters', name: 'Poseidon', description: 'A thrilling water coaster combining roller coaster elements with water ride excitement.', location_in_park: 'Greece', specs: { height: '28m', speed: '70 km/h', length: '430m', drop: '23m', manufacturer: 'Mack Rides', type: 'Water Coaster' } },
    { id: 'eurosat', category_id: 'roller-coasters', name: 'Eurosat', description: 'A high-speed roller coaster with multiple inversions.', location_in_park: 'France', specs: { height: '32m', speed: '90 km/h', length: '380m', drop: '28m', manufacturer: 'Bolliger & Mabillard', type: 'Indoor Coaster' } },
    { id: 'vindjammer', category_id: 'flat-rides', name: 'Vindjammer', description: 'A swinging ship ride with increasing intensity.', location_in_park: 'Scandinavia', specs: { height: '15m', speed: 'Variable', length: 'N/A', drop: 'N/A', manufacturer: 'HUSS Park Attractions', type: 'Swinging Ship' } },
    { id: 'kronasar', category_id: 'hotels', name: 'Hotel Kronasar', description: 'A luxurious hotel inspired by Scandinavian design.', location_in_park: 'Resort', specs: { rooms: '120', theme: 'Scandinavian', facilities: 'Restaurant, Bar, Spa', rating: '4-star' } },
    { id: 'monorail-bahn', category_id: 'transport', name: 'Monorail Bahn', description: 'A convenient monorail system connecting park areas.', location_in_park: 'Parkwide', specs: { type: 'Monorail', capacity: '60 passengers', speed: '20 km/h', length: '2.8 km' } },
    { id: 'atlantica-super-splash', category_id: 'roller-coasters', name: 'Atlantica Super Splash', description: 'A thrilling water coaster with high-speed drops.', location_in_park: 'Portugal', specs: { height: '25m', speed: '70 km/h', length: '400m', drop: '20m', manufacturer: 'Mack Rides', type: 'Water Coaster' } },
    { id: 'bobsleigh', category_id: 'roller-coasters', name: 'Bobsleigh', description: 'A bobsled coaster simulating Olympic bobsledding.', location_in_park: 'Switzerland', specs: { height: '10m', speed: '45 km/h', length: '280m', drop: '8m', manufacturer: 'Mack Rides', type: 'Bobsled Coaster' } },
    { id: 'alpenexpress', category_id: 'roller-coasters', name: 'Alpenexpress', description: 'A mountain train ride through scenic alpine landscapes.', location_in_park: 'Austria', specs: { height: '5m', speed: 'Variable', length: '350m', drop: '3m', manufacturer: 'Mack Rides', type: 'Powered Coaster' } },
    { id: 'arthur', category_id: 'roller-coasters', name: 'Arthur', description: 'A family-friendly roller coaster with gentle curves.', location_in_park: 'Kingdom of the Minimoys', specs: { height: '12m', speed: '50 km/h', length: '250m', drop: '9m', manufacturer: 'Mack Rides', type: 'Family Coaster' } }
  ]
}

export const mockItemImages: Record<string, string[]> = {
  'space-mountain': ['https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&h=600&fit=crop&crop=center', 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop&crop=center', 'https://images.unsplash.com/photo-1551632436-cbf8dd35adfa?w=800&h=600&fit=crop&crop=center'],
  'ratatouille-restaurant': ['https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop&crop=center'],
  'disney-stars-on-parade': ['https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop&crop=center'],
  'harry-potter-ride': ['https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&h=600&fit=crop&crop=center'],
  'hogwarts-express': ['https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop&crop=center'],
  'goliath-ride': ['https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&h=600&fit=crop&crop=center'],
  'revolution-ride': ['https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop&crop=center'],
  'magic-mountain-grill': ['https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop&crop=center'],
  'smiler-ride': ['https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&h=600&fit=crop&crop=center'],
  'nemesis-ride': ['https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop&crop=center'],
  'alton-towers-hotel': ['https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop&crop=center'],
  'shambhala-ride': ['https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&h=600&fit=crop&crop=center'],
  'furius-baco-ride': ['https://images.unsplash.com/photo-1551632436-cbf8dd35adfa?w=800&h=600&fit=crop&crop=center'],
  'ferrari-land': ['https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop&crop=center'],
  'wodan': ['/parks/europa-park/roller-coasters/wodan/01.jpg', '/parks/europa-park/roller-coasters/wodan/02.jpg', '/parks/europa-park/roller-coasters/wodan/03.jpg', '/parks/europa-park/roller-coasters/wodan/04.jpg', '/parks/europa-park/roller-coasters/wodan/05.jpg', '/parks/europa-park/roller-coasters/wodan/06.jpg', '/parks/europa-park/roller-coasters/wodan/07.jpg'],
  'euromir': ['/parks/europa-park/roller-coasters/euromir/01.jpg', '/parks/europa-park/roller-coasters/euromir/02.jpg', '/parks/europa-park/roller-coasters/euromir/03.jpg', '/parks/europa-park/roller-coasters/euromir/04.jpg', '/parks/europa-park/roller-coasters/euromir/05.jpg', '/parks/europa-park/roller-coasters/euromir/06.jpg', '/parks/europa-park/roller-coasters/euromir/07.jpg'],
  'blue-fire': ['/parks/europa-park/roller-coasters/blue-fire/01.jpg', '/parks/europa-park/roller-coasters/blue-fire/02.jpg', '/parks/europa-park/roller-coasters/blue-fire/03.jpg', '/parks/europa-park/roller-coasters/blue-fire/04.jpg', '/parks/europa-park/roller-coasters/blue-fire/05.jpg', '/parks/europa-park/roller-coasters/blue-fire/06.jpg'],
  'silver-star': ['/parks/europa-park/roller-coasters/silver-star/01.jpg', '/parks/europa-park/roller-coasters/silver-star/02.jpg', '/parks/europa-park/roller-coasters/silver-star/03.jpg', '/parks/europa-park/roller-coasters/silver-star/04.jpg', '/parks/europa-park/roller-coasters/silver-star/05.jpg', '/parks/europa-park/roller-coasters/silver-star/main.jpg'],
  'matterhorn-blitz': ['/parks/europa-park/roller-coasters/matterhorn-blitz/01.jpg', '/parks/europa-park/roller-coasters/matterhorn-blitz/02.jpg', '/parks/europa-park/roller-coasters/matterhorn-blitz/03.jpg', '/parks/europa-park/roller-coasters/matterhorn-blitz/04.jpg'],
  'pegasus': ['/parks/europa-park/roller-coasters/pegasus/01.jpg', '/parks/europa-park/roller-coasters/pegasus/02.jpg', '/parks/europa-park/roller-coasters/pegasus/03.jpg'],
  'tiroler-wildwasserbahn': ['/parks/europa-park/water-rides/tiroler-wildwasserbahn/01.jpg', '/parks/europa-park/water-rides/tiroler-wildwasserbahn/02.jpg', '/parks/europa-park/water-rides/tiroler-wildwasserbahn/03.jpg', '/parks/europa-park/water-rides/tiroler-wildwasserbahn/04.jpg', '/parks/europa-park/water-rides/tiroler-wildwasserbahn/05.jpg', '/parks/europa-park/water-rides/tiroler-wildwasserbahn/06.jpg', '/parks/europa-park/water-rides/tiroler-wildwasserbahn/07.jpg'],
  'fjord-rafting': ['/parks/europa-park/water-rides/fjord-rafting/01.jpg', '/parks/europa-park/water-rides/fjord-rafting/02.jpg', '/parks/europa-park/water-rides/fjord-rafting/03.jpg', '/parks/europa-park/water-rides/fjord-rafting/04.jpg'],
  'dschungel-flossfahrt': ['/parks/europa-park/dark-rides/dschungel-floßfahrt/01.jpg', '/parks/europa-park/dark-rides/dschungel-floßfahrt/02.jpg', '/parks/europa-park/dark-rides/dschungel-floßfahrt/03.jpg', '/parks/europa-park/dark-rides/dschungel-floßfahrt/04.jpg', '/parks/europa-park/dark-rides/dschungel-floßfahrt/05.jpg', '/parks/europa-park/dark-rides/dschungel-floßfahrt/06.jpg', '/parks/europa-park/dark-rides/dschungel-floßfahrt/main.jpg'],
  'poseidon': ['/parks/europa-park/roller-coasters/poseidon/01.jpg', '/parks/europa-park/roller-coasters/poseidon/02.jpg', '/parks/europa-park/roller-coasters/poseidon/03.jpg', '/parks/europa-park/roller-coasters/poseidon/05.jpg'],
  'eurosat': ['/parks/europa-park/roller-coasters/eurosat/01.jpg', '/parks/europa-park/roller-coasters/eurosat/02.jpg', '/parks/europa-park/roller-coasters/eurosat/03.jpg', '/parks/europa-park/roller-coasters/eurosat/04.jpg'],
  'vindjammer': ['/parks/europa-park/flat-rides/vindjammer/01.jpg', '/parks/europa-park/flat-rides/vindjammer/02.jpg', '/parks/europa-park/flat-rides/vindjammer/03.jpg'],
  'kronasar': ['/parks/europa-park/hotels/kronasar/01.jpg'],
  'monorail-bahn': ['/parks/europa-park/transport/monorail-bahn/01.jpg', '/parks/europa-park/transport/monorail-bahn/02.jpg', '/parks/europa-park/transport/monorail-bahn/main.jpg'],
  'atlantica-super-splash': ['/parks/europa-park/roller-coasters/atlantica-super-splash/01.jpg', '/parks/europa-park/roller-coasters/atlantica-super-splash/03.jpg', '/parks/europa-park/roller-coasters/atlantica-super-splash/main.jpg'],
  'bobsleigh': ['/parks/europa-park/roller-coasters/bobsleigh/main.jpg'],
  'alpenexpress': ['/parks/europa-park/roller-coasters/alpenexpress/01.jpg', '/parks/europa-park/roller-coasters/alpenexpress/02.jpg', '/parks/europa-park/roller-coasters/alpenexpress/03.jpg'],
  'arthur': ['/parks/europa-park/roller-coasters/arthur/01.jpg', '/parks/europa-park/roller-coasters/arthur/02.jpg', '/parks/europa-park/roller-coasters/arthur/03.jpg']
}

export const mockItemVideos: Record<string, string[]> = {
  'space-mountain': ['https://www.youtube.com/embed/watch?v=dQw4w9WgXcQ'],
  'ratatouille-restaurant': ['https://www.youtube.com/embed/watch?v=dQw4w9WgXcQ'],
  'disney-stars-on-parade': ['https://www.youtube.com/embed/watch?v=dQw4w9WgXcQ'],
  'harry-potter-ride': ['https://www.youtube.com/embed/watch?v=dQw4w9WgXcQ'],
  'hogwarts-express': ['https://www.youtube.com/embed/watch?v=dQw4w9WgXcQ'],
  'goliath-ride': ['https://www.youtube.com/embed/watch?v=dQw4w9WgXcQ'],
  'revolution-ride': ['https://www.youtube.com/embed/watch?v=dQw4w9WgXcQ'],
  'magic-mountain-grill': ['https://www.youtube.com/embed/watch?v=dQw4w9WgXcQ'],
  'smiler-ride': ['https://www.youtube.com/embed/watch?v=dQw4w9WgXcQ'],
  'nemesis-ride': ['https://www.youtube.com/embed/watch?v=dQw4w9WgXcQ'],
  'alton-towers-hotel': ['https://www.youtube.com/embed/watch?v=dQw4w9WgXcQ'],
  'shambhala-ride': ['https://www.youtube.com/embed/watch?v=dQw4w9WgXcQ'],
  'furius-baco-ride': ['https://www.youtube.com/embed/watch?v=dQw4w9WgXcQ'],
  'ferrari-land': ['https://www.youtube.com/embed/watch?v=dQw4w9WgXcQ'],
  'wodan': ['https://www.youtube.com/embed/watch?v=dQw4w9WgXcQ'],
  'euromir': ['https://www.youtube.com/embed/watch?v=dQw4w9WgXcQ'],
  'blue-fire': ['https://www.youtube.com/embed/watch?v=dQw4w9WgXcQ'],
  'silver-star': ['https://www.youtube.com/embed/watch?v=dQw4w9WgXcQ'],
  'matterhorn-blitz': ['https://www.youtube.com/embed/watch?v=dQw4w9WgXcQ'],
  'pegasus': ['https://www.youtube.com/embed/watch?v=dQw4w9WgXcQ'],
  'tiroler-wildwasserbahn': ['https://www.youtube.com/embed/watch?v=dQw4w9WgXcQ'],
  'fjord-rafting': ['https://www.youtube.com/embed/watch?v=dQw4w9WgXcQ'],
  'dschungel-flossfahrt': ['https://www.youtube.com/embed/watch?v=dQw4w9WgXcQ'],
  'poseidon': ['https://www.youtube.com/embed/watch?v=dQw4w9WgXcQ'],
  'vindjammer': ['https://www.youtube.com/embed/watch?v=dQw4w9WgXcQ'],
  'kronasar': ['https://www.youtube.com/embed/watch?v=dQw4w9WgXcQ'],
  'monorail-bahn': ['https://www.youtube.com/embed/watch?v=dQw4w9WgXcQ'],
  'atlantica-super-splash': ['https://www.youtube.com/embed/watch?v=dQw4w9WgXcQ'],
  'bobsleigh': ['https://www.youtube.com/embed/watch?v=dQw4w9WgXcQ'],
  'alpenexpress': ['https://www.youtube.com/embed/watch?v=dQw4w9WgXcQ'],
  'arthur': ['https://www.youtube.com/embed/watch?v=dQw4w9WgXcQ'],
  'eurosat': ['https://www.youtube.com/embed/watch?v=dQw4w9WgXcQ']
}