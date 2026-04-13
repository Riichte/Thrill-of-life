'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function SubmitClient() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [parkName, setParkName] = useState('')
  const [rideName, setRideName] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [license, setLicense] = useState('CC BY 4.0')
  const [sourceUrl, setSourceUrl] = useState('')
  const [notes, setNotes] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async () => {
    if (!name.trim() || !email.trim() || !parkName.trim() || !imageUrl.trim()) {
      setError('Please fill in all required fields.')
      return
    }
    setSubmitting(true)
    setError('')

    try {
      const res = await fetch('https://formspree.io/f/mrergrjp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          park: parkName,
          ride: rideName || 'N/A',
          image_url: imageUrl,
          license,
          source_url: sourceUrl || 'N/A',
          notes: notes || 'N/A',
        }),
      })

      if (res.ok) {
        setSubmitted(true)
      } else {
        setError('Something went wrong. Please try again.')
      }
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const inputClass = 'w-full bg-[#2a475e] border border-[#3d6a8a] rounded-sm px-3 py-2 text-sm text-[#c6d4df] placeholder-[#6a8a9a] focus:outline-none focus:border-[#66c0f4]'
  const labelClass = 'block text-xs font-medium uppercase tracking-wider text-[#8f98a0] mb-1'

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-6">📸</div>
          <h1 className="text-3xl font-bold text-[#c6d4df] mb-4">Thank you!</h1>
          <p className="text-[#acb2b8] mb-6">Your image submission has been received. We'll review it and add it to the site if it meets our guidelines.</p>
          <Link href="/" className="bg-[#4c6b22] hover:bg-[#5a7a28] text-white px-6 py-3 rounded-sm font-medium transition-colors">
            Back to Home
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <nav className="mb-6">
          <Link href="/" className="text-blue-400 hover:text-blue-300 text-sm">Home</Link>
          <span className="mx-2 text-gray-500">/</span>
          <span className="text-gray-300 text-sm">Submit an Image</span>
        </nav>

        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Submit an Image</h1>
          <p className="text-[#acb2b8]">Help us grow the Thrill of Life photo library! Submit a link to your CC BY licensed image and we'll review it for inclusion on the site.</p>
        </div>

        {/* Guidelines */}
        <div className="bg-[#1b2838] border border-[#2a475e] rounded-sm p-4 mb-8">
          <h2 className="text-sm font-semibold text-[#66c0f4] mb-2">📋 Submission Guidelines</h2>
          <ul className="text-sm text-[#acb2b8] space-y-1">
            <li>• Images must be licensed under <strong className="text-[#c6d4df]">CC BY 4.0</strong> or compatible license</li>
            <li>• Submit a direct link to the image or the source page (YouTube, Flickr, Wikimedia)</li>
            <li>• Images should be high quality and clearly show the ride or park</li>
            <li>• No watermarked or copyrighted images</li>
          </ul>
        </div>

        <div className="bg-[#1b2838] border border-[#2a475e] rounded-sm p-6 space-y-4">
          {/* Personal info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Your Name *</label>
              <input className={inputClass} value={name} onChange={e => setName(e.target.value)} placeholder="John Smith" />
            </div>
            <div>
              <label className={labelClass}>Your Email *</label>
              <input type="email" className={inputClass} value={email} onChange={e => setEmail(e.target.value)} placeholder="john@example.com" />
            </div>
          </div>

          {/* Park & ride */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Park Name *</label>
              <input className={inputClass} value={parkName} onChange={e => setParkName(e.target.value)} placeholder="Europa Park" />
            </div>
            <div>
              <label className={labelClass}>Ride / Area Name (optional)</label>
              <input className={inputClass} value={rideName} onChange={e => setRideName(e.target.value)} placeholder="Wodan" />
            </div>
          </div>

          {/* Image */}
          <div>
            <label className={labelClass}>Image URL or Source URL *</label>
            <input className={inputClass} value={imageUrl} onChange={e => setImageUrl(e.target.value)} placeholder="https://www.flickr.com/photos/... or https://youtube.com/watch?v=..." />
          </div>

          {/* License */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>License</label>
              <select className={inputClass} value={license} onChange={e => setLicense(e.target.value)}>
                <option value="CC BY 4.0">CC BY 4.0</option>
                <option value="CC BY-SA 4.0">CC BY-SA 4.0</option>
                <option value="CC0">CC0 (Public Domain)</option>
              </select>
            </div>
            <div>
              <label className={labelClass}>Attribution / Channel Name</label>
              <input className={inputClass} value={sourceUrl} onChange={e => setSourceUrl(e.target.value)} placeholder="e.g. Coaster Studios" />
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className={labelClass}>Additional Notes (optional)</label>
            <textarea
              className={inputClass}
              rows={3}
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="Any additional info about the image..."
            />
          </div>

          {error && <p className="text-sm text-red-400">{error}</p>}

          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="w-full py-3 bg-[#4c6b22] hover:bg-[#5a7a28] disabled:opacity-50 text-white font-medium rounded-sm transition-colors"
          >
            {submitting ? 'Sending...' : 'Submit Image'}
          </button>
        </div>

        <p className="text-xs text-[#4a6a82] text-center mt-6">
          By submitting, you confirm the image is CC BY licensed and you have the right to share it.
        </p>
      </div>
    </div>
  )
}