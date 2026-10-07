import { createClient } from '@/lib/supabase/server'
import { HomeMarqueeRow } from '@/components/HomeMarqueeRow'
export const dynamic = 'force-dynamic'

export default async function SoundtracksPage() {
    const shuffle = <T,>(arr: T[]) => [...arr].sort(() => Math.random() - 0.5)
    const supabase = await createClient()

    const { data: osts } = await supabase
        .from('osts')
        .select('item_id, items(id, name, park_id, category_id, item_images(url, sort_order))')

    const itemMap = new Map<string, { id: string; name: string; park_id: string; category_id: string; image: string | null; tracks: number }>()
    osts?.forEach(o => {
        const it = o.items as any
        if (!it) return
        const existing = itemMap.get(it.id)
        if (existing) { existing.tracks++; return }
        const img = (it.item_images as any[] | null)?.find(i => i.sort_order !== -1)
        itemMap.set(it.id, {
            id: it.id,
            name: it.name,
            park_id: it.park_id,
            category_id: it.category_id,
            image: img?.url ?? null,
            tracks: 1,
        })
    })
    const allItems = [...itemMap.values()]

    const parkIds = [...new Set(allItems.map(i => i.park_id))]
    const { data: parks } = await supabase
        .from('parks')
        .select('id, name, country, cover_image_url')
        .in('id', parkIds)

    const parkCards = shuffle(parks ?? [])
        .filter(p => !!p.cover_image_url)
        .map(p => ({
            id: p.id,
            href: `/soundtracks/parks/${p.id}`,
            image: p.cover_image_url,
            title: p.name,
            subtitle: p.country,
        }))

    const itemCards = (categoryId: string) =>
        shuffle(allItems.filter(i => i.category_id === categoryId && i.image))
            .map(i => ({
                id: i.id,
                href: `/parks/${i.park_id}/${i.category_id}/${i.id}/osts`,
                image: i.image as string,
                title: i.name,
                subtitle: `${i.tracks} track${i.tracks !== 1 ? 's' : ''}`,
            }))

    return (
        <div className="min-h-screen" style={{ background: 'var(--bg-tertiary)', color: 'var(--text-primary)' }}>
            <div className="container mx-auto px-4 py-10 md:py-14">

                <HomeMarqueeRow
                    title="Parks"
                    items={parkCards}
                    durationSec={130}
                    viewAllHref="/soundtracks/parks"
                    viewAllLabel="All parks"
                />

                <HomeMarqueeRow
                    title="Roller coasters"
                    items={itemCards('roller-coasters')}
                    durationSec={150}
                    viewAllHref="/soundtracks/roller-coasters"
                    viewAllLabel="All roller coasters"
                />

                <HomeMarqueeRow
                    title="Water rides"
                    items={itemCards('water-rides')}
                    durationSec={85}
                    viewAllHref="/soundtracks/water-rides"
                    viewAllLabel="All water rides"
                />

                <HomeMarqueeRow
                    title="Dark rides"
                    items={itemCards('dark-rides')}
                    durationSec={100}
                    viewAllHref="/soundtracks/dark-rides"
                    viewAllLabel="All dark rides"
                />

                <HomeMarqueeRow
                    title="Flat rides"
                    items={itemCards('flat-rides')}
                    durationSec={110}
                    viewAllHref="/soundtracks/flat-rides"
                    viewAllLabel="All flat rides"
                />

            </div>
        </div>
    )
}