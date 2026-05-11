'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import ImageManager from './ImageManager'

type AdminTab = 'parks' | 'items' | 'images' | 'park-images' | 'images-manager' | 'videos' | 'manufacturers' | 'osts' | 'prices' | 'bulk-import'
type Park = { id: string; name: string; description: string; logo_url: string; cover_image_url: string; country: string; company: string; park_type: string; location: string }
type Category = { id: string; name: string }
type Item = { id: string; park_id: string; category_id: string; name: string; description: string; location_in_park: string; specs: any; status: string; former_name: string }

const emptyPark: Omit<Park, 'id'> = { name: '', description: '', logo_url: '', cover_image_url: '', country: '', company: '', park_type: 'Theme Park', location: '' }
const emptyItem: Omit<Item, 'id'> = { park_id: '', category_id: '', name: '', description: '', location_in_park: '', specs: {}, status: 'operating', former_name: '' }

// ─── PricesTab ────────────────────────────────────────────

function PricesTab({ parks }: { parks: Park[] }) {
    const supabase = createClient()
    const [selectedPark, setSelectedPark] = useState('')
    const [prices, setPrices] = useState<any[]>([])
    const [loading, setLoading] = useState(false)
    const [form, setForm] = useState({
        category: 'adult',
        label: '',
        min_age: '',
        max_age: '',
        duration: '1day',
        price: '',
        currency: 'EUR',
    })

    const CATEGORIES = [
        { value: 'free', label: 'Free Entry' },
        { value: 'child', label: 'Child' },
        { value: 'adult', label: 'Adult' },
        { value: 'senior', label: 'Senior' },
        { value: 'parking', label: 'Parking' },
        { value: 'skipline', label: 'Skip the Line' },
        { value: 'season_tier1', label: 'Season Pass Tier 1' },
        { value: 'season_tier2', label: 'Season Pass Tier 2' },
        { value: 'season_tier3', label: 'Season Pass Tier 3' },
    ]

    const DURATIONS = [
        { value: '1day', label: '1 Day' },
        { value: '2day', label: '2 Days' },
        { value: 'season', label: 'Season' },
        { value: 'perday', label: 'Per Day' },
        { value: 'none', label: 'N/A' },
    ]

    const inputClass = `w-full rounded-sm px-3 py-2 text-sm focus:outline-none`
    const inputStyle = { background: 'var(--bg-elevated)', border: '1px solid var(--input-border)', color: 'var(--text-primary)' }
    const labelClass = `block text-xs font-medium uppercase tracking-wider mb-1`
    const labelStyle = { color: 'var(--text-muted)' }

    const loadPrices = async (parkId: string) => {
        setSelectedPark(parkId)
        const { data } = await supabase.from('park_prices').select('*').eq('park_id', parkId).order('category')
        setPrices(data ?? [])
    }

    const handleAdd = async () => {
        if (!selectedPark || !form.price) return
        setLoading(true)
        const { error } = await supabase.from('park_prices').insert({
            park_id: selectedPark,
            category: form.category,
            label: form.label || null,
            min_age: form.min_age ? parseInt(form.min_age) : null,
            max_age: form.max_age ? parseInt(form.max_age) : null,
            duration: form.duration === 'none' ? null : form.duration,
            price: parseFloat(form.price),
            currency: form.currency,
        })
        if (!error) {
            loadPrices(selectedPark)
            setForm(f => ({ ...f, label: '', min_age: '', max_age: '', price: '' }))
        }
        setLoading(false)
    }

    const handleDelete = async (id: string) => {
        await supabase.from('park_prices').delete().eq('id', id)
        loadPrices(selectedPark)
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="rounded-sm p-6" style={{ background: 'var(--card-bg)', border: '1px solid var(--border)' }}>
                <h2 className="text-lg font-semibold mb-6" style={{ color: 'var(--text-primary)' }}>Add Price</h2>
                <div className="space-y-4">
                    <div>
                        <label className={labelClass} style={labelStyle}>Park</label>
                        <select className={inputClass} style={inputStyle} value={selectedPark} onChange={e => loadPrices(e.target.value)}>
                            <option value="">Select park</option>
                            {parks.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                        </select>
                    </div>
                    {selectedPark && (
                        <>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className={labelClass} style={labelStyle}>Category</label>
                                    <select className={inputClass} style={inputStyle} value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}>
                                        {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className={labelClass} style={labelStyle}>Duration</label>
                                    <select className={inputClass} style={inputStyle} value={form.duration} onChange={e => setForm(f => ({ ...f, duration: e.target.value }))}>
                                        {DURATIONS.map(d => <option key={d.value} value={d.value}>{d.label}</option>)}
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className={labelClass} style={labelStyle}>Custom Label (optional)</label>
                                <input className={inputClass} style={inputStyle} value={form.label} onChange={e => setForm(f => ({ ...f, label: e.target.value }))} placeholder="e.g. VIP Pass, Toddler..." />
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className={labelClass} style={labelStyle}>Min Age</label>
                                    <input type="number" className={inputClass} style={inputStyle} value={form.min_age} onChange={e => setForm(f => ({ ...f, min_age: e.target.value }))} placeholder="e.g. 3" />
                                </div>
                                <div>
                                    <label className={labelClass} style={labelStyle}>Max Age</label>
                                    <input type="number" className={inputClass} style={inputStyle} value={form.max_age} onChange={e => setForm(f => ({ ...f, max_age: e.target.value }))} placeholder="e.g. 12" />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className={labelClass} style={labelStyle}>Price</label>
                                    <input type="number" step="0.01" className={inputClass} style={inputStyle} value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} placeholder="0.00" />
                                </div>
                                <div>
                                    <label className={labelClass} style={labelStyle}>Currency</label>
                                    <select className={inputClass} style={inputStyle} value={form.currency} onChange={e => setForm(f => ({ ...f, currency: e.target.value }))}>
                                        {['EUR', 'USD', 'GBP', 'JPY', 'CAD', 'AUD', 'CHF', 'KRW', 'AED', 'DKK', 'SEK', 'NOK', 'PLN', 'CZK', 'HUF'].map(c => <option key={c}>{c}</option>)}
                                    </select>
                                </div>
                            </div>
                            <button onClick={handleAdd} disabled={loading}
                                className="w-full py-2 text-sm font-medium rounded-sm transition-colors disabled:opacity-50"
                                style={{ background: 'var(--cta)', color: 'var(--cta-text)' }}>
                                {loading ? 'Adding...' : 'Add Price'}
                            </button>
                        </>
                    )}
                </div>
            </div>

            {selectedPark && (
                <div className="rounded-sm p-6" style={{ background: 'var(--card-bg)', border: '1px solid var(--border)' }}>
                    <h2 className="text-lg font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
                        Prices ({prices.length})
                    </h2>
                    <div className="space-y-2 max-h-[600px] overflow-y-auto">
                        {prices.length === 0 && <p className="text-sm" style={{ color: 'var(--text-muted)' }}>No prices yet.</p>}
                        {prices.map(p => (
                            <div key={p.id} className="flex items-center justify-between gap-3 p-3 rounded-sm" style={{ background: 'var(--bg-elevated)' }}>
                                <div className="min-w-0">
                                    <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                                        {p.label || p.category}
                                        {p.duration && <span className="ml-2 text-xs" style={{ color: 'var(--text-muted)' }}>· {p.duration}</span>}
                                    </p>
                                    <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                                        {p.price === 0 ? 'Free' : `${p.price} ${p.currency}`}
                                        {p.min_age !== null && ` · age ${p.min_age}${p.max_age !== null ? `–${p.max_age}` : '+'}`}
                                    </p>
                                </div>
                                <button onClick={() => handleDelete(p.id)}
                                    className="px-3 py-1.5 text-xs rounded-sm flex-shrink-0"
                                    style={{ background: 'rgba(239,68,68,0.2)', color: '#ef4444' }}>
                                    Delete
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}

// ─── AdminDashboard ───────────────────────────────────────

export default function AdminDashboard({ parks, categories, items }: { parks: Park[]; categories: Category[]; items: Item[] }) {
    const supabase = createClient()
    const router = useRouter()
    const [tab, setTab] = useState<AdminTab>('parks')
    const [loading, setLoading] = useState(false)
    const [manufacturers, setManufacturers] = useState<{ id: string; name: string }[]>([])
    const [mfrName, setMfrName] = useState('')
    const [editingMfrId, setEditingMfrId] = useState<string | null>(null)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')

    const [parkForm, setParkForm] = useState<Omit<Park, 'id'>>(emptyPark)
    const [editingParkId, setEditingParkId] = useState<string | null>(null)
    const [parkIdInput, setParkIdInput] = useState('')

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
    const [videoItemId, setVideoItemId] = useState('')
    const [videoUrl, setVideoUrl] = useState('')
    const [videoTitle, setVideoTitle] = useState('')
    const [itemVideos, setItemVideos] = useState<{ id: string; url: string; video_id: string; title: string }[]>([])
    const [parkImageParkId, setParkImageParkId] = useState('')
    const [parkImageUrl, setParkImageUrl] = useState('')
    const [parkImageOrder, setParkImageOrder] = useState(0)
    const [parkImageAuthor, setParkImageAuthor] = useState('')
    const [parkImageSourceUrl, setParkImageSourceUrl] = useState('')
    const [parkImageLicense, setParkImageLicense] = useState('CC BY 4.0')
    const [parkImages, setParkImages] = useState<{ id: string; url: string; sort_order: number; attribution_author?: string; attribution_url?: string; license?: string }[]>([])
    const [editingImage, setEditingImage] = useState<{ id: string; type: 'item' | 'park' } | null>(null)
    const [editFormData, setEditFormData] = useState({ author: '', sourceUrl: '', license: 'CC BY 4.0', sortOrder: 0 })
    const [selectedParkForOst, setSelectedParkForOst] = useState('')

    useEffect(() => {
        loadManufacturers()
        loadOsts()
    }, [])

    const loadManufacturers = async () => {
        const { data } = await supabase.from('manufacturers').select('*').order('name')
        if (data) setManufacturers(data)
    }

    const extractYouTubeId = (url: string): string | null => {
        const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/)
        return match ? match[1] : null
    }

    const notify = (msg: string, isError = false) => {
        if (isError) setError(msg)
        else setSuccess(msg)
        setTimeout(() => { setError(''); setSuccess('') }, 4000)
    }

    const loadOsts = async () => {
        const { data } = await supabase.from('osts').select('*').order('created_at', { ascending: false })
        const listEl = document.getElementById('osts-list')
        if (listEl) {
            listEl.innerHTML = (data ?? []).map(ost => `
      <div style="display:flex;align-items:center;justify-content:space-between;gap:12px;padding:12px;border-radius:4px;background:var(--bg-elevated);color:var(--text-primary)">
        <div>
          <p style="font-size:14px;font-weight:500">${ost.title}</p>
          <p style="font-size:12px;color:var(--text-muted)">${ost.item_id}</p>
        </div>
      </div>
    `).join('')
        }
    }

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

    const handleEditItem = (item: Item) => {
        setEditingItemId(item.id)
        setItemIdInput(item.id)
        setItemForm({ park_id: item.park_id, category_id: item.category_id, name: item.name, description: item.description, location_in_park: item.location_in_park, specs: item.specs, status: item.status ?? 'operating', former_name: item.former_name ?? '' })
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
            const savedParkId = itemForm.park_id
            const savedCategoryId = itemForm.category_id
            setItemForm({ ...emptyItem, park_id: savedParkId, category_id: savedCategoryId })
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

    const handleEditImage = (image: any, type: 'item' | 'park') => {
        setEditingImage({ id: image.id, type })
        setEditFormData({
            author: image.attribution_author || '',
            sourceUrl: image.attribution_url || '',
            license: image.license || 'CC BY 4.0',
            sortOrder: image.sort_order ?? 0
        })
    }

    const handleSaveEditImage = async () => {
        if (!editingImage) return
        setLoading(true)
        const table = editingImage.type === 'item' ? 'item_images' : 'park_images'
        const { error } = await supabase.from(table).update({
            attribution_author: editFormData.author.trim() || null,
            attribution_url: editFormData.sourceUrl.trim() || null,
            license: editFormData.license,
            sort_order: editFormData.sortOrder
        }).eq('id', editingImage.id)
        if (error) notify(error.message, true)
        else {
            notify('Image updated')
            setEditingImage(null)
            if (editingImage.type === 'item') loadImages(imageItemId)
            else loadParkImages(parkImageParkId)
        }
        setLoading(false)
    }

    const loadParkImages = async (parkId: string) => {
        setParkImageParkId(parkId)
        const { data } = await supabase.from('park_images').select('*').eq('park_id', parkId).order('sort_order')
        setParkImages(data ?? [])
    }

    const loadVideos = async (itemId: string) => {
        setVideoItemId(itemId)
        const { data } = await supabase.from('item_videos').select('*').eq('item_id', itemId)
        setItemVideos(data ?? [])
    }

    const handleAddVideo = async () => {
        if (!videoUrl.trim() || !videoItemId) return
        const videoId = extractYouTubeId(videoUrl.trim())
        if (!videoId) { notify('Invalid YouTube URL', true); return }
        setLoading(true)
        const { error } = await supabase.from('item_videos').insert({
            item_id: videoItemId,
            url: videoUrl.trim(),
            video_id: videoId,
            title: videoTitle.trim() || 'Ride Video',
        })
        if (error) notify(error.message, true)
        else {
            notify('Video added')
            setVideoUrl('')
            setVideoTitle('')
            loadVideos(videoItemId)
        }
        setLoading(false)
    }

    const handleDeleteVideo = async (id: string) => {
        setLoading(true)
        const { error } = await supabase.from('item_videos').delete().eq('id', id)
        if (error) notify(error.message, true)
        else loadVideos(videoItemId)
        setLoading(false)
    }

    const handleAddParkImage = async () => {
        if (!parkImageUrl.trim() || !parkImageParkId) return
        setLoading(true)
        const { error } = await supabase.from('park_images').insert({
            park_id: parkImageParkId,
            url: parkImageUrl.trim(),
            sort_order: parkImageOrder,
            attribution_author: parkImageAuthor.trim() || null,
            attribution_url: parkImageSourceUrl.trim() || null,
            license: parkImageLicense.trim() || null,
        })
        if (error) notify(error.message, true)
        else {
            notify('Park image added')
            setParkImageUrl('')
            setParkImageAuthor('')
            setParkImageSourceUrl('')
            setParkImageLicense('CC BY 4.0')
            loadParkImages(parkImageParkId)
        }
        setLoading(false)
    }

    const handleDeleteParkImage = async (id: string) => {
        setLoading(true)
        const { error } = await supabase.from('park_images').delete().eq('id', id)
        if (error) notify(error.message, true)
        else loadParkImages(parkImageParkId)
        setLoading(false)
    }

    const inputClass = `w-full rounded-sm px-3 py-2 text-sm focus:outline-none`
    const inputStyle = { background: 'var(--bg-elevated)', border: '1px solid var(--input-border)', color: 'var(--text-primary)' }
    const labelClass = `block text-xs font-medium uppercase tracking-wider mb-1`
    const labelStyle = { color: 'var(--text-muted)' }
    const btnPrimary = `px-4 py-2 text-sm font-medium rounded-sm transition-colors disabled:opacity-50`
    const btnPrimaryStyle = { background: 'var(--cta)', color: 'var(--cta-text)' }
    const btnSecondary = `px-4 py-2 text-sm font-medium rounded-sm transition-colors`
    const btnSecondaryStyle = { background: 'var(--bg-elevated)', color: 'var(--text-primary)' }
    const btnDanger = `px-3 py-1.5 text-xs rounded-sm transition-colors`
    const btnDangerStyle = { background: 'rgba(239,68,68,0.2)', color: '#ef4444' }
    const btnEdit = `px-3 py-1.5 text-xs rounded-sm transition-colors`
    const btnEditStyle = { background: 'var(--bg-elevated)', color: 'var(--accent)' }
    const [listParkFilter, setListParkFilter] = useState('')
    const [bulkText, setBulkText] = useState('')
    const [bulkResults, setBulkResults] = useState<string[]>([])
    const getSpecFields = (categoryId: string): { key: string; label: string; type?: 'number' | 'text' }[] => {
        switch (categoryId) {
            case 'roller-coasters': return [
                { key: 'manufacturer', label: 'Manufacturer' },
                { key: 'height', label: 'Height (m)', type: 'number' },
                { key: 'drop', label: 'Drop (m)', type: 'number' },
                { key: 'speed', label: 'Speed (km/h)', type: 'number' },
                { key: 'length', label: 'Length (m)', type: 'number' },
                { key: 'gForce', label: 'G-Force (e.g. 4.5g)' },
                { key: 'inversions', label: 'Inversions', type: 'number' },
                { key: 'duration', label: 'Duration (e.g. 2min 30s)' },
                { key: 'year_opened', label: 'Year Opened', type: 'number' },
                { key: 'min_height', label: 'Min Height (cm)', type: 'number' },
            ]
            case 'water-rides': return [
                { key: 'manufacturer', label: 'Manufacturer' },
                { key: 'height', label: 'Height (m)', type: 'number' },
                { key: 'drop', label: 'Drop (m)', type: 'number' },
                { key: 'duration', label: 'Duration (e.g. 3min)' },
                { key: 'year_opened', label: 'Year Opened', type: 'number' },
                { key: 'min_height', label: 'Min Height (cm)', type: 'number' },
            ]
            case 'flat-rides': return [
                { key: 'manufacturer', label: 'Manufacturer' },
                { key: 'height', label: 'Height (m)', type: 'number' },
                { key: 'duration', label: 'Duration (e.g. 2min)' },
                { key: 'year_opened', label: 'Year Opened', type: 'number' },
                { key: 'min_height', label: 'Min Height (cm)', type: 'number' },
            ]
            case 'dark-rides': return [
                { key: 'manufacturer', label: 'Manufacturer' },
                { key: 'duration', label: 'Duration (e.g. 5min)' },
                { key: 'year_opened', label: 'Year Opened', type: 'number' },
                { key: 'technology', label: 'Technology (e.g. trackless, screens)' },
            ]
            case 'restaurants': return [
                { key: 'cuisine', label: 'Cuisine (e.g. Italian, Burgers)' },
                { key: 'capacity', label: 'Capacity (e.g. 200 seats)' },
                { key: 'price_range', label: 'Price Range (e.g. €€)' },
            ]
            case 'hotels': return [
                { key: 'stars', label: 'Stars (e.g. 4)', type: 'number' },
                { key: 'rooms', label: 'Number of Rooms', type: 'number' },
                { key: 'theme', label: 'Theme (e.g. Scandinavian)' },
            ]
            case 'shows': return [
                { key: 'duration', label: 'Duration (e.g. 30min)' },
                { key: 'capacity', label: 'Capacity (e.g. 500 seats)' },
                { key: 'year_opened', label: 'Year Opened', type: 'number' },
            ]
            case 'transport': return [
                { key: 'manufacturer', label: 'Manufacturer' },
                { key: 'year_opened', label: 'Year Opened', type: 'number' },
            ]
            case 'shops': return [
                { key: 'theme', label: 'Theme (e.g. Souvenirs, Candy)' },
            ]
            default: return []
        }
    }

    const handleBulkImport = async () => {
        const lines = bulkText.split('\n').filter(l => l.trim())
        const results: string[] = []

        const lines = bulkText.split(/\n(?=\d+\.)/).filter(l => l.trim())

        for (const block of lines) {
            try {
                const item: any = {}
                const lines = block.split('\n')

                lines.forEach(line => {
                    if (line.includes('NAME:')) item.name = line.split('NAME:')[1]?.trim()
                    if (line.includes('Description:')) item.description = line.split('Description:')[1]?.trim()
                    if (line.includes('Location in Park:')) item.location_in_park = line.split('Location in Park:')[1]?.trim()
                    if (line.includes('Type:')) item.type = line.split('Type:')[1]?.trim()
                    if (line.includes('Cuisine')) item.cuisine = line.split('Cuisine')[1]?.trim()
                    if (line.includes('Capacity:')) item.capacity = line.split('Capacity:')[1]?.trim()
                    if (line.includes('Price Range:')) item.price_range = line.split('Price Range:')[1]?.trim()
                })

                if (!item.name || !itemForm.park_id || !itemForm.category_id) {
                    results.push(`❌ Skipped: Missing required fields`)
                    return
                }

                const { error } = await supabase.from('items').insert({
                    id: item.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
                    park_id: itemForm.park_id,
                    category_id: itemForm.category_id,
                    name: item.name,
                    description: item.description || '',
                    location_in_park: item.location_in_park || '',
                    specs: { type: item.type, cuisine: item.cuisine, capacity: item.capacity, price_range: item.price_range },
                    status: 'operating',
                    former_name: '',
                })

                if (error) throw error
                results.push(`✅ Added: ${item.name}`)
            } catch (err: any) {
                results.push(`❌ Error: ${err.message}`)
            }
        }

        setBulkResults(results)
    }

    return (
        <div className="min-h-screen" style={{ background: 'var(--bg-tertiary)', color: 'var(--text-primary)' }}>
            <div className="container mx-auto px-4 py-8 max-w-6xl">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>Admin Dashboard</h1>
                    <p className="mt-1" style={{ color: 'var(--text-muted)' }}>Manage parks, rides, and media</p>
                </div>

                {error && <div className="mb-4 px-4 py-3 bg-red-500/10 border border-red-500/30 rounded-sm text-red-400 text-sm">{error}</div>}
                {success && <div className="mb-4 px-4 py-3 bg-green-500/10 border border-green-500/30 rounded-sm text-green-400 text-sm">{success}</div>}

                {/* Tabs */}
                <div className="flex gap-1 mb-8 border-b overflow-x-auto" style={{ borderColor: 'var(--border)' }}>
                    {(['parks', 'items', 'images', 'park-images', 'images-manager', 'videos', 'manufacturers', 'osts', 'prices', 'bulk-import'] as AdminTab[]).map(t => (
                        <button
                            key={t}
                            onClick={() => setTab(t)}
                            className={`px-6 py-3 text-sm font-medium capitalize transition-colors border-b-2 -mb-px whitespace-nowrap`}
                            style={tab === t ? { color: 'var(--accent)', borderColor: 'var(--accent)' } : { color: 'var(--text-muted)', borderColor: 'transparent' }}
                            onMouseEnter={e => { if (tab !== t) e.currentTarget.style.color = 'var(--text-primary)' }}
                            onMouseLeave={e => { if (tab !== t) e.currentTarget.style.color = 'var(--text-muted)' }}>
                            {t === 'items' ? 'Rides & Items' :
                                t === 'images' ? 'Ride Images' :
                                    t === 'park-images' ? 'Park Images' :
                                        t === 'images-manager' ? 'Image Search' :
                                            t === 'videos' ? 'Ride Videos' :
                                                t === 'manufacturers' ? 'Manufacturers' :
                                                    t === 'prices' ? 'Prices' :
                                                        t.charAt(0).toUpperCase() + t.slice(1)}
                        </button>
                    ))}
                </div>

                {/* ─── Parks Tab ─── */}
                {tab === 'parks' && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <div className="rounded-sm p-6" style={{ background: 'var(--card-bg)', border: '1px solid var(--border)' }}>
                            <h2 className="text-lg font-semibold mb-6" style={{ color: 'var(--text-primary)' }}>{editingParkId ? 'Edit Park' : 'Add Park'}</h2>
                            <div className="space-y-4">
                                {!editingParkId && (
                                    <div>
                                        <label className={labelClass} style={labelStyle}>Park ID (slug, e.g. europa-park)</label>
                                        <input className={inputClass} style={inputStyle} value={parkIdInput} onChange={e => setParkIdInput(e.target.value)} placeholder="europa-park" />
                                    </div>
                                )}
                                {(['name', 'description', 'country', 'company', 'location', 'logo_url', 'cover_image_url'] as const).map(field => (
                                    <div key={field}>
                                        <label className={labelClass} style={labelStyle}>{field.replace(/_/g, ' ')}</label>
                                        {field === 'description' ? (
                                            <textarea className={inputClass} style={inputStyle} rows={3} value={parkForm[field]} onChange={e => setParkForm(p => ({ ...p, [field]: e.target.value }))} />
                                        ) : (
                                            <input className={inputClass} style={inputStyle} value={parkForm[field]} onChange={e => setParkForm(p => ({ ...p, [field]: e.target.value }))} />
                                        )}
                                    </div>
                                ))}
                                <div>
                                    <label className={labelClass} style={labelStyle}>Park Type</label>
                                    <select className={inputClass} style={inputStyle} value={parkForm.park_type} onChange={e => setParkForm(p => ({ ...p, park_type: e.target.value }))}>
                                        {['Theme Park', 'Amusement Park', 'Water Park', 'Resort'].map(t => <option key={t}>{t}</option>)}
                                    </select>
                                </div>
                                <div className="flex gap-3 pt-2">
                                    <button onClick={handleSavePark} disabled={loading} className={btnPrimary} style={btnPrimaryStyle}>
                                        {loading ? 'Saving...' : editingParkId ? 'Update Park' : 'Add Park'}
                                    </button>
                                    {editingParkId && (
                                        <button onClick={() => { setEditingParkId(null); setParkForm(emptyPark); setParkIdInput('') }} className={btnSecondary} style={btnSecondaryStyle}>Cancel</button>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="rounded-sm p-6" style={{ background: 'var(--card-bg)', border: '1px solid var(--border)' }}>
                            <h2 className="text-lg font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>Parks ({parks.length})</h2>
                            <div className="space-y-2 max-h-[600px] overflow-y-auto">
                                {parks.map(park => (
                                    <div key={park.id} className="flex items-center justify-between gap-3 p-3 rounded-sm" style={{ background: 'var(--bg-elevated)' }}>
                                        <div className="min-w-0">
                                            <p className="text-sm font-medium truncate" style={{ color: 'var(--text-primary)' }}>{park.name}</p>
                                            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{park.id} · {park.country}</p>
                                        </div>
                                        <div className="flex gap-2 flex-shrink-0">
                                            <button onClick={() => handleEditPark(park)} className={btnEdit} style={btnEditStyle}>Edit</button>
                                            <button onClick={() => handleDeletePark(park.id)} className={btnDanger} style={btnDangerStyle}>Delete</button>
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
                        <div className="rounded-sm p-6" style={{ background: 'var(--card-bg)', border: '1px solid var(--border)' }}>
                            <h2 className="text-lg font-semibold mb-6" style={{ color: 'var(--text-primary)' }}>{editingItemId ? 'Edit Item' : 'Add Item'}</h2>
                            <div className="space-y-4">
                                {!editingItemId && (
                                    <div>
                                        <label className={labelClass} style={labelStyle}>Item ID (slug, e.g. blue-fire)</label>
                                        <input className={inputClass} style={inputStyle} value={itemIdInput} onChange={e => setItemIdInput(e.target.value)} placeholder="blue-fire" />
                                    </div>
                                )}
                                <div>
                                    <label className={labelClass} style={labelStyle}>Park</label>
                                    <select className={inputClass} style={inputStyle} value={itemForm.park_id} onChange={e => setItemForm(p => ({ ...p, park_id: e.target.value }))}>
                                        <option value="">Select a park</option>
                                        {parks.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className={labelClass} style={labelStyle}>Category</label>
                                    <select className={inputClass} style={inputStyle} value={itemForm.category_id} onChange={e => setItemForm(p => ({ ...p, category_id: e.target.value }))}>
                                        <option value="">Select a category</option>
                                        {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className={labelClass} style={labelStyle}>Name</label>
                                    <input className={inputClass} style={inputStyle} value={itemForm.name}
                                        onChange={e => {
                                            const name = e.target.value
                                            setItemForm(p => ({ ...p, name }))
                                            if (!editingItemId) setItemIdInput(name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''))
                                        }}
                                    />
                                </div>
                                {(['description', 'location_in_park'] as const).map(field => (
                                    <div key={field}>
                                        <label className={labelClass} style={labelStyle}>{field.replace(/_/g, ' ')}</label>
                                        {field === 'description' ? (
                                            <textarea className={inputClass} style={inputStyle} rows={3} value={itemForm[field]} onChange={e => setItemForm(p => ({ ...p, [field]: e.target.value }))} />
                                        ) : (
                                            <input className={inputClass} style={inputStyle} value={itemForm[field]} onChange={e => setItemForm(p => ({ ...p, [field]: e.target.value }))} />
                                        )}
                                    </div>
                                ))}
                                <div>
                                    <label className={labelClass} style={labelStyle}>Former Name (if renamed)</label>
                                    <input className={inputClass} style={inputStyle} value={itemForm.former_name} onChange={e => setItemForm(p => ({ ...p, former_name: e.target.value }))} placeholder="e.g. Thunder Coaster" />
                                </div>
                                <div>
                                    <label className={labelClass} style={labelStyle}>Status</label>
                                    <select className={inputClass} style={inputStyle} value={itemForm.status} onChange={e => setItemForm(p => ({ ...p, status: e.target.value }))}>
                                        <option value="operating">Operating</option>
                                        <option value="sbno">SBNO</option>
                                        <option value="defunct">Defunct</option>
                                        <option value="seasonal">Seasonal</option>
                                        <option value="under_construction">Under Construction</option>
                                        <option value="coming_soon">Coming Soon</option>
                                    </select>
                                </div>
                                {['roller-coasters', 'flat-rides', 'water-rides', 'dark-rides', 'restaurants', 'transport'].includes(itemForm.category_id) && (
                                    <div>
                                        <label className={labelClass} style={labelStyle}>Type</label>
                                        <select className={inputClass} style={inputStyle}
                                            value={(() => { try { return JSON.parse(specsText)?.type ?? '' } catch { return '' } })()}
                                            onChange={e => {
                                                try {
                                                    const parsed = JSON.parse(specsText)
                                                    setSpecsText(JSON.stringify({ ...parsed, type: e.target.value }, null, 2))
                                                } catch {
                                                    setSpecsText(JSON.stringify({ type: e.target.value }, null, 2))
                                                }
                                            }}>
                                            <option value="">Select type</option>
                                            {itemForm.category_id === 'roller-coasters' && ['Steel Coaster', 'Wooden Coaster', 'Hybrid Coaster', 'Kiddie Coaster', 'Family Coaster', 'Sit Down Coaster', 'Inverted Coaster', 'Suspended Coaster', 'Wing Coaster', 'Flying Coaster', 'Stand Up Coaster', 'Bobsled Coaster', 'Pipeline Coaster', 'Floorless Coaster', 'Indoor Coaster', 'Launched Coaster', 'Side Friction Coaster', 'Single Rail Coaster', 'Spinning Coaster', 'Water Coaster', 'Mega Coaster', 'Hyper Coaster', 'Giga Coaster', 'Strata Coaster', 'Wild Mouse Coaster', 'Diving Coaster', 'Shuttle Coaster', 'Powered Coaster', 'Fourth Dimension Coaster', 'Mine Train Coaster', 'Motorbike Coaster'].map(t => <option key={t} value={t}>{t}</option>)}
                                            {itemForm.category_id === 'flat-rides' && ['Drop Tower', 'Ferris Wheel', 'Carousel', 'Swing Ride', 'Tilt-A-Whirl', 'Scrambler', 'Bumper Cars', 'Gondola', 'Enterprise', 'Pirate Ship', 'Top Spin', 'Frisbee', 'Gyro Tower', 'Flying Carpet', 'Balloon Ride', 'Observation Tower', 'Simulator', 'Monorail', 'Sky Ride', 'Train Ride'].map(t => <option key={t} value={t}>{t}</option>)}
                                            {itemForm.category_id === 'water-rides' && ['Log Flume', 'Rapids', 'Shoot the Chute', 'Water Coaster', 'River Ride', 'Splash Battle', 'Water Slide', 'Lazy River', 'Wave Pool', 'Water Play Area'].map(t => <option key={t} value={t}>{t}</option>)}
                                            {itemForm.category_id === 'dark-rides' && ['Dark Ride', 'Interactive Dark Ride', '4D Cinema', 'Flying Theatre', 'Haunted House', 'Tunnel of Love', 'Ghost Train', 'Motion Simulator', 'Omnimover', 'Trackless Ride', 'Boat Dark Ride'].map(t => <option key={t} value={t}>{t}</option>)}
                                            {itemForm.category_id === 'restaurants' && ['Sit Down', 'Fast Food', 'Buffet', 'Food Stand', 'Bar', 'Café', 'Food Truck', 'Fine Dining', 'Themed Restaurant', 'Ice Cream Shop', 'Bakery'].map(t => <option key={t} value={t}>{t}</option>)}
                                            {itemForm.category_id === 'transport' && ['Monorail', 'Train', 'Ski Lift', 'Boat', 'Bus', 'Cable Car', 'Horse Drawn Carriage', 'Electric Vehicle', 'Tram'].map(t => <option key={t} value={t}>{t}</option>)}
                                        </select>
                                    </div>
                                )}
                                {getSpecFields(itemForm.category_id).map(field => (
                                    <div key={field.key}>
                                        <label className={labelClass} style={labelStyle}>{field.label}</label>
                                        {field.key === 'manufacturer' ? (
                                            <select className={inputClass} style={inputStyle}
                                                value={(() => { try { return JSON.parse(specsText)?.manufacturer ?? '' } catch { return '' } })()}
                                                onChange={e => {
                                                    try {
                                                        const parsed = JSON.parse(specsText)
                                                        setSpecsText(JSON.stringify({ ...parsed, manufacturer: e.target.value }, null, 2))
                                                    } catch {
                                                        setSpecsText(JSON.stringify({ manufacturer: e.target.value }, null, 2))
                                                    }
                                                }}>
                                                <option value="">Select manufacturer</option>
                                                {manufacturers.map(m => <option key={m.id} value={m.name}>{m.name}</option>)}
                                            </select>
                                        ) : (
                                            <input type={field.type === 'number' ? 'number' : 'text'} className={inputClass} style={inputStyle}
                                                value={(() => { try { return JSON.parse(specsText)?.[field.key] ?? '' } catch { return '' } })()}
                                                onChange={e => {
                                                    try {
                                                        const parsed = JSON.parse(specsText)
                                                        const val = field.type === 'number' ? (e.target.value === '' ? undefined : Number(e.target.value)) : e.target.value
                                                        if (val === undefined) { delete parsed[field.key]; setSpecsText(JSON.stringify(parsed, null, 2)) }
                                                        else setSpecsText(JSON.stringify({ ...parsed, [field.key]: val }, null, 2))
                                                    } catch {
                                                        setSpecsText(JSON.stringify({ [field.key]: e.target.value }, null, 2))
                                                    }
                                                }}
                                            />
                                        )}
                                    </div>
                                ))}
                                <div>
                                    <label className={labelClass} style={labelStyle}>Specs (JSON)</label>
                                    <textarea className={`${inputClass} font-mono text-xs`} style={inputStyle} rows={4} value={specsText} onChange={e => setSpecsText(e.target.value)} />
                                </div>
                                <div className="flex gap-3 pt-2">
                                    <button onClick={handleSaveItem} disabled={loading} className={btnPrimary} style={btnPrimaryStyle}>
                                        {loading ? 'Saving...' : editingItemId ? 'Update Item' : 'Add Item'}
                                    </button>
                                    {editingItemId && (
                                        <button onClick={() => { setEditingItemId(null); setItemForm(emptyItem); setItemIdInput(''); setSpecsText('{}') }} className={btnSecondary} style={btnSecondaryStyle}>Cancel</button>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="rounded-sm p-6" style={{ background: 'var(--card-bg)', border: '1px solid var(--border)' }}>
                            <div className="flex gap-3 mb-4 items-center">
                                <h2 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>Items</h2>
                                <select className={inputClass} style={{ ...inputStyle, maxWidth: '200px' }}
                                    value={listParkFilter} onChange={e => setListParkFilter(e.target.value)}>
                                    <option value="">All parks</option>
                                    {parks.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                                </select>
                            </div>
                            <div className="space-y-2 max-h-[600px] overflow-y-auto">
                                {parks.filter(p => !listParkFilter || p.id === listParkFilter).map(park => {
                                    const parkItems = items.filter(i => i.park_id === park.id)
                                    if (!parkItems.length) return null
                                    return (
                                        <div key={park.id}>
                                            <p className="text-xs font-bold uppercase tracking-wider px-2 py-1 mt-3 first:mt-0"
                                                style={{ color: 'var(--accent)', background: 'var(--bg-tertiary)' }}>
                                                {park.name}
                                            </p>
                                            {categories.map(cat => {
                                                const catItems = parkItems.filter(i => i.category_id === cat.id)
                                                if (!catItems.length) return null
                                                return (
                                                    <div key={cat.id}>
                                                        <p className="text-[10px] uppercase tracking-wider px-3 py-0.5"
                                                            style={{ color: 'var(--text-muted)', background: 'var(--bg-secondary)' }}>
                                                            {cat.name}
                                                        </p>
                                                        {catItems.map(item => (
                                                            <div key={item.id} className="flex items-center justify-between gap-3 p-3 rounded-sm" style={{ background: 'var(--bg-elevated)' }}>
                                                                <div className="min-w-0">
                                                                    <p className="text-sm font-medium truncate" style={{ color: 'var(--text-primary)' }}>{item.name}</p>
                                                                    <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{item.id} · {item.category_id}</p>
                                                                </div>
                                                                <div className="flex gap-2 flex-shrink-0">
                                                                    <button onClick={() => handleEditItem(item)} className={btnEdit} style={btnEditStyle}>Edit</button>
                                                                    <button onClick={() => handleDeleteItem(item.id)} className={btnDanger} style={btnDangerStyle}>Delete</button>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )
                                            })}
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    </div>
                )}
                {/* ─── Images Tab ─── */}
                {tab === 'images' && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <div className="rounded-sm p-6" style={{ background: 'var(--card-bg)', border: '1px solid var(--border)' }}>
                            <h2 className="text-lg font-semibold mb-6" style={{ color: 'var(--text-primary)' }}>Manage Images</h2>
                            <div className="space-y-4">
                                <div>
                                    <label className={labelClass} style={labelStyle}>Select Item</label>
                                    <select className={inputClass} style={inputStyle} value={imageItemId} onChange={e => loadImages(e.target.value)}>
                                        <option value="">Select an item</option>
                                        {items.map(i => <option key={i.id} value={i.id}>{i.name} ({i.park_id})</option>)}
                                    </select>
                                </div>
                                {imageItemId && (
                                    <>
                                        <div>
                                            <label className={labelClass} style={labelStyle}>Image URL</label>
                                            <input className={inputClass} style={inputStyle} value={imageUrl} onChange={e => setImageUrl(e.target.value)} />
                                        </div>
                                        <div>
                                            <label className={labelClass} style={labelStyle}>Sort Order</label>
                                            <select className={inputClass} style={inputStyle} value={imageOrder} onChange={e => setImageOrder(parseInt(e.target.value))}>
                                                <option value="-1">Logo</option>
                                                <option value="0">Main</option>
                                                {[1, 2, 3, 4, 5, 6].map(n => <option key={n} value={n}>Image 0{n}</option>)}
                                            </select>
                                        </div>
                                        <div>
                                            <label className={labelClass} style={labelStyle}>Attribution Author</label>
                                            <input className={inputClass} style={inputStyle} value={imageAuthor} onChange={e => setImageAuthor(e.target.value)} />
                                        </div>
                                        <div>
                                            <label className={labelClass} style={labelStyle}>Source URL</label>
                                            <input className={inputClass} style={inputStyle} value={imageSourceUrl} onChange={e => setImageSourceUrl(e.target.value)} />
                                        </div>
                                        <div>
                                            <label className={labelClass} style={labelStyle}>License</label>
                                            <select className={inputClass} style={inputStyle} value={imageLicense} onChange={e => setImageLicense(e.target.value)}>
                                                <option>CC BY 4.0</option><option>CC BY-SA 4.0</option><option>CC0</option><option>Own</option>
                                            </select>
                                        </div>
                                        <button onClick={handleAddImage} disabled={loading} className={btnPrimary} style={btnPrimaryStyle}>
                                            {loading ? 'Adding...' : 'Add Image'}
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                        {imageItemId && (
                            <div className="rounded-sm p-6" style={{ background: 'var(--card-bg)', border: '1px solid var(--border)' }}>
                                <h2 className="text-lg font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>Images ({itemImages.length})</h2>
                                <div className="space-y-2 max-h-[600px] overflow-y-auto">
                                    {itemImages.map(img => (
                                        <div key={img.id} className="flex items-center justify-between gap-3 p-3 rounded-sm" style={{ background: 'var(--bg-elevated)' }}>
                                            <div className="flex items-center gap-3 min-w-0">
                                                <img src={img.url} alt="" className="w-16 h-10 object-cover rounded-sm flex-shrink-0" onError={e => { e.currentTarget.style.display = 'none' }} />
                                                <div className="min-w-0">
                                                    <p className="text-xs truncate" style={{ color: 'var(--text-primary)' }}>{img.url}</p>
                                                    <p className="text-xs" style={{ color: 'var(--text-muted)' }}>#{img.sort_order}</p>
                                                </div>
                                            </div>
                                            <div className="flex gap-2 flex-shrink-0">
                                                <button onClick={() => handleEditImage(img, 'item')} className={btnEdit} style={btnEditStyle}>Edit</button>
                                                <button onClick={() => handleDeleteImage(img.id)} className={btnDanger} style={btnDangerStyle}>Delete</button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* ─── Park Images Tab ─── */}
                {tab === 'park-images' && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <div className="rounded-sm p-6" style={{ background: 'var(--card-bg)', border: '1px solid var(--border)' }}>
                            <h2 className="text-lg font-semibold mb-6" style={{ color: 'var(--text-primary)' }}>Manage Park Images</h2>
                            <div className="space-y-4">
                                <div>
                                    <label className={labelClass} style={labelStyle}>Select Park</label>
                                    <select className={inputClass} style={inputStyle} value={parkImageParkId} onChange={e => loadParkImages(e.target.value)}>
                                        <option value="">Select a park</option>
                                        {parks.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                                    </select>
                                </div>
                                {parkImageParkId && (
                                    <>
                                        <div>
                                            <label className={labelClass} style={labelStyle}>Image URL</label>
                                            <input className={inputClass} style={inputStyle} value={parkImageUrl} onChange={e => setParkImageUrl(e.target.value)} />
                                        </div>
                                        <div>
                                            <label className={labelClass} style={labelStyle}>Sort Order</label>
                                            <input type="number" className={inputClass} style={inputStyle} value={parkImageOrder} onChange={e => setParkImageOrder(parseInt(e.target.value))} />
                                        </div>
                                        <div>
                                            <label className={labelClass} style={labelStyle}>Attribution Author</label>
                                            <input className={inputClass} style={inputStyle} value={parkImageAuthor} onChange={e => setParkImageAuthor(e.target.value)} />
                                        </div>
                                        <div>
                                            <label className={labelClass} style={labelStyle}>Source URL</label>
                                            <input className={inputClass} style={inputStyle} value={parkImageSourceUrl} onChange={e => setParkImageSourceUrl(e.target.value)} />
                                        </div>
                                        <div>
                                            <label className={labelClass} style={labelStyle}>License</label>
                                            <select className={inputClass} style={inputStyle} value={parkImageLicense} onChange={e => setParkImageLicense(e.target.value)}>
                                                <option>CC BY 4.0</option><option>CC BY-SA 4.0</option><option>CC0</option><option>Own</option>
                                            </select>
                                        </div>
                                        <button onClick={handleAddParkImage} disabled={loading} className={btnPrimary} style={btnPrimaryStyle}>
                                            {loading ? 'Adding...' : 'Add Image'}
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                        {parkImageParkId && (
                            <div className="rounded-sm p-6" style={{ background: 'var(--card-bg)', border: '1px solid var(--border)' }}>
                                <h2 className="text-lg font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>Park Images ({parkImages.length})</h2>
                                <div className="space-y-2 max-h-[600px] overflow-y-auto">
                                    {parkImages.map(img => (
                                        <div key={img.id} className="flex items-center justify-between gap-3 p-3 rounded-sm" style={{ background: 'var(--bg-elevated)' }}>
                                            <div className="flex items-center gap-3 min-w-0">
                                                <img src={img.url} alt="" className="w-16 h-10 object-cover rounded-sm flex-shrink-0" onError={e => { e.currentTarget.style.display = 'none' }} />
                                                <div className="min-w-0">
                                                    <p className="text-xs truncate" style={{ color: 'var(--text-primary)' }}>{img.url}</p>
                                                    <p className="text-xs" style={{ color: 'var(--text-muted)' }}>#{img.sort_order}</p>
                                                </div>
                                            </div>
                                            <div className="flex gap-2 flex-shrink-0">
                                                <button onClick={() => handleEditImage(img, 'park')} className={btnEdit} style={btnEditStyle}>Edit</button>
                                                <button onClick={() => handleDeleteParkImage(img.id)} className={btnDanger} style={btnDangerStyle}>Delete</button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* ─── Image Manager Tab ─── */}
                {tab === 'images-manager' && (
                    <section>
                        <ImageManager items={items} categories={categories} parks={parks} />
                    </section>
                )}

                {/* ─── Videos Tab ─── */}
                {tab === 'videos' && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <div className="rounded-sm p-6" style={{ background: 'var(--card-bg)', border: '1px solid var(--border)' }}>
                            <h2 className="text-lg font-semibold mb-6" style={{ color: 'var(--text-primary)' }}>Manage Videos</h2>
                            <div className="space-y-4">
                                <div>
                                    <label className={labelClass} style={labelStyle}>Select Item</label>
                                    <select className={inputClass} style={inputStyle} value={videoItemId} onChange={e => loadVideos(e.target.value)}>
                                        <option value="">Select an item</option>
                                        {items.map(i => <option key={i.id} value={i.id}>{i.name} ({i.park_id})</option>)}
                                    </select>
                                </div>
                                {videoItemId && (
                                    <>
                                        <div>
                                            <label className={labelClass} style={labelStyle}>YouTube URL</label>
                                            <input className={inputClass} style={inputStyle} value={videoUrl} onChange={e => setVideoUrl(e.target.value)} placeholder="https://www.youtube.com/watch?v=..." />
                                        </div>
                                        <div>
                                            <label className={labelClass} style={labelStyle}>Video Title</label>
                                            <input className={inputClass} style={inputStyle} value={videoTitle} onChange={e => setVideoTitle(e.target.value)} />
                                        </div>
                                        <button onClick={handleAddVideo} disabled={loading} className={btnPrimary} style={btnPrimaryStyle}>
                                            {loading ? 'Adding...' : 'Add Video'}
                                        </button>
                                    </>
                                )}
                                {videoItemId && (
                                    <div className="mt-4 space-y-2 max-h-[400px] overflow-y-auto">
                                        {itemVideos.map(vid => (
                                            <div key={vid.id} className="flex items-center justify-between gap-3 p-3 rounded-sm" style={{ background: 'var(--bg-elevated)' }}>
                                                <div className="min-w-0">
                                                    <p className="text-sm truncate" style={{ color: 'var(--text-primary)' }}>{vid.title}</p>
                                                    <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{vid.video_id}</p>
                                                </div>
                                                <button onClick={() => handleDeleteVideo(vid.id)} className={btnDanger} style={btnDangerStyle}>Delete</button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* ─── Manufacturers Tab ─── */}
                {tab === 'manufacturers' && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <div className="rounded-sm p-6" style={{ background: 'var(--card-bg)', border: '1px solid var(--border)' }}>
                            <h2 className="text-lg font-semibold mb-6" style={{ color: 'var(--text-primary)' }}>{editingMfrId ? 'Edit Manufacturer' : 'Add Manufacturer'}</h2>
                            <div className="space-y-4">
                                <div>
                                    <label className={labelClass} style={labelStyle}>Name</label>
                                    <input className={inputClass} style={inputStyle} value={mfrName} onChange={e => setMfrName(e.target.value)} placeholder="e.g. Intamin" />
                                </div>
                                <div className="flex gap-3">
                                    <button onClick={async () => {
                                        if (!mfrName.trim()) return
                                        const slug = mfrName.trim().toLowerCase().replace(/\s+/g, '-')
                                        if (editingMfrId) await supabase.from('manufacturers').update({ name: mfrName.trim() }).eq('id', editingMfrId)
                                        else await supabase.from('manufacturers').insert({ id: slug, name: mfrName.trim() })
                                        setMfrName(''); setEditingMfrId(null); loadManufacturers()
                                        notify(editingMfrId ? 'Manufacturer updated' : 'Manufacturer added')
                                    }} disabled={loading} className={btnPrimary} style={btnPrimaryStyle}>
                                        {editingMfrId ? 'Update' : 'Add Manufacturer'}
                                    </button>
                                    {editingMfrId && <button onClick={() => { setEditingMfrId(null); setMfrName('') }} className={btnSecondary} style={btnSecondaryStyle}>Cancel</button>}
                                </div>
                            </div>
                        </div>
                        <div className="rounded-sm p-6" style={{ background: 'var(--card-bg)', border: '1px solid var(--border)' }}>
                            <h2 className="text-lg font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>Manufacturers ({manufacturers.length})</h2>
                            <div className="space-y-2 max-h-[600px] overflow-y-auto">
                                {manufacturers.map(m => (
                                    <div key={m.id} className="flex items-center justify-between gap-3 p-3 rounded-sm" style={{ background: 'var(--bg-elevated)' }}>
                                        <div>
                                            <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{m.name}</p>
                                            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{m.id}</p>
                                        </div>
                                        <div className="flex gap-2">
                                            <button onClick={() => { setEditingMfrId(m.id); setMfrName(m.name) }} className={btnEdit} style={btnEditStyle}>Edit</button>
                                            <button onClick={async () => {
                                                if (!confirm(`Delete "${m.name}"?`)) return
                                                await supabase.from('manufacturers').delete().eq('id', m.id)
                                                loadManufacturers(); notify('Manufacturer deleted')
                                            }} className={btnDanger} style={btnDangerStyle}>Delete</button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* ─── OSTs Tab ─── */}
                {tab === 'osts' && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <div className="rounded-sm p-6" style={{ background: 'var(--card-bg)', border: '1px solid var(--border)' }}>
                            <h2 className="text-lg font-semibold mb-6" style={{ color: 'var(--text-primary)' }}>Add OST</h2>
                            <div className="space-y-4">
                                <div>
                                    <label className={labelClass} style={labelStyle}>Park</label>
                                    <select className={inputClass} style={inputStyle} id="ost-park" onChange={e => setSelectedParkForOst(e.target.value)}>
                                        <option value="">Select a park</option>
                                        {parks.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className={labelClass} style={labelStyle}>Item</label>
                                    <select className={inputClass} style={inputStyle} id="ost-item">
                                        <option value="">Select an item</option>
                                        {items.filter(i => i.park_id === selectedParkForOst).map(i => <option key={i.id} value={i.id}>{i.name}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className={labelClass} style={labelStyle}>OST Title</label>
                                    <input className={inputClass} style={inputStyle} id="ost-title" placeholder="e.g. Blue Fire Theme" />
                                </div>
                                <div>
                                    <label className={labelClass} style={labelStyle}>YouTube Video ID</label>
                                    <input className={inputClass} style={inputStyle} id="ost-youtube" placeholder="e.g. dQw4w9WgXcQ" />
                                </div>
                                <button onClick={async () => {
                                    const itemId = (document.getElementById('ost-item') as HTMLSelectElement).value
                                    const title = (document.getElementById('ost-title') as HTMLInputElement).value
                                    const youtubeId = (document.getElementById('ost-youtube') as HTMLInputElement).value
                                    if (!itemId || !title || !youtubeId) { notify('All fields required', true); return }
                                    const { error } = await supabase.from('osts').insert({ item_id: itemId, title, youtube_video_id: youtubeId })
                                    if (error) notify(error.message, true)
                                    else { notify('OST added'); loadOsts() }
                                }} disabled={loading} className={btnPrimary} style={btnPrimaryStyle}>
                                    {loading ? 'Adding...' : 'Add OST'}
                                </button>
                            </div>
                        </div>
                        <div className="rounded-sm p-6" style={{ background: 'var(--card-bg)', border: '1px solid var(--border)' }}>
                            <h2 className="text-lg font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>OSTs</h2>
                            <div className="space-y-2 max-h-[600px] overflow-y-auto" id="osts-list">
                                <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Loading...</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* ─── Prices Tab ─── */}
                {tab === 'prices' && <PricesTab parks={parks} />}

                {/* ─── Edit Image Modal ─── */}
                {editingImage && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                        <div className="rounded-sm p-6 max-w-md w-full" style={{ background: 'var(--card-bg)', border: '1px solid var(--border)' }}>
                            <h2 className="text-lg font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>Edit Image Info</h2>
                            <div className="space-y-4">
                                <div>
                                    <label className={labelClass} style={labelStyle}>Sort Order</label>
                                    <select className={inputClass} style={inputStyle} value={editFormData.sortOrder} onChange={e => setEditFormData({ ...editFormData, sortOrder: parseInt(e.target.value) })}>
                                        <option value="-1">Logo</option>
                                        <option value="0">Main</option>
                                        {[1, 2, 3, 4, 5, 6].map(n => <option key={n} value={n}>Image 0{n}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className={labelClass} style={labelStyle}>Author / Channel</label>
                                    <input className={inputClass} style={inputStyle} value={editFormData.author} onChange={e => setEditFormData({ ...editFormData, author: e.target.value })} />
                                </div>
                                <div>
                                    <label className={labelClass} style={labelStyle}>Source URL</label>
                                    <input className={inputClass} style={inputStyle} value={editFormData.sourceUrl} onChange={e => setEditFormData({ ...editFormData, sourceUrl: e.target.value })} />
                                </div>
                                <div>
                                    <label className={labelClass} style={labelStyle}>License</label>
                                    <select className={inputClass} style={inputStyle} value={editFormData.license} onChange={e => setEditFormData({ ...editFormData, license: e.target.value })}>
                                        <option>CC BY 4.0</option><option>CC BY-SA 4.0</option><option>CC0</option><option>Own</option>
                                    </select>
                                </div>
                                <div className="flex gap-3 pt-2">
                                    <button onClick={handleSaveEditImage} disabled={loading} className={btnPrimary} style={btnPrimaryStyle}>
                                        {loading ? 'Saving...' : 'Save'}
                                    </button>
                                    <button onClick={() => setEditingImage(null)} className={btnSecondary} style={btnSecondaryStyle}>Cancel</button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                {tab === 'bulk-import' && (
                    <div className="rounded-sm p-6" style={{ background: 'var(--card-bg)', border: '1px solid var(--border)' }}>
                        <h2 className="text-lg font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>Bulk Import Items</h2>
                        <div className="space-y-4">
                            <div>
                                <label className={labelClass} style={labelStyle}>Select Park & Category First</label>
                                <select className={inputClass} style={inputStyle} value={itemForm.park_id} onChange={e => setItemForm(p => ({ ...p, park_id: e.target.value }))}>
                                    <option value="">Select Park</option>
                                    {parks.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                                </select>
                            </div>
                            <div>
                                <select className={inputClass} style={inputStyle} value={itemForm.category_id} onChange={e => setItemForm(p => ({ ...p, category_id: e.target.value }))}>
                                    <option value="">Select Category</option>
                                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className={labelClass} style={labelStyle}>Paste Item List</label>
                                <textarea className={inputClass} style={inputStyle} rows={10} value={bulkText} onChange={e => setBulkText(e.target.value)} placeholder="Paste your formatted list here..." />
                            </div>
                            <button onClick={handleBulkImport} className={btnPrimary} style={btnPrimaryStyle}>Import All</button>
                        </div>
                        {bulkResults.length > 0 && (
                            <div className="mt-4 space-y-1 text-sm">
                                {bulkResults.map((r, i) => <p key={i} style={{ color: r.includes('✅') ? '#10b981' : '#ef4444' }}>{r}</p>)}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}