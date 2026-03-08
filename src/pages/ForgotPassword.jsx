import { useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'

const friendlyError = (msg) => {
  if (!msg) return ''
  const m = msg.toLowerCase()
  if (m.includes('rate limit') || m.includes('email rate'))
    return 'Too many reset emails sent. Please wait 1 hour before trying again.'
  if (m.includes('user not found') || m.includes('unable to validate'))
    return 'No account found with this email address.'
  if (m.includes('network') || m.includes('fetch'))
    return 'Network error. Please check your connection and try again.'
  return 'Something went wrong. Please try again in a moment.'
}

export default function ForgotPassword() {
  const [email, setEmail]     = useState('')
  const [loading, setLoading] = useState(false)
  const [done, setDone]       = useState(false)
  const [error, setError]     = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`
    })
    if (error) { setError(friendlyError(error.message)); setLoading(false) }
    else setDone(true)
  }

  if (done) return (
    <div className="min-h-screen bg-cream flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="text-5xl mb-4">📬</div>
        <h2 className="font-fraunces font-black text-2xl text-ink mb-2">Check your email!</h2>
        <p className="text-warm-gray text-sm font-dm leading-relaxed">
          We sent a password reset link to{' '}
          <strong className="text-ink">{email}</strong>.
          <br />Click it to set a new password.
        </p>
        <p className="text-warm-gray text-xs font-dm mt-3">
          Didn't get it? Check your spam folder or wait a minute and try again.
        </p>
        <Link to="/login"
          className="inline-block mt-6 text-amber hover:text-ink font-medium text-sm transition-colors font-dm">
          Back to login →
        </Link>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center px-4">
      <div className="w-full max-w-md">

        <div className="text-center mb-8">
          <div className="font-fraunces font-black text-3xl text-ink mb-2">
            Quiz<span className="text-amber">Craft</span>
          </div>
          <p className="text-warm-gray text-sm font-dm">Reset your password</p>
        </div>

        <div className="bg-card rounded-2xl p-8 shadow-[0_8px_32px_rgba(26,18,8,0.08)] border border-ink/6">
          <h2 className="font-fraunces font-semibold text-2xl text-ink mb-2">Forgot password?</h2>
          <p className="text-warm-gray text-sm font-dm mb-6">
            Enter your email and we'll send you a reset link.
          </p>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl mb-4 flex items-start gap-2">
              <span className="text-base mt-0.5">⚠️</span>
              <span className="font-dm">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-ink mb-1.5 font-dm">Email</label>
              <input
                type="email" required value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@school.com"
                className="w-full px-4 py-3 rounded-xl border border-ink/15 bg-cream text-ink text-sm font-dm focus:outline-none focus:border-amber transition-colors"
              />
            </div>
            <button
              type="submit" disabled={loading}
              className="w-full bg-amber text-white py-3 rounded-xl font-medium text-sm hover:bg-ink transition-colors disabled:opacity-50 font-dm"
            >
              {loading ? 'Sending...' : 'Send reset link'}
            </button>
          </form>

          <p className="text-center text-sm text-warm-gray mt-5 font-dm">
            Remember your password?{' '}
            <Link to="/login" className="text-amber hover:text-ink font-medium transition-colors">
              Sign in
            </Link>
          </p>
        </div>

      </div>
    </div>
  )
}