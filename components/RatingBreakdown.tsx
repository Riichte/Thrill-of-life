export default function RatingBreakdown({ ratings }: { ratings: { category: string; score: number }[] }) {
  if (!ratings?.length) return null

  const color = (s: number) =>
    s >= 80 ? 'var(--score-high)' : s >= 60 ? 'var(--score-mid)' : s >= 40 ? '#f97316' : 'var(--score-low)'

  const label = (c: string) =>
    c.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())

  return (
    <div className="mt-2 space-y-1.5">
      {ratings.map(r => (
        <div key={r.category} className="flex items-center gap-3">
          <span className="text-xs w-32 flex-shrink-0" style={{ color: 'var(--text-muted)' }}>
            {label(r.category)}
          </span>
          <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: 'var(--border)' }}>
            <div className="h-full rounded-full" style={{ width: `${r.score}%`, background: color(r.score) }} />
          </div>
          <span className="text-xs font-bold w-7 text-right" style={{ color: color(r.score) }}>
            {r.score}
          </span>
        </div>
      ))}
    </div>
  )
}