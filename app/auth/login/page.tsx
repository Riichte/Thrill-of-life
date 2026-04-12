'use client'

import { useState, Suspense } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'

function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const supabase = createClient()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      const redirectTo = searchParams.get('redirect') || '/'
      router.push(redirectTo)
      router.refresh()
    }
  }

  return (
    <div className="bg-[#1b2838] border border-[#2a475e] rounded-sm p-8">
      <h1 className="text-2xl font-semibold text-[#c6d4df] mb-6">Sign in to your account</h1>

      {error && (
        <div className="mb-4 px-4 py-3 bg-red-500/10 border border-red-500/30 rounded-sm text-red-400 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleLogin} className="space-y-4">
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
            className="w-full bg-[#2a475e] border border-[#3d6a8a] rounded-sm px-3 py-2.5 text-sm text-[#c6d4df] placeholder-[#6a8a9a] focus:outline-none focus:border-[#66c0f4]"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#4c6b22] hover:bg-[#5a7a28] disabled:opacity-50 text-white font-medium py-2.5 rounded-sm transition-colors text-sm mt-2"
        >
          {loading ? 'Signing in...' : 'Sign in'}
        </button>
      </form>

      <div className="mt-6 pt-6 border-t border-[#2a475e] text-center">
        <p className="text-sm text-[#8f98a0]">
          Don't have an account?{' '}
          <Link href="/auth/signup" className="text-[#66c0f4] hover:text-white transition-colors">
            Create one
          </Link>
        </p>
      </div>
    </div>
  )
}

export default function Login() {
  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-3">
            <img src="/ThrillOfLife_Logo.jpg" alt="Thrill of Life" className="w-12 h-12 object-contain" />
            <span className="text-2xl font-bold text-white font-logo">Thrill of Life</span>
          </Link>
        </div>

        <Suspense fallback={<div className="bg-[#1b2838] border border-[#2a475e] rounded-sm p-8 text-[#8f98a0] text-sm text-center">Loading...</div>}>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  )
}