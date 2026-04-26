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

    return (
        <div className="min-h-screen style={{ background: 'var(--bg-tertiary)' }} style={{ color: 'var(--text-primary)' }}">
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-4xl font-bold mb-8 text-center">{category.name}</h1>

                {/* Filters */}
                <div className="style={{ background: 'var(--card-bg)' }} border style={{ borderColor: 'var(--border)' }} rounded-sm p-6 mb-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-xs font-medium uppercase tracking-wider style={{ color: 'var(--text-muted)' }} mb-1">Search</label>
                            <input
                                type="text"
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                placeholder={`Search ${category.name.toLowerCase()}...`}
                                className="w-full style={{ background: 'var(--bg-elevated)' }} border style={{ borderColor: 'var(--input-border)' }} rounded-sm px-3 py-2 text-sm style={{ color: 'var(--text-primary)' }} placeholder-[#6a8a9a] focus:outline-none style={{ outlineColor: 'var(--input-focus)' }}"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-medium uppercase tracking-wider style={{ color: 'var(--text-muted)' }} mb-1">Sort by</label>
                            <select
                                value={sortBy}
                                onChange={e => setSortBy(e.target.value as 'name' | 'park')}
                                className="w-full style={{ background: 'var(--bg-elevated)' }} border style={{ borderColor: 'var(--input-border)' }} rounded-sm px-3 py-2 text-sm style={{ color: 'var(--text-primary)' }} focus:outline-none style={{ outlineColor: 'var(--input-focus)' }}"
                            >
                                <option value="name">Name</option>
                                <option value="park">Park</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-medium uppercase tracking-wider style={{ color: 'var(--text-muted)' }} mb-1">Type</label>
                            <select
                                value={filterType}
                                onChange={e => setFilterType(e.target.value)}
                                className="w-full style={{ background: 'var(--bg-elevated)' }} border style={{ borderColor: 'var(--input-border)' }} rounded-sm px-3 py-2 text-sm style={{ color: 'var(--text-primary)' }} focus:outline-none style={{ outlineColor: 'var(--input-focus)' }}"
                            >
                                <option value="">All Types</option>
                                {types.map(t => <option key={t} value={t}>{t}</option>)}
                            </select>
                        </div>
                    </div>
                </div>

                {/* Count */}
                <p className="text-sm style={{ color: 'var(--text-muted)' }} mb-6">{filtered.length} {category.name.toLowerCase()} found</p>

                {/* Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                    {filtered.map(item => {
                        const image = item.item_images?.[0]?.url
                        return (
                            <Link
                                key={item.id}
                                href={`/parks/${item.park_id}/${item.category_id}/${item.id}`}
                                className="group style={{ background: 'var(--card-bg)' }} border style={{ borderColor: 'var(--border)' }} rounded-sm overflow-hidden hover:border-[#66c0f4] transition-colors"
                            >
                                <div className="aspect-square overflow-hidden bg-[#0e1621]">
                                    {image ? (
                                        <img
                                            src={image}
                                            alt={item.name}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-[#4a6a82] text-xs">No image</div>
                                    )}

                                </div>
                                <div className="p-3">
                                    <p className="text-sm font-semibold style={{ color: 'var(--text-primary)' }} group-hover:style={{ color: 'var(--accent)' }} transition-colors truncate">{item.name}</p>
                                    <p className="text-xs style={{ color: 'var(--text-muted)' }} mt-0.5 truncate">{item.parks?.name ?? ''}</p>
                                    {item.specs?.type && (
                                        <p className="text-xs text-[#4a6a82] mt-0.5 truncate">{item.specs.type}</p>
                                    )}
                                </div>
                            </Link>
                        )
                    })}
                </div>

                {filtered.length === 0 && (
                    <div className="text-center py-16">
                        <p className="style={{ color: 'var(--text-muted)' }}">No results found.</p>
                    </div>
                )}
            </div>
        </div>
    )
}