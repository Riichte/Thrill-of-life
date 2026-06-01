import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

export default async function SoundtrackParksPage() {
  const supabase = await createClient()

  // Get all parks that have items with OSTs
  const { data: osts } = await supabase
    .from('osts')
    .select('items(park_id)')

  const parkIds = [...new Set((osts ?? []).map(o => (o.items as any)?.park_id).filter(Boolean))]

  const { data: parks } = await supabase
    .from('parks')
    .select('id, name, cover_image_url')
    .in('id', parkIds)
    .order('name')

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-tertiary)', color: 'var(--text-primary)' }}>
      <div className="container mx-auto px-4 py-8">
        <Link href="/soundtracks" className="text-blue-400 hover:text-blue-300 text-sm mb-6 inline-block">← Back</Link>
        <h1 className="text-4xl font-bold mb-2">Parks</h1>
        <p className="mb-8" style={{ color: 'var(--text-muted)' }}>{parks?.length ?? 0} parks with soundtracks</p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {(parks ?? []).map(park => (
            <Link key={park.id} href={`/soundtracks/parks/${park.id}`}
              className="rounded-sm overflow-hidden transition-colors group hover:border-[var(--accent)]"
              style={{ background: 'var(--card-bg)', border: '1px solid var(--border)' }}>

              {park.cover_image_url && (
                <div className="h-32 overflow-hidden">
                  <img src={park.cover_image_url} alt={park.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                </div>
              )}
              <div className="p-4">
                <p className="font-semibold">{park.name}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}