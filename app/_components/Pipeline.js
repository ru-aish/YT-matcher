import Link from 'next/link'
import Reveal from './Reveal'
import styles from './Pipeline.module.css'

export const STEPS = [
  {
    n: '01',
    title: 'Pick a side',
    body: 'Sign up as a Brand chasing reach or a Creator chasing deals. Your role shapes everything you see next.',
    icon: (
      <>
        <circle cx="9" cy="8" r="3.2" />
        <circle cx="17" cy="11" r="2.4" />
        <path d="M3.5 19c0-3 2.5-4.6 5.5-4.6s5.5 1.6 5.5 4.6" />
      </>
    ),
  },
  {
    n: '02',
    title: 'Get matched',
    body: 'We rank by genuine fit — audience, niche, and tone — so the first intro is already a good one.',
    icon: (
      <>
        <circle cx="12" cy="12" r="7.5" />
        <circle cx="12" cy="12" r="3" />
        <path d="M12 1.5v3M12 19.5v3M1.5 12h3M19.5 12h3" />
      </>
    ),
  },
  {
    n: '03',
    title: 'Open a deal',
    body: 'One click starts a shared thread. Scope, price, and timeline live in one place both sides can see.',
    icon: (
      <>
        <rect x="4" y="5" width="16" height="14" rx="2" />
        <path d="M4 9h16M8 13h6" />
      </>
    ),
  },
  {
    n: '04',
    title: 'Fund escrow',
    badge: 'Coming soon',
    highlight: true,
    body: 'Money is held safely until the work ships — visible to both sides the whole time. Nobody fronts, nobody ghosts.',
    icon: (
      <>
        <rect x="4" y="8" width="16" height="11" rx="2" />
        <path d="M8 8V6.5a4 4 0 0 1 8 0V8" />
        <circle cx="12" cy="13.5" r="1.6" />
      </>
    ),
  },
  {
    n: '05',
    title: 'Chat live',
    body: 'Real-time messaging keeps things moving. Every message stays attached to the deal, on the record.',
    icon: (
      <>
        <path d="M4 6h16v10H9l-4 3v-3H4z" />
        <path d="M8 11h8" />
      </>
    ),
  },
  {
    n: '06',
    title: 'Ship & get paid',
    body: 'Work lands, payment releases. An email nudge brings anyone back before a deal can stall in silence.',
    icon: (
      <>
        <path d="M4 7l8 5 8-5" />
        <rect x="4" y="5" width="16" height="14" rx="2" />
        <path d="M9.5 19l2 2 4-4" />
      </>
    ),
  },
]

export function PipelineSteps({ steps = STEPS }) {
  return (
    <ol className={styles.track}>
      <span className={styles.spine} aria-hidden>
        <span className={styles.pulse} />
      </span>
      {steps.map((s, i) => (
        <Reveal as="li" key={s.n} className={styles.node} delay={i * 70}>
          <span
            className={`${styles.marker} ${s.highlight ? styles.markerHi : ''}`}
            aria-hidden
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              {s.icon}
            </svg>
          </span>
          <div className={`${styles.card} ${s.highlight ? styles.cardHi : ''}`}>
            <div className={styles.cardHead}>
              <span className={styles.num}>{s.n}</span>
              {s.badge && <span className={styles.badge}>{s.badge}</span>}
            </div>
            <h3 className={styles.cardTitle}>{s.title}</h3>
            <p className={styles.cardBody}>{s.body}</p>
          </div>
        </Reveal>
      ))}
    </ol>
  )
}

export default function Pipeline() {
  return (
    <section className={styles.root} id="how">
      <div className={styles.inner}>
        <div className={styles.aside}>
          <Reveal>
            <p className={styles.eyebrow}>How it works</p>
            <h2 className={styles.heading}>
              A deal, start to finish — <em>in the open.</em>
            </h2>
            <p className={styles.lede}>
              No black boxes. You can see every step a deal moves through, including
              exactly where the money sits.
            </p>
          </Reveal>

          <Reveal className={styles.promise} delay={120}>
            <li>Clear fees, quoted up front</li>
            <li>Escrow you can watch in real time</li>
            <li>Full message &amp; deal history, always</li>
          </Reveal>

          <Reveal delay={200}>
            <Link href="/how-it-works" className={styles.deep}>
              See the full flow ↗
            </Link>
          </Reveal>
        </div>

        <div className={styles.flow}>
          <PipelineSteps />
        </div>
      </div>
    </section>
  )
}
