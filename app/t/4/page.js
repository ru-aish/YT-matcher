import Link from 'next/link'
import { dmSerif, fraunces, archivo, spaceMono } from '../fonts'
import styles from './page.module.css'

export const metadata = {
  title: 'Sun Studio · YT Matcher',
  description: 'A bright, editorial take on the YT Matcher cover.',
}

const STATS = [
  ['2,400+', 'creators on the roster'],
  ['$1.9M', 'in deals matched'],
  ['11 min', 'median time to first reply'],
]

const ROSTER = ['Tech', 'Gaming', 'Beauty', 'Finance', 'Food', 'Travel', 'Fitness', 'Music']

export default function SunStudio() {
  return (
    <main
      className={`${dmSerif.variable} ${fraunces.variable} ${archivo.variable} ${spaceMono.variable} ${styles.root}`}
    >
      <div className={styles.sun} aria-hidden />

      <header className={styles.bar}>
        <span className={styles.brand}>YT&middot;MATCHER</span>
        <span className={styles.issue}>ISSUE 01 — THE MATCH</span>
        <Link href="/t" className={styles.back}>
          ← explorations
        </Link>
      </header>

      <section className={styles.hero}>
        <span className={styles.badge} data-tilt="l">
          no cold email
        </span>
        <span className={styles.badge2} data-tilt="r">
          escrow-backed
        </span>

        <p className={styles.eyebrow}>The creator &amp; brand marketplace</p>
        <h1 className={styles.headline}>
          Where
          <span className={styles.italic}> good taste</span>
          <br />
          meets <span className={styles.outline}>good</span> money.
        </h1>
        <p className={styles.dek}>
          Brands find creators worth backing. Creators find deals worth doing.
          We just make the introduction — and hold the cash until it&apos;s earned.
        </p>
        <div className={styles.cta}>
          <Link href="/t/3" className={styles.button}>
            Find your match
          </Link>
          <Link href="/t/2" className={styles.textLink}>
            How it works ↗
          </Link>
        </div>
      </section>

      <div className={styles.marquee} aria-hidden>
        <div className={styles.marqueeTrack}>
          {Array.from({ length: 2 }).map((_, k) => (
            <span key={k}>
              MATCH&nbsp;·&nbsp; AGREE&nbsp;·&nbsp; DELIVER&nbsp;·&nbsp; GET PAID&nbsp;·&nbsp;
              MATCH&nbsp;·&nbsp; AGREE&nbsp;·&nbsp; DELIVER&nbsp;·&nbsp; GET PAID&nbsp;·&nbsp;
            </span>
          ))}
        </div>
      </div>

      <section className={styles.lower}>
        <div className={styles.stats}>
          {STATS.map(([big, label]) => (
            <div key={label} className={styles.stat}>
              <span className={styles.statBig}>{big}</span>
              <span className={styles.statLabel}>{label}</span>
            </div>
          ))}
        </div>

        <div className={styles.roster}>
          <p className={styles.rosterTitle}>On the roster</p>
          <div className={styles.tags}>
            {ROSTER.map((t) => (
              <span key={t} className={styles.tag}>
                {t}
              </span>
            ))}
          </div>
        </div>
      </section>

      <footer className={styles.foot}>
        <span>Printed on the open web.</span>
        <span>YT&middot;Matcher · v1</span>
      </footer>
    </main>
  )
}
