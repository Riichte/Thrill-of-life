import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getParkById, getItemsByPark, getAllCategories, getItemImages, getIsFollowing, getParkImages, getParkReviews, getParkCommunityScore } from '@/lib/queries'
import ParkPageClient from '@/components/ParkPageClient'
import { PhotoCredit } from '@/components/PhotoCredits'
import { getParkPrices } from '@/lib/queries'

export async function generateMetadata({ params }: { params: Promise<{ parkId: string }> }) {
  const { parkId } = await params
  const park = await getParkById(parkId)
  return {
    title: park ? `${park.name} — Thrill of Life` : 'Park — Thrill of Life',
    description: park?.description ?? 'Theme park reviews and ratings.',
  }
}

export default async function ParkPage({ params }: { params: Promise<{ parkId: string }> }) {
  const { parkId } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const park = await getParkById(parkId)
  if (!park) notFound()

  const items = await getItemsByPark(parkId)
  const allCategories = await getAllCategories()

  const categoryOrder = [
    'roller-coasters',
    'water-rides',
    'flat-rides',
    'dark-rides',
    'transport',
    'shows',
    'shops',
    'hotels',
    'restaurants',
  ]

  const categoriesWithImages = allCategories
    .sort((a, b) => {
      const ai = categoryOrder.indexOf(a.id)
      const bi = categoryOrder.indexOf(b.id)
      if (ai === -1 && bi === -1) return a.name.localeCompare(b.name)
      if (ai === -1) return 1
      if (bi === -1) return -1
      return ai - bi
    })
    .map(category => {
      const categoryItems = items.filter(item => item.category_id === category.id)
      const firstItem = categoryItems[0]
      return {
        ...category,
        itemCount: categoryItems.length,
        firstItemId: firstItem?.id ?? null,
      }
    })
    .filter(c => c.itemCount > 0)

  const categoryImages: Record<string, string> = {}
  await Promise.all(
    categoriesWithImages.map(async (cat) => {
      if (cat.firstItemId) {
        const imgs = await getItemImages(cat.firstItemId)
        if (imgs[0]) categoryImages[cat.id] = imgs[0].url
      }
    })
      )
const prices = await getParkPrices(parkId)
  const parkImageData = await getParkImages(parkId)
  const carouselImages = parkImageData.filter(img => (img as any).sort_order !== -1)
  const slides = carouselImages.length > 0
    ? carouselImages.map(img => img.url)
    : park.cover_image_url ? [park.cover_image_url] : []

  const credits: PhotoCredit[] = parkImageData
    .filter(img => img.attribution_author)
    .map(img => ({
      url: img.url,
      author: img.attribution_author!,
      sourceUrl: img.attribution_url ?? '',
      license: img.license ?? 'CC BY 4.0',
    }))

  const isFavorited = user ? await getIsFollowing(user.id, parkId) : false
  const reviews = await getParkReviews(parkId)
  const communityScore = await getParkCommunityScore(parkId)

  return (
    <ParkPageClient
      park={park}
      slides={slides}
      categoriesWithImages={categoriesWithImages}
      categoryImages={categoryImages}
      userId={user?.id ?? null}
      isFavorited={isFavorited}
      credits={credits}
      reviews={reviews}
      communityScore={communityScore}
      prices={prices}
    />
  )
}