import Reveal from './Reveal'
import styles from './Voices.module.css'

const QUOTES = [
  {
    q: 'I stopped sending cold pitches. Three matched brands reached out in my first week — and two became deals.',
    name: 'Aria Vale',
    role: 'Creator · Tech',
    hue: 14,
  },
  {
    q: 'The fit score did the shortlisting for us. We briefed one creator instead of emailing forty.',
    name: 'Priya N.',
    role: 'Brand · Northwind',
    hue: 200,
  },
  {
    q: 'Knowing the money is sitting in escrow changes the whole conversation. No more chasing invoices.',
    name: 'Saffron',
    role: 'Creator · Food',
    hue: 28,
  },
]

export default function Voices() {
  return (
    <section className={styles.root} id="voices">
      <div className={styles.inner}>
        <Reveal className={styles.head}>
          <p className={styles.eyebrow}>Stories</p>
          <h2 className={styles.heading}>
            What both sides <em>say.</em>
          </h2>
        </Reveal>

        <div className={styles.grid}>
          {QUOTES.map((item, i) => (
            <Reveal key={item.name} as="figure" className={styles.card} delay={i * 110}>
              <span className={styles.mark} aria-hidden>
                &ldquo;
              </span>
              <blockquote className={styles.quote}>{item.q}</blockquote>
              <figcaption className={styles.cap}>
                <span
                  className={styles.avatar}
                  aria-hidden
                  style={{
                    background: `radial-gradient(circle at 30% 30%, hsl(${item.hue} 85% 64%), hsl(${item.hue + 24} 70% 42%))`,
                  }}
                />
                <span>
                  <span className={styles.name}>{item.name}</span>
                  <span className={styles.role}>{item.role}</span>
                </span>
              </figcaption>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
