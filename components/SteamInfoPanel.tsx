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
  // Favorite props
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

  return (
    <div className={`flex flex-col overflow-hidden rounded-sm border border-[#2a475e] bg-[#1b2838] ${className}`}>
      {headerImage && (
        <div className="relative h-[140px] w-full shrink-0 overflow-hidden bg-[#0e1621] md:h-[160px]">
          <img src={headerImage} alt={headerImageAlt} className="h-full w-full object-contain p-4" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1b2838] via-transparent to-transparent" />
          {ribbon && (
            <span className="absolute left-3 top-3 rounded-sm bg-[#a34c25] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
              {ribbon}
            </span>
          )}
          {logoUrl && (
            <img
              src={logoUrl}
              alt={logoAlt}
              className="absolute bottom-3 left-3 max-h-14 max-w-[45%] object-contain object-left-bottom drop-shadow-lg md:max-h-16"
            />
          )}
        </div>
      )}

      <div className="flex flex-1 flex-col gap-4 p-4">
        {title && <h2 className="text-xl font-normal leading-snug text-[#c6d4df]">{title}</h2>}
        {description && <p className="text-sm leading-relaxed text-[#acb2b8]">{description}</p>}

        {/* Overall Score */}
        {score !== undefined && (
          <div className="flex items-center gap-4 border-b border-[#2a475e] pb-4">
            <div
              className="relative flex h-20 w-20 shrink-0 items-center justify-center rounded-full"
              style={{ background: `conic-gradient(#66c0f4 ${score * 3.6}deg, #2a475e 0)` }}
            >
              <div className="flex h-[68px] w-[68px] items-center justify-center rounded-full bg-[#1b2838]">
                <span className="text-2xl font-bold text-[#66c0f4]">{score}</span>
              </div>
            </div>
            <div>
              <p className="text-[10px] font-medium uppercase tracking-wider text-[#8f98a0]">{scoreLabel}</p>
              <p className="text-sm text-[#c6d4df]">
                {score >= 75 ? 'Mostly positive' : score >= 50 ? 'Mixed' : 'Needs improvement'}
              </p>
            </div>
          </div>
        )}

        {/* My Score */}
        <div className="flex items-center gap-4 border-b border-[#2a475e] pb-4">
          <div
            className="relative flex h-20 w-20 shrink-0 items-center justify-center rounded-full"
            style={{
              background: hasRated && myScore !== null
                ? `conic-gradient(#66c0f4 ${myScore * 3.6}deg, #2a475e 0)`
                : '#2a475e'
            }}
          >
            <div className="flex h-[68px] w-[68px] items-center justify-center rounded-full bg-[#1b2838]">
              {hasRated && myScore !== null ? (
                <span className="text-2xl font-bold text-[#66c0f4]">{myScore}</span>
              ) : (
                <span className="text-2xl text-[#4a6a82]">—</span>
              )}
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <p className="text-[10px] font-medium uppercase tracking-wider text-[#8f98a0]">My Score</p>
            <p className="text-xs text-[#8f98a0]">
              {hasRated ? 'Your rating has been submitted' : 'You have not rated this yet'}
            </p>
            {!hasRated && (
              <button
                onClick={onRateClick}
                className="w-fit bg-[#4c6b22] hover:bg-[#5a7a28] text-white text-xs font-medium px-3 py-1.5 rounded-sm transition-colors"
              >
                Rate this ride
              </button>
            )}
          </div>
        </div>

        {/* Favorite Button */}
        {showFavorite && (
          <div className="flex justify-end">
            <button
              onClick={handleFavorite}
              title={favorited ? 'Remove from favorites' : 'Add to favorites'}
              className={`transition-all duration-200 ${favAnimating ? 'scale-90' : 'scale-100'}`}
            >
              <svg
                viewBox="0 0 24 24"
                className={`w-6 h-6 transition-colors duration-200 ${favorited
                    ? 'fill-red-500 stroke-red-500'
                    : 'fill-transparent stroke-[#8f98a0] hover:stroke-red-400'
                  }`}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
            </button>
          </div>
        )}

        {/* Rating breakdown bars */}
        {ratingBreakdown && (
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-[#2a475e]">
                <div className="h-full bg-green-500 rounded-full" style={{ width: `${ratingBreakdown.positive}%` }} />
              </div>
              <span className="text-xs text-green-400 w-8 text-right">{ratingBreakdown.positive}%</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-[#2a475e]">
                <div className="h-full bg-yellow-500 rounded-full" style={{ width: `${ratingBreakdown.mixed}%` }} />
              </div>
              <span className="text-xs text-yellow-400 w-8 text-right">{ratingBreakdown.mixed}%</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-[#2a475e]">
                <div className="h-full bg-red-500 rounded-full" style={{ width: `${ratingBreakdown.negative}%` }} />
              </div>
              <span className="text-xs text-red-400 w-8 text-right">{ratingBreakdown.negative}%</span>
            </div>
          </div>
        )}

        {metadata.length > 0 && (
          <dl className="space-y-2.5 text-sm">
            {metadata.map((row) => (
              <div key={row.label} className="flex flex-col gap-0.5 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4">
                <dt className="shrink-0 text-[10px] font-medium uppercase tracking-wider text-[#8f98a0]">{row.label}</dt>
                <dd className="min-w-0 text-right text-[#66c0f4]">
                  {row.href ? (
                    <a href={row.href} className="hover:text-white">{row.value}</a>
                  ) : (
                    <span className="text-[#66c0f4]">{row.value}</span>
                  )}
                </dd>
              </div>
            ))}
          </dl>
        )}

        {children}

        {tags.length > 0 && (
          <div className="border-t border-[#2a475e] pt-4">
            <p className="mb-2 text-[10px] font-medium uppercase tracking-wider text-[#8f98a0]">Popular tags</p>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <span key={tag} className="rounded-[2px] bg-[#2a475e] px-2 py-1 text-xs text-[#66c0f4] hover:bg-[#3d5a73]">
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