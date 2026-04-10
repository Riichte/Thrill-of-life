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
    image: '/parks/europa park/main.jpg',
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

const epImg = (path: string) => `/parks/europa park/${path}`

export const homeRollerCoasterCards: HomeMarqueeCard[] = [
  { id: 'wodan', href: `${EP}/wodan`, image: epImg('roller coasters/wodan/main.jpg'), title: 'Wodan', subtitle: 'Europa Park' },
  { id: 'euromir', href: `${EP}/euromir`, image: epImg('roller coasters/euromir/main.jpg'), title: 'Euromir', subtitle: 'Europa Park' },
  { id: 'blue-fire', href: `${EP}/blue-fire`, image: epImg('roller coasters/blue fire/main.jpg'), title: 'Blue Fire', subtitle: 'Europa Park' },
  { id: 'silver-star', href: `${EP}/silver-star`, image: epImg('roller coasters/silver star/main.jpg'), title: 'Silver Star', subtitle: 'Europa Park' },
  { id: 'matterhorn-blitz', href: `${EP}/matterhorn-blitz`, image: epImg('roller coasters/matterhorn blitz/main.jpg'), title: 'Matterhorn Blitz', subtitle: 'Europa Park' },
  { id: 'pegasus', href: `${EP}/pegasus`, image: epImg('roller coasters/pegasus/main.jpg'), title: 'Pegasus', subtitle: 'Europa Park' },
  { id: 'poseidon', href: `${EP}/poseidon`, image: epImg('roller coasters/poseidon/main.jpg'), title: 'Poseidon', subtitle: 'Europa Park' },
  { id: 'eurosat', href: `${EP}/eurosat`, image: epImg('roller coasters/eurosat/main.jpg'), title: 'Eurosat', subtitle: 'Europa Park' },
  { id: 'atlantica-super-splash', href: `${EP}/atlantica-super-splash`, image: epImg('roller coasters/atlantica super splash/main.jpg'), title: 'Atlantica Super Splash', subtitle: 'Europa Park' },
  { id: 'bobsleigh', href: `${EP}/bobsleigh`, image: epImg('roller coasters/bobsleigh/main.jpg'), title: 'Bobsleigh', subtitle: 'Europa Park' },
  { id: 'alpenexpress', href: `${EP}/alpenexpress`, image: epImg('roller coasters/alpenexpress/main.jpg'), title: 'Alpenexpress', subtitle: 'Europa Park' },
  { id: 'arthur', href: `${EP}/arthur`, image: epImg('roller coasters/arthur/main.jpg'), title: 'Arthur', subtitle: 'Europa Park' }
]

export const homeWaterRideCards: HomeMarqueeCard[] = [
  {
    id: 'tiroler-wildwasserbahn',
    href: `${EP}/tiroler-wildwasserbahn`,
    image: epImg('water rides/tiroler wildwasserbahn/main.jpg'),
    title: 'Tiroler Wildwasserbahn',
    subtitle: 'Europa Park'
  },
  {
    id: 'fjord-rafting',
    href: `${EP}/fjord-rafting`,
    image: epImg('water rides/fjord rafting/main.jpg'),
    title: 'Fjord Rafting',
    subtitle: 'Europa Park'
  }
]

export const homeMoreHighlightCards: HomeMarqueeCard[] = [
  {
    id: 'dschungel-flossfahrt',
    href: `${EP}/dschungel-flossfahrt`,
    image: epImg('dark rides/dschungel-flossfahrt/main.jpg'),
    title: 'Dschungel-Floßfahrt',
    subtitle: 'Dark ride · Europa Park'
  },
  {
    id: 'vindjammer',
    href: `${EP}/vindjammer`,
    image: epImg('flat rides/vindjammer/main.jpg'),
    title: 'Vindjammer',
    subtitle: 'Flat ride · Europa Park'
  },
  {
    id: 'kronasar',
    href: `${EP}/kronasar`,
    image: epImg('hotels/kronasar/main.jpg'),
    title: 'Hotel Kronasar',
    subtitle: 'Resort · Europa Park'
  },
  {
    id: 'monorail-bahn',
    href: `${EP}/monorail-bahn`,
    image: epImg('transport/monorail bahn/main.jpg'),
    title: 'Monorail Bahn',
    subtitle: 'Transport · Europa Park'
  }
]
