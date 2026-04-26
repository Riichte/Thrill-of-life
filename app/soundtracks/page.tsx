import { createClient } from '@/lib/supabase/server'
import SoundtracksClient from './SoundtracksClient'

export default async function SoundtracksPage() {
    const supabase = await createClient()
    const { data: osts } = await supabase
        .from('osts')
        .select('*, items(id, name, park_id)')
        .order('created_at', { ascending: false })

    return <SoundtracksClient osts={osts ?? []} />
}