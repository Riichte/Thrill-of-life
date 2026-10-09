import type { MetadataRoute } from 'next'
import { createClient } from '@/lib/supabase/server'
import { getAllCategories } from '@/lib/queries'

const BASE = 'https://www.thrill-of-life.com'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = await createClient()

  const { data: parks } = await supabase.from('parks').select('id')
  const categories = await getAllCategories()

  const items: { id: string; park_id: string; category_id: string }[] = []
  for (let from = 0; ; from += 1000) {
    const { data } = await supabase
      .from('items')
      .select('id, park_id, category_id')
      .range(from, from + 999)
    if (!data?.length) break
    items.push(...data)
    if (data.length < 1000) break
  }

  return [
    { url: BASE },
    { url: `${BASE}/parks` },
    { url: `${BASE}/soundtracks` },
    ...categories.map(c => ({ url: `${BASE}/category/${c.id}` })),
    ...(parks ?? []).map(p => ({ url: `${BASE}/parks/${p.id}` })),
    ...items.map(i => ({ url: `${BASE}/parks/${i.park_id}/${i.category_id}/${i.id}` })),
  ]
}