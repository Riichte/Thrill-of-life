'use client'

import { useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

interface Profile {
  id: string
  username: string | null
  avatar_url: string | null
  bio: string | null
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
}

function getScoreColor = (s: number) =>
  s >= 80 ? '#10b981' : s >= 60 ? '#f5f100' : s >= 40 ? '#f97316' : '#e80505fe'

function ScoreCircle({ score }: { score: number }) {
  return (
    <svg className="w-12 h-12 flex-shrink-0" viewBox="0 0 100 100">
      <circle cx="50" cy="50" r="45" fill="none" stroke="#2a475e" strokeWidth="2" />
      <circle cx="50" cy="50" r="45" fill="none" stroke={getScoreColor(score)} strokeWidth="2"
        strokeDasharray={`${(score / 100) * 282.7}`} strokeDashoffset="0" strokeLinecap="round"
        style={{ transform: 'rotate(-90deg)', transformOrigin: '50% 50%' }} />
      <text x="50" y="50" textAnchor="middle" dy="0.3em" fill="#c6d4df" fontWeight="bold" fontSize="28">
        {score}
      </text>
    </svg>
  )
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
}: ProfileClientProps) {
  const supabase = createClient()
  const [activeTab, setActiveTab] = useState<'reviews' | 'favorites'>('reviews')
  const [isFollowing, setIsFollowing] = useState(initialIsFollowing)
  const [followerCountState, setFollowerCountState] = useState(followerCount)
  const [isEditingBio, setIsEditingBio] = useState(false)
  const [bio, setBio] = useState(profile?.bio ?? '')
  const [bioInput, setBioInput] = useState(profile?.bio ?? '')
  const [username, setUsername] = useState(profile?.username ?? '')
  const [usernameInput, setUsernameInput] = useState(profile?.username ?? '')
  const [isEditingUsername, setIsEditingUsername] = useState(false)
  const [saving, setSaving] = useState(false)

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

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header Banner */}
      <div className="h-32 bg-gradient-to-r from-[#1b2838] via-[#2a475e] to-[#1b2838]" />

      <div className="container mx-auto px-4 max-w-5xl">
        {/* Profile Header */}
        <div className="relative -mt-12 mb-8 flex flex-col sm:flex-row items-start sm:items-end gap-4">
          {/* Avatar */}
          <div className="w-24 h-24 rounded-full bg-[#2a475e] border-4 border-gray-900 flex items-center justify-center text-4xl font-bold text-[#66c0f4] flex-shrink-0">
            {username?.[0]?.toUpperCase() ?? '?'}
          </div>

          <div className="flex-1 pb-2">
            {/* Username */}
            <div className="flex items-center gap-2 mb-1">
              {isEditingUsername ? (
                <div className="flex items-center gap-2">
                  <input
                    value={usernameInput}
                    onChange={e => setUsernameInput(e.target.value)}
                    className="bg-[#2a475e] border border-[#3d6a8a] rounded-sm px-3 py-1 text-lg font-bold text-[#c6d4df] focus:outline-none focus:border-[#66c0f4]"
                  />
                  <button onClick={handleSaveUsername} disabled={saving}
                    className="px-3 py-1 bg-[#4c6b22] hover:bg-[#5a7a28] text-white text-sm rounded-sm disabled:opacity-50">
                    {saving ? 'Saving...' : 'Save'}
                  </button>
                  <button onClick={() => setIsEditingUsername(false)}
                    className="px-3 py-1 text-[#8f98a0] hover:text-white text-sm">
                    Cancel
                  </button>
                </div>
              ) : (
                <>
                  <h1 className="text-2xl font-bold text-white">{username || 'Unknown'}</h1>
                  {isOwnProfile && (
                    <button onClick={() => setIsEditingUsername(true)}
                      className="text-xs text-[#8f98a0] hover:text-[#66c0f4] transition-colors">
                      ✏️ Edit
                    </button>
                  )}
                </>
              )}
            </div>

            <p className="text-sm text-[#8f98a0]">
              Member since {joinedYear} · {reviews.length} reviews · {favorites.length} favorites
            </p>
          </div>

          {/* Follow / Edit buttons */}
          <div className="flex gap-2 pb-2">
            {!isOwnProfile && viewerId && (
              <button
                onClick={handleFollow}
                className={`px-5 py-2 rounded-sm text-sm font-medium transition-colors ${
                  isFollowing
                    ? 'bg-[#2a475e] hover:bg-red-900/40 text-[#c6d4df] hover:text-red-400 border border-[#3d6a8a]'
                    : 'bg-[#4c6b22] hover:bg-[#5a7a28] text-white'
                }`}
              >
                {isFollowing ? 'Unfollow' : '+ Follow'}
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-4">

            {/* Stats */}
            <div className="bg-[#1b2838] border border-[#2a475e] rounded-sm p-4">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-[#8f98a0] mb-3">Stats</h3>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-[#8f98a0]">Points</span>
                  <span className="text-[#f59e0b] font-bold">🏅 {points}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[#8f98a0]">Reviews</span>
                  <span className="text-[#c6d4df] font-semibold">{reviews.length}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[#8f98a0]">Avg Score Given</span>
                  <span className="text-[#c6d4df] font-semibold">{avgScore ?? '—'}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[#8f98a0]">Favorites</span>
                  <span className="text-[#c6d4df] font-semibold">{favorites.length}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[#8f98a0]">Followers</span>
                  <span className="text-[#c6d4df] font-semibold">{followerCountState}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[#8f98a0]">Following</span>
                  <span className="text-[#c6d4df] font-semibold">{followingCount}</span>
                </div>
              </div>
            </div>

            {/* Bio */}
            <div className="bg-[#1b2838] border border-[#2a475e] rounded-sm p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-[#8f98a0]">Bio</h3>
                {isOwnProfile && !isEditingBio && (
                  <button onClick={() => setIsEditingBio(true)}
                    className="text-xs text-[#8f98a0] hover:text-[#66c0f4] transition-colors">
                    ✏️ Edit
                  </button>
                )}
              </div>
              {isEditingBio ? (
                <div className="space-y-2">
                  <textarea
                    value={bioInput}
                    onChange={e => setBioInput(e.target.value)}
                    rows={4}
                    placeholder="Tell the community about yourself..."
                    className="w-full bg-[#2a475e] border border-[#3d6a8a] rounded-sm px-3 py-2 text-sm text-[#c6d4df] placeholder-[#6a8a9a] focus:outline-none focus:border-[#66c0f4] resize-none"
                  />
                  <div className="flex gap-2">
                    <button onClick={handleSaveBio} disabled={saving}
                      className="px-3 py-1 bg-[#4c6b22] hover:bg-[#5a7a28] text-white text-xs rounded-sm disabled:opacity-50">
                      {saving ? 'Saving...' : 'Save'}
                    </button>
                    <button onClick={() => { setIsEditingBio(false); setBioInput(bio) }}
                      className="px-3 py-1 text-[#8f98a0] hover:text-white text-xs">
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-[#acb2b8] leading-relaxed">
                  {bio || <span className="text-[#4a6a82] italic">{isOwnProfile ? 'Add a bio...' : 'No bio yet.'}</span>}
                </p>
              )}
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Tabs */}
            <div className="flex gap-0 mb-6 border-b border-[#2a475e]">
              {(['reviews', 'favorites'] as const).map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-6 py-3 text-sm font-medium capitalize transition-colors ${
                    activeTab === tab
                      ? 'text-[#66c0f4] border-b-2 border-[#66c0f4]'
                      : 'text-[#8f98a0] hover:text-[#c6d4df]'
                  }`}
                >
                  {tab} ({tab === 'reviews' ? reviews.length : favorites.length})
                </button>
              ))}
            </div>

            {/* Reviews Tab */}
            {activeTab === 'reviews' && (
              <div className="space-y-4">
                {reviews.length === 0 && (
                  <p className="text-[#8f98a0] text-sm">No reviews yet.</p>
                )}
                {reviews.map(review => {
                  const avg = review.review_ratings.length > 0
                    ? Math.round(review.review_ratings.reduce((s, r) => s + r.score, 0) / review.review_ratings.length)
                    : 0
                  return (
                    <div key={review.id} className="bg-[#1b2838] border border-[#2a475e] rounded-sm p-4 flex gap-4 items-start">
                      <ScoreCircle score={avg} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <div>
                            {review.items && (
                              <Link
                                href={`/parks/${review.items.park_id}/${review.items.category_id}/${review.items.id}`}
                                className="text-[#66c0f4] hover:underline font-semibold text-sm"
                              >
                                {review.items.name}
                              </Link>
                            )}
                            {review.title && (
                              <p className="text-[#c6d4df] text-sm font-medium mt-0.5">{review.title}</p>
                            )}
                          </div>
                          <span className="text-xs text-[#8f98a0] whitespace-nowrap">
                            {new Date(review.created_at).toLocaleDateString()}
                          </span>
                        </div>
                        {review.body && (
                          <p className="text-sm text-[#acb2b8] leading-relaxed line-clamp-3">{review.body}</p>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}

            {/* Favorites Tab */}
            {activeTab === 'favorites' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {favorites.length === 0 && (
                  <p className="text-[#8f98a0] text-sm col-span-2">No favorites yet.</p>
                )}
                {favorites.map(fav => {
                  const item = fav.items
                  if (!item) return null
                  const image = item.item_images?.[0]?.url
                  return (
                    <Link
                      key={fav.id}
                      href={`/parks/${item.park_id}/${item.category_id}/${item.id}`}
                      className="bg-[#1b2838] border border-[#2a475e] rounded-sm overflow-hidden hover:border-[#66c0f4] transition-colors group"
                    >
                      {image && (
                        <div className="h-32 overflow-hidden">
                          <img src={image} alt={item.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                        </div>
                      )}
                      <div className="p-3">
                        <p className="text-sm font-semibold text-[#c6d4df] group-hover:text-[#66c0f4] transition-colors">{item.name}</p>
                        <p className="text-xs text-[#8f98a0] mt-0.5 capitalize">{item.category_id?.replace('_', ' ')}</p>
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