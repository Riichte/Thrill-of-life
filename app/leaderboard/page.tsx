import { getLeaderboardMostHelpful, getLeaderboardMostAwarded } from '@/lib/queries'
import { LeaderboardClient } from './LeaderboardClient'

export const metadata = { title: 'Leaderboard — Thrill of Life' }

export const revalidate = 3600
export default async function LeaderboardPage() {
  const [helpful, awarded] = await Promise.all([
    getLeaderboardMostHelpful(25),
    getLeaderboardMostAwarded(25),
  ])

  return <LeaderboardClient helpful={helpful} awarded={awarded} />
}