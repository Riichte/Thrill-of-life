import { getRecentReviews } from '@/lib/queries'
import { RecentReviewsCarousel } from '@/components/RecentReviewsCarousel'
import Link from 'next/link'
import { HomeMarqueeRow } from '@/components/HomeMarqueeRow'
import { HomeMarqueeCard } from '@/lib/homeCarouselData'
import { createClient } from '@/lib/supabase/server'

export default async function Home() {
  const supabase = await createClient()
  const { data: parks } = await supabase.from('parks').select('*').limit(20)
  const recentReviews = await getRecentReviews(10)

  const { data: coasterItems } = await supabase
    .from('items')
    .select('id, name, park_id, item_images(url, attribution_author, license)')
    .eq('category_id', 'roller-coasters')
    .limit(20)

  const { data: waterItems } = await supabase
    .from('items')
    .select('id, name, park_id, item_images(url, attribution_author, license)')
    .eq('category_id', 'water-rides')
    .limit(20)

  const { data: darkRideItems } = await supabase
    .from('items')
    .select('id, name, park_id, item_images(url, attribution_author, license)')
    .eq('category_id', 'dark-rides')
    .limit(20)

  const { data: flatRideItems } = await supabase
    .from('items')
    .select('id, name, park_id, item_images(url, attribution_author, license)')
    .eq('category_id', 'flat-rides')
    .limit(20)

  const { data: mixItems } = await supabase
    .from('items')
    .select('id, name, park_id, category_id, item_images(url, attribution_author, license)')
    .in('category_id', ['restaurants', 'shows', 'shops', 'hotels'])
    .limit(20)

  const highlightCategories = ['dark-rides', 'flat-rides', 'hotels', 'transport', 'shows', 'shops']
  const { data: highlightItems } = await supabase
    .from('items')
    .select('id, name, park_id, category_id, item_images(url, attribution_author, license)')
    .in('category_id', highlightCategories)
    .limit(20)


  const homeRollerCoasterCards: HomeMarqueeCard[] = (coasterItems ?? [])
    .filter(i => i.item_images?.[0]?.url)
    .map(i => ({
      id: i.id,
      href: `/parks/${i.park_id}/${i.id}`,
      image: i.item_images[0].url,
      title: i.name,
      attribution: i.item_images[0].attribution_author ?? null,
      license: i.item_images[0].license ?? null,
    }))

  const homeWaterRideCards: HomeMarqueeCard[] = (waterItems ?? [])
    .filter(i => i.item_images?.[0]?.url)
    .map(i => ({
      id: i.id,
      href: `/parks/${i.park_id}/${i.id}`,
      image: i.item_images[0].url,
      title: i.name,
      attribution: i.item_images[0].attribution_author ?? null,
      license: i.item_images[0].license ?? null,
    }))

  const homeDarkRideCards: HomeMarqueeCard[] = (darkRideItems ?? [])
    .filter(i => i.item_images?.[0]?.url)
    .map(i => ({
      id: i.id,
      href: `/parks/${i.park_id}/${i.id}`,
      image: i.item_images[0].url,
      title: i.name,
      subtitle: 'Dark ride',
      attribution: i.item_images[0].attribution_author ?? null,
      license: i.item_images[0].license ?? null,
    }))

  const homeFlatRideCards: HomeMarqueeCard[] = (flatRideItems ?? [])
    .filter(i => i.item_images?.[0]?.url)
    .map(i => ({
      id: i.id,
      href: `/parks/${i.park_id}/${i.id}`,
      image: i.item_images[0].url,
      title: i.name,
      subtitle: 'Flat ride',
      attribution: i.item_images[0].attribution_author ?? null,
      license: i.item_images[0].license ?? null,
    }))

  const homeMixCards: HomeMarqueeCard[] = (mixItems ?? [])
    .filter(i => i.item_images?.[0]?.url)
    .map(i => ({
      id: i.id,
      href: `/parks/${i.park_id}/${i.id}`,
      image: i.item_images[0].url,
      title: i.name,
      subtitle: i.category_id.replace(/-/g, ' '),
      attribution: i.item_images[0].attribution_author ?? null,
      license: i.item_images[0].license ?? null,
    }))


  const homeParkCards: HomeMarqueeCard[] = (parks ?? []).map(park => ({
    id: park.id,
    href: `/parks/${park.id}`,
    image: park.cover_image_url || '',
    title: park.name,
    subtitle: park.country
  }))




  return (
    <div className="min-h-screen style={{ background: 'var(--bg-tertiary)' }} style={{ color: 'var(--text-primary)' }}">
      <div className="border-b border-white/10 bg-[#0a0f16]">
        <div className="container mx-auto px-4 py-10 text-center md:py-14">
          <h1 className="font-logo text-4xl font-bold tracking-tight style={{ color: 'var(--text-primary)' }} md:text-5xl">
            Theme Park Review
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-gray-400">
            Browse parks and standout rides—each row scrolls slowly on its own. Hover a row to pause.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-10 md:py-14">
        <HomeMarqueeRow
          title="Theme parks"
          items={homeParkCards}
          durationSec={130}
          viewAllHref="/parks"
          viewAllLabel="All parks"
        />

        <HomeMarqueeRow
          title="Roller coasters"
          items={homeRollerCoasterCards}
          durationSec={150}
          viewAllHref="/category/roller-coasters"
          viewAllLabel="All roller coasters"
        />

        <HomeMarqueeRow
          title="Water rides"
          items={homeWaterRideCards}
          durationSec={85}
          viewAllHref="/category/water-rides"
          viewAllLabel="All water rides"
        />

        <HomeMarqueeRow
          title="Dark rides"
          subtitle="From all parks"
          items={homeDarkRideCards}
          durationSec={100}
          viewAllHref="/category/dark-rides"
          viewAllLabel="All dark rides"
        />

        <HomeMarqueeRow
          title="Flat rides"
          subtitle="From all parks"
          items={homeFlatRideCards}
          durationSec={110}
          viewAllHref="/category/flat-rides"
          viewAllLabel="All flat rides"
        />

        <HomeMarqueeRow
          title="Also on the site"
          subtitle="Restaurants, shows, shops & hotels"
          items={homeMixCards}
          durationSec={95}
          viewAllHref="/parks"
          viewAllLabel="All parks"
        />


        <RecentReviewsCarousel reviews={recentReviews} />

        <div className="mt-6 grid grid-cols-1 gap-6 border-t border-white/10 pt-12 md:grid-cols-3"></div>

        <div className="mt-6 grid grid-cols-1 gap-6 border-t border-white/10 pt-12 md:grid-cols-3">
          <div className="rounded-xl border border-white/10 bg-gray-800/80 p-6">
            <h2 className="mb-3 text-lg font-semibold style={{ color: 'var(--accent)' }}">Explore</h2>
            <ul className="space-y-2 text-sm">
              <li><Link href="/parks" className="text-gray-300 hover:style={{ color: 'var(--text-primary)' }}">All parks</Link></li>
              <li><Link href="/category/roller-coasters" className="text-gray-300 hover:style={{ color: 'var(--text-primary)' }}">Roller Coasters</Link></li>
            </ul>
          </div>
          <div className="rounded-xl border border-white/10 bg-gray-800/80 p-6">
            <h2 className="mb-3 text-lg font-semibold text-emerald-400">Account</h2>
            <ul className="space-y-2 text-sm">
              <li><Link href="/auth/login" className="text-gray-300 hover:style={{ color: 'var(--text-primary)' }}">Login</Link></li>
              <li><Link href="/auth/signup" className="text-gray-300 hover:style={{ color: 'var(--text-primary)' }}">Sign up</Link></li>
              <li><Link href="/dashboard" className="text-gray-300 hover:style={{ color: 'var(--text-primary)' }}">Dashboard</Link></li>
            </ul>
          </div>
          <div className="rounded-xl border border-white/10 bg-gray-800/80 p-6">
            <h2 className="mb-3 text-lg font-semibold text-gray-200">About this page</h2>
            <p className="text-sm leading-relaxed text-gray-400">
              Marquees loop smoothly; motion is reduced automatically if you prefer less movement in system settings.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}