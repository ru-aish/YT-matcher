import Link from 'next/link'
import { fraunces, archivo, jetbrains } from './fonts'
import styles from './page.module.css'

export const metadata = {
  title: 'UI Explorations · YT Matcher',
  description: 'Five distinct UI directions for YT Matcher.',
}

const ENTRIES = [
  {
    n: '01',
    href: '/t/1',
    title: 'Quiet Signal',
    kind: 'Dark · Minimal',
    desc: 'Brutally minimal landing. Tight type, vast negative space, one warm accent.',
  },
  {
    n: '02',
    href: '/t/2',
    title: 'The Pipeline',
    kind: 'Dark · Diagram',
    desc: 'How we operate — the six-step deal flow drawn as a connected node map.',
  },
  {
    n: '03',
    href: '/t/3',
    title: 'Match Lab',
    kind: 'Dark · Interactive',
    desc: 'A live match simulator. Filter creators, tilt cards, watch a chat type itself.',
  },
  {
    n: '04',
    href: '/t/4',
    title: 'Sun Studio',
    kind: 'Light · Editorial',
    desc: 'Unrestricted. Cream paper, ink, coral — a maximalist magazine cover.',
  },
  {
    n: '05',
    href: '/t/5',
    title: 'Loud Machine',
    kind: 'Bold · Brutalist',
    desc: 'Unrestricted. Hard borders, offset shadows, electric blocks that shout.',
  },
]

export default function Hub() {
  return (
    <main className={`${fraunces.variable} ${archivo.variable} ${jetbrains.variable} ${styles.root}`}>
      <div className={styles.grain} aria-hidden />
      <div className={styles.glow} aria-hidden />

      <header className={styles.header}>
        <span className={styles.kicker}>YT&middot;MATCHER — UI EXPLORATIONS</span>
        <h1 className={styles.title}>
          Five ways
          <br />
          to look <em>at it.</em>
        </h1>
        <p className={styles.lede}>
          One product, five committed aesthetic directions. Each route is self-contained.
          Pick a door.
        </p>
      </header>

      <nav className={styles.grid}>
        {ENTRIES.map((e, i) => (
          <Link
            key={e.href}
            href={e.href}
            className={styles.card}
            style={{ '--i': i }}
          >
            <span className={styles.cardN}>{e.n}</span>
            <span className={styles.cardKind}>{e.kind}</span>
            <span className={styles.cardTitle}>{e.title}</span>
            <span className={styles.cardDesc}>{e.desc}</span>
            <span className={styles.cardArrow} aria-hidden>
              →
            </span>
          </Link>
        ))}
      </nav>

      <footer className={styles.foot}>
        <span>Live at <code>/t</code> on the preview deploy.</span>
        <span>Remove anytime — delete <code>app/t/</code>.</span>
      </footer>
    </main>
  )
}
