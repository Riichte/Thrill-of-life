import type { ReactNode } from 'react'

export type SteamMetaRow = {
  label: string
  value: ReactNode
  href?: string
}

type SteamInfoPanelProps = {
  /** Wide image at top (e.g. hero / key art) */
  headerImage?: string
  headerImageAlt?: string
  /** Small logo over the header */
  logoUrl?: string
  logoAlt?: string
  /** e.g. red “NEW” ribbon */
  ribbon?: string
  title?: string
  description: string
  /** Large score number (0–100) shown in the sidebar */
  score?: number
  scoreLabel?: string
  metadata?: SteamMetaRow[]
  tags?: string[]
  /** Extra block (e.g. quick facts) */
  children?: ReactNode
  className?: string
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
  metadata = [],
  tags = [],
  children,
  className = ''
}: SteamInfoPanelProps) {
  return (
    <div
      className={`flex flex-col overflow-hidden rounded-sm border border-[#2a475e] bg-[#1b2838] ${className}`}
    >
      {headerImage && (
        <div className="relative h-[140px] w-full shrink-0 overflow-hidden bg-[#0e1621] md:h-[160px]">
          <img src={headerImage} alt={headerImageAlt} className="h-full w-full object-cover" />
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

        <p className="text-sm leading-relaxed text-[#acb2b8]">{description}</p>

        {score !== undefined && (
          <div className="flex items-center gap-4 border-b border-[#2a475e] pb-4">
            <div
              className="relative flex h-20 w-20 shrink-0 items-center justify-center rounded-full"
              style={{
                background: `conic-gradient(#66c0f4 ${score * 3.6}deg, #2a475e 0)`
              }}
            >
              <div className="flex h-[68px] w-[68px] items-center justify-center rounded-full bg-[#1b2838]">
                <span className="text-2xl font-bold text-[#66c0f4]">{score}</span>
              </div>
            </div>
            <div>
              <p className="text-[10px] font-medium uppercase tracking-wider text-[#8f98a0]">
                {scoreLabel}
              </p>
              <p className="text-sm text-[#c6d4df]">
                {score >= 75 ? 'Mostly positive' : score >= 50 ? 'Mixed' : 'Needs improvement'}
              </p>
            </div>
          </div>
        )}

        {metadata.length > 0 && (
          <dl className="space-y-2.5 text-sm">
            {metadata.map((row) => (
              <div key={row.label} className="flex flex-col gap-0.5 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4">
                <dt className="shrink-0 text-[10px] font-medium uppercase tracking-wider text-[#8f98a0]">
                  {row.label}
                </dt>
                <dd className="min-w-0 text-right text-[#66c0f4]">
                  {row.href ? (
                    <a href={row.href} className="hover:text-white">
                      {row.value}
                    </a>
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
            <p className="mb-2 text-[10px] font-medium uppercase tracking-wider text-[#8f98a0]">
              Popular tags
            </p>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-[2px] bg-[#2a475e] px-2 py-1 text-xs text-[#66c0f4] hover:bg-[#3d5a73]"
                >
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
