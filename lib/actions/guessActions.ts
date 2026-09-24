'use server'

import { createClient } from '@/lib/supabase/server'

export async function searchGuessItemsAction(query: string) {
  if (query.trim().length < 2) return []
  const supabase = await createClient()
  const { data } = await supabase
    .from('items')
    .select('id, name, specs, status')
    .in('category_id', ['roller-coasters', 'water-rides', 'flat-rides'])
    .ilike('name', `%${query}%`)
    .limit(8)

  return (data ?? []).map(i => ({
    id: i.id as string,
    name: i.name as string,
    specs: {
      type: i.specs?.type ?? null,
      manufacturer: i.specs?.manufacturer ?? null,
      status: i.status ?? null,
      height: i.specs?.height ?? null,
      speed: i.specs?.speed ?? null,
      length: i.specs?.length ?? null,
      inversions: i.specs?.inversions ?? null,
      duration: i.specs?.duration ?? null,
    },
  }))
}