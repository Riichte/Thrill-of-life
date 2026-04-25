import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import ManufacturerPageClient from './ManufacturerPageClient'

export default async function ManufacturerPage({ params }: { params: Promise<{ manufacturerSlug: string }> }) {
  const { manufacturerSlug } = await params
  const supabase = await createClient()

  const { data: items } = await supabase
    .from('items')
    .select('*, item_images(url), parks(name)')

  // Find manufacturer name from slug
  const allManufacturers = [...new Set((items ?? []).map(i => i.specs?.manufacturer).filter(Boolean))]
  const manufacturerName = allManufacturers.find(
    m => m.toLowerCase().replace(/\s+/g, '-') === manufacturerSlug
  )
  if (!manufacturerName) notFound()

  const manufacturerItems = (items ?? [])
    .filter(i => i.specs?.manufacturer === manufacturerName)

  // Get community scores for each item
  const itemIds = manufacturerItems.map(i => i.id)
  const { data: ratings } = await supabase
    .from('review_ratings')
    .select('score, reviews!inner(item_id)')
    .in('reviews.item_id', itemIds)

  // Compute avg score per item
  const scoreMap: Record<string, number[]> = {}
  for (const r of ratings ?? []) {
    const id = (r.reviews as any).item_id
    if (!scoreMap[id]) scoreMap[id] = []
    scoreMap[id].push(r.score)
  }
  const avgScore = (id: string) => {
    const scores = scoreMap[id]
    if (!scores?.length) return null
    return Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
  }

  const ridesWithScores = manufacturerItems.map(item => ({
    ...item,
    parkName: (item.parks as any)?.name ?? '',
    image: (item.item_images as any)?.[0]?.url ?? null,
    avgScore: avgScore(item.id),
  }))

  const top20 = [...ridesWithScores]
    .filter(r => r.avgScore !== null)
    .sort((a, b) => (b.avgScore ?? 0) - (a.avgScore ?? 0))
    .slice(0, 20)

  // Get manufacturer-level reviews
  const { data: reviews } = await supabase
    .from('reviews')
    .select('*, review_ratings(*)')
    .eq('item_id', manufacturerSlug)
    .order('created_at', { ascending: false })

  const userIds = [...new Set((reviews ?? []).map(r => r.user_id))]
  const { data: profiles } = await supabase.from('profiles').select('id, username').in('id', userIds.length ? userIds : ['none'])
  const profileMap = Object.fromEntries((profiles ?? []).map(p => [p.id, p.username]))
  const reviewsWithProfiles = (reviews ?? []).map(r => ({ ...r, profiles: { username: profileMap[r.user_id] ?? 'Anonymous' } }))

  const communityScore = reviews?.length ? (() => {
    const allScores = reviews.flatMap(r => (r.review_ratings as any[]).map((rr: any) => rr.score))
    return allScores.length ? Math.round(allScores.reduce((a: number, b: number) => a + b, 0) / allScores.length) : null
  })() : null

  return (
    <ManufacturerPageClient
      manufacturerName={manufacturerName}
      manufacturerSlug={manufacturerSlug}
      top20={top20}
      allRides={ridesWithScores}
      reviews={reviewsWithProfiles}
      communityScore={communityScore}
    />
  )
}