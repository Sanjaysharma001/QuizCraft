import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Clock, Trash2, PlusCircle } from 'lucide-react'
import { supabase } from '../lib/supabase'
import AppNav from '../components/AppNav'

const EMPTY_Q = () => ({ text: '', options: ['', '', '', ''], correct: 0 })

const TIME_OPTIONS = [
  { label: 'No limit', value: null },
  { label: '5 min',  value: 5  },
  { label: '10 min', value: 10 },
  { label: '15 min', value: 15 },
  { label: '20 min', value: 20 },
  { label: '30 min', value: 30 },
  { label: '45 min', value: 45 },
  { label: '60 min', value: 60 },
]

export default function EditQuiz() {
  const { id }                      = useParams()
  const navigate                    = useNavigate()
  const [title, setTitle]           = useState('')
  const [published, setPublished]   = useState(false)
  const [timeLimit, setTimeLimit]   = useState(null)
  const [questions, setQuestions]   = useState([])
  const [loading, setLoading]       = useState(true)
  const [saving, setSaving]         = useState(false)
  const [error, setError]           = useState('')

  useEffect(() => {
    const load = async () => {
      const { data: quiz } = await supabase.from('quizzes').select('*').eq('id', id).single()
      const { data: qs }   = await supabase.from('questions').select('*').eq('quiz_id', id).order('order')
      if (quiz) {
        setTitle(quiz.title)
        setPublished(quiz.published)
        setTimeLimit(quiz.time_limit ?? null)
      }
      if (qs) setQuestions(qs.map(q => ({ ...q, options: q.options || ['','','',''] })))
      setLoading(false)
    }
    load()
  }, [id])

  const updateQ      = (idx, field, value) =>
    setQuestions(prev => prev.map((q, i) => i === idx ? { ...q, [field]: value } : q))

  const updateOption = (qIdx, oIdx, value) =>
    setQuestions(prev => prev.map((q, i) => {
      if (i !== qIdx) return q
      const options = [...q.options]; options[oIdx] = value
      return { ...q, options }
    }))

  const addQuestion    = () => setQuestions(prev => [...prev, EMPTY_Q()])
  const removeQuestion = (idx) => setQuestions(prev => prev.filter((_, i) => i !== idx))

  const saveQuiz = async (publishOverride = null) => {
    if (!title.trim()) return setError('Please add a quiz title')
    if (questions.some(q => !q.text.trim())) return setError('All questions need text')
    if (questions.some(q => q.options.some(o => !o.trim()))) return setError('All options must be filled in')

    setSaving(true); setError('')

    const finalPublished = publishOverride !== null ? publishOverride : published

    await supabase.from('quizzes').update({
      title,
      question_count: questions.length,
      published: finalPublished,
      time_limit: timeLimit,
    }).eq('id', id)

    await supabase.from('questions').delete().eq('quiz_id', id)

    const rows = questions.map((q, i) => ({
      quiz_id: id, text: q.text, options: q.options, correct: q.correct, order: i,
    }))
    await supabase.from('questions').insert(rows)
    navigate('/dashboard')
  }

  if (loading) return (
    <div className="min-h-screen bg-cream">
      <AppNav />
      <div className="flex items-center justify-center py-20 text-warm-gray font-dm">Loading quiz...</div>
    </div>
  )

  return (
    <div className="min-h-screen bg-cream">
      <AppNav />
      <main className="max-w-2xl mx-auto px-6 py-10">
        <button onClick={() => navigate('/dashboard')}
          className="text-sm text-warm-gray hover:text-ink mb-6 flex items-center gap-1 font-dm transition-colors">
          ← Back to dashboard
        </button>

        <div className="flex items-center justify-between mb-8">
          <h1 className="font-fraunces font-black text-3xl text-ink">Edit Quiz</h1>
          {/* Live / Draft toggle */}
          <div className={`flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-dm font-medium
            ${published ? 'bg-sage/10 border-sage/30 text-sage' : 'bg-ink/5 border-ink/15 text-warm-gray'}`}>
            <span className={`w-2 h-2 rounded-full ${published ? 'bg-sage' : 'bg-warm-gray'}`} />
            {published ? 'Live' : 'Draft'}
          </div>
        </div>

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
            <Clock size={15} className="text-amber" /> Time Limit
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
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-medium text-warm-gray uppercase tracking-widest font-dm">
                Question {qIdx + 1}
              </span>
              {questions.length > 1 && (
                <button onClick={() => removeQuestion(qIdx)}
                  className="text-warm-gray hover:text-red-500 transition-colors">
                  <Trash2 size={15} />
                </button>
              )}
            </div>
            <input value={q.text} onChange={e => updateQ(qIdx, 'text', e.target.value)}
              placeholder="Type your question here..."
              className="w-full px-4 py-3 rounded-xl border border-ink/15 bg-cream text-ink font-dm text-sm focus:outline-none focus:border-amber transition-colors mb-4" />
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
          </div>
        ))}

        <button onClick={addQuestion}
          className="w-full py-3 rounded-xl border-2 border-dashed border-ink/15 text-warm-gray text-sm hover:border-amber hover:text-amber transition-all font-dm mb-8 flex items-center justify-center gap-2">
          <PlusCircle size={15} /> Add Another Question
        </button>

        {/* Save Buttons */}
        <div className="flex gap-3">
          {/* If live → show "Save as Draft" button */}
          {published ? (
            <>
              <button onClick={() => saveQuiz(false)} disabled={saving}
                className="flex-1 py-3 rounded-xl border border-ink/20 text-ink font-medium text-sm hover:border-ink transition-colors disabled:opacity-50 font-dm">
                Save as Draft
              </button>
              <button onClick={() => saveQuiz(true)} disabled={saving}
                className="flex-1 py-3 rounded-xl bg-amber text-white font-medium text-sm hover:bg-ink transition-colors disabled:opacity-50 font-dm">
                {saving ? 'Saving...' : '💾 Save Changes'}
              </button>
            </>
          ) : (
            <>
              <button onClick={() => saveQuiz(false)} disabled={saving}
                className="flex-1 py-3 rounded-xl border border-ink/20 text-ink font-medium text-sm hover:border-ink transition-colors disabled:opacity-50 font-dm">
                {saving ? 'Saving...' : '💾 Save Draft'}
              </button>
              <button onClick={() => saveQuiz(true)} disabled={saving}
                className="flex-1 py-3 rounded-xl bg-amber text-white font-medium text-sm hover:bg-ink transition-colors disabled:opacity-50 font-dm">
                {saving ? 'Publishing...' : '▶ Publish Quiz'}
              </button>
            </>
          )}
        </div>

      </main>
    </div>
  )
}