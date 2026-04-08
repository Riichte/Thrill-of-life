/** Cards for the home page marquee rows (kept in sync with park / attraction routes). */

export type HomeMarqueeCard = {
  id: string
  href: string
  image: string
  title: string
  subtitle?: string
}

const EP = '/parks/europa-park'

/** Same parks as `app/parks/page.tsx` — link to static Europa route when applicable. */
export const homeParkCards: HomeMarqueeCard[] = [
  {
    id: 'alton-towers',
    href: '/parks/alton-towers',
    image: '/Parks/Alton Towers/main.jpg',
    title: 'Alton Towers',
    subtitle: 'United Kingdom'
  },
  {
    id: 'bellewaerde',
    href: '/parks/bellewaerde',
    image: '/Parks/Bellewaerde/main.jpg',
    title: 'Bellewaerde',
    subtitle: 'Belgium'
  },
  {
    id: 'blackpool-pleasure-beach',
    href: '/parks/blackpool-pleasure-beach',
    image: '/Parks/Blackpool Pleasure Beach/main.jpg',
    title: 'Blackpool Pleasure Beach',
    subtitle: 'United Kingdom'
  },
  {
    id: 'bobbejaanland',
    href: '/parks/bobbejaanland',
    image: '/Parks/Bobbejaanland/main.jpg',
    title: 'Bobbejaanland',
    subtitle: 'Belgium'
  },
  {
    id: 'disneyland-paris',
    href: '/parks/disneyland-paris',
    image: '/Parks/Disneyland Paris/main.jpg',
    title: 'Disneyland Paris',
    subtitle: 'France'
  },
  {
    id: 'europa-park',
    href: EP,
    image: '/Parks/Europa Park/Main.jpg',
    title: 'Europa Park',
    subtitle: 'Germany'
  },
  {
    id: 'six-flags-great-escape',
    href: '/parks/six-flags-great-escape',
    image: '/Parks/Six Flags Great Escape/main.jpg',
    title: 'Six Flags Great Escape',
    subtitle: 'United States'
  }
]

const epImg = (path: string) => `/Parks/Europa Park/${path}`

export const homeRollerCoasterCards: HomeMarqueeCard[] = [
  { id: 'wodan', href: `${EP}/wodan`, image: epImg('Roller Coasters/Wodan/Main.jpg'), title: 'Wodan', subtitle: 'Europa Park' },
  { id: 'euromir', href: `${EP}/euromir`, image: epImg('Roller Coasters/Euromir/Main.jpg'), title: 'Euromir', subtitle: 'Europa Park' },
  { id: 'blue-fire', href: `${EP}/blue-fire`, image: epImg('Roller Coasters/Blue Fire/Main.jpg'), title: 'Blue Fire', subtitle: 'Europa Park' },
  { id: 'silver-star', href: `${EP}/silver-star`, image: epImg('Roller Coasters/Silver Star/main.jpg'), title: 'Silver Star', subtitle: 'Europa Park' },
  { id: 'matterhorn-blitz', href: `${EP}/matterhorn-blitz`, image: epImg('Roller Coasters/Matterhorn Blitz/Main.jpg'), title: 'Matterhorn Blitz', subtitle: 'Europa Park' },
  { id: 'pegasus', href: `${EP}/pegasus`, image: epImg('Roller Coasters/Pegasus/Main.jpg'), title: 'Pegasus', subtitle: 'Europa Park' },
  { id: 'poseidon', href: `${EP}/poseidon`, image: epImg('Roller Coasters/Poseidon/Main.jpg'), title: 'Poseidon', subtitle: 'Europa Park' },
  { id: 'eurosat', href: `${EP}/eurosat`, image: epImg('Roller Coasters/Eurosat/Main.jpg'), title: 'Eurosat', subtitle: 'Europa Park' },
  { id: 'atlantica-super-splash', href: `${EP}/atlantica-super-splash`, image: epImg('Roller Coasters/Atlantica Super Splash/main.jpg'), title: 'Atlantica Super Splash', subtitle: 'Europa Park' },
  { id: 'bobsleigh', href: `${EP}/bobsleigh`, image: epImg('Roller Coasters/Bobsleigh/main.jpg'), title: 'Bobsleigh', subtitle: 'Europa Park' },
  { id: 'alpenexpress', href: `${EP}/alpenexpress`, image: epImg('Roller Coasters/AlpenExpress/Main.jpg'), title: 'Alpenexpress', subtitle: 'Europa Park' },
  { id: 'arthur', href: `${EP}/arthur`, image: epImg('Roller Coasters/Arthur/Main.jpg'), title: 'Arthur', subtitle: 'Europa Park' }
]

export const homeWaterRideCards: HomeMarqueeCard[] = [
  {
    id: 'tiroler-wildwasserbahn',
    href: `${EP}/tiroler-wildwasserbahn`,
    image: epImg('Water Rides/Tiroler Wildwasserbahn/Main.jpg'),
    title: 'Tiroler Wildwasserbahn',
    subtitle: 'Europa Park'
  },
  {
    id: 'fjord-rafting',
    href: `${EP}/fjord-rafting`,
    image: epImg('Water Rides/Fjord Rafting/Main.jpg'),
    title: 'Fjord Rafting',
    subtitle: 'Europa Park'
  }
]

export const homeMoreHighlightCards: HomeMarqueeCard[] = [
  {
    id: 'dschungel-flossfahrt',
    href: `${EP}/dschungel-flossfahrt`,
    image: epImg('Dark Rides/Dschungel-Floßfahrt/main.jpg'),
    title: 'Dschungel-Floßfahrt',
    subtitle: 'Dark ride · Europa Park'
  },
  {
    id: 'vindjammer',
    href: `${EP}/vindjammer`,
    image: epImg('Flat Rides/Vindjammer/Main.jpg'),
    title: 'Vindjammer',
    subtitle: 'Flat ride · Europa Park'
  },
  {
    id: 'kronasar',
    href: `${EP}/kronasar`,
    image: epImg('Hotels/Kronasar/Main.jpg'),
    title: 'Hotel Kronasar',
    subtitle: 'Resort · Europa Park'
  },
  {
    id: 'monorail-bahn',
    href: `${EP}/monorail-bahn`,
    image: epImg('Transport/Monorail Bahn/main.jpg'),
    title: 'Monorail Bahn',
    subtitle: 'Transport · Europa Park'
  }
]
