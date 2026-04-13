import { notFound } from 'next/navigation'
import { getParkById, getCategoryById, getItemById, getItemImages, getItemVideos, getSimilarRides } from '@/lib/queries'
import ItemPageContent from './ItemPageContent'

interface ItemPageProps {
  params: Promise<{
    parkId: string
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

  if (!park || !item || !category) notFound()

  const images = imageData.map(img => img.url)
  const credits = imageData
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
    />
  )
}