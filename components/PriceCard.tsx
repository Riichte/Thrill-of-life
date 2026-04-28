'use client'
import { useCurrencyContext } from '@/lib/currencyContext'
import { useCurrency } from '@/lib/useCurrency'

type ParkPrice = {
  id: string
  category: string
  label: string | null
  min_age: number | null
  max_age: number | null
  duration: string | null
  price: number
  currency: string
}

const CATEGORY_ORDER = ['free', 'child', 'adult', 'senior', 'parking', 'skipline', 'season_tier1', 'season_tier2', 'season_tier3']

const DURATION_LABEL: Record<string, string> = {
  '1day': '1 Day',
  '2day': '2 Days',
  'season': 'Season',
  'perday': 'Per Day',
}

function AgeRange({ min, max }: { min: number | null; max: number | null }) {
  if (min === null && max === null) return null
  if (min === 0 && max !== null) return <span className="text-xs" style={{ color: 'var(--text-muted)' }}>({max} & under)</span>
  if (max === null) return <span className="text-xs" style={{ color: 'var(--text-muted)' }}>(age {min}+)</span>
  return <span className="text-xs" style={{ color: 'var(--text-muted)' }}>(age {min}–{max})</span>
}

function PriceRow({ price, format }: { price: ParkPrice; format: (n: number) => string }) {
  const name = price.label || price.category
  return (
    <div className="flex items-center justify-between gap-2 py-2" style={{ borderBottom: '1px solid var(--border)' }}>
      <div className="flex items-center gap-2 min-w-0">
        <span className="text-sm font-medium capitalize" style={{ color: 'var(--text-primary)' }}>{name}</span>
        <AgeRange min={price.min_age} max={price.max_age} />
      </div>
      <div className="flex items-center gap-3 flex-shrink-0">
        {price.duration && (
          <span className="text-xs px-1.5 py-0.5 rounded" style={{ background: 'var(--badge-blue-bg)', color: 'var(--badge-blue-text)' }}>
            {DURATION_LABEL[price.duration] ?? price.duration}
          </span>
        )}
        <span className="text-sm font-bold" style={{ color: price.price === 0 ? 'var(--score-high)' : 'var(--accent)' }}>
          {format(price.price)}
        </span>
      </div>
    </div>
  )
}

export default function PriceCard({ prices, parkCurrency }: { prices: ParkPrice[]; parkCurrency: string }) {
  const { currency } = useCurrencyContext()
  // group by the dominant currency of the park (first price's currency)
  const baseCurrency = prices[0]?.currency ?? parkCurrency
  const { format, loading } = useCurrency(baseCurrency, currency)

  if (prices.length === 0) return null

  // group by category section
  const sections: Record<string, ParkPrice[]> = {}
  const sectionOrder = ['free', 'child', 'adult', 'senior', 'parking', 'skipline', 'season_tier1', 'season_tier2', 'season_tier3']

  prices.forEach(p => {
    if (!sections[p.category]) sections[p.category] = []
    sections[p.category].push(p)
  })

  const SECTION_LABEL: Record<string, string> = {
    free: '🎟️ Free Entry',
    child: '🧒 Child',
    adult: '🧑 Adult',
    senior: '👴 Senior',
    parking: '🅿️ Parking',
    skipline: '⚡ Skip the Line',
    season_tier1: '🌟 Season Pass',
    season_tier2: '🌟🌟 Season Pass',
    season_tier3: '🌟🌟🌟 Season Pass',
  }

  return (
    <div className="rounded-sm overflow-hidden" style={{ background: 'var(--card-bg)', border: '1px solid var(--border)' }}>
      <div className="px-4 py-3 flex items-center justify-between" style={{ borderBottom: '1px solid var(--border)' }}>
        <h3 className="text-sm font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Ticket Prices</h3>
        {loading && <span className="text-xs" style={{ color: 'var(--text-muted)' }}>Converting...</span>}
        {!loading && currency !== baseCurrency && (
          <span className="text-xs" style={{ color: 'var(--text-muted)' }}>Approx. in {currency}</span>
        )}
      </div>

      <div className="px-4 py-2">
        {sectionOrder.filter(s => sections[s]).map(sectionKey => (
          <div key={sectionKey} className="mb-3">
            <p className="text-xs font-semibold uppercase tracking-wider mb-1 pt-2" style={{ color: 'var(--text-muted)' }}>
              {sections[sectionKey][0]?.label && ['season_tier1','season_tier2','season_tier3','skipline'].includes(sectionKey)
                ? sections[sectionKey][0].label
                : SECTION_LABEL[sectionKey]}
            </p>
            {sections[sectionKey].map(p => (
              <PriceRow key={p.id} price={p} format={format} />
            ))}
          </div>
        ))}
      </div>

      <div className="px-4 py-2 text-xs" style={{ color: 'var(--text-faint)', borderTop: '1px solid var(--border)' }}>
        Prices may vary. Check park website for current rates.
      </div>
    </div>
  )
}