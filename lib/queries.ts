import { createClient } from '@/lib/supabase/server'

// ─── Parks ───────────────────────────────────────────────

export async function getAllParks() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('parks')
    .select('*')
    .order('name')
  if (error) throw error
  return data ?? []
}

export async function getParkById(parkId: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('parks')
    .select('*')
    .eq('id', parkId)
    .single()
  if (error) return null
  return data
}

// ─── Categories ──────────────────────────────────────────

export async function getAllCategories() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('name')
  if (error) throw error
  return data ?? []
}

export async function getCategoryById(categoryId: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('id', categoryId)
    .single()
  if (error) return null
  return data
}

// ─── Items ───────────────────────────────────────────────

export async function getItemsByPark(parkId: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('items')
    .select('*')
    .eq('park_id', parkId)
    .order('name')
  if (error) throw error
  return data ?? []
}

export async function getItemById(parkId: string, itemId: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('items')
    .select('*')
    .eq('id', itemId)
    .eq('park_id', parkId)
    .single()
  if (error) return null
  return data
}

export async function getItemsByCategory(parkId: string, categoryId: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('items')
    .select('*')
    .eq('park_id', parkId)
    .eq('category_id', categoryId)
    .order('name')
  if (error) throw error
  return data ?? []
}

// ─── Media ───────────────────────────────────────────────

export async function getItemImages(itemId: string): Promise<{ url: string; attribution_author?: string; attribution_url?: string; license?: string }[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('item_images')
    .select('url, attribution_author, attribution_url, license')
    .eq('item_id', itemId)
    .order('sort_order')
  if (error) return []
  return data ?? []
}

export async function getItemVideos(itemId: string): Promise<string[]> {
  const { mockItemVideos } = await import('@/lib/items-data')
  return mockItemVideos[itemId as keyof typeof mockItemVideos] ?? []
}

// ─── Similar rides ───────────────────────────────────────

export async function getSimilarRides(itemId: string, type: string, limit = 6) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('items')
    .select('*, item_images(url)')
    .neq('id', itemId)
    .filter('specs->>type', 'eq', type)
    .limit(limit)
  if (error) return []

  return data.map(item => ({
    ...item,
    parkId: item.park_id,
    image: item.item_images?.[0]?.url ?? null
  }))
}

// ─── Profiles ────────────────────────────────────────────

export async function getProfileById(userId: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()
  if (error) return null
  return data
}

export async function getProfileReviews(userId: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('reviews')
    .select('*, review_ratings(*), items(id, name, park_id, category_id)')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
  if (error) return []
  return data ?? []
}

export async function getProfileFavorites(userId: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('favorites')
    .select('*, items(id, name, park_id, category_id, specs, item_images(url))')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
  if (error) return []
  return data ?? []
}

export async function getProfilePoints(userId: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('user_points')
    .select('points')
    .eq('user_id', userId)
    .single()
  if (error) return 0
  return data?.points ?? 0
}

export async function getFollowerCount(userId: string) {
  const supabase = await createClient()
  const { count } = await supabase
    .from('followers')
    .select('*', { count: 'exact', head: true })
    .eq('following_id', userId)
  return count ?? 0
}

export async function getFollowingCount(userId: string) {
  const supabase = await createClient()
  const { count } = await supabase
    .from('followers')
    .select('*', { count: 'exact', head: true })
    .eq('follower_id', userId)
  return count ?? 0
}

export async function getIsFollowing(followerId: string, followingId: string) {
  const supabase = await createClient()
  const { data } = await supabase
    .from('followers')
    .select('follower_id')
    .eq('follower_id', followerId)
    .eq('following_id', followingId)
    .single()
  return !!data
}

// ─── Park Images ─────────────────────────────────────────

export async function getParkImages(parkId: string): Promise<{ url: string; attribution_author?: string; attribution_url?: string; license?: string }[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('park_images')
    .select('url, attribution_author, attribution_url, license')
    .eq('park_id', parkId)
    .order('sort_order')
  if (error) return []
  return data ?? []
}

