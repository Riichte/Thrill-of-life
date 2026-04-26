'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { FaInstagram, FaYoutube, FaTiktok, FaXTwitter, FaFacebook } from 'react-icons/fa6'

interface Profile {
  id: string
  username: string | null
  avatar_url: string | null
  bio: string | null
  instagram: string | null
  youtube: string | null
  tiktok: string | null
  twitter: string | null
  facebook: string | null
  home_park_id: string | null
  created_at: string
}

interface Review {
  id: string
  title: string | null
  body: string | null
  created_at: string
  review_ratings: { category: string; score: number }[]
  items: { id: string; name: string; park_id: string; category_id: string } | null
}

interface Favorite {
  id: string
  item_id: string
  created_at: string
  items: {
    id: string
    name: string
    park_id: string
    category_id: string
    specs: any
    item_images: { url: string }[]
  } | null
}

interface ProfileClientProps {
  profile: Profile | null
  reviews: Review[]
  favorites: Favorite[]
  points: number
  followerCount: number
  followingCount: number
  isOwnProfile: boolean
  viewerId?: string
  isFollowing?: boolean
  reactions?: any[]
  follows?: any[]
}

type ActivityItem =
  | { type: 'review'; date: string; review: Review }
  | { type: 'favorite'; date: string; favorite: Favorite }
  | { type: 'reaction'; date: string; reaction: any }
  | { type: 'follow'; date: string; follow: any }

function getScoreColor(s: number) {
  return s >= 80 ? '#10b981' : s >= 60 ? '#f59e0b' : s >= 40 ? '#f97316' : '#ef4444'
}

function ScoreCircle({ score }: { score: number }) {
  return (
    <svg className="w-10 h-10 flex-shrink-0" viewBox="0 0 100 100">
      <circle cx="50" cy="50" r="45" fill="none" stroke="#2a475e" strokeWidth="4" />
      <circle cx="50" cy="50" r="45" fill="none" stroke={getScoreColor(score)} strokeWidth="4"
        strokeDasharray={`${(score / 100) * 282.7}`} strokeDashoffset="0" strokeLinecap="round"
        style={{ transform: 'rotate(-90deg)', transformOrigin: '50% 50%' }} />
      <text x="50" y="50" textAnchor="middle" dy="0.3em" fill="#c6d4df" fontWeight="bold" fontSize="30">
        {score}
      </text>
    </svg>
  )
}

function groupByDate(items: ActivityItem[]) {
  const groups: Record<string, ActivityItem[]> = {}
  const now = new Date()

  items.forEach(item => {
    const date = new Date(item.date)
    const diffDays = Math.floor((now.getTime() - date.getTime()) / 86400000)
    let label: string
    if (diffDays === 0) label = 'Today'
    else if (diffDays === 1) label = 'Yesterday'
    else if (diffDays < 7) label = 'This week'
    else if (diffDays < 30) label = 'This month'
    else {
      label = date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    }
    if (!groups[label]) groups[label] = []
    groups[label].push(item)
  })

  return groups
}

