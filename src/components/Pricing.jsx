import { useNavigate } from 'react-router-dom'

const trialPlan = [
  '10 quizzes per day',
  'Share via link',
  'Answer review for students',
  'Answer review for teachers',
  'Auto grading',
  'Quiz timer',
]

const proPlan = [
  'Everything in trial',
  'Unlimited quizzes',
  'PDF export (print-ready)',
  'Full student analytics',
  'Unlimited students',
  'Priority support',
]

export default function Pricing() {
  const navigate = useNavigate()
  return (
    <section id="pricing" className="bg-ink py-24 px-6">
      <p className="text-center text-xs font-medium tracking-[2px] uppercase text-amber-light mb-4 font-dm">Pricing</p>
      <h2 className="font-fraunces font-black text-center text-cream leading-none mb-4 mx-auto max-w-xl"
        style={{ fontSize: 'clamp(36px, 5vw, 60px)', letterSpacing: '-2px' }}>
        Simple, <em className="not-italic font-light text-amber">honest</em> pricing
      </h2>
      <p className="text-center text-white/50 text-sm font-dm mb-16">
        Try everything free for 14 days — no credit card needed
      </p>

      <div className="flex flex-wrap gap-6 max-w-2xl mx-auto justify-center">

        {/* 14 Day Trial */}
        <div className="flex-1 min-w-[280px] max-w-[320px] bg-white/5 border border-white/10 rounded-3xl p-10">
          <div className="text-[13px] font-medium tracking-widest uppercase text-white/50 mb-2 font-dm">2-week Free Trial</div>
          <div className="font-fraunces font-black text-white leading-none mb-1">
            <span className="text-2xl align-top mt-2 inline-block">$</span>
            <span style={{fontSize:56}}>0</span>
          </div>
          <div className="text-[13px] text-white/50 mb-8 font-dm">for 14 days · no card needed</div>
          <ul className="mb-9">
            {trialPlan.map(item => (
              <li key={item} className="text-sm text-white/70 py-2 flex gap-2.5 border-b border-white/8 font-dm">
                <span className="text-amber font-bold flex-shrink-0">✓</span>{item}
              </li>
            ))}
            <li className="text-sm text-white/30 py-2 flex gap-2.5 font-dm">
              <span className="flex-shrink-0">✗</span>No PDF export
            </li>
          </ul>
          <button onClick={() => navigate('/signup')}
            className="w-full py-3.5 rounded-full border border-white/30 text-white text-[15px] font-medium hover:bg-white/10 transition-colors font-dm">
            Start free trial
          </button>
        </div>

        {/* Pro */}
        <div className="flex-1 min-w-[280px] max-w-[320px] bg-amber rounded-3xl p-10 hover:-translate-y-1 transition-transform duration-200 relative">
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-cream text-ink text-[11px] font-bold px-4 py-1 rounded-full font-dm tracking-widest uppercase">
            Most Popular
          </div>
          <div className="text-[13px] font-medium tracking-widest uppercase text-white/80 mb-2 font-dm">Pro Teacher</div>
          <div className="font-fraunces font-black text-white leading-none mb-1">
            <span className="text-2xl align-top mt-2 inline-block">$</span>
            <span style={{fontSize:56}}>8</span>
          </div>
          <div className="text-[13px] text-white/70 mb-8 font-dm">per month · cancel anytime</div>
          <ul className="mb-9">
            {proPlan.map(item => (
              <li key={item} className="text-sm text-white/90 py-2 flex gap-2.5 border-b border-white/15 font-dm">
                <span className="text-white font-bold flex-shrink-0">✓</span>{item}
              </li>
            ))}
          </ul>
          <button onClick={() => navigate('/signup')}
            className="w-full py-3.5 rounded-full bg-ink text-white text-[15px] font-medium hover:bg-cream hover:text-ink transition-colors font-dm">
            Get Pro — $8/month
          </button>
        </div>

      </div>
      <p className="text-center text-white/35 text-[13px] mt-6 font-dm">
        After trial expires, upgrade to Pro or lose access. No surprises.
      </p>
    </section>
  )
}