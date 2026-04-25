'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function FeedbackClient() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [type, setType] = useState('bug')
  const [message, setMessage] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async () => {
    if (!message.trim()) { setError('Please enter a message.'); return }
    setSubmitting(true)
    setError('')
    try {
      const res = await fetch('https://formspree.io/f/xkokydbw', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, type, message }),
      })
      if (res.ok) setSubmitted(true)
      else setError('Something went wrong. Please try again.')
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const inputClass = 'w-full bg-[#2a475e] border border-[#3d6a8a] rounded-sm px-3 py-2 text-sm text-[#c6d4df] placeholder-[#6a8a9a] focus:outline-none focus:border-[#66c0f4]'
  const labelClass = 'block text-xs font-medium uppercase tracking-wider text-[#8f98a0] mb-1'

  if (submitted) return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
      <div className="text-center max-w-md">
        <div className="text-6xl mb-6">💬</div>
        <h1 className="text-3xl font-bold text-[#c6d4df] mb-4">Thanks for your feedback!</h1>
        <p className="text-[#acb2b8] mb-6">We read every submission and use it to improve the site.</p>
        <Link href="/" className="bg-[#4c6b22] hover:bg-[#5a7a28] text-white px-6 py-3 rounded-sm font-medium transition-colors">
          Back to Home
        </Link>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <nav className="mb-6">
          <Link href="/" className="text-blue-400 hover:text-blue-300 text-sm">Home</Link>
          <span className="mx-2 text-gray-500">/</span>
          <span className="text-gray-300 text-sm">Feedback</span>
        </nav>

        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Leave Feedback</h1>
          <p className="text-[#acb2b8]">Bug report, feature request, or general suggestion — we'd love to hear it.</p>
        </div>

        <div className="bg-[#1b2838] border border-[#2a475e] rounded-sm p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Your Name (optional)</label>
              <input className={inputClass} value={name} onChange={e => setName(e.target.value)} placeholder="John Smith" />
            </div>
            <div>
              <label className={labelClass}>Your Email (optional)</label>
              <input type="email" className={inputClass} value={email} onChange={e => setEmail(e.target.value)} placeholder="john@example.com" />
            </div>
          </div>

          <div>
            <label className={labelClass}>Type</label>
            <select className={inputClass} value={type} onChange={e => setType(e.target.value)}>
              <option value="bug">🐛 Bug report</option>
              <option value="feature">✨ Feature request</option>
              <option value="content">📝 Content issue</option>
              <option value="other">💬 Other</option>
            </select>
          </div>

          <div>
            <label className={labelClass}>Message *</label>
            <textarea className={inputClass} rows={5} value={message} onChange={e => setMessage(e.target.value)} placeholder="Describe your feedback..." />
          </div>

          {error && <p className="text-sm text-red-400">{error}</p>}

          <button onClick={handleSubmit} disabled={submitting}
            className="w-full py-3 bg-[#4c6b22] hover:bg-[#5a7a28] disabled:opacity-50 text-white font-medium rounded-sm transition-colors">
            {submitting ? 'Sending...' : 'Send Feedback'}
          </button>
        </div>
      </div>
    </div>
  )
}