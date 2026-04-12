'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function Signup() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [username, setUsername] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { username }
      }
    })
    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      router.push('/auth/login?confirmed=1')
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-3">
            <img src="/ThrillOfLife_Logo.jpg" alt="Thrill of Life" className="w-12 h-12 object-contain" />
            <span className="text-2xl font-bold text-white font-logo">Thrill of Life</span>
          </Link>
        </div>

        <div className="bg-[#1b2838] border border-[#2a475e] rounded-sm p-8">
          <h1 className="text-2xl font-semibold text-[#c6d4df] mb-6">Create your account</h1>

          {error && (
            <div className="mb-4 px-4 py-3 bg-red-500/10 border border-red-500/30 rounded-sm text-red-400 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSignup} className="space-y-4">
            <div>
              <label className="block text-xs font-medium uppercase tracking-wider text-[#8f98a0] mb-1.5">
                Username
              </label>
              <input
                type="text"
                placeholder="YourUsername"
                value={username}
                onChange={e => setUsername(e.target.value)}
                required
                className="w-full bg-[#2a475e] border border-[#3d6a8a] rounded-sm px-3 py-2.5 text-sm text-[#c6d4df] placeholder-[#6a8a9a] focus:outline-none focus:border-[#66c0f4]"
              />
            </div>

            <div>
              <label className="block text-xs font-medium uppercase tracking-wider text-[#8f98a0] mb-1.5">
                Email
              </label>
              <input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                className="w-full bg-[#2a475e] border border-[#3d6a8a] rounded-sm px-3 py-2.5 text-sm text-[#c6d4df] placeholder-[#6a8a9a] focus:outline-none focus:border-[#66c0f4]"
              />
            </div>

            <div>
              <label className="block text-xs font-medium uppercase tracking-wider text-[#8f98a0] mb-1.5">
                Password
              </label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                minLength={6}
                className="w-full bg-[#2a475e] border border-[#3d6a8a] rounded-sm px-3 py-2.5 text-sm text-[#c6d4df] placeholder-[#6a8a9a] focus:outline-none focus:border-[#66c0f4]"
              />
              <p className="mt-1 text-[10px] text-[#8f98a0]">Minimum 6 characters</p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#4c6b22] hover:bg-[#5a7a28] disabled:opacity-50 text-white font-medium py-2.5 rounded-sm transition-colors text-sm mt-2"
            >
              {loading ? 'Creating account...' : 'Create account'}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-[#2a475e] text-center">
            <p className="text-sm text-[#8f98a0]">
              Already have an account?{' '}
              <Link href="/auth/login" className="text-[#66c0f4] hover:text-white transition-colors">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}