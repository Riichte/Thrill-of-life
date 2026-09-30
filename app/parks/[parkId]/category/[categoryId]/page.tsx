import { notFound } from 'next/navigation'
import { getParkById, getCategoryById, getItemsByCategory } from '@/lib/queries'
import CategoryPageClient from './CategoryPageClient'

interface CategoryPageProps {
  params: Promise<{
    parkId: string
    categoryId: string
  }>
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { parkId, categoryId } = await params

  const park = await getParkById(parkId)
  const category = await getCategoryById(categoryId)
  const items = await getItemsByCategory(parkId, categoryId)
  const statusOrder = (s: string) => ['defunct', 'sbno'].includes(s) ? 2 : s === 'coming_soon' ? 1 : 0
  const sortedItems = [...items].sort((a, b) => statusOrder(a.status ?? '') - statusOrder(b.status ?? '') || a.name.localeCompare(b.name))

  if (!park || !category) notFound()

  return <CategoryPageClient park={park} category={category} items={sortedItems} />
}