import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function Login() {
  const navigate             = useNavigate()
  const [email, setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [error, setError]    = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) { setError(error.message); setLoading(false) }
    else navigate('/dashboard')
  }

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center px-4">
      <div className="w-full max-w-md">

        <div className="text-center mb-8">
          <div className="font-fraunces font-black text-3xl text-ink mb-2">
            Quiz<span className="text-amber">Craft</span>
          </div>
          <p className="text-warm-gray text-sm font-dm">Welcome back, teacher 👋</p>
        </div>

        <div className="bg-card rounded-2xl p-8 shadow-[0_8px_32px_rgba(26,18,8,0.08)] border border-ink/6">
          <h2 className="font-fraunces font-semibold text-2xl text-ink mb-6">Sign in</h2>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
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
                type="password" required value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-xl border border-ink/15 bg-cream text-ink text-sm font-dm focus:outline-none focus:border-amber transition-colors"
              />
            </div>

            {/* Forgot password */}
            <div className="flex justify-end">
              <Link to="/forgot-password"
                className="text-xs text-warm-gray hover:text-amber transition-colors font-dm">
                Forgot password?
              </Link>
            </div>

            <button
              type="submit" disabled={loading}
              className="w-full bg-amber text-white py-3 rounded-xl font-medium text-sm hover:bg-ink transition-colors disabled:opacity-50 font-dm"
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>

          <p className="text-center text-sm text-warm-gray mt-5 font-dm">
            No account?{' '}
            <Link to="/signup" className="text-amber hover:text-ink font-medium transition-colors">
              Sign up free
            </Link>
          </p>
        </div>

      </div>
    </div>
  )
}