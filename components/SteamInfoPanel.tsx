'use client'

import type { ReactNode } from 'react'
import { useState } from 'react'

export type SteamMetaRow = {
  label: string
  value: ReactNode
  href?: string
}

type SteamInfoPanelProps = {
  headerImage?: string
  headerImageAlt?: string
  logoUrl?: string
  logoAlt?: string
  ribbon?: string
  title?: string
  description?: string
  score?: number
  scoreLabel?: string
  myScore?: number | null
  hasRated?: boolean
  onRateClick?: () => void
  ratingBreakdown?: { positive: number; mixed: number; negative: number }
  metadata?: SteamMetaRow[]
  tags?: string[]
  children?: ReactNode
  className?: string
  isFavorited?: boolean
  onFavoriteToggle?: () => void
  showFavorite?: boolean
}

export function SteamInfoPanel({
  headerImage,
  headerImageAlt = '',
  logoUrl,
  logoAlt = '',
  ribbon,
  title,
  description,
  score,
  scoreLabel = 'Overall score',
  myScore = null,
  hasRated = false,
  onRateClick,
  ratingBreakdown,
  metadata = [],
  tags = [],
  children,
  className = '',
  isFavorited = false,
  onFavoriteToggle,
  showFavorite = false,
}: SteamInfoPanelProps) {
  const [favorited, setFavorited] = useState(isFavorited)
  const [favAnimating, setFavAnimating] = useState(false)

  const handleFavorite = () => {
    setFavAnimating(true)
    setTimeout(() => setFavAnimating(false), 300)
    setFavorited(prev => !prev)
    onFavoriteToggle?.()
  }

  const scoreColor = (s: number) =>
    s >= 80 ? 'var(--score-high)' : s >= 60 ? 'var(--score-mid)' : s >= 40 ? '#f97316' : 'var(--score-low)'

  const scoreLabel2 = (s: number) =>
    s >= 75 ? 'Mostly positive' : s >= 50 ? 'Mixed' : 'Needs improvement'

  return (
    <div
      className={`flex flex-col overflow-hidden rounded-sm ${className}`}
      style={{ background: 'var(--card-bg)', border: '1px solid var(--border)' }}
    >
      {headerImage && (
        <div className="relative h-[140px] w-full shrink-0 overflow-hidden md:h-[160px]" style={{ background: 'var(--bg-tertiary)' }}>
          <img src={headerImage} alt={headerImageAlt} className="h-full w-full object-contain p-4" />
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--card-bg)] via-transparent to-transparent" />
          {ribbon && (
            <span className="absolute left-3 top-3 rounded-sm px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide style={{ color: 'var(--text-primary)' }}"
              style={{ background: 'var(--cta)' }}>
              {ribbon}
            </span>
          )}
          {logoUrl && (
            <img src={logoUrl} alt={logoAlt}
              className="absolute bottom-3 left-3 max-h-14 max-w-[45%] object-contain object-left-bottom drop-shadow-lg md:max-h-16" />
          )}
        </div>
      )}

      <div className="flex flex-1 flex-col gap-4 p-4">
        {title && <h2 className="text-xl font-normal leading-snug" style={{ color: 'var(--text-primary)' }}>{title}</h2>}
        {description && <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{description}</p>}

        {/* Overall Score */}
        {score !== undefined && (
          <div className="flex items-center gap-4 pb-4" style={{ borderBottom: '1px solid var(--border)' }}>
            <div
              className="relative flex h-20 w-20 shrink-0 items-center justify-center rounded-full neon-glow-score"
              style={{ background: `conic-gradient(${scoreColor(score)} ${score * 3.6}deg, var(--border) 0)` }}
            >
              <div className="flex h-[68px] w-[68px] items-center justify-center rounded-full" style={{ background: 'var(--card-bg)' }}>
                <span className="text-2xl font-bold" style={{ color: scoreColor(score) }}>{score}</span>
              </div>
            </div>
            <div>
              <p className="text-[10px] font-medium uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>{scoreLabel}</p>
              <p className="text-sm" style={{ color: 'var(--text-primary)' }}>{scoreLabel2(score)}</p>
            </div>
          </div>
        )}

        {/* My Score */}
        <div className="flex items-center gap-4 pb-4" style={{ borderBottom: '1px solid var(--border)' }}>
          <div
            className="relative flex h-20 w-20 shrink-0 items-center justify-center rounded-full"
            style={{
              background: hasRated && myScore !== null
                ? `conic-gradient(${scoreColor(myScore)} ${myScore * 3.6}deg, var(--border) 0)`
                : 'var(--border)'
            }}
          >
            <div className="flex h-[68px] w-[68px] items-center justify-center rounded-full" style={{ background: 'var(--card-bg)' }}>
              {hasRated && myScore !== null ? (
                <span className="text-2xl font-bold" style={{ color: scoreColor(myScore) }}>{myScore}</span>
              ) : (
                <span className="text-2xl" style={{ color: 'var(--text-faint)' }}>—</span>
              )}
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <p className="text-[10px] font-medium uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>My Score</p>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
              {hasRated ? 'Your rating has been submitted' : 'You have not rated this yet'}
            </p>
            {!hasRated && (
              <button onClick={onRateClick}
                className="w-fit style={{ color: 'var(--text-primary)' }} text-xs font-medium px-3 py-1.5 rounded-sm transition-colors"
                style={{ background: 'var(--cta)' }}
                onMouseEnter={e => (e.currentTarget.style.background = 'var(--cta-hover)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'var(--cta)')}>
                Rate
              </button>
            )}
          </div>
        </div>

        {/* Favorite Button */}
        {showFavorite && (
          <div className="flex justify-end">
            <button onClick={handleFavorite} title={favorited ? 'Remove from favorites' : 'Add to favorites'}
              className={`transition-all duration-200 ${favAnimating ? 'scale-90' : 'scale-100'}`}>
              <svg viewBox="0 0 24 24" className="w-6 h-6 transition-colors duration-200"
                style={{ fill: favorited ? '#ef4444' : 'transparent', stroke: favorited ? '#ef4444' : 'var(--text-muted)' }}
                strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
            </button>
          </div>
        )}

        {/* Rating breakdown bars */}
        {ratingBreakdown && (
          <div className="space-y-1.5">
            {[
              { pct: ratingBreakdown.positive, color: 'var(--score-high)', label: ratingBreakdown.positive + '%' },
              { pct: ratingBreakdown.mixed, color: 'var(--score-mid)', label: ratingBreakdown.mixed + '%' },
              { pct: ratingBreakdown.negative, color: 'var(--score-low)', label: ratingBreakdown.negative + '%' },
            ].map((bar, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="h-1.5 flex-1 overflow-hidden rounded-full" style={{ background: 'var(--border)' }}>
                  <div className="h-full rounded-full" style={{ width: `${bar.pct}%`, background: bar.color }} />
                </div>
                <span className="text-xs w-8 text-right" style={{ color: bar.color }}>{bar.label}</span>
              </div>
            ))}
          </div>
        )}

        {/* Metadata rows */}
        {metadata.length > 0 && (
          <dl className="space-y-2.5 text-sm">
            {metadata.map((row) => (
              <div key={row.label} className="flex flex-col gap-0.5 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4">
                <dt className="shrink-0 text-[10px] font-medium uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>{row.label}</dt>
                <dd className="min-w-0 text-right" style={{ color: 'var(--accent)' }}>
                  {row.href ? (
                    <a href={row.href} className="hover:opacity-80">{row.value}</a>
                  ) : (
                    <span>{row.value}</span>
                  )}
                </dd>
              </div>
            ))}
          </dl>
        )}

        {children}

        {/* Tags */}
        {tags.length > 0 && (
          <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1rem' }}>
            <p className="mb-2 text-[10px] font-medium uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Popular tags</p>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <span key={tag} className="rounded-[2px] px-2 py-1 text-xs transition-colors"
                  style={{ background: 'var(--badge-blue-bg)', color: 'var(--badge-blue-text)' }}>
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}