import { getRandomGuessStatsItem } from '@/lib/queries'
import GuessStatsGameClient from './GuessStatsGameClient'

export const dynamic = 'force-dynamic'

export default async function GuessTheStatsPage() {
  const item = await getRandomGuessStatsItem()
  return <GuessStatsGameClient key={item?.id ?? 'none'} item={item} />
}