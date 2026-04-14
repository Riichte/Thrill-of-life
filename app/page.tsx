import { getRecentReviews } from '@/lib/queries'
import { RecentReviewsCarousel } from '@/components/RecentReviewsCarousel'
import Link from 'next/link'
import { HomeMarqueeRow } from '@/components/HomeMarqueeRow'
import {
  homeMoreHighlightCards,
  homeRollerCoasterCards,
  homeWaterRideCards,
  HomeMarqueeCard
} from '@/lib/homeCarouselData'
import { createClient } from '@/lib/supabase/server'

export default async function Home() {
  const supabase = await createClient()
  const { data: parks } = await supabase.from('parks').select('*').order('name')
  const recentReviews = await getRecentReviews(10)
  const homeParkCards: HomeMarqueeCard[] = (parks ?? []).map(park => ({
    id: park.id,
    href: `/parks/${park.id}`,
    image: park.cover_image_url || '',
    title: park.name,
    subtitle: park.country
  }))

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="border-b border-white/10 bg-[#0a0f16]">
        <div className="container mx-auto px-4 py-10 text-center md:py-14">
          <h1 className="font-logo text-4xl font-bold tracking-tight text-white md:text-5xl">
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
          subtitle="Featured destinations"
          items={homeParkCards}
          durationSec={130}
          viewAllHref="/parks"
          viewAllLabel="All parks"
        />

        <HomeMarqueeRow
          title="Roller coasters"
          subtitle="Europa Park"
          items={homeRollerCoasterCards}
          durationSec={150}
          viewAllHref="/parks/europa-park/category/roller-coasters"
          viewAllLabel="Roller coasters"
        />

        <HomeMarqueeRow
          title="Water rides"
          subtitle="Europa Park"
          items={homeWaterRideCards}
          durationSec={85}
          viewAllHref="/parks/europa-park/category/water-rides"
          viewAllLabel="Water rides"
        />

        <HomeMarqueeRow
          title="More highlights"
          subtitle="Dark rides, flat rides, stay & transport"
          items={homeMoreHighlightCards}
          durationSec={95}
          viewAllHref="/parks/europa-park"
          viewAllLabel="Europa Park"
        />


        <RecentReviewsCarousel reviews={recentReviews} />

        <div className="mt-6 grid grid-cols-1 gap-6 border-t border-white/10 pt-12 md:grid-cols-3"></div>

        <div className="mt-6 grid grid-cols-1 gap-6 border-t border-white/10 pt-12 md:grid-cols-3">
          <div className="rounded-xl border border-white/10 bg-gray-800/80 p-6">
            <h2 className="mb-3 text-lg font-semibold text-[#66c0f4]">Explore</h2>
            <ul className="space-y-2 text-sm">
              <li><Link href="/parks" className="text-gray-300 hover:text-white">All parks</Link></li>
              <li><Link href="/parks/europa-park" className="text-gray-300 hover:text-white">Europa Park</Link></li>
            </ul>
          </div>
          <div className="rounded-xl border border-white/10 bg-gray-800/80 p-6">
            <h2 className="mb-3 text-lg font-semibold text-emerald-400">Account</h2>
            <ul className="space-y-2 text-sm">
              <li><Link href="/auth/login" className="text-gray-300 hover:text-white">Login</Link></li>
              <li><Link href="/auth/signup" className="text-gray-300 hover:text-white">Sign up</Link></li>
              <li><Link href="/dashboard" className="text-gray-300 hover:text-white">Dashboard</Link></li>
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