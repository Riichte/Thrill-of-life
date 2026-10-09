import { getStatGraphs, getStatItems } from '@/lib/queries'
import { computeGraph, StatGraph, SPEC_FIELDS } from '@/lib/statsCompute'
import StatChart from '@/components/StatChart'

export const revalidate = 3600
export const metadata = {
  title: 'Stats for Nerd',
  description: 'Graphs and statistics computed from the Thrill of Life database.',
}

export default async function StatsPage() {
  const graphs = (await getStatGraphs()) as StatGraph[]
  const categoryIds = [...new Set(graphs.map(g => g.category_id))]
  const itemsByCategory: Record<string, { id: string; category_id: string; specs: any }[]> = {}
  await Promise.all(categoryIds.map(async id => { itemsByCategory[id] = await getStatItems(id) }))

  const label = (key: string) => SPEC_FIELDS.find(f => f.key === key)?.label ?? key

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-tertiary)', color: 'var(--text-primary)' }}>
      <div className="container mx-auto px-4 py-10">
        <h1 className="text-4xl font-bold mb-2">Stats for Nerd</h1>
        <p className="mb-10" style={{ color: 'var(--text-muted)' }}>Graphs computed from the database.</p>

        {graphs.length === 0 && <p style={{ color: 'var(--text-muted)' }}>No graphs yet.</p>}

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {graphs.map(g => {
            const { points, itemCount } = computeGraph(g, itemsByCategory[g.category_id] ?? [])
            return (
              <div key={g.id} className="rounded-sm p-6" style={{ background: 'var(--card-bg)', border: '1px solid var(--border)' }}>
                <h2 className="text-xl font-semibold mb-1">{g.title}</h2>
                {g.description && <p className="text-sm mb-4" style={{ color: 'var(--text-muted)' }}>{g.description}</p>}
                <StatChart points={points} type={g.chart_type} yLabel={g.y_label} xLabel={label(g.group_field)} />
                <p className="text-xs mt-3" style={{ color: 'var(--text-faint)' }}>
                  {itemCount} items counted
                  {g.exclude_models.length > 0 && ` · excluded models: ${g.exclude_models.join(', ')}`}
                  {g.exclude_types.length > 0 && ` · excluded types: ${g.exclude_types.join(', ')}`}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}