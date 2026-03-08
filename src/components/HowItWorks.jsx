const steps = [
  { num:'1', icon:'✏️', title:'Create your quiz', desc:'Add questions, set correct answers, choose a time limit, and publish — all in under 5 minutes.' },
  { num:'2', icon:'🔗', title:'Share with students', desc:'Send a link or export as PDF. Students take it on any device — no app download, no login required.' },
  { num:'3', icon:'📊', title:'See results instantly', desc:'See every student\'s score, which answers were wrong, and who needs extra help — automatically graded.' },
]

export default function HowItWorks() {
  return (
    <section id="how" className="py-24 px-6">
      <p className="text-center text-xs font-medium tracking-[2px] uppercase text-amber mb-4 font-dm">How it works</p>
      <h2 className="font-fraunces font-black text-center tracking-tight leading-none mb-16 mx-auto max-w-lg"
        style={{ fontSize: 'clamp(36px, 5vw, 60px)', letterSpacing: '-2px' }}>
        Ready in <em className="not-italic font-light text-amber">3 steps</em>
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
        {steps.map((s) => (
          <div key={s.num} className="relative bg-card rounded-2xl p-9 border border-ink/7 hover:-translate-y-1 hover:shadow-[0_16px_48px_rgba(26,18,8,0.1)] transition-all duration-200 overflow-hidden">
            <div className="absolute top-[-10px] right-4 font-fraunces font-black text-[72px] text-ink/5 leading-none select-none">{s.num}</div>
            <div className="text-4xl mb-5">{s.icon}</div>
            <h3 className="font-fraunces font-semibold text-xl text-ink mb-3 leading-tight">{s.title}</h3>
            <p className="text-sm text-warm-gray leading-relaxed font-dm">{s.desc}</p>
          </div>
        ))}
      </div>
    </section>
  )
}