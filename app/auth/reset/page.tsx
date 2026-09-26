'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function ResetPage() {
  const supabase = createClient()
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')

  const handleReset = async () => {
    const { error } = await supabase.auth.updateUser({ password })
    if (error) setMessage(error.message)
    else { setMessage('Password updated!'); setTimeout(() => router.push('/'), 2000) }
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="p-6 space-y-4 w-full max-w-sm">
        <h1 className="text-xl font-bold">Set new password</h1>
        <input
          type="password"
          placeholder="New password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="w-full border rounded px-3 py-2"
        />
        <button onClick={handleReset} className="w-full bg-blue-600 text-white py-2 rounded">
          Update Password
        </button>
        {message && <p>{message}</p>}
      </div>
    </div>
  )
}