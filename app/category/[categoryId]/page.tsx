import { notFound } from 'next/navigation'
import { getItemsByGlobalCategory, getAllCategories } from '@/lib/queries'
import CategoryPageClient from './CategoryPageClient'

export const revalidate = 3600
export default async function CategoryPage({
  params,
}: {
  params: Promise<{ categoryId: string }>
}) {
  const { categoryId } = await params
  const categories = await getAllCategories()
  const category = categories.find(c => c.id === categoryId)
  if (!category) notFound()

  const items = await getItemsByGlobalCategory(categoryId)
  const statusOrder = (s: string) => ['defunct', 'sbno'].includes(s) ? 2 : s === 'coming_soon' ? 1 : 0
  const sortedItems = [...items].sort((a, b) => statusOrder(a.status) - statusOrder(b.status) || a.name.localeCompare(b.name))

  return <CategoryPageClient category={category} items={sortedItems} />
}