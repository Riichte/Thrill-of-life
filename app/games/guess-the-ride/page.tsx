import { getRandomGuessItem } from '@/lib/queries'
import GuessGameClient from './GuessGameClient'

export const dynamic = 'force-dynamic'

export default async function GuessTheRidePage() {
  const item = await getRandomGuessItem()
  return <GuessGameClient key={item?.id ?? 'none'} item={item} />
}