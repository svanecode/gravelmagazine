'use client'

import {useState} from 'react'

export default function NewsletterSignup() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')
    setMessage('')

    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({email}),
      })

      const data = await response.json()

      if (response.ok) {
        setStatus('success')
        setMessage(data.message || 'Thanks for subscribing!')
        setEmail('')
      } else {
        setStatus('error')
        setMessage(data.error || 'Something went wrong. Please try again.')
      }
    } catch (error) {
      setStatus('error')
      setMessage('Something went wrong. Please try again.')
    }
  }

  return (
    <div className="max-w-2xl mx-auto text-center">
      <h3 className="text-2xl md:text-3xl font-display font-normal mb-4 text-black">
        Stay Connected
      </h3>
      <p className="text-gray-600 mb-8 leading-relaxed">
        Get our latest articles, essays, and cultural commentary delivered to your inbox. No spam,
        just thoughtful content.
      </p>

      <form onSubmit={handleSubmit} className="max-w-md mx-auto">
        <div className="flex flex-col sm:flex-row gap-4">
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={status === 'loading'}
            className="flex-1 px-4 py-3 border border-gray-300 bg-white text-black placeholder-gray-500 focus:outline-none focus:border-black focus:shadow-sm transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          />
          <button
            type="submit"
            disabled={status === 'loading'}
            className="px-6 py-3 bg-black text-white hover:bg-gray-800 hover:transform hover:-translate-y-0.5 transition-all duration-200 font-medium whitespace-nowrap shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {status === 'loading' ? 'Subscribing...' : 'Subscribe'}
          </button>
        </div>

        {/* Status Message */}
        {message && (
          <p
            className={`mt-4 text-sm ${
              status === 'success' ? 'text-green-700' : 'text-red-600'
            }`}
          >
            {message}
          </p>
        )}
      </form>
    </div>
  )
}