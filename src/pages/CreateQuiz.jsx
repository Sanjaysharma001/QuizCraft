import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Clock, Trash2, PlusCircle, ChevronDown } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../lib/AuthContext'
import AppNav from '../components/AppNav'

const TIME_OPTIONS = [
  { label: 'No limit', value: null },
  { label: '5 min',   value: 5  },
  { label: '10 min',  value: 10 },
  { label: '15 min',  value: 15 },
  { label: '20 min',  value: 20 },
  { label: '30 min',  value: 30 },
  { label: '45 min',  value: 45 },
  { label: '60 min',  value: 60 },
]

const QUESTION_TYPES = [
  { value: 'mcq',       label: 'Multiple Choice', icon: '🔘', desc: '4 options, one correct' },
  { value: 'truefalse', label: 'True / False',    icon: '✅', desc: 'True or False answer'  },
  { value: 'short',     label: 'Short Answer',    icon: '✏️', desc: 'Student types answer'  },
]

const EMPTY_Q = (type = 'mcq') => {
  if (type === 'truefalse') return { type, text: '', options: ['True', 'False'], correct: 0 }
  if (type === 'short')     return { type, text: '', answer: '' }
  return { type: 'mcq', text: '', options: ['', '', '', ''], correct: 0 }
}

export default function CreateQuiz() {
  const { user }            = useAuth()
  const navigate            = useNavigate()
  const [title, setTitle]   = useState('')
  const [timeLimit, setTimeLimit] = useState(null)
  const [questions, setQuestions] = useState([EMPTY_Q('mcq')])
  const [saving, setSaving]       = useState(false)
  const [error, setError]         = useState('')

  const updateQ = (idx, field, value) =>
    setQuestions(prev => prev.map((q, i) => i === idx ? { ...q, [field]: value } : q))

  const updateOption = (qIdx, oIdx, value) =>
    setQuestions(prev => prev.map((q, i) => {
      if (i !== qIdx) return q
      const options = [...q.options]; options[oIdx] = value
      return { ...q, options }
    }))

  const changeType = (idx, newType) =>
    setQuestions(prev => prev.map((q, i) => i === idx ? EMPTY_Q(newType) : q))

  const addQuestion = (type = 'mcq') =>
    setQuestions(prev => [...prev, EMPTY_Q(type)])

  const removeQuestion = (idx) =>
    setQuestions(prev => prev.filter((_, i) => i !== idx))

  const validate = () => {
    if (!title.trim()) return 'Please add a quiz title'
    for (const q of questions) {
      if (!q.text.trim()) return 'All questions need text'
      if (q.type === 'mcq' && q.options.some(o => !o.trim())) return 'All MCQ options must be filled in'
      if (q.type === 'short' && !q.answer.trim()) return 'All short answer questions need a correct answer'
    }
    return null
  }

  const saveQuiz = async (publish = false) => {
    const err = validate()
    if (err) return setError(err)

    setSaving(true); setError('')

    const shareId = Math.random().toString(36).substring(2, 10)

    const { data: quiz, error: qErr } = await supabase
      .from('quizzes')
      .insert({
        title, user_id: user.id, share_id: shareId,
        published: publish, question_count: questions.length,
        time_limit: timeLimit,
      })
      .select().single()

    if (qErr) { setError(qErr.message); setSaving(false); return }

    const rows = questions.map((q, i) => ({
      quiz_id: quiz.id,
      type: q.type,
      text: q.text,
      options: q.type === 'short' ? [q.answer] : q.options,
      correct: q.type === 'short' ? 0 : q.correct,
      order: i,
    }))

    const { error: rErr } = await supabase.from('questions').insert(rows)
    if (rErr) { setError(rErr.message); setSaving(false); return }

    navigate('/dashboard')
  }

  return (
    <div className="min-h-screen bg-cream">
      <AppNav />
      <main className="max-w-2xl mx-auto px-6 py-10">
        <button onClick={() => navigate('/dashboard')}
          className="text-sm text-warm-gray hover:text-ink mb-6 flex items-center gap-1 font-dm transition-colors">
          ← Back to dashboard
        </button>

        <h1 className="font-fraunces font-black text-3xl text-ink mb-8">Create New Quiz</h1>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl mb-6">
            {error}
          </div>
        )}

        {/* Title + Time Limit */}
        <div className="bg-card rounded-2xl p-6 border border-ink/7 mb-6">
          <label className="block text-sm font-medium text-ink mb-2 font-dm">Quiz Title</label>
          <input value={title} onChange={e => setTitle(e.target.value)}
            placeholder="e.g. Chapter 5 Biology Review"
            className="w-full px-4 py-3 rounded-xl border border-ink/15 bg-cream text-ink font-dm text-sm focus:outline-none focus:border-amber transition-colors mb-5" />

          <label className="block text-sm font-medium text-ink mb-2 font-dm flex items-center gap-2">
            <Clock size={14} className="text-amber" /> Time Limit
          </label>
          <div className="grid grid-cols-4 gap-2">
            {TIME_OPTIONS.map(opt => (
              <button key={String(opt.value)} onClick={() => setTimeLimit(opt.value)}
                className={`py-2 px-3 rounded-xl text-xs font-medium border transition-all font-dm
                  ${timeLimit === opt.value
                    ? 'bg-amber text-white border-amber'
                    : 'bg-cream text-ink border-ink/15 hover:border-amber'}`}>
                {opt.label}
              </button>
            ))}
          </div>
          {timeLimit && (
            <p className="text-xs text-amber mt-2 font-dm">
              ⏱️ Students will have {timeLimit} minutes to complete this quiz
            </p>
          )}
        </div>

        {/* Questions */}
        {questions.map((q, qIdx) => (
          <div key={qIdx} className="bg-card rounded-2xl p-6 border border-ink/7 mb-4">

            {/* Question header */}
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-medium text-warm-gray uppercase tracking-widest font-dm">
                Question {qIdx + 1}
              </span>
              {questions.length > 1 && (
                <button onClick={() => removeQuestion(qIdx)}
                  className="text-warm-gray hover:text-red-500 transition-colors">
                  <Trash2 size={14} />
                </button>
              )}
            </div>

            {/* Question type selector */}
            <div className="grid grid-cols-3 gap-2 mb-4">
              {QUESTION_TYPES.map(t => (
                <button key={t.value} onClick={() => changeType(qIdx, t.value)}
                  className={`flex flex-col items-center py-2.5 px-2 rounded-xl border text-center transition-all font-dm
                    ${q.type === t.value
                      ? 'bg-amber/10 border-amber text-amber'
                      : 'border-ink/12 text-warm-gray hover:border-amber/40 bg-cream'}`}>
                  <span className="text-lg mb-0.5">{t.icon}</span>
                  <span className="text-[11px] font-medium leading-tight">{t.label}</span>
                </button>
              ))}
            </div>

            {/* Question text */}
            <input value={q.text} onChange={e => updateQ(qIdx, 'text', e.target.value)}
              placeholder="Type your question here..."
              className="w-full px-4 py-3 rounded-xl border border-ink/15 bg-cream text-ink font-dm text-sm focus:outline-none focus:border-amber transition-colors mb-4" />

            {/* MCQ options */}
            {q.type === 'mcq' && (
              <>
                <p className="text-xs text-warm-gray mb-3 font-dm">
                  Answer options — click ✓ to mark the correct one
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {q.options.map((opt, oIdx) => (
                    <div key={oIdx} className="flex items-center gap-2">
                      <button onClick={() => updateQ(qIdx, 'correct', oIdx)}
                        className={`w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold border-2 transition-all
                          ${q.correct === oIdx
                            ? 'bg-sage border-sage text-white'
                            : 'border-ink/20 text-warm-gray hover:border-sage'}`}>
                        {q.correct === oIdx ? '✓' : String.fromCharCode(65 + oIdx)}
                      </button>
                      <input value={opt} onChange={e => updateOption(qIdx, oIdx, e.target.value)}
                        placeholder={`Option ${String.fromCharCode(65 + oIdx)}`}
                        className="flex-1 px-3 py-2 rounded-lg border border-ink/15 bg-cream text-ink font-dm text-sm focus:outline-none focus:border-amber transition-colors" />
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* True / False options */}
            {q.type === 'truefalse' && (
              <>
                <p className="text-xs text-warm-gray mb-3 font-dm">Select the correct answer</p>
                <div className="grid grid-cols-2 gap-3">
                  {['True', 'False'].map((opt, oIdx) => (
                    <button key={oIdx} onClick={() => updateQ(qIdx, 'correct', oIdx)}
                      className={`py-3 rounded-xl border-2 text-sm font-medium transition-all font-dm
                        ${q.correct === oIdx
                          ? oIdx === 0 ? 'bg-sage/15 border-sage text-sage' : 'bg-red-50 border-red-400 text-red-600'
                          : 'border-ink/15 text-ink hover:border-amber bg-cream'}`}>
                      {oIdx === 0 ? '✅' : '❌'} {opt}
                    </button>
                  ))}
                </div>
              </>
            )}

            {/* Short Answer */}
            {q.type === 'short' && (
              <>
                <p className="text-xs text-warm-gray mb-2 font-dm">
                  ✏️ Students will type their answer — enter the correct answer below for auto-grading
                </p>
                <div className="relative">
                  <input value={q.answer || ''} onChange={e => updateQ(qIdx, 'answer', e.target.value)}
                    placeholder="Correct answer (used for grading)"
                    className="w-full px-4 py-3 rounded-xl border-2 border-amber/40 bg-amber/5 text-ink font-dm text-sm focus:outline-none focus:border-amber transition-colors" />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-amber font-dm font-medium">
                    Answer key
                  </span>
                </div>
                <p className="text-xs text-warm-gray mt-1.5 font-dm">
                  💡 Grading checks if student's answer contains your key answer (case-insensitive)
                </p>
              </>
            )}
          </div>
        ))}

        {/* Add Question buttons */}
        <div className="grid grid-cols-3 gap-2 mb-8">
          {QUESTION_TYPES.map(t => (
            <button key={t.value} onClick={() => addQuestion(t.value)}
              className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl border-2 border-dashed border-ink/15 text-warm-gray text-xs hover:border-amber hover:text-amber transition-all font-dm">
              <PlusCircle size={13} /> {t.label}
            </button>
          ))}
        </div>

        {/* Save Buttons */}
        <div className="flex gap-3">
          <button onClick={() => saveQuiz(false)} disabled={saving}
            className="flex-1 py-3 rounded-xl border border-ink/20 text-ink font-medium text-sm hover:border-ink transition-colors disabled:opacity-50 font-dm">
            Save as Draft
          </button>
          <button onClick={() => saveQuiz(true)} disabled={saving}
            className="flex-1 py-3 rounded-xl bg-amber text-white font-medium text-sm hover:bg-ink transition-colors disabled:opacity-50 font-dm">
            {saving ? 'Saving...' : '▶ Publish Quiz'}
          </button>
        </div>
      </main>
    </div>
  )
}