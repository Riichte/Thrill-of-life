export const europaPark = {
  id: 'europa-park',
  name: 'Europa Park',
  logo_url: '/parks/europa-park/logo.png',
  banner_url: '/parks/europa-park/main.jpg',
  description: 'Europa-Park is a theme park in Rust, Germany. It is Europe\'s second most popular theme park resort according to the TEA/AECOM 2018 Global Attractions Attendance Report with 5.8 million visitors per year.',
  location: 'Rust, Germany'
}

export const categories = [
  { id: 'roller-coasters', name: 'Roller Coasters', image: '/parks/europa-park/roller-coasters/wodan/main.jpg' },
  { id: 'dark-rides', name: 'Dark Rides', image: '/parks/europa-park/main.jpg' },
  { id: 'flat-rides', name: 'Flat Rides', image: '/parks/europa-park/flat-rides/vindjammer/main.jpg' },
  { id: 'water-rides', name: 'Water Rides', image: '/parks/europa-park/water-rides/tiroler-wildwasserbahn/main.jpg' },
  { id: 'shows', name: 'Shows', image: '/parks/europa-park/main.jpg' },
  { id: 'restaurants', name: 'Restaurants', image: '/parks/europa-park/main.jpg' },
  { id: 'hotels', name: 'Hotels', image: '/parks/europa-park/main.jpg' }
]

export const featuredRides = [
  {
    id: 'wodan',
    name: 'Wodan',
    category: 'roller-coasters',
    description: 'A thrilling wooden roller coaster with breathtaking drops and high speeds.',
    image: '/parks/europa-park/roller-coasters/wodan/main.jpg',
    logo: '/parks/europa-park/roller-coasters/wodan/logo.png',
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
    image: '/parks/europa-park/roller-coasters/euromir/main.jpg',
    logo: '/parks/europa-park/roller-coasters/euromir/logo.png',
    specs: {
      height: '35m',
      speed: '80 km/h',
      length: '850m'
    }
  }
]

export const carouselImages = [
  '/parks/europa-park/main.jpg',
  '/parks/europa-park/01.jpg',
  '/parks/europa-park/02.jpg',
  '/parks/europa-park/03.jpg',
  '/parks/europa-park/04.jpg',
  '/parks/europa-park/05.jpg',
  '/parks/europa-park/06.jpg',
  '/parks/europa-park/07.jpg'
]