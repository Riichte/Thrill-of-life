'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { Search, Menu, X, Palette } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import type { User } from '@supabase/supabase-js'
import { useUnit } from '@/lib/unitContext'
import { useTheme, themes } from '@/lib/themeContext'


export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [language, setLanguage] = useState<'EN' | 'FR'>('EN')
  const { unit, setUnit } = useUnit()
  const { theme, setTheme } = useTheme()
  const [themeOpen, setThemeOpen] = useState(false)
  const themeRef = useRef<HTMLDivElement>(null)
  const [user, setUser] = useState<User | null>(null)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const router = useRouter()
  const pathname = usePathname()
  const supabase = createClient()
  const [searchQuery, setSearchQuery] = useState('')
  const [suggestions, setSuggestions] = useState<{ parks: any[], items: any[] }>({ parks: [], items: [] })
  const [showSuggestions, setShowSuggestions] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)

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
      if (themeRef.current && !themeRef.current.contains(e.target as Node)) {
        setThemeOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    if (searchQuery.length < 2) { setSuggestions({ parks: [], items: [] }); return }
    const timeout = setTimeout(async () => {
      const [{ data: parks }, { data: items }] = await Promise.all([
        supabase.from('parks').select('id, name, country').ilike('name', `%${searchQuery}%`).limit(3),
        supabase.from('items').select('id, name, category_id, park_id').ilike('name', `%${searchQuery}%`).limit(5),
      ])
      setSuggestions({ parks: parks ?? [], items: items ?? [] })
      setShowSuggestions(true)
    }, 250)
    return () => clearTimeout(timeout)
  }, [searchQuery])

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
    { name: '🎵 Soundtracks', href: '/soundtracks' },
  ]

  const handleSearchSubmit = (val: string) => {
    if (val.trim()) { setShowSuggestions(false); router.push(`/search?q=${encodeURIComponent(val.trim())}`) }
  }

  const themeIcons: Record<string, string> = {
    'dark-steam': '🌊',
    'dark-neon': '🔮',
    'light-blueprint': '📐',
    'light-tropical': '🌴',
  }

  const currentTheme = themes.find(t => t.id === theme)

  const SuggestionsDropdown = () => (
    (suggestions.parks.length > 0 || suggestions.items.length > 0) ? (
      <div className="absolute top-full left-0 right-0 mt-1 border border-gray-700 rounded-lg shadow-xl z-50 overflow-hidden" style={{ background: 'var(--bg-primary)' }}>
        {suggestions.parks.map(p => (
          <Link key={p.id} href={`/parks/${p.id}`} onClick={() => setShowSuggestions(false)}
            className="flex items-center gap-2 px-4 py-2.5 transition-colors hover:opacity-80">
            <span className="text-xs w-10 flex-shrink-0" style={{ color: 'var(--accent)' }}>Park</span>
            <span className="text-sm" style={{ color: 'var(--text-primary)' }}>{p.name}</span>
            <span className="text-xs ml-auto" style={{ color: 'var(--text-muted)' }}>{p.country}</span>
          </Link>
        ))}
        {suggestions.items.map(i => (
          <Link key={i.id} href={`/parks/${i.park_id}/${i.category_id}/${i.id}`} onClick={() => setShowSuggestions(false)}
            className="flex items-center gap-2 px-4 py-2.5 transition-colors hover:opacity-80">
            <span className="text-xs w-10 flex-shrink-0 capitalize truncate" style={{ color: 'var(--text-muted)' }}>{i.category_id.replace('_', ' ')}</span>
            <span className="text-sm" style={{ color: 'var(--text-primary)' }}>{i.name}</span>
          </Link>
        ))}
      </div>
    ) : null
  )

  return (
    <nav className="sticky top-0 z-50" style={{ background: 'var(--navbar-bg)', borderBottom: '1px solid var(--navbar-border)' }}>
      {/* Top Row */}
      <div className="px-4 py-3" style={{ background: 'var(--navbar-bg)' }}>
        <div className="container mx-auto">
          <div className="flex items-center justify-between gap-4">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 flex-shrink-0">
              <img
                src="/ThrillOfLife_Logo.jpg"
                alt="Thrill of Life logo"
                className="w-10 h-10 sm:w-12 sm:h-12 object-contain"
              />
              <span className="text-xl font-bold hidden sm:inline font-logo neon-text" style={{ color: 'var(--text-primary)' }}>
                Thrill of Life
              </span>
            </Link>

            {/* Search Bar */}
            <div className="hidden md:flex flex-1 max-w-md" ref={searchRef}>
              <div className="relative w-full">
                <input
                  type="text"
                  value={searchQuery}
                  placeholder="Search parks, rides, restaurants..."
                  className="w-full rounded-lg pl-4 pr-10 py-2 focus:outline-none text-sm"
                  style={{ background: 'var(--input-bg)', color: 'var(--text-primary)', border: '1px solid var(--input-border)' }}
                  onChange={e => setSearchQuery(e.target.value)}
                  onFocus={() => suggestions.parks.length + suggestions.items.length > 0 && setShowSuggestions(true)}
                  onKeyDown={e => { if (e.key === 'Enter') handleSearchSubmit(searchQuery) }}
                />
                <Search className="absolute right-3 top-2.5 w-4 h-4" style={{ color: 'var(--text-muted)' }} />
                {showSuggestions && <SuggestionsDropdown />}
              </div>
            </div>

            {/* Right Side */}
            <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">

              {/* Language */}
              <div className="flex items-center rounded-lg p-1" style={{ background: 'var(--bg-elevated)' }}>
                {(['EN', 'FR'] as const).map(lang => (
                  <button key={lang} onClick={() => setLanguage(lang)}
                    className="px-3 py-1 rounded text-sm font-medium transition-colors"
                    style={{ background: language === lang ? 'var(--cta)' : 'transparent', color: language === lang ? 'var(--cta-text)' : 'var(--text-muted)' }}>
                    {lang}
                  </button>
                ))}
              </div>

              {/* Units */}
              <div className="flex items-center rounded-lg p-1" style={{ background: 'var(--bg-elevated)' }}>
                {(['metric', 'imperial'] as const).map((u, i) => (
                  <button key={u} onClick={() => setUnit(u)}
                    className="px-3 py-1 rounded text-sm font-medium transition-colors"
                    style={{ background: unit === u ? 'var(--cta)' : 'transparent', color: unit === u ? 'var(--cta-text)' : 'var(--text-muted)' }}>
                    {u === 'metric' ? 'm' : 'ft'}
                  </button>
                ))}
              </div>

              {/* Theme switcher */}
              <div className="relative" ref={themeRef}>
                <button
                  onClick={() => setThemeOpen(p => !p)}
                  className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors"
                  style={{ background: 'var(--bg-elevated)', color: 'var(--text-muted)' }}
                  title="Switch theme"
                >
                  <span className="text-base leading-none">{themeIcons[theme]}</span>
                  <span className="hidden sm:inline text-xs">{currentTheme?.label}</span>
                </button>

                {themeOpen && (
                  <div className="absolute right-0 mt-2 w-44 rounded-lg shadow-xl z-50 overflow-hidden border"
                    style={{ background: 'var(--bg-primary)', borderColor: 'var(--border)' }}>
                    <div className="px-3 py-2 text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
                      Theme
                    </div>
                    {themes.map(t => (
                      <button key={t.id} onClick={() => { setTheme(t.id); setThemeOpen(false) }}
                        className="w-full text-left flex items-center gap-2 px-3 py-2.5 text-sm transition-colors"
                        style={{
                          background: theme === t.id ? 'var(--accent-bg)' : 'transparent',
                          color: theme === t.id ? 'var(--accent)' : 'var(--text-secondary)',
                          borderLeft: theme === t.id ? '2px solid var(--accent)' : '2px solid transparent',
                        }}>
                        <span>{themeIcons[t.id]}</span>
                        <div>
                          <div className="font-medium">{t.label}</div>
                          <div className="text-xs opacity-60">{t.dark ? 'Dark' : 'Light'}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Auth */}
              {user ? (
                <div className="relative hidden sm:block" ref={dropdownRef}>
                  <button onClick={() => setDropdownOpen(p => !p)}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                    style={{ background: 'var(--bg-elevated)', color: 'var(--text-secondary)' }}>
                    <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
                      style={{ background: 'var(--accent)', color: 'var(--bg-tertiary)' }}>
                      {username[0].toUpperCase()}
                    </div>
                    {username}
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M6 9l6 6 6-6" />
                    </svg>
                  </button>

                  {dropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 rounded-lg shadow-xl z-50 overflow-hidden border"
                      style={{ background: 'var(--bg-primary)', borderColor: 'var(--border)' }}>
                      {[
                        { href: '/dashboard', label: 'Dashboard' },
                        { href: '/profile', label: 'My Profile' },
                        { href: '/submit', label: 'Submit an Image' },
                      ].map(item => (
                        <Link key={item.href} href={item.href} onClick={() => setDropdownOpen(false)}
                          className="block px-4 py-3 text-sm transition-colors hover:opacity-80"
                          style={{ color: 'var(--text-secondary)' }}>
                          {item.label}
                        </Link>
                      ))}
                      <div style={{ borderTop: '1px solid var(--border)' }} />
                      <button onClick={handleLogout}
                        className="w-full text-left px-4 py-3 text-sm transition-colors"
                        style={{ color: 'var(--score-low)' }}>
                        Sign out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link href={`/auth/login?redirect=${encodeURIComponent(pathname)}`}
                  className="px-4 py-2 rounded-lg font-medium text-sm transition-colors hidden sm:inline-block"
                  style={{ background: 'var(--cta)', color: 'var(--cta-text)' }}>
                  Login
                </Link>
              )}

              {/* Mobile icons */}
              <button className="md:hidden p-2" style={{ color: 'var(--text-muted)' }}>
                <Search className="w-5 h-5" />
              </button>
              <button onClick={() => setIsOpen(!isOpen)} className="md:hidden p-2" style={{ color: 'var(--text-muted)' }}>
                {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Mobile Search */}
          <div className="md:hidden mt-3" ref={searchRef}>
            <div className="relative w-full">
              <input
                type="text"
                value={searchQuery}
                placeholder="Search parks, rides..."
                className="w-full rounded-lg pl-4 pr-10 py-2 focus:outline-none text-sm"
                style={{ background: 'var(--input-bg)', color: 'var(--text-primary)', border: '1px solid var(--input-border)' }}
                onChange={e => setSearchQuery(e.target.value)}
                onFocus={() => suggestions.parks.length + suggestions.items.length > 0 && setShowSuggestions(true)}
                onKeyDown={e => { if (e.key === 'Enter') handleSearchSubmit(searchQuery) }}
              />
              <Search className="absolute right-3 top-2.5 w-4 h-4" style={{ color: 'var(--text-muted)' }} />
              {showSuggestions && <SuggestionsDropdown />}
            </div>
          </div>
        </div>
      </div>

      {/* Category Nav */}
      <div style={{ background: 'var(--subnav-bg)', borderTop: '1px solid var(--navbar-border)' }}>
        <div className="container mx-auto">
          <div className="hidden md:flex items-center px-4 py-0">
            {categories.map((cat) => (
              <Link key={cat.name} href={cat.href}
                className="px-4 py-3 text-sm font-medium border-b-2 border-transparent transition-colors whitespace-nowrap hover:opacity-100"
                style={{ color: 'var(--text-muted)', borderColor: 'transparent' }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--accent)')}
                onMouseLeave={e => (e.currentTarget.style.borderColor = 'transparent')}>
                {cat.name}
              </Link>
            ))}
            <div className="mx-2 h-4 w-px" style={{ background: 'var(--border)' }} />
            <Link href="/leaderboard"
              className="px-4 py-3 text-sm font-medium border-b-2 border-transparent transition-colors whitespace-nowrap"
              style={{ color: '#f59e0b' }}>
              🏆 Leaderboard
            </Link>
          </div>

          {isOpen && (
            <div className="md:hidden px-4 py-2 space-y-2" style={{ background: 'var(--bg-secondary)' }}>
              {categories.map((cat) => (
                <Link key={cat.name} href={cat.href}
                  className="block py-2 px-2 rounded text-sm font-medium transition-colors"
                  style={{ color: 'var(--text-secondary)' }}
                  onClick={() => setIsOpen(false)}>
                  {cat.name}
                </Link>
              ))}
              <div style={{ borderTop: '1px solid var(--border)', paddingTop: '8px' }}>
                <Link href="/leaderboard"
                  className="block py-2 px-2 rounded text-sm font-medium"
                  style={{ color: '#f59e0b' }}
                  onClick={() => setIsOpen(false)}>
                  🏆 Leaderboard
                </Link>
              </div>
              {/* Mobile theme picker */}
              <div style={{ borderTop: '1px solid var(--border)', paddingTop: '8px' }}>
                <p className="text-xs font-semibold uppercase tracking-wider px-2 pb-2" style={{ color: 'var(--text-muted)' }}>Theme</p>
                <div className="grid grid-cols-2 gap-2">
                  {themes.map(t => (
                    <button key={t.id} onClick={() => { setTheme(t.id); setIsOpen(false) }}
                      className="flex items-center gap-2 py-2 px-2 rounded text-sm"
                      style={{ background: theme === t.id ? 'var(--accent-bg)' : 'transparent', color: theme === t.id ? 'var(--accent)' : 'var(--text-secondary)' }}>
                      <span>{themeIcons[t.id]}</span>{t.label}
                    </button>
                  ))}
                </div>
              </div>
              {user ? (
                <>
                  <Link href="/profile" className="block py-2 px-2 text-sm" style={{ color: 'var(--text-secondary)' }} onClick={() => setIsOpen(false)}>
                    My Profile ({username})
                  </Link>
                  <button onClick={handleLogout} className="block w-full text-left py-2 px-2 text-sm" style={{ color: 'var(--score-low)' }}>
                    Sign out
                  </button>
                </>
              ) : (
                <Link href={`/auth/login?redirect=${encodeURIComponent(pathname)}`}
                  className="block mt-4 px-4 py-2 rounded-lg font-medium text-sm text-center"
                  style={{ background: 'var(--cta)', color: 'var(--cta-text)' }}
                  onClick={() => setIsOpen(false)}>
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