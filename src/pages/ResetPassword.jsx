import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function ResetPassword() {
  const navigate                        = useNavigate()
  const [password, setPassword]         = useState('')
  const [confirm, setConfirm]           = useState('')
  const [loading, setLoading]           = useState(false)
  const [error, setError]               = useState('')
  const [ready, setReady]               = useState(false)
  const [success, setSuccess]           = useState(false)

  useEffect(() => {
    supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') setReady(true)
    })
  }, [])

  const handleReset = async (e) => {
    e.preventDefault()
    if (password !== confirm) return setError('Passwords do not match')
    if (password.length < 6)  return setError('Password must be at least 6 characters')

    setLoading(true)
    setError('')

    const { error } = await supabase.auth.updateUser({ password })
    if (error) { setError(error.message); setLoading(false) }
    else setSuccess(true)
  }

  // Verifying link screen
  if (!ready) return (
    <div className="min-h-screen bg-cream flex items-center justify-center px-4">
      <div className="text-center">
        <div className="text-4xl mb-4">⏳</div>
        <p className="text-warm-gray font-dm text-sm">Verifying your reset link...</p>
        <p className="text-warm-gray font-dm text-xs mt-2">
          If nothing happens,{' '}
          <a href="/forgot-password" className="text-amber hover:text-ink transition-colors">
            request a new link
          </a>
        </p>
      </div>
    </div>
  )

  // Success screen
  if (success) return (
    <div className="min-h-screen bg-cream flex items-center justify-center px-4">
      <div className="w-full max-w-md text-center">
        <div className="bg-card rounded-2xl p-10 shadow-[0_8px_32px_rgba(26,18,8,0.08)] border border-ink/6">
          <div className="w-16 h-16 bg-sage/15 rounded-full flex items-center justify-center text-3xl mx-auto mb-5">
            ✅
          </div>
          <h2 className="font-fraunces font-black text-2xl text-ink mb-2">Password updated!</h2>
          <p className="text-warm-gray text-sm font-dm leading-relaxed mb-8">
            Your password has been changed successfully.<br />
            You can now log in with your new password.
          </p>
          <button
            onClick={() => navigate('/login')}
            className="w-full bg-amber text-white py-3 rounded-xl font-medium text-sm hover:bg-ink transition-colors font-dm">
            Go to Login →
          </button>
        </div>
      </div>
    </div>
  )

  // Reset form
  return (
    <div className="min-h-screen bg-cream flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="font-fraunces font-black text-3xl text-ink mb-2">
            Quiz<span className="text-amber">Craft</span>
          </div>
          <p className="text-warm-gray text-sm font-dm">Set a new password</p>
        </div>

        <div className="bg-card rounded-2xl p-8 shadow-[0_8px_32px_rgba(26,18,8,0.08)] border border-ink/6">
          <h2 className="font-fraunces font-semibold text-2xl text-ink mb-6">New password</h2>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleReset} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-ink mb-1.5 font-dm">New password</label>
              <input
                type="password" required minLength={6} value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="At least 6 characters"
                className="w-full px-4 py-3 rounded-xl border border-ink/15 bg-cream text-ink text-sm font-dm focus:outline-none focus:border-amber transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-ink mb-1.5 font-dm">Confirm password</label>
              <input
                type="password" required minLength={6} value={confirm}
                onChange={e => setConfirm(e.target.value)}
                placeholder="Repeat your new password"
                className="w-full px-4 py-3 rounded-xl border border-ink/15 bg-cream text-ink text-sm font-dm focus:outline-none focus:border-amber transition-colors"
              />
            </div>
            <button
              type="submit" disabled={loading}
              className="w-full bg-amber text-white py-3 rounded-xl font-medium text-sm hover:bg-ink transition-colors disabled:opacity-50 font-dm">
              {loading ? 'Updating...' : 'Update password'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}