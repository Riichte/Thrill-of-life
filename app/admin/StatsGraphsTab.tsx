'use client'

import { useEffect, useMemo, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import StatChart from '@/components/StatChart'
import { computeGraph, StatGraph, SPEC_FIELDS, AGGREGATIONS } from '@/lib/statsCompute'

type AdminItem = { id: string; category_id: string; specs: any }
type FormState = Omit<StatGraph, 'id'>

const emptyForm: FormState = {
    title: '',
    description: '',
    category_id: 'roller-coasters',
    group_field: 'year_opened',
    value_field: 'height',
    aggregation: 'avg',
    exclude_models: [],
    exclude_types: [],
    min_group_size: 1,
    min_year: null,
    min_height: null,
    min_speed: null,
    compare_models: [],
    chart_type: 'line',
    y_label: '',
    published: true,
    sort_order: 0,
}

export default function StatsGraphsTab({ items, categories }: { items: AdminItem[]; categories: { id: string; name: string }[] }) {
    const supabase = createClient()
    const [graphs, setGraphs] = useState<StatGraph[]>([])
    const [form, setForm] = useState<FormState>(emptyForm)
    const [editingId, setEditingId] = useState<string | null>(null)
    const [saving, setSaving] = useState(false)
    const [message, setMessage] = useState('')

    const inputClass = `w-full rounded-sm px-3 py-2 text-sm focus:outline-none`
    const inputStyle = { background: 'var(--bg-elevated)', border: '1px solid var(--input-border)', color: 'var(--text-primary)' }
    const labelClass = `block text-xs font-medium uppercase tracking-wider mb-1`
    const labelStyle = { color: 'var(--text-muted)' }

    const loadGraphs = async () => {
        const { data } = await supabase.from('stat_graphs').select('*').order('sort_order').order('created_at')
        setGraphs((data as StatGraph[]) ?? [])
    }

    useEffect(() => { loadGraphs() }, [])

    const categoryItems = useMemo(() => items.filter(i => i.category_id === form.category_id), [items, form.category_id])
    const modelOptions = useMemo(
        () => [...new Set(categoryItems.map(i => i.specs?.model).filter((m): m is string => typeof m === 'string' && m !== ''))].sort(),
        [categoryItems]
    )
    const typeOptions = useMemo(
        () => [...new Set(categoryItems.map(i => i.specs?.type).filter((t): t is string => typeof t === 'string' && t !== ''))].sort(),
        [categoryItems]
    )

    const preview = useMemo(() => computeGraph(form, items), [form, items])

    const toggle = (key: 'exclude_models' | 'exclude_types' | 'compare_models', value: string) =>
        setForm(f => ({
            ...f,
            [key]: f[key].includes(value) ? f[key].filter(v => v !== value) : [...f[key], value],
        }))

    const handleSave = async () => {
        if (!form.title.trim()) { setMessage('Title is required'); return }
        setSaving(true)
        const payload = {
            ...form,
            title: form.title.trim(),
            description: form.description?.trim() || null,
            y_label: form.y_label?.trim() || null,
        }
        const { error } = editingId
            ? await supabase.from('stat_graphs').update(payload).eq('id', editingId)
            : await supabase.from('stat_graphs').insert(payload)
        if (error) setMessage(error.message)
        else {
            setMessage(editingId ? 'Graph updated' : 'Graph created')
            setForm(emptyForm)
            setEditingId(null)
            loadGraphs()
        }
        setSaving(false)
    }

    const handleEdit = (g: StatGraph) => {
        setEditingId(g.id)
        const { id, ...rest } = g
        setForm({ ...rest, description: g.description ?? '', y_label: g.y_label ?? '' })
    }

    const handleDelete = async (id: string) => {
        if (!confirm('Delete this graph?')) return
        const { error } = await supabase.from('stat_graphs').delete().eq('id', id)
        if (error) setMessage(error.message)
        else {
            if (editingId === id) { setEditingId(null); setForm(emptyForm) }
            loadGraphs()
        }
    }

    const chip = (active: boolean) => ({
        background: active ? 'var(--cta)' : 'var(--bg-elevated)',
        color: active ? 'var(--cta-text)' : 'var(--text-muted)',
        border: '1px solid var(--input-border)',
    })

    const numOrNull = (s: string) => (s === '' ? null : Number(s))

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="rounded-sm p-6" style={{ background: 'var(--card-bg)', border: '1px solid var(--border)' }}>
                <h2 className="text-lg font-semibold mb-6" style={{ color: 'var(--text-primary)' }}>{editingId ? 'Edit Graph' : 'Add Graph'}</h2>
                {message && <p className="text-sm mb-4" style={{ color: 'var(--accent)' }}>{message}</p>}
                <div className="space-y-4">
                    <div>
                        <label className={labelClass} style={labelStyle}>Title</label>
                        <input className={inputClass} style={inputStyle} value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} />
                    </div>
                    <div>
                        <label className={labelClass} style={labelStyle}>Description</label>
                        <textarea className={inputClass} style={inputStyle} rows={2} value={form.description ?? ''} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
                    </div>
                    <div>
                        <label className={labelClass} style={labelStyle}>Category</label>
                        <select className={inputClass} style={inputStyle} value={form.category_id}
                            onChange={e => setForm(f => ({ ...f, category_id: e.target.value, exclude_models: [], exclude_types: [], compare_models: [] }))}>
                            {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                        </select>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className={labelClass} style={labelStyle}>Group by (X axis)</label>
                            <select className={inputClass} style={inputStyle} value={form.group_field} onChange={e => setForm(f => ({ ...f, group_field: e.target.value }))}>
                                {SPEC_FIELDS.map(s => <option key={s.key} value={s.key}>{s.label}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className={labelClass} style={labelStyle}>Value (Y axis)</label>
                            <select className={inputClass} style={inputStyle} value={form.value_field} onChange={e => setForm(f => ({ ...f, value_field: e.target.value }))}>
                                {SPEC_FIELDS.map(s => <option key={s.key} value={s.key}>{s.label}</option>)}
                            </select>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className={labelClass} style={labelStyle}>Aggregation</label>
                            <select className={inputClass} style={inputStyle} value={form.aggregation}
                                onChange={e => setForm(f => ({ ...f, aggregation: e.target.value as StatGraph['aggregation'] }))}>
                                {AGGREGATIONS.map(a => <option key={a.key} value={a.key}>{a.label}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className={labelClass} style={labelStyle}>Chart type</label>
                            <select className={inputClass} style={inputStyle} value={form.chart_type}
                                onChange={e => setForm(f => ({ ...f, chart_type: e.target.value as 'line' | 'bar' }))}>
                                <option value="line">Line</option>
                                <option value="bar">Bar</option>
                            </select>
                        </div>
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                        <div>
                            <label className={labelClass} style={labelStyle}>Min items per group</label>
                            <input type="number" min={1} className={inputClass} style={inputStyle} value={form.min_group_size}
                                onChange={e => setForm(f => ({ ...f, min_group_size: Math.max(1, parseInt(e.target.value) || 1) }))} />
                        </div>
                        <div>
                            <label className={labelClass} style={labelStyle}>Y label</label>
                            <input className={inputClass} style={inputStyle} value={form.y_label ?? ''} onChange={e => setForm(f => ({ ...f, y_label: e.target.value }))} />
                        </div>
                        <div>
                            <label className={labelClass} style={labelStyle}>Sort order</label>
                            <input type="number" className={inputClass} style={inputStyle} value={form.sort_order}
                                onChange={e => setForm(f => ({ ...f, sort_order: parseInt(e.target.value) || 0 }))} />
                        </div>
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                        <div>
                            <label className={labelClass} style={labelStyle}>Since year</label>
                            <input type="number" className={inputClass} style={inputStyle} value={form.min_year ?? ''}
                                onChange={e => setForm(f => ({ ...f, min_year: numOrNull(e.target.value) }))} />
                        </div>
                        <div>
                            <label className={labelClass} style={labelStyle}>Min height (m)</label>
                            <input type="number" className={inputClass} style={inputStyle} value={form.min_height ?? ''}
                                onChange={e => setForm(f => ({ ...f, min_height: numOrNull(e.target.value) }))} />
                        </div>
                        <div>
                            <label className={labelClass} style={labelStyle}>Min speed</label>
                            <input type="number" className={inputClass} style={inputStyle} value={form.min_speed ?? ''}
                                onChange={e => setForm(f => ({ ...f, min_speed: numOrNull(e.target.value) }))} />
                        </div>
                    </div>
                    <div>
                        <label className={labelClass} style={labelStyle}>Compare models vs all ({form.compare_models.length})</label>
                        <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto">
                            {modelOptions.map(m => (
                                <button key={m} type="button" onClick={() => toggle('compare_models', m)} className="px-2 py-1 text-xs rounded-sm" style={chip(form.compare_models.includes(m))}>{m}</button>
                            ))}
                        </div>
                    </div>
                    <div>
                        <label className={labelClass} style={labelStyle}>Exclude models ({form.exclude_models.length})</label>
                        <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto">
                            {modelOptions.length === 0 && <p className="text-xs" style={{ color: 'var(--text-muted)' }}>No models in this category.</p>}
                            {modelOptions.map(m => (
                                <button key={m} type="button" onClick={() => toggle('exclude_models', m)} className="px-2 py-1 text-xs rounded-sm" style={chip(form.exclude_models.includes(m))}>{m}</button>
                            ))}
                        </div>
                    </div>
                    <div>
                        <label className={labelClass} style={labelStyle}>Exclude types ({form.exclude_types.length})</label>
                        <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto">
                            {typeOptions.length === 0 && <p className="text-xs" style={{ color: 'var(--text-muted)' }}>No types in this category.</p>}
                            {typeOptions.map(t => (
                                <button key={t} type="button" onClick={() => toggle('exclude_types', t)} className="px-2 py-1 text-xs rounded-sm" style={chip(form.exclude_types.includes(t))}>{t}</button>
                            ))}
                        </div>
                    </div>
                    <label className="flex items-center gap-2 text-sm" style={{ color: 'var(--text-primary)' }}>
                        <input type="checkbox" checked={form.published} onChange={e => setForm(f => ({ ...f, published: e.target.checked }))} />
                        Published
                    </label>
                    <div className="flex gap-3 pt-2">
                        <button onClick={handleSave} disabled={saving} className="px-4 py-2 text-sm font-medium rounded-sm disabled:opacity-50"
                            style={{ background: 'var(--cta)', color: 'var(--cta-text)' }}>
                            {saving ? 'Saving...' : editingId ? 'Update Graph' : 'Create Graph'}
                        </button>
                        {editingId && (
                            <button onClick={() => { setEditingId(null); setForm(emptyForm) }} className="px-4 py-2 text-sm font-medium rounded-sm"
                                style={{ background: 'var(--bg-elevated)', color: 'var(--text-primary)' }}>Cancel</button>
                        )}
                    </div>
                </div>
            </div>

            <div className="space-y-8">
                <div className="rounded-sm p-6" style={{ background: 'var(--card-bg)', border: '1px solid var(--border)' }}>
                    <h2 className="text-lg font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>Preview ({preview.itemCount} items)</h2>
                    <StatChart series={preview.series} type={form.chart_type} yLabel={form.y_label} xLabel={SPEC_FIELDS.find(f => f.key === form.group_field)?.label} />
                </div>

                <div className="rounded-sm p-6" style={{ background: 'var(--card-bg)', border: '1px solid var(--border)' }}>
                    <h2 className="text-lg font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>Graphs ({graphs.length})</h2>
                    <div className="space-y-2 max-h-[400px] overflow-y-auto">
                        {graphs.map(g => (
                            <div key={g.id} className="flex items-center justify-between gap-3 p-3 rounded-sm" style={{ background: 'var(--bg-elevated)' }}>
                                <div className="min-w-0">
                                    <p className="text-sm font-medium truncate" style={{ color: 'var(--text-primary)' }}>{g.title}</p>
                                    <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                                        {g.category_id} · {g.aggregation} {g.value_field} by {g.group_field} · {g.published ? 'published' : 'hidden'}
                                    </p>
                                </div>
                                <div className="flex gap-2 flex-shrink-0">
                                    <button onClick={() => handleEdit(g)} className="px-3 py-1.5 text-xs rounded-sm" style={{ background: 'var(--bg-elevated)', color: 'var(--accent)' }}>Edit</button>
                                    <button onClick={() => handleDelete(g.id)} className="px-3 py-1.5 text-xs rounded-sm" style={{ background: 'rgba(239,68,68,0.2)', color: '#ef4444' }}>Delete</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}