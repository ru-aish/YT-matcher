import Link from 'next/link'
import Nav from '../_components/Nav'
import Footer from '../_components/Footer'
import Reveal from '../_components/Reveal'
import { PipelineSteps } from '../_components/Pipeline'
import styles from './page.module.css'

export const metadata = {
  title: 'How it works · YT Matcher',
  description:
    'Every step a deal moves through on YT Matcher — from first match to final payout — laid out in the open, including exactly where your money sits.',
}

const ESCROW = [
  {
    k: 'Funded',
    d: 'When both sides agree, the brand commits the budget. It leaves the brand’s account and is locked for this deal only.',
  },
  {
    k: 'Held',
    d: 'The money sits in escrow — visible to both sides — while the creator does the work. It cannot be touched or clawed back mid-deal.',
  },
  {
    k: 'Released',
    d: 'The work ships, the brand approves, and funds release to the creator. Disputes pause the release until it is resolved fairly.',
  },
]

export default function HowItWorks() {
  return (
    <>
      <Nav />
      <main>
        <section className={styles.hero}>
          <div className={styles.heroInner}>
            <Reveal>
              <p className={styles.eyebrow}>How it works</p>
              <h1 className={styles.title}>
                Every step, <em>in the open.</em>
              </h1>
              <p className={styles.lede}>
                A deal on YT Matcher is never a black box. Here is the whole journey —
                from the first match to the final payout — including exactly where your
                money sits at each stage.
              </p>
            </Reveal>
          </div>
        </section>

        <section className={styles.flowSection}>
          <div className={styles.flowInner}>
            <PipelineSteps />
          </div>
        </section>

        <section className={styles.escrow}>
          <div className={styles.escrowInner}>
            <Reveal className={styles.escrowHead}>
              <p className={styles.eyebrowAlt}>The trust step</p>
              <h2 className={styles.escrowTitle}>
                Where your money sits <em>— the whole time.</em>
              </h2>
              <p className={styles.escrowNote}>
                Escrow is coming soon. When it lands, every deal will move through three
                clear states, and both sides can see which one they are in.
              </p>
            </Reveal>

            <ol className={styles.lifecycle}>
              {ESCROW.map((s, i) => (
                <Reveal as="li" key={s.k} className={styles.phase} delay={i * 110}>
                  <span className={styles.phaseN}>0{i + 1}</span>
                  <h3 className={styles.phaseK}>{s.k}</h3>
                  <p className={styles.phaseD}>{s.d}</p>
                </Reveal>
              ))}
            </ol>
          </div>
        </section>

        <section className={styles.cta}>
          <div className={styles.ctaInner}>
            <h2 className={styles.ctaTitle}>Ready to find your match?</h2>
            <div className={styles.ctaRow}>
              <Link href="/#lab" className={styles.primary}>
                Try the Match Lab
              </Link>
              <Link href="/" className={styles.secondary}>
                ← Back home
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
