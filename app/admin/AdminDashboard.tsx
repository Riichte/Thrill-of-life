'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import ImageManager from './ImageManager'

type Park = { id: string; name: string; description: string; logo_url: string; cover_image_url: string; country: string; company: string; park_type: string; location: string }
type Category = { id: string; name: string }
type Item = { id: string; park_id: string; category_id: string; name: string; description: string; location_in_park: string; specs: any; status: string; former_name: string }

const emptyPark: Omit<Park, 'id'> = { name: '', description: '', logo_url: '', cover_image_url: '', country: '', company: '', park_type: 'Theme Park', location: '' }
const emptyItem: Omit<Item, 'id'> = { park_id: '', category_id: '', name: '', description: '', location_in_park: '', specs: {}, status: 'operating', former_name: '' }

export default function AdminDashboard({ parks, categories, items }: { parks: Park[]; categories: Category[]; items: Item[] }) {
    const supabase = createClient()
    const router = useRouter()
    const [tab, setTab] = useState<'parks' | 'items' | 'images' | 'park-images' | 'images-manager' | 'videos'>('parks')
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
    const extractYouTubeId = (url: string): string | null => {
        const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/)
        return match ? match[1] : null
    }
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
        if (!videoId) {
            notify('Invalid YouTube URL', true)
            return
        }
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

    const inputClass = 'w-full bg-[#2a475e] border border-[#3d6a8a] rounded-sm px-3 py-2 text-sm text-[#c6d4df] placeholder-[#6a8a9a] focus:outline-none focus:border-[#66c0f4]'
    const labelClass = 'block text-xs font-medium uppercase tracking-wider text-[#8f98a0] mb-1'
    const btnPrimary = 'px-4 py-2 bg-[#4c6b22] hover:bg-[#5a7a28] disabled:opacity-50 text-white text-sm font-medium rounded-sm transition-colors'
    const btnSecondary = 'px-4 py-2 bg-[#2a475e] hover:bg-[#3d6a8a] text-[#c6d4df] text-sm font-medium rounded-sm transition-colors'
    const btnDanger = 'px-3 py-1.5 bg-red-500/20 hover:bg-red-500/30 text-red-400 text-xs rounded-sm transition-colors'
    const btnEdit = 'px-3 py-1.5 bg-[#2a475e] hover:bg-[#3d6a8a] text-[#66c0f4] text-xs rounded-sm transition-colors'

    const getSpecFields = (categoryId: string): { key: string; label: string; type?: 'number' | 'text' }[] => {
        switch (categoryId) {
            case 'roller-coasters': return [
                { key: 'manufacturer', label: 'Manufacturer' },
                { key: 'height', label: 'Height (e.g. 40m)' },
                { key: 'drop', label: 'Drop (e.g. 35m)' },
                { key: 'speed', label: 'Speed (e.g. 100 km/h)' },
                { key: 'length', label: 'Length (e.g. 1050m)' },
                { key: 'gForce', label: 'G-Force (e.g. 4.5g)' },
                { key: 'inversions', label: 'Inversions', type: 'number' },
                { key: 'duration', label: 'Duration (e.g. 2min 30s)' },
                { key: 'year_opened', label: 'Year Opened', type: 'number' },
            ]
            case 'water-rides': return [
                { key: 'manufacturer', label: 'Manufacturer' },
                { key: 'height', label: 'Height (e.g. 20m)' },
                { key: 'drop', label: 'Drop (e.g. 18m)' },
                { key: 'duration', label: 'Duration (e.g. 3min)' },
                { key: 'year_opened', label: 'Year Opened', type: 'number' },
            ]
            case 'flat-rides': return [
                { key: 'manufacturer', label: 'Manufacturer' },
                { key: 'height', label: 'Height (e.g. 30m)' },
                { key: 'duration', label: 'Duration (e.g. 2min)' },
                { key: 'year_opened', label: 'Year Opened', type: 'number' },
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
                    {(['parks', 'items', 'images', 'park-images', 'images-manager', 'videos'] as const).map(t => (
                        <button key={t} onClick={() => setTab(t)}
                            className={`px-6 py-3 text-sm font-medium capitalize transition-colors border-b-2 -mb-px ${tab === t ? 'text-[#66c0f4] border-[#66c0f4]' : 'text-[#8f98a0] border-transparent hover:text-white'}`}>
                            {t === 'items' ? 'Rides & Items' : t === 'images' ? 'Ride Images' : t === 'park-images' ? 'Park Images' : t === 'images-manager' ? 'Image Search' : t === 'videos' ? 'Ride Videos' : t.charAt(0).toUpperCase() + t.slice(1)}
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
                                    <label className={labelClass}>Former Name (if renamed)</label>
                                    <input className={inputClass} value={itemForm.former_name} onChange={e => setItemForm(p => ({ ...p, former_name: e.target.value }))} placeholder="e.g. Thunder Coaster" />
                                </div>
                                <div>
                                    <label className={labelClass}>Status</label>
                                    <select className={inputClass} value={itemForm.status} onChange={e => setItemForm(p => ({ ...p, status: e.target.value }))}>
                                        <option value="operating">Operating</option>
                                        <option value="sbno">SBNO (Standing But Not Operating)</option>
                                        <option value="defunct">Defunct</option>
                                        <option value="seasonal">Seasonal</option>
                                        <option value="under_construction">Under Construction</option>
                                        <option value="coming_soon">Coming Soon</option>
                                    </select>
                                </div>
                                {/* Type dropdown based on category */}
                                {['roller-coasters', 'flat-rides', 'water-rides', 'dark-rides', 'restaurants', 'transport'].includes(itemForm.category_id) && (
                                    <div>
                                        <label className={labelClass}>Type</label>
                                        <select
                                            className={inputClass}
                                            value={(() => { try { return JSON.parse(specsText)?.type ?? '' } catch { return '' } })()}
                                            onChange={e => {
                                                try {
                                                    const parsed = JSON.parse(specsText)
                                                    setSpecsText(JSON.stringify({ ...parsed, type: e.target.value }, null, 2))
                                                } catch {
                                                    setSpecsText(JSON.stringify({ type: e.target.value }, null, 2))
                                                }
                                            }}
                                        >
                                            <option value="">Select type</option>
                                            {itemForm.category_id === 'roller-coasters' && [
                                                'Steel Coaster', 'Wooden Coaster', 'Hybrid Coaster',
                                                'Kiddie Coaster', 'Family Coaster', 'Sit Down Coaster',
                                                'Inverted Coaster', 'Suspended Coaster', 'Wing Coaster',
                                                'Flying Coaster', 'Stand Up Coaster', 'Bobsled Coaster',
                                                'Pipeline Coaster', 'Floorless Coaster', 'Indoor Coaster',
                                                'Launched Coaster', 'Side Friction Coaster', 'Single Rail Coaster',
                                                'Spinning Coaster', 'Water Coaster', 'Mega Coaster',
                                                'Hyper Coaster', 'Giga Coaster', 'Strata Coaster',
                                                'Wild Mouse Coaster', 'Diving Coaster', 'Shuttle Coaster',
                                                'Powered Coaster', 'Fourth Dimension Coaster', 'Mine Train Coaster',
                                                'Motorbike Coaster'
                                            ].map(t => <option key={t} value={t}>{t}</option>)}
                                            {itemForm.category_id === 'flat-rides' && [
                                                'Drop Tower', 'Ferris Wheel', 'Carousel', 'Swing Ride',
                                                'Tilt-A-Whirl', 'Scrambler', 'Bumper Cars', 'Gondola',
                                                'Enterprise', 'Pirate Ship', 'Top Spin', 'Frisbee',
                                                'Gyro Tower', 'Flying Carpet', 'Balloon Ride', 'Observation Tower',
                                                'Simulator', 'Monorail', 'Sky Ride', 'Train Ride'
                                            ].map(t => <option key={t} value={t}>{t}</option>)}
                                            {itemForm.category_id === 'water-rides' && [
                                                'Log Flume', 'Rapids', 'Shoot the Chute', 'Water Coaster',
                                                'River Ride', 'Splash Battle', 'Water Slide', 'Lazy River',
                                                'Wave Pool', 'Water Play Area'
                                            ].map(t => <option key={t} value={t}>{t}</option>)}
                                            {itemForm.category_id === 'dark-rides' && [
                                                'Dark Ride', 'Interactive Dark Ride', '4D Cinema', 'Flying Theatre',
                                                'Haunted House', 'Tunnel of Love', 'Ghost Train', 'Motion Simulator',
                                                'Omnimover', 'Trackless Ride', 'Boat Dark Ride'
                                            ].map(t => <option key={t} value={t}>{t}</option>)}
                                            {itemForm.category_id === 'restaurants' && [
                                                'Sit Down', 'Fast Food', 'Buffet', 'Food Stand',
                                                'Bar', 'Café', 'Food Truck', 'Fine Dining',
                                                'Themed Restaurant', 'Ice Cream Shop', 'Bakery'
                                            ].map(t => <option key={t} value={t}>{t}</option>)}
                                            {itemForm.category_id === 'transport' && [
                                                'Monorail', 'Train', 'Ski Lift', 'Boat',
                                                'Bus', 'Cable Car', 'Horse Drawn Carriage',
                                                'Electric Vehicle', 'Tram'
                                            ].map(t => <option key={t} value={t}>{t}</option>)}
                                        </select>
                                    </div>
                                )}

                                {/* Fixed spec fields per category */}
                                {getSpecFields(itemForm.category_id).map(field => (
                                    <div key={field.key}>
                                        <label className={labelClass}>{field.label}</label>
                                        <input
                                            type={field.type === 'number' ? 'number' : 'text'}
                                            className={inputClass}
                                            value={(() => { try { return JSON.parse(specsText)?.[field.key] ?? '' } catch { return '' } })()}
                                            onChange={e => {
                                                try {
                                                    const parsed = JSON.parse(specsText)
                                                    const val = field.type === 'number' ? (e.target.value === '' ? undefined : Number(e.target.value)) : e.target.value
                                                    if (val === undefined) {
                                                        delete parsed[field.key]
                                                        setSpecsText(JSON.stringify(parsed, null, 2))
                                                    } else {
                                                        setSpecsText(JSON.stringify({ ...parsed, [field.key]: val }, null, 2))
                                                    }
                                                } catch {
                                                    setSpecsText(JSON.stringify({ [field.key]: e.target.value }, null, 2))
                                                }
                                            }}
                                        />
                                    </div>
                                ))}



                                {/* Raw JSON fallback */}
                                <div>
                                    <label className={labelClass}>Specs (JSON — auto updated above)</label>
                                    <textarea
                                        className={`${inputClass} font-mono text-xs`}
                                        rows={4}
                                        value={specsText}
                                        onChange={e => setSpecsText(e.target.value)}
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
                                            <label className={labelClass}>Use As</label>
                                            <select className={inputClass} value={parkImageOrder} onChange={e => setParkImageOrder(parseInt(e.target.value))}>
                                                <option value="-1">Logo</option>
                                                <option value="0">Main</option>
                                                <option value="1">Image 01</option>
                                                <option value="2">Image 02</option>
                                                <option value="3">Image 03</option>
                                                <option value="4">Image 04</option>
                                                <option value="5">Image 05</option>
                                                <option value="6">Image 06</option>
                                            </select>
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
                                            <div className="flex items-center gap-3 min-w-0">
                                                <img src={img.url} alt="" className="w-16 h-10 object-cover rounded-sm flex-shrink-0 bg-[#0e1419]" onError={e => { e.currentTarget.style.display = 'none' }} />
                                                <div className="min-w-0">
                                                    <p className="text-xs text-[#8f98a0]">#{img.sort_order}</p>
                                                    <p className="text-xs text-[#c6d4df] truncate">{img.url}</p>
                                                    {img.attribution_author && (
                                                        <p className="text-xs text-[#8f98a0] truncate">📷 {img.attribution_author} · {img.license}</p>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="flex gap-2 flex-shrink-0">
                                                <button onClick={() => handleEditImage(img, 'item')} className={btnEdit}>Edit</button>
                                                <button onClick={() => handleDeleteImage(img.id)} className={btnDanger}>Delete</button>
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
                        <div className="bg-[#1b2838] border border-[#2a475e] rounded-sm p-6">
                            <h2 className="text-lg font-semibold text-[#c6d4df] mb-6">Manage Park Images</h2>
                            <div className="space-y-4">
                                <div>
                                    <label className={labelClass}>Select Park</label>
                                    <select className={inputClass} value={parkImageParkId} onChange={e => loadParkImages(e.target.value)}>
                                        <option value="">Select a park</option>
                                        {parks.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                                    </select>
                                </div>
                                {parkImageParkId && (
                                    <>
                                        <div>
                                            <label className={labelClass}>Image URL</label>
                                            <input className={inputClass} value={parkImageUrl} onChange={e => setParkImageUrl(e.target.value)} placeholder="/parks/europa-park/01.jpg" />
                                        </div>
                                        <div>
                                            <label className={labelClass}>Sort Order</label>
                                            <input type="number" className={inputClass} value={parkImageOrder} onChange={e => setParkImageOrder(parseInt(e.target.value))} />
                                        </div>
                                        <div>
                                            <label className={labelClass}>Attribution — Author / Channel</label>
                                            <input className={inputClass} value={parkImageAuthor} onChange={e => setParkImageAuthor(e.target.value)} placeholder="e.g. Coaster Studios" />
                                        </div>
                                        <div>
                                            <label className={labelClass}>Attribution — Source URL</label>
                                            <input className={inputClass} value={parkImageSourceUrl} onChange={e => setParkImageSourceUrl(e.target.value)} placeholder="https://youtube.com/watch?v=..." />
                                        </div>
                                        <div>
                                            <label className={labelClass}>License</label>
                                            <select className={inputClass} value={parkImageLicense} onChange={e => setParkImageLicense(e.target.value)}>
                                                <option value="CC BY 4.0">CC BY 4.0</option>
                                                <option value="CC BY-SA 4.0">CC BY-SA 4.0</option>
                                                <option value="CC0">CC0 (Public Domain)</option>
                                                <option value="Own">Own photo</option>
                                            </select>
                                        </div>
                                        <button onClick={handleAddParkImage} disabled={loading} className={btnPrimary}>
                                            {loading ? 'Adding...' : 'Add Image'}
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>

                        {parkImageParkId && (
                            <div className="bg-[#1b2838] border border-[#2a475e] rounded-sm p-6">
                                <h2 className="text-lg font-semibold text-[#c6d4df] mb-4">
                                    Images for {parks.find(p => p.id === parkImageParkId)?.name} ({parkImages.length})
                                </h2>
                                <div className="space-y-2 max-h-[600px] overflow-y-auto">
                                    {parkImages.length === 0 && <p className="text-sm text-[#8f98a0]">No images yet.</p>}
                                    {parkImages.map(img => (
                                        <div key={img.id} className="flex items-center justify-between gap-3 p-3 bg-[#2a475e]/30 rounded-sm">
                                            <div className="flex items-center gap-3 min-w-0">
                                                <img src={img.url} alt="" className="w-16 h-10 object-cover rounded-sm flex-shrink-0 bg-[#0e1419]" onError={e => { e.currentTarget.style.display = 'none' }} />
                                                <div className="min-w-0">
                                                    <p className="text-xs text-[#8f98a0]">#{img.sort_order}</p>
                                                    <p className="text-xs text-[#c6d4df] truncate">{img.url}</p>
                                                    {img.attribution_author && (
                                                        <p className="text-xs text-[#8f98a0] truncate">📷 {img.attribution_author} · {img.license}</p>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="flex gap-2 flex-shrink-0">
                                                <button onClick={() => handleEditImage(img, 'park')} className={btnEdit}>Edit</button>
                                                <button onClick={() => handleDeleteParkImage(img.id)} className={btnDanger}>Delete</button>
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
                        <div className="bg-[#1b2838] border border-[#2a475e] rounded-sm p-6">
                            <h2 className="text-lg font-semibold text-[#c6d4df] mb-6">Manage Videos</h2>
                            <div className="space-y-4">
                                <div>
                                    <label className={labelClass}>Select Item</label>
                                    <select className={inputClass} value={videoItemId} onChange={e => loadVideos(e.target.value)}>
                                        <option value="">Select an item</option>
                                        {items.map(i => <option key={i.id} value={i.id}>{i.name} ({i.park_id})</option>)}
                                    </select>
                                </div>
                                {videoItemId && (
                                    <>
                                        <div>
                                            <label className={labelClass}>YouTube URL</label>
                                            <input className={inputClass} value={videoUrl} onChange={e => setVideoUrl(e.target.value)} placeholder="https://www.youtube.com/watch?v=U5wvbx8p6SE" />
                                        </div>
                                        <div>
                                            <label className={labelClass}>Video Title</label>
                                            <input className={inputClass} value={videoTitle} onChange={e => setVideoTitle(e.target.value)} placeholder="e.g. Wodan Coaster Experience" />
                                        </div>
                                        <button onClick={handleAddVideo} disabled={loading} className={btnPrimary}>
                                            {loading ? 'Adding...' : 'Add Video'}
                                        </button>
                                    </>
                                )}
                            </div>

                            {videoItemId && (
                                <div className="bg-[#1b2838] border border-[#2a475e] rounded-sm p-6">
                                    <h2 className="text-lg font-semibold text-[#c6d4df] mb-4">
                                        Videos for {items.find(i => i.id === videoItemId)?.name} ({itemVideos.length})
                                    </h2>
                                    <div className="space-y-2 max-h-[600px] overflow-y-auto">
                                        {itemVideos.length === 0 && <p className="text-sm text-[#8f98a0]">No videos yet.</p>}
                                        {itemVideos.map(vid => (
                                            <div key={vid.id} className="flex items-center justify-between gap-3 p-3 bg-[#2a475e]/30 rounded-sm">
                                                <div className="min-w-0">
                                                    <p className="text-sm text-[#c6d4df] truncate">{vid.title}</p>
                                                    <p className="text-xs text-[#8f98a0] truncate">youtube.com/watch?v={vid.video_id}</p>
                                                </div>
                                                <button onClick={() => handleDeleteVideo(vid.id)} className={btnDanger}>Delete</button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {editingImage && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                        <div className="bg-[#1b2838] border border-[#2a475e] rounded-sm p-6 max-w-md w-full">
                            <h2 className="text-lg font-semibold text-[#c6d4df] mb-4">Edit Image Info</h2>
                            <div className="space-y-4">
                                <div>
                                    <label className={labelClass}>Use As</label>
                                    <select className={inputClass} value={editFormData.sortOrder} onChange={e => setEditFormData({ ...editFormData, sortOrder: parseInt(e.target.value) })}>
                                        <option value="-1">Logo</option>
                                        <option value="0">Main</option>
                                        <option value="1">Image 01</option>
                                        <option value="2">Image 02</option>
                                        <option value="3">Image 03</option>
                                        <option value="4">Image 04</option>
                                        <option value="5">Image 05</option>
                                        <option value="6">Image 06</option>
                                    </select>
                                </div>
                                <div>
                                    <label className={labelClass}>Author / Channel</label>
                                    <input
                                        className={inputClass}
                                        value={editFormData.author}
                                        onChange={e => setEditFormData({ ...editFormData, author: e.target.value })}
                                        placeholder="e.g. Coaster Studios"
                                    />
                                </div>
                                <div>
                                    <label className={labelClass}>Source URL</label>
                                    <input
                                        className={inputClass}
                                        value={editFormData.sourceUrl}
                                        onChange={e => setEditFormData({ ...editFormData, sourceUrl: e.target.value })}
                                        placeholder="https://youtube.com/..."
                                    />
                                </div>
                                <div>
                                    <label className={labelClass}>License</label>
                                    <select
                                        className={inputClass}
                                        value={editFormData.license}
                                        onChange={e => setEditFormData({ ...editFormData, license: e.target.value })}
                                    >
                                        <option value="CC BY 4.0">CC BY 4.0</option>
                                        <option value="CC BY-SA 4.0">CC BY-SA 4.0</option>
                                        <option value="CC0">CC0 (Public Domain)</option>
                                        <option value="Own">Own photo</option>
                                    </select>
                                </div>
                                <div className="flex gap-3 pt-2">
                                    <button onClick={handleSaveEditImage} disabled={loading} className={btnPrimary}>
                                        {loading ? 'Saving...' : 'Save'}
                                    </button>
                                    <button onClick={() => setEditingImage(null)} className={btnSecondary}>
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}