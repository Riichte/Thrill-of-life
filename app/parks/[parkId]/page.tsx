import Link from 'next/link'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getParkById, getItemsByPark, getAllCategories, getItemImages, getFollowerCount, getIsFollowing } from '@/lib/queries'
import ParkPageClient from '@/components/ParkPageClient'

export default async function ParkPage({ params }: { params: Promise<{ parkId: string }> }) {
  const { parkId } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const park = await getParkById(parkId)
  if (!park) notFound()

  const items = await getItemsByPark(parkId)
  const allCategories = await getAllCategories()

  // Build category list with first available item image
  const categoriesWithImages = allCategories.map(category => {
    const categoryItems = items.filter(item => item.category_id === category.id)
    const firstItem = categoryItems[0]
    return {
      ...category,
      itemCount: categoryItems.length,
      firstItemId: firstItem?.id ?? null,
    }
  }).filter(c => c.itemCount > 0)

  // Get images for first item of each category
  const categoryImages: Record<string, string> = {}
  await Promise.all(
    categoriesWithImages.map(async (cat) => {
      if (cat.firstItemId) {
        const imgs = await getItemImages(cat.firstItemId)
        if (imgs[0]) categoryImages[cat.id] = imgs[0]
      }
    })
  )

  // Get park carousel images from item_images
  const { data: parkImages } = await supabase
    .from('item_images')
    .select('url')
    .eq('item_id', parkId)
    .order('sort_order')

  const carouselImages = parkImages?.map(r => r.url) ?? []
  // Fallback to cover image if no carousel images
  const slides = carouselImages.length > 0
    ? carouselImages
    : park.cover_image_url ? [park.cover_image_url] : []

  const isFavorited = user ? await getIsFollowing(user.id, parkId) : false

  return (
    <ParkPageClient
      park={park}
      slides={slides}
      categoriesWithImages={categoriesWithImages}
      categoryImages={categoryImages}
      userId={user?.id ?? null}
      isFavorited={false}
    />
  )
}