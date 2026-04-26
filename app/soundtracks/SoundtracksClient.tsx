'use client'

import Link from 'next/link'

interface Category {
    id: string
    name: string
}

export default function SoundtracksClient({ categories, ostsByCategory }: { categories: Category[]; ostsByCategory: Record<string, number> }) {
    const catsWithOsts = categories.filter(c => ostsByCategory[c.id] > 0)

    return (
        <div className="min-h-screen" style={{ background: 'var(--bg-tertiary)', color: 'var(--text-primary)' }}>
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-4xl font-bold mb-2">🎵 Soundtracks</h1>
                <p style={{ color: 'var(--text-muted)' }}>{catsWithOsts.length} categories with soundtracks</p>

                <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {catsWithOsts.map(cat => (
                        <Link key={cat.id} href={`/soundtracks/${cat.id}`}
                            className="rounded-sm p-4 transition-colors"
                            style={{ background: 'var(--card-bg)', border: '1px solid var(--border)' }}
                            onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--accent)')}
                            onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--border)')}>
                            <p className="font-semibold">{cat.name}</p>
                            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>🎵 {ostsByCategory[cat.id]} soundtrack{ostsByCategory[cat.id] !== 1 ? 's' : ''}</p>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    )
}