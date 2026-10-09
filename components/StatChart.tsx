import type { StatSeries } from '@/lib/statsCompute'

const COLORS = ['var(--accent)', '#f59e0b', '#10b981', '#ef4444', '#a78bfa', '#ec4899']

export default function StatChart({ series, type, yLabel, xLabel }: {
  series: StatSeries[]
  type: 'line' | 'bar'
  yLabel?: string | null
  xLabel?: string | null
}) {
  const all = series.flatMap(s => s.points)
  if (!all.length) {
    return <p className="text-sm py-8 text-center" style={{ color: 'var(--text-muted)' }}>No data.</p>
  }

  const W = 800, H = 400, L = 60, R = 20, T = 20, B = 60
  const iw = W - L - R, ih = H - T - B
  const xsAll = [...new Set(all.map(p => p.x))].sort((a, b) => a - b)
  const n = xsAll.length
  const xMin = xsAll[0], xMax = xsAll[n - 1]
  const ys = all.map(p => p.y)
  let yMin = type === 'bar' ? 0 : Math.min(...ys)
  let yMax = Math.max(...ys)
  if (type === 'line') {
    const pad = (yMax - yMin) * 0.1 || 1
    yMin -= pad; yMax += pad
  } else yMax = yMax * 1.1 || 1

  const multi = series.length > 1
  const colorOf = (i: number) => !multi ? 'var(--accent)' : i === 0 ? 'var(--text-muted)' : COLORS[(i - 1) % COLORS.length]
  const xPos = (x: number) => type === 'bar'
    ? L + (xsAll.indexOf(x) + 0.5) * (iw / n)
    : xMax === xMin ? L + iw / 2 : L + ((x - xMin) / (xMax - xMin)) * iw
  const yPos = (y: number) => T + ih - ((y - yMin) / (yMax - yMin)) * ih
  const fmt = (v: number) => String(Math.round(v * 100) / 100)
  const yTicks = Array.from({ length: 6 }, (_, i) => yMin + ((yMax - yMin) * i) / 5)
  const step = Math.ceil(n / 12)
  const gw = (iw / n) * 0.8
  const bw = Math.max(2, gw / series.length)
  const tip = (s: StatSeries, p: { x: number; y: number; n: number }) =>
    `${s.name} – ${p.x}: ${fmt(p.y)} (${p.n} item${p.n !== 1 ? 's' : ''})`

  return (
    <div>
      {multi && (
        <div className="flex flex-wrap gap-4 mb-3 text-xs" style={{ color: 'var(--text-secondary)' }}>
          {series.map((s, i) => (
            <span key={s.name} className="flex items-center gap-1.5">
              <span className="inline-block w-3 h-3 rounded-sm" style={{ background: colorOf(i) }} />{s.name}
            </span>
          ))}
        </div>
      )}
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto" role="img">
        {yTicks.map((t, i) => (
          <g key={i}>
            <line x1={L} x2={W - R} y1={yPos(t)} y2={yPos(t)} stroke="var(--border)" strokeWidth="1" strokeDasharray="3 4" />
            <text x={L - 8} y={yPos(t)} textAnchor="end" dy="0.3em" fontSize="11" fill="var(--text-muted)">{fmt(t)}</text>
          </g>
        ))}

        {xsAll.map((x, i) => i % step === 0 && (
          <text key={`x${i}`} x={xPos(x)} y={H - B + 18} textAnchor="middle" fontSize="11" fill="var(--text-muted)">{x}</text>
        ))}

        {type === 'bar' && series.map((s, si) => s.points.map(p => (
          <rect key={`${si}-${p.x}`} x={xPos(p.x) - gw / 2 + si * bw} y={yPos(p.y)} width={bw - 1}
            height={Math.max(0, yPos(yMin) - yPos(p.y))} rx="2" fill={colorOf(si)}>
            <title>{tip(s, p)}</title>
          </rect>
        )))}

        {type === 'line' && series.map((s, si) => {
          if (!s.points.length) return null
          const c = colorOf(si)
          const pts = s.points.map(p => `${xPos(p.x)},${yPos(p.y)}`).join(' ')
          const first = s.points[0], last = s.points[s.points.length - 1]
          return (
            <g key={si}>
              <polygon fill={c} opacity="0.08"
                points={`${xPos(first.x)},${yPos(yMin)} ${pts} ${xPos(last.x)},${yPos(yMin)}`} />
              <polyline fill="none" stroke={c} strokeWidth="2.5" strokeLinejoin="round"
                strokeDasharray={multi && si === 0 ? '6 4' : undefined} points={pts} />
              {s.points.map(p => (
                <circle key={p.x} cx={xPos(p.x)} cy={yPos(p.y)} r="4" fill={c}>
                  <title>{tip(s, p)}</title>
                </circle>
              ))}
            </g>
          )
        })}

        <line x1={L} x2={L} y1={T} y2={T + ih} stroke="var(--text-faint)" />
        <line x1={L} x2={W - R} y1={T + ih} y2={T + ih} stroke="var(--text-faint)" />
        {xLabel && <text x={L + iw / 2} y={H - 10} textAnchor="middle" fontSize="12" fill="var(--text-muted)">{xLabel}</text>}
        {yLabel && <text transform={`translate(14 ${T + ih / 2}) rotate(-90)`} textAnchor="middle" fontSize="12" fill="var(--text-muted)">{yLabel}</text>}
      </svg>
    </div>
  )
}