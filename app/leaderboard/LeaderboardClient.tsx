'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ThumbsUp, Award, Crown } from 'lucide-react'

type LeaderboardEntry = {
  rank: number
  userId: string
  username: string
  score: number
}

const TABS = [
  { key: 'helpful', label: 'Most Helpful', icon: ThumbsUp, color: 'text-[#66c0f4]', unit: 'helpful votes' },
  { key: 'awarded', label: 'Most Awarded', icon: Award, color: 'text-yellow-400', unit: 'awards received' },
] as const

type TabKey = typeof TABS[number]['key']

function rankStyle(rank: number) {
  if (rank === 1) return 'text-yellow-400 font-bold text-lg'
  if (rank === 2) return 'text-gray-300 font-semibold'
  if (rank === 3) return 'text-amber-600 font-semibold'
  return 'text-gray-500'
}

function rankBg(rank: number) {
  if (rank === 1) return 'bg-yellow-400/10 border-yellow-400/30'
  if (rank === 2) return 'bg-gray-400/10 border-gray-400/20'
  if (rank === 3) return 'bg-amber-700/10 border-amber-600/20'
  return 'bg-[#16202d] border-white/5'
}

function LeaderboardTable({ entries, unit, icon: Icon, color }: {
  entries: LeaderboardEntry[]
  unit: string
  icon: typeof ThumbsUp
  color: string
}) {
  if (!entries.length) {
    return (
      <div className="py-16 text-center text-gray-500">
        No data yet — be the first to get {unit}!
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {entries.map(entry => (
        <div
          key={entry.userId}
          className={`flex items-center gap-4 rounded-lg border px-5 py-3.5 transition hover:brightness-110 ${rankBg(entry.rank)}`}
        >
          {/* Rank */}
          <div className={`w-8 text-center ${rankStyle(entry.rank)}`}>
            {entry.rank <= 3
              ? <Crown className={`inline h-5 w-5 ${entry.rank === 1 ? 'text-yellow-400' : entry.rank === 2 ? 'text-gray-300' : 'text-amber-600'}`} />
              : `#${entry.rank}`
            }
          </div>

          {/* Username */}
          <div className="flex-1">
            <Link
              href={`/users/${entry.userId}`}
              className="font-medium text-white hover:text-[#66c0f4] transition"
            >
              {entry.username}
            </Link>
          </div>

          {/* Score */}
          <div className={`flex items-center gap-1.5 text-sm font-semibold ${color}`}>
            <Icon className="h-4 w-4" />
            <span>{entry.score}</span>
            <span className="text-xs font-normal text-gray-500">{unit}</span>
          </div>
        </div>
      ))}
    </div>
  )
}

export function LeaderboardClient({
  helpful,
  awarded,
}: {
  helpful: LeaderboardEntry[]
  awarded: LeaderboardEntry[]
}) {
  const [activeTab, setActiveTab] = useState<TabKey>('helpful')
  const tab = TABS.find(t => t.key === activeTab)!

  const data = activeTab === 'helpful' ? helpful : awarded

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <div className="border-b border-white/10 bg-[#0a0f16]">
        <div className="container mx-auto px-4 py-10 text-center md:py-14">
          <h1 className="font-logo text-4xl font-bold tracking-tight text-white md:text-5xl">
            Leaderboard
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-gray-400">
            The most active and celebrated members of the community.
          </p>
        </div>
      </div>

      <div className="container mx-auto max-w-2xl px-4 py-10">
        {/* Tabs */}
        <div className="mb-8 flex gap-2 rounded-lg border border-white/10 bg-[#16202d] p-1">
          {TABS.map(t => (
            <button
              key={t.key}
              onClick={() => setActiveTab(t.key)}
              className={`flex flex-1 items-center justify-center gap-2 rounded-md px-4 py-2.5 text-sm font-medium transition ${
                activeTab === t.key
                  ? 'bg-[#1b2838] text-white shadow'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <t.icon className={`h-4 w-4 ${activeTab === t.key ? t.color : ''}`} />
              {t.label}
            </button>
          ))}
        </div>

        {/* Table */}
        <LeaderboardTable
          entries={data}
          unit={tab.unit}
          icon={tab.icon}
          color={tab.color}
        />
      </div>
    </div>
  )
}