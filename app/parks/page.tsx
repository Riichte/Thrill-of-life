import { createClient } from '@/lib/supabase/server'
import ParksClient from './ParksClient'

export const revalidate = 3600
export default async function ParksPage() {
  const supabase = await createClient()
  const { data: parks } = await supabase.from('parks').select('*').order('name')
  return <ParksClient parks={parks ?? []} />
}