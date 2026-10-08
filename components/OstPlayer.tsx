'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { FadeImage } from '@/components/FadeImage'

export interface OstTrack {
    id: string
    title: string
    youtube_video_id: string
    composer: string | null
    location: string | null
    description: string | null
    // optional grouping metadata (used in park-wide mode)
    item_id?: string
    item_name?: string
    category_id?: string
}

interface OstRating {
    emotion: number
    nostalgia: number
    appeal: number
    experience: number
}

const DIMS = [
    { id: 'emotion', label: 'Emotion' },
    { id: 'nostalgia', label: 'Nostalgia' },
    { id: 'appeal', label: 'Appeal' },
    { id: 'experience', label: 'Experience' },
]

declare global {
    interface Window {
        YT: any
        onYouTubeIframeAPIReady: () => void
    }
}

function loadYTApi(): Promise<void> {
    return new Promise(resolve => {
        if (window.YT && window.YT.Player) { resolve(); return }
        const prev = window.onYouTubeIframeAPIReady
        window.onYouTubeIframeAPIReady = () => { prev?.(); resolve() }
        if (!document.getElementById('yt-iframe-api')) {
            const s = document.createElement('script')
            s.id = 'yt-iframe-api'
            s.src = 'https://www.youtube.com/iframe_api'
            document.head.appendChild(s)
        }
    })
}

function fmt(sec: number) {
    if (!isFinite(sec) || sec < 0) return '0:00'
    const m = Math.floor(sec / 60)
    const s = Math.floor(sec % 60)
    return `${m}:${s.toString().padStart(2, '0')}`
}

function RatingModal({ ost, initial, onSave, onClose }: {
    ost: OstTrack
    initial: OstRating
    onSave: (r: OstRating) => void
    onClose: () => void
}) {
    const [vals, setVals] = useState<OstRating>(initial)
    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/70" onClick={onClose} />
            <div className="relative z-10 w-full max-w-sm rounded-sm p-6"
                style={{ background: 'var(--card-bg)', border: '1px solid var(--border)' }}>
                <div className="flex items-center justify-between mb-5">
                    <h3 className="font-semibold" style={{ color: 'var(--text-primary)' }}>Rate · {ost.title}</h3>
                    <button onClick={onClose} style={{ color: 'var(--text-muted)' }}>✕</button>
                </div>
                <div className="space-y-4">
                    {DIMS.map(d => (
                        <div key={d.id}>
                            <div className="flex justify-between mb-1">
                                <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{d.label}</span>
                                <span className="text-xs font-bold" style={{ color: 'var(--accent)' }}>{vals[d.id as keyof OstRating]}</span>
                            </div>
                            <input type="range" min="0" max="100"
                                value={vals[d.id as keyof OstRating]}
                                onChange={e => setVals(v => ({ ...v, [d.id]: +e.target.value }))}
                                className="w-full"
                                style={{ background: `linear-gradient(to right, var(--accent) 0%, var(--accent) ${vals[d.id as keyof OstRating]}%, var(--border) ${vals[d.id as keyof OstRating]}%, var(--border) 100%)` }}
                            />
                        </div>
                    ))}
                </div>
                <div className="flex gap-2 mt-6">
                    <button onClick={onClose} className="flex-1 py-2 rounded-sm text-sm"
                        style={{ background: 'var(--bg-elevated)', color: 'var(--text-muted)' }}>Cancel</button>
                    <button onClick={() => onSave(vals)} className="flex-1 py-2 rounded-sm text-sm font-medium"
                        style={{ background: 'var(--cta)', color: 'var(--cta-text)' }}>Save</button>
                </div>
            </div>
        </div>
    )
}

