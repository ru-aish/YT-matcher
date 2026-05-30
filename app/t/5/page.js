import Link from 'next/link'
import { syne, archivo, spaceMono } from '../fonts'
import styles from './page.module.css'

export const metadata = {
  title: 'Loud Machine · YT Matcher',
  description: 'A bold, brutalist take on the YT Matcher landing page.',
}

const BLOCKS = [
  { n: '01', t: 'MATCH', d: 'Sorted by fit, not follower vanity. Real audiences only.', c: 'blue' },
  { n: '02', t: 'DEAL', d: 'One click opens a thread. Scope and price in one place.', c: 'pink' },
  { n: '03', t: 'ESCROW', d: 'Cash held until the work ships. Coming soon to v1.', c: 'yellow' },
  { n: '04', t: 'PAID', d: 'Work lands, money releases. No chasing invoices.', c: 'blue' },
]

export default function LoudMachine() {
  return (
    <main className={`${syne.variable} ${archivo.variable} ${spaceMono.variable} ${styles.root}`}>
      <div className={styles.ticker} aria-hidden>
        <div className={styles.tickerTrack}>
          {Array.from({ length: 2 }).map((_, k) => (
            <span key={k}>
              CREATORS WANTED ★ BRANDS WELCOME ★ NO COLD EMAIL ★ ESCROW BACKED ★
              CREATORS WANTED ★ BRANDS WELCOME ★ NO COLD EMAIL ★ ESCROW BACKED ★
            </span>
          ))}
        </div>
      </div>

      <header className={styles.bar}>
        <span className={styles.brand}>YT★MATCHER</span>
        <Link href="/t" className={styles.back}>
          [ ← ALL ]
        </Link>
      </header>

      <section className={styles.hero}>
        <span className={styles.sticker}>V1 / LOUD</span>
        <h1 className={styles.headline}>
          STOP
          <br />
          <span className={styles.hl}>GUESSING.</span>
          <br />
          START
          <br />
          <span className={styles.hl2}>MATCHING.</span>
        </h1>
        <p className={styles.dek}>
          The marketplace where YouTube creators and brands cut the small talk and
          make the deal. Big energy. Zero ghosting.
        </p>
        <Link href="/t/3" className={styles.button}>
          OPEN THE MATCH LAB →
        </Link>
      </section>

      <section className={styles.grid}>
        {BLOCKS.map((b) => (
          <article key={b.n} className={`${styles.block} ${styles[b.c]}`}>
            <span className={styles.blockN}>{b.n}</span>
            <h2 className={styles.blockT}>{b.t}</h2>
            <p className={styles.blockD}>{b.d}</p>
          </article>
        ))}
      </section>

      <footer className={styles.foot}>
        <span>MADE LOUD ON THE OPEN WEB</span>
        <span>© YT★MATCHER</span>
      </footer>
    </main>
  )
}
