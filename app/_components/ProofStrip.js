import Reveal from './Reveal'
import styles from './ProofStrip.module.css'

const STATS = [
  { big: '2,400+', label: 'creators on the roster' },
  { big: '$1.9M', label: 'matched in deals' },
  { big: '11 min', label: 'median time to first reply' },
  { big: '4.8/5', label: 'average deal rating' },
]

const ROSTER = [
  'Tech',
  'Gaming',
  'Beauty',
  'Finance',
  'Food',
  'Travel',
  'Fitness',
  'Music',
  'Education',
]

export default function ProofStrip() {
  return (
    <section className={styles.root} aria-label="By the numbers">
      <div className={styles.inner}>
        <Reveal className={styles.label} as="p">
          Trusted on both sides of the table
        </Reveal>

        <div className={styles.stats}>
          {STATS.map((s, i) => (
            <Reveal key={s.label} className={styles.stat} delay={i * 90}>
              <span className={styles.big}>{s.big}</span>
              <span className={styles.statLabel}>{s.label}</span>
            </Reveal>
          ))}
        </div>

        <Reveal className={styles.rosterWrap} delay={120}>
          <span className={styles.rosterTitle}>On the roster</span>
          <ul className={styles.tags}>
            {ROSTER.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  )
}
