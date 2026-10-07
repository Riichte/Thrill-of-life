'use client'

import { useMemo } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useSearchParams, useRouter } from 'next/navigation'

interface Item {
  id: string
  name: string
  description: string
  status: string
  item_images?: { url: string; sort_order: number }[]
  specs?: { model?: string }
}

export default function CategoryPageClient({ park, category, items, soundtrackMode = false, ostCounts = {} }: {
  park: any
  category: any
  items: Item[]
  soundtrackMode?: boolean
  ostCounts?: Record<string, number>
}) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const limit = searchParams.get('limit') === 'all' ? items.length : parseInt(searchParams.get('limit') ?? '25', 10)
  const page = parseInt(searchParams.get('page') ?? '1')

  const totalPages = limit >= items.length ? 1 : Math.ceil(items.length / limit)
  const paginated = items.slice((page - 1) * limit, page * limit)

  const updateParams = (updates: Record<string, string>) => {
    const params = new URLSearchParams(searchParams.toString())
    Object.entries(updates).forEach(([k, v]) => params.set(k, v))
    return `?${params.toString()}`
  }

  const pageNumbers = useMemo(() => {
    if (totalPages <= 6) return Array.from({ length: totalPages }, (_, i) => i + 1)
    const first = [1, 2, 3]
    const last = [totalPages - 2, totalPages - 1, totalPages]
    const pages: (number | -1)[] = [...first]
    if (first[2] < last[0] - 1) pages.push(-1)
    last.forEach(p => { if (!pages.includes(p)) pages.push(p) })
    return pages
  }, [totalPages])

  const inputStyle = {
    background: 'var(--card-bg)',
    border: '1px solid var(--border)',
    color: 'var(--text-primary)',
  }

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-tertiary)', color: 'var(--text-primary)' }}>

      {/* Breadcrumb */}
      <div className="border-b sticky top-16 z-40" style={{ borderColor: 'var(--border)', background: 'var(--bg-secondary)' }}>
        <div className="container mx-auto px-4 py-4">
          <nav className="flex items-center gap-2 text-sm">
            <Link href="/parks" style={{ color: 'var(--accent)' }}>Parks</Link>
            <span style={{ color: 'var(--text-muted)' }}>/</span>
            <Link href={soundtrackMode ? `/parks/${park.id}?mode=soundtrack` : `/parks/${park.id}`} style={{ color: 'var(--accent)' }}>{park.name}</Link>
            <span style={{ color: 'var(--text-muted)' }}>/</span>
            <span style={{ color: 'var(--text-primary)' }}>{category.name}</span>
          </nav>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>{category.name}</h1>
        <p className="text-lg" style={{ color: 'var(--text-muted)' }}>{items.length} {items.length === 1 ? 'item' : 'items'} in {park.name}</p>
      </div>

      {items.length > 0 ? (
        <div className="container mx-auto px-4 pb-16">

          {/* Controls */}
          <div className="mb-6 flex items-center justify-between">
            <label className="text-sm" style={{ color: 'var(--text-muted)' }}>
              Results per page:
              <select
                value={searchParams.get('limit') ?? '25'}
                onChange={e => router.replace(updateParams({ page: String(Math.max(1, page - 1)) }), { scroll: false })}
                className="ml-2 px-3 py-1 rounded-sm text-sm focus:outline-none"
                style={inputStyle}
              >
                <option value="25">25</option>
                <option value="50">50</option>
                <option value="100">100</option>
                <option value="all">All</option>
              </select>
            </label>
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
              Page {page} of {totalPages}
            </p>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-8">
            {paginated.map((item) => {
              const image = item.item_images?.find(img => img.sort_order === 0) ?? item.item_images?.[0]
              return (
                <Link key={item.id} href={`/parks/${park.id}/${category.id}/${item.id}${soundtrackMode ? '/osts' : ''}`} className="group">
                  <div className="rounded-sm overflow-hidden transition-colors aspect-square flex flex-col"
                    style={{ background: 'var(--card-bg)', border: '1px solid var(--border)' }}
                    onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--accent)')}
                    onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--border)')}>
                    <div className="relative flex-1 overflow-hidden">
                      {image?.url ? (
                        <Image src={image.url} alt={item.name} fill loading="lazy" quality={100}
                          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center"
                          style={{ background: 'var(--bg-elevated)' }}>
                          <span style={{ color: 'var(--text-muted)' }}>No image</span>
                        </div>
                      )}
                    </div>
                    <div className="p-3" style={{ background: 'var(--card-bg)', borderTop: '1px solid var(--border)' }}>
                      <h3 className="text-sm font-semibold transition-colors mb-2" style={{ color: 'var(--text-primary)' }}>
                        {item.name}
                      </h3>
                      <div className="mt-auto flex flex-wrap items-center gap-2">
                        {soundtrackMode && (
                          <span className="inline-block text-xs px-2.5 py-1 rounded" style={{ background: 'var(--accent-bg)', color: 'var(--accent)', border: '1px solid var(--accent)' }}>
                            {ostCounts[item.id] ?? 0} track{(ostCounts[item.id] ?? 0) !== 1 ? 's' : ''}
                          </span>
                        )}
                        {!soundtrackMode && item.specs?.model && (
                          <span className="inline-block text-xs px-2.5 py-1 rounded" style={{ background: 'var(--accent-bg)', color: 'var(--accent)', border: '1px solid var(--accent)' }}>
                            {item.specs.model}
                          </span>
                        )}
                        {['sbno', 'defunct'].includes(item.status) && (
                          <span className="inline-block text-xs px-2.5 py-1 rounded font-semibold uppercase"
                            style={{
                              background: item.status === 'defunct' ? 'rgba(239,68,68,0.15)' : 'rgba(249,115,22,0.15)',
                              color: item.status === 'defunct' ? '#ef4444' : '#f97316'
                            }}>
                            {item.status === 'sbno' ? 'SBNO' : 'Defunct'}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-8">
              <button
                onClick={() => { updateParams({ page: String(Math.max(1, page - 1)) }); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
                disabled={page === 1}
                className="px-4 py-2 rounded-sm text-sm font-medium disabled:opacity-40"
                style={inputStyle}>
                ← Prev
              </button>

              {pageNumbers.map((p, i) =>
                p === -1 ? (
                  <span key={`ellipsis-${i}`} style={{ color: 'var(--text-muted)' }}>…</span>
                ) : (
                  <button key={p}
                    onClick={() => { updateParams({ page: String(p) }); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
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

              <button
                onClick={() => { updateParams({ page: String(Math.min(totalPages, page + 1)) }); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
                disabled={page === totalPages}
                className="px-4 py-2 rounded-sm text-sm font-medium disabled:opacity-40"
                style={inputStyle}>
                Next →
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="container mx-auto px-4 py-16 text-center">
          <p className="text-lg" style={{ color: 'var(--text-muted)' }}>No items found in this category.</p>
          <Link href={`/parks/${park.id}`} className="mt-4 inline-block" style={{ color: 'var(--accent)' }}>
            ← Back to {park.name}
          </Link>
        </div>
      )}
    </div>
  )
}