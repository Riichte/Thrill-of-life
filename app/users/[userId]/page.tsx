import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import {
  getProfileById,
  getProfileReviews,
  getProfileFavorites,
  getProfilePoints,
  getFollowerCount,
  getFollowingCount,
  getIsFollowing,
  getProfileReactions,
  getProfileFollows,
} from '@/lib/queries'
import ProfileClient from '@/components/ProfileClient'

export default async function PublicProfilePage({ params }: { params: Promise<{ userId: string }> }) {
  const { userId } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const [profile, reviews, favorites, points, followerCount, followingCount, profileReactions, follows] = await Promise.all([
    getProfileById(userId),
    getProfileReviews(userId),
    getProfileFavorites(userId),
    getProfilePoints(userId),
    getFollowerCount(userId),
    getFollowingCount(userId),
    getProfileReactions(userId),
    getProfileFollows(userId),
  ])

  if (!profile) notFound()

  const isFollowing = user ? await getIsFollowing(user.id, userId) : false

  return (
    <ProfileClient
      profile={profile}
      reviews={reviews}
      favorites={favorites}
      points={points}
      followerCount={followerCount}
      followingCount={followingCount}
      isOwnProfile={user?.id === userId}
      viewerId={user?.id}
      isFollowing={isFollowing}
      reactions={profileReactions}
      follows={follows}
    />
  )
}