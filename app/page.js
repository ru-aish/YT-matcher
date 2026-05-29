import Hero from './components/Hero'
import HowItWorks from './components/HowItWorks'
import InteractiveDemo from './components/InteractiveDemo'
import SocialProof from './components/SocialProof'
import CTA from './components/CTA'

export default function Home() {
  return (
    <main>
      <Hero />
      <HowItWorks />
      <InteractiveDemo />
      <SocialProof />
      <CTA />
    </main>
  )
}
