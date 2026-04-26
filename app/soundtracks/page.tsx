import { createClient } from '@/lib/supabase/server'
import SoundtracksClient from './SoundtracksClient'

export default async function SoundtracksPage() {
    const supabase = await createClient()

    const { data: categories } = await supabase.from('categories').select('id, name').order('name')
    const { data: osts } = await supabase.from('osts').select('items(category_id)')

    const ostsByCategory: Record<string, number> = {}
    osts?.forEach(o => {
        const catId = (o.items as any)?.category_id
        if (catId) ostsByCategory[catId] = (ostsByCategory[catId] || 0) + 1
    })

    return <SoundtracksClient categories={categories ?? []} ostsByCategory={ostsByCategory} />
}