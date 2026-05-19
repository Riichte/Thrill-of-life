import { notFound } from 'next/navigation'
import { getParkById, getCategoryById, getItemById } from '@/lib/queries'
import OstPageClient from './OstPageClient'
import { createClient } from '@/lib/supabase/server'

interface OstPageProps {
    params: Promise<{
        parkId: string
        itemId: string
    }>
}

export default async function OstPage({ params }: OstPageProps) {
    const { parkId, itemId } = await params
    const supabase = await createClient()

    const park = await getParkById(parkId)
    const item = await getItemById(parkId, itemId)
    const category = item ? await getCategoryById(item.category_id) : null

    if (!park || !item || !category) notFound()

    const { data: osts } = await supabase
        .from('osts')
        .select('*')
        .eq('item_id', itemId)
        .order('created_at')

    return (
        <OstPageClient
            park={park}
            item={item}
            category={category}
            osts={osts ?? []}
        />
    )
}