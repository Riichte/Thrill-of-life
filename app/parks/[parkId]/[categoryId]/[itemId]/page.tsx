import { notFound } from 'next/navigation'
import { getParkById, getCategoryById, getItemById, getItemImages, getItemVideos, getSimilarRides, getItemReviews, getItemCommunityScore, getCoasterElements } from '@/lib/queries'
import ItemPageContent from './ItemPageContent'
import { PhotoCredit } from '@/components/PhotoCredits'
import { createClient } from '@/lib/supabase/server'

interface ItemPageProps {
  params: Promise<{
    parkId: string
    categoryId: string
    itemId: string
  }>
  searchParams: Promise<{ mode?: string }>
}

export default async function ItemPage({ params, searchParams }: ItemPageProps) {
  const { parkId, itemId } = await params
  const { mode } = await searchParams
  const soundtrackMode = mode === 'soundtrack'
  const park = await getParkById(parkId)
  const item = await getItemById(parkId, itemId)
  const category = item ? await getCategoryById(item.category_id) : null
  const imageData = await getItemImages(itemId)
  const videos = await getItemVideos(itemId)
  const similarRides = item?.specs?.model
    ? await getSimilarRides(item.id, item.specs.model)
    : []
  const reviews = await getItemReviews(itemId)
  const communityScore = await getItemCommunityScore(itemId)
  const rawCoasterElements = item?.category_id === 'roller-coasters'
    ? await getCoasterElements(itemId)
    : []

  const coasterElements = rawCoasterElements.map((ce: any) => {
    const elementObj = Array.isArray(ce.elements) ? ce.elements[0] : ce.elements
    return {
      id: ce.id,
      sort_order: ce.sort_order,
      name: elementObj?.name ?? 'Unknown Element',
    }
  })
  if (!park || !item || !category) notFound()

  let itemOsts: any[] = []
  let soundtrackScore: number | null = null
  if (soundtrackMode) {
    const supabase = await createClient()
    const { data: ostData } = await supabase
      .from('osts')
      .select('id, title, youtube_video_id, composer, location, description, item_id')
      .eq('item_id', itemId)
      .order('created_at')
    itemOsts = ostData ?? []
    if (itemOsts.length > 0) {
      const { data: ostRatings } = await supabase
        .from('ost_ratings')
        .select('emotion, nostalgia, appeal, experience')
        .in('ost_id', itemOsts.map(o => o.id))
      if (ostRatings?.length) {
        const total = ostRatings.reduce((s, r) => s + r.emotion + r.nostalgia + r.appeal + r.experience, 0)
        soundtrackScore = Math.round(total / (ostRatings.length * 4))
      }
    }
  }

  const images = imageData
  const credits: PhotoCredit[] = imageData
    .filter(img => img.attribution_author)
    .map(img => ({
      url: img.url,
      author: img.attribution_author!,
      sourceUrl: img.attribution_url ?? '',
      license: img.license ?? 'CC BY 4.0',
    }))

  return (
    <ItemPageContent
      park={park}
      item={item}
      category={category}
      images={images}
      videos={videos}
      similarRides={similarRides}
      credits={credits}
      reviews={reviews}
      communityScore={communityScore}
      coasterElements={coasterElements}
      soundtrackMode={soundtrackMode}
      itemOsts={itemOsts}
      soundtrackScore={soundtrackScore}
    />
  )
}