'use client'

import { useState } from 'react'
import Link from 'next/link'

interface Park {
    id: string
    name: string
}

interface Item {
    id: string
    name: string
    park_id: string
}

export default function SoundtracksCategoryClient({ category, parks, items }: { category: any; parks: Park[]; items: Item[] }) {
    const [selectedParkId, setSelectedParkId] = useState(parks[0]?.id || '')

    const filteredItems = selectedParkId ? items.filter(i => i.park_id === selectedParkId) : items

    return (
        <div className="min-h-screen" style={{ background: 'var(--bg-tertiary)', color: 'var(--text-primary)' }}>
            <div className="container mx-auto px-4 py-8">
                <Link href="/soundtracks" className="text-blue-400 hover:text-blue-300 text-sm mb-6 inline-block">← Back</Link>

                <h1 className="text-4xl font-bold mb-2">{category.name} Soundtracks</h1>

                {/* Park dropdown */}
                <div className="mt-6 max-w-xs">
                    <select value={selectedParkId} onChange={e => setSelectedParkId(e.target.value)}
                        className="w-full rounded-sm px-3 py-2 text-sm"
                        style={{ background: 'var(--input-bg)', border: '1px solid var(--input-border)', color: 'var(--text-primary)' }}>
                        {parks.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                    </select>
                </div>

                <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredItems.map(item => (
                        <Link key={item.id} href={`/parks/${item.park_id}/${category.id}/${item.id}/osts`}
                            className="rounded-sm p-4 transition-colors"
                            style={{ background: 'var(--card-bg)', border: '1px solid var(--border)' }}
                            onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--accent)')}
                            onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--border)')}>
                            <p className="font-semibold">{item.name}</p>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    )
}