'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { Search, Menu, X } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import type { User } from '@supabase/supabase-js'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [language, setLanguage] = useState<'EN' | 'FR'>('EN')
  const [user, setUser] = useState<User | null>(null)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const router = useRouter()
  const pathname = usePathname()
  const supabase = createClient()

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user))
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })
    return () => subscription.unsubscribe()
  }, [])

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    setDropdownOpen(false)
    router.push('/')
    router.refresh()
  }

  const username = user?.user_metadata?.username ?? user?.email?.split('@')[0] ?? 'Account'

  const categories = [
    { name: 'Parks', href: '/parks' },
    { name: 'Roller Coasters', href: '/category/roller-coasters' },
    { name: 'Water Rides', href: '/category/water-rides' },
    { name: 'Flat Rides', href: '/category/flat-rides' },
    { name: 'Dark Rides', href: '/category/dark-rides' },
    { name: 'Restaurants', href: '/category/restaurants' },
    { name: 'Shows', href: '/category/shows' },
    { name: 'Shops', href: '/category/shops' },
    { name: 'Hotels', href: '/category/hotels' },
  ]

  return (
    <nav className="sticky top-0 z-50 bg-gray-900 border-b border-gray-800">
      {/* Top Row */}
      <div className="bg-gray-900 px-4 py-3">
        <div className="container mx-auto">
          <div className="flex items-center justify-between gap-4">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 flex-shrink-0">
              <img
                src="/ThrillOfLife_Logo.jpg"
                alt="Thrill of Life logo"
                className="w-10 h-10 sm:w-12 sm:h-12 object-contain"
              />
              <span className="text-xl font-bold text-white hidden sm:inline font-logo">Thrill of Life</span>
            </Link>

            {/* Search Bar */}
            <div className="hidden md:flex flex-1 max-w-md">
              <div className="relative w-full">
                <input
                  type="text"
                  placeholder="Search parks, rides, restaurants..."
                  className="w-full bg-gray-800 text-white placeholder-gray-500 rounded-lg pl-4 pr-10 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  onKeyDown={e => {
                    if (e.key === 'Enter') {
                      const val = (e.target as HTMLInputElement).value.trim()
                      if (val) router.push(`/search?q=${encodeURIComponent(val)}`)
                    }
                  }}
                />
                <Search className="absolute right-3 top-2.5 w-4 h-4 text-gray-500" />
              </div>
            </div>

            {/* Right Side */}
            <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
              {/* Language */}
              <div className="flex items-center bg-gray-800 rounded-lg p-1">
                <button
                  onClick={() => setLanguage('EN')}
                  className={`px-3 py-1 rounded text-sm font-medium transition-colors ${language === 'EN' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'}`}
                >
                  EN
                </button>
                <button
                  onClick={() => setLanguage('FR')}
                  className={`px-3 py-1 rounded text-sm font-medium transition-colors ${language === 'FR' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'}`}
                >
                  FR
                </button>
              </div>

              {/* Auth */}
              {user ? (
                <div className="relative hidden sm:block" ref={dropdownRef}>
                  <button
                    onClick={() => setDropdownOpen(p => !p)}
                    className="flex items-center gap-2 bg-[#2a475e] hover:bg-[#3d6a8a] text-[#c6d4df] px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                  >
                    <div className="w-6 h-6 rounded-full bg-[#66c0f4] flex items-center justify-center text-[#1b2838] text-xs font-bold">
                      {username[0].toUpperCase()}
                    </div>
                    {username}
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M6 9l6 6 6-6" />
                    </svg>
                  </button>

                  {dropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-[#1b2838] border border-[#2a475e] rounded-sm shadow-xl z-50">
                      <Link
                        href="/dashboard"
                        onClick={() => setDropdownOpen(false)}
                        className="block px-4 py-3 text-sm text-[#c6d4df] hover:bg-[#2a475e] hover:text-white transition-colors"
                      >
                        Dashboard
                      </Link>
                      <Link
                        href="/profile"
                        onClick={() => setDropdownOpen(false)}
                        className="block px-4 py-3 text-sm text-[#c6d4df] hover:bg-[#2a475e] hover:text-white transition-colors"
                      >
                        My Profile
                      </Link>
                      <div className="border-t border-[#2a475e]" />
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-3 text-sm text-red-400 hover:bg-[#2a475e] hover:text-red-300 transition-colors"
                      >
                        Submission
                        <Link
                          href="/submit"
                          onClick={() => setDropdownOpen(false)}
                          className="block px-4 py-3 text-sm text-[#c6d4df] hover:bg-[#2a475e] hover:text-white transition-colors"
                        >
                          📸 Submit an Image
                        </Link>
                        <div className="border-t border-[#2a475e]" />

                        Sign out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  href={`/auth/login?redirect=${encodeURIComponent(pathname)}`}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium text-sm transition-colors hidden sm:inline-block"
                >
                  Login
                </Link>
              )}

              {/* Mobile icons */}
              <button className="md:hidden p-2 text-gray-400 hover:text-white">
                <Search className="w-5 h-5" />
              </button>
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="md:hidden p-2 text-gray-400 hover:text-white"
              >
                {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Mobile Search */}
          <div className="md:hidden mt-3">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search parks, rides..."
                className="w-full bg-gray-800 text-white placeholder-gray-500 rounded-lg pl-4 pr-10 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                onKeyDown={e => {
                  if (e.key === 'Enter') {
                    const val = (e.target as HTMLInputElement).value.trim()
                    if (val) router.push(`/search?q=${encodeURIComponent(val)}`)
                  }
                }}
              />
              <Search className="absolute right-3 top-2.5 w-4 h-4 text-gray-500" />
            </div>
          </div>
        </div>
      </div>

      {/* Category Nav */}
      <div className="bg-gray-800 border-t border-gray-700">
        <div className="container mx-auto">
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
              {user ? (
                <>
                  <Link href="/profile" className="block py-2 px-2 text-sm text-[#c6d4df]" onClick={() => setIsOpen(false)}>
                    My Profile ({username})
                  </Link>
                  <button onClick={handleLogout} className="block w-full text-left py-2 px-2 text-sm text-red-400">
                    Sign out
                  </button>
                </>
              ) : (
                <Link
                  href={`/auth/login?redirect=${encodeURIComponent(pathname)}`}
                  className="block mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium text-sm transition-colors text-center"
                  onClick={() => setIsOpen(false)}
                >
                  Login
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}