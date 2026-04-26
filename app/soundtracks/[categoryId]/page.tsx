import { notFound } from 'next/navigation'
import { getCategoryById } from '@/lib/queries'
import { createClient } from '@/lib/supabase/server'
import SoundtracksCategoryClient from './SoundtracksCategoryClient'

export default async function SoundtracksCategoryPage({ params }: { params: Promise<{ categoryId: string }> }) {
    const { categoryId } = await params
    const category = await getCategoryById(categoryId)
    if (!category) notFound()

    const supabase = await createClient()

    const { data: parks } = await supabase.from('parks').select('id, name').order('name')

    const { data: items } = await supabase
        .from('items')
        .select('id, name, park_id')
        .eq('category_id', categoryId)

    const { data: osts } = await supabase
        .from('osts')
        .select('item_id')
        .in('item_id', items?.map(i => i.id) ?? [])

    const itemsWithOsts = items?.filter(i => osts?.some(o => o.item_id === i.id)) ?? []

    return <SoundtracksCategoryClient category={category} parks={parks ?? []} items={itemsWithOsts} />
}