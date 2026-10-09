import type { StatPoint } from '@/lib/statsCompute'

export default function StatChart({ points, type, yLabel, xLabel }: {
  points: StatPoint[]
  type: 'line' | 'bar'
  yLabel?: string | null
  xLabel?: string | null
}) {
  if (!points.length) {
    return <p className="text-sm py-8 text-center" style={{ color: 'var(--text-muted)' }}>No data.</p>
  }

  const W = 800, H = 400, L = 60, R = 20, T = 20, B = 60
  const iw = W - L - R, ih = H - T - B
  const n = points.length
  const xs = points.map(p => p.x)
  const ys = points.map(p => p.y)
  const xMin = Math.min(...xs), xMax = Math.max(...xs)
  let yMin = type === 'bar' ? 0 : Math.min(...ys)
  let yMax = Math.max(...ys)
  if (type === 'line') {
    const pad = (yMax - yMin) * 0.1 || 1
    yMin -= pad
    yMax += pad
  } else {
    yMax = yMax * 1.1 || 1
  }

  const xPos = (p: StatPoint, i: number) => {
    if (type === 'bar') return L + (i + 0.5) * (iw / n)
    return xMax === xMin ? L + iw / 2 : L + ((p.x - xMin) / (xMax - xMin)) * iw
  }
  const yPos = (y: number) => T + ih - ((y - yMin) / (yMax - yMin)) * ih
  const fmt = (v: number) => String(Math.round(v * 100) / 100)

  const yTicks = Array.from({ length: 6 }, (_, i) => yMin + ((yMax - yMin) * i) / 5)
  const step = Math.ceil(n / 12)
  const bw = Math.max(2, (iw / n) * 0.7)

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto" role="img">
      {yTicks.map((t, i) => (
        <g key={i}>
          <line x1={L} x2={W - R} y1={yPos(t)} y2={yPos(t)} stroke="var(--border)" strokeWidth="1" />
          <text x={L - 8} y={yPos(t)} textAnchor="end" dy="0.3em" fontSize="11" fill="var(--text-muted)">{fmt(t)}</text>
        </g>
      ))}

      {points.map((p, i) => i % step === 0 && (
        <text key={`x${i}`} x={xPos(p, i)} y={H - B + 18} textAnchor="middle" fontSize="11" fill="var(--text-muted)">{p.x}</text>
      ))}

      {type === 'bar' && points.map((p, i) => (
        <rect key={i} x={xPos(p, i) - bw / 2} y={yPos(p.y)} width={bw} height={Math.max(0, yPos(yMin) - yPos(p.y))} fill="var(--accent)">
          <title>{`${p.x}: ${fmt(p.y)} (${p.n} item${p.n !== 1 ? 's' : ''})`}</title>
        </rect>
      ))}

      {type === 'line' && (
        <>
          <polyline fill="none" stroke="var(--accent)" strokeWidth="2"
            points={points.map((p, i) => `${xPos(p, i)},${yPos(p.y)}`).join(' ')} />
          {points.map((p, i) => (
            <circle key={i} cx={xPos(p, i)} cy={yPos(p.y)} r="4" fill="var(--accent)">
              <title>{`${p.x}: ${fmt(p.y)} (${p.n} item${p.n !== 1 ? 's' : ''})`}</title>
            </circle>
          ))}
        </>
      )}

      <line x1={L} x2={L} y1={T} y2={T + ih} stroke="var(--text-faint)" />
      <line x1={L} x2={W - R} y1={T + ih} y2={T + ih} stroke="var(--text-faint)" />

      {xLabel && <text x={L + iw / 2} y={H - 10} textAnchor="middle" fontSize="12" fill="var(--text-muted)">{xLabel}</text>}
      {yLabel && <text transform={`translate(14 ${T + ih / 2}) rotate(-90)`} textAnchor="middle" fontSize="12" fill="var(--text-muted)">{yLabel}</text>}
    </svg>
  )
}