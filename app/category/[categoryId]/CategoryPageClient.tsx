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
    status: string
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
    const [limit, setLimit] = useState(25)
    const [page, setPage] = useState(1)

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
        const statusOrder = (s: string) => ['defunct', 'sbno'].includes(s) ? 2 : s === 'coming_soon' ? 1 : 0

        if (sortBy === 'name') result = [...result].sort((a, b) => a.name.localeCompare(b.name))
        if (sortBy === 'park') result = [...result].sort((a, b) => (a.parks?.name ?? '').localeCompare(b.parks?.name ?? ''))
        return result
    }, [items, search, sortBy, filterType])

    const totalPages = Math.ceil(filtered.length / limit)
    const paginated = filtered.slice((page - 1) * limit, page * limit)

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
                <div className="rounded-sm p-4 mb-8 flex flex-wrap items-end gap-4" style={{ background: 'var(--card-bg)', border: '1px solid var(--border)' }}>
                    <div className="flex-1 min-w-[180px]">
                        <label className="block text-xs font-medium uppercase tracking-wider mb-1" style={{ color: 'var(--text-muted)' }}>Search</label>
                        <input type="text" value={search} onChange={e => { setSearch(e.target.value); setPage(1) }}
                            placeholder={`Search ${category.name.toLowerCase()}...`}
                            className="w-full rounded-sm px-3 py-2 text-sm focus:outline-none" style={inputStyle} />
                    </div>
                    <div className="min-w-[140px]">
                        <label className="block text-xs font-medium uppercase tracking-wider mb-1" style={{ color: 'var(--text-muted)' }}>Sort by</label>
                        <select value={sortBy} onChange={e => setSortBy(e.target.value as 'name' | 'park')}
                            className="w-full rounded-sm px-3 py-2 text-sm focus:outline-none" style={inputStyle}>
                            <option value="name">Name</option>
                            <option value="park">Park</option>
                        </select>
                    </div>
                    <div className="min-w-[140px]">
                        <label className="block text-xs font-medium uppercase tracking-wider mb-1" style={{ color: 'var(--text-muted)' }}>Type</label>
                        <select value={filterType} onChange={e => { setFilterType(e.target.value); setPage(1) }}
                            className="w-full rounded-sm px-3 py-2 text-sm focus:outline-none" style={inputStyle}>
                            <option value="">All Types</option>
                            {types.map(t => <option key={t} value={t}>{t}</option>)}
                        </select>
                    </div>
                    <div className="min-w-[100px]">
                        <label className="block text-xs font-medium uppercase tracking-wider mb-1" style={{ color: 'var(--text-muted)' }}>Show</label>
                        <select value={limit} onChange={e => { setLimit(parseInt(e.target.value)); setPage(1) }}
                            className="w-full rounded-sm px-3 py-2 text-sm focus:outline-none" style={inputStyle}>
                            <option value={25}>25</option>
                            <option value={50}>50</option>
                            <option value={100}>100</option>
                        </select>
                    </div>
                </div>

                {/* Count */}
                <p className="text-sm mb-6" style={{ color: 'var(--text-muted)' }}>
                    {filtered.length} {category.name.toLowerCase()} found — page {page} of {totalPages || 1}
                </p>

                {/* Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                    {paginated.map(item => {
                        const image = (item.item_images?.find((img: any) => img.sort_order === 0) ?? item.item_images?.[0])?.url
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
                                        <img src={image} alt={item.name}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
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
                                    {['sbno', 'defunct'].includes(item.status) && (
                                        <span className="text-xs mt-0.5 px-1.5 py-0.5 rounded-sm font-semibold uppercase tracking-wide inline-block"
                                            style={{ background: item.status === 'defunct' ? 'rgba(239,68,68,0.15)' : 'rgba(249,115,22,0.15)', color: item.status === 'defunct' ? '#ef4444' : '#f97316' }}>
                                            {item.status === 'sbno' ? 'SBNO' : 'Defunct'}
                                        </span>
                                    )}
                                </div>
                            </Link>
                        )
                    })}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="flex items-center justify-center gap-2 mt-8">
                        <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                            className="px-4 py-2 rounded-sm text-sm font-medium disabled:opacity-40"
                            style={{ background: 'var(--card-bg)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}>
                            ← Prev
                        </button>
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                            <button key={p} onClick={() => setPage(p)}
                                className="px-3 py-2 rounded-sm text-sm font-medium"
                                style={{
                                    background: p === page ? 'var(--accent)' : 'var(--card-bg)',
                                    border: '1px solid var(--border)',
                                    color: p === page ? 'var(--bg-tertiary)' : 'var(--text-muted)'
                                }}>
                                {p}
                            </button>
                        ))}
                        <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                            className="px-4 py-2 rounded-sm text-sm font-medium disabled:opacity-40"
                            style={{ background: 'var(--card-bg)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}>
                            Next →
                        </button>
                    </div>
                )}

                {/* Empty state */}
                {filtered.length === 0 && (
                    <div className="text-center py-16">
                        <p style={{ color: 'var(--text-muted)' }}>No results found.</p>
                    </div>
                )}
            </div>
        </div>
    )
}