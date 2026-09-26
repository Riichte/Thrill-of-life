'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { useSearchParams, useRouter, usePathname } from 'next/navigation'

interface Item {
    id: string
    name: string
    description: string
    park_id: string
    category_id: string
    specs: any
    parks: { name: string; country: string } | null
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




    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()

    const search = searchParams.get('q') ?? ''
    const sortBy = (searchParams.get('sort') ?? 'name') as 'name' | 'park'
    const filterType = searchParams.get('type') ?? ''
    const filterManufacturer = searchParams.get('manufacturer') ?? ''
    const filterCountry = searchParams.get('country') ?? ''
    const filterModel = searchParams.get('model') ?? ''
    const limit = parseInt(searchParams.get('limit') ?? '25')
    const page = parseInt(searchParams.get('page') ?? '1')

    const countries = useMemo(() => {
        const all = items.map(i => i.parks?.country).filter(Boolean) as string[]
        return [...new Set(all)].sort()
    }, [items])

    const models = useMemo(() => {
        return [...new Set(
            items
                .filter(i => !filterManufacturer || i.specs?.manufacturer === filterManufacturer)
                .map(i => i.specs?.model)
                .filter(Boolean) as string[]
        )].sort()
    }, [items, filterManufacturer])

    const updateParams = (updates: Record<string, string>) => {
        const params = new URLSearchParams(searchParams.toString())
        Object.entries(updates).forEach(([k, v]) => v ? params.set(k, v) : params.delete(k))
        router.replace(`${pathname}?${params.toString()}`, { scroll: false })
    }

    const types = useMemo(() => {
        const all = items.map(i => i.specs?.type).filter(Boolean) as string[]
        return [...new Set(all)].sort()
    }, [items])

    const manufacturers = useMemo(() => {
        const all = items.map(i => i.specs?.manufacturer).filter(Boolean) as string[]
        return [...new Set(all)].sort()
    }, [items])

    const filtered = useMemo(() => {
        let result = items.filter(item =>
            (!search || item.name.toLowerCase().includes(search.toLowerCase()) ||
                item.parks?.name.toLowerCase().includes(search.toLowerCase())) &&
            (!filterType || item.specs?.type === filterType) &&
            (!filterManufacturer || item.specs?.manufacturer === filterManufacturer) &&
            (!filterCountry || item.parks?.country === filterCountry) &&
            (!filterModel || item.specs?.model === filterModel)
        )
        const statusOrder = (s: string) => ['defunct', 'sbno'].includes(s) ? 2 : s === 'coming_soon' ? 1 : 0

        if (sortBy === 'name') result = [...result].sort((a, b) => a.name.localeCompare(b.name))
        if (sortBy === 'park') result = [...result].sort((a, b) => (a.parks?.name ?? '').localeCompare(b.parks?.name ?? ''))
        return result
    }, [items, search, sortBy, filterType, filterManufacturer])

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
                <div className="rounded-sm p-4 mb-8 flex items-end gap-3 overflow-x-auto" style={{ background: 'var(--card-bg)', border: '1px solid var(--border)', whiteSpace: 'nowrap' }}>
                    <div className="flex items-end gap-3" style={{ minWidth: 'max-content' }}>
                        <div className="w-48 flex-shrink-0">
                            <label className="block text-xs font-medium uppercase tracking-wider mb-1" style={{ color: 'var(--text-muted)' }}>Search</label>
                            <input type="text" value={search} onChange={e => updateParams({ q: e.target.value, page: '1' })}
                                placeholder={`Search ${category.name.toLowerCase()}...`}
                                className="w-full rounded-sm px-3 py-2 text-sm focus:outline-none" style={inputStyle} />
                        </div>
                        <div className="w-32 flex-shrink-0">
                            <label className="block text-xs font-medium uppercase tracking-wider mb-1" style={{ color: 'var(--text-muted)' }}>Sort by</label>
                            <select value={sortBy} onChange={e => updateParams({ sort: e.target.value })}
                                className="w-full rounded-sm px-3 py-2 text-sm focus:outline-none" style={inputStyle}>
                                <option value="name">Name</option>
                                <option value="park">Park</option>
                            </select>
                        </div>
                        <div className="w-36 flex-shrink-0">
                            <label className="block text-xs font-medium uppercase tracking-wider mb-1" style={{ color: 'var(--text-muted)' }}>Type</label>
                            <select value={filterType} onChange={e => updateParams({ type: e.target.value, page: '1' })}
                                className="w-full rounded-sm px-3 py-2 text-sm focus:outline-none" style={inputStyle}>
                                <option value="">All Types</option>
                                {types.map(t => <option key={t} value={t}>{t}</option>)}
                            </select>
                        </div>
                        <div className="w-40 flex-shrink-0">
                            <label className="block text-xs font-medium uppercase tracking-wider mb-1" style={{ color: 'var(--text-muted)' }}>Manufacturer</label>
                            <select value={filterManufacturer} onChange={e => updateParams({ manufacturer: e.target.value, model: '', page: '1' })}
                                className="w-full rounded-sm px-3 py-2 text-sm focus:outline-none" style={inputStyle}>
                                <option value="">All Manufacturers</option>
                                {manufacturers.map(m => <option key={m} value={m}>{m}</option>)}
                            </select>
                            <div className="w-36 flex-shrink-0">
                                <label className="block text-xs font-medium uppercase tracking-wider mb-1" style={{ color: 'var(--text-muted)' }}>Country</label>
                                <select value={filterCountry} onChange={e => updateParams({ country: e.target.value, page: '1' })}
                                    className="w-full rounded-sm px-3 py-2 text-sm focus:outline-none" style={inputStyle}>
                                    <option value="">All Countries</option>
                                    {countries.map(c => <option key={c} value={c}>{c}</option>)}
                                </select>
                            </div>
                            <div className="w-40 flex-shrink-0">
                                <label className="block text-xs font-medium uppercase tracking-wider mb-1" style={{ color: 'var(--text-muted)' }}>Model</label>
                                <select value={filterModel} onChange={e => updateParams({ model: e.target.value, page: '1' })}
                                    className="w-full rounded-sm px-3 py-2 text-sm focus:outline-none" style={inputStyle}>
                                    <option value="">All Models</option>
                                    {models.map(m => <option key={m} value={m}>{m}</option>)}
                                </select>
                            </div>
                        </div>
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
                        <button onClick={() => { updateParams({ page: String(Math.max(1, page - 1)) }); window.scrollTo(0, 0) }}
                            className="px-4 py-2 rounded-sm text-sm font-medium disabled:opacity-40"
                            style={{ background: 'var(--card-bg)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}>
                            ← Prev
                        </button>
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                            <button key={p} onClick={() => { updateParams({ page: String(p) }); window.scrollTo(0, 0) }}
                                className="px-3 py-2 rounded-sm text-sm font-medium"
                                style={{
                                    background: p === page ? 'var(--accent)' : 'var(--card-bg)',
                                    border: '1px solid var(--border)',
                                    color: p === page ? 'var(--bg-tertiary)' : 'var(--text-muted)'
                                }}>
                                {p}
                            </button>
                        ))}
                        <button onClick={() => { updateParams({ page: String(Math.min(totalPages, page + 1)) }); window.scrollTo(0, 0) }}
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