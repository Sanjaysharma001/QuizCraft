import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export default function LandingNav() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
    setMenuOpen(false)
  }

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-12 py-5 transition-all duration-300
      ${scrolled ? 'bg-cream/95 border-b border-ink/10 backdrop-blur-md' : 'bg-cream/70 backdrop-blur-md'}`}>

      <div className="font-fraunces font-black text-[22px] tracking-tight text-ink cursor-pointer" onClick={() => scrollTo('hero')}>
        Quiz<span className="text-amber">Craft</span>
      </div>

      <div className="hidden md:flex items-center gap-8">
        {[['how','How it works'],['features','Features'],['pricing','Pricing']].map(([id, label]) => (
          <button key={id} onClick={() => scrollTo(id)}
            className="font-dm text-sm font-medium text-warm-gray hover:text-ink transition-colors">
            {label}
          </button>
        ))}
        <button onClick={() => navigate('/login')}
          className="font-dm text-sm font-medium text-warm-gray hover:text-ink transition-colors">
          Login
        </button>
        <button onClick={() => navigate('/signup')}
          className="font-dm text-sm font-medium bg-ink text-cream px-6 py-2.5 rounded-full hover:bg-amber transition-all duration-200 hover:-translate-y-px">
          Start Free Trial
        </button>
      </div>

      <button className="md:hidden text-2xl text-ink" onClick={() => setMenuOpen(!menuOpen)}>
        {menuOpen ? '✕' : '☰'}
      </button>

      {menuOpen && (
        <div className="absolute top-full left-0 right-0 bg-cream border-b border-ink/10 shadow-lg flex flex-col gap-4 px-6 py-6 md:hidden">
          {[['how','How it works'],['features','Features'],['pricing','Pricing']].map(([id, label]) => (
            <button key={id} onClick={() => scrollTo(id)}
              className="text-left font-dm text-sm font-medium text-warm-gray hover:text-ink transition-colors">
              {label}
            </button>
          ))}
          <button onClick={() => { navigate('/login'); setMenuOpen(false) }}
            className="text-left font-dm text-sm font-medium text-warm-gray hover:text-ink">Login</button>
          <button onClick={() => { navigate('/signup'); setMenuOpen(false) }}
            className="font-dm text-sm font-medium bg-amber text-white px-6 py-2.5 rounded-full w-fit">
            Start Free Trial
          </button>
        </div>
      )}
    </nav>
  )
}
