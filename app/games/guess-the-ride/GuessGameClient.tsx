'use client'

import { useState } from 'react'
import Link from 'next/link'

type Item = {
  id: string
  name: string
  parkId: string
  categoryId: string
  imageUrl: string
} | null

type Specs = {
  type: string | null
  height: number | null
  speed: number | null
  length: number | null
  inversions: number | null
  duration: string | null
  manufacturer: string | null
}

export default function GuessGameClient({ item }: { item: Item }) {
  const [guess, setGuess] = useState('')
  const [attempts, setAttempts] = useState<string[]>([])
  const [won, setWon] = useState(false)

  if (!item) {
    return <div className="p-8 text-center" style={{ color: 'var(--text-muted)' }}>No items available.</div>
  }

  const maxAttempts = 5
  const lost = attempts.length >= maxAttempts && !won
    // zoom starts at 3x (zoomed in) and eases to 1x (full image) after maxAttempts
  const zoomSteps = [3, 2.4, 1.9, 1.4, 1] // length must match maxAttempts + 1 win state
  const scale = won || lost ? 1 : zoomSteps[Math.min(attempts.length, zoomSteps.length - 1)]

  // fixed random crop focus point, stable per item (based on item.id so it doesn't jump each render)
  const seed = item.id.split('').reduce((a, c) => a + c.charCodeAt(0), 0)
  const focusX = (seed % 60) + 10 // 10–70%
  const focusY = ((seed * 7) % 60) + 10

  // offset needed to center the zoomed image on the focus point
  const offsetX = focusX * (scale - 1)
  const offsetY = focusY * (scale - 1)
  

  const normalize = (s: string) =>
    s.toLowerCase()
      .replace(/[:.,!?'"-]/g, '')   // strip punctuation
      .replace(/\s+/g, ' ')
      .trim()

  const levenshtein = (a: string, b: string) => {
    const dp = Array.from({ length: a.length + 1 }, (_, i) => [i, ...Array(b.length).fill(0)])
    for (let j = 0; j <= b.length; j++) dp[0][j] = j
    for (let i = 1; i <= a.length; i++) {
      for (let j = 1; j <= b.length; j++) {
        dp[i][j] = a[i - 1] === b[j - 1]
          ? dp[i - 1][j - 1]
          : 1 + Math.min(dp[i - 1][j - 1], dp[i - 1][j], dp[i][j - 1])
      }
    }
    return dp[a.length][b.length]
  }

  const isCloseEnough = (guessStr: string, target: string) => {
    const g = normalize(guessStr)
    const t = normalize(target)
    if (!g) return false
    if (g === t) return true
    if (t.includes(g) && g.length >= t.length * 0.6) return true // "batman the ride" vs "batman the ride"
    const distance = levenshtein(g, t)
    const threshold = Math.max(1, Math.floor(t.length * 0.2)) // allow ~20% typo tolerance
    return distance <= threshold
  }

  const handleGuess = () => {
    if (!guess.trim() || won || lost) return
    const correct = isCloseEnough(guess, item.name)
    setAttempts(prev => [...prev, guess.trim()])
    if (correct) setWon(true)
    setGuess('')
  }

  return (
    <div className="min-h-screen flex flex-col items-center py-10 px-4" style={{ background: 'var(--bg-tertiary)', color: 'var(--text-primary)' }}>
      <h1 className="text-3xl font-bold mb-1">Guess the Ride</h1>
            {!won && !lost && (
        <p className="text-sm mb-6" style={{ color: 'var(--text-muted)' }}>
          Attempt {attempts.length + 1} / {maxAttempts}
        </p>
      )}

      {won && (
        <div className="w-full max-w-md mb-4 rounded-sm px-4 py-3 flex items-center gap-3"
          style={{ background: 'rgba(16,185,129,0.12)', border: '1px solid var(--score-high)' }}>
          <span className="text-2xl">🎉</span>
          <div>
            <p className="font-semibold" style={{ color: 'var(--score-high)' }}>{item.name}</p>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
              Solved in {attempts.length} {attempts.length === 1 ? 'try' : 'tries'}
            </p>
          </div>
        </div>
      )}

      {lost && (
        <div className="w-full max-w-md mb-4 rounded-sm px-4 py-3 flex items-center gap-3"
          style={{ background: 'rgba(239,68,68,0.12)', border: '1px solid var(--score-low)' }}>
          <span className="text-2xl">😬</span>
          <div>
            <p className="font-semibold" style={{ color: 'var(--score-low)' }}>{item.name}</p>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Better luck next time</p>
          </div>
        </div>
      )}

            <div className="w-full max-w-md aspect-video rounded-sm overflow-hidden mb-4 relative" style={{ border: '1px solid var(--border)' }}>
        <img
          src={item.imageUrl}
          alt="Guess this ride"
          className="absolute"
          style={{
            width: `${scale * 100}%`,
            height: `${scale * 100}%`,
            objectFit: 'cover',
            left: won || lost ? '0' : `${-offsetX}%`,
            top: won || lost ? '0' : `${-offsetY}%`,
            maxWidth: 'none',
            transition: 'all 0.4s ease',
          }}
        />
      </div>

      {!won && !lost && (
        <div className="flex gap-2 w-full max-w-md">
          <input
            value={guess}
            onChange={e => setGuess(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleGuess()}
            placeholder="Ride or attraction name..."
            className="flex-1 rounded-sm px-3 py-2 text-sm focus:outline-none"
            style={{ background: 'var(--input-bg)', border: '1px solid var(--input-border)', color: 'var(--text-primary)' }}
          />
          <button
            onClick={handleGuess}
            className="px-4 py-2 rounded-sm text-sm font-medium"
            style={{ background: 'var(--cta)', color: 'var(--cta-text)' }}
          >
            Guess
          </button>
        </div>
      )}

      {attempts.length > 0 && (
        <div className="mt-2 w-full max-w-md space-y-1">
          {attempts.map((a, i) => {
            const isLastAndWon = won && i === attempts.length - 1
            return (
              <p key={i} className="text-sm flex items-center gap-2"
                style={{ color: isLastAndWon ? 'var(--score-high)' : 'var(--score-low)' }}>
                <span>{isLastAndWon ? '✓' : '✕'}</span> {a}
              </p>
            )
          })}
        </div>
      )}

      {(won || lost) && (
        <div className="flex gap-3 mt-6">
          <Link href={`/parks/${item.parkId}/${item.categoryId}/${item.id}`}
            className="px-4 py-2 rounded-sm text-sm" style={{ background: 'var(--bg-elevated)', color: 'var(--text-primary)' }}>
            View ride
          </Link>
          <Link href="/games/guess-the-ride"
            className="px-4 py-2 rounded-sm text-sm font-medium" style={{ background: 'var(--cta)', color: 'var(--cta-text)' }}>
            Play again
          </Link>
        </div>
      )}
    </div>
  )
}