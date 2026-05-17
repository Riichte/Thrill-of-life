'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'

interface Item {
    id: string
    name: string
    description: string
    park_id: string
    category_id: string
    specs: any
    parks: { name: string } | null
    item_images: { url: string; attribution_author?: string; license?: string }[]
}

interface Category {
    id: string
    name: string
}

export default function CategoryPageClient({
    category,
    items,
}: {
    category: Category
    items: Item[]
}) {
    const [search, setSearch] = useState('')
    const [sortBy, setSortBy] = useState<'name' | 'park'>('name')
    const [filterType, setFilterType] = useState('')

    const types = useMemo(() => {
        const all = items.map(i => i.specs?.type).filter(Boolean) as string[]
        return [...new Set(all)].sort()
    }, [items])

    const filtered = useMemo(() => {
        let result = items.filter(item =>
            (!search || item.name.toLowerCase().includes(search.toLowerCase()) ||
                item.parks?.name.toLowerCase().includes(search.toLowerCase())) &&
            (!filterType || item.specs?.type === filterType)
        )
        if (sortBy === 'name') result = [...result].sort((a, b) => a.name.localeCompare(b.name))
        if (sortBy === 'park') result = [...result].sort((a, b) => (a.parks?.name ?? '').localeCompare(b.parks?.name ?? ''))
        return result
    }, [items, search, sortBy, filterType])

    const inputStyle = {
        background: 'var(--input-bg)',
        border: '1px solid var(--input-border)',
        color: 'var(--text-primary)',
    }

    

    return (
        <div className="min-h-screen" style={{ background: 'var(--bg-tertiary)', color: 'var(--text-primary)' }}>
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-4xl font-bold mb-8 text-center" style={{ color: 'var(--text-primary)' }}>{category.name}</h1>

                {/* Filters */}
                <div className="rounded-sm p-6 mb-8" style={{ background: 'var(--card-bg)', border: '1px solid var(--border)' }}>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-xs font-medium uppercase tracking-wider mb-1" style={{ color: 'var(--text-muted)' }}>Search</label>
                            <input
                                type="text"
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                placeholder={`Search ${category.name.toLowerCase()}...`}
                                className="w-full rounded-sm px-3 py-2 text-sm focus:outline-none"
                                style={inputStyle}
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-medium uppercase tracking-wider mb-1" style={{ color: 'var(--text-muted)' }}>Sort by</label>
                            <select
                                value={sortBy}
                                onChange={e => setSortBy(e.target.value as 'name' | 'park')}
                                className="w-full rounded-sm px-3 py-2 text-sm focus:outline-none"
                                style={inputStyle}
                            >
                                <option value="name">Name</option>
                                <option value="park">Park</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-medium uppercase tracking-wider mb-1" style={{ color: 'var(--text-muted)' }}>Type</label>
                            <select
                                value={filterType}
                                onChange={e => setFilterType(e.target.value)}
                                className="w-full rounded-sm px-3 py-2 text-sm focus:outline-none"
                                style={inputStyle}
                            >
                                <option value="">All Types</option>
                                {types.map(t => <option key={t} value={t}>{t}</option>)}
                            </select>
                        </div>
                    </div>
                </div>

                {/* Count */}
                <p className="text-sm mb-6" style={{ color: 'var(--text-muted)' }}>{filtered.length} {category.name.toLowerCase()} found</p>

                {/* Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                    {filtered.map(item => {
                        const image = (item.item_images?.find((img: any) => img.sort_order === 0) ?? item.item_images?.[0])?.url
                        console.log('images for', item.name, item.item_images)  // add this line
                        return (
                            <Link
                                key={item.id}
                                href={`/parks/${item.park_id}/${item.category_id}/${item.id}`}
                                className="group rounded-sm overflow-hidden transition-colors"
                                style={{ background: 'var(--card-bg)', border: '1px solid var(--border)' }}
                                onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--accent)')}
                                onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--border)')}>
                                <div className="aspect-square overflow-hidden" style={{ background: 'var(--bg-tertiary)' }}>
                                    {image ? (
                                        <img
                                            src={image}
                                            alt={item.name}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-xs" style={{ color: 'var(--text-faint)' }}>
                                            No image
                                        </div>
                                    )}
                                </div>
                                <div className="p-3">
                                    <p className="text-sm font-semibold truncate transition-colors"
                                        style={{ color: 'var(--text-primary)' }}
                                        onMouseEnter={e => (e.currentTarget.style.color = 'var(--accent)')}
                                        onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-primary)')}>
                                        {item.name}
                                    </p>
                                    <p className="text-xs mt-0.5 truncate" style={{ color: 'var(--text-muted)' }}>{item.parks?.name ?? ''}</p>
                                    {item.specs?.type && (
                                        <p className="text-xs mt-0.5 truncate" style={{ color: 'var(--text-faint)' }}>{item.specs.type}</p>
                                    )}
                                </div>
                            </Link>
                        )
                    })}
                </div>

                {filtered.length === 0 && (
                    <div className="text-center py-16">
                        <p style={{ color: 'var(--text-muted)' }}>No results found.</p>
                    </div>
                )}
            </div>
        </div>
    )
}