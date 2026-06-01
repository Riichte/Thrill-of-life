import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'

export default async function ParkSoundtracksPage({ params }: { params: Promise<{ parkId: string }> }) {
  const { parkId } = await params
  const supabase = await createClient()

  const { data: park } = await supabase.from('parks').select('id, name').eq('id', parkId).single()
  if (!park) notFound()

  // Get all items for this park that have OSTs, with their OSTs
  const { data: items } = await supabase
    .from('items')
    .select('id, name, category_id, osts(id, title, youtube_video_id, composer, location)')
    .eq('park_id', parkId)
    .order('name')

  const itemsWithOsts = (items ?? []).filter(i => (i.osts as any[])?.length > 0)

  // Group by category
  const byCategory: Record<string, typeof itemsWithOsts> = {}
  itemsWithOsts.forEach(item => {
    if (!byCategory[item.category_id]) byCategory[item.category_id] = []
    byCategory[item.category_id].push(item)
  })

  const categoryLabels: Record<string, string> = {
    'roller-coasters': 'Roller Coasters', 'flat-rides': 'Flat Rides',
    'dark-rides': 'Dark Rides', 'water-rides': 'Water Rides',
    'restaurants': 'Restaurants', 'hotels': 'Hotels', 'shows': 'Shows', 'shops': 'Shops',
  }

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-tertiary)', color: 'var(--text-primary)' }}>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <nav className="mb-6 text-sm flex items-center gap-2">
          <Link href="/soundtracks" className="text-blue-400 hover:text-blue-300">Soundtracks</Link>
          <span style={{ color: 'var(--text-muted)' }}>/</span>
          <Link href="/soundtracks/parks" className="text-blue-400 hover:text-blue-300">Parks</Link>
          <span style={{ color: 'var(--text-muted)' }}>/</span>
          <span style={{ color: 'var(--text-secondary)' }}>{park.name}</span>
        </nav>

        <h1 className="text-4xl font-bold mb-2">🎵 {park.name}</h1>
        <p className="mb-8" style={{ color: 'var(--text-muted)' }}>{itemsWithOsts.length} attractions with soundtracks</p>

        {Object.entries(byCategory).map(([catId, catItems]) => (
          <div key={catId} className="mb-10">
            <h2 className="text-lg font-semibold uppercase tracking-wider mb-4 pb-2"
              style={{ color: 'var(--text-muted)', borderBottom: '1px solid var(--border)' }}>
              {categoryLabels[catId] ?? catId}
            </h2>
            <div className="space-y-3">
              {catItems.map(item => (
                <Link key={item.id}
                  href={`/parks/${parkId}/${item.category_id}/${item.id}/osts`}
                  className="flex items-center justify-between p-4 rounded-sm transition-colors"
                  style={{ background: 'var(--card-bg)', border: '1px solid var(--border)' }}
                  onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--accent)')}
                  onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--border)')}>
                  <p className="font-medium">{item.name}</p>
                  <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                    🎵 {(item.osts as any[]).length} track{(item.osts as any[]).length !== 1 ? 's' : ''}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        ))}

        {itemsWithOsts.length === 0 && (
          <p style={{ color: 'var(--text-muted)' }}>No soundtracks found for this park.</p>
        )}
      </div>
    </div>
  )
}