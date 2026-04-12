'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

interface Item {
  id: string
  category_id: string
  name: string
}

interface Category {
  id: string
  name: string
}

interface RatingDimension {
  id: string
  label: string
  communityAverage: number
}

const ratingDimensions: Record<string, { id: string; label: string }[]> = {
  rides: [
    { id: 'intensity', label: 'Intensity' },
    { id: 'comfort', label: 'Comfort' },
    { id: 'theming', label: 'Theming' },
    { id: 'fun_factor', label: 'Fun Factor' },
    { id: 'capacity', label: 'Capacity' },
  ],
  roller_coasters: [
    { id: 'intensity', label: 'Intensity' },
    { id: 'comfort', label: 'Comfort' },
    { id: 'theming', label: 'Theming' },
    { id: 'fun_factor', label: 'Fun Factor' },
    { id: 'capacity', label: 'Capacity' },
  ],
  flat_rides: [
    { id: 'intensity', label: 'Intensity' },
    { id: 'comfort', label: 'Comfort' },
    { id: 'theming', label: 'Theming' },
    { id: 'fun_factor', label: 'Fun Factor' },
    { id: 'capacity', label: 'Capacity' },
  ],
  water_rides: [
    { id: 'intensity', label: 'Intensity' },
    { id: 'comfort', label: 'Comfort' },
    { id: 'theming', label: 'Theming' },
    { id: 'fun_factor', label: 'Fun Factor' },
    { id: 'capacity', label: 'Capacity' },
  ],
  dark_rides: [
    { id: 'theming', label: 'Theming' },
    { id: 'fun_factor', label: 'Fun Factor' },
    { id: 'capacity', label: 'Capacity' },
    { id: 'technology', label: 'Technology / Effects' },
    { id: 'story', label: 'Story / Immersion' },
  ],
  shows: [
    { id: 'theming', label: 'Theming' },
    { id: 'fun_factor', label: 'Fun Factor' },
    { id: 'capacity', label: 'Capacity' },
    { id: 'story', label: 'Story / Immersion' },
    { id: 'technology', label: 'Technology / Effects' },
  ],
  restaurants: [
    { id: 'food_quality', label: 'Food Quality' },
    { id: 'value', label: 'Value' },
    { id: 'wait_time', label: 'Speed / Wait Time' },
    { id: 'atmosphere', label: 'Atmosphere' },
    { id: 'service', label: 'Service' },
  ],
  hotels: [
    { id: 'comfort', label: 'Comfort' },
    { id: 'value', label: 'Value' },
    { id: 'atmosphere', label: 'Atmosphere' },
    { id: 'service', label: 'Service' },
    { id: 'cleanliness', label: 'Cleanliness' },
  ],
  shops: [
    { id: 'value', label: 'Value' },
    { id: 'atmosphere', label: 'Atmosphere' },
    { id: 'service', label: 'Service' },
    { id: 'product_quality', label: 'Product Quality' },
  ],
  parks: [
    { id: 'theming', label: 'Theming' },
    { id: 'value', label: 'Value' },
    { id: 'cleanliness', label: 'Cleanliness' },
    { id: 'service', label: 'Staff / Service' },
    { id: 'overall_experience', label: 'Overall Experience' },
  ],
}

export default function RatingComponent({
  item,
  category
}: {
  item: Item
  category: Category
}) {
  const dimensions = ratingDimensions[item.category_id] || ratingDimensions.rides

  const [isOpen, setIsOpen] = useState(false)
  const [hasRated, setHasRated] = useState(false)
  const [userRatings, setUserRatings] = useState<Record<string, number>>(
    dimensions.reduce((acc, dim) => ({ ...acc, [dim.id]: 50 }), {})
  )
  const [submittedScore, setSubmittedScore] = useState<number | null>(null)

  const handleRatingChange = (dimensionId: string, value: number) => {
    setUserRatings(prev => ({ ...prev, [dimensionId]: value }))
  }

  const calculateOverall = (): number => {
    return Math.round(
      dimensions.reduce((sum, dim) => sum + (userRatings[dim.id] || 0), 0) / dimensions.length
    )
  }

  const handleSubmit = () => {
    setSubmittedScore(calculateOverall())
    setHasRated(true)
    setIsOpen(false)
  }

  const score = submittedScore ?? 0

  return (
    <>
      {/* Rate button + My Score circle */}
      <div className="flex items-center gap-6 bg-[#1b2838] border border-[#2a475e] rounded-sm p-6">
        {/* My Score circle */}
        <div
          className="relative flex h-24 w-24 shrink-0 items-center justify-center rounded-full"
          style={{
            background: hasRated
              ? `conic-gradient(#66c0f4 ${score * 3.6}deg, #2a475e 0)`
              : '#2a475e'
          }}
        >
          <div className="flex h-[82px] w-[82px] items-center justify-center rounded-full bg-[#1b2838]">
            {hasRated ? (
              <span className="text-3xl font-bold text-[#66c0f4]">{score}</span>
            ) : (
              <span className="text-2xl text-[#4a6a82]">—</span>
            )}
          </div>
        </div>

        {/* Label + button */}
        <div className="flex flex-col gap-3">
          <div>
            <p className="text-[10px] font-medium uppercase tracking-wider text-[#8f98a0]">My Score</p>
            <p className="text-sm text-[#c6d4df]">
              {hasRated ? 'Your rating has been submitted' : 'You have not rated this yet'}
            </p>
          </div>
          <button
            onClick={() => setIsOpen(true)}
            className="w-fit bg-[#4c6b22] hover:bg-[#5a7a28] text-white text-sm font-medium px-5 py-2 rounded-sm transition-colors"
          >
            {hasRated ? 'Edit your rating' : 'Rate this ride'}
          </button>
        </div>
      </div>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/70"
            onClick={() => setIsOpen(false)}
          />

          {/* Panel */}
          <div className="relative z-10 w-full max-w-lg bg-[#1b2838] border border-[#2a475e] rounded-sm shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[#2a475e] px-6 py-4">
              <h2 className="text-lg font-semibold text-[#c6d4df]">Rate {item.name}</h2>
              <button
                onClick={() => setIsOpen(false)}
                className="text-[#8f98a0] hover:text-white text-xl leading-none"
              >
                ✕
              </button>
            </div>

            {/* Sliders */}
            <div className="px-6 py-5 space-y-6 max-h-[60vh] overflow-y-auto">
              {dimensions.map(dimension => {
                const userScore = userRatings[dimension.id] || 0
                return (
                  <div key={dimension.id} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <label className="text-sm font-medium text-[#c6d4df]">
                        {dimension.label}
                      </label>
                      <span className="text-lg font-bold text-[#66c0f4] w-10 text-right">
                        {userScore}
                      </span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={userScore}
                      onChange={e => handleRatingChange(dimension.id, parseInt(e.target.value))}
                      className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
                      style={{
                        background: `linear-gradient(to right, #66c0f4 0%, #66c0f4 ${userScore}%, #2a475e ${userScore}%, #2a475e 100%)`
                      }}
                    />
                  </div>
                )
              })}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between border-t border-[#2a475e] px-6 py-4">
              <div className="text-sm text-[#8f98a0]">
                Your score: <span className="text-[#66c0f4] font-bold">{calculateOverall()}</span>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2 text-sm text-[#8f98a0] hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  className="px-5 py-2 bg-[#4c6b22] hover:bg-[#5a7a28] text-white text-sm font-medium rounded-sm transition-colors"
                >
                  Submit rating
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}