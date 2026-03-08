const features = [
  { icon:'⏱️', title:'Quiz timer', desc:'Set a time limit on any quiz. Students see a live countdown and the quiz auto-submits when time runs out.' },
  { icon:'✅', title:'Auto grading', desc:'Every quiz is graded instantly and automatically. No manual marking — ever. Scores appear the moment students submit.' },
  { icon:'🔍', title:'Answer review', desc:'Students see exactly which answers were right and wrong after submitting. Teachers see a full breakdown per student.' },
  { icon:'📊', title:'Live results', desc:"See every student's score in real time as they submit. Spot who's struggling before it's too late." },
]

export default function Features() {
  return (
    <section id="features" className="bg-card py-24 px-6">
      <p className="text-center text-xs font-medium tracking-[2px] uppercase text-amber mb-4 font-dm">Features</p>
      <h2 className="font-fraunces font-black text-center leading-none mb-16 mx-auto max-w-xl"
        style={{ fontSize: 'clamp(36px, 5vw, 60px)', letterSpacing: '-2px' }}>
        Everything you <em className="not-italic font-light text-amber">actually need</em>
      </h2>
      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-5">

        {/* Wide PDF card */}
        <div className="md:col-span-2 bg-cream rounded-2xl p-8 border border-ink/7 flex flex-col md:flex-row gap-10 items-start md:items-center hover:-translate-y-1 transition-all duration-200">
          <div className="flex-1">
            <div className="w-12 h-12 rounded-xl bg-amber/12 flex items-center justify-center text-2xl mb-5">📄</div>
            <h3 className="font-fraunces font-semibold text-xl text-ink mb-2.5">Export as PDF — instantly</h3>
            <p className="text-sm text-warm-gray leading-relaxed font-dm">Need a paper quiz? Export any quiz as a clean, print-ready PDF in one click. Great for classrooms with no internet.</p>
            <span className="inline-block mt-3 text-xs font-medium text-amber bg-amber/10 px-3 py-1 rounded-full font-dm">⭐ Pro feature</span>
          </div>
          <div className="flex-1 bg-cream rounded-xl p-4 min-w-0 border border-ink/7">
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <div className="flex items-center justify-between mb-3 pb-3 border-b-2 border-ink">
                <div className="font-fraunces font-black text-sm">Chapter 5 Review Quiz</div>
                <div className="text-[10px] text-warm-gray font-dm">Ms. Johnson · Grade 8</div>
              </div>
              {['What is the powerhouse of the cell?','Which process converts glucose to energy?'].map((q, i) => (
                <div key={i} className="mb-3">
                  <div className="text-[11px] font-medium text-ink mb-1 font-dm">{i+1}. {q}</div>
                  <div className="text-[10px] text-warm-gray pl-3 font-dm">A) Option &nbsp; B) Option &nbsp; C) Option &nbsp; D) Option</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {features.map((f) => (
          <div key={f.title} className="bg-cream rounded-2xl p-8 border border-ink/7 hover:-translate-y-1 transition-all duration-200">
            <div className="w-12 h-12 rounded-xl bg-amber/12 flex items-center justify-center text-2xl mb-5">{f.icon}</div>
            <h3 className="font-fraunces font-semibold text-xl text-ink mb-2.5">{f.title}</h3>
            <p className="text-sm text-warm-gray leading-relaxed font-dm">{f.desc}</p>
          </div>
        ))}

      </div>
    </section>
  )
}