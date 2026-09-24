import { notFound } from 'next/navigation'
import { getParkById, getCategoryById, getItemById, getItemImages, getItemVideos, getSimilarRides, getItemReviews, getItemCommunityScore, getCoasterElements } from '@/lib/queries'
import ItemPageContent from './ItemPageContent'
import { PhotoCredit } from '@/components/PhotoCredits'

interface ItemPageProps {
  params: Promise<{
    parkId: string
    categoryId: string
    itemId: string
  }>
}

export default async function ItemPage({ params }: ItemPageProps) {
  const { parkId, itemId } = await params
  const park = await getParkById(parkId)
  const item = await getItemById(parkId, itemId)
  const category = item ? await getCategoryById(item.category_id) : null
  const imageData = await getItemImages(itemId)
  const videos = await getItemVideos(itemId)
  const similarRides = item?.specs?.type
    ? await getSimilarRides(item.id, item.specs.type)
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
    />
  )
}