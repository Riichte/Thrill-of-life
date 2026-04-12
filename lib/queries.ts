import { createClient } from '@/lib/supabase/client'

function getSupabase() {
  return createClient()
}

// ─── Parks ───────────────────────────────────────────────

export async function getAllParks() {
  const supabase = getSupabase()
  const { data, error } = await supabase
    .from('parks')
    .select('*')
    .order('name')
  if (error) throw error
  return data ?? []
}

export async function getParkById(parkId: string) {
  const supabase = getSupabase()
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
  const supabase = getSupabase()
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('name')
  if (error) throw error
  return data ?? []
}

export async function getCategoryById(categoryId: string) {
  const supabase = getSupabase()
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
  const supabase = getSupabase()
  const { data, error } = await supabase
    .from('items')
    .select('*')
    .eq('park_id', parkId)
    .order('name')
  if (error) throw error
  return data ?? []
}

export async function getItemById(parkId: string, itemId: string) {
  const supabase = getSupabase()
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
  const supabase = getSupabase()
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

export async function getItemImages(itemId: string): Promise<string[]> {
  const supabase = getSupabase()
  const { data, error } = await supabase
    .from('item_images')
    .select('url')
    .eq('item_id', itemId)
    .order('sort_order')
  if (error) return []
  return data.map(row => row.url)
}

export async function getItemVideos(itemId: string): Promise<string[]> {
  // Videos still from mock for now — wire to Supabase later
  const { mockItemVideos } = await import('@/lib/items-data')
  return mockItemVideos[itemId as keyof typeof mockItemVideos] ?? []
}

// ─── Similar rides ───────────────────────────────────────

export async function getSimilarRides(itemId: string, type: string, limit = 6) {
  const supabase = getSupabase()
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