export default function OstPlayer({ osts, showGroupHeaders = false }: {
    osts: OstTrack[]
    showGroupHeaders?: boolean
}) {
    const supabase = createClient()
    const [user, setUser] = useState<any>(null)

    const playerRef = useRef<any>(null)
    const intervalRef = useRef<NodeJS.Timeout | null>(null)
    const [playerReady, setPlayerReady] = useState(false)
    const [currentIdx, setCurrentIdx] = useState(0)
    const [isPlaying, setIsPlaying] = useState(false)
    const [progress, setProgress] = useState(0)
    const [currentTime, setCurrentTime] = useState(0)
    const [duration, setDuration] = useState(0)
    const [volume, setVolume] = useState(80)
    const [isMuted, setIsMuted] = useState(false)

    const [userRatings, setUserRatings] = useState<Record<string, OstRating>>({})
    const [avgRatings, setAvgRatings] = useState<Record<string, number>>({})
    const [favorites, setFavorites] = useState<Set<string>>(new Set())
    const [ratingModal, setRatingModal] = useState<string | null>(null)

    const currentOst = osts[currentIdx] ?? null

    useEffect(() => {
        if (!osts.length) return
        loadYTApi().then(() => {
            playerRef.current = new window.YT.Player('yt-hidden-player', {
                height: '1', width: '1',
                videoId: osts[0]!.youtube_video_id,
                playerVars: { autoplay: 0, controls: 0, rel: 0, modestbranding: 1 },
                events: {
                    onReady: (e: any) => { e.target.setVolume(volume); setPlayerReady(true) },
                    onStateChange: (e: any) => {
                        const s = e.data
                        if (s === window.YT.PlayerState.PLAYING) {
                            setIsPlaying(true)
                            setDuration(playerRef.current.getDuration())
                            startInterval()
                        } else if (s === window.YT.PlayerState.PAUSED) {
                            setIsPlaying(false); stopInterval()
                        } else if (s === window.YT.PlayerState.ENDED) {
                            setIsPlaying(false); stopInterval(); handleNext()
                        }
                    },
                },
            })
        })
        return () => { stopInterval(); playerRef.current?.destroy() }
    }, []) // eslint-disable-line

    const startInterval = useCallback(() => {
        stopInterval()
        intervalRef.current = setInterval(() => {
            const p = playerRef.current
            if (!p) return
            const t = p.getCurrentTime?.() ?? 0
            const d = p.getDuration?.() ?? 0
            setCurrentTime(t); setDuration(d); setProgress(d > 0 ? t / d : 0)
        }, 500)
    }, [])

    const stopInterval = useCallback(() => {
        if (intervalRef.current) { clearInterval(intervalRef.current); intervalRef.current = null }
    }, [])

    useEffect(() => {
        const load = async () => {
            const { data: { user } } = await supabase.auth.getUser()
            setUser(user)

            const { data: allRatings } = await supabase
                .from('ost_ratings').select('*').in('ost_id', osts.map(o => o.id))
            const grouped: Record<string, OstRating[]> = {}
            allRatings?.forEach(r => {
                if (!grouped[r.ost_id]) grouped[r.ost_id] = []
                grouped[r.ost_id]!.push(r)
            })
            const avgs: Record<string, number> = {}
            Object.entries(grouped).forEach(([id, rows]) => {
                const total = rows.reduce((s, r) => s + r.emotion + r.nostalgia + r.appeal + r.experience, 0)
                avgs[id] = Math.round(total / (rows.length * 4))
            })
            setAvgRatings(avgs)

            if (!user) return

            const { data: myRatings } = await supabase
                .from('ost_ratings').select('*').eq('user_id', user.id).in('ost_id', osts.map(o => o.id))
            const ur: Record<string, OstRating> = {}
            myRatings?.forEach(r => { ur[r.ost_id] = { emotion: r.emotion, nostalgia: r.nostalgia, appeal: r.appeal, experience: r.experience } })
            setUserRatings(ur)

            const { data: favData } = await supabase.from('ost_favorites').select('ost_id').eq('user_id', user.id)
            setFavorites(new Set(favData?.map(f => f.ost_id) ?? []))
        }
        load()
    }, [osts]) // eslint-disable-line

    const loadTrack = (idx: number, autoplay = false) => {
        setCurrentIdx(idx)
        setProgress(0); setCurrentTime(0); setDuration(0)
        if (!playerRef.current) return
        const vid = osts[idx]!.youtube_video_id
        if (autoplay) playerRef.current.loadVideoById(vid)
        else playerRef.current.cueVideoById(vid)
    }

    const handlePlayPause = () => {
        if (!playerReady || !playerRef.current) return
        isPlaying ? playerRef.current.pauseVideo() : playerRef.current.playVideo()
    }

    const handlePrev = () => loadTrack(currentIdx > 0 ? currentIdx - 1 : osts.length - 1, isPlaying)
    const handleNext = () => loadTrack(currentIdx < osts.length - 1 ? currentIdx + 1 : 0, isPlaying)

    const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
        const p = +e.target.value / 100
        const t = p * duration
        playerRef.current?.seekTo(t, true)
        setProgress(p); setCurrentTime(t)
    }

    const handleVolume = (e: React.ChangeEvent<HTMLInputElement>) => {
        const v = +e.target.value
        setVolume(v); setIsMuted(v === 0)
        playerRef.current?.setVolume(v)
        if (v > 0) playerRef.current?.unMute()
    }

    const handleMuteToggle = () => {
        if (isMuted) { playerRef.current?.unMute(); playerRef.current?.setVolume(volume); setIsMuted(false) }
        else { playerRef.current?.mute(); setIsMuted(true) }
    }

    const handleTrackClick = (idx: number) => {
        if (idx === currentIdx) handlePlayPause()
        else loadTrack(idx, true)
    }

    const handleSaveRating = async (ostId: string, rating: OstRating) => {
        if (!user) { window.location.href = `/auth/login?redirect=${encodeURIComponent(window.location.pathname)}`; return }
        await supabase.from('ost_ratings').upsert({ ost_id: ostId, user_id: user.id, ...rating }, { onConflict: 'ost_id,user_id' })
        setUserRatings(prev => ({ ...prev, [ostId]: rating }))
        setRatingModal(null)
    }

    const handleFavorite = async (ostId: string) => {
        if (!user) { window.location.href = `/auth/login?redirect=${encodeURIComponent(window.location.pathname)}`; return }
        if (favorites.has(ostId)) {
            await supabase.from('ost_favorites').delete().eq('ost_id', ostId).eq('user_id', user.id)
            setFavorites(prev => new Set([...prev].filter(id => id !== ostId)))
        } else {
            await supabase.from('ost_favorites').insert({ ost_id: ostId, user_id: user.id })
            setFavorites(prev => new Set([...prev, ostId]))
        }
    }

    const thumb = (videoId: string) => `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`

    // Group osts by item if showGroupHeaders
    const rows: Array<{ type: 'header'; label: string } | { type: 'track'; ost: OstTrack; idx: number }> = []
    if (showGroupHeaders) {
        let lastItemId: string | undefined
        osts.forEach((ost, idx) => {
            if (ost.item_id !== lastItemId) {
                rows.push({ type: 'header', label: ost.item_name ?? 'Unknown' })
                lastItemId = ost.item_id
            }
            rows.push({ type: 'track', ost, idx })
        })
    } else {
        osts.forEach((ost, idx) => rows.push({ type: 'track', ost, idx }))
    }

    return (
        <>
            <div style={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden', opacity: 0, pointerEvents: 'none' }}>
                <div id="yt-hidden-player" />
            </div>

            {osts.length === 0 ? (
                <p style={{ color: 'var(--text-muted)' }}>No tracks yet.</p>
            ) : (
                <div className="rounded-sm overflow-hidden" style={{ border: '1px solid var(--border)' }}>
                    {rows.map((row, i) => {
                        if (row.type === 'header') {
                            return (
                                <div key={`header-${i}`} className="px-4 py-2 text-xs font-semibold uppercase tracking-wider"
                                    style={{ background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border)', color: 'var(--text-muted)' }}>
                                    {row.label}
                                </div>
                            )
                        }
                        const { ost, idx } = row
                        const active = idx === currentIdx
                        const avg = avgRatings[ost.id]
                        const fav = favorites.has(ost.id)
                        const myR = userRatings[ost.id]

                        return (
                            <div key={ost.id}
                                className="flex items-center gap-3 px-4 py-3 transition-colors group"
                                style={{
                                    background: active ? 'var(--accent-bg)' : 'var(--card-bg)',
                                    borderBottom: i < rows.length - 1 ? '1px solid var(--border)' : undefined,
                                    cursor: 'pointer',
                                }}>
                                <button onClick={() => handleTrackClick(idx)}
                                    className="w-8 h-8 flex items-center justify-center flex-shrink-0 rounded-sm"
                                    style={{ color: active ? 'var(--accent)' : 'var(--text-faint)' }}>
                                    {active && isPlaying ? (
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                                            <rect x="5" y="4" width="4" height="16" /><rect x="15" y="4" width="4" height="16" />
                                        </svg>
                                    ) : active ? (
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                                            <polygon points="5,3 19,12 5,21" />
                                        </svg>
                                    ) : (
                                        <>
                                            <span className="text-xs w-6 text-center select-none group-hover:hidden">{idx + 1}</span>
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" className="hidden group-hover:block">
                                                <polygon points="5,3 19,12 5,21" />
                                            </svg>
                                        </>
                                    )}
                                </button>

                                <div className="flex-shrink-0 rounded-sm overflow-hidden" style={{ width: 48, height: 32 }}
                                    onClick={() => handleTrackClick(idx)}>
                                    <FadeImage src={thumb(ost.youtube_video_id)} alt={ost.title}
                                        className="w-full h-full object-cover"
                                        style={{ opacity: active ? 1 : 0.7 }} />
                                </div>

                                <div className="flex-1 min-w-0" onClick={() => handleTrackClick(idx)}>
                                    <p className="text-sm font-medium truncate"
                                        style={{ color: active ? 'var(--accent)' : 'var(--text-primary)' }}>
                                        {ost.title}
                                    </p>
                                    {ost.composer && (
                                        <p className="text-xs truncate mt-0.5" style={{ color: 'var(--text-muted)' }}>{ost.composer}</p>
                                    )}
                                    {ost.location && (
                                        <p className="text-xs truncate" style={{ color: 'var(--text-faint)' }}>📍 {ost.location}</p>
                                    )}
                                </div>

                                <div className="flex-shrink-0 w-8 text-center">
                                    {avg !== undefined ? (
                                        <span className="text-xs font-bold" style={{ color: 'var(--accent)' }}>{avg}</span>
                                    ) : (
                                        <span className="text-xs" style={{ color: 'var(--text-faint)' }}>—</span>
                                    )}
                                </div>

                                <div className="flex items-center gap-1 flex-shrink-0">
                                    <button onClick={() => setRatingModal(ost.id)}
                                        className="text-xs px-2 py-1 rounded-sm transition-opacity opacity-0 group-hover:opacity-100"
                                        style={{ background: 'var(--bg-elevated)', color: myR ? 'var(--accent)' : 'var(--text-muted)' }}>
                                        {myR ? '★' : '☆'}
                                    </button>
                                    <button onClick={() => handleFavorite(ost.id)}
                                        className="text-xs px-2 py-1 rounded-sm transition-opacity opacity-0 group-hover:opacity-100"
                                        style={{ color: fav ? '#ef4444' : 'var(--text-muted)', background: 'var(--bg-elevated)' }}>
                                        {fav ? '♥' : '♡'}
                                    </button>
                                </div>
                            </div>
                        )
                    })}
                </div>
            )}

            {/* Fixed bottom player */}
            {osts.length > 0 && (
                <div className="fixed bottom-0 left-0 right-0 z-[100] px-4 py-3"
                    style={{ background: 'var(--navbar-bg)', borderTop: '1px solid var(--border)' }}>
                    <div className="container mx-auto max-w-5xl flex items-center gap-4">
                        {currentOst && (
                            <div className="flex items-center gap-3 flex-shrink-0 w-48 min-w-0">
                                <div className="rounded-sm overflow-hidden flex-shrink-0" style={{ width: 44, height: 30 }}>
                                    <FadeImage src={thumb(currentOst.youtube_video_id)} alt={currentOst.title} className="w-full h-full object-cover" />
                                </div>
                                <div className="min-w-0">
                                    <p className="text-xs font-semibold truncate" style={{ color: 'var(--text-primary)' }}>{currentOst.title}</p>
                                    {currentOst.item_name && showGroupHeaders && (
                                        <p className="text-[10px] truncate" style={{ color: 'var(--text-muted)' }}>{currentOst.item_name}</p>
                                    )}
                                    {currentOst.composer && !showGroupHeaders && (
                                        <p className="text-[10px] truncate" style={{ color: 'var(--text-muted)' }}>{currentOst.composer}</p>
                                    )}
                                </div>
                            </div>
                        )}

                        <div className="flex flex-col items-center gap-1 flex-1 min-w-0">
                            <div className="flex items-center gap-3">
                                <button onClick={handlePrev} style={{ color: 'var(--text-muted)' }} className="hover:opacity-80">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                        <polygon points="19,20 9,12 19,4" /><rect x="5" y="4" width="2" height="16" />
                                    </svg>
                                </button>
                                <button onClick={handlePlayPause} disabled={!playerReady}
                                    className="w-8 h-8 rounded-full flex items-center justify-center disabled:opacity-40"
                                    style={{ background: 'var(--accent)', color: 'var(--bg-tertiary)' }}>
                                    {isPlaying ? (
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                                            <rect x="5" y="4" width="4" height="16" /><rect x="15" y="4" width="4" height="16" />
                                        </svg>
                                    ) : (
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                                            <polygon points="6,3 20,12 6,21" />
                                        </svg>
                                    )}
                                </button>
                                <button onClick={handleNext} style={{ color: 'var(--text-muted)' }} className="hover:opacity-80">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                        <polygon points="5,4 15,12 5,20" /><rect x="17" y="4" width="2" height="16" />
                                    </svg>
                                </button>
                            </div>
                            <div className="flex items-center gap-2 w-full max-w-md">
                                <span className="text-[10px] flex-shrink-0 w-8 text-right" style={{ color: 'var(--text-faint)' }}>{fmt(currentTime)}</span>
                                <div className="relative flex-1 h-1 rounded-full cursor-pointer" style={{ background: 'var(--border)' }}>
                                    <div className="absolute left-0 top-0 h-full rounded-full"
                                        style={{ width: `${progress * 100}%`, background: 'var(--accent)' }} />
                                    <input type="range" min="0" max="100" value={progress * 100}
                                        onChange={handleSeek}
                                        className="absolute inset-0 w-full opacity-0 cursor-pointer h-full" />
                                </div>
                                <span className="text-[10px] flex-shrink-0 w-8" style={{ color: 'var(--text-faint)' }}>{fmt(duration)}</span>
                            </div>
                        </div>

                        <div className="flex items-center gap-2 flex-shrink-0 w-32">
                            <button onClick={handleMuteToggle} style={{ color: 'var(--text-muted)' }} className="flex-shrink-0">
                                {isMuted || volume === 0 ? (
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M11 5L6 9H2v6h4l5 4V5z" /><line x1="22" y1="9" x2="16" y2="15" stroke="currentColor" strokeWidth="2" /><line x1="16" y1="9" x2="22" y2="15" stroke="currentColor" strokeWidth="2" />
                                    </svg>
                                ) : (
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M11 5L6 9H2v6h4l5 4V5z" /><path d="M15.54 8.46a5 5 0 0 1 0 7.07M19.07 4.93a10 10 0 0 1 0 14.14" stroke="currentColor" fill="none" strokeWidth="2" strokeLinecap="round" />
                                    </svg>
                                )}
                            </button>
                            <div className="relative flex-1 h-1 rounded-full" style={{ background: 'var(--border)' }}>
                                <div className="absolute left-0 top-0 h-full rounded-full"
                                    style={{ width: `${isMuted ? 0 : volume}%`, background: 'var(--text-muted)' }} />
                                <input type="range" min="0" max="100" value={isMuted ? 0 : volume}
                                    onChange={handleVolume}
                                    className="absolute inset-0 w-full opacity-0 cursor-pointer h-full" />
                            </div>
                        </div>

                        {currentOst && (
                            <a href={`https://www.youtube.com/watch?v=${currentOst.youtube_video_id}`}
                                target="_blank" rel="noopener noreferrer"
                                className="flex-shrink-0 text-[10px] px-2 py-1 rounded-sm hover:opacity-80"
                                style={{ color: 'var(--text-faint)', border: '1px solid var(--border)' }}>
                                YT ↗
                            </a>
                        )}
                    </div>
                </div>
            )}

            {ratingModal && (
                <RatingModal
                    ost={osts.find(o => o.id === ratingModal)!}
                    initial={userRatings[ratingModal] ?? { emotion: 50, nostalgia: 50, appeal: 50, experience: 50 }}
                    onSave={r => handleSaveRating(ratingModal, r)}
                    onClose={() => setRatingModal(null)}
                />
            )}
        </>
    )
}