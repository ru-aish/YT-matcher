import Link from 'next/link'
import { fraunces, archivo, jetbrains } from '../fonts'
import styles from './page.module.css'

export const metadata = {
  title: 'The Pipeline · YT Matcher',
  description: 'How YT Matcher operates — the six-step deal flow.',
}

const STEPS = [
  {
    n: '01',
    title: 'Pick a side',
    body: 'Sign up as a Brand looking for reach, or a Creator looking for deals. Your role shapes everything you see.',
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
    body: 'We surface creators by genuine fit — audience, niche, and tone — not raw follower counts.',
    icon: (
      <>
        <path d="M12 4v16" />
        <path d="M7 9l5-5 5 5" />
        <path d="M5 14h14" />
      </>
    ),
  },
  {
    n: '03',
    title: 'Open a deal',
    body: 'One click starts a deal thread. Scope, price, and timeline live in a single shared space.',
    icon: (
      <>
        <rect x="4" y="5" width="16" height="14" rx="2" />
        <path d="M4 9h16" />
        <path d="M8 13h6" />
      </>
    ),
  },
  {
    n: '04',
    title: 'Fund escrow',
    badge: 'Coming soon',
    body: 'Money is held safely until the work ships. Nobody gets ghosted, nobody gets burned.',
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
    body: 'Real-time messaging keeps the conversation moving. History stays attached to the deal.',
    icon: (
      <>
        <path d="M4 6h16v10H9l-4 3v-3H4z" />
        <path d="M8 11h8" />
      </>
    ),
  },
  {
    n: '06',
    title: 'Stay in the loop',
    body: 'Miss a message? An email nudge brings you back so deals never stall in silence.',
    icon: (
      <>
        <rect x="3.5" y="6" width="17" height="12" rx="2" />
        <path d="M4 7l8 6 8-6" />
      </>
    ),
  },
]

export default function Pipeline() {
  return (
    <main
      className={`${fraunces.variable} ${archivo.variable} ${jetbrains.variable} ${styles.root}`}
    >
      <div className={styles.grid} aria-hidden />
      <div className={styles.glow} aria-hidden />

      <header className={styles.bar}>
        <span className={styles.brand}>YT&middot;MATCHER</span>
        <Link href="/t" className={styles.back}>
          ← all explorations
        </Link>
      </header>

      <section className={styles.intro}>
        <span className={styles.kicker}>The flow, end to end</span>
        <h1 className={styles.title}>
          How we <em>operate</em>
        </h1>
        <p className={styles.lede}>
          From first signup to final payout, every deal moves through six steps.
          Follow the line.
        </p>
      </section>

      <ol className={styles.track}>
        <span className={styles.spine} aria-hidden>
          <span className={styles.pulse} />
        </span>

        {STEPS.map((s, i) => (
          <li key={s.n} className={styles.node} style={{ '--i': i }}>
            <div className={styles.marker}>
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden
              >
                {s.icon}
              </svg>
            </div>

            <div className={styles.card}>
              <div className={styles.cardHead}>
                <span className={styles.num}>{s.n}</span>
                {s.badge && <span className={styles.badge}>{s.badge}</span>}
              </div>
              <h2 className={styles.cardTitle}>{s.title}</h2>
              <p className={styles.cardBody}>{s.body}</p>
            </div>
          </li>
        ))}
      </ol>

      <footer className={styles.foot}>
        <Link href="/t/3" className={styles.next}>
          Try it live → Match Lab
        </Link>
      </footer>
    </main>
  )
}
