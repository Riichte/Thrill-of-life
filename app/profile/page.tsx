import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import {
  getProfileById,
  getProfileReviews,
  getProfileFavorites,
  getProfilePoints,
  getFollowerCount,
  getFollowingCount,
} from '@/lib/queries'
import ProfileClient from '@/components/ProfileClient'

export default async function ProfilePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/auth/login?redirect=/profile')

  const [profile, reviews, favorites, points, followerCount, followingCount] = await Promise.all([
    getProfileById(user.id),
    getProfileReviews(user.id),
    getProfileFavorites(user.id),
    getProfilePoints(user.id),
    getFollowerCount(user.id),
    getFollowingCount(user.id),
  ])

  return (
    <ProfileClient
      profile={profile}
      reviews={reviews}
      favorites={favorites}
      points={points}
      followerCount={followerCount}
      followingCount={followingCount}
      isOwnProfile={true}
    />
  )
}