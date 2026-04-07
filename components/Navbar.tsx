'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Search, Menu, X, Globe } from 'lucide-react'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [language, setLanguage] = useState<'EN' | 'FR'>('EN')

  const categories = [
    { name: 'Parks', href: '/parks' },
    { name: 'Roller Coasters', href: '/parks?filter=rides' },
    { name: 'Flat Rides', href: '/parks?filter=rides' },
    { name: 'Dark Rides', href: '/parks?filter=rides' },
    { name: 'Restaurants', href: '/parks?filter=restaurants' },
    { name: 'Shows', href: '/parks?filter=shows' },
    { name: 'Hotels', href: '/parks?filter=hotels' },
    { name: 'Shops', href: '/parks?filter=shops' }
  ]

  return (
    <nav className="sticky top-0 z-50 bg-gray-900 border-b border-gray-800">
      {/* Top Row */}
      <div className="bg-gray-900 px-4 py-3">
        <div className="container mx-auto">
          <div className="flex items-center justify-between gap-4">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 flex-shrink-0">
              <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">TP</span>
              </div>
              <span className="text-xl font-bold text-white hidden sm:inline">ToPark</span>
            </Link>

            {/* Search Bar (hidden on mobile) */}
            <div className="hidden md:flex flex-1 max-w-md">
              <div className="relative w-full">
                <input
                  type="text"
                  placeholder="Search parks, rides, restaurants..."
                  className="w-full bg-gray-800 text-white placeholder-gray-500 rounded-lg pl-4 pr-10 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
                <Search className="absolute right-3 top-2.5 w-4 h-4 text-gray-500" />
              </div>
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
              {/* Language Selector */}
              <div className="flex items-center bg-gray-800 rounded-lg p-1">
                <button
                  onClick={() => setLanguage('EN')}
                  className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                    language === 'EN'
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  EN
                </button>
                <button
                  onClick={() => setLanguage('FR')}
                  className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                    language === 'FR'
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  FR
                </button>
              </div>

              {/* Profile/Login Button */}
              <Link
                href="/auth/login"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium text-sm transition-colors hidden sm:inline-block"
              >
                Login
              </Link>

              {/* Mobile Search Icon */}
              <button className="md:hidden p-2 text-gray-400 hover:text-white">
                <Search className="w-5 h-5" />
              </button>

              {/* Hamburger Menu */}
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="md:hidden p-2 text-gray-400 hover:text-white"
              >
                {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Mobile Search Bar */}
          <div className="md:hidden mt-3">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search parks, rides..."
                className="w-full bg-gray-800 text-white placeholder-gray-500 rounded-lg pl-4 pr-10 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
              <Search className="absolute right-3 top-2.5 w-4 h-4 text-gray-500" />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Row - Category Navigation */}
      <div className="bg-gray-800 border-t border-gray-700">
        <div className="container mx-auto">
          {/* Desktop Categories */}
          <div className="hidden md:flex px-4 py-0">
            {categories.map((cat) => (
              <Link
                key={cat.name}
                href={cat.href}
                className="text-gray-300 hover:text-white px-4 py-3 text-sm font-medium border-b-2 border-transparent hover:border-blue-500 transition-colors whitespace-nowrap"
              >
                {cat.name}
              </Link>
            ))}
          </div>

          {/* Mobile Categories Menu */}
          {isOpen && (
            <div className="md:hidden px-4 py-2 space-y-2 bg-gray-900">
              {categories.map((cat) => (
                <Link
                  key={cat.name}
                  href={cat.href}
                  className="block text-gray-300 hover:text-white py-2 px-2 rounded hover:bg-gray-800 transition-colors text-sm font-medium"
                  onClick={() => setIsOpen(false)}
                >
                  {cat.name}
                </Link>
              ))}
              <Link
                href="/auth/login"
                className="block mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium text-sm transition-colors text-center"
                onClick={() => setIsOpen(false)}
              >
                Login
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}
