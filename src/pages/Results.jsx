import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../lib/AuthContext'
import AppNav from '../components/AppNav'

const CHECKOUT_URL = 'https://getquizcraft.lemonsqueezy.com/buy/YOUR_LINK'

export default function Results() {
  const { id }                    = useParams()
  const navigate                  = useNavigate()
  const { isPro }                 = useAuth()
  const [quiz, setQuiz]           = useState(null)
  const [questions, setQuestions] = useState([])
  const [results, setResults]     = useState([])
  const [selected, setSelected]   = useState(null)
  const [loading, setLoading]     = useState(true)

  useEffect(() => {
    const load = async () => {
      const { data: quiz }    = await supabase.from('quizzes').select('*').eq('id', id).single()
      const { data: qs }      = await supabase.from('questions').select('*').eq('quiz_id', id).order('order')
      const { data: results } = await supabase.from('results').select('*').eq('quiz_id', id).order('created_at', { ascending: false })
      setQuiz(quiz)
      setQuestions(qs || [])
      setResults(results || [])
      setLoading(false)
    }
    load()
  }, [id])

  const avg = results.length
    ? Math.round(results.reduce((s, r) => s + r.score, 0) / results.length)
    : 0

  // ── PDF Export (Pro only) ──
  const exportPDF = () => {
    const win = window.open('', '_blank')
    const rows = questions.map((q, i) => `
      <div style="margin-bottom:20px;padding:16px;border:1px solid #e5e7eb;border-radius:8px;">
        <p style="font-weight:600;margin-bottom:10px;font-size:14px;">${i+1}. ${q.text}</p>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;">
          ${q.options.map((opt, oIdx) => `
            <div style="padding:8px 12px;border-radius:6px;font-size:13px;
              background:${oIdx === q.correct ? '#f0fdf4' : '#f9fafb'};
              border:1px solid ${oIdx === q.correct ? '#86efac' : '#e5e7eb'};
              color:${oIdx === q.correct ? '#16a34a' : '#374151'};
              font-weight:${oIdx === q.correct ? '600' : '400'};">
              ${String.fromCharCode(65+oIdx)}. ${opt} ${oIdx === q.correct ? '✓' : ''}
            </div>`).join('')}
        </div>
      </div>`).join('')
    win.document.write(`<!DOCTYPE html><html><head>
      <title>${quiz.title} — QuizCraft</title>
      <style>body{font-family:Georgia,serif;max-width:800px;margin:40px auto;padding:0 20px;color:#1A1208;}
      h1{font-size:28px;margin-bottom:4px;}.meta{color:#8C7B6B;font-size:13px;margin-bottom:32px;font-family:sans-serif;}
      @media print{body{margin:20px;}}</style>
      </head><body>
      <h1>${quiz.title}</h1>
      <p class="meta">QuizCraft · ${questions.length} questions · Answer key included</p>
      ${rows}
      <script>window.onload=()=>{window.print();}<\/script>
      </body></html>`)
    win.document.close()
  }

  if (loading) return (
    <div className="min-h-screen bg-cream"><AppNav />
      <div className="flex items-center justify-center py-20 text-warm-gray font-dm">Loading results...</div>
    </div>
  )

  return (
    <div className="min-h-screen bg-cream">
      <AppNav />
      <main className="max-w-4xl mx-auto px-6 py-10">

        <button onClick={() => navigate('/dashboard')}
          className="text-sm text-warm-gray hover:text-ink mb-6 flex items-center gap-1 font-dm transition-colors">
          ← Back to dashboard
        </button>

        <div className="flex items-start justify-between mb-6 flex-wrap gap-4">
          <div>
            <h1 className="font-fraunces font-black text-3xl text-ink mb-1">{quiz?.title}</h1>
            <p className="text-warm-gray text-sm font-dm">Student results</p>
          </div>
          {/* PDF Export — Pro only */}
          {isPro ? (
            <button onClick={exportPDF}
              className="flex items-center gap-2 bg-ink text-cream px-5 py-2.5 rounded-full text-sm font-medium hover:bg-amber transition-colors font-dm">
              📄 Export PDF
            </button>
          ) : (
            <button onClick={() => window.open(CHECKOUT_URL, '_blank')}
              className="flex items-center gap-2 bg-ink/10 text-warm-gray px-5 py-2.5 rounded-full text-sm font-medium hover:bg-amber hover:text-white transition-colors font-dm">
              🔒 Export PDF — Pro
            </button>
          )}
        </div>

        {/* Stats — basic for free, full for pro */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { label: 'Students',  value: results.length,             icon: '👥' },
            { label: 'Avg Score', value: isPro ? `${avg}%` : '🔒',  icon: '📊' },
            { label: 'Questions', value: quiz?.question_count || 0,  icon: '❓' },
          ].map((s) => (
            <div key={s.label} className="bg-card rounded-2xl p-5 border border-ink/7 text-center">
              <div className="text-2xl mb-1">{s.icon}</div>
              <div className="font-fraunces font-black text-2xl text-ink">{s.value}</div>
              <div className="text-xs text-warm-gray font-dm mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Pro upgrade banner for free users */}
        {!isPro && (
          <div className="bg-amber/10 border border-amber/25 rounded-2xl px-5 py-4 mb-6 flex items-center justify-between flex-wrap gap-3">
            <div>
              <span className="text-amber font-medium text-sm font-dm">🔒 Pro features locked — </span>
              <span className="text-ink text-sm font-dm">Upgrade to see avg score, answer review & PDF export</span>
            </div>
            <button onClick={() => window.open(CHECKOUT_URL, '_blank')}
              className="bg-amber text-white text-xs font-medium px-4 py-2 rounded-full hover:bg-ink transition-colors font-dm">
              Upgrade to Pro →
            </button>
          </div>
        )}

        {/* Results Table */}
        {results.length === 0 ? (
          <div className="text-center py-16 bg-card rounded-2xl border border-ink/7">
            <div className="text-4xl mb-3">📭</div>
            <p className="font-fraunces font-semibold text-lg text-ink">No submissions yet</p>
            <p className="text-warm-gray text-sm mt-1 font-dm">Share the quiz link with your students to get results.</p>
          </div>
        ) : (
          <>
            <div className="bg-card rounded-2xl border border-ink/7 overflow-hidden mb-8">
              <div className={`grid px-5 py-3 border-b border-ink/7 ${isPro ? 'grid-cols-5' : 'grid-cols-4'}`}>
                {['Student', 'Score', 'Correct', 'Date', ...(isPro ? ['Review'] : [])].map(h => (
                  <div key={h} className="text-xs font-medium text-warm-gray uppercase tracking-widest font-dm">{h}</div>
                ))}
              </div>
              {results.map((r) => (
                <div key={r.id}
                  className={`grid px-5 py-4 border-b border-ink/5 last:border-0 hover:bg-cream/50 transition-colors items-center ${isPro ? 'grid-cols-5' : 'grid-cols-4'}`}>
                  <div className="text-sm font-medium text-ink font-dm">{r.student_name || 'Anonymous'}</div>
                  <div>
                    <span className={`text-sm font-bold font-dm
                      ${r.score >= 80 ? 'text-sage' : r.score >= 60 ? 'text-amber' : 'text-red-500'}`}>
                      {r.score}%
                    </span>
                  </div>
                  <div className="text-sm text-warm-gray font-dm">{r.correct}/{r.total}</div>
                  <div className="text-xs text-warm-gray font-dm">
                    {new Date(r.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </div>
                  {/* Review button — Pro only */}
                  {isPro && (
                    <button
                      onClick={() => setSelected(selected?.id === r.id ? null : r)}
                      className="text-xs font-medium text-amber hover:text-ink transition-colors font-dm">
                      {selected?.id === r.id ? 'Hide ▲' : 'Review ▼'}
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* ── Answer Review Panel (Pro only) ── */}
            {isPro && selected && (
              <div className="bg-card rounded-2xl border border-ink/7 p-6 mb-8">
                <h3 className="font-fraunces font-black text-xl text-ink mb-1">
                  {selected.student_name || 'Anonymous'}'s Answers
                </h3>
                <p className="text-warm-gray text-sm mb-6 font-dm">
                  Score: <strong className="text-ink">{selected.score}%</strong> · {selected.correct}/{selected.total} correct
                </p>
                {questions.map((q, idx) => {
                  const studentAnswer = selected.answers?.[idx] ?? selected.answers?.[String(idx)]
                  const isCorrect     = studentAnswer === q.correct
                  return (
                    <div key={idx} className={`rounded-xl p-5 border mb-4
                      ${isCorrect ? 'bg-sage/5 border-sage/20' : 'bg-red-50 border-red-200'}`}>
                      <div className="flex items-start gap-3 mb-3">
                        <span className="text-lg flex-shrink-0">{isCorrect ? '✅' : '❌'}</span>
                        <div>
                          <p className="text-xs font-medium text-warm-gray uppercase tracking-widest font-dm mb-1">Question {idx + 1}</p>
                          <p className="font-fraunces font-semibold text-base text-ink">{q.text}</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 ml-8">
                        {q.options.map((opt, oIdx) => {
                          const isStudentPick = studentAnswer === oIdx
                          const isRightAnswer = q.correct === oIdx
                          let style = 'bg-white border-ink/10 text-ink'
                          if (isRightAnswer)                   style = 'bg-sage/15 border-sage text-sage font-medium'
                          if (isStudentPick && !isRightAnswer) style = 'bg-red-100 border-red-400 text-red-700 font-medium'
                          return (
                            <div key={oIdx} className={`px-3 py-2 rounded-lg border text-sm font-dm flex items-center gap-2 ${style}`}>
                              <span className="font-bold text-xs">{String.fromCharCode(65+oIdx)}.</span>
                              <span>{opt}</span>
                              {isRightAnswer    && <span className="ml-auto text-xs">✓</span>}
                              {isStudentPick && !isRightAnswer && <span className="ml-auto text-xs">✗</span>}
                            </div>
                          )
                        })}
                      </div>
                      {!isCorrect && (
                        <div className="ml-8 mt-2 text-xs text-warm-gray font-dm">
                          💡 Correct: <strong className="text-sage">{q.options[q.correct]}</strong>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            )}
          </>
        )}

      </main>
    </div>
  )
}