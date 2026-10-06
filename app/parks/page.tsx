import { createClient } from '@/lib/supabase/server'
import ParksClient from './ParksClient'

export const revalidate = 3600
export default async function ParksPage({ searchParams }: { searchParams: Promise<{ mode?: string }> }) {
  const { mode } = await searchParams
  const soundtrackMode = mode === 'soundtrack'
  const supabase = await createClient()
  const { data: parks } = await supabase.from('parks').select('*').order('name')

  let ostCountByPark: Record<string, number> = {}
  if (soundtrackMode) {
    const { data: osts } = await supabase.from('osts').select('items(park_id)')
    osts?.forEach(o => {
      const parkId = (o.items as any)?.park_id
      if (parkId) ostCountByPark[parkId] = (ostCountByPark[parkId] || 0) + 1
    })
  }

  return <ParksClient parks={parks ?? []} soundtrackMode={soundtrackMode} ostCountByPark={ostCountByPark} />
}