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

export function computeGraph(
  graph: Pick<StatGraph, 'category_id' | 'group_field' | 'value_field' | 'aggregation' | 'exclude_models' | 'exclude_types' | 'min_group_size'>,
  items: { category_id: string; specs: any }[]
): { points: StatPoint[]; itemCount: number } {
  const exModels = new Set(graph.exclude_models.map(norm))
  const exTypes = new Set(graph.exclude_types.map(norm))
  const groups = new Map<number, number[]>()
  let itemCount = 0

  for (const item of items) {
    if (item.category_id !== graph.category_id) continue
    const specs = item.specs || {}
    if (specs.model && exModels.has(norm(specs.model))) continue
    if (specs.type && exTypes.has(norm(specs.type))) continue
    const x = num(specs[graph.group_field])
    if (x === null) continue
    let v: number | null
    if (graph.aggregation === 'count') v = 1
    else {
      v = num(specs[graph.value_field])
      if (v === null) continue
    }
    if (!groups.has(x)) groups.set(x, [])
    groups.get(x)!.push(v)
    itemCount++
  }

  const points: StatPoint[] = []
  for (const [x, vals] of groups) {
    if (vals.length < (graph.min_group_size || 1)) continue
    let y = 0
    switch (graph.aggregation) {
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
  points.sort((a, b) => a.x - b.x)
  return { points, itemCount }
}