// ─── Search ──────────────────────────────────────────────

export async function searchAll(query: string) {
  const supabase = await createClient()
  const q = `%${query}%`

  const [{ data: parks }, { data: items }] = await Promise.all([
    supabase
      .from('parks')
      .select('id, name, description, country, cover_image_url, logo_url')
      .or(`name.ilike.${q},description.ilike.${q},country.ilike.${q}`)
      .limit(5),
    supabase
      .from('items')
      .select('id, name, description, category_id, park_id, item_images(url)')
      .or(`name.ilike.${q},description.ilike.${q}`)
      .limit(20),
  ])

  return {
    parks: parks ?? [],
    items: items ?? [],
  }
}

// ─── Reviews ─────────────────────────────────────────────

export async function getItemReviews(itemId: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('reviews')
    .select('*, review_ratings(*)')
    .eq('item_id', itemId)
    .order('created_at', { ascending: false })
  if (error) {
    console.error('getItemReviews error:', error)
    return []
  }

  // Fetch usernames separately
  const userIds = [...new Set((data ?? []).map(r => r.user_id))]
  const { data: profiles } = await supabase
    .from('profiles')
    .select('id, username')
    .in('id', userIds)

  const profileMap = Object.fromEntries((profiles ?? []).map(p => [p.id, p.username]))

  return (data ?? []).map(r => ({
    ...r,
    profiles: { username: profileMap[r.user_id] ?? 'Anonymous' }
  }))
}

export async function getItemCommunityScore(itemId: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('review_ratings')
    .select('score, reviews!inner(item_id)')
    .eq('reviews.item_id', itemId)
  if (error || !data || data.length === 0) return null

  const avg = Math.round(data.reduce((sum, r) => sum + r.score, 0) / data.length)

  const reviews = await supabase
    .from('reviews')
    .select('id, review_ratings(score)')
    .eq('item_id', itemId)

  if (!reviews.data) return { score: avg, positive: 0, mixed: 0, negative: 0 }

  let positive = 0, mixed = 0, negative = 0
  reviews.data.forEach(review => {
    const scores = review.review_ratings as { score: number }[]
    if (!scores?.length) return
    const reviewAvg = scores.reduce((s, r) => s + r.score, 0) / scores.length
    if (reviewAvg >= 75) positive++
    else if (reviewAvg >= 50) mixed++
    else negative++
  })

  const total = positive + mixed + negative
  return {
    score: avg,
    positive: total ? Math.round((positive / total) * 100) : 0,
    mixed: total ? Math.round((mixed / total) * 100) : 0,
    negative: total ? Math.round((negative / total) * 100) : 0,
  }
}

// ─── Items by category across all parks ──────────────────

export async function getItemsByGlobalCategory(categoryId: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('items')
    .select('*, parks(name), item_images(url)')
    .eq('category_id', categoryId)
    .order('name')
  if (error) return []
  return data ?? []
}

// ─── Park Reviews ─────────────────────────────────────────

export async function getParkReviews(parkId: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('reviews')
    .select('*, review_ratings(*)')
    .eq('item_id', parkId)
    .order('created_at', { ascending: false })
  if (error) return []

  const userIds = [...new Set((data ?? []).map(r => r.user_id))]
  const { data: profiles } = await supabase
    .from('profiles')
    .select('id, username')
    .in('id', userIds)

  const profileMap = Object.fromEntries((profiles ?? []).map(p => [p.id, p.username]))

  return (data ?? []).map(r => ({
    ...r,
    profiles: { username: profileMap[r.user_id] ?? 'Anonymous' }
  }))
}

