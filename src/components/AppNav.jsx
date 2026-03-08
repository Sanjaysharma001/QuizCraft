import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { LogOut, PlusCircle, Lock } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../lib/AuthContext'

const DAILY_QUIZ_LIMIT = 10

export default function AppNav() {
  const navigate        = useNavigate()
  const { user, isPro, trialActive, trialDaysLeft, isExpired } = useAuth()
  const [todayCount, setTodayCount] = useState(0)

  useEffect(() => {
    if (!user) return
    fetchTodayCount()
    window.addEventListener('quizCountChanged', fetchTodayCount)
    return () => window.removeEventListener('quizCountChanged', fetchTodayCount)
  }, [user])

  const fetchTodayCount = async () => {
    const start = new Date(); start.setHours(0,0,0,0)
    const { count } = await supabase
      .from('quizzes')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .gte('created_at', start.toISOString())
    setTodayCount(count || 0)
  }

  const logout = async () => {
    await supabase.auth.signOut()
    navigate('/login')
  }

  const dailyLimitReached = !isPro && trialActive && todayCount >= DAILY_QUIZ_LIMIT
  const canCreate = isPro || (trialActive && !dailyLimitReached)

  return (
    <nav className="bg-card border-b border-ink/8 px-6 py-4 flex items-center justify-between">
      <button onClick={() => navigate('/dashboard')}
        className="font-fraunces font-black text-xl text-ink">
        Quiz<span className="text-amber">Craft</span>
      </button>

      <div className="flex items-center gap-4">
        {trialActive && !isPro && (
          <span className="hidden sm:flex items-center gap-1.5 text-xs font-medium text-amber bg-amber/10 px-3 py-1.5 rounded-full font-dm">
          ⏳ {trialDaysLeft >= 7 ? `${Math.ceil(trialDaysLeft / 7)} week${Math.ceil(trialDaysLeft / 7) !== 1 ? 's' : ''}` : `${trialDaysLeft} day${trialDaysLeft !== 1 ? 's' : ''}`} left
          </span>
        )}
        {isPro && (
          <span className="hidden sm:flex items-center gap-1.5 text-xs font-medium text-sage bg-sage/10 px-3 py-1.5 rounded-full font-dm">
            ⭐ Pro
          </span>
        )}

        <span className="text-sm text-warm-gray hidden sm:block font-dm">{user?.email}</span>

        {isExpired ? (
          <button disabled
            className="flex items-center gap-2 bg-ink/10 text-warm-gray text-sm font-medium px-4 py-2 rounded-full cursor-not-allowed font-dm">
            <Lock size={14} /> New Quiz
          </button>
        ) : (
          <button
            onClick={() => canCreate && navigate('/create')}
            disabled={!canCreate}
            title={dailyLimitReached ? 'Daily limit of 10 quizzes reached' : ''}
            className={`flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-full transition-colors font-dm
              ${canCreate
                ? 'bg-amber text-white hover:bg-ink cursor-pointer'
                : 'bg-ink/10 text-warm-gray cursor-not-allowed'}`}>
            {canCreate ? <PlusCircle size={15} /> : <Lock size={14} />}
            New Quiz
          </button>
        )}

        <button onClick={logout}
          className="flex items-center gap-1.5 text-sm text-warm-gray hover:text-ink transition-colors font-dm">
          <LogOut size={15} />
          <span className="hidden sm:block">Logout</span>
        </button>
      </div>
    </nav>
  )
}