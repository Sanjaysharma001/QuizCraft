import { useEffect, useState, useRef } from 'react'
import { useParams } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function TakeQuiz() {
  const { shareId }               = useParams()
  const [quiz, setQuiz]           = useState(null)
  const [questions, setQs]        = useState([])
  const [name, setName]           = useState('')
  const [started, setStarted]     = useState(false)
  const [answers, setAnswers]     = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore]         = useState(null)
  const [loading, setLoading]     = useState(true)
  const [notFound, setNotFound]   = useState(false)
  const [timeLeft, setTimeLeft]   = useState(null)
  const [timesUp, setTimesUp]     = useState(false)
  const answersRef                = useRef({})
  const timerRef                  = useRef(null)

  useEffect(() => {
    const load = async () => {
      const { data: quiz } = await supabase.from('quizzes').select('*').eq('share_id', shareId).single()
      if (!quiz || !quiz.published) { setNotFound(true); setLoading(false); return }
      const { data: qs } = await supabase.from('questions').select('*').eq('quiz_id', quiz.id).order('order')
      setQuiz(quiz)
      setQs(qs || [])
      if (quiz.time_limit) setTimeLeft(quiz.time_limit * 60)
      setLoading(false)
    }
    load()
  }, [shareId])

  useEffect(() => {
    if (!started || timeLeft === null) return
    if (timeLeft <= 0) { handleTimesUp(); return }
    timerRef.current = setTimeout(() => setTimeLeft(t => t - 1), 1000)
    return () => clearTimeout(timerRef.current)
  }, [started, timeLeft])

  useEffect(() => { answersRef.current = answers }, [answers])

  const handleTimesUp = () => {
    clearTimeout(timerRef.current)
    setTimesUp(true)
    submitQuiz(answersRef.current, true)
  }

  const gradeAnswer = (q, studentAnswer) => {
    if (q.type === 'short') {
      const correct = (q.options[0] || '').toLowerCase().trim()
      const student = (studentAnswer || '').toLowerCase().trim()
      return student.includes(correct) || correct.includes(student)
    }
    return studentAnswer === q.correct
  }

  const submitQuiz = async (finalAnswers = answers, auto = false) => {
    let correct = 0
    questions.forEach((q, i) => { if (gradeAnswer(q, finalAnswers[i])) correct++ })
    const pct = Math.round((correct / questions.length) * 100)
    setScore({ correct, total: questions.length, pct, auto })
    await supabase.from('results').insert({
      quiz_id: quiz.id,
      student_name: name || 'Anonymous',
      answers: finalAnswers,
      score: pct, correct, total: questions.length,
    })
    setSubmitted(true)
  }

  const formatTime = (s) => {
    const m = Math.floor(s / 60)
    const sec = s % 60
    return `${m}:${sec.toString().padStart(2, '0')}`
  }

  if (loading) return (
    <div className="min-h-screen bg-cream flex items-center justify-center text-warm-gray font-dm">Loading quiz...</div>
  )

  if (notFound) return (
    <div className="min-h-screen bg-cream flex items-center justify-center px-4">
      <div className="text-center">
        <div className="text-5xl mb-4">🔍</div>
        <h2 className="font-fraunces font-black text-2xl text-ink mb-2">Quiz not found</h2>
        <p className="text-warm-gray text-sm font-dm">This quiz doesn't exist or hasn't been published yet.</p>
      </div>
    </div>
  )

  // ── Results + Answer Review ──
  if (submitted && score) return (
    <div className="min-h-screen bg-cream px-4 py-10">
      <div className="max-w-xl mx-auto">
        {score.auto && (
          <div className="bg-amber/10 border border-amber/30 text-amber text-sm px-4 py-3 rounded-xl mb-6 text-center font-dm">
            ⏰ Time's up! Your quiz was auto-submitted.
          </div>
        )}
        <div className="bg-card rounded-2xl p-8 border border-ink/7 text-center mb-8">
          <div className="text-5xl mb-3">
            {score.pct >= 80 ? '🎉' : score.pct >= 60 ? '👍' : '📚'}
          </div>
          <h2 className="font-fraunces font-black text-3xl text-ink mb-1">
            {score.pct >= 80 ? 'Great job!' : score.pct >= 60 ? 'Good effort!' : 'Keep practicing!'}
          </h2>
          <div className="font-fraunces font-black text-6xl text-amber mt-4 mb-1">{score.pct}%</div>
          <p className="text-warm-gray text-sm font-dm">{score.correct} out of {score.total} correct</p>
          <p className="text-ink text-sm font-dm font-medium mt-2">{quiz.title}</p>
        </div>

        <h3 className="font-fraunces font-black text-xl text-ink mb-4">Answer Review</h3>
        {questions.map((q, idx) => {
          const studentAnswer = answers[idx]
          const isCorrect = gradeAnswer(q, studentAnswer)
          return (
            <div key={idx} className={`rounded-2xl p-6 border mb-4
              ${isCorrect ? 'bg-sage/5 border-sage/25' : 'bg-red-50 border-red-200'}`}>
              <div className="flex items-start gap-3 mb-4">
                <span className={`text-lg flex-shrink-0 ${isCorrect ? 'text-sage' : 'text-red-500'}`}>
                  {isCorrect ? '✅' : '❌'}
                </span>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-xs font-medium text-warm-gray uppercase tracking-widest font-dm">
                      Question {idx + 1}
                    </p>
                    <span className="text-[10px] bg-ink/8 text-warm-gray px-2 py-0.5 rounded-full font-dm">
                      {q.type === 'mcq' ? 'Multiple Choice' : q.type === 'truefalse' ? 'True/False' : 'Short Answer'}
                    </span>
                  </div>
                  <p className="font-fraunces font-semibold text-base text-ink">{q.text}</p>
                </div>
              </div>

              {/* MCQ & True/False review */}
              {(q.type === 'mcq' || q.type === 'truefalse') && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 ml-8">
                  {q.options.map((opt, oIdx) => {
                    const isStudentPick = studentAnswer === oIdx
                    const isRightAnswer = q.correct === oIdx
                    let style = 'bg-white border-ink/10 text-ink'
                    if (isRightAnswer) style = 'bg-sage/15 border-sage text-sage font-medium'
                    if (isStudentPick && !isRightAnswer) style = 'bg-red-100 border-red-400 text-red-700 font-medium'
                    return (
                      <div key={oIdx} className={`px-3 py-2.5 rounded-xl border text-sm font-dm flex items-center gap-2 ${style}`}>
                        <span className="font-bold text-xs">{String.fromCharCode(65 + oIdx)}.</span>
                        <span>{opt}</span>
                        {isRightAnswer && <span className="ml-auto text-xs">✓ Correct</span>}
                        {isStudentPick && !isRightAnswer && <span className="ml-auto text-xs">✗ Yours</span>}
                      </div>
                    )
                  })}
                </div>
              )}

              {/* Short answer review */}
              {q.type === 'short' && (
                <div className="ml-8 space-y-2">
                  <div className="px-3 py-2.5 rounded-xl border bg-white border-ink/10 text-sm font-dm">
                    <span className="text-warm-gray text-xs">Your answer: </span>
                    <span className="text-ink">{studentAnswer || <em className="text-warm-gray">No answer</em>}</span>
                  </div>
                  {!isCorrect && (
                    <div className="px-3 py-2.5 rounded-xl border bg-sage/10 border-sage text-sm font-dm">
                      <span className="text-warm-gray text-xs">Correct answer: </span>
                      <span className="text-sage font-medium">{q.options[0]}</span>
                    </div>
                  )}
                </div>
              )}

              {!isCorrect && q.type !== 'short' && (
                <div className="ml-8 mt-3 text-xs text-warm-gray font-dm bg-white rounded-lg px-3 py-2 border border-ink/8">
                  💡 Correct answer: <strong className="text-sage">{q.options[q.correct]}</strong>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )

  // ── Name Entry ──
  if (!started) return (
    <div className="min-h-screen bg-cream flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="font-fraunces font-black text-2xl text-ink mb-1">
            Quiz<span className="text-amber">Craft</span>
          </div>
        </div>
        <div className="bg-card rounded-2xl p-8 border border-ink/7">
          <h1 className="font-fraunces font-black text-2xl text-ink mb-1">{quiz.title}</h1>
          <div className="flex items-center gap-3 mb-6">
            <span className="text-warm-gray text-sm font-dm">{questions.length} questions</span>
            {quiz.time_limit && (
              <span className="flex items-center gap-1 text-xs bg-amber/10 text-amber px-2.5 py-1 rounded-full font-dm font-medium">
                ⏱️ {quiz.time_limit} min limit
              </span>
            )}
          </div>
          <label className="block text-sm font-medium text-ink mb-2 font-dm">Your name (optional)</label>
          <input value={name} onChange={e => setName(e.target.value)}
            placeholder="Enter your name"
            className="w-full px-4 py-3 rounded-xl border border-ink/15 bg-cream text-ink font-dm text-sm focus:outline-none focus:border-amber transition-colors mb-5" />
          <button onClick={() => setStarted(true)}
            className="w-full bg-amber text-white py-3 rounded-xl font-medium text-sm hover:bg-ink transition-colors font-dm">
            Start Quiz →
          </button>
        </div>
      </div>
    </div>
  )

  // ── Quiz Questions ──
  const answered = Object.keys(answers).length
  const progress = Math.round((answered / questions.length) * 100)
  const timerColor = timeLeft !== null
    ? timeLeft <= 60 ? 'text-red-500' : timeLeft <= 180 ? 'text-amber' : 'text-sage'
    : ''

  return (
    <div className="min-h-screen bg-cream px-4 py-10">
      <div className="max-w-xl mx-auto">
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <h1 className="font-fraunces font-black text-xl text-ink">{quiz.title}</h1>
            {timeLeft !== null && (
              <div className={`flex items-center gap-1.5 font-dm font-bold text-sm px-3 py-1.5 rounded-full border
                ${timeLeft <= 60 ? 'bg-red-50 border-red-200 text-red-500' :
                  timeLeft <= 180 ? 'bg-amber/10 border-amber/30 text-amber' :
                  'bg-sage/10 border-sage/30 text-sage'}`}>
                ⏱️ {formatTime(timeLeft)}
              </div>
            )}
          </div>
          {timeLeft !== null && timeLeft <= 60 && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-xs px-3 py-2 rounded-lg mt-2 font-dm text-center">
              ⚠️ Less than 1 minute remaining!
            </div>
          )}
          <div className="flex items-center gap-3 mt-3">
            <div className="flex-1 h-1.5 bg-ink/10 rounded-full overflow-hidden">
              <div className="h-full bg-amber rounded-full transition-all duration-300" style={{ width: `${progress}%` }} />
            </div>
            <span className="text-xs text-warm-gray font-dm">{answered}/{questions.length}</span>
          </div>
        </div>

        {questions.map((q, idx) => (
          <div key={idx} className="bg-card rounded-2xl p-6 border border-ink/7 mb-4">
            <div className="flex items-center gap-2 mb-2">
              <p className="text-xs font-medium text-warm-gray uppercase tracking-widest font-dm">
                Question {idx + 1}
              </p>
              <span className="text-[10px] bg-ink/8 text-warm-gray px-2 py-0.5 rounded-full font-dm">
                {q.type === 'mcq' ? 'Multiple Choice' : q.type === 'truefalse' ? 'True / False' : 'Short Answer'}
              </span>
            </div>
            <p className="font-fraunces font-semibold text-lg text-ink mb-4">{q.text}</p>

            {/* MCQ */}
            {q.type === 'mcq' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {q.options.map((opt, oIdx) => (
                  <button key={oIdx}
                    onClick={() => setAnswers(prev => ({ ...prev, [idx]: oIdx }))}
                    className={`px-4 py-3 rounded-xl text-sm text-left border-2 transition-all font-dm
                      ${answers[idx] === oIdx
                        ? 'border-amber bg-amber/10 text-ink font-medium'
                        : 'border-ink/12 bg-cream text-ink hover:border-amber/50'}`}>
                    <span className="font-medium mr-2 text-warm-gray">{String.fromCharCode(65 + oIdx)}.</span>
                    {opt}
                  </button>
                ))}
              </div>
            )}

            {/* True / False */}
            {q.type === 'truefalse' && (
              <div className="grid grid-cols-2 gap-3">
                {['True', 'False'].map((opt, oIdx) => (
                  <button key={oIdx}
                    onClick={() => setAnswers(prev => ({ ...prev, [idx]: oIdx }))}
                    className={`py-4 rounded-xl text-sm font-medium border-2 transition-all font-dm
                      ${answers[idx] === oIdx
                        ? oIdx === 0 ? 'border-sage bg-sage/10 text-sage' : 'border-red-400 bg-red-50 text-red-600'
                        : 'border-ink/12 bg-cream text-ink hover:border-amber/50'}`}>
                    {oIdx === 0 ? '✅' : '❌'} {opt}
                  </button>
                ))}
              </div>
            )}

            {/* Short Answer */}
            {q.type === 'short' && (
              <textarea
                value={answers[idx] || ''}
                onChange={e => setAnswers(prev => ({ ...prev, [idx]: e.target.value }))}
                placeholder="Type your answer here..."
                rows={3}
                className="w-full px-4 py-3 rounded-xl border border-ink/15 bg-cream text-ink font-dm text-sm focus:outline-none focus:border-amber transition-colors resize-none"
              />
            )}
          </div>
        ))}

        <button onClick={() => submitQuiz()}
          disabled={answered < questions.length}
          className="w-full bg-amber text-white py-4 rounded-xl font-medium text-sm hover:bg-ink transition-colors disabled:opacity-40 disabled:cursor-not-allowed font-dm mt-2">
          {answered < questions.length
            ? `Answer all questions (${questions.length - answered} remaining)`
            : 'Submit Quiz ✓'}
        </button>
      </div>
    </div>
  )
}