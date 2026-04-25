import { createClient } from '@/lib/supabase/server'
import ManufacturersClient from './ManufacturersClient'

export const metadata = { title: 'Manufacturers — Thrill of Life' }

export default async function ManufacturersPage() {
  const supabase = await createClient()
  const { data: items } = await supabase
    .from('items')
    .select('specs, item_images(url)')

  // Group by manufacturer
  const map: Record<string, { count: number; image: string | null }> = {}
  for (const item of items ?? []) {
    const m = item.specs?.manufacturer
    if (!m) continue
    if (!map[m]) map[m] = { count: 0, image: null }
    map[m].count++
    if (!map[m].image) map[m].image = (item.item_images as any)?.[0]?.url ?? null
  }

  const manufacturers = Object.entries(map)
    .map(([name, data]) => ({ name, slug: name.toLowerCase().replace(/\s+/g, '-'), ...data }))
    .sort((a, b) => b.count - a.count)

  return <ManufacturersClient manufacturers={manufacturers} />
}