import Reveal from './Reveal'
import styles from './Trust.module.css'

const CARDS = [
  {
    t: 'Escrow, not promises',
    d: 'Funds are committed the moment a deal opens and released only when the work ships. Creators never front their time; brands never pay into thin air.',
    tag: 'Coming soon',
    icon: (
      <>
        <rect x="4" y="9" width="16" height="11" rx="2" />
        <path d="M8 9V6.5a4 4 0 0 1 8 0V9" />
        <circle cx="12" cy="14.5" r="1.7" />
      </>
    ),
  },
  {
    t: 'Real audiences only',
    d: 'We score genuine engagement, not vanity counts, so a match means a real overlap — and brands never pay for inflated numbers.',
    icon: (
      <>
        <path d="M12 3l8 3v6c0 5-3.4 7.7-8 9-4.6-1.3-8-4-8-9V6z" />
        <path d="M9 12l2 2 4-4" />
      </>
    ),
  },
  {
    t: 'Fees in plain sight',
    d: 'One transparent rate, shown before you commit. What you agree to is what you pay — no surprises at payout, ever.',
    icon: (
      <>
        <path d="M6 3h12v18l-3-2-3 2-3-2-3 2z" />
        <path d="M9 8h6M9 12h6" />
      </>
    ),
  },
]

export default function Trust() {
  return (
    <section className={styles.root} id="trust">
      <div className={styles.inner}>
        <div className={styles.top}>
          <Reveal>
            <p className={styles.eyebrow}>Why you can trust us</p>
            <h2 className={styles.statement}>
              We make money when deals <em>work</em> — not when they fall apart.
            </h2>
          </Reveal>
          <Reveal className={styles.note} delay={120}>
            <p>
              That keeps our incentives pointed the same way as yours: fair matches,
              clear terms, and money that&apos;s safe until the work is done.
            </p>
          </Reveal>
        </div>

        <div className={styles.cards}>
          {CARDS.map((c, i) => (
            <Reveal key={c.t} as="article" className={styles.card} delay={i * 110}>
              <span className={styles.icon} aria-hidden>
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  {c.icon}
                </svg>
              </span>
              <div className={styles.cardHead}>
                <h3 className={styles.cardTitle}>{c.t}</h3>
                {c.tag && <span className={styles.badge}>{c.tag}</span>}
              </div>
              <p className={styles.cardBody}>{c.d}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