export async function getParkCommunityScore(parkId: string) {
  const supabase = await createClient()
  const { data: reviews } = await supabase
    .from('reviews')
    .select('id, review_ratings(score)')
    .eq('item_id', parkId)

  if (!reviews || reviews.length === 0) return null

  let positive = 0, mixed = 0, negative = 0
  let totalScore = 0
  let totalRatings = 0

  reviews.forEach(review => {
    const scores = review.review_ratings as { score: number }[]
    if (!scores?.length) return
    const avg = scores.reduce((s, r) => s + r.score, 0) / scores.length
    totalScore += avg
    totalRatings++
    if (avg >= 75) positive++
    else if (avg >= 50) mixed++
    else negative++
  })

  const total = positive + mixed + negative
  return {
    score: Math.round(totalScore / totalRatings),
    positive: total ? Math.round((positive / total) * 100) : 0,
    mixed: total ? Math.round((mixed / total) * 100) : 0,
    negative: total ? Math.round((negative / total) * 100) : 0,
  }
}

// ─── Recent Reviews ───────────────────────────────────────

export async function getRecentReviews(limit = 10) {
  const supabase = await createClient()

  const { data: reviews, error } = await supabase
    .from('reviews')
    .select('id, user_id, item_id, created_at, review_ratings(score)')
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error || !reviews?.length) return []

  // Collect unique user_ids and item_ids
  const userIds = [...new Set(reviews.map(r => r.user_id))]
  const itemIds = [...new Set(reviews.map(r => r.item_id))]

  const [{ data: profiles }, { data: items }] = await Promise.all([
    supabase.from('profiles').select('id, username').in('id', userIds),
    supabase
      .from('items')
      .select('id, name, park_id, parks(name)')
      .in('id', itemIds),
  ])

  const profileMap = Object.fromEntries((profiles ?? []).map(p => [p.id, p.username]))
  const itemMap = Object.fromEntries((items ?? []).map(i => [i.id, i]))

  return reviews.map(r => {
    const scores = (r.review_ratings as { score: number }[]) ?? []
    const avg = scores.length
      ? Math.round(scores.reduce((s, x) => s + x.score, 0) / scores.length)
      : null
    const item = itemMap[r.item_id]
    return {
      id: r.id,
      username: profileMap[r.user_id] ?? 'Anonymous',
      userId: r.user_id,
      itemId: r.item_id,
      itemName: item?.name ?? 'Unknown',
      parkId: item?.park_id ?? '',
      parkName: (item?.parks as { name: string } | null)?.name ?? '',
      score: avg,
      createdAt: r.created_at,
    }
  })
}


// ─── Leaderboard ─────────────────────────────────────────

export async function getLeaderboardMostHelpful(limit = 25) {
  const supabase = await createClient()

  // Get all 'yes' reactions with the review's author
  const { data, error } = await supabase
    .from('reactions')
    .select('review_id, reviews!inner(user_id)')
    .eq('type', 'yes')

  if (error || !data?.length) return []

  // Count yes reactions per user
  const counts: Record<string, number> = {}
  for (const row of data) {
    const userId = (row.reviews as unknown as { user_id: string }).user_id
    counts[userId] = (counts[userId] ?? 0) + 1
  }

  const topUserIds = Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([id]) => id)

  const { data: profiles } = await supabase
    .from('profiles')
    .select('id, username')
    .in('id', topUserIds)

  const profileMap = Object.fromEntries((profiles ?? []).map(p => [p.id, p.username]))

  return topUserIds.map((id, i) => ({
    rank: i + 1,
    userId: id,
    username: profileMap[id] ?? 'Anonymous',
    score: counts[id],
  }))
}

export async function getLeaderboardMostAwarded(limit = 25) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('reactions')
    .select('review_id, reviews!inner(user_id)')
    .eq('type', 'award')

  if (error || !data?.length) return []

  const counts: Record<string, number> = {}
  for (const row of data) {
    const userId = (row.reviews as unknown as { user_id: string }).user_id
    counts[userId] = (counts[userId] ?? 0) + 1
  }

  const topUserIds = Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([id]) => id)

  const { data: profiles } = await supabase
    .from('profiles')
    .select('id, username')
    .in('id', topUserIds)

  const profileMap = Object.fromEntries((profiles ?? []).map(p => [p.id, p.username]))

  return topUserIds.map((id, i) => ({
    rank: i + 1,
    userId: id,
    username: profileMap[id] ?? 'Anonymous',
    score: counts[id],
  }))
}