export default function ProfileClient({
  profile,
  reviews,
  favorites,
  points,
  followerCount,
  followingCount,
  isOwnProfile,
  viewerId,
  isFollowing: initialIsFollowing = false,
  reactions: profileReactions = [],
  follows = [],
}: ProfileClientProps) {

  const supabase = createClient()
  const [activeTab, setActiveTab] = useState<'activity' | 'reviews' | 'favorites'>('activity')
  const [isFollowing, setIsFollowing] = useState(initialIsFollowing)
  const [followerCountState, setFollowerCountState] = useState(followerCount)
  const [isEditingBio, setIsEditingBio] = useState(false)
  const [bio, setBio] = useState(profile?.bio ?? '')
  const [bioInput, setBioInput] = useState(profile?.bio ?? '')
  const [username, setUsername] = useState(profile?.username ?? '')
  const [usernameInput, setUsernameInput] = useState(profile?.username ?? '')
  const [isEditingUsername, setIsEditingUsername] = useState(false)
  const [saving, setSaving] = useState(false)
  const [socials, setSocials] = useState({
    instagram: profile?.instagram ?? '',
    youtube: profile?.youtube ?? '',
    tiktok: profile?.tiktok ?? '',
    twitter: profile?.twitter ?? '',
    facebook: profile?.facebook ?? '',
  })
  const [socialsInput, setSocialsInput] = useState({ ...socials })
  const [isEditingSocials, setIsEditingSocials] = useState(false)
  const [homeParkId, setHomeParkId] = useState(profile?.home_park_id ?? '')
  const [homeParkInput, setHomeParkInput] = useState(profile?.home_park_id ?? '')
  const [isEditingHomePark, setIsEditingHomePark] = useState(false)
  const [parks, setParks] = useState<{ id: string; name: string }[]>([])

  useEffect(() => {
    const loadParks = async () => {
      const { data } = await supabase.from('parks').select('id, name').order('name')
      if (data) setParks(data)
    }
    loadParks()
  }, [])

  const joinedYear = profile?.created_at
    ? new Date(profile.created_at).getFullYear()
    : null

  const avgScore = reviews.length > 0
    ? Math.round(
      reviews.reduce((sum, r) => {
        const avg = r.review_ratings.length > 0
          ? r.review_ratings.reduce((s, rr) => s + rr.score, 0) / r.review_ratings.length
          : 0
        return sum + avg
      }, 0) / reviews.length
    )
    : null

  // Build activity feed
  const activityItems: ActivityItem[] = [
    ...reviews.map(r => ({ type: 'review' as const, date: r.created_at, review: r })),
    ...favorites.map(f => ({ type: 'favorite' as const, date: (f as any).created_at ?? '', favorite: f })),
    ...profileReactions.map((r: any) => ({ type: 'reaction' as const, date: r.created_at ?? '', reaction: r })),
    ...follows.map((f: any) => ({ type: 'follow' as const, date: f.created_at ?? '', follow: f })),
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  const groupedActivity = groupByDate(activityItems)

  const handleFollow = async () => {
    if (!viewerId || !profile) return
    if (isFollowing) {
      await supabase.from('followers').delete()
        .eq('follower_id', viewerId).eq('following_id', profile.id)
      setIsFollowing(false)
      setFollowerCountState(prev => prev - 1)
    } else {
      await supabase.from('followers').insert({ follower_id: viewerId, following_id: profile.id })
      setIsFollowing(true)
      setFollowerCountState(prev => prev + 1)
    }
  }

  const handleSaveBio = async () => {
    if (!profile) return
    setSaving(true)
    await supabase.from('profiles').update({ bio: bioInput }).eq('id', profile.id)
    setBio(bioInput)
    setIsEditingBio(false)
    setSaving(false)
  }

  const handleSaveSocials = async () => {
    if (!profile) return
    setSaving(true)
    await supabase.from('profiles').update(socialsInput).eq('id', profile.id)
    setSocials(socialsInput)
    setIsEditingSocials(false)
    setSaving(false)
  }

  const handleSaveHomePark = async () => {
    if (!profile) return
    setSaving(true)
    await supabase.from('profiles').update({ home_park_id: homeParkInput || null }).eq('id', profile.id)
    setHomeParkId(homeParkInput)
    setIsEditingHomePark(false)
    setSaving(false)
  }

  const handleSaveUsername = async () => {
    if (!profile) return
    setSaving(true)
    const { error } = await supabase.from('profiles').update({ username: usernameInput }).eq('id', profile.id)
    if (!error) {
      setUsername(usernameInput)
      setIsEditingUsername(false)
    }
    setSaving(false)
  }

  const hasSocials = Object.values(socials).some(Boolean)

  return (
    <div className="min-h-screen style={{ background: 'var(--bg-tertiary)' }} style={{ color: 'var(--text-primary)' }}">

      {/* Banner */}
      <div className="h-36 bg-gradient-to-r from-[#0e1621] via-[#2a475e] to-[#0e1621]" />

      <div className="container mx-auto px-4 max-w-6xl">

        {/* Profile header */}
        <div className="relative -mt-14 mb-8 flex flex-col sm:flex-row items-start sm:items-end gap-4">
          {/* Avatar */}
          <div className="w-28 h-28 rounded-full bg-gradient-to-br from-[#2a475e] to-[#1b2838] border-4 border-gray-900 flex items-center justify-center text-5xl font-bold style={{ color: 'var(--accent)' }} flex-shrink-0 shadow-xl">
            {username?.[0]?.toUpperCase() ?? '?'}
          </div>

          <div className="flex-1 pb-2">
            {/* Username */}
            {isEditingUsername ? (
              <div className="flex items-center gap-2 mb-1">
                <input
                  value={usernameInput}
                  onChange={e => setUsernameInput(e.target.value)}
                  className="style={{ background: 'var(--bg-elevated)' }} border style={{ borderColor: 'var(--input-border)' }} rounded-sm px-3 py-1 text-xl font-bold style={{ color: 'var(--text-primary)' }} focus:outline-none style={{ outlineColor: 'var(--input-focus)' }}"
                />
                <button onClick={handleSaveUsername} disabled={saving}
                  className="px-3 py-1 style={{ background: 'var(--cta)' }} hover:bg-[#5a7a28] style={{ color: 'var(--text-primary)' }} text-sm rounded-sm disabled:opacity-50">
                  {saving ? 'Saving...' : 'Save'}
                </button>
                <button onClick={() => setIsEditingUsername(false)}
                  className="px-3 py-1 style={{ color: 'var(--text-muted)' }} hover:style={{ color: 'var(--text-primary)' }} text-sm">Cancel</button>
              </div>
            ) : (
              <div className="flex items-center gap-2 mb-1">
                <h1 className="text-3xl font-bold style={{ color: 'var(--text-primary)' }}">{username || 'Unknown'}</h1>
                {isOwnProfile && (
                  <button onClick={() => setIsEditingUsername(true)}
                    className="text-xs style={{ color: 'var(--text-muted)' }} hover:style={{ color: 'var(--accent)' }} transition-colors">✏️</button>
                )}
              </div>
            )}
            <p className="text-sm style={{ color: 'var(--text-muted)' }}">Member since {joinedYear}</p>
          </div>

          {/* Follow button */}
          {!isOwnProfile && viewerId && (
            <div className="pb-2">
              <button
                onClick={handleFollow}
                className={`px-6 py-2 rounded-sm text-sm font-medium transition-colors ${isFollowing
                  ? 'style={{ background: 'var(--bg-elevated)' }} hover:bg-red-900/40 style={{ color: 'var(--text-primary)' }} hover:text-red-400 border style={{ borderColor: 'var(--input-border)' }}'
                  : 'style={{ background: 'var(--cta)' }} hover:bg-[#5a7a28] style={{ color: 'var(--text-primary)' }}'}`}
              >
                {isFollowing ? 'Unfollow' : '+ Follow'}
              </button>
            </div>
          )}
        </div>

        {/* Main layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-12">

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-4">

            {/* Bio */}
            <div className="style={{ background: 'var(--card-bg)' }} border style={{ borderColor: 'var(--border)' }} rounded-sm p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xs font-semibold uppercase tracking-wider style={{ color: 'var(--text-muted)' }}">Bio</h3>
                {isOwnProfile && !isEditingBio && (
                  <button onClick={() => setIsEditingBio(true)}
                    className="text-xs style={{ color: 'var(--text-muted)' }} hover:style={{ color: 'var(--accent)' }} transition-colors">✏️ Edit</button>
                )}
              </div>
              {isEditingBio ? (
                <div className="space-y-2">
                  <textarea
                    value={bioInput}
                    onChange={e => setBioInput(e.target.value)}
                    rows={4}
                    placeholder="Tell the community about yourself..."
                    className="w-full style={{ background: 'var(--bg-elevated)' }} border style={{ borderColor: 'var(--input-border)' }} rounded-sm px-3 py-2 text-sm style={{ color: 'var(--text-primary)' }} placeholder-[#6a8a9a] focus:outline-none style={{ outlineColor: 'var(--input-focus)' }} resize-none"
                  />
                  <div className="flex gap-2">
                    <button onClick={handleSaveBio} disabled={saving}
                      className="px-3 py-1 style={{ background: 'var(--cta)' }} hover:bg-[#5a7a28] style={{ color: 'var(--text-primary)' }} text-xs rounded-sm disabled:opacity-50">
                      {saving ? 'Saving...' : 'Save'}
                    </button>
                    <button onClick={() => { setIsEditingBio(false); setBioInput(bio) }}
                      className="px-3 py-1 style={{ color: 'var(--text-muted)' }} hover:style={{ color: 'var(--text-primary)' }} text-xs">Cancel</button>
                  </div>
                </div>
              ) : (
                <p className="text-sm style={{ color: 'var(--text-secondary)' }} leading-relaxed">
                  {bio || <span className="text-[#4a6a82] italic">{isOwnProfile ? 'Add a bio...' : 'No bio yet.'}</span>}
                </p>
              )}
            </div>

            {/* Stats */}
            <div className="style={{ background: 'var(--card-bg)' }} border style={{ borderColor: 'var(--border)' }} rounded-sm p-4">
              <h3 className="text-xs font-semibold uppercase tracking-wider style={{ color: 'var(--text-muted)' }} mb-3">Stats</h3>
              <div className="space-y-2.5">
                <div className="flex justify-between text-sm">
                  <span className="style={{ color: 'var(--text-muted)' }}">Points</span>
                  <span className="text-[#f59e0b] font-bold">🏅 {points}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="style={{ color: 'var(--text-muted)' }}">Avg Score Given</span>
                  <span className="style={{ color: 'var(--text-primary)' }} font-semibold">{avgScore ?? '—'}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="style={{ color: 'var(--text-muted)' }}">Followers</span>
                  <span className="style={{ color: 'var(--text-primary)' }} font-semibold">{followerCountState}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="style={{ color: 'var(--text-muted)' }}">Following</span>
                  <span className="style={{ color: 'var(--text-primary)' }} font-semibold">{followingCount}</span>
                </div>

                {/* Home Park */}
                <div className="border-t style={{ borderColor: 'var(--border)' }} pt-2.5 mt-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs style={{ color: 'var(--text-muted)' }}">Home Park</span>
                    {isOwnProfile && !isEditingHomePark && (
                      <button onClick={() => setIsEditingHomePark(true)}
                        className="text-xs style={{ color: 'var(--text-muted)' }} hover:style={{ color: 'var(--accent)' }} transition-colors">✏️</button>
                    )}
                  </div>
                  {isEditingHomePark ? (
                    <div className="space-y-2">
                      <select
                        value={homeParkInput}
                        onChange={e => setHomeParkInput(e.target.value)}
                        className="w-full style={{ background: 'var(--bg-elevated)' }} border style={{ borderColor: 'var(--input-border)' }} rounded-sm px-2 py-1 text-xs style={{ color: 'var(--text-primary)' }} focus:outline-none style={{ outlineColor: 'var(--input-focus)' }}"
                      >
                        <option value="">— None —</option>
                        {parks.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                      </select>
                      <div className="flex gap-2">
                        <button onClick={handleSaveHomePark} disabled={saving}
                          className="px-2 py-1 style={{ background: 'var(--cta)' }} hover:bg-[#5a7a28] style={{ color: 'var(--text-primary)' }} text-xs rounded-sm disabled:opacity-50">
                          {saving ? '...' : 'Save'}
                        </button>
                        <button onClick={() => { setIsEditingHomePark(false); setHomeParkInput(homeParkId) }}
                          className="px-2 py-1 style={{ color: 'var(--text-muted)' }} hover:style={{ color: 'var(--text-primary)' }} text-xs">Cancel</button>
                      </div>
                    </div>
                  ) : (
                    homeParkId ? (
                      <Link href={`/parks/${homeParkId}`} className="text-sm style={{ color: 'var(--accent)' }} hover:underline">
                        🏠 {parks.find(p => p.id === homeParkId)?.name ?? homeParkId}
                      </Link>
                    ) : (
                      <p className="text-xs text-[#4a6a82] italic">
                        {isOwnProfile ? 'Set your home park...' : 'No home park set.'}
                      </p>
                    )
                  )}
                </div>
              </div>
            </div>

            {/* Socials */}
            <div className="style={{ background: 'var(--card-bg)' }} border style={{ borderColor: 'var(--border)' }} rounded-sm p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs font-semibold uppercase tracking-wider style={{ color: 'var(--text-muted)' }}">Socials</h3>
                {isOwnProfile && !isEditingSocials && (
                  <button onClick={() => setIsEditingSocials(true)}
                    className="text-xs style={{ color: 'var(--text-muted)' }} hover:style={{ color: 'var(--accent)' }} transition-colors">✏️ Edit</button>
                )}
              </div>
              {isEditingSocials ? (
                <div className="space-y-2">
                  {(['instagram', 'youtube', 'tiktok', 'twitter', 'facebook'] as const).map(key => (
                    <input key={key} type="text"
                      placeholder={key.charAt(0).toUpperCase() + key.slice(1) + ' username'}
                      value={socialsInput[key]}
                      onChange={e => setSocialsInput({ ...socialsInput, [key]: e.target.value })}
                      className="w-full style={{ background: 'var(--bg-elevated)' }} border style={{ borderColor: 'var(--input-border)' }} rounded-sm px-3 py-1.5 text-sm style={{ color: 'var(--text-primary)' }} placeholder-[#6a8a9a] focus:outline-none style={{ outlineColor: 'var(--input-focus)' }}"
                    />
                  ))}
                  <div className="flex gap-2 pt-1">
                    <button onClick={handleSaveSocials} disabled={saving}
                      className="px-3 py-1 style={{ background: 'var(--cta)' }} hover:bg-[#5a7a28] style={{ color: 'var(--text-primary)' }} text-xs rounded-sm disabled:opacity-50">
                      {saving ? 'Saving...' : 'Save'}
                    </button>
                    <button onClick={() => { setIsEditingSocials(false); setSocialsInput({ ...socials }) }}
                      className="px-3 py-1 style={{ color: 'var(--text-muted)' }} hover:style={{ color: 'var(--text-primary)' }} text-xs">Cancel</button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-wrap gap-3">
                  {socials.instagram && (
                    <a href={`https://instagram.com/${socials.instagram}`} target="_blank" rel="noopener noreferrer"
                      className="text-pink-400 hover:text-pink-300 transition-colors"><FaInstagram size={20} /></a>
                  )}
                  {socials.youtube && (
                    <a href={`https://youtube.com/@${socials.youtube}`} target="_blank" rel="noopener noreferrer"
                      className="text-red-500 hover:text-red-400 transition-colors"><FaYoutube size={20} /></a>
                  )}
                  {socials.tiktok && (
                    <a href={`https://tiktok.com/@${socials.tiktok}`} target="_blank" rel="noopener noreferrer"
                      className="style={{ color: 'var(--text-primary)' }} hover:text-gray-300 transition-colors"><FaTiktok size={20} /></a>
                  )}
                  {socials.twitter && (
                    <a href={`https://x.com/${socials.twitter}`} target="_blank" rel="noopener noreferrer"
                      className="text-sky-400 hover:text-sky-300 transition-colors"><FaXTwitter size={20} /></a>
                  )}
                  {socials.facebook && (
                    <a href={`https://facebook.com/${socials.facebook}`} target="_blank" rel="noopener noreferrer"
                      className="text-blue-400 hover:text-blue-300 transition-colors"><FaFacebook size={20} /></a>
                  )}
                  {!hasSocials && (
                    <p className="text-xs text-[#4a6a82] italic">
                      {isOwnProfile ? 'Add your socials...' : 'No socials yet.'}
                    </p>
                  )}
                </div>
              )}
            </div>

          </div>

          {/* Main content */}
          <div className="lg:col-span-3">

            {/* Stats banner */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
              {[
                { label: 'Reviews', value: reviews.length, color: 'style={{ color: 'var(--accent)' }}' },
                { label: 'Favorites', value: favorites.length, color: 'text-pink-400' },
                { label: 'Followers', value: followerCountState, color: 'text-emerald-400' },
                { label: 'Points', value: points, color: 'text-[#f59e0b]' },
              ].map(stat => (
                <div key={stat.label} className="style={{ background: 'var(--card-bg)' }} border style={{ borderColor: 'var(--border)' }} rounded-sm p-4 text-center">
                  <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                  <p className="text-xs style={{ color: 'var(--text-muted)' }} mt-0.5 uppercase tracking-wider">{stat.label}</p>
                </div>
              ))}
            </div>

            {/* Tabs */}
            <div className="flex gap-0 mb-6 border-b style={{ borderColor: 'var(--border)' }}">
              {(['activity', 'reviews', 'favorites'] as const).map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-6 py-3 text-sm font-medium capitalize transition-colors border-b-2 -mb-px ${activeTab === tab
                    ? 'style={{ color: 'var(--accent)' }} border-[#66c0f4]'
                    : 'style={{ color: 'var(--text-muted)' }} border-transparent hover:style={{ color: 'var(--text-primary)' }}'}`}
                >
                  {tab === 'activity' ? 'Activity' : tab === 'reviews' ? `Reviews (${reviews.length})` : `Favorites (${favorites.length})`}
                </button>
              ))}
            </div>

            {/* Activity Tab */}
            {activeTab === 'activity' && (
              <div className="space-y-8">
                {activityItems.length === 0 && (
                  <p className="style={{ color: 'var(--text-muted)' }} text-sm">No activity yet.</p>
                )}
                {Object.entries(groupedActivity).map(([dateLabel, items]) => (
                  <div key={dateLabel}>
                    <p className="text-xs font-semibold uppercase tracking-wider style={{ color: 'var(--text-muted)' }} mb-3 flex items-center gap-2">
                      <span className="h-px flex-1 style={{ background: 'var(--bg-elevated)' }}" />
                      {dateLabel}
                      <span className="h-px flex-1 style={{ background: 'var(--bg-elevated)' }}" />
                    </p>
                    <div className="space-y-3">
                      {items.map((item, i) => {
                        if (item.type === 'review') {
                          const avg = item.review.review_ratings.length > 0
                            ? Math.round(item.review.review_ratings.reduce((s, r) => s + r.score, 0) / item.review.review_ratings.length)
                            : 0
                          return (
                            <div key={i} className="flex gap-4 items-start style={{ background: 'var(--card-bg)' }} border style={{ borderColor: 'var(--border)' }} rounded-sm p-4 hover:style={{ borderColor: 'var(--input-border)' }} transition-colors">
                              <div className="text-2xl">⭐</div>
                              <div className="flex-1 min-w-0">
                                <p className="text-xs style={{ color: 'var(--text-muted)' }} mb-1">Rated a ride</p>
                                {item.review.items && (
                                  <Link href={`/parks/${item.review.items.park_id}/${item.review.items.category_id}/${item.review.items.id}`}
                                    className="text-sm font-semibold style={{ color: 'var(--accent)' }} hover:underline">
                                    {item.review.items.name}
                                  </Link>
                                )}
                                {item.review.title && (
                                  <p className="text-sm style={{ color: 'var(--text-primary)' }} mt-0.5">"{item.review.title}"</p>
                                )}
                                {item.review.body && (
                                  <p className="text-xs style={{ color: 'var(--text-secondary)' }} mt-1 line-clamp-2">{item.review.body}</p>
                                )}
                              </div>
                              <ScoreCircle score={avg} />
                            </div>
                          )
                        }
                        if (item.type === 'favorite') {
                          const favItem = item.favorite.items
                          if (!favItem) return null
                          const image = favItem.item_images?.[0]?.url
                          return (
                            <div key={i} className="flex gap-4 items-center style={{ background: 'var(--card-bg)' }} border style={{ borderColor: 'var(--border)' }} rounded-sm p-4 hover:style={{ borderColor: 'var(--input-border)' }} transition-colors">
                              <div className="text-2xl">❤️</div>
                              <div className="flex-1 min-w-0">
                                <p className="text-xs style={{ color: 'var(--text-muted)' }} mb-1">Added to favorites</p>
                                <Link href={`/parks/${favItem.park_id}/${favItem.category_id}/${favItem.id}`}
                                  className="text-sm font-semibold style={{ color: 'var(--accent)' }} hover:underline">
                                  {favItem.name}
                                </Link>
                              </div>
                              {image && (
                                <img src={image} alt={favItem.name}
                                  className="w-16 h-10 object-cover rounded-sm flex-shrink-0" />
                              )}
                            </div>
                          )
                        }

                        if (item.type === 'reaction') {
                          const reactionEmoji = item.reaction.type === 'yes' ? '👍' : item.reaction.type === 'no' ? '👎' : item.reaction.type === 'funny' ? '😄' : '🏆'
                          const reactionLabel = item.reaction.type === 'yes' ? 'Marked a review helpful' : item.reaction.type === 'no' ? 'Marked a review unhelpful' : item.reaction.type === 'funny' ? 'Found a review funny' : 'Awarded a review'
                          const itemData = item.reaction.reviews?.items
                          return (
                            <div key={i} className="flex gap-4 items-center style={{ background: 'var(--card-bg)' }} border style={{ borderColor: 'var(--border)' }} rounded-sm p-4 hover:style={{ borderColor: 'var(--input-border)' }} transition-colors">
                              <div className="text-2xl">{reactionEmoji}</div>
                              <div className="flex-1 min-w-0">
                                <p className="text-xs style={{ color: 'var(--text-muted)' }} mb-1">{reactionLabel}</p>
                                {itemData && (
                                  <Link href={`/parks/${itemData.park_id}/${itemData.category_id}/${itemData.id}`}
                                    className="text-sm font-semibold style={{ color: 'var(--accent)' }} hover:underline">
                                    {itemData.name}
                                  </Link>
                                )}
                              </div>
                            </div>
                          )
                        }
                        if (item.type === 'follow') {
                          const followed = item.follow.profiles
                          return (
                            <div key={i} className="flex gap-4 items-center style={{ background: 'var(--card-bg)' }} border style={{ borderColor: 'var(--border)' }} rounded-sm p-4 hover:style={{ borderColor: 'var(--input-border)' }} transition-colors">
                              <div className="text-2xl">🤝</div>
                              <div className="flex-1 min-w-0">
                                <p className="text-xs style={{ color: 'var(--text-muted)' }} mb-1">Started following</p>
                                {followed && (
                                  <Link href={`/users/${followed.id}`}
                                    className="text-sm font-semibold style={{ color: 'var(--accent)' }} hover:underline">
                                    {followed.username}
                                  </Link>
                                )}
                              </div>
                            </div>
                          )
                        }
                        return null
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Reviews Tab */}
            {activeTab === 'reviews' && (
              <div className="space-y-4">
                {reviews.length === 0 && <p className="style={{ color: 'var(--text-muted)' }} text-sm">No reviews yet.</p>}
                {reviews.map(review => {
                  const avg = review.review_ratings.length > 0
                    ? Math.round(review.review_ratings.reduce((s, r) => s + r.score, 0) / review.review_ratings.length)
                    : 0
                  return (
                    <div key={review.id} className="style={{ background: 'var(--card-bg)' }} border style={{ borderColor: 'var(--border)' }} rounded-sm p-4 flex gap-4 items-start hover:style={{ borderColor: 'var(--input-border)' }} transition-colors">
                      <ScoreCircle score={avg} />
                      <div className="flex-1 min-w-0">
                        {review.items && (
                          <Link href={`/parks/${review.items.park_id}/${review.items.category_id}/${review.items.id}`}
                            className="style={{ color: 'var(--accent)' }} hover:underline font-semibold text-sm">
                            {review.items.name}
                          </Link>
                        )}
                        {review.title && <p className="style={{ color: 'var(--text-primary)' }} text-sm font-medium mt-0.5">{review.title}</p>}
                        {review.body && <p className="text-sm style={{ color: 'var(--text-secondary)' }} leading-relaxed mt-1 line-clamp-3">{review.body}</p>}
                        <p className="text-xs text-[#4a6a82] mt-2">{new Date(review.created_at).toLocaleDateString()}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}

            {/* Favorites Tab */}
            {activeTab === 'favorites' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {favorites.length === 0 && <p className="style={{ color: 'var(--text-muted)' }} text-sm col-span-2">No favorites yet.</p>}
                {favorites.map(fav => {
                  const item = fav.items
                  if (!item) return null
                  const image = item.item_images?.[0]?.url
                  return (
                    <Link key={fav.id} href={`/parks/${item.park_id}/${item.category_id}/${item.id}`}
                      className="style={{ background: 'var(--card-bg)' }} border style={{ borderColor: 'var(--border)' }} rounded-sm overflow-hidden hover:border-[#66c0f4] transition-colors group">
                      {image && (
                        <div className="h-32 overflow-hidden">
                          <img src={image} alt={item.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                        </div>
                      )}
                      <div className="p-3">
                        <p className="text-sm font-semibold style={{ color: 'var(--text-primary)' }} group-hover:style={{ color: 'var(--accent)' }} transition-colors">{item.name}</p>
                        <p className="text-xs style={{ color: 'var(--text-muted)' }} mt-0.5 capitalize">{item.category_id?.replace(/-/g, ' ')}</p>
                      </div>
                    </Link>
                  )
                })}
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  )
}