'use client'

import React, { useState, useEffect, useRef } from 'react'

const LeftChevronIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="15 18 9 12 15 6"/>
  </svg>
)

const RightChevronIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 18 15 12 9 6"/>
  </svg>
)

const HomeMarqueeRow = () => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const timeoutRef = useRef(null)
  const itemsPerSlide = 3
  const autoAdvanceInterval = 5000

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % Math.ceil(items.length / itemsPerSlide))
  }

  const handlePrev = () => {
    setCurrentIndex((prev) =>
      prev === 0
        ? Math.floor(items.length / itemsPerSlide)
        : prev - 1
    )
  }

  useEffect(() => {
    timeoutRef.current = setTimeout(() => {
      handleNext()
    }, autoAdvanceInterval)
    return () => clearTimeout(timeoutRef.current)
  }, [currentIndex])

  const items = [
    { id: 1, name: 'Item 1' },
    { id: 2, name: 'Item 2' },
    { id: 3, name: 'Item 3' },
    { id: 4, name: 'Item 4' },
    { id: 5, name: 'Item 5' },
    { id: 6, name: 'Item 6' }
  ]

  const startIndex = currentIndex * itemsPerSlide
  const endIndex = startIndex + itemsPerSlide

  return (
    <div className="relative overflow-hidden w-full">
      {/* Arrow buttons */}
      <button
        onClick={handlePrev}
        className="absolute left-3 top-1/2 transform -translate-y-1/2 rounded-full w-10 h-10 bg-black/50 hover:bg-black/80 border border-white/20 backdrop-blur-sm z-10"
      >
        <LeftChevronIcon />
      </button>
      <button
        onClick={handleNext}
        className="absolute right-3 top-1/2 transform -translate-y-1/2 rounded-full w-10 h-10 bg-black/50 hover:bg-black/80 border border-white/20 backdrop-blur-sm z-10"
      >
        <RightChevronIcon />
      </button>
      {/* Carousel container */}
      <div
        className="flex justify-center space-x-4 transition-transform duration-500"
        style={{
          transform: `translateX(-${startIndex * 100}%)`,
        }}
      >
        {items.slice(startIndex, endIndex).map((item, index) => (
          <Card key={index} item={item} className="max-w-sm" />
        ))}
      </div>
    </div>
  )
}

export default HomeMarqueeRow

