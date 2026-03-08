import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function Signup() {
  const navigate                        = useNavigate()
  const [email, setEmail]               = useState('')
  const [password, setPassword]         = useState('')
  const [error, setError]               = useState('')
  const [loading, setLoading]           = useState(false)
  const [done, setDone]                 = useState(false)

  const handleSignup = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        // After clicking confirmation email → go straight to dashboard
        emailRedirectTo: `${window.location.origin}/dashboard`
      }
    })
    if (error) { setError(error.message); setLoading(false) }
    else setDone(true)
  }

  // ── Email sent screen ──
  if (done) return (
    <div className="min-h-screen bg-cream flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="text-5xl mb-4">📬</div>
        <h2 className="font-fraunces font-black text-2xl text-ink mb-2">Check your email!</h2>
        <p className="text-warm-gray text-sm font-dm leading-relaxed">
          We sent a confirmation link to{' '}
          <strong className="text-ink">{email}</strong>.
          <br />Click it to activate your account — you'll land straight on your dashboard!
        </p>
        <Link
          to="/login"
          className="inline-block mt-6 text-amber hover:text-ink font-medium text-sm transition-colors font-dm"
        >
          Back to login →
        </Link>
      </div>
    </div>
  )

  // ── Signup form ──
  return (
    <div className="min-h-screen bg-cream flex items-center justify-center px-4">
      <div className="w-full max-w-md">

        <div className="text-center mb-8">
          <div className="font-fraunces font-black text-3xl text-ink mb-2">
            Quiz<span className="text-amber">Craft</span>
          </div>
          <p className="text-warm-gray text-sm font-dm">Start your 2-week free trial 🎉</p>
        </div>

        <div className="bg-card rounded-2xl p-8 shadow-[0_8px_32px_rgba(26,18,8,0.08)] border border-ink/6">
          <h2 className="font-fraunces font-semibold text-2xl text-ink mb-6">Create account</h2>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSignup} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-ink mb-1.5 font-dm">Email</label>
              <input
                type="email" required value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@school.com"
                className="w-full px-4 py-3 rounded-xl border border-ink/15 bg-cream text-ink text-sm font-dm focus:outline-none focus:border-amber transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-ink mb-1.5 font-dm">Password</label>
              <input
                type="password" required minLength={6} value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="At least 6 characters"
                className="w-full px-4 py-3 rounded-xl border border-ink/15 bg-cream text-ink text-sm font-dm focus:outline-none focus:border-amber transition-colors"
              />
            </div>
            <button
              type="submit" disabled={loading}
              className="w-full bg-amber text-white py-3 rounded-xl font-medium text-sm hover:bg-ink transition-colors disabled:opacity-50 font-dm mt-2"
            >
              {loading ? 'Creating account...' : 'Create free account'}
            </button>
          </form>

          <p className="text-center text-[12px] text-warm-gray mt-4 font-dm">
            No credit card needed · 14 days full access · Upgrade anytime
          </p>

          <p className="text-center text-sm text-warm-gray mt-3 font-dm">
            Already have an account?{' '}
            <Link to="/login" className="text-amber hover:text-ink font-medium transition-colors">
              Sign in
            </Link>
          </p>
        </div>

      </div>
    </div>
  )
}