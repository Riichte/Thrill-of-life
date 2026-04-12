'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

type Park = { id: string; name: string; description: string; logo_url: string; cover_image_url: string; country: string; company: string; park_type: string; location: string }
type Category = { id: string; name: string }
type Item = { id: string; park_id: string; category_id: string; name: string; description: string; location_in_park: string; specs: any }

const emptyPark: Omit<Park, 'id'> = { name: '', description: '', logo_url: '', cover_image_url: '', country: '', company: '', park_type: 'Theme Park', location: '' }
const emptyItem: Omit<Item, 'id'> = { park_id: '', category_id: '', name: '', description: '', location_in_park: '', specs: {} }

export default function AdminDashboard({ parks, categories, items }: { parks: Park[]; categories: Category[]; items: Item[] }) {
    const supabase = createClient()
    const router = useRouter()
    const [tab, setTab] = useState<'parks' | 'items' | 'images'>('parks')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')

    // Park form
    const [parkForm, setParkForm] = useState<Omit<Park, 'id'>>(emptyPark)
    const [editingParkId, setEditingParkId] = useState<string | null>(null)
    const [parkIdInput, setParkIdInput] = useState('')

    // Item form
    const [itemForm, setItemForm] = useState<Omit<Item, 'id'>>(emptyItem)
    const [editingItemId, setEditingItemId] = useState<string | null>(null)
    const [itemIdInput, setItemIdInput] = useState('')
    const [specsText, setSpecsText] = useState('{}')

    const [imageItemId, setImageItemId] = useState('')
    const [imageUrl, setImageUrl] = useState('')
    const [imageOrder, setImageOrder] = useState(0)
    const [imageAuthor, setImageAuthor] = useState('')
    const [imageSourceUrl, setImageSourceUrl] = useState('')
    const [imageLicense, setImageLicense] = useState('CC BY 4.0')
    const [itemImages, setItemImages] = useState<{ id: string; url: string; sort_order: number; attribution_author?: string; attribution_url?: string; license?: string }[]>([])

    const notify = (msg: string, isError = false) => {
        if (isError) setError(msg)
        else setSuccess(msg)
        setTimeout(() => { setError(''); setSuccess('') }, 4000)
    }

    // ─── Parks ───────────────────────────────────────────────

    const handleEditPark = (park: Park) => {
        setEditingParkId(park.id)
        setParkIdInput(park.id)
        setParkForm({ name: park.name, description: park.description, logo_url: park.logo_url, cover_image_url: park.cover_image_url, country: park.country, company: park.company, park_type: park.park_type, location: park.location })
    }

    const handleSavePark = async () => {
        setLoading(true)
        try {
            if (editingParkId) {
                const { error } = await supabase.from('parks').update(parkForm).eq('id', editingParkId)
                if (error) throw error
                notify('Park updated successfully')
            } else {
                if (!parkIdInput.trim()) throw new Error('Park ID is required')
                const { error } = await supabase.from('parks').insert({ id: parkIdInput.trim(), ...parkForm })
                if (error) throw error
                notify('Park created successfully')
            }
            setParkForm(emptyPark)
            setParkIdInput('')
            setEditingParkId(null)
            router.refresh()
        } catch (err: any) {
            notify(err.message, true)
        } finally {
            setLoading(false)
        }
    }

    const handleDeletePark = async (id: string) => {
        if (!confirm(`Delete park "${id}"? This will also delete all its items.`)) return
        setLoading(true)
        const { error } = await supabase.from('parks').delete().eq('id', id)
        if (error) notify(error.message, true)
        else { notify('Park deleted'); router.refresh() }
        setLoading(false)
    }

    // ─── Items ───────────────────────────────────────────────

    const handleEditItem = (item: Item) => {
        setEditingItemId(item.id)
        setItemIdInput(item.id)
        setItemForm({ park_id: item.park_id, category_id: item.category_id, name: item.name, description: item.description, location_in_park: item.location_in_park, specs: item.specs })
        setSpecsText(JSON.stringify(item.specs ?? {}, null, 2))
    }

    const handleSaveItem = async () => {
        setLoading(true)
        try {
            let parsedSpecs = {}
            try { parsedSpecs = JSON.parse(specsText) } catch { throw new Error('Invalid JSON in specs field') }

            const payload = { ...itemForm, specs: parsedSpecs }

            if (editingItemId) {
                const { error } = await supabase.from('items').update(payload).eq('id', editingItemId)
                if (error) throw error
                notify('Item updated successfully')
            } else {
                if (!itemIdInput.trim()) throw new Error('Item ID is required')
                const { error } = await supabase.from('items').insert({ id: itemIdInput.trim(), ...payload })
                if (error) throw error
                notify('Item created successfully')
            }
            setItemForm(emptyItem)
            setItemIdInput('')
            setSpecsText('{}')
            setEditingItemId(null)
            router.refresh()
        } catch (err: any) {
            notify(err.message, true)
        } finally {
            setLoading(false)
        }
    }

    const handleDeleteItem = async (id: string) => {
        if (!confirm(`Delete item "${id}"?`)) return
        setLoading(true)
        const { error } = await supabase.from('items').delete().eq('id', id)
        if (error) notify(error.message, true)
        else { notify('Item deleted'); router.refresh() }
        setLoading(false)
    }

    // ─── Images ──────────────────────────────────────────────

    const loadImages = async (itemId: string) => {
        setImageItemId(itemId)
        const { data } = await supabase.from('item_images').select('*').eq('item_id', itemId).order('sort_order')
        setItemImages(data ?? [])
    }

    const handleAddImage = async () => {
        if (!imageUrl.trim() || !imageItemId) return
        setLoading(true)
        const { error } = await supabase.from('item_images').insert({
            item_id: imageItemId,
            url: imageUrl.trim(),
            sort_order: imageOrder,
            attribution_author: imageAuthor.trim() || null,
            attribution_url: imageSourceUrl.trim() || null,
            license: imageLicense.trim() || null,
        })
        if (error) notify(error.message, true)
        else {
            notify('Image added')
            setImageUrl('')
            setImageAuthor('')
            setImageSourceUrl('')
            setImageLicense('CC BY 4.0')
            loadImages(imageItemId)
        }
        setLoading(false)
    }

    const handleDeleteImage = async (id: string) => {
        setLoading(true)
        const { error } = await supabase.from('item_images').delete().eq('id', id)
        if (error) notify(error.message, true)
        else loadImages(imageItemId)
        setLoading(false)
    }

    const inputClass = 'w-full bg-[#2a475e] border border-[#3d6a8a] rounded-sm px-3 py-2 text-sm text-[#c6d4df] placeholder-[#6a8a9a] focus:outline-none focus:border-[#66c0f4]'
    const labelClass = 'block text-xs font-medium uppercase tracking-wider text-[#8f98a0] mb-1'
    const btnPrimary = 'px-4 py-2 bg-[#4c6b22] hover:bg-[#5a7a28] disabled:opacity-50 text-white text-sm font-medium rounded-sm transition-colors'
    const btnSecondary = 'px-4 py-2 bg-[#2a475e] hover:bg-[#3d6a8a] text-[#c6d4df] text-sm font-medium rounded-sm transition-colors'
    const btnDanger = 'px-3 py-1.5 bg-red-500/20 hover:bg-red-500/30 text-red-400 text-xs rounded-sm transition-colors'
    const btnEdit = 'px-3 py-1.5 bg-[#2a475e] hover:bg-[#3d6a8a] text-[#66c0f4] text-xs rounded-sm transition-colors'

    return (
        <div className="min-h-screen bg-gray-900 text-white">
            <div className="container mx-auto px-4 py-8 max-w-6xl">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-[#c6d4df]">Admin Dashboard</h1>
                    <p className="text-[#8f98a0] mt-1">Manage parks, rides, and media</p>
                </div>

                {error && <div className="mb-4 px-4 py-3 bg-red-500/10 border border-red-500/30 rounded-sm text-red-400 text-sm">{error}</div>}
                {success && <div className="mb-4 px-4 py-3 bg-green-500/10 border border-green-500/30 rounded-sm text-green-400 text-sm">{success}</div>}

                {/* Tabs */}
                <div className="flex gap-1 mb-8 border-b border-[#2a475e]">
                    {(['parks', 'items', 'images'] as const).map(t => (
                        <button key={t} onClick={() => setTab(t)}
                            className={`px-6 py-3 text-sm font-medium capitalize transition-colors border-b-2 -mb-px ${tab === t ? 'text-[#66c0f4] border-[#66c0f4]' : 'text-[#8f98a0] border-transparent hover:text-white'}`}>
                            {t === 'items' ? 'Rides & Items' : t.charAt(0).toUpperCase() + t.slice(1)}
                        </button>
                    ))}
                </div>

                {/* ─── Parks Tab ─── */}
                {tab === 'parks' && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Form */}
                        <div className="bg-[#1b2838] border border-[#2a475e] rounded-sm p-6">
                            <h2 className="text-lg font-semibold text-[#c6d4df] mb-6">{editingParkId ? 'Edit Park' : 'Add Park'}</h2>
                            <div className="space-y-4">
                                {!editingParkId && (
                                    <div>
                                        <label className={labelClass}>Park ID (slug, e.g. europa-park)</label>
                                        <input className={inputClass} value={parkIdInput} onChange={e => setParkIdInput(e.target.value)} placeholder="europa-park" />
                                    </div>
                                )}
                                {(['name', 'description', 'country', 'company', 'location', 'logo_url', 'cover_image_url'] as const).map(field => (
                                    <div key={field}>
                                        <label className={labelClass}>{field.replace(/_/g, ' ')}</label>
                                        {field === 'description' ? (
                                            <textarea className={inputClass} rows={3} value={parkForm[field]} onChange={e => setParkForm(p => ({ ...p, [field]: e.target.value }))} />
                                        ) : (
                                            <input className={inputClass} value={parkForm[field]} onChange={e => setParkForm(p => ({ ...p, [field]: e.target.value }))} />
                                        )}
                                    </div>
                                ))}
                                <div>
                                    <label className={labelClass}>Park Type</label>
                                    <select className={inputClass} value={parkForm.park_type} onChange={e => setParkForm(p => ({ ...p, park_type: e.target.value }))}>
                                        {['Theme Park', 'Amusement Park', 'Water Park', 'Resort'].map(t => <option key={t}>{t}</option>)}
                                    </select>
                                </div>
                                <div className="flex gap-3 pt-2">
                                    <button onClick={handleSavePark} disabled={loading} className={btnPrimary}>
                                        {loading ? 'Saving...' : editingParkId ? 'Update Park' : 'Add Park'}
                                    </button>
                                    {editingParkId && (
                                        <button onClick={() => { setEditingParkId(null); setParkForm(emptyPark); setParkIdInput('') }} className={btnSecondary}>
                                            Cancel
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Parks List */}
                        <div className="bg-[#1b2838] border border-[#2a475e] rounded-sm p-6">
                            <h2 className="text-lg font-semibold text-[#c6d4df] mb-4">Parks ({parks.length})</h2>
                            <div className="space-y-2 max-h-[600px] overflow-y-auto">
                                {parks.map(park => (
                                    <div key={park.id} className="flex items-center justify-between gap-3 p-3 bg-[#2a475e]/30 rounded-sm">
                                        <div className="min-w-0">
                                            <p className="text-sm font-medium text-[#c6d4df] truncate">{park.name}</p>
                                            <p className="text-xs text-[#8f98a0]">{park.id} · {park.country}</p>
                                        </div>
                                        <div className="flex gap-2 flex-shrink-0">
                                            <button onClick={() => handleEditPark(park)} className={btnEdit}>Edit</button>
                                            <button onClick={() => handleDeletePark(park.id)} className={btnDanger}>Delete</button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* ─── Items Tab ─── */}
                {tab === 'items' && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Form */}
                        <div className="bg-[#1b2838] border border-[#2a475e] rounded-sm p-6">
                            <h2 className="text-lg font-semibold text-[#c6d4df] mb-6">{editingItemId ? 'Edit Item' : 'Add Item'}</h2>
                            <div className="space-y-4">
                                {!editingItemId && (
                                    <div>
                                        <label className={labelClass}>Item ID (slug, e.g. blue-fire)</label>
                                        <input className={inputClass} value={itemIdInput} onChange={e => setItemIdInput(e.target.value)} placeholder="blue-fire" />
                                    </div>
                                )}
                                <div>
                                    <label className={labelClass}>Park</label>
                                    <select className={inputClass} value={itemForm.park_id} onChange={e => setItemForm(p => ({ ...p, park_id: e.target.value }))}>
                                        <option value="">Select a park</option>
                                        {parks.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className={labelClass}>Category</label>
                                    <select className={inputClass} value={itemForm.category_id} onChange={e => setItemForm(p => ({ ...p, category_id: e.target.value }))}>
                                        <option value="">Select a category</option>
                                        {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                    </select>
                                </div>
                                {(['name', 'description', 'location_in_park'] as const).map(field => (
                                    <div key={field}>
                                        <label className={labelClass}>{field.replace(/_/g, ' ')}</label>
                                        {field === 'description' ? (
                                            <textarea className={inputClass} rows={3} value={itemForm[field]} onChange={e => setItemForm(p => ({ ...p, [field]: e.target.value }))} />
                                        ) : (
                                            <input className={inputClass} value={itemForm[field]} onChange={e => setItemForm(p => ({ ...p, [field]: e.target.value }))} />
                                        )}
                                    </div>
                                ))}
                                <div>
                                    <label className={labelClass}>Specs (JSON)</label>
                                    <textarea
                                        className={`${inputClass} font-mono text-xs`}
                                        rows={6}
                                        value={specsText}
                                        onChange={e => setSpecsText(e.target.value)}
                                        placeholder='{"height":"40m","speed":"100 km/h","manufacturer":"Mack Rides","type":"Wooden Coaster"}'
                                    />
                                </div>
                                <div className="flex gap-3 pt-2">
                                    <button onClick={handleSaveItem} disabled={loading} className={btnPrimary}>
                                        {loading ? 'Saving...' : editingItemId ? 'Update Item' : 'Add Item'}
                                    </button>
                                    {editingItemId && (
                                        <button onClick={() => { setEditingItemId(null); setItemForm(emptyItem); setItemIdInput(''); setSpecsText('{}') }} className={btnSecondary}>
                                            Cancel
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Items List */}
                        <div className="bg-[#1b2838] border border-[#2a475e] rounded-sm p-6">
                            <h2 className="text-lg font-semibold text-[#c6d4df] mb-4">Items ({items.length})</h2>
                            <div className="space-y-2 max-h-[600px] overflow-y-auto">
                                {items.map(item => (
                                    <div key={item.id} className="flex items-center justify-between gap-3 p-3 bg-[#2a475e]/30 rounded-sm">
                                        <div className="min-w-0">
                                            <p className="text-sm font-medium text-[#c6d4df] truncate">{item.name}</p>
                                            <p className="text-xs text-[#8f98a0]">{item.id} · {item.category_id}</p>
                                        </div>
                                        <div className="flex gap-2 flex-shrink-0">
                                            <button onClick={() => handleEditItem(item)} className={btnEdit}>Edit</button>
                                            <button onClick={() => handleDeleteItem(item.id)} className={btnDanger}>Delete</button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* ─── Images Tab ─── */}
                {tab === 'images' && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <div className="bg-[#1b2838] border border-[#2a475e] rounded-sm p-6">
                            <h2 className="text-lg font-semibold text-[#c6d4df] mb-6">Manage Images</h2>
                            <div className="space-y-4">
                                <div>
                                    <label className={labelClass}>Select Item</label>
                                    <select className={inputClass} value={imageItemId} onChange={e => loadImages(e.target.value)}>
                                        <option value="">Select an item</option>
                                        {items.map(i => <option key={i.id} value={i.id}>{i.name} ({i.park_id})</option>)}
                                    </select>
                                </div>
                                {imageItemId && (
                                    <>
                                        <div>
                                            <label className={labelClass}>Image URL</label>
                                            <input className={inputClass} value={imageUrl} onChange={e => setImageUrl(e.target.value)} placeholder="/parks/europa-park/roller-coasters/wodan/01.jpg" />
                                        </div>
                                        <div>
                                            <label className={labelClass}>Sort Order</label>
                                            <input type="number" className={inputClass} value={imageOrder} onChange={e => setImageOrder(parseInt(e.target.value))} />
                                        </div>
                                        <div>
                                            <label className={labelClass}>Attribution — Author / Channel</label>
                                            <input className={inputClass} value={imageAuthor} onChange={e => setImageAuthor(e.target.value)} placeholder="e.g. Coaster Studios" />
                                        </div>
                                        <div>
                                            <label className={labelClass}>Attribution — Source URL</label>
                                            <input className={inputClass} value={imageSourceUrl} onChange={e => setImageSourceUrl(e.target.value)} placeholder="https://youtube.com/watch?v=..." />
                                        </div>
                                        <div>
                                            <label className={labelClass}>License</label>
                                            <select className={inputClass} value={imageLicense} onChange={e => setImageLicense(e.target.value)}>
                                                <option value="CC BY 4.0">CC BY 4.0</option>
                                                <option value="CC BY-SA 4.0">CC BY-SA 4.0</option>
                                                <option value="CC0">CC0 (Public Domain)</option>
                                                <option value="Own">Own photo</option>
                                            </select>
                                        </div>
                                        <button onClick={handleAddImage} disabled={loading} className={btnPrimary}>
                                            {loading ? 'Adding...' : 'Add Image'}
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>

                        {imageItemId && (
                            <div className="bg-[#1b2838] border border-[#2a475e] rounded-sm p-6">
                                <h2 className="text-lg font-semibold text-[#c6d4df] mb-4">
                                    Images for {items.find(i => i.id === imageItemId)?.name} ({itemImages.length})
                                </h2>
                                <div className="space-y-2 max-h-[600px] overflow-y-auto">
                                    {itemImages.length === 0 && <p className="text-sm text-[#8f98a0]">No images yet.</p>}
                                    {itemImages.map(img => (
                                        <div key={img.id} className="flex items-center justify-between gap-3 p-3 bg-[#2a475e]/30 rounded-sm">
                                            <div className="min-w-0">
                                                <p className="text-xs text-[#8f98a0]">#{img.sort_order}</p>
                                                <p className="text-xs text-[#c6d4df] truncate">{img.url}</p>
                                                {img.attribution_author && (
                                                    <p className="text-xs text-[#8f98a0] truncate">📷 {img.attribution_author} · {img.license}</p>
                                                )}
                                            </div>
                                            <button onClick={() => handleDeleteImage(img.id)} className={btnDanger}>Delete</button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}