import { notFound } from 'next/navigation'
import { getParkById, getCategoryById, getItemsByCategory } from '@/lib/queries'
import CategoryPageClient from './CategoryPageClient'
import { createClient } from '@/lib/supabase/server'

interface CategoryPageProps {
  params: Promise<{
    parkId: string
    categoryId: string
  }>
  searchParams: Promise<{ mode?: string }>
}

export default async function CategoryPage({ params, searchParams }: CategoryPageProps) {
  const { parkId, categoryId } = await params
  const { mode } = await searchParams
  const soundtrackMode = mode === 'soundtrack'

  const park = await getParkById(parkId)
  const category = await getCategoryById(categoryId)
  const items = await getItemsByCategory(parkId, categoryId)
  const statusOrder = (s: string) => ['defunct', 'sbno'].includes(s) ? 2 : s === 'coming_soon' ? 1 : 0
  const sortedItems = [...items].sort((a, b) => statusOrder(a.status ?? '') - statusOrder(b.status ?? '') || a.name.localeCompare(b.name))

  if (!park || !category) notFound()

  const ostCounts: Record<string, number> = {}
  let finalItems = sortedItems
  if (soundtrackMode) {
    const supabase = await createClient()
    const { data: osts } = await supabase
      .from('osts')
      .select('item_id')
      .in('item_id', sortedItems.map(i => i.id))
    osts?.forEach(o => { ostCounts[o.item_id] = (ostCounts[o.item_id] || 0) + 1 })
    finalItems = sortedItems.filter(i => ostCounts[i.id])
  }

  return <CategoryPageClient park={park} category={category} items={finalItems} soundtrackMode={soundtrackMode} ostCounts={ostCounts} />
}

export async function generateMetadata({ params }: CategoryPageProps) {
  const { parkId, categoryId } = await params
  const park = await getParkById(parkId)
  const category = await getCategoryById(categoryId)
  if (!park || !category) return {}
  return {
    title: `${category.name} at ${park.name}`,
    description: `All ${category.name.toLowerCase()} at ${park.name} with ratings, reviews and photos.`,
    alternates: { canonical: `/parks/${parkId}/category/${categoryId}` },
  }
}