import Nav from './_components/Nav'
import Hero from './_components/Hero'
import ProofStrip from './_components/ProofStrip'
import Pipeline from './_components/Pipeline'
import MatchLab from './_components/MatchLab'
import Audiences from './_components/Audiences'
import Trust from './_components/Trust'
import Voices from './_components/Voices'
import Faq from './_components/Faq'
import ClosingCta from './_components/ClosingCta'
import Footer from './_components/Footer'

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <ProofStrip />
        <Pipeline />
        <MatchLab />
        <Audiences />
        <Trust />
        <Voices />
        <Faq />
        <ClosingCta />
      </main>
      <Footer />
    </>
  )
}
