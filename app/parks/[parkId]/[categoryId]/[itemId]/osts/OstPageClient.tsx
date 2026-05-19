'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

interface Ost {
    id: string
    title: string
    youtube_video_id: string
    composer: string | null
    location: string | null
    description: string | null
}

interface OstRating {
    emotion: number
    nostalgia: number
    appeal: number
    experience: number
}

const dimensions = [
    { id: 'emotion', label: 'Emotion' },
    { id: 'nostalgia', label: 'Nostalgia Factor' },
    { id: 'appeal', label: 'Appeal' },
    { id: 'experience', label: 'Experience Enhancement' },
]

function ScoreCircle({ score }: { score: number }) {
    return (
        <svg className="w-12 h-12" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="45" fill="none" stroke="var(--border)" strokeWidth="2" />
            <circle cx="50" cy="50" r="45" fill="none" stroke="var(--accent)" strokeWidth="2"
                strokeDasharray={`${(score / 100) * 282.7}`} strokeDashoffset="0" strokeLinecap="round"
                style={{ transform: 'rotate(-90deg)', transformOrigin: '50% 50%' }} />
            <text x="50" y="50" textAnchor="middle" dy="0.3em" fill="var(--text-primary)" fontWeight="bold" fontSize="24">
                {score}
            </text>
        </svg>
    )
}

