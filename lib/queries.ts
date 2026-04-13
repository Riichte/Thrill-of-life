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

export async function getParkImages(parkId: string): Promise<string[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('park_images')
    .select('url')
    .eq('park_id', parkId)
    .order('sort_order')
  if (error) return []
  return data.map(row => row.url)
}