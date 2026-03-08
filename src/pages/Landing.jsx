import LandingNav from '../components/LandingNav'
import Hero from '../components/Hero'
import HowItWorks from '../components/HowItWorks'
import Features from '../components/Features'
import Pricing from '../components/Pricing'
import { Testimonials, CTA, Footer } from '../components/LandingFooter'

export default function Landing() {
  return (
    <div className="min-h-screen bg-cream">
      <LandingNav />
      <Hero />
      <HowItWorks />
      <Features />
      <Pricing />
      <Testimonials />
      <CTA />
      <Footer />
    </div>
  )
}
