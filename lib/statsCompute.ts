export type StatGraph = {
  id: string
  title: string
  description: string | null
  category_id: string
  group_field: string
  value_field: string
  aggregation: 'avg' | 'min' | 'max' | 'sum' | 'count' | 'median'
  exclude_models: string[]
  exclude_types: string[]
  min_group_size: number
  min_year: number | null
  min_height: number | null
  min_speed: number | null
  compare_models: string[]
  chart_type: 'line' | 'bar'
  y_label: string | null
  published: boolean
  sort_order: number
}

export type StatPoint = { x: number; y: number; n: number }

export const SPEC_FIELDS = [
  { key: 'year_opened', label: 'Year Opened' },
  { key: 'height', label: 'Height' },
  { key: 'drop', label: 'Drop' },
  { key: 'speed', label: 'Speed' },
  { key: 'length', label: 'Length' },
  { key: 'inversions', label: 'Inversions' },
  { key: 'min_height', label: 'Min Height' },
]

export const AGGREGATIONS = [
  { key: 'avg', label: 'Average' },
  { key: 'median', label: 'Median' },
  { key: 'min', label: 'Minimum' },
  { key: 'max', label: 'Maximum' },
  { key: 'sum', label: 'Sum' },
  { key: 'count', label: 'Count' },
]

const num = (v: any): number | null => {
  if (v === null || v === undefined || v === '') return null
  const n = Number(v)
  return Number.isFinite(n) ? n : null
}

const norm = (s: any) => String(s ?? '').trim().toLowerCase()

export type StatSeries = { name: string; points: StatPoint[] }

type Row = { x: number; v: number; model: string }

function aggregate(agg: StatGraph['aggregation'], rows: Row[], minSize: number): StatPoint[] {
  const groups = new Map<number, number[]>()
  for (const r of rows) {
    if (!groups.has(r.x)) groups.set(r.x, [])
    groups.get(r.x)!.push(r.v)
  }
  const points: StatPoint[] = []
  for (const [x, vals] of groups) {
    if (vals.length < minSize) continue
    let y = 0
    switch (agg) {
      case 'avg': y = vals.reduce((a, b) => a + b, 0) / vals.length; break
      case 'sum': y = vals.reduce((a, b) => a + b, 0); break
      case 'min': y = Math.min(...vals); break
      case 'max': y = Math.max(...vals); break
      case 'count': y = vals.length; break
      case 'median': {
        const s = [...vals].sort((a, b) => a - b)
        const m = Math.floor(s.length / 2)
        y = s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2
        break
      }
    }
    points.push({ x, y: Math.round(y * 100) / 100, n: vals.length })
  }
  return points.sort((a, b) => a.x - b.x)
}

export function computeGraph(
  graph: Pick<StatGraph, 'category_id' | 'group_field' | 'value_field' | 'aggregation' | 'exclude_models' | 'exclude_types' | 'min_group_size' | 'min_year' | 'min_height' | 'min_speed' | 'compare_models'>,
  items: { category_id: string; specs: any }[]
): { series: StatSeries[]; itemCount: number } {
  const exModels = new Set(graph.exclude_models.map(norm))
  const exTypes = new Set(graph.exclude_types.map(norm))
  const rows: Row[] = []

  for (const item of items) {
    if (item.category_id !== graph.category_id) continue
    const specs = item.specs || {}
    if (specs.model && exModels.has(norm(specs.model))) continue
    if (specs.type && exTypes.has(norm(specs.type))) continue
    if (graph.min_year != null && !((num(specs.year_opened) ?? -Infinity) >= graph.min_year)) continue
    if (graph.min_height != null && !((num(specs.height) ?? -Infinity) >= graph.min_height)) continue
    if (graph.min_speed != null && !((num(specs.speed) ?? -Infinity) >= graph.min_speed)) continue
    const x = num(specs[graph.group_field])
    if (x === null) continue
    let v: number | null
    if (graph.aggregation === 'count') v = 1
    else {
      v = num(specs[graph.value_field])
      if (v === null) continue
    }
    rows.push({ x, v, model: norm(specs.model) })
  }

  const compare = graph.compare_models ?? []
  const series: StatSeries[] = [{
    name: compare.length ? 'All' : 'Value',
    points: aggregate(graph.aggregation, rows, graph.min_group_size || 1),
  }]
  for (const m of compare) {
    series.push({ name: m, points: aggregate(graph.aggregation, rows.filter(r => r.model === norm(m)), 1) })
  }
  return { series, itemCount: rows.length }
}