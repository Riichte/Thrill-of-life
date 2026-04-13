import { notFound } from 'next/navigation'
import { getItemsByGlobalCategory, getAllCategories } from '@/lib/queries'
import CategoryPageClient from './CategoryPageClient'

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

  return <CategoryPageClient category={category} items={items} />
}