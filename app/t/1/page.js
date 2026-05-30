import Link from 'next/link'
import { instrumentSerif, archivo, jetbrains } from '../fonts'
import styles from './page.module.css'

export const metadata = {
  title: 'Quiet Signal · YT Matcher',
  description: 'A minimal, direct take on the YT Matcher landing page.',
}

const POINTS = [
  ['01', 'Find', 'Brands and creators, sorted by fit — not follower vanity.'],
  ['02', 'Agree', 'Open a deal in one click. Terms stay in one thread.'],
  ['03', 'Deliver', 'Escrow holds the money until the work ships.'],
]

export default function QuietSignal() {
  return (
    <main
      className={`${instrumentSerif.variable} ${archivo.variable} ${jetbrains.variable} ${styles.root}`}
    >
      <div className={styles.grain} aria-hidden />

      <header className={styles.bar}>
        <span className={styles.brand}>YT&middot;MATCHER</span>
        <Link href="/t" className={styles.back}>
          ← all explorations
        </Link>
      </header>

      <section className={styles.hero}>
        <span className={styles.kicker}>Creator &times; Brand marketplace</span>
        <h1 className={styles.headline}>
          The right deal
          <br />
          finds the <em>right</em>
          <br />
          people.
        </h1>
        <p className={styles.sub}>
          A calm place for brands and YouTube creators to meet, agree, and get paid —
          without the noise of cold email.
        </p>

        <div className={styles.actions}>
          <Link href="/t" className={styles.primary}>
            Start matching
          </Link>
          <Link href="/t/2" className={styles.ghost}>
            See how it works
          </Link>
        </div>
      </section>

      <div className={styles.rule} aria-hidden />

      <section className={styles.points}>
        {POINTS.map(([n, title, body]) => (
          <div key={n} className={styles.point}>
            <span className={styles.pointN}>{n}</span>
            <h2 className={styles.pointTitle}>{title}</h2>
            <p className={styles.pointBody}>{body}</p>
          </div>
        ))}
      </section>

      <footer className={styles.foot}>
        <span>No spam. No noise. Just signal.</span>
        <span className={styles.dot} aria-hidden />
        <span>v1 — escrow &amp; chat in progress</span>
      </footer>
    </main>
  )
}
