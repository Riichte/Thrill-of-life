'use client'

import { useState } from 'react'

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

const ratingDimensions: Record<string, RatingDimension[]> = {
  rides: [
    { id: 'thrill', label: 'Thrill Level', communityAverage: 82 },
    { id: 'queue', label: 'Queue Experience', communityAverage: 65 },
    { id: 'comfort', label: 'Ride Comfort', communityAverage: 71 },
    { id: 'overall', label: 'Overall Experience', communityAverage: 78 }
  ],
  restaurants: [
    { id: 'food', label: 'Food Quality', communityAverage: 79 },
    { id: 'service', label: 'Service', communityAverage: 75 },
    { id: 'value', label: 'Value for Money', communityAverage: 68 },
    { id: 'atmosphere', label: 'Atmosphere', communityAverage: 81 }
  ],
  shows: [
    { id: 'performance', label: 'Performance Quality', communityAverage: 84 },
    { id: 'entertainment', label: 'Entertainment Value', communityAverage: 86 },
    { id: 'audience', label: 'Audience Experience', communityAverage: 80 }
  ],
  hotels: [
    { id: 'room', label: 'Room Quality', communityAverage: 77 },
    { id: 'service', label: 'Service', communityAverage: 74 },
    { id: 'value', label: 'Value for Money', communityAverage: 70 },
    { id: 'location', label: 'Location', communityAverage: 85 }
  ],
  shops: [
    { id: 'quality', label: 'Product Quality', communityAverage: 76 },
    { id: 'value', label: 'Value for Money', communityAverage: 69 },
    { id: 'selection', label: 'Selection', communityAverage: 80 }
  ]
}

export default function RatingComponent({
  item,
  category
}: {
  item: Item
  category: Category
}) {
  const dimensions = ratingDimensions[item.category_id] || ratingDimensions.rides
  const [userRatings, setUserRatings] = useState<Record<string, number>>(
    dimensions.reduce((acc, dim) => ({ ...acc, [dim.id]: 50 }), {})
  )

  const handleRatingChange = (dimensionId: string, value: number) => {
    setUserRatings(prev => ({ ...prev, [dimensionId]: value }))
  }

  const calculateAverage = (dimensionId: string): number => {
    const dimension = dimensions.find(d => d.id === dimensionId)
    if (!dimension) return 0
    
    const userScore = userRatings[dimensionId] || 0
    const communityScore = dimension.communityAverage
    
    // Blend: 40% user, 60% community (since they just started rating)
    return Math.round(userScore * 0.4 + communityScore * 0.6)
  }

  const overallScore = Math.round(
    dimensions.reduce((sum, dim) => sum + calculateAverage(dim.id), 0) / dimensions.length
  )

  return (
    <div className="bg-gray-800 p-8 rounded-lg mb-8">
      {/* Overall Score */}
      <div className="mb-8 text-center">
        <div className="inline-block">
          <div className="text-6xl font-bold text-blue-400 mb-2">{overallScore}</div>
          <div className="text-gray-300 text-lg">Overall Rating</div>
        </div>
      </div>

      {/* Rating Dimensions */}
      <div className="space-y-6">
        {dimensions.map(dimension => {
          const userScore = userRatings[dimension.id] || 0
          const blendedScore = calculateAverage(dimension.id)

          return (
            <div key={dimension.id} className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-lg font-semibold text-gray-100">
                  {dimension.label}
                </label>
                <div className="flex gap-4 items-center">
                  <div className="text-right">
                    <div className="text-2xl font-bold text-blue-400">
                      {blendedScore}
                    </div>
                    <div className="text-xs text-gray-500">
                      Community: {dimension.communityAverage}
                    </div>
                  </div>
                </div>
              </div>

              {/* Slider */}
              <div className="flex items-center gap-4">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={userScore}
                  onChange={e => handleRatingChange(dimension.id, parseInt(e.target.value))}
                  className="flex-1 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                  style={{
                    background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${userScore}%, #374151 ${userScore}%, #374151 100%)`
                  }}
                />
                <div className="text-sm text-gray-400 w-12 text-right">{userScore}</div>
              </div>

              {/* Score indicator */}
              <div className="h-1 bg-gray-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-red-500 via-yellow-500 to-green-500"
                  style={{ width: `${blendedScore}%` }}
                ></div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Info text */}
      <div className="mt-8 p-4 bg-gray-700 rounded-lg text-sm text-gray-300">
        <p>✓ Your ratings are blended with {dimensions.length} community dimensions to create a fair overall score.</p>
      </div>
    </div>
  )
}
