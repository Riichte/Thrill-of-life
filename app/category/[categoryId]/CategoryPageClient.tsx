'use client'

import { useState, useMemo, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useSearchParams, useRouter, usePathname } from 'next/navigation'
import { FadeImage } from '@/components/FadeImage'

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





const num = (v: any) => {
    const n = parseFloat(String(v ?? '').replace(/[^0-9.]/g, ''))
    return isNaN(n) ? 0 : n
}

const toSeconds = (v: any) => {
    const s = String(v ?? '')
    if (s.includes(':')) {
        const [m, sec] = s.split(':')
        return num(m) * 60 + num(sec)
    }
    return num(s)
}

// height or drop (whichever is bigger), converted from meters to feet
const heightFt = (specs: any) => Math.round(Math.max(num(specs?.height), num(specs?.drop)) * 3.28084)

const getSize = (specs: any) => {
    const h = heightFt(specs)
    if (h >= 500 && h < 600) return 'Exa Coaster'
    if (h >= 400 && h < 500) return 'Strata Coaster'
    if (h >= 300 && h < 400) return 'Giga Coaster'
    if (h >= 200 && h < 300) return 'Hyper Coaster'
    if (h >= 100 && h < 200) return 'Mega Coaster'
    return ''
}

const SIZES = ['Mega Coaster', 'Hyper Coaster', 'Giga Coaster', 'Strata Coaster', 'Exa Coaster']

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
    const [localSearch, setLocalSearch] = useState(search)
    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
    const sortBy = searchParams.get('sort') ?? 'name'
    const order = searchParams.get('order') ?? 'asc'
    const filterSize = searchParams.get('size') ?? ''
    const filterType = searchParams.get('type') ?? ''
    const filterManufacturer = searchParams.get('manufacturer') ?? ''
    const filterCountry = searchParams.get('country') ?? ''
    const filterModel = searchParams.get('model') ?? ''
    const limit = parseInt(searchParams.get('limit') ?? '25')
    const page = parseInt(searchParams.get('page') ?? '1')
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }, [page])
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
            (!filterModel || item.specs?.model === filterModel) &&
            (!filterSize || getSize(item.specs) === filterSize)
        )
        const dir = order === 'desc' ? -1 : 1
        result = [...result].sort((a, b) => {
            if (sortBy === 'name') return dir * a.name.localeCompare(b.name)
            if (sortBy === 'park') return dir * (a.parks?.name ?? '').localeCompare(b.parks?.name ?? '')
            if (sortBy === 'size') return dir * (heightFt(a.specs) - heightFt(b.specs))
            if (sortBy === 'year') return dir * (num(a.specs?.year_opened) - num(b.specs?.year_opened))
            if (sortBy === 'duration') return dir * (toSeconds(a.specs?.duration) - toSeconds(b.specs?.duration))
            return dir * (num(a.specs?.[sortBy]) - num(b.specs?.[sortBy]))
        })
        return result
    }, [items, search, sortBy, order, filterType, filterManufacturer, filterCountry, filterModel, filterSize])

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
                            <input type="text" value={localSearch} onChange={e => {
                                setLocalSearch(e.target.value)
                                if (debounceRef.current) clearTimeout(debounceRef.current)
                                debounceRef.current = setTimeout(() => updateParams({ q: e.target.value, page: '1' }), 300)
                            }}
                                placeholder={`Search ${category.name.toLowerCase()}...`}
                                className="w-full rounded-sm px-3 py-2 text-sm focus:outline-none" style={inputStyle} />
                        </div>
                        <div className="w-44 flex-shrink-0">
                            <label className="block text-xs font-medium uppercase tracking-wider mb-1" style={{ color: 'var(--text-muted)' }}>Sort by</label>
                            <div className="flex gap-1">
                                <select value={sortBy} onChange={e => updateParams({ sort: e.target.value })}
                                    className="w-full rounded-sm px-3 py-2 text-sm focus:outline-none" style={inputStyle}>
                                    <option value="name">Name</option>
                                    <option value="park">Park</option>
                                    <option value="year">Year</option>
                                    <option value="size">Size</option>
                                    <option value="speed">Speed</option>
                                    <option value="length">Length</option>
                                    <option value="duration">Duration</option>
                                    <option value="inversions">Inversions</option>
                                </select>
                                <button onClick={() => updateParams({ order: order === 'asc' ? 'desc' : 'asc' })}
                                    title={order === 'asc' ? 'Ascending' : 'Descending'}
                                    className="rounded-sm px-2 text-sm" style={inputStyle}>
                                    {order === 'asc' ? '↑' : '↓'}
                                </button>
                            </div>
                        </div>
                        <div className="w-36 flex-shrink-0">
                            <label className="block text-xs font-medium uppercase tracking-wider mb-1" style={{ color: 'var(--text-muted)' }}>Type</label>
                            <select value={filterType} onChange={e => updateParams({ type: e.target.value, page: '1' })}
                                className="w-full rounded-sm px-3 py-2 text-sm focus:outline-none" style={inputStyle}>
                                <option value="">All Types</option>
                                {types.map(t => <option key={t} value={t}>{t}</option>)}
                            </select>
                        </div>
                        {category.id === 'roller-coasters' && (
                            <div className="w-40 flex-shrink-0">
                                <label className="block text-xs font-medium uppercase tracking-wider mb-1" style={{ color: 'var(--text-muted)' }}>Size</label>
                                <select value={filterSize} onChange={e => updateParams({ size: e.target.value, page: '1' })}
                                    className="w-full rounded-sm px-3 py-2 text-sm focus:outline-none" style={inputStyle}>
                                    <option value="">All Sizes</option>
                                    {SIZES.map(s => <option key={s} value={s}>{s}</option>)}
                                </select>
                            </div>
                        )}
                        <div className="w-40 flex-shrink-0">
                            <label className="block text-xs font-medium uppercase tracking-wider mb-1" style={{ color: 'var(--text-muted)' }}>Manufacturer</label>
                            <select value={filterManufacturer} onChange={e => updateParams({ manufacturer: e.target.value, model: '', page: '1' })}
                                className="w-full rounded-sm px-3 py-2 text-sm focus:outline-none" style={inputStyle}>
                                <option value="">All Manufacturers</option>
                                {manufacturers.map(m => <option key={m} value={m}>{m}</option>)}
                            </select>
                        </div>
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

                {/* Count */}
                <div className="flex items-center justify-between mb-6">
                    <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                        {filtered.length} {category.name.toLowerCase()} found — page {page} of {totalPages || 1}
                    </p>
                    <label className="text-sm" style={{ color: 'var(--text-muted)' }}>
                        Results per page:
                        <select
                            value={searchParams.get('limit') ?? '25'}
                            onChange={e => updateParams({ limit: e.target.value, page: '1' })}
                            className="ml-2 px-3 py-1 rounded-sm text-sm focus:outline-none"
                            style={{ background: 'var(--input-bg)', border: '1px solid var(--input-border)', color: 'var(--text-primary)' }}>
                            <option value="25">25</option>
                            <option value="50">50</option>
                            <option value="100">100</option>
                            <option value={String(filtered.length)}>All</option>
                        </select>
                    </label>
                </div>


                {/* Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4"></div>

                {/* Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                    {paginated.map((item, index) => {
                        const image = (item.item_images?.find((img: any) => img.sort_order === 0) ?? item.item_images?.[0])?.url
                        return (
                            <Link
                                key={item.id}
                                href={`/parks/${item.park_id}/${item.category_id}/${item.id}`}
                                className="group rounded-sm overflow-hidden transition-colors aspect-square flex flex-col"
                                style={{
                                    background: 'var(--card-bg)',
                                    border: '1px solid var(--border)',
                                    animation: 'slideUpFade 0.6s ease-out forwards',
                                    animationDelay: `${Math.floor(index / 5) * 0.15}s`,
                                    opacity: 0,
                                }}
                                onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--accent)')}
                                onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--border)')}>
                                <div className="relative flex-1 overflow-hidden" style={{ background: 'var(--bg-tertiary)' }}>
                                    {image ? (
                                        <FadeImage src={image} alt={item.name} fill
                                            sizes="(max-width: 768px) 50vw, 20vw"
                                            quality={75}
                                            className="object-cover object-top group-hover:scale-105" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-xs" style={{ color: 'var(--text-faint)' }}>
                                            No image
                                        </div>
                                    )}
                                </div>
                                <div className="p-3" style={{ background: 'var(--card-bg)', borderTop: '1px solid var(--border)' }}>
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
                        <button onClick={() => { updateParams({ page: String(Math.max(1, page - 1)) });  }}
                            disabled={page === 1}
                            className="px-4 py-2 rounded-sm text-sm font-medium disabled:opacity-40"
                            style={{ background: 'var(--card-bg)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}>
                            ← Prev
                        </button>
                        {(totalPages <= 6
                            ? Array.from({ length: totalPages }, (_, i) => i + 1)
                            : (() => {
                                const first = [1, 2, 3]
                                const last = [totalPages - 2, totalPages - 1, totalPages]
                                const pages: (number | -1)[] = [...first]
                                if (first[2] < last[0] - 1) pages.push(-1)
                                last.forEach(p => { if (!pages.includes(p)) pages.push(p) })
                                return pages
                            })()
                        ).map((p, i) =>
                            p === -1 ? (
                                <span key={`ellipsis-${i}`} style={{ color: 'var(--text-muted)' }}>…</span>
                            ) : (
                                <button key={p} onClick={() => { updateParams({ page: String(p) });  }}
                                    className="px-3 py-2 rounded-sm text-sm font-medium"
                                    style={{
                                        background: p === page ? 'var(--accent)' : 'var(--card-bg)',
                                        border: '1px solid var(--border)',
                                        color: p === page ? 'var(--bg-tertiary)' : 'var(--text-muted)'
                                    }}>
                                    {p}
                                </button>
                            )
                        )}
                        <button onClick={() => { updateParams({ page: String(Math.min(totalPages, page + 1)) });  }}
                            disabled={page === totalPages}
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