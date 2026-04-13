'use client'

import { useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'

export type PhotoCredit = {
  url: string
  author: string
  sourceUrl: string
  license: string
}

export default function PhotoCredits({ credits }: { credits: PhotoCredit[] }) {
  const [open, setOpen] = useState(false)

  if (credits.length === 0) return null

  return (
    <div className="border-t border-[#2a475e] mt-8 pt-4">
      <button
        onClick={() => setOpen(prev => !prev)}
        className="flex items-center gap-2 text-xs text-[#8f98a0] hover:text-[#c6d4df] transition-colors"
      >
        {open ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
        Photo Credits ({credits.length})
      </button>

      {open && (
        <div className="mt-3 space-y-1">
          {credits.map((credit, i) => (
            <div key={i} className="flex items-start gap-2 text-xs text-[#8f98a0]">
              <span className="text-[#4a6a82] flex-shrink-0">📷</span>
              <span>
                <span className="text-[#acb2b8]">{credit.author}</span>
                {' · '}
                <span>{credit.license}</span>
                {credit.sourceUrl && (
                  <>
                    {' · '}
                    
                      <a href={credit.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#66c0f4] hover:underline"
                    >
                      Source
                    </a>
                  </>
                )}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}