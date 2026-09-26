'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useEffect } from 'react'
import { searchGuessItemsAction } from '@/lib/actions/guessActions'

type Specs = {
  type: string | null
  height: number | null
  speed: number | null
  length: number | null
  inversions: number | null
  duration: string | null
  manufacturer: string | null
  status: string | null
  model: string | null
}

type Item = {
  id: string
  name: string
  parkId: string
  categoryId: string
  specs: Specs
  imageUrl: string
  parkName?: string | null
} | null

const STAT_LABELS: { key: keyof Specs; label: string; unit?: string }[] = [
  { key: 'type', label: 'Type' },
  { key: 'manufacturer', label: 'Manufacturer' },
  { key: 'model', label: 'Model' },
  { key: 'status', label: 'Status' },
  { key: 'height', label: 'Height', unit: 'm' },
  { key: 'speed', label: 'Speed', unit: 'km/h' },
  { key: 'length', label: 'Length', unit: 'm' },
  { key: 'inversions', label: 'Inversions' },
  { key: 'duration', label: 'Duration' },
]

type Guess = { id: string; name: string; parkName?: string; specs: Specs }

export default function GuessStatsGameClient({ item }: { item: Item }) {
  const [query, setQuery] = useState('')
  const [suggestions, setSuggestions] = useState<Guess[]>([])
  const [guesses, setGuesses] = useState<Guess[]>([])
  const [won, setWon] = useState(false)

  // one random hint, chosen once
  const [hint] = useState(() => {
    if (!item) return null
    const avail = STAT_LABELS.filter(s => item.specs[s.key] !== null && item.specs[s.key] !== '')
    return avail[Math.floor(Math.random() * avail.length)] ?? null
  })

  useEffect(() => {
    if (query.trim().length < 2) { setSuggestions([]); return }
    const t = setTimeout(async () => {
      const res = await searchGuessItemsAction(query)
      setSuggestions(res.filter(r => !guesses.some(g => g.id === r.id)) as Guess[])
    }, 250)
    return () => clearTimeout(t)
  }, [query, guesses])

  if (!item) {
    return <div className="p-8 text-center" style={{ color: 'var(--text-muted)' }}>No items available.</div>
  }


  const activeStats = STAT_LABELS
  const maxAttempts = 10
  const lost = guesses.length >= maxAttempts && !won

  const formatStatus = (v: string) =>
    v === 'sbno' ? 'SBNO' : v.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())

  const fmt = (key: keyof Specs, unit: string | undefined, v: any) => {
    if (v === null || v === undefined || v === '') return '—'
    const s = key === 'status' ? formatStatus(String(v)) : String(v)
    return unit ? `${s} ${unit}` : s
  }

  const handlePick = (g: Guess) => {
    if (won || lost) return
    setGuesses(prev => [g, ...prev]) // newest on top
    if (g.id === item.id) setWon(true)
    setQuery('')
    setSuggestions([])
  }

  return (
    <div className="min-h-screen flex flex-col items-center py-10 px-4" style={{ background: 'var(--bg-tertiary)', color: 'var(--text-primary)' }}>
      <h1 className="text-3xl font-bold mb-1">Guess the Ride by Stats</h1>
      {!won && !lost && (
        <p className="text-sm mb-4" style={{ color: 'var(--text-muted)' }}>
          Attempt {guesses.length + 1} / {maxAttempts}
        </p>
      )}

      {won && (
        <Link href={`/parks/${item.parkId}/${item.categoryId}/${item.id}`}
          className="w-full max-w-md mb-4 rounded-sm px-4 py-3 flex items-center gap-3 hover:opacity-90 transition-opacity"
          style={{ background: 'rgba(16,185,129,0.12)', border: '1px solid var(--score-high)' }}>
          <img src={item.imageUrl} alt={item.name} className="w-30 h-30 rounded-sm object-cover flex-shrink-0" />
          <div>
            <p className="font-semibold" style={{ color: 'var(--score-high)' }}>{item.name}</p>
            {item.parkName && (
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{item.parkName}</p>
            )}
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
              Solved in {guesses.length} {guesses.length === 1 ? 'try' : 'tries'}
            </p>
          </div>
        </Link>
      )}

      {lost && (
        <Link href={`/parks/${item.parkId}/${item.categoryId}/${item.id}`}
          className="w-full max-w-md mb-4 rounded-sm px-4 py-3 flex items-center gap-3 hover:opacity-90 transition-opacity"
          style={{ background: 'rgba(16,185,129,0.12)', border: '1px solid var(--score-high)' }}>
          <img src={item.imageUrl} alt={item.name} className="w-30 h-30 rounded-sm object-cover flex-shrink-0" />
          <div>
            <p className="font-semibold" style={{ color: 'var(--score-low)' }}>{item.name}</p>
            {item.parkName && (
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{item.parkName}</p>
            )}
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Better luck next time</p>
          </div>
        </Link>
      )}

      {/* Hint */}
      {hint && (
        <div className="w-full max-w-md rounded-sm px-4 py-3 mb-4 text-sm flex justify-between"
          style={{ background: 'var(--card-bg)', border: '1px solid var(--accent)' }}>
          <span style={{ color: 'var(--text-muted)' }}>Hint · {hint.label}</span>
          <span className="font-semibold">{fmt(hint.key, hint.unit, item.specs[hint.key])}</span>
        </div>
      )}

      {/* Search */}
      {!won && !lost && (
        <div className="relative w-full max-w-md mb-6">
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search a ride and select it..."
            className="w-full rounded-sm px-3 py-2 text-sm focus:outline-none"
            style={{ background: 'var(--input-bg)', border: '1px solid var(--input-border)', color: 'var(--text-primary)' }}
          />
          {suggestions.length > 0 && (
            <div className="absolute left-0 right-0 top-full mt-1 z-20 rounded-sm overflow-hidden shadow-xl"
              style={{ background: 'var(--bg-primary)', border: '1px solid var(--border)' }}>
              {suggestions.map(s => (
                <button key={s.id} onClick={() => handlePick(s)}
                  className="block w-full text-left px-3 py-2 text-sm hover:opacity-80"
                  style={{ color: 'var(--text-primary)' }}>
                  <span className="font-medium">{s.name}</span>
                  <span className="block text-xs" style={{ color: 'var(--text-muted)' }}>
                    {[s.parkName, s.specs.type].filter(Boolean).join(' · ')}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Guess table */}
      {guesses.length > 0 && (
        <div className="w-full max-w-5xl overflow-x-auto">
          <table className="w-full border-separate text-center text-sm" style={{ borderSpacing: 4 }}>
            <thead>
              <tr style={{ color: 'var(--text-muted)' }}>
                <th className="px-2 py-1 text-left">Name</th>
                {activeStats.map(s => <th key={s.key} className="px-2 py-1">{s.label}</th>)}
              </tr>
            </thead>
            <tbody>
              {guesses.map(g => (
                <tr key={g.id}>
                  <td className="px-2 py-3 text-left font-medium">
                    {g.name}
                    {g.parkName && <span className="block text-xs font-normal" style={{ color: 'var(--text-muted)' }}>{g.parkName}</span>}
                  </td>
                  {activeStats.map(s => {
                    const a = g.specs[s.key]
                    const b = item.specs[s.key]
                    const ok = String(a ?? '') === String(b ?? '')
                    const numA = Number(a)
                    const numB = Number(b)
                    const arrow = !ok && a !== null && b !== null && a !== '' && b !== '' && !isNaN(numA) && !isNaN(numB)
                      ? (numB > numA ? ' ↑' : ' ↓') : ''
                    return (
                      <td key={s.key} className="px-2 py-3 rounded-sm font-semibold text-white"
                        style={{ background: ok ? 'var(--score-high)' : 'var(--score-low)' }}>
                        {fmt(s.key, s.unit, a)}{arrow}
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {(won || lost) && (
        <div className="flex gap-3 mt-6">
          <Link href={`/parks/${item.parkId}/${item.categoryId}/${item.id}`}
            className="px-4 py-2 rounded-sm text-sm" style={{ background: 'var(--bg-elevated)', color: 'var(--text-primary)' }}>
            View ride
          </Link>
          <Link href="/games/guess-the-ride/guess-the-stats"
            className="px-4 py-2 rounded-sm text-sm font-medium" style={{ background: 'var(--cta)', color: 'var(--cta-text)' }}>
            Play again
          </Link>
        </div>
      )}
    </div>
  )
}