export default function OstPageClient({ park, item, category, osts }: {
    park: any
    item: any
    category: any
    osts: Ost[]
}) {
    const supabase = createClient()
    const [user, setUser] = useState<any>(null)
    const [userRatings, setUserRatings] = useState<Record<string, OstRating>>({})
    const [ratings, setRatings] = useState<Record<string, { emotion: number[]; nostalgia: number[]; appeal: number[]; experience: number[] }>>({})
    const [favorites, setFavorites] = useState<Set<string>>(new Set())
    const [isRatingOpen, setIsRatingOpen] = useState<string | null>(null)
    const [tempRatings, setTempRatings] = useState<OstRating>({ emotion: 50, nostalgia: 50, appeal: 50, experience: 50 })

    useEffect(() => {
        const load = async () => {
            const { data: { user } } = await supabase.auth.getUser()
            setUser(user)

            // Load all ratings
            const { data: allRatings } = await supabase
                .from('ost_ratings')
                .select('*')
                .in('ost_id', osts.map(o => o.id))

            const ratingsByOst: Record<string, any> = {}
            osts.forEach(o => {
                ratingsByOst[o.id] = { emotion: [], nostalgia: [], appeal: [], experience: [] }
            })

            allRatings?.forEach(r => {
                ratingsByOst[r.ost_id].emotion.push(r.emotion)
                ratingsByOst[r.ost_id].nostalgia.push(r.nostalgia)
                ratingsByOst[r.ost_id].appeal.push(r.appeal)
                ratingsByOst[r.ost_id].experience.push(r.experience)
            })

            setRatings(ratingsByOst)

            if (!user) return

            // Load user's ratings
            const { data: userRatingData } = await supabase
                .from('ost_ratings')
                .select('*')
                .eq('user_id', user.id)
                .in('ost_id', osts.map(o => o.id))

            const userRatingMap: Record<string, OstRating> = {}
            userRatingData?.forEach(r => {
                userRatingMap[r.ost_id] = {
                    emotion: r.emotion,
                    nostalgia: r.nostalgia,
                    appeal: r.appeal,
                    experience: r.experience,
                }
            })
            setUserRatings(userRatingMap)

            // Load favorites
            const { data: favData } = await supabase
                .from('ost_favorites')
                .select('ost_id')
                .eq('user_id', user.id)

            setFavorites(new Set(favData?.map(f => f.ost_id) ?? []))
        }
        load()
    }, [osts])

    const handleSaveRating = async (ostId: string) => {
        if (!user) {
            window.location.href = `/auth/login?redirect=${encodeURIComponent(window.location.pathname)}`
            return
        }

        await supabase.from('ost_ratings').upsert({
            ost_id: ostId,
            user_id: user.id,
            emotion: tempRatings.emotion,
            nostalgia: tempRatings.nostalgia,
            appeal: tempRatings.appeal,
            experience: tempRatings.experience,
        }, { onConflict: 'ost_id,user_id' })

        setIsRatingOpen(null)
        setUserRatings(prev => ({ ...prev, [ostId]: tempRatings }))
    }

    const handleFavorite = async (ostId: string) => {
        if (!user) {
            window.location.href = `/auth/login?redirect=${encodeURIComponent(window.location.pathname)}`
            return
        }

        if (favorites.has(ostId)) {
            await supabase.from('ost_favorites').delete().eq('ost_id', ostId).eq('user_id', user.id)
            setFavorites(prev => new Set([...prev].filter(id => id !== ostId)))
        } else {
            await supabase.from('ost_favorites').insert({ ost_id: ostId, user_id: user.id })
            setFavorites(prev => new Set([...prev, ostId]))
        }
    }

    const getAvgRating = (ostId: string) => {
        const r = ratings[ostId]
        if (!r) return 0
        const all = [...r.emotion, ...r.nostalgia, ...r.appeal, ...r.experience]
        return all.length ? Math.round(all.reduce((a, b) => a + b) / all.length) : 0
    }

    return (
        <div className="min-h-screen" style={{ background: 'var(--bg-tertiary)', color: 'var(--text-primary)' }}>
            <div className="container mx-auto px-4 py-8 max-w-4xl">
                <nav className="mb-6">
                    <Link href="/parks" className="text-blue-400 hover:text-blue-300 text-sm">Parks</Link>
                    <span className="mx-2 text-gray-500">/</span>
                    <Link href={`/parks/${park.id}`} className="text-blue-400 hover:text-blue-300 text-sm">{park.name}</Link>
                    <span className="mx-2 text-gray-500">/</span>
                    <Link href={`/parks/${park.id}/${category.id}/${item.id}`} className="text-blue-400 hover:text-blue-300 text-sm">{item.name}</Link>
                    <span className="mx-2 text-gray-500">/</span>
                    <span className="text-gray-300 text-sm">Soundtrack</span>
                </nav>

                <h1 className="text-4xl font-bold mb-2">🎵 {item.name} Soundtrack</h1>
                <p style={{ color: 'var(--text-muted)' }}>{osts.length} tracks</p>

                <div className="mt-8 space-y-4">
                    {osts.map(ost => {
                        const avg = getAvgRating(ost.id)
                        const userRating = userRatings[ost.id]
                        const isFavorited = favorites.has(ost.id)

                        return (
                            <div key={ost.id} className="rounded-sm p-6 flex gap-4"
                                style={{ background: 'var(--card-bg)', border: '1px solid var(--border)' }}>

                                {/* YouTube embed - small */}
                                <div className="w-32 h-20 flex-shrink-0 rounded-sm overflow-hidden bg-black">
                                    <iframe width="100%" height="100%" src={`https://www.youtube.com/embed/${ost.youtube_video_id}`}
                                        frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        style={{ pointerEvents: 'none' }} />
                                </div>

                                {/* Info */}
                                <div className="flex-1 min-w-0">
                                    <h3 className="text-lg font-semibold">{ost.title}</h3>
                                    {ost.composer && <p className="text-sm" style={{ color: 'var(--text-muted)' }}>🎼 {ost.composer}</p>}
                                    {ost.location && <p className="text-sm" style={{ color: 'var(--text-muted)' }}>📍 {ost.location}</p>}
                                    {ost.description && <p className="text-sm mt-2" style={{ color: 'var(--text-secondary)' }}>{ost.description}</p>}

                                    <div className="mt-3 flex gap-2">
                                        <button onClick={() => {
                                            setIsRatingOpen(ost.id)
                                            setTempRatings(userRating || { emotion: 50, nostalgia: 50, appeal: 50, experience: 50 })
                                        }}
                                            className="text-xs px-3 py-1 rounded-sm transition-colors"
                                            style={{ background: 'var(--cta)', color: 'var(--cta-text)' }}>
                                            {userRating ? '✏️ Edit Rating' : '⭐ Rate'}
                                        </button>
                                        <button onClick={() => handleFavorite(ost.id)}
                                            className="text-xs px-3 py-1 rounded-sm transition-colors"
                                            style={{ background: isFavorited ? '#ef4444' : 'var(--bg-elevated)', color: isFavorited ? 'white' : 'var(--text-muted)' }}>
                                            {isFavorited ? '❤️ Favorited' : '🤍 Favorite'}
                                        </button>
                                    </div>
                                </div>

                                {/* Score circle */}
                                <div className="flex-shrink-0">
                                    {avg > 0 ? <ScoreCircle score={avg} /> : <p style={{ color: 'var(--text-faint)' }}>—</p>}
                                </div>
                            </div>
                        )
                    })}
                </div>

                {/* Rating Modal */}
                {isRatingOpen && (
                    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
                        <div className="rounded-sm p-6 max-w-md w-full" style={{ background: 'var(--card-bg)', border: '1px solid var(--border)' }}>
                            <h2 className="text-lg font-semibold mb-4">Rate Track</h2>
                            <div className="space-y-4">
                                {dimensions.map(dim => (
                                    <div key={dim.id}>
                                        <label className="text-sm font-medium">{dim.label}</label>
                                        <input type="range" min="0" max="100" value={tempRatings[dim.id as keyof OstRating]}
                                            onChange={e => setTempRatings({ ...tempRatings, [dim.id]: parseInt(e.target.value) })}
                                            className="w-full mt-1"
                                            style={{ background: `linear-gradient(to right, var(--accent) 0%, var(--accent) ${tempRatings[dim.id as keyof OstRating]}%, var(--border) ${tempRatings[dim.id as keyof OstRating]}%, var(--border) 100%)` }}
                                        />
                                        <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>{tempRatings[dim.id as keyof OstRating]}</p>
                                    </div>
                                ))}
                            </div>
                            <div className="flex gap-3 mt-6">
                                <button onClick={() => setIsRatingOpen(null)}
                                    className="flex-1 px-4 py-2 rounded-sm text-sm"
                                    style={{ background: 'var(--bg-elevated)', color: 'var(--text-muted)' }}>
                                    Cancel
                                </button>
                                <button onClick={() => handleSaveRating(isRatingOpen)}
                                    className="flex-1 px-4 py-2 rounded-sm text-sm"
                                    style={{ background: 'var(--cta)', color: 'var(--cta-text)' }}>
                                    Save Rating
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}