export interface Park {
  id: string
  name: string
  description: string
  logo_url: string
  cover_image_url: string
  country: string
  region: string
  company: string
  park_type: string
  location: string
}

export const parksData: Park[] = [
  {
    id: 'alton-towers',
    name: 'Alton Towers',
    description: "Britain's most visited theme park with over 40 rides and attractions, plus a water park and hotel resort.",
    logo_url: '/parks/alton-towers/logo.png',
    cover_image_url: '/parks/alton-towers/main.jpg',
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
    logo_url: '/parks/blackpool-pleasure-beach/logo.png',
    cover_image_url: '/parks/blackpool-pleasure-beach/main.jpg',
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
    logo_url: '/parks/disneyland-paris/logo.png',
    cover_image_url: '/parks/disneyland-paris/main.jpg',
    country: 'France',
    region: 'Europe',
    company: 'Disney',
    park_type: 'Theme Park',
    location: 'Marne-la-Vallée, France'
  },
  {
    id: 'europa-park',
    name: 'Europa Park',
    description: "Europe's second most popular theme park resort with thrilling rides, shows, and European-themed areas.",
    logo_url: '/parks/europa-park/logo.png',
    cover_image_url: '/parks/europa-park/main.jpg',
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
    logo_url: '/parks/six-flags-great-escape/logo.png',
    cover_image_url: '/parks/six-flags-great-escape/main.jpg',
    country: 'United States',
    region: 'North America',
    company: 'Six Flags',
    park_type: 'Theme Park',
    location: 'Queensbury, New York, USA'
  }
]