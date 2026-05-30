import Link from 'next/link'
import { MatchMark } from './Nav'
import styles from './Dashboard.module.css'

const MATCHES = [
  { name: 'Aria Vale', handle: '@ariabuilds', fit: 94, tags: ['Tech'], subs: '420k', hue: 14 },
  { name: 'The Ledger', handle: '@theledger', fit: 91, tags: ['Finance'], subs: '240k', hue: 200 },
  { name: 'Lumen', handle: '@lumenglow', fit: 88, tags: ['Beauty'], subs: '780k', hue: 330 },
  { name: 'Pixel Theory', handle: '@pixeltheory', fit: 86, tags: ['Tech', 'Gaming'], subs: '950k', hue: 268 },
]

const INTEREST = [
  { name: 'Northwind Co.', cat: 'Outdoor gear', budget: '$4k–6k', hue: 150 },
  { name: 'Aera Skincare', cat: 'Beauty & wellness', budget: '$3k–5k', hue: 330 },
  { name: 'Bytewave', cat: 'Consumer tech', budget: '$5k–8k', hue: 210 },
]

const STATS = {
  brand: [
    ['18', 'new matches'],
    ['3', 'open deals'],
    ['7', 'unread messages'],
  ],
  creator: [
    ['240', 'profile views'],
    ['5', 'brands interested'],
    ['2', 'open deals'],
  ],
}

function Avatar({ hue, size = 44 }) {
  return (
    <span
      className={styles.avatar}
      style={{
        width: size,
        height: size,
        background: `radial-gradient(circle at 30% 30%, hsl(${hue} 85% 64%), hsl(${hue + 24} 70% 42%))`,
      }}
      aria-hidden
    />
  )
}

export default function Dashboard({ role = 'brand' }) {
  const isBrand = role === 'brand'

  return (
    <div className={styles.root}>
      <header className={styles.bar}>
        <Link href="/" className={styles.brand}>
          <MatchMark className={styles.mark} />
          <span>
            YT<span className={styles.dot}>·</span>Matcher
          </span>
        </Link>
        <div className={styles.barRight}>
          <span className={styles.rolePill}>{isBrand ? 'Brand' : 'Creator'}</span>
          <Link href="/" className={styles.signout}>
            Sign out
          </Link>
        </div>
      </header>

      <main className={styles.main}>
        <div className={styles.greet}>
          <div>
            <p className={styles.eyebrow}>Dashboard</p>
            <h1 className={styles.title}>
              Welcome back{isBrand ? ', Brand' : ', Creator'}.
            </h1>
            <p className={styles.sub}>
              {isBrand
                ? 'Here are the creators that fit your brief this week.'
                : 'Here are the brands lining up to work with you.'}
            </p>
          </div>
          <Link href="/#lab" className={styles.cta}>
            {isBrand ? 'Find more creators' : 'Browse open briefs'} <span aria-hidden>→</span>
          </Link>
        </div>

        <div className={styles.stats}>
          {STATS[role].map(([n, l]) => (
            <div key={l} className={styles.stat}>
              <span className={styles.statN}>{n}</span>
              <span className={styles.statL}>{l}</span>
            </div>
          ))}
        </div>

        <div className={styles.banner}>
          <span className={styles.bannerDot} />
          <p>
            <strong>Escrow is coming soon.</strong> Payments will be held safely until
            work ships — for now, deals run on chat and email.
          </p>
        </div>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>
            {isBrand ? 'Top matches this week' : 'Brands interested in you'}
          </h2>

          {isBrand ? (
            <ul className={styles.cards}>
              {MATCHES.map((c) => (
                <li key={c.handle} className={styles.card}>
                  <div className={styles.cardTop}>
                    <Avatar hue={c.hue} />
                    <div className={styles.who}>
                      <p className={styles.name}>{c.name}</p>
                      <p className={styles.handle}>{c.handle}</p>
                    </div>
                    <span className={styles.fit}>
                      {c.fit}
                      <small>% fit</small>
                    </span>
                  </div>
                  <div className={styles.meta}>
                    <span>{c.subs} subs</span>
                    <span className={styles.tags}>
                      {c.tags.map((t) => (
                        <em key={t}>{t}</em>
                      ))}
                    </span>
                  </div>
                  <Link href="#" className={styles.openDeal}>
                    Open deal →
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <ul className={styles.cards}>
              {INTEREST.map((b) => (
                <li key={b.name} className={styles.card}>
                  <div className={styles.cardTop}>
                    <Avatar hue={b.hue} />
                    <div className={styles.who}>
                      <p className={styles.name}>{b.name}</p>
                      <p className={styles.handle}>{b.cat}</p>
                    </div>
                  </div>
                  <div className={styles.meta}>
                    <span>Budget</span>
                    <strong className={styles.budget}>{b.budget}</strong>
                  </div>
                  <Link href="#" className={styles.openDeal}>
                    View brief →
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>
    </div>
  )
}
