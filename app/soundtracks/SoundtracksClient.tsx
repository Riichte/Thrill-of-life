'use client'

import Link from 'next/link'

interface Ost {
    id: string
    title: string
    youtube_video_id: string
    items: { id: string; name: string; park_id: string }
}

export default function SoundtracksClient({ osts }: { osts: Ost[] }) {
    return (
        <div className="min-h-screen" style={{ background: 'var(--bg-tertiary)', color: 'var(--text-primary)' }}>
            <div className="container mx-auto px-4 py-8 max-w-4xl">
                <h1 className="text-4xl font-bold mb-2">🎵 Soundtracks</h1>
                <p style={{ color: 'var(--text-muted)' }}>{osts.length} tracks</p>

                <div className="mt-8 space-y-3">
                    {osts.map(ost => (
                        <Link key={ost.id} href={`/parks/${ost.items.park_id}/${ost.items.id}/osts`}
                            className="block rounded-sm p-4 transition-colors"
                            style={{ background: 'var(--card-bg)', border: '1px solid var(--border)' }}
                            onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--accent)')}
                            onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--border)')}>
                            <p className="font-semibold">{ost.title}</p>
                            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>{ost.items.name}</p>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